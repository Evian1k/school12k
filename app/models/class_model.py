from datetime import datetime, timezone
from app import db

class Class(db.Model):
    __tablename__ = 'classes'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    grade_level = db.Column(db.String(20), nullable=False)
    academic_year = db.Column(db.String(9), nullable=False)  # e.g., "2023-2024"
    description = db.Column(db.Text)
    max_students = db.Column(db.Integer, default=30)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    students = db.relationship('Student', backref='class_ref', lazy='dynamic')
    subjects = db.relationship('Subject', backref='class_ref', lazy='dynamic')
    
    def __init__(self, name, grade_level, academic_year, description=None, max_students=30):
        self.name = name
        self.grade_level = grade_level
        self.academic_year = academic_year
        self.description = description
        self.max_students = max_students
    
    @property
    def current_students_count(self):
        return self.students.filter_by(is_active=True).count()
    
    @property
    def available_spots(self):
        return self.max_students - self.current_students_count
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'grade_level': self.grade_level,
            'academic_year': self.academic_year,
            'description': self.description,
            'max_students': self.max_students,
            'current_students_count': self.current_students_count,
            'available_spots': self.available_spots,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Class {self.name} ({self.grade_level})>'