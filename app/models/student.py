from datetime import datetime, timezone
from app import db

# Association table for parent-student many-to-many relationship
parent_student = db.Table('parent_student',
    db.Column('parent_id', db.Integer, db.ForeignKey('parents.id'), primary_key=True),
    db.Column('student_id', db.Integer, db.ForeignKey('students.id'), primary_key=True)
)

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    student_id = db.Column(db.String(20), unique=True, nullable=False, index=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'))
    date_of_birth = db.Column(db.Date)
    enrollment_date = db.Column(db.Date, default=datetime.now(timezone.utc).date)
    emergency_contact = db.Column(db.String(100))
    emergency_phone = db.Column(db.String(20))
    medical_info = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    parents = db.relationship('Parent', secondary=parent_student, backref='children', lazy='dynamic')
    grades = db.relationship('Grade', backref='student', lazy='dynamic', cascade='all, delete-orphan')
    attendance_records = db.relationship('Attendance', backref='student', lazy='dynamic', cascade='all, delete-orphan')
    fees = db.relationship('Fee', backref='student', lazy='dynamic', cascade='all, delete-orphan')
    report_cards = db.relationship('ReportCard', backref='student', lazy='dynamic', cascade='all, delete-orphan')
    
    def __init__(self, user_id, student_id, date_of_birth=None, emergency_contact=None, 
                 emergency_phone=None, medical_info=None, class_id=None):
        self.user_id = user_id
        self.student_id = student_id
        self.date_of_birth = date_of_birth
        self.emergency_contact = emergency_contact
        self.emergency_phone = emergency_phone
        self.medical_info = medical_info
        self.class_id = class_id
    
    @property
    def age(self):
        if self.date_of_birth:
            today = datetime.now(timezone.utc).date()
            return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        return None
    
    def get_current_gpa(self):
        """Calculate current GPA based on grades"""
        grades = self.grades.all()
        if not grades:
            return 0.0
        
        total_points = sum([grade.grade_value for grade in grades if grade.grade_value])
        return round(total_points / len(grades), 2) if grades else 0.0
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'student_id': self.student_id,
            'class_id': self.class_id,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'age': self.age,
            'enrollment_date': self.enrollment_date.isoformat() if self.enrollment_date else None,
            'emergency_contact': self.emergency_contact,
            'emergency_phone': self.emergency_phone,
            'medical_info': self.medical_info,
            'current_gpa': self.get_current_gpa(),
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Student {self.student_id}>'