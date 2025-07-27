from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
import qrcode
import base64
from io import BytesIO
from twilio.rest import Client
import re

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///edumanage.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Twilio Configuration
TWILIO_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE = os.getenv('TWILIO_PHONE_NUMBER')

if TWILIO_SID and TWILIO_TOKEN:
    twilio_client = Client(TWILIO_SID, TWILIO_TOKEN)
else:
    twilio_client = None

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.String(20), nullable=False)  # admin, teacher, student, guardian
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    student_id = db.Column(db.String(20), unique=True, nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('class_.id'))
    guardian_id = db.Column(db.Integer, db.ForeignKey('guardian.id'))
    date_of_birth = db.Column(db.Date)
    address = db.Column(db.Text)
    admission_date = db.Column(db.Date, default=lambda: datetime.now(timezone.utc).date())
    qr_code = db.Column(db.Text)
    
    user = db.relationship('User', backref='student_profile')
    class_ = db.relationship('Class', backref='students')
    guardian = db.relationship('Guardian', backref='children')

class Teacher(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    teacher_id = db.Column(db.String(20), unique=True, nullable=False)
    department = db.Column(db.String(100))
    qualification = db.Column(db.String(200))
    hire_date = db.Column(db.Date, default=lambda: datetime.now(timezone.utc).date())
    
    user = db.relationship('User', backref='teacher_profile')

class Guardian(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    relationship_to_student = db.Column(db.String(20))  # father, mother, guardian
    occupation = db.Column(db.String(100))
    
    user = db.relationship('User', backref='guardian_profile')

class Class(db.Model):
    __tablename__ = 'class_'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    grade = db.Column(db.String(10), nullable=False)
    section = db.Column(db.String(10))
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.id'))
    academic_year = db.Column(db.String(10), default='2024-25')
    
    teacher = db.relationship('Teacher', backref='classes')

class Subject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(20), unique=True, nullable=False)
    description = db.Column(db.Text)
    credits = db.Column(db.Integer, default=1)

class ClassSubject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, db.ForeignKey('class_.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.id'), nullable=False)
    
    class_ = db.relationship('Class', backref='class_subjects')
    subject = db.relationship('Subject', backref='subject_classes')
    teacher = db.relationship('Teacher', backref='teaching_subjects')

class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('class_.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(10), default='absent')  # present, absent, late
    marked_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    marked_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    student = db.relationship('Student', backref='attendances')
    class_ = db.relationship('Class', backref='attendances')
    marked_by_user = db.relationship('User', backref='marked_attendances')

class Fee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    academic_year = db.Column(db.String(10), default='2024-25')
    term = db.Column(db.String(20))  # Term 1, Term 2, Term 3
    amount = db.Column(db.Float, nullable=False)
    discount = db.Column(db.Float, default=0)
    final_amount = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    paid_amount = db.Column(db.Float, default=0)
    status = db.Column(db.String(20), default='pending')  # pending, partial, paid, overdue
    payment_date = db.Column(db.Date)
    
    student = db.relationship('Student', backref='fees')

class Grade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('class_.id'), nullable=False)
    exam_type = db.Column(db.String(50))  # midterm, final, quiz, assignment
    marks_obtained = db.Column(db.Float, nullable=False)
    total_marks = db.Column(db.Float, nullable=False)
    grade_letter = db.Column(db.String(5))
    academic_year = db.Column(db.String(10), default='2024-25')
    term = db.Column(db.String(20))
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    student = db.relationship('Student', backref='grades')
    subject = db.relationship('Subject', backref='grades')
    class_ = db.relationship('Class', backref='grades')
    created_by_user = db.relationship('User', backref='created_grades')

class Announcement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    target_audience = db.Column(db.String(50))  # all, students, teachers, guardians, specific_class
    class_id = db.Column(db.Integer, db.ForeignKey('class_.id'))
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    class_ = db.relationship('Class', backref='announcements')
    created_by_user = db.relationship('User', backref='announcements')

# Utility Functions
def generate_qr_code(data):
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/png;base64,{img_str}"

def send_sms(phone, message):
    if not twilio_client or not TWILIO_PHONE:
        print(f"SMS would be sent to {phone}: {message}")
        return True
    
    try:
        # Format phone number
        if not phone.startswith('+'):
            phone = '+1' + re.sub(r'\D', '', phone)
        
        message = twilio_client.messages.create(
            body=message,
            from_=TWILIO_PHONE,
            to=phone
        )
        return True
    except Exception as e:
        print(f"Error sending SMS: {e}")
        return False

def calculate_grade_letter(percentage):
    if percentage >= 90:
        return 'A+'
    elif percentage >= 85:
        return 'A'
    elif percentage >= 80:
        return 'B+'
    elif percentage >= 75:
        return 'B'
    elif percentage >= 70:
        return 'C+'
    elif percentage >= 65:
        return 'C'
    elif percentage >= 60:
        return 'D'
    else:
        return 'F'

# Routes

# Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400
    
    user = User(
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        first_name=data['first_name'],
        last_name=data['last_name'],
        phone=data.get('phone'),
        role=data['role']
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Create role-specific profiles
    if data['role'] == 'student':
        student_id = f"STU{user.id:06d}"
        qr_data = f"student:{user.id}:{student_id}"
        qr_code = generate_qr_code(qr_data)
        
        student = Student(
            user_id=user.id,
            student_id=student_id,
            qr_code=qr_code,
            date_of_birth=datetime.strptime(data.get('date_of_birth'), '%Y-%m-%d').date() if data.get('date_of_birth') else None,
            address=data.get('address')
        )
        db.session.add(student)
    
    elif data['role'] == 'teacher':
        teacher_id = f"TCH{user.id:06d}"
        teacher = Teacher(
            user_id=user.id,
            teacher_id=teacher_id,
            department=data.get('department'),
            qualification=data.get('qualification')
        )
        db.session.add(teacher)
    
    elif data['role'] == 'guardian':
        guardian = Guardian(
            user_id=user.id,
            relationship_to_student=data.get('relationship_to_student'),
            occupation=data.get('occupation')
        )
        db.session.add(guardian)
    
    db.session.commit()
    
    access_token = create_access_token(identity=user.email)
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        if not user.is_active:
            return jsonify({'message': 'Account is disabled'}), 403
        
        access_token = create_access_token(identity=user.email)
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role
            }
        }), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    profile_data = {
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone': user.phone,
        'role': user.role,
        'is_active': user.is_active
    }
    
    # Add role-specific data
    if user.role == 'student' and user.student_profile:
        student = user.student_profile[0]
        profile_data['student_id'] = student.student_id
        profile_data['class_id'] = student.class_id
        profile_data['date_of_birth'] = student.date_of_birth.isoformat() if student.date_of_birth else None
        profile_data['address'] = student.address
        profile_data['qr_code'] = student.qr_code
        
        if student.class_:
            profile_data['class_name'] = f"{student.class_.name} - {student.class_.section}"
    
    elif user.role == 'teacher' and user.teacher_profile:
        teacher = user.teacher_profile[0]
        profile_data['teacher_id'] = teacher.teacher_id
        profile_data['department'] = teacher.department
        profile_data['qualification'] = teacher.qualification
    
    elif user.role == 'guardian' and user.guardian_profile:
        guardian = user.guardian_profile[0]
        profile_data['relationship_to_student'] = guardian.relationship_to_student
        profile_data['occupation'] = guardian.occupation
        profile_data['children'] = [
            {
                'id': child.id,
                'student_id': child.student_id,
                'name': f"{child.user.first_name} {child.user.last_name}",
                'class_name': f"{child.class_.name} - {child.class_.section}" if child.class_ else None
            }
            for child in guardian.children
        ]
    
    return jsonify(profile_data), 200

# Dashboard Routes
@app.route('/api/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    stats = {}
    
    if user.role == 'admin':
        stats = {
            'total_students': Student.query.count(),
            'total_teachers': Teacher.query.count(),
            'total_classes': Class.query.count(),
            'total_subjects': Subject.query.count(),
            'pending_fees': Fee.query.filter_by(status='pending').count(),
            'recent_announcements': len(Announcement.query.filter_by(is_active=True).limit(5).all())
        }
    
    elif user.role == 'teacher':
        teacher = user.teacher_profile[0] if user.teacher_profile else None
        if teacher:
            stats = {
                'my_classes': len(teacher.classes),
                'my_subjects': len(teacher.teaching_subjects),
                'students_count': sum(len(cls.students) for cls in teacher.classes),
                'pending_grades': Grade.query.filter_by(created_by=user.id).filter(
                    Grade.created_at >= datetime.utcnow() - timedelta(days=7)
                ).count()
            }
    
    elif user.role == 'student':
        student = user.student_profile[0] if user.student_profile else None
        if student:
            today = datetime.utcnow().date()
            attendance_this_month = Attendance.query.filter_by(student_id=student.id).filter(
                Attendance.date >= today.replace(day=1)
            ).all()
            
            present_days = len([a for a in attendance_this_month if a.status == 'present'])
            total_days = len(attendance_this_month)
            
            stats = {
                'attendance_percentage': round((present_days / total_days * 100) if total_days > 0 else 0, 1),
                'pending_fees': Fee.query.filter_by(student_id=student.id, status='pending').count(),
                'upcoming_exams': 0,  # Placeholder
                'recent_grades': Grade.query.filter_by(student_id=student.id).limit(5).count()
            }
    
    elif user.role == 'guardian':
        guardian = user.guardian_profile[0] if user.guardian_profile else None
        if guardian and guardian.children:
            total_pending_fees = 0
            total_attendance = 0
            
            for child in guardian.children:
                pending_fees = Fee.query.filter_by(student_id=child.id, status='pending').count()
                total_pending_fees += pending_fees
                
                today = datetime.utcnow().date()
                attendance_this_month = Attendance.query.filter_by(student_id=child.id).filter(
                    Attendance.date >= today.replace(day=1)
                ).all()
                
                present_days = len([a for a in attendance_this_month if a.status == 'present'])
                total_days = len(attendance_this_month)
                child_attendance = (present_days / total_days * 100) if total_days > 0 else 0
                total_attendance += child_attendance
            
            average_attendance = total_attendance / len(guardian.children) if guardian.children else 0
            
            stats = {
                'children_count': len(guardian.children),
                'pending_fees': total_pending_fees,
                'average_attendance': round(average_attendance, 1),
                'recent_announcements': Announcement.query.filter_by(is_active=True).limit(3).count()
            }
    
    return jsonify(stats), 200

# Student Management Routes
@app.route('/api/students', methods=['GET'])
@jwt_required()
def get_students():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    if user.role not in ['admin', 'teacher']:
        return jsonify({'message': 'Unauthorized'}), 403
    
    students = db.session.query(Student).join(User).all()
    
    students_data = []
    for student in students:
        student_data = {
            'id': student.id,
            'student_id': student.student_id,
            'name': f"{student.user.first_name} {student.user.last_name}",
            'email': student.user.email,
            'phone': student.user.phone,
            'class_name': f"{student.class_.name} - {student.class_.section}" if student.class_ else None,
            'class_id': student.class_id,
            'guardian_name': f"{student.guardian.user.first_name} {student.guardian.user.last_name}" if student.guardian else None,
            'admission_date': student.admission_date.isoformat() if student.admission_date else None,
            'is_active': student.user.is_active
        }
        students_data.append(student_data)
    
    return jsonify(students_data), 200

@app.route('/api/students/<int:student_id>', methods=['GET'])
@jwt_required()
def get_student(student_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    student = Student.query.get_or_404(student_id)
    
    # Authorization check
    if user.role == 'guardian':
        guardian = user.guardian_profile[0] if user.guardian_profile else None
        if not guardian or student not in guardian.children:
            return jsonify({'message': 'Unauthorized'}), 403
    elif user.role == 'student':
        user_student = user.student_profile[0] if user.student_profile else None
        if not user_student or user_student.id != student_id:
            return jsonify({'message': 'Unauthorized'}), 403
    elif user.role not in ['admin', 'teacher']:
        return jsonify({'message': 'Unauthorized'}), 403
    
    student_data = {
        'id': student.id,
        'student_id': student.student_id,
        'name': f"{student.user.first_name} {student.user.last_name}",
        'email': student.user.email,
        'phone': student.user.phone,
        'date_of_birth': student.date_of_birth.isoformat() if student.date_of_birth else None,
        'address': student.address,
        'class_id': student.class_id,
        'class_name': f"{student.class_.name} - {student.class_.section}" if student.class_ else None,
        'guardian_id': student.guardian_id,
        'guardian_name': f"{student.guardian.user.first_name} {student.guardian.user.last_name}" if student.guardian else None,
        'guardian_phone': student.guardian.user.phone if student.guardian else None,
        'admission_date': student.admission_date.isoformat() if student.admission_date else None,
        'qr_code': student.qr_code,
        'is_active': student.user.is_active
    }
    
    return jsonify(student_data), 200

# Class Management Routes
@app.route('/api/classes', methods=['GET'])
@jwt_required()
def get_classes():
    classes = Class.query.all()
    
    classes_data = []
    for cls in classes:
        class_data = {
            'id': cls.id,
            'name': cls.name,
            'grade': cls.grade,
            'section': cls.section,
            'teacher_id': cls.teacher_id,
            'teacher_name': f"{cls.teacher.user.first_name} {cls.teacher.user.last_name}" if cls.teacher else None,
            'student_count': len(cls.students),
            'academic_year': cls.academic_year
        }
        classes_data.append(class_data)
    
    return jsonify(classes_data), 200

@app.route('/api/classes', methods=['POST'])
@jwt_required()
def create_class():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    if user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    new_class = Class(
        name=data['name'],
        grade=data['grade'],
        section=data.get('section'),
        teacher_id=data.get('teacher_id'),
        academic_year=data.get('academic_year', '2024-25')
    )
    
    db.session.add(new_class)
    db.session.commit()
    
    return jsonify({'message': 'Class created successfully', 'id': new_class.id}), 201

# Subject Management Routes
@app.route('/api/subjects', methods=['GET'])
@jwt_required()
def get_subjects():
    subjects = Subject.query.all()
    
    subjects_data = []
    for subject in subjects:
        subject_data = {
            'id': subject.id,
            'name': subject.name,
            'code': subject.code,
            'description': subject.description,
            'credits': subject.credits
        }
        subjects_data.append(subject_data)
    
    return jsonify(subjects_data), 200

@app.route('/api/subjects', methods=['POST'])
@jwt_required()
def create_subject():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    if user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    if Subject.query.filter_by(code=data['code']).first():
        return jsonify({'message': 'Subject code already exists'}), 400
    
    new_subject = Subject(
        name=data['name'],
        code=data['code'],
        description=data.get('description'),
        credits=data.get('credits', 1)
    )
    
    db.session.add(new_subject)
    db.session.commit()
    
    return jsonify({'message': 'Subject created successfully', 'id': new_subject.id}), 201

# Attendance Routes
@app.route('/api/attendance', methods=['POST'])
@jwt_required()
def mark_attendance():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    if user.role not in ['admin', 'teacher']:
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    
    # Check if attendance already marked for this date
    existing = Attendance.query.filter_by(
        student_id=data['student_id'],
        class_id=data['class_id'],
        date=date
    ).first()
    
    if existing:
        existing.status = data['status']
        existing.marked_by = user.id
        existing.marked_at = datetime.utcnow()
    else:
        attendance = Attendance(
            student_id=data['student_id'],
            class_id=data['class_id'],
            date=date,
            status=data['status'],
            marked_by=user.id
        )
        db.session.add(attendance)
    
    db.session.commit()
    
    # Send SMS notification for absence
    if data['status'] == 'absent':
        student = Student.query.get(data['student_id'])
        if student and student.guardian and student.guardian.user.phone:
            message = f"Your child {student.user.first_name} {student.user.last_name} was marked absent today ({date}). Please contact the school if this is incorrect."
            send_sms(student.guardian.user.phone, message)
    
    return jsonify({'message': 'Attendance marked successfully'}), 200

@app.route('/api/attendance/<int:student_id>', methods=['GET'])
@jwt_required()
def get_student_attendance(student_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    student = Student.query.get_or_404(student_id)
    
    # Authorization check
    if user.role == 'guardian':
        guardian = user.guardian_profile[0] if user.guardian_profile else None
        if not guardian or student not in guardian.children:
            return jsonify({'message': 'Unauthorized'}), 403
    elif user.role == 'student':
        user_student = user.student_profile[0] if user.student_profile else None
        if not user_student or user_student.id != student_id:
            return jsonify({'message': 'Unauthorized'}), 403
    elif user.role not in ['admin', 'teacher']:
        return jsonify({'message': 'Unauthorized'}), 403
    
    # Get attendance records for the current month
    today = datetime.utcnow().date()
    start_of_month = today.replace(day=1)
    
    attendances = Attendance.query.filter_by(student_id=student_id).filter(
        Attendance.date >= start_of_month
    ).order_by(Attendance.date.desc()).all()
    
    attendance_data = []
    for attendance in attendances:
        attendance_data.append({
            'id': attendance.id,
            'date': attendance.date.isoformat(),
            'status': attendance.status,
            'marked_by': f"{attendance.marked_by_user.first_name} {attendance.marked_by_user.last_name}",
            'marked_at': attendance.marked_at.isoformat()
        })
    
    # Calculate statistics
    total_days = len(attendances)
    present_days = len([a for a in attendances if a.status == 'present'])
    absent_days = len([a for a in attendances if a.status == 'absent'])
    late_days = len([a for a in attendances if a.status == 'late'])
    
    stats = {
        'total_days': total_days,
        'present_days': present_days,
        'absent_days': absent_days,
        'late_days': late_days,
        'attendance_percentage': round((present_days / total_days * 100) if total_days > 0 else 0, 1)
    }
    
    return jsonify({
        'attendance': attendance_data,
        'stats': stats
    }), 200

@app.route('/api/attendance/qr-scan', methods=['POST'])
@jwt_required()
def qr_attendance():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    if user.role not in ['admin', 'teacher']:
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    qr_data = data['qr_data']
    
    # Parse QR code data: "student:user_id:student_id"
    try:
        parts = qr_data.split(':')
        if len(parts) != 3 or parts[0] != 'student':
            return jsonify({'message': 'Invalid QR code'}), 400
        
        user_id = int(parts[1])
        student_id = parts[2]
        
        student = Student.query.filter_by(student_id=student_id, user_id=user_id).first()
        if not student:
            return jsonify({'message': 'Student not found'}), 404
        
        today = datetime.utcnow().date()
        
        # Check if attendance already marked today
        existing = Attendance.query.filter_by(
            student_id=student.id,
            date=today
        ).first()
        
        if existing:
            return jsonify({'message': 'Attendance already marked for today'}), 400
        
        # Mark as present
        attendance = Attendance(
            student_id=student.id,
            class_id=student.class_id,
            date=today,
            status='present',
            marked_by=user.id
        )
        
        db.session.add(attendance)
        db.session.commit()
        
        return jsonify({
            'message': 'Attendance marked successfully',
            'student_name': f"{student.user.first_name} {student.user.last_name}",
            'student_id': student.student_id,
            'status': 'present'
        }), 200
        
    except (ValueError, IndexError):
        return jsonify({'message': 'Invalid QR code format'}), 400

# Fee Management Routes
@app.route('/api/fees/<int:student_id>', methods=['GET'])
@jwt_required()
def get_student_fees(student_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    student = Student.query.get_or_404(student_id)
    
    # Authorization check
    if user.role == 'guardian':
        guardian = user.guardian_profile[0] if user.guardian_profile else None
        if not guardian or student not in guardian.children:
            return jsonify({'message': 'Unauthorized'}), 403
    elif user.role == 'student':
        user_student = user.student_profile[0] if user.student_profile else None
        if not user_student or user_student.id != student_id:
            return jsonify({'message': 'Unauthorized'}), 403
    elif user.role not in ['admin']:
        return jsonify({'message': 'Unauthorized'}), 403
    
    fees = Fee.query.filter_by(student_id=student_id).order_by(Fee.due_date.desc()).all()
    
    fees_data = []
    for fee in fees:
        fee_data = {
            'id': fee.id,
            'academic_year': fee.academic_year,
            'term': fee.term,
            'amount': fee.amount,
            'discount': fee.discount,
            'final_amount': fee.final_amount,
            'paid_amount': fee.paid_amount,
            'balance': fee.final_amount - fee.paid_amount,
            'due_date': fee.due_date.isoformat(),
            'payment_date': fee.payment_date.isoformat() if fee.payment_date else None,
            'status': fee.status
        }
        fees_data.append(fee_data)
    
    # Calculate summary
    total_amount = sum(f.final_amount for f in fees)
    total_paid = sum(f.paid_amount for f in fees)
    total_balance = total_amount - total_paid
    pending_count = len([f for f in fees if f.status in ['pending', 'overdue']])
    
    summary = {
        'total_amount': total_amount,
        'total_paid': total_paid,
        'total_balance': total_balance,
        'pending_count': pending_count
    }
    
    return jsonify({
        'fees': fees_data,
        'summary': summary
    }), 200

@app.route('/api/fees', methods=['POST'])
@jwt_required()
def create_fee():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    if user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    discount = data.get('discount', 0)
    amount = data['amount']
    final_amount = amount - discount
    
    fee = Fee(
        student_id=data['student_id'],
        academic_year=data.get('academic_year', '2024-25'),
        term=data['term'],
        amount=amount,
        discount=discount,
        final_amount=final_amount,
        due_date=datetime.strptime(data['due_date'], '%Y-%m-%d').date()
    )
    
    db.session.add(fee)
    db.session.commit()
    
    # Send fee reminder SMS
    student = Student.query.get(data['student_id'])
    if student and student.guardian and student.guardian.user.phone:
        message = f"Fee reminder: {student.user.first_name} {student.user.last_name} - {data['term']} fee of ${final_amount} is due on {data['due_date']}."
        send_sms(student.guardian.user.phone, message)
    
    return jsonify({'message': 'Fee created successfully', 'id': fee.id}), 201

@app.route('/api/fees/<int:fee_id>/pay', methods=['POST'])
@jwt_required()
def pay_fee():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    if user.role not in ['admin', 'guardian']:
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    fee = Fee.query.get_or_404(data['fee_id'])
    
    # Authorization check for guardian
    if user.role == 'guardian':
        guardian = user.guardian_profile[0] if user.guardian_profile else None
        if not guardian or fee.student not in guardian.children:
            return jsonify({'message': 'Unauthorized'}), 403
    
    payment_amount = data['amount']
    fee.paid_amount += payment_amount
    fee.payment_date = datetime.utcnow().date()
    
    if fee.paid_amount >= fee.final_amount:
        fee.status = 'paid'
    elif fee.paid_amount > 0:
        fee.status = 'partial'
    
    db.session.commit()
    
    return jsonify({'message': 'Payment recorded successfully'}), 200

# Grade Management Routes
@app.route('/api/grades/<int:student_id>', methods=['GET'])
@jwt_required()
def get_student_grades(student_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    student = Student.query.get_or_404(student_id)
    
    # Authorization check
    if user.role == 'guardian':
        guardian = user.guardian_profile[0] if user.guardian_profile else None
        if not guardian or student not in guardian.children:
            return jsonify({'message': 'Unauthorized'}), 403
    elif user.role == 'student':
        user_student = user.student_profile[0] if user.student_profile else None
        if not user_student or user_student.id != student_id:
            return jsonify({'message': 'Unauthorized'}), 403
    elif user.role not in ['admin', 'teacher']:
        return jsonify({'message': 'Unauthorized'}), 403
    
    grades = Grade.query.filter_by(student_id=student_id).order_by(Grade.created_at.desc()).all()
    
    grades_data = []
    for grade in grades:
        percentage = (grade.marks_obtained / grade.total_marks * 100) if grade.total_marks > 0 else 0
        
        grade_data = {
            'id': grade.id,
            'subject_name': grade.subject.name,
            'subject_code': grade.subject.code,
            'exam_type': grade.exam_type,
            'marks_obtained': grade.marks_obtained,
            'total_marks': grade.total_marks,
            'percentage': round(percentage, 1),
            'grade_letter': grade.grade_letter,
            'academic_year': grade.academic_year,
            'term': grade.term,
            'created_at': grade.created_at.isoformat(),
            'created_by': f"{grade.created_by_user.first_name} {grade.created_by_user.last_name}"
        }
        grades_data.append(grade_data)
    
    # Calculate overall statistics
    if grades:
        total_percentage = sum((g.marks_obtained / g.total_marks * 100) for g in grades if g.total_marks > 0)
        average_percentage = total_percentage / len(grades)
        overall_grade = calculate_grade_letter(average_percentage)
    else:
        average_percentage = 0
        overall_grade = 'N/A'
    
    stats = {
        'total_subjects': len(set(g.subject_id for g in grades)),
        'average_percentage': round(average_percentage, 1),
        'overall_grade': overall_grade
    }
    
    return jsonify({
        'grades': grades_data,
        'stats': stats
    }), 200

@app.route('/api/grades', methods=['POST'])
@jwt_required()
def add_grade():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    if user.role not in ['admin', 'teacher']:
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    marks_obtained = data['marks_obtained']
    total_marks = data['total_marks']
    percentage = (marks_obtained / total_marks * 100) if total_marks > 0 else 0
    grade_letter = calculate_grade_letter(percentage)
    
    grade = Grade(
        student_id=data['student_id'],
        subject_id=data['subject_id'],
        class_id=data['class_id'],
        exam_type=data['exam_type'],
        marks_obtained=marks_obtained,
        total_marks=total_marks,
        grade_letter=grade_letter,
        academic_year=data.get('academic_year', '2024-25'),
        term=data.get('term'),
        created_by=user.id
    )
    
    db.session.add(grade)
    db.session.commit()
    
    return jsonify({'message': 'Grade added successfully', 'id': grade.id}), 201

# Announcement Routes
@app.route('/api/announcements', methods=['GET'])
@jwt_required()
def get_announcements():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    query = Announcement.query.filter_by(is_active=True)
    
    # Filter based on user role
    if user.role == 'student':
        student = user.student_profile[0] if user.student_profile else None
        if student:
            query = query.filter(
                (Announcement.target_audience == 'all') |
                (Announcement.target_audience == 'students') |
                ((Announcement.target_audience == 'specific_class') & (Announcement.class_id == student.class_id))
            )
    elif user.role == 'teacher':
        query = query.filter(
            (Announcement.target_audience == 'all') |
            (Announcement.target_audience == 'teachers')
        )
    elif user.role == 'guardian':
        query = query.filter(
            (Announcement.target_audience == 'all') |
            (Announcement.target_audience == 'guardians')
        )
    
    announcements = query.order_by(Announcement.created_at.desc()).all()
    
    announcements_data = []
    for announcement in announcements:
        announcement_data = {
            'id': announcement.id,
            'title': announcement.title,
            'content': announcement.content,
            'target_audience': announcement.target_audience,
            'class_name': f"{announcement.class_.name} - {announcement.class_.section}" if announcement.class_ else None,
            'created_by': f"{announcement.created_by_user.first_name} {announcement.created_by_user.last_name}",
            'created_at': announcement.created_at.isoformat()
        }
        announcements_data.append(announcement_data)
    
    return jsonify(announcements_data), 200

@app.route('/api/announcements', methods=['POST'])
@jwt_required()
def create_announcement():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    if user.role not in ['admin', 'teacher']:
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    announcement = Announcement(
        title=data['title'],
        content=data['content'],
        target_audience=data['target_audience'],
        class_id=data.get('class_id'),
        created_by=user.id
    )
    
    db.session.add(announcement)
    db.session.commit()
    
    return jsonify({'message': 'Announcement created successfully', 'id': announcement.id}), 201

# Profile Update Routes
@app.route('/api/profile/update', methods=['PUT'])
@jwt_required()
def update_profile():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    data = request.get_json()
    
    # Update user data
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.phone = data.get('phone', user.phone)
    user.updated_at = datetime.utcnow()
    
    # Update role-specific data
    if user.role == 'student' and user.student_profile:
        student = user.student_profile[0]
        if 'address' in data:
            student.address = data['address']
        if 'date_of_birth' in data:
            student.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
    
    elif user.role == 'teacher' and user.teacher_profile:
        teacher = user.teacher_profile[0]
        if 'department' in data:
            teacher.department = data['department']
        if 'qualification' in data:
            teacher.qualification = data['qualification']
    
    elif user.role == 'guardian' and user.guardian_profile:
        guardian = user.guardian_profile[0]
        if 'occupation' in data:
            guardian.occupation = data['occupation']
        if 'relationship_to_student' in data:
            guardian.relationship_to_student = data['relationship_to_student']
    
    db.session.commit()
    
    return jsonify({'message': 'Profile updated successfully'}), 200

# Teacher specific routes
@app.route('/api/teachers', methods=['GET'])
@jwt_required()
def get_teachers():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    
    if user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    teachers = db.session.query(Teacher).join(User).all()
    
    teachers_data = []
    for teacher in teachers:
        teacher_data = {
            'id': teacher.id,
            'teacher_id': teacher.teacher_id,
            'name': f"{teacher.user.first_name} {teacher.user.last_name}",
            'email': teacher.user.email,
            'phone': teacher.user.phone,
            'department': teacher.department,
            'qualification': teacher.qualification,
            'hire_date': teacher.hire_date.isoformat() if teacher.hire_date else None,
            'classes_count': len(teacher.classes),
            'subjects_count': len(teacher.teaching_subjects),
            'is_active': teacher.user.is_active
        }
        teachers_data.append(teacher_data)
    
    return jsonify(teachers_data), 200

# Database initialization
def create_tables():
    db.create_all()
    
    # Create default admin user if not exists
    if not User.query.filter_by(email='admin@edumanage.com').first():
        admin_user = User(
            email='admin@edumanage.com',
            password_hash=generate_password_hash('admin123'),
            first_name='System',
            last_name='Administrator',
            role='admin'
        )
        db.session.add(admin_user)
        db.session.commit()

if __name__ == '__main__':
    # Tables are created using init_db.py
    app.run(debug=True, host='0.0.0.0', port=5000)