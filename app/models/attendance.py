from datetime import datetime, timezone
from app import db

class Attendance(db.Model):
    __tablename__ = 'attendance'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.now(timezone.utc).date)
    status = db.Column(db.Enum('present', 'absent', 'late', 'excused', name='attendance_status'), 
                      nullable=False, default='present')
    check_in_time = db.Column(db.Time)
    check_out_time = db.Column(db.Time)
    notes = db.Column(db.Text)
    marked_by = db.Column(db.Integer, db.ForeignKey('users.id'))  # Teacher who marked attendance
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'))  # For subject-specific attendance
    period = db.Column(db.String(20))  # Morning, Afternoon, Period 1, etc.
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    marked_by_user = db.relationship('User', foreign_keys=[marked_by])
    subject = db.relationship('Subject')
    
    # Unique constraint to prevent duplicate attendance records
    __table_args__ = (db.UniqueConstraint('student_id', 'date', 'period', 'subject_id', 
                                         name='unique_attendance_record'),)
    
    def __init__(self, student_id, date=None, status='present', check_in_time=None, 
                 check_out_time=None, notes=None, marked_by=None, subject_id=None, period=None):
        self.student_id = student_id
        self.date = date or datetime.now(timezone.utc).date()
        self.status = status
        self.check_in_time = check_in_time
        self.check_out_time = check_out_time
        self.notes = notes
        self.marked_by = marked_by
        self.subject_id = subject_id
        self.period = period
    
    @property
    def is_present(self):
        return self.status == 'present'
    
    @property
    def duration_hours(self):
        """Calculate duration between check-in and check-out"""
        if self.check_in_time and self.check_out_time:
            check_in = datetime.combine(self.date, self.check_in_time)
            check_out = datetime.combine(self.date, self.check_out_time)
            duration = check_out - check_in
            return round(duration.total_seconds() / 3600, 2)
        return None
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'date': self.date.isoformat() if self.date else None,
            'status': self.status,
            'check_in_time': self.check_in_time.strftime('%H:%M:%S') if self.check_in_time else None,
            'check_out_time': self.check_out_time.strftime('%H:%M:%S') if self.check_out_time else None,
            'duration_hours': self.duration_hours,
            'notes': self.notes,
            'marked_by': self.marked_by,
            'subject_id': self.subject_id,
            'period': self.period,
            'is_present': self.is_present,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Attendance {self.student_id} - {self.date} - {self.status}>'