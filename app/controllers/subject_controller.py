from flask import Blueprint, request
from app import db
from app.models.subject import Subject
from app.models.teacher import Teacher
from app.models.class_model import Class
from app.utils.auth import require_role, get_current_user
from app.utils.helpers import format_response, format_error_response, paginate_query, get_current_academic_year
from app.utils.validators import validate_required_fields

subject_bp = Blueprint('subject', __name__)

@subject_bp.route('', methods=['GET'])
@require_role('admin', 'teacher', 'student', 'parent')
def get_subjects():
    """Get all subjects with pagination and filtering"""
    try:
        query = Subject.query.filter_by(is_active=True)
        
        # Filter by teacher
        teacher_id = request.args.get('teacher_id')
        if teacher_id:
            query = query.filter_by(teacher_id=teacher_id)
        
        # Filter by class
        class_id = request.args.get('class_id')
        if class_id:
            query = query.filter_by(class_id=class_id)
        
        # Filter by academic year
        academic_year = request.args.get('academic_year')
        if academic_year:
            query = query.filter_by(academic_year=academic_year)
        
        # Search functionality
        search = request.args.get('search')
        if search:
            query = query.filter(
                db.or_(
                    Subject.name.ilike(f'%{search}%'),
                    Subject.code.ilike(f'%{search}%'),
                    Subject.description.ilike(f'%{search}%')
                )
            )
        
        query = query.order_by(Subject.name)
        result = paginate_query(query)
        
        # Enhance with teacher and class data
        for item in result.get('items', []):
            subject = Subject.query.get(item['id'])
            if subject:
                if subject.teacher and subject.teacher.user:
                    item['teacher'] = {
                        'id': subject.teacher.id,
                        'name': subject.teacher.user.full_name,
                        'employee_id': subject.teacher.employee_id
                    }
                if subject.class_ref:
                    item['class'] = subject.class_ref.to_dict()
        
        return format_response(result, "Subjects retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get subjects: {str(e)}", status_code=500)

@subject_bp.route('/<int:subject_id>', methods=['GET'])
@require_role('admin', 'teacher', 'student', 'parent')
def get_subject(subject_id):
    """Get specific subject by ID"""
    try:
        subject = Subject.query.get_or_404(subject_id)
        subject_data = subject.to_dict()
        
        # Add teacher information
        if subject.teacher and subject.teacher.user:
            subject_data['teacher'] = {
                'id': subject.teacher.id,
                'name': subject.teacher.user.full_name,
                'employee_id': subject.teacher.employee_id,
                'department': subject.teacher.department
            }
        
        # Add class information
        if subject.class_ref:
            subject_data['class'] = subject.class_ref.to_dict()
        
        return format_response(subject_data, "Subject retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get subject: {str(e)}", status_code=500)

@subject_bp.route('', methods=['POST'])
@require_role('admin')
def create_subject():
    """Create a new subject"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'code']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        # Set academic year if not provided
        academic_year = data.get('academic_year', get_current_academic_year())
        
        # Check if subject code already exists for this academic year
        existing_subject = Subject.query.filter_by(
            code=data['code'],
            academic_year=academic_year
        ).first()
        
        if existing_subject:
            return format_error_response("Subject with this code already exists for the academic year", status_code=409)
        
        # Validate teacher if provided
        teacher_id = data.get('teacher_id')
        if teacher_id:
            teacher = Teacher.query.filter_by(id=teacher_id, is_active=True).first()
            if not teacher:
                return format_error_response("Invalid teacher ID", status_code=404)
        
        # Validate class if provided
        class_id = data.get('class_id')
        if class_id:
            class_obj = Class.query.filter_by(id=class_id, is_active=True).first()
            if not class_obj:
                return format_error_response("Invalid class ID", status_code=404)
        
        new_subject = Subject(
            name=data['name'],
            code=data['code'],
            academic_year=academic_year,
            teacher_id=teacher_id,
            class_id=class_id,
            description=data.get('description'),
            credits=data.get('credits', 1),
            semester=data.get('semester', 'full_year')
        )
        
        db.session.add(new_subject)
        db.session.commit()
        
        return format_response(new_subject.to_dict(), "Subject created successfully", status_code=201)
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to create subject: {str(e)}", status_code=500)

@subject_bp.route('/<int:subject_id>', methods=['PUT'])
@require_role('admin')
def update_subject(subject_id):
    """Update subject information"""
    try:
        data = request.get_json()
        subject = Subject.query.get_or_404(subject_id)
        
        # Update fields if provided
        if 'name' in data:
            subject.name = data['name']
        if 'description' in data:
            subject.description = data['description']
        if 'credits' in data:
            subject.credits = int(data['credits'])
        if 'semester' in data:
            subject.semester = data['semester']
        
        # Validate and update teacher if provided
        if 'teacher_id' in data:
            if data['teacher_id']:
                teacher = Teacher.query.filter_by(id=data['teacher_id'], is_active=True).first()
                if not teacher:
                    return format_error_response("Invalid teacher ID", status_code=404)
            subject.teacher_id = data['teacher_id']
        
        # Validate and update class if provided
        if 'class_id' in data:
            if data['class_id']:
                class_obj = Class.query.filter_by(id=data['class_id'], is_active=True).first()
                if not class_obj:
                    return format_error_response("Invalid class ID", status_code=404)
            subject.class_id = data['class_id']
        
        db.session.commit()
        return format_response(subject.to_dict(), "Subject updated successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to update subject: {str(e)}", status_code=500)

@subject_bp.route('/<int:subject_id>', methods=['DELETE'])
@require_role('admin')
def delete_subject(subject_id):
    """Soft delete subject (deactivate)"""
    try:
        subject = Subject.query.get_or_404(subject_id)
        
        # Check if subject has grades
        if subject.grades.count() > 0:
            return format_error_response("Cannot delete subject with existing grades", status_code=400)
        
        subject.is_active = False
        db.session.commit()
        
        return format_response(None, "Subject deactivated successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to delete subject: {str(e)}", status_code=500)

@subject_bp.route('/<int:subject_id>/assign-teacher', methods=['POST'])
@require_role('admin')
def assign_teacher_to_subject(subject_id):
    """Assign a teacher to a subject"""
    try:
        data = request.get_json()
        subject = Subject.query.get_or_404(subject_id)
        
        # Validate required fields
        required_fields = ['teacher_id']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        teacher = Teacher.query.filter_by(id=data['teacher_id'], is_active=True).first()
        if not teacher:
            return format_error_response("Teacher not found or inactive", status_code=404)
        
        subject.teacher_id = teacher.id
        db.session.commit()
        
        result = {
            'subject': subject.to_dict(),
            'teacher': {
                'id': teacher.id,
                'name': teacher.user.full_name if teacher.user else None,
                'employee_id': teacher.employee_id
            }
        }
        
        return format_response(result, "Teacher assigned to subject successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to assign teacher: {str(e)}", status_code=500)