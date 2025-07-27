from datetime import datetime, timezone
from app import db

class Subject(db.Model):
    __tablename__ = 'subjects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(20), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)
    credits = db.Column(db.Integer, default=1)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'))
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'))
    academic_year = db.Column(db.String(9), nullable=False)
    semester = db.Column(db.Enum('first', 'second', 'full_year', name='semester_types'), default='full_year')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    grades = db.relationship('Grade', backref='subject', lazy='dynamic', cascade='all, delete-orphan')
    
    def __init__(self, name, code, academic_year, teacher_id=None, class_id=None, 
                 description=None, credits=1, semester='full_year'):
        self.name = name
        self.code = code
        self.academic_year = academic_year
        self.teacher_id = teacher_id
        self.class_id = class_id
        self.description = description
        self.credits = credits
        self.semester = semester
    
    def get_average_grade(self):
        """Calculate average grade for this subject"""
        grades = self.grades.filter(Grade.grade_value.isnot(None)).all()
        if not grades:
            return 0.0
        return round(sum([grade.grade_value for grade in grades]) / len(grades), 2)
    
    def get_student_count(self):
        """Get number of students enrolled in this subject"""
        if self.class_id:
            return self.class_ref.current_students_count
        return 0
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'description': self.description,
            'credits': self.credits,
            'teacher_id': self.teacher_id,
            'class_id': self.class_id,
            'academic_year': self.academic_year,
            'semester': self.semester,
            'average_grade': self.get_average_grade(),
            'student_count': self.get_student_count(),
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Subject {self.code}: {self.name}>'