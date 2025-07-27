from flask import Blueprint, request
from app import db
from app.models.teacher import Teacher
from app.models.user import User
from app.models.subject import Subject
from app.models.grade import Grade
from app.models.attendance import Attendance
from app.models.student import Student
from app.utils.auth import require_role, require_same_user_or_role, get_current_user
from app.utils.helpers import format_response, format_error_response, paginate_query
from app.utils.validators import validate_required_fields

teacher_bp = Blueprint('teacher', __name__)

@teacher_bp.route('', methods=['GET'])
@require_role('admin', 'teacher')
def get_teachers():
    """Get all teachers with pagination"""
    try:
        query = Teacher.query.filter_by(is_active=True).join(Teacher.user)
        
        # Filter by department
        department = request.args.get('department')
        if department:
            query = query.filter_by(department=department)
        
        # Search functionality
        search = request.args.get('search')
        if search:
            query = query.filter(
                db.or_(
                    Teacher.employee_id.ilike(f'%{search}%'),
                    User.first_name.ilike(f'%{search}%'),
                    User.last_name.ilike(f'%{search}%'),
                    User.email.ilike(f'%{search}%')
                )
            )
        
        query = query.order_by(User.last_name, User.first_name)
        result = paginate_query(query)
        
        # Enhance with user data
        for item in result.get('items', []):
            teacher = Teacher.query.get(item['id'])
            if teacher and teacher.user:
                item['user'] = teacher.user.to_dict()
        
        return format_response(result, "Teachers retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get teachers: {str(e)}", status_code=500)

@teacher_bp.route('/<int:teacher_id>', methods=['GET'])
@require_same_user_or_role('admin', 'teacher')
def get_teacher(teacher_id):
    """Get specific teacher by ID"""
    try:
        teacher = Teacher.query.get_or_404(teacher_id)
        teacher_data = teacher.to_dict()
        
        if teacher.user:
            teacher_data['user'] = teacher.user.to_dict()
        
        # Add subjects taught
        subjects_data = []
        for subject in teacher.subjects:
            subject_info = subject.to_dict()
            if subject.class_ref:
                subject_info['class'] = subject.class_ref.to_dict()
            subjects_data.append(subject_info)
        teacher_data['subjects'] = subjects_data
        
        return format_response(teacher_data, "Teacher retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get teacher: {str(e)}", status_code=500)

@teacher_bp.route('/<int:teacher_id>/subjects', methods=['GET'])
@require_same_user_or_role('admin', 'teacher')
def get_teacher_subjects(teacher_id):
    """Get subjects taught by teacher"""
    try:
        teacher = Teacher.query.get_or_404(teacher_id)
        current_user = get_current_user()
        
        # Check if teacher is accessing their own data
        if current_user.role == 'teacher' and teacher.user_id != current_user.id:
            return format_error_response("Access denied", status_code=403)
        
        subjects = teacher.subjects.filter_by(is_active=True).all()
        subjects_data = []
        
        for subject in subjects:
            subject_dict = subject.to_dict()
            if subject.class_ref:
                subject_dict['class'] = subject.class_ref.to_dict()
            subjects_data.append(subject_dict)
        
        return format_response(subjects_data, "Teacher subjects retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get teacher subjects: {str(e)}", status_code=500)

@teacher_bp.route('/<int:teacher_id>/students', methods=['GET'])
@require_same_user_or_role('admin', 'teacher')
def get_teacher_students(teacher_id):
    """Get students taught by teacher"""
    try:
        teacher = Teacher.query.get_or_404(teacher_id)
        current_user = get_current_user()
        
        # Check if teacher is accessing their own data
        if current_user.role == 'teacher' and teacher.user_id != current_user.id:
            return format_error_response("Access denied", status_code=403)
        
        # Get all students from classes where teacher teaches subjects
        students = db.session.query(Student).join(
            Subject, Student.class_id == Subject.class_id
        ).filter(
            Subject.teacher_id == teacher_id,
            Subject.is_active == True,
            Student.is_active == True
        ).distinct().all()
        
        students_data = []
        for student in students:
            student_dict = student.to_dict()
            if student.user:
                student_dict['user'] = student.user.to_dict()
            if student.class_ref:
                student_dict['class'] = student.class_ref.to_dict()
            students_data.append(student_dict)
        
        return format_response(students_data, "Teacher students retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get teacher students: {str(e)}", status_code=500)

@teacher_bp.route('/mark-attendance', methods=['POST'])
@require_role('teacher')
def mark_attendance():
    """Mark attendance for students"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        teacher = current_user.teacher_profile
        
        if not teacher:
            return format_error_response("Teacher profile not found", status_code=404)
        
        # Validate required fields
        required_fields = ['attendance_records']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        attendance_records = data['attendance_records']
        if not isinstance(attendance_records, list):
            return format_error_response("attendance_records must be a list", status_code=400)
        
        created_records = []
        
        for record_data in attendance_records:
            # Validate each record
            record_required = ['student_id', 'date', 'status']
            is_valid, error_msg = validate_required_fields(record_data, record_required)
            if not is_valid:
                return format_error_response(f"Invalid attendance record: {error_msg}", status_code=400)
            
            # Check if attendance already exists
            existing_attendance = Attendance.query.filter_by(
                student_id=record_data['student_id'],
                date=record_data['date'],
                subject_id=record_data.get('subject_id'),
                period=record_data.get('period')
            ).first()
            
            if existing_attendance:
                # Update existing record
                existing_attendance.status = record_data['status']
                existing_attendance.notes = record_data.get('notes')
                existing_attendance.marked_by = current_user.id
                created_records.append(existing_attendance)
            else:
                # Create new record
                attendance = Attendance(
                    student_id=record_data['student_id'],
                    date=record_data['date'],
                    status=record_data['status'],
                    check_in_time=record_data.get('check_in_time'),
                    check_out_time=record_data.get('check_out_time'),
                    notes=record_data.get('notes'),
                    marked_by=current_user.id,
                    subject_id=record_data.get('subject_id'),
                    period=record_data.get('period')
                )
                db.session.add(attendance)
                created_records.append(attendance)
        
        db.session.commit()
        
        result = [record.to_dict() for record in created_records]
        return format_response(result, f"Successfully marked attendance for {len(created_records)} records")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to mark attendance: {str(e)}", status_code=500)

@teacher_bp.route('/assign-grade', methods=['POST'])
@require_role('teacher')
def assign_grade():
    """Assign grade to student"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        teacher = current_user.teacher_profile
        
        if not teacher:
            return format_error_response("Teacher profile not found", status_code=404)
        
        # Validate required fields
        required_fields = ['student_id', 'subject_id', 'grade_type']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        # Verify teacher teaches this subject
        subject = Subject.query.filter_by(
            id=data['subject_id'],
            teacher_id=teacher.id,
            is_active=True
        ).first()
        
        if not subject:
            return format_error_response("You are not authorized to grade this subject", status_code=403)
        
        # Create grade
        grade = Grade(
            student_id=data['student_id'],
            subject_id=data['subject_id'],
            teacher_id=teacher.id,
            grade_type=data['grade_type'],
            assignment_name=data.get('assignment_name'),
            grade_value=data.get('grade_value'),
            max_points=data.get('max_points', 100.0),
            earned_points=data.get('earned_points'),
            weight=data.get('weight', 1.0),
            due_date=data.get('due_date'),
            comments=data.get('comments')
        )
        
        db.session.add(grade)
        db.session.commit()
        
        return format_response(grade.to_dict(), "Grade assigned successfully", status_code=201)
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to assign grade: {str(e)}", status_code=500)

@teacher_bp.route('/grades/<int:grade_id>/publish', methods=['PATCH'])
@require_role('teacher')
def publish_grade(grade_id):
    """Publish a grade to make it visible to students/parents"""
    try:
        current_user = get_current_user()
        teacher = current_user.teacher_profile
        
        if not teacher:
            return format_error_response("Teacher profile not found", status_code=404)
        
        grade = Grade.query.filter_by(id=grade_id, teacher_id=teacher.id).first()
        
        if not grade:
            return format_error_response("Grade not found or access denied", status_code=404)
        
        grade.is_published = True
        db.session.commit()
        
        return format_response(grade.to_dict(), "Grade published successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to publish grade: {str(e)}", status_code=500)