from flask import Blueprint, request
from app import db
from app.models.message import Message
from app.models.user import User
from app.utils.auth import require_role, get_current_user
from app.utils.helpers import format_response, format_error_response, paginate_query
from app.utils.validators import validate_required_fields

message_bp = Blueprint('message', __name__)

@message_bp.route('', methods=['GET'])
@require_role('admin', 'teacher', 'student', 'parent')
def get_messages():
    """Get messages for current user"""
    try:
        current_user = get_current_user()
        
        # Filter messages by inbox/sent
        message_type = request.args.get('type', 'inbox')  # inbox, sent, drafts
        
        if message_type == 'inbox':
            query = Message.query.filter(
                Message.recipient_id == current_user.id,
                Message.recipient_deleted == False,
                Message.is_draft == False
            )
        elif message_type == 'sent':
            query = Message.query.filter(
                Message.sender_id == current_user.id,
                Message.sender_deleted == False,
                Message.is_draft == False
            )
        elif message_type == 'drafts':
            query = Message.query.filter(
                Message.sender_id == current_user.id,
                Message.is_draft == True,
                Message.sender_deleted == False
            )
        else:
            return format_error_response("Invalid message type. Must be 'inbox', 'sent', or 'drafts'", status_code=400)
        
        # Filter by read/unread status
        is_read = request.args.get('is_read')
        if is_read is not None and message_type == 'inbox':
            query = query.filter_by(is_read=is_read.lower() == 'true')
        
        # Filter by archived status
        is_archived = request.args.get('is_archived')
        if is_archived is not None:
            query = query.filter_by(is_archived=is_archived.lower() == 'true')
        
        # Filter by starred status
        is_starred = request.args.get('is_starred')
        if is_starred is not None:
            query = query.filter_by(is_starred=is_starred.lower() == 'true')
        
        # Search functionality
        search = request.args.get('search')
        if search:
            query = query.filter(
                db.or_(
                    Message.subject.ilike(f'%{search}%'),
                    Message.body.ilike(f'%{search}%')
                )
            )
        
        query = query.order_by(Message.sent_at.desc())
        result = paginate_query(query)
        
        # Enhance with sender/recipient data
        for item in result.get('items', []):
            message = Message.query.get(item['id'])
            if message:
                if message.sender:
                    item['sender'] = {
                        'id': message.sender.id,
                        'name': message.sender.full_name,
                        'role': message.sender.role
                    }
                if message.recipient:
                    item['recipient'] = {
                        'id': message.recipient.id,
                        'name': message.recipient.full_name,
                        'role': message.recipient.role
                    }
        
        # Calculate unread count for inbox
        unread_count = 0
        if message_type == 'inbox':
            unread_count = Message.query.filter(
                Message.recipient_id == current_user.id,
                Message.recipient_deleted == False,
                Message.is_draft == False,
                Message.is_read == False
            ).count()
        
        result['unread_count'] = unread_count
        
        return format_response(result, f"{message_type.title()} messages retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get messages: {str(e)}", status_code=500)

@message_bp.route('/<int:message_id>', methods=['GET'])
@require_role('admin', 'teacher', 'student', 'parent')
def get_message(message_id):
    """Get specific message by ID"""
    try:
        message = Message.query.get_or_404(message_id)
        current_user = get_current_user()
        
        # Check access permissions
        if (message.sender_id != current_user.id and 
            message.recipient_id != current_user.id and 
            current_user.role != 'admin'):
            return format_error_response("Access denied", status_code=403)
        
        # Check if message is deleted for current user
        if ((message.sender_id == current_user.id and message.sender_deleted) or
            (message.recipient_id == current_user.id and message.recipient_deleted)):
            return format_error_response("Message not found", status_code=404)
        
        # Mark as read if current user is recipient
        if message.recipient_id == current_user.id and not message.is_read:
            message.mark_as_read()
            db.session.commit()
        
        message_data = message.to_dict()
        
        # Add sender and recipient information
        if message.sender:
            message_data['sender'] = {
                'id': message.sender.id,
                'name': message.sender.full_name,
                'role': message.sender.role
            }
        
        if message.recipient:
            message_data['recipient'] = {
                'id': message.recipient.id,
                'name': message.recipient.full_name,
                'role': message.recipient.role
            }
        
        # Add conversation thread
        conversation_thread = message.get_conversation_thread()
        thread_data = []
        for msg in conversation_thread:
            if not ((msg.sender_id == current_user.id and msg.sender_deleted) or
                   (msg.recipient_id == current_user.id and msg.recipient_deleted)):
                msg_dict = msg.to_dict()
                if msg.sender:
                    msg_dict['sender'] = {
                        'id': msg.sender.id,
                        'name': msg.sender.full_name
                    }
                thread_data.append(msg_dict)
        
        message_data['conversation_thread'] = thread_data
        
        return format_response(message_data, "Message retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get message: {str(e)}", status_code=500)

@message_bp.route('', methods=['POST'])
@require_role('admin', 'teacher', 'student', 'parent')
def create_message():
    """Create/send a new message"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        
        # Validate required fields
        required_fields = ['recipient_id', 'subject', 'body']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        # Validate recipient exists
        recipient = User.query.filter_by(id=data['recipient_id'], is_active=True).first()
        if not recipient:
            return format_error_response("Recipient not found or inactive", status_code=404)
        
        # Prevent sending message to self
        if data['recipient_id'] == current_user.id:
            return format_error_response("Cannot send message to yourself", status_code=400)
        
        # Create message
        message = Message(
            sender_id=current_user.id,
            recipient_id=data['recipient_id'],
            subject=data['subject'],
            body=data['body'],
            message_type=data.get('message_type', 'personal'),
            priority=data.get('priority', 'medium'),
            parent_message_id=data.get('parent_message_id'),
            attachment_url=data.get('attachment_url'),
            is_draft=data.get('is_draft', False)
        )
        
        db.session.add(message)
        db.session.commit()
        
        status_msg = "Draft saved successfully" if message.is_draft else "Message sent successfully"
        return format_response(message.to_dict(), status_msg, status_code=201)
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to create message: {str(e)}", status_code=500)

@message_bp.route('/<int:message_id>/reply', methods=['POST'])
@require_role('admin', 'teacher', 'student', 'parent')
def reply_to_message(message_id):
    """Reply to a message"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        original_message = Message.query.get_or_404(message_id)
        
        # Check if user can reply to this message
        if (original_message.recipient_id != current_user.id and 
            current_user.role != 'admin'):
            return format_error_response("You can only reply to messages sent to you", status_code=403)
        
        # Validate required fields
        required_fields = ['body']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        # Create reply subject
        reply_subject = data.get('subject', f"Re: {original_message.subject}")
        if not reply_subject.startswith("Re: "):
            reply_subject = f"Re: {reply_subject}"
        
        # Create reply message
        reply = Message(
            sender_id=current_user.id,
            recipient_id=original_message.sender_id,
            subject=reply_subject,
            body=data['body'],
            message_type=data.get('message_type', 'personal'),
            priority=data.get('priority', 'medium'),
            parent_message_id=original_message.id,
            attachment_url=data.get('attachment_url'),
            is_draft=data.get('is_draft', False)
        )
        
        db.session.add(reply)
        db.session.commit()
        
        status_msg = "Reply draft saved successfully" if reply.is_draft else "Reply sent successfully"
        return format_response(reply.to_dict(), status_msg, status_code=201)
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to reply to message: {str(e)}", status_code=500)

@message_bp.route('/<int:message_id>', methods=['PUT'])
@require_role('admin', 'teacher', 'student', 'parent')
def update_message(message_id):
    """Update message (only drafts can be updated)"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        message = Message.query.get_or_404(message_id)
        
        # Check if user can update this message
        if message.sender_id != current_user.id and current_user.role != 'admin':
            return format_error_response("Access denied", status_code=403)
        
        # Only drafts can be updated
        if not message.is_draft:
            return format_error_response("Only draft messages can be updated", status_code=400)
        
        # Update fields if provided
        if 'recipient_id' in data:
            recipient = User.query.filter_by(id=data['recipient_id'], is_active=True).first()
            if not recipient:
                return format_error_response("Recipient not found or inactive", status_code=404)
            message.recipient_id = data['recipient_id']
        
        if 'subject' in data:
            message.subject = data['subject']
        
        if 'body' in data:
            message.body = data['body']
        
        if 'message_type' in data:
            message.message_type = data['message_type']
        
        if 'priority' in data:
            message.priority = data['priority']
        
        if 'attachment_url' in data:
            message.attachment_url = data['attachment_url']
        
        # Send draft if requested
        if 'send' in data and data['send']:
            message.is_draft = False
            message.sent_at = db.func.now()
        
        db.session.commit()
        
        status_msg = "Message sent successfully" if not message.is_draft else "Draft updated successfully"
        return format_response(message.to_dict(), status_msg)
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to update message: {str(e)}", status_code=500)

@message_bp.route('/<int:message_id>/mark-read', methods=['PATCH'])
@require_role('admin', 'teacher', 'student', 'parent')
def mark_message_read(message_id):
    """Mark message as read"""
    try:
        current_user = get_current_user()
        message = Message.query.get_or_404(message_id)
        
        # Check if user is the recipient
        if message.recipient_id != current_user.id and current_user.role != 'admin':
            return format_error_response("Access denied", status_code=403)
        
        message.mark_as_read()
        db.session.commit()
        
        return format_response(None, "Message marked as read")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to mark message as read: {str(e)}", status_code=500)

@message_bp.route('/<int:message_id>/star', methods=['PATCH'])
@require_role('admin', 'teacher', 'student', 'parent')
def toggle_message_star(message_id):
    """Toggle star status of message"""
    try:
        current_user = get_current_user()
        message = Message.query.get_or_404(message_id)
        
        # Check access permissions
        if (message.sender_id != current_user.id and 
            message.recipient_id != current_user.id and 
            current_user.role != 'admin'):
            return format_error_response("Access denied", status_code=403)
        
        if message.is_starred:
            message.unstar()
            status_msg = "Message unstarred"
        else:
            message.star()
            status_msg = "Message starred"
        
        db.session.commit()
        
        return format_response({'is_starred': message.is_starred}, status_msg)
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to toggle star: {str(e)}", status_code=500)

@message_bp.route('/<int:message_id>/archive', methods=['PATCH'])
@require_role('admin', 'teacher', 'student', 'parent')
def toggle_message_archive(message_id):
    """Toggle archive status of message"""
    try:
        current_user = get_current_user()
        message = Message.query.get_or_404(message_id)
        
        # Check access permissions
        if (message.sender_id != current_user.id and 
            message.recipient_id != current_user.id and 
            current_user.role != 'admin'):
            return format_error_response("Access denied", status_code=403)
        
        if message.is_archived:
            message.unarchive()
            status_msg = "Message unarchived"
        else:
            message.archive()
            status_msg = "Message archived"
        
        db.session.commit()
        
        return format_response({'is_archived': message.is_archived}, status_msg)
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to toggle archive: {str(e)}", status_code=500)

@message_bp.route('/<int:message_id>', methods=['DELETE'])
@require_role('admin', 'teacher', 'student', 'parent')
def delete_message(message_id):
    """Delete message for current user"""
    try:
        current_user = get_current_user()
        message = Message.query.get_or_404(message_id)
        
        # Check access permissions
        if (message.sender_id != current_user.id and 
            message.recipient_id != current_user.id and 
            current_user.role != 'admin'):
            return format_error_response("Access denied", status_code=403)
        
        # Mark as deleted for current user
        if message.sender_id == current_user.id:
            message.delete_for_sender()
        elif message.recipient_id == current_user.id:
            message.delete_for_recipient()
        
        # If both users have deleted, remove from database
        if message.is_fully_deleted:
            db.session.delete(message)
        
        db.session.commit()
        
        return format_response(None, "Message deleted successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to delete message: {str(e)}", status_code=500)

@message_bp.route('/users', methods=['GET'])
@require_role('admin', 'teacher', 'student', 'parent')
def get_users_for_messaging():
    """Get list of users that current user can send messages to"""
    try:
        current_user = get_current_user()
        
        # Base query for active users excluding current user
        query = User.query.filter(
            User.is_active == True,
            User.id != current_user.id
        )
        
        # Role-based filtering
        if current_user.role == 'student':
            # Students can message teachers, parents, and other students in same class
            if current_user.student_profile and current_user.student_profile.class_id:
                # Get parent IDs
                parent_ids = [p.user_id for p in current_user.student_profile.parents]
                
                # Get classmate IDs
                from app.models.student import Student
                classmates = Student.query.filter_by(
                    class_id=current_user.student_profile.class_id,
                    is_active=True
                ).all()
                classmate_ids = [s.user_id for s in classmates if s.user_id != current_user.id]
                
                query = query.filter(
                    db.or_(
                        User.role == 'teacher',
                        User.id.in_(parent_ids),
                        User.id.in_(classmate_ids)
                    )
                )
            else:
                query = query.filter(User.role == 'teacher')
        
        elif current_user.role == 'parent':
            # Parents can message teachers and their children
            if current_user.parent_profile:
                children_ids = [child.user_id for child in current_user.parent_profile.children]
                query = query.filter(
                    db.or_(
                        User.role == 'teacher',
                        User.id.in_(children_ids)
                    )
                )
            else:
                query = query.filter(User.role == 'teacher')
        
        elif current_user.role == 'teacher':
            # Teachers can message anyone
            pass
        
        elif current_user.role == 'admin':
            # Admins can message anyone
            pass
        
        # Search functionality
        search = request.args.get('search')
        if search:
            query = query.filter(
                db.or_(
                    User.first_name.ilike(f'%{search}%'),
                    User.last_name.ilike(f'%{search}%'),
                    User.email.ilike(f'%{search}%')
                )
            )
        
        users = query.order_by(User.last_name, User.first_name).limit(50).all()
        
        users_data = []
        for user in users:
            user_dict = {
                'id': user.id,
                'name': user.full_name,
                'email': user.email,
                'role': user.role
            }
            users_data.append(user_dict)
        
        return format_response(users_data, "Users retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get users: {str(e)}", status_code=500)