from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from app.models.user import User

def get_current_user():
    """Get the current authenticated user"""
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        return User.query.get(user_id)
    except Exception:
        return None

def require_role(*allowed_roles):
    """Decorator to require specific roles"""
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user = get_current_user()
            
            if not current_user:
                return jsonify({'error': 'User not found'}), 404
            
            if not current_user.is_active:
                return jsonify({'error': 'Account is deactivated'}), 403
            
            if current_user.role not in allowed_roles:
                return jsonify({
                    'error': 'Access denied',
                    'message': f'Required role: {" or ".join(allowed_roles)}'
                }), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def require_same_user_or_role(*allowed_roles):
    """Decorator to allow access to same user or specific roles"""
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user = get_current_user()
            
            if not current_user:
                return jsonify({'error': 'User not found'}), 404
            
            if not current_user.is_active:
                return jsonify({'error': 'Account is deactivated'}), 403
            
            # Check if user is accessing their own data
            user_id = kwargs.get('user_id') or request.json.get('user_id')
            if user_id and str(current_user.id) == str(user_id):
                return f(*args, **kwargs)
            
            # Check if user has required role
            if current_user.role in allowed_roles:
                return f(*args, **kwargs)
            
            return jsonify({
                'error': 'Access denied',
                'message': 'You can only access your own data or need appropriate role'
            }), 403
        return decorated_function
    return decorator

def optional_jwt():
    """Decorator for optional JWT authentication"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                verify_jwt_in_request(optional=True)
            except Exception:
                pass
            return f(*args, **kwargs)
        return decorated_function
    return decorator