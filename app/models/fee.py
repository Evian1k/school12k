from datetime import datetime, timezone
from app import db

class Fee(db.Model):
    __tablename__ = 'fees'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    fee_type = db.Column(db.Enum('tuition', 'library', 'laboratory', 'sports', 'transportation', 
                                'exam', 'miscellaneous', name='fee_types'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    paid_date = db.Column(db.Date)
    paid_amount = db.Column(db.Numeric(10, 2), default=0.0)
    status = db.Column(db.Enum('pending', 'paid', 'partial', 'overdue', name='fee_status'), 
                      default='pending')
    academic_year = db.Column(db.String(9), nullable=False)
    semester = db.Column(db.Enum('first', 'second', 'full_year', name='semester_types'), 
                        default='full_year')
    description = db.Column(db.String(200))
    payment_method = db.Column(db.String(50))  # Cash, Card, Bank Transfer, etc.
    transaction_id = db.Column(db.String(100))
    late_fee = db.Column(db.Numeric(10, 2), default=0.0)
    discount = db.Column(db.Numeric(10, 2), default=0.0)
    notes = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    processed_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    creator = db.relationship('User', foreign_keys=[created_by])
    processor = db.relationship('User', foreign_keys=[processed_by])
    
    def __init__(self, student_id, fee_type, amount, due_date, academic_year, 
                 semester='full_year', description=None, created_by=None):
        self.student_id = student_id
        self.fee_type = fee_type
        self.amount = amount
        self.due_date = due_date
        self.academic_year = academic_year
        self.semester = semester
        self.description = description
        self.created_by = created_by
        self.update_status()
    
    def update_status(self):
        """Update fee status based on payment and due date"""
        today = datetime.now(timezone.utc).date()
        
        if self.paid_amount >= self.total_amount:
            self.status = 'paid'
        elif self.paid_amount > 0:
            self.status = 'partial'
        elif today > self.due_date:
            self.status = 'overdue'
        else:
            self.status = 'pending'
    
    @property
    def total_amount(self):
        """Calculate total amount including late fees minus discounts"""
        return float(self.amount + self.late_fee - self.discount)
    
    @property
    def balance_due(self):
        """Calculate remaining balance"""
        return max(0, self.total_amount - float(self.paid_amount or 0))
    
    @property
    def is_overdue(self):
        """Check if fee is overdue"""
        return datetime.now(timezone.utc).date() > self.due_date and self.status != 'paid'
    
    @property
    def days_overdue(self):
        """Calculate days overdue"""
        if self.is_overdue:
            return (datetime.now(timezone.utc).date() - self.due_date).days
        return 0
    
    def make_payment(self, amount, payment_method=None, transaction_id=None, processed_by=None):
        """Process a payment for this fee"""
        self.paid_amount = (self.paid_amount or 0) + amount
        self.payment_method = payment_method
        self.transaction_id = transaction_id
        self.processed_by = processed_by
        
        if not self.paid_date and self.paid_amount > 0:
            self.paid_date = datetime.now(timezone.utc).date()
        
        self.update_status()
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'fee_type': self.fee_type,
            'amount': float(self.amount),
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'paid_date': self.paid_date.isoformat() if self.paid_date else None,
            'paid_amount': float(self.paid_amount or 0),
            'total_amount': self.total_amount,
            'balance_due': self.balance_due,
            'status': self.status,
            'academic_year': self.academic_year,
            'semester': self.semester,
            'description': self.description,
            'payment_method': self.payment_method,
            'transaction_id': self.transaction_id,
            'late_fee': float(self.late_fee),
            'discount': float(self.discount),
            'is_overdue': self.is_overdue,
            'days_overdue': self.days_overdue,
            'notes': self.notes,
            'created_by': self.created_by,
            'processed_by': self.processed_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Fee {self.fee_type} - {self.amount} for Student {self.student_id}>'