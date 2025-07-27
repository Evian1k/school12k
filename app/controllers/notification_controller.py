from flask import Blueprint, request
from app import db
from app.models.notification import Notification, NotificationReceipt
from app.models.user import User
from app.models.class_model import Class
from app.utils.auth import require_role, get_current_user
from app.utils.helpers import format_response, format_error_response, paginate_query
from app.utils.validators import validate_required_fields

notification_bp = Blueprint('notification', __name__)

@notification_bp.route('', methods=['GET'])
@require_role('admin', 'teacher', 'student', 'parent')
def get_notifications():
    """Get notifications for current user"""
    try:
        current_user = get_current_user()
        
        # Get notifications targeted to current user
        notifications = []
        
        # Get all notifications that target this user's role or all users
        query = Notification.query.filter(
            Notification.is_active == True,
            db.or_(
                Notification.target_audience == 'all',
                Notification.target_audience == current_user.role
            )
        )
        
        # Add class-specific notifications if user is a student
        if current_user.role == 'student' and current_user.student_profile and current_user.student_profile.class_id:
            class_notifications = Notification.query.filter(
                Notification.is_active == True,
                Notification.target_audience == 'specific_class',
                Notification.target_class_id == current_user.student_profile.class_id
            )
            query = query.union(class_notifications)
        
        # Filter by read status
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        if unread_only:
            # Get notification IDs that haven't been read by current user
            read_notification_ids = db.session.query(NotificationReceipt.notification_id).filter_by(
                user_id=current_user.id
            ).subquery()
            query = query.filter(~Notification.id.in_(read_notification_ids))
        
        notifications = query.order_by(Notification.created_at.desc()).all()
        
        # Format notifications with read status
        notifications_data = []
        for notification in notifications:
            notification_dict = notification.to_dict()
            
            # Check if current user has read this notification
            receipt = NotificationReceipt.query.filter_by(
                notification_id=notification.id,
                user_id=current_user.id
            ).first()
            
            notification_dict['is_read'] = receipt is not None
            notification_dict['read_at'] = receipt.read_at.isoformat() if receipt and receipt.read_at else None
            
            notifications_data.append(notification_dict)
        
        # Calculate unread count
        unread_count = len([n for n in notifications_data if not n['is_read']])
        
        result = {
            'notifications': notifications_data,
            'unread_count': unread_count,
            'total_count': len(notifications_data)
        }
        
        return format_response(result, "Notifications retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get notifications: {str(e)}", status_code=500)

@notification_bp.route('/<int:notification_id>', methods=['GET'])
@require_role('admin', 'teacher', 'student', 'parent')
def get_notification(notification_id):
    """Get specific notification by ID"""
    try:
        notification = Notification.query.get_or_404(notification_id)
        current_user = get_current_user()
        
        # Check if user should have access to this notification
        user_has_access = False
        
        if notification.target_audience == 'all':
            user_has_access = True
        elif notification.target_audience == current_user.role:
            user_has_access = True
        elif (notification.target_audience == 'specific_class' and 
              current_user.role == 'student' and 
              current_user.student_profile and 
              current_user.student_profile.class_id == notification.target_class_id):
            user_has_access = True
        elif current_user.role == 'admin':
            user_has_access = True
        
        if not user_has_access:
            return format_error_response("Access denied", status_code=403)
        
        notification_data = notification.to_dict()
        
        # Check if current user has read this notification
        receipt = NotificationReceipt.query.filter_by(
            notification_id=notification.id,
            user_id=current_user.id
        ).first()
        
        notification_data['is_read'] = receipt is not None
        notification_data['read_at'] = receipt.read_at.isoformat() if receipt and receipt.read_at else None
        
        return format_response(notification_data, "Notification retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get notification: {str(e)}", status_code=500)

@notification_bp.route('', methods=['POST'])
@require_role('admin', 'teacher')
def create_notification():
    """Create a new notification"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        
        # Validate required fields
        required_fields = ['title', 'message']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        # Validate target_audience
        valid_audiences = ['all', 'students', 'parents', 'teachers', 'admins', 'specific_class']
        target_audience = data.get('target_audience', 'all')
        if target_audience not in valid_audiences:
            return format_error_response(f"Invalid target audience. Must be one of: {', '.join(valid_audiences)}", status_code=400)
        
        # Validate target_class_id if audience is specific_class
        target_class_id = None
        if target_audience == 'specific_class':
            if 'target_class_id' not in data:
                return format_error_response("target_class_id is required for specific_class audience", status_code=400)
            
            class_obj = Class.query.filter_by(id=data['target_class_id'], is_active=True).first()
            if not class_obj:
                return format_error_response("Invalid class ID", status_code=404)
            target_class_id = data['target_class_id']
        
        # Teachers can only create notifications for their classes or general announcements
        if current_user.role == 'teacher':
            if target_audience not in ['all', 'students', 'parents', 'specific_class']:
                return format_error_response("Teachers can only create notifications for all users, students, parents, or specific classes", status_code=403)
            
            if target_audience == 'specific_class' and current_user.teacher_profile:
                # Verify teacher teaches in this class
                teacher_classes = [s.class_id for s in current_user.teacher_profile.subjects if s.class_id]
                if target_class_id not in teacher_classes:
                    return format_error_response("You can only create notifications for classes you teach", status_code=403)
        
        # Create notification
        notification = Notification(
            title=data['title'],
            message=data['message'],
            created_by=current_user.id,
            notification_type=data.get('notification_type', 'general'),
            priority=data.get('priority', 'medium'),
            target_audience=target_audience,
            target_class_id=target_class_id,
            is_read_required=data.get('is_read_required', False),
            expires_at=data.get('expires_at'),
            attachment_url=data.get('attachment_url'),
            action_url=data.get('action_url'),
            action_text=data.get('action_text')
        )
        
        db.session.add(notification)
        db.session.commit()
        
        # Mark as sent
        notification.mark_as_sent()
        db.session.commit()
        
        return format_response(notification.to_dict(), "Notification created successfully", status_code=201)
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to create notification: {str(e)}", status_code=500)

@notification_bp.route('/<int:notification_id>/mark-read', methods=['POST'])
@require_role('admin', 'teacher', 'student', 'parent')
def mark_notification_read(notification_id):
    """Mark notification as read by current user"""
    try:
        notification = Notification.query.get_or_404(notification_id)
        current_user = get_current_user()
        
        # Check if receipt already exists
        existing_receipt = NotificationReceipt.query.filter_by(
            notification_id=notification_id,
            user_id=current_user.id
        ).first()
        
        if existing_receipt:
            return format_response(None, "Notification already marked as read")
        
        # Create read receipt
        receipt = NotificationReceipt(
            notification_id=notification_id,
            user_id=current_user.id
        )
        
        db.session.add(receipt)
        db.session.commit()
        
        return format_response(None, "Notification marked as read")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to mark notification as read: {str(e)}", status_code=500)

@notification_bp.route('/mark-all-read', methods=['POST'])
@require_role('admin', 'teacher', 'student', 'parent')
def mark_all_notifications_read():
    """Mark all notifications as read for current user"""
    try:
        current_user = get_current_user()
        
        # Get all notification IDs that target this user and haven't been read
        notifications_query = Notification.query.filter(
            Notification.is_active == True,
            db.or_(
                Notification.target_audience == 'all',
                Notification.target_audience == current_user.role
            )
        )
        
        # Add class-specific notifications if user is a student
        if current_user.role == 'student' and current_user.student_profile and current_user.student_profile.class_id:
            class_notifications = Notification.query.filter(
                Notification.is_active == True,
                Notification.target_audience == 'specific_class',
                Notification.target_class_id == current_user.student_profile.class_id
            )
            notifications_query = notifications_query.union(class_notifications)
        
        notifications = notifications_query.all()
        
        # Get already read notification IDs
        read_notification_ids = set([
            r.notification_id for r in NotificationReceipt.query.filter_by(user_id=current_user.id).all()
        ])
        
        # Create receipts for unread notifications
        new_receipts = []
        for notification in notifications:
            if notification.id not in read_notification_ids:
                receipt = NotificationReceipt(
                    notification_id=notification.id,
                    user_id=current_user.id
                )
                new_receipts.append(receipt)
                db.session.add(receipt)
        
        db.session.commit()
        
        return format_response(
            {'marked_read_count': len(new_receipts)},
            f"Marked {len(new_receipts)} notifications as read"
        )
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to mark all notifications as read: {str(e)}", status_code=500)

@notification_bp.route('/admin', methods=['GET'])
@require_role('admin')
def get_all_notifications_admin():
    """Get all notifications for admin management"""
    try:
        query = Notification.query
        
        # Filter by type
        notification_type = request.args.get('type')
        if notification_type:
            query = query.filter_by(notification_type=notification_type)
        
        # Filter by active status
        is_active = request.args.get('is_active')
        if is_active is not None:
            query = query.filter_by(is_active=is_active.lower() == 'true')
        
        query = query.order_by(Notification.created_at.desc())
        result = paginate_query(query)
        
        # Enhance with creator information
        for item in result.get('items', []):
            notification = Notification.query.get(item['id'])
            if notification and notification.creator:
                item['creator'] = {
                    'id': notification.creator.id,
                    'name': notification.creator.full_name
                }
        
        return format_response(result, "Notifications retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get notifications: {str(e)}", status_code=500)

@notification_bp.route('/<int:notification_id>', methods=['PUT'])
@require_role('admin')
def update_notification(notification_id):
    """Update notification (admin only)"""
    try:
        data = request.get_json()
        notification = Notification.query.get_or_404(notification_id)
        
        # Update fields if provided
        if 'title' in data:
            notification.title = data['title']
        
        if 'message' in data:
            notification.message = data['message']
        
        if 'notification_type' in data:
            notification.notification_type = data['notification_type']
        
        if 'priority' in data:
            notification.priority = data['priority']
        
        if 'expires_at' in data:
            notification.expires_at = data['expires_at']
        
        if 'is_active' in data:
            notification.is_active = data['is_active']
        
        db.session.commit()
        return format_response(notification.to_dict(), "Notification updated successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to update notification: {str(e)}", status_code=500)

@notification_bp.route('/<int:notification_id>', methods=['DELETE'])
@require_role('admin')
def delete_notification(notification_id):
    """Delete notification (admin only)"""
    try:
        notification = Notification.query.get_or_404(notification_id)
        
        # Delete associated receipts first
        NotificationReceipt.query.filter_by(notification_id=notification_id).delete()
        
        db.session.delete(notification)
        db.session.commit()
        
        return format_response(None, "Notification deleted successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to delete notification: {str(e)}", status_code=500)