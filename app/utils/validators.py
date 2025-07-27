import re
from datetime import datetime
from email_validator import validate_email as email_validate, EmailNotValidError

def validate_email(email):
    """Validate email format"""
    try:
        email_validate(email)
        return True, None
    except EmailNotValidError as e:
        return False, str(e)

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r"\d", password):
        return False, "Password must contain at least one digit"
    
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character"
    
    return True, None

def validate_phone(phone):
    """Validate phone number format"""
    if not phone:
        return True, None
    
    # Remove all non-digit characters
    digits_only = re.sub(r'\D', '', phone)
    
    if len(digits_only) < 10 or len(digits_only) > 15:
        return False, "Phone number must be between 10 and 15 digits"
    
    return True, None

def validate_date(date_string, date_format='%Y-%m-%d'):
    """Validate date format"""
    try:
        datetime.strptime(date_string, date_format)
        return True, None
    except ValueError:
        return False, f"Invalid date format. Expected format: {date_format}"

def validate_grade_value(grade_value):
    """Validate grade value (0-100)"""
    try:
        grade = float(grade_value)
        if 0 <= grade <= 100:
            return True, None
        else:
            return False, "Grade must be between 0 and 100"
    except (ValueError, TypeError):
        return False, "Grade must be a valid number"

def validate_required_fields(data, required_fields):
    """Validate that all required fields are present and not empty"""
    missing_fields = []
    
    for field in required_fields:
        if field not in data or data[field] is None or str(data[field]).strip() == '':
            missing_fields.append(field)
    
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
    
    return True, None

def validate_enum_value(value, allowed_values, field_name):
    """Validate that value is in allowed enum values"""
    if value not in allowed_values:
        return False, f"{field_name} must be one of: {', '.join(allowed_values)}"
    return True, None

def validate_student_id(student_id):
    """Validate student ID format"""
    if not student_id:
        return False, "Student ID is required"
    
    if not re.match(r'^[A-Z0-9]+$', student_id):
        return False, "Student ID must contain only uppercase letters and numbers"
    
    if len(student_id) < 6 or len(student_id) > 20:
        return False, "Student ID must be between 6 and 20 characters"
    
    return True, None

def validate_employee_id(employee_id):
    """Validate employee ID format"""
    if not employee_id:
        return False, "Employee ID is required"
    
    if not re.match(r'^[A-Z0-9]+$', employee_id):
        return False, "Employee ID must contain only uppercase letters and numbers"
    
    if len(employee_id) < 6 or len(employee_id) > 20:
        return False, "Employee ID must be between 6 and 20 characters"
    
    return True, None