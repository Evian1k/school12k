from flask import Blueprint, request
from app import db
from app.models.user import User
from app.utils.auth import require_role, require_same_user_or_role, get_current_user
from app.utils.helpers import format_response, format_error_response, paginate_query
from app.utils.validators import validate_required_fields, validate_email, validate_phone

user_bp = Blueprint('user', __name__)

@user_bp.route('', methods=['GET'])
@require_role('admin', 'teacher')
def get_users():
    """Get all users with pagination"""
    try:
        query = User.query.filter_by(is_active=True)
        
        # Filter by role
        role = request.args.get('role')
        if role:
            query = query.filter_by(role=role)
        
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
        
        query = query.order_by(User.last_name, User.first_name)
        result = paginate_query(query)
        return format_response(result, "Users retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get users: {str(e)}", status_code=500)

@user_bp.route('/<int:user_id>', methods=['GET'])
@require_same_user_or_role('admin', 'teacher')
def get_user(user_id):
    """Get specific user by ID"""
    try:
        user = User.query.get_or_404(user_id)
        user_data = user.to_dict()
        
        # Add role-specific profile data
        if user.role == 'student' and user.student_profile:
            user_data['student_profile'] = user.student_profile.to_dict()
        elif user.role == 'teacher' and user.teacher_profile:
            user_data['teacher_profile'] = user.teacher_profile.to_dict()
        elif user.role == 'parent' and user.parent_profile:
            user_data['parent_profile'] = user.parent_profile.to_dict()
            
        return format_response(user_data, "User retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get user: {str(e)}", status_code=500)

@user_bp.route('/<int:user_id>', methods=['PUT'])
@require_same_user_or_role('admin')
def update_user(user_id):
    """Update user information"""
    try:
        data = request.get_json()
        user = User.query.get_or_404(user_id)
        
        # Validate email if provided
        if 'email' in data:
            is_valid, error_msg = validate_email(data['email'])
            if not is_valid:
                return format_error_response(f"Invalid email: {error_msg}", status_code=400)
            
            # Check if email is already taken by another user
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user.id:
                return format_error_response("Email already exists", status_code=409)
            
            user.email = data['email']
        
        # Validate phone if provided
        if 'phone' in data:
            is_valid, error_msg = validate_phone(data['phone'])
            if not is_valid:
                return format_error_response(f"Invalid phone: {error_msg}", status_code=400)
            user.phone = data['phone']
        
        # Update other fields
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'address' in data:
            user.address = data['address']
        
        db.session.commit()
        return format_response(user.to_dict(), "User updated successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to update user: {str(e)}", status_code=500)

@user_bp.route('/<int:user_id>', methods=['DELETE'])
@require_role('admin')
def delete_user(user_id):
    """Soft delete user (deactivate)"""
    try:
        user = User.query.get_or_404(user_id)
        current_user = get_current_user()
        
        # Prevent admin from deleting themselves
        if user.id == current_user.id:
            return format_error_response("You cannot delete your own account", status_code=400)
        
        user.is_active = False
        db.session.commit()
        
        return format_response(None, "User deactivated successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to delete user: {str(e)}", status_code=500)