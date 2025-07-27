from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from datetime import timedelta
from app import db
from app.models.user import User
from app.models.student import Student
from app.models.parent import Parent
from app.models.teacher import Teacher
from app.utils.validators import validate_email, validate_password, validate_required_fields
from app.utils.helpers import format_response, format_error_response, generate_student_id, generate_employee_id
from app.utils.auth import get_current_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name', 'role']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        # Validate email
        is_valid, error_msg = validate_email(data['email'])
        if not is_valid:
            return format_error_response(f"Invalid email: {error_msg}", status_code=400)
        
        # Validate password
        is_valid, error_msg = validate_password(data['password'])
        if not is_valid:
            return format_error_response(f"Invalid password: {error_msg}", status_code=400)
        
        # Validate role
        allowed_roles = ['admin', 'teacher', 'student', 'parent']
        if data['role'] not in allowed_roles:
            return format_error_response(f"Invalid role. Must be one of: {', '.join(allowed_roles)}", status_code=400)
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return format_error_response("User with this email already exists", status_code=409)
        
        # Create user
        user = User(
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=data['role'],
            phone=data.get('phone'),
            address=data.get('address')
        )
        
        db.session.add(user)
        db.session.flush()  # Get user ID without committing
        
        # Create role-specific profile
        if data['role'] == 'student':
            student = Student(
                user_id=user.id,
                student_id=generate_student_id(),
                date_of_birth=data.get('date_of_birth'),
                emergency_contact=data.get('emergency_contact'),
                emergency_phone=data.get('emergency_phone'),
                medical_info=data.get('medical_info')
            )
            db.session.add(student)
            
        elif data['role'] == 'teacher':
            teacher = Teacher(
                user_id=user.id,
                employee_id=generate_employee_id(),
                department=data.get('department'),
                qualification=data.get('qualification'),
                experience_years=data.get('experience_years', 0),
                specialization=data.get('specialization')
            )
            db.session.add(teacher)
            
        elif data['role'] == 'parent':
            parent = Parent(
                user_id=user.id,
                occupation=data.get('occupation'),
                workplace=data.get('workplace'),
                work_phone=data.get('work_phone'),
                relationship_to_students=data.get('relationship_to_students')
            )
            db.session.add(parent)
        
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        response_data = {
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }
        
        return format_response(response_data, "User registered successfully", status_code=201)
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Registration failed: {str(e)}", status_code=500)

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        # Find user
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return format_error_response("Invalid email or password", status_code=401)
        
        if not user.is_active:
            return format_error_response("Account is deactivated", status_code=403)
        
        # Generate tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        response_data = {
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }
        
        return format_response(response_data, "Login successful")
        
    except Exception as e:
        return format_error_response(f"Login failed: {str(e)}", status_code=500)

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_active:
            return format_error_response("User not found or deactivated", status_code=404)
        
        new_access_token = create_access_token(identity=current_user_id)
        
        response_data = {
            'access_token': new_access_token
        }
        
        return format_response(response_data, "Token refreshed successfully")
        
    except Exception as e:
        return format_error_response(f"Token refresh failed: {str(e)}", status_code=500)

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user_info():
    """Get current user information"""
    try:
        current_user = get_current_user()
        
        if not current_user:
            return format_error_response("User not found", status_code=404)
        
        user_data = current_user.to_dict()
        
        # Add role-specific profile data
        if current_user.role == 'student' and current_user.student_profile:
            user_data['student_profile'] = current_user.student_profile.to_dict()
        elif current_user.role == 'teacher' and current_user.teacher_profile:
            user_data['teacher_profile'] = current_user.teacher_profile.to_dict()
        elif current_user.role == 'parent' and current_user.parent_profile:
            user_data['parent_profile'] = current_user.parent_profile.to_dict()
        
        return format_response(user_data, "User information retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get user info: {str(e)}", status_code=500)

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        
        if not current_user:
            return format_error_response("User not found", status_code=404)
        
        # Validate required fields
        required_fields = ['current_password', 'new_password']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        # Verify current password
        if not current_user.check_password(data['current_password']):
            return format_error_response("Current password is incorrect", status_code=400)
        
        # Validate new password
        is_valid, error_msg = validate_password(data['new_password'])
        if not is_valid:
            return format_error_response(f"Invalid new password: {error_msg}", status_code=400)
        
        # Update password
        current_user.set_password(data['new_password'])
        db.session.commit()
        
        return format_response(None, "Password changed successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Password change failed: {str(e)}", status_code=500)

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Handle forgot password request"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        user = User.query.filter_by(email=data['email']).first()
        
        # Always return success for security (don't reveal if email exists)
        # In a real application, you would send a password reset email here
        
        return format_response(None, "If an account with that email exists, a password reset link has been sent")
        
    except Exception as e:
        return format_error_response(f"Request failed: {str(e)}", status_code=500)