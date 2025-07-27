from datetime import datetime, timezone
from app import db

class Message(db.Model):
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    message_type = db.Column(db.Enum('personal', 'announcement', 'reminder', 'complaint', 
                                    'inquiry', 'meeting_request', name='message_types'), 
                           default='personal')
    priority = db.Column(db.Enum('low', 'medium', 'high', 'urgent', name='priority_levels'), 
                        default='medium')
    is_read = db.Column(db.Boolean, default=False)
    read_at = db.Column(db.DateTime)
    is_reply = db.Column(db.Boolean, default=False)
    parent_message_id = db.Column(db.Integer, db.ForeignKey('messages.id'))
    attachment_url = db.Column(db.String(500))
    is_draft = db.Column(db.Boolean, default=False)
    is_archived = db.Column(db.Boolean, default=False)
    is_starred = db.Column(db.Boolean, default=False)
    sender_deleted = db.Column(db.Boolean, default=False)
    recipient_deleted = db.Column(db.Boolean, default=False)
    sent_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    parent_message = db.relationship('Message', remote_side=[id], backref='replies')
    
    def __init__(self, sender_id, recipient_id, subject, body, message_type='personal', 
                 priority='medium', parent_message_id=None, attachment_url=None, is_draft=False):
        self.sender_id = sender_id
        self.recipient_id = recipient_id
        self.subject = subject
        self.body = body
        self.message_type = message_type
        self.priority = priority
        self.parent_message_id = parent_message_id
        self.attachment_url = attachment_url
        self.is_draft = is_draft
        self.is_reply = parent_message_id is not None
        
        if not is_draft:
            self.sent_at = datetime.now(timezone.utc)
    
    def mark_as_read(self):
        """Mark message as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = datetime.now(timezone.utc)
    
    def mark_as_unread(self):
        """Mark message as unread"""
        self.is_read = False
        self.read_at = None
    
    def archive(self):
        """Archive the message"""
        self.is_archived = True
    
    def unarchive(self):
        """Unarchive the message"""
        self.is_archived = False
    
    def star(self):
        """Star the message"""
        self.is_starred = True
    
    def unstar(self):
        """Unstar the message"""
        self.is_starred = False
    
    def delete_for_sender(self):
        """Delete message for sender"""
        self.sender_deleted = True
    
    def delete_for_recipient(self):
        """Delete message for recipient"""
        self.recipient_deleted = True
    
    def restore_for_sender(self):
        """Restore message for sender"""
        self.sender_deleted = False
    
    def restore_for_recipient(self):
        """Restore message for recipient"""
        self.recipient_deleted = False
    
    @property
    def is_fully_deleted(self):
        """Check if message is deleted by both sender and recipient"""
        return self.sender_deleted and self.recipient_deleted
    
    @property
    def reply_count(self):
        """Get number of replies to this message"""
        return Message.query.filter_by(parent_message_id=self.id).count()
    
    def get_conversation_thread(self):
        """Get the full conversation thread"""
        if self.parent_message_id:
            # This is a reply, get the original message and all its replies
            root_message = Message.query.get(self.parent_message_id)
            if root_message:
                return [root_message] + Message.query.filter_by(parent_message_id=root_message.id).order_by(Message.sent_at).all()
        else:
            # This is the original message, get it and all its replies
            return [self] + Message.query.filter_by(parent_message_id=self.id).order_by(Message.sent_at).all()
        return [self]
    
    def to_dict(self, include_body=True):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'recipient_id': self.recipient_id,
            'subject': self.subject,
            'body': self.body if include_body else None,
            'message_type': self.message_type,
            'priority': self.priority,
            'is_read': self.is_read,
            'read_at': self.read_at.isoformat() if self.read_at else None,
            'is_reply': self.is_reply,
            'parent_message_id': self.parent_message_id,
            'reply_count': self.reply_count,
            'attachment_url': self.attachment_url,
            'is_draft': self.is_draft,
            'is_archived': self.is_archived,
            'is_starred': self.is_starred,
            'sender_deleted': self.sender_deleted,
            'recipient_deleted': self.recipient_deleted,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Message from {self.sender_id} to {self.recipient_id}: {self.subject}>'