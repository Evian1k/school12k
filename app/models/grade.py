from datetime import datetime, timezone
from app import db

class Grade(db.Model):
    __tablename__ = 'grades'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'), nullable=False)
    grade_value = db.Column(db.Float)  # Numeric grade (0-100)
    letter_grade = db.Column(db.String(5))  # A, B, C, D, F, etc.
    grade_type = db.Column(db.Enum('assignment', 'quiz', 'exam', 'project', 'participation', name='grade_types'), nullable=False)
    assignment_name = db.Column(db.String(100))
    max_points = db.Column(db.Float, default=100.0)
    earned_points = db.Column(db.Float)
    weight = db.Column(db.Float, default=1.0)  # Weight for calculating overall grade
    graded_date = db.Column(db.Date, default=datetime.now(timezone.utc).date)
    due_date = db.Column(db.Date)
    comments = db.Column(db.Text)
    is_published = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def __init__(self, student_id, subject_id, teacher_id, grade_type, assignment_name=None, 
                 grade_value=None, max_points=100.0, earned_points=None, weight=1.0, 
                 due_date=None, comments=None):
        self.student_id = student_id
        self.subject_id = subject_id
        self.teacher_id = teacher_id
        self.grade_type = grade_type
        self.assignment_name = assignment_name
        self.grade_value = grade_value
        self.max_points = max_points
        self.earned_points = earned_points
        self.weight = weight
        self.due_date = due_date
        self.comments = comments
        
        # Auto-calculate grade_value and letter_grade if earned_points is provided
        if earned_points is not None and max_points > 0:
            self.grade_value = round((earned_points / max_points) * 100, 2)
            self.letter_grade = self.calculate_letter_grade()
    
    def calculate_letter_grade(self):
        """Calculate letter grade based on numeric grade"""
        if self.grade_value is None:
            return None
        
        if self.grade_value >= 90:
            return 'A'
        elif self.grade_value >= 80:
            return 'B'
        elif self.grade_value >= 70:
            return 'C'
        elif self.grade_value >= 60:
            return 'D'
        else:
            return 'F'
    
    @property
    def percentage(self):
        """Get percentage score"""
        if self.earned_points is not None and self.max_points > 0:
            return round((self.earned_points / self.max_points) * 100, 2)
        return self.grade_value
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'subject_id': self.subject_id,
            'teacher_id': self.teacher_id,
            'grade_value': self.grade_value,
            'letter_grade': self.letter_grade,
            'grade_type': self.grade_type,
            'assignment_name': self.assignment_name,
            'max_points': self.max_points,
            'earned_points': self.earned_points,
            'percentage': self.percentage,
            'weight': self.weight,
            'graded_date': self.graded_date.isoformat() if self.graded_date else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'comments': self.comments,
            'is_published': self.is_published,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Grade {self.grade_value or self.letter_grade} for Student {self.student_id}>'