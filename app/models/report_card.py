from datetime import datetime, timezone
from app import db

class ReportCard(db.Model):
    __tablename__ = 'report_cards'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    academic_year = db.Column(db.String(9), nullable=False)
    semester = db.Column(db.Enum('first', 'second', 'full_year', name='semester_types'), 
                        default='full_year')
    overall_gpa = db.Column(db.Float, default=0.0)
    overall_grade = db.Column(db.String(5))  # A, B, C, D, F
    rank_in_class = db.Column(db.Integer)
    total_students_in_class = db.Column(db.Integer)
    attendance_percentage = db.Column(db.Float, default=0.0)
    total_days = db.Column(db.Integer, default=0)
    days_present = db.Column(db.Integer, default=0)
    days_absent = db.Column(db.Integer, default=0)
    teacher_comments = db.Column(db.Text)
    principal_comments = db.Column(db.Text)
    parent_comments = db.Column(db.Text)
    behavior_grade = db.Column(db.String(5))  # Excellent, Good, Satisfactory, Needs Improvement
    conduct_points = db.Column(db.Integer, default=100)
    extracurricular_activities = db.Column(db.Text)
    achievements = db.Column(db.Text)
    areas_for_improvement = db.Column(db.Text)
    next_term_begins = db.Column(db.Date)
    is_promoted = db.Column(db.Boolean, default=False)
    is_published = db.Column(db.Boolean, default=False)
    published_date = db.Column(db.Date)
    generated_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    generator = db.relationship('User', foreign_keys=[generated_by])
    
    def __init__(self, student_id, academic_year, semester='full_year', generated_by=None):
        self.student_id = student_id
        self.academic_year = academic_year
        self.semester = semester
        self.generated_by = generated_by
        self.calculate_metrics()
    
    def calculate_metrics(self):
        """Calculate GPA, attendance, and other metrics"""
        from app.models.grade import Grade
        from app.models.attendance import Attendance
        
        # Calculate GPA
        grades = Grade.query.filter_by(
            student_id=self.student_id,
            is_published=True
        ).join(Grade.subject).filter_by(academic_year=self.academic_year).all()
        
        if grades:
            total_grade_points = sum([g.grade_value * g.subject.credits for g in grades if g.grade_value])
            total_credits = sum([g.subject.credits for g in grades])
            self.overall_gpa = round(total_grade_points / total_credits, 2) if total_credits > 0 else 0.0
            self.overall_grade = self.calculate_letter_grade(self.overall_gpa)
        
        # Calculate attendance
        attendance_records = Attendance.query.filter_by(student_id=self.student_id).all()
        if attendance_records:
            self.total_days = len(attendance_records)
            self.days_present = len([a for a in attendance_records if a.status in ['present', 'late']])
            self.days_absent = self.total_days - self.days_present
            self.attendance_percentage = round((self.days_present / self.total_days) * 100, 2) if self.total_days > 0 else 0.0
    
    def calculate_letter_grade(self, gpa):
        """Calculate letter grade based on GPA"""
        if gpa >= 90:
            return 'A'
        elif gpa >= 80:
            return 'B'
        elif gpa >= 70:
            return 'C'
        elif gpa >= 60:
            return 'D'
        else:
            return 'F'
    
    def calculate_rank(self):
        """Calculate student rank in class"""
        if self.student.class_id:
            # Get all report cards for students in the same class
            class_report_cards = ReportCard.query.join(ReportCard.student).filter(
                ReportCard.academic_year == self.academic_year,
                ReportCard.semester == self.semester,
                ReportCard.student.has(class_id=self.student.class_id)
            ).order_by(ReportCard.overall_gpa.desc()).all()
            
            self.total_students_in_class = len(class_report_cards)
            for i, report_card in enumerate(class_report_cards, 1):
                if report_card.id == self.id:
                    self.rank_in_class = i
                    break
    
    def publish(self):
        """Publish the report card"""
        self.calculate_metrics()
        self.calculate_rank()
        self.is_published = True
        self.published_date = datetime.now(timezone.utc).date()
    
    @property
    def academic_status(self):
        """Get academic status based on GPA"""
        if self.overall_gpa >= 85:
            return 'Excellent'
        elif self.overall_gpa >= 75:
            return 'Good'
        elif self.overall_gpa >= 65:
            return 'Satisfactory'
        elif self.overall_gpa >= 50:
            return 'Needs Improvement'
        else:
            return 'Unsatisfactory'
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'academic_year': self.academic_year,
            'semester': self.semester,
            'overall_gpa': self.overall_gpa,
            'overall_grade': self.overall_grade,
            'academic_status': self.academic_status,
            'rank_in_class': self.rank_in_class,
            'total_students_in_class': self.total_students_in_class,
            'attendance_percentage': self.attendance_percentage,
            'total_days': self.total_days,
            'days_present': self.days_present,
            'days_absent': self.days_absent,
            'teacher_comments': self.teacher_comments,
            'principal_comments': self.principal_comments,
            'parent_comments': self.parent_comments,
            'behavior_grade': self.behavior_grade,
            'conduct_points': self.conduct_points,
            'extracurricular_activities': self.extracurricular_activities,
            'achievements': self.achievements,
            'areas_for_improvement': self.areas_for_improvement,
            'next_term_begins': self.next_term_begins.isoformat() if self.next_term_begins else None,
            'is_promoted': self.is_promoted,
            'is_published': self.is_published,
            'published_date': self.published_date.isoformat() if self.published_date else None,
            'generated_by': self.generated_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<ReportCard {self.student_id} - {self.academic_year} - {self.semester}>'