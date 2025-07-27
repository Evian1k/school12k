from datetime import datetime, timezone
from app import db

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    notification_type = db.Column(db.Enum('general', 'academic', 'event', 'emergency', 'fee', 
                                         'attendance', 'grade', name='notification_types'), 
                                 default='general')
    priority = db.Column(db.Enum('low', 'medium', 'high', 'urgent', name='priority_levels'), 
                        default='medium')
    target_audience = db.Column(db.Enum('all', 'students', 'parents', 'teachers', 'admins', 
                                       'specific_class', 'specific_users', name='audience_types'), 
                               default='all')
    target_class_id = db.Column(db.Integer, db.ForeignKey('classes.id'))  # For class-specific notifications
    is_active = db.Column(db.Boolean, default=True)
    is_read_required = db.Column(db.Boolean, default=False)  # Requires acknowledgment
    expires_at = db.Column(db.DateTime)
    sent_at = db.Column(db.DateTime)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    attachment_url = db.Column(db.String(500))
    action_url = db.Column(db.String(500))  # URL for action button
    action_text = db.Column(db.String(50))  # Text for action button
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    creator = db.relationship('User', foreign_keys=[created_by])
    target_class = db.relationship('Class', foreign_keys=[target_class_id])
    read_receipts = db.relationship('NotificationReceipt', backref='notification', 
                                   lazy='dynamic', cascade='all, delete-orphan')
    
    def __init__(self, title, message, created_by, notification_type='general', 
                 priority='medium', target_audience='all', target_class_id=None, 
                 is_read_required=False, expires_at=None, attachment_url=None, 
                 action_url=None, action_text=None):
        self.title = title
        self.message = message
        self.created_by = created_by
        self.notification_type = notification_type
        self.priority = priority
        self.target_audience = target_audience
        self.target_class_id = target_class_id
        self.is_read_required = is_read_required
        self.expires_at = expires_at
        self.attachment_url = attachment_url
        self.action_url = action_url
        self.action_text = action_text
    
    @property
    def is_expired(self):
        """Check if notification has expired"""
        if self.expires_at:
            return datetime.now(timezone.utc) > self.expires_at
        return False
    
    @property
    def read_count(self):
        """Get number of users who have read this notification"""
        return self.read_receipts.count()
    
    def mark_as_sent(self):
        """Mark notification as sent"""
        self.sent_at = datetime.now(timezone.utc)
    
    def get_target_users(self):
        """Get list of users who should receive this notification"""
        from app.models.user import User
        from app.models.student import Student
        
        if self.target_audience == 'all':
            return User.query.filter_by(is_active=True).all()
        elif self.target_audience == 'students':
            return User.query.filter_by(role='student', is_active=True).all()
        elif self.target_audience == 'parents':
            return User.query.filter_by(role='parent', is_active=True).all()
        elif self.target_audience == 'teachers':
            return User.query.filter_by(role='teacher', is_active=True).all()
        elif self.target_audience == 'admins':
            return User.query.filter_by(role='admin', is_active=True).all()
        elif self.target_audience == 'specific_class' and self.target_class_id:
            students = Student.query.filter_by(class_id=self.target_class_id, is_active=True).all()
            return [student.user for student in students if student.user]
        return []
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'message': self.message,
            'notification_type': self.notification_type,
            'priority': self.priority,
            'target_audience': self.target_audience,
            'target_class_id': self.target_class_id,
            'is_active': self.is_active,
            'is_read_required': self.is_read_required,
            'is_expired': self.is_expired,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'created_by': self.created_by,
            'attachment_url': self.attachment_url,
            'action_url': self.action_url,
            'action_text': self.action_text,
            'read_count': self.read_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Notification {self.title}>'


class NotificationReceipt(db.Model):
    """Track which users have read which notifications"""
    __tablename__ = 'notification_receipts'
    
    id = db.Column(db.Integer, primary_key=True)
    notification_id = db.Column(db.Integer, db.ForeignKey('notifications.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    read_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = db.relationship('User')
    
    # Unique constraint to prevent duplicate receipts
    __table_args__ = (db.UniqueConstraint('notification_id', 'user_id', 
                                         name='unique_notification_receipt'),)
    
    def __init__(self, notification_id, user_id):
        self.notification_id = notification_id
        self.user_id = user_id
    
    def to_dict(self):
        return {
            'id': self.id,
            'notification_id': self.notification_id,
            'user_id': self.user_id,
            'read_at': self.read_at.isoformat() if self.read_at else None
        }
    
    def __repr__(self):
        return f'<NotificationReceipt {self.notification_id} - {self.user_id}>'