from datetime import datetime, timezone
from app import db

class Teacher(db.Model):
    __tablename__ = 'teachers'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    employee_id = db.Column(db.String(20), unique=True, nullable=False, index=True)
    department = db.Column(db.String(100))
    hire_date = db.Column(db.Date, default=datetime.now(timezone.utc).date)
    qualification = db.Column(db.String(200))
    experience_years = db.Column(db.Integer, default=0)
    specialization = db.Column(db.String(100))
    salary = db.Column(db.Numeric(10, 2))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    subjects = db.relationship('Subject', backref='teacher', lazy='dynamic')
    grades_given = db.relationship('Grade', backref='teacher', lazy='dynamic')
    
    def __init__(self, user_id, employee_id, department=None, qualification=None, 
                 experience_years=0, specialization=None, salary=None):
        self.user_id = user_id
        self.employee_id = employee_id
        self.department = department
        self.qualification = qualification
        self.experience_years = experience_years
        self.specialization = specialization
        self.salary = salary
    
    def get_subjects_taught(self):
        """Get list of subjects taught by this teacher"""
        return [subject.name for subject in self.subjects.all()]
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'employee_id': self.employee_id,
            'department': self.department,
            'hire_date': self.hire_date.isoformat() if self.hire_date else None,
            'qualification': self.qualification,
            'experience_years': self.experience_years,
            'specialization': self.specialization,
            'salary': float(self.salary) if self.salary else None,
            'subjects_taught': self.get_subjects_taught(),
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Teacher {self.employee_id}>'