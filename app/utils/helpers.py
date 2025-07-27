import random
import string
from datetime import datetime, timezone
from flask import request, jsonify
from app.models.student import Student
from app.models.teacher import Teacher

def generate_student_id():
    """Generate a unique student ID"""
    current_year = datetime.now(timezone.utc).year
    year_code = str(current_year)[-2:]  # Last 2 digits of year
    
    # Generate random 4-digit number
    random_digits = ''.join(random.choices(string.digits, k=4))
    
    # Format: ST + YY + 4 random digits
    student_id = f"ST{year_code}{random_digits}"
    
    # Check if ID already exists and regenerate if needed
    while Student.query.filter_by(student_id=student_id).first():
        random_digits = ''.join(random.choices(string.digits, k=4))
        student_id = f"ST{year_code}{random_digits}"
    
    return student_id

def generate_employee_id():
    """Generate a unique employee ID"""
    current_year = datetime.now(timezone.utc).year
    year_code = str(current_year)[-2:]  # Last 2 digits of year
    
    # Generate random 4-digit number
    random_digits = ''.join(random.choices(string.digits, k=4))
    
    # Format: EMP + YY + 4 random digits
    employee_id = f"EMP{year_code}{random_digits}"
    
    # Check if ID already exists and regenerate if needed
    while Teacher.query.filter_by(employee_id=employee_id).first():
        random_digits = ''.join(random.choices(string.digits, k=4))
        employee_id = f"EMP{year_code}{random_digits}"
    
    return employee_id

def paginate_query(query, page=None, per_page=None, max_per_page=100):
    """Paginate a SQLAlchemy query"""
    try:
        page = int(request.args.get('page', page or 1))
        per_page = int(request.args.get('per_page', per_page or 20))
        
        # Limit per_page to prevent excessive data loading
        per_page = min(per_page, max_per_page)
        
        paginated = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return {
            'items': [item.to_dict() for item in paginated.items],
            'pagination': {
                'page': paginated.page,
                'per_page': paginated.per_page,
                'total': paginated.total,
                'pages': paginated.pages,
                'has_next': paginated.has_next,
                'has_prev': paginated.has_prev,
                'next_num': paginated.next_num if paginated.has_next else None,
                'prev_num': paginated.prev_num if paginated.has_prev else None
            }
        }
    except (ValueError, TypeError):
        return {
            'error': 'Invalid pagination parameters',
            'message': 'Page and per_page must be valid integers'
        }, 400

def format_response(data=None, message=None, status='success', status_code=200):
    """Format API response consistently"""
    response = {
        'status': status,
        'timestamp': datetime.now(timezone.utc).isoformat()
    }
    
    if message:
        response['message'] = message
    
    if data is not None:
        response['data'] = data
    
    return jsonify(response), status_code

def format_error_response(error, message=None, status_code=400):
    """Format error response consistently"""
    response = {
        'status': 'error',
        'error': error,
        'timestamp': datetime.now(timezone.utc).isoformat()
    }
    
    if message:
        response['message'] = message
    
    return jsonify(response), status_code

def get_current_academic_year():
    """Get current academic year based on current date"""
    now = datetime.now(timezone.utc)
    
    # Academic year typically starts in August/September
    if now.month >= 8:  # August onwards is the new academic year
        start_year = now.year
        end_year = now.year + 1
    else:  # January to July is still the previous academic year
        start_year = now.year - 1
        end_year = now.year
    
    return f"{start_year}-{end_year}"

def calculate_age(birth_date):
    """Calculate age from birth date"""
    if not birth_date:
        return None
    
    today = datetime.now(timezone.utc).date()
    
    # If birth_date is a datetime object, convert to date
    if hasattr(birth_date, 'date'):
        birth_date = birth_date.date()
    
    age = today.year - birth_date.year
    
    # Adjust if birthday hasn't occurred this year
    if today.month < birth_date.month or (today.month == birth_date.month and today.day < birth_date.day):
        age -= 1
    
    return age

def sanitize_filename(filename):
    """Sanitize filename for safe storage"""
    if not filename:
        return None
    
    # Remove potentially dangerous characters
    safe_chars = string.ascii_letters + string.digits + '.-_'
    sanitized = ''.join(c for c in filename if c in safe_chars)
    
    # Limit length
    return sanitized[:255]

def generate_notification_id():
    """Generate a unique notification ID"""
    timestamp = str(int(datetime.now(timezone.utc).timestamp()))
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"NOTIF{timestamp}{random_part}"