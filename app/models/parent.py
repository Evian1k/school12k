from datetime import datetime, timezone
from app import db

class Parent(db.Model):
    __tablename__ = 'parents'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    occupation = db.Column(db.String(100))
    workplace = db.Column(db.String(100))
    work_phone = db.Column(db.String(20))
    relationship_to_students = db.Column(db.String(50))  # Father, Mother, Guardian, etc.
    is_primary_contact = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def __init__(self, user_id, occupation=None, workplace=None, work_phone=None, 
                 relationship_to_students=None, is_primary_contact=False):
        self.user_id = user_id
        self.occupation = occupation
        self.workplace = workplace
        self.work_phone = work_phone
        self.relationship_to_students = relationship_to_students
        self.is_primary_contact = is_primary_contact
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'occupation': self.occupation,
            'workplace': self.workplace,
            'work_phone': self.work_phone,
            'relationship_to_students': self.relationship_to_students,
            'is_primary_contact': self.is_primary_contact,
            'children_count': self.children.count(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Parent {self.user.full_name if self.user else self.id}>'