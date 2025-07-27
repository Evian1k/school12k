from flask import Blueprint, request
from app import db
from app.models.class_model import Class
from app.models.student import Student
from app.models.subject import Subject
from app.utils.auth import require_role, get_current_user
from app.utils.helpers import format_response, format_error_response, paginate_query
from app.utils.validators import validate_required_fields

class_bp = Blueprint('class', __name__)

@class_bp.route('', methods=['GET'])
@require_role('admin', 'teacher', 'student', 'parent')
def get_classes():
    """Get all classes with pagination and filtering"""
    try:
        query = Class.query.filter_by(is_active=True)
        
        # Filter by academic year
        academic_year = request.args.get('academic_year')
        if academic_year:
            query = query.filter_by(academic_year=academic_year)
        
        # Filter by grade level
        grade_level = request.args.get('grade_level')
        if grade_level:
            query = query.filter_by(grade_level=grade_level)
        
        # Search functionality
        search = request.args.get('search')
        if search:
            query = query.filter(
                db.or_(
                    Class.name.ilike(f'%{search}%'),
                    Class.grade_level.ilike(f'%{search}%'),
                    Class.description.ilike(f'%{search}%')
                )
            )
        
        query = query.order_by(Class.grade_level, Class.name)
        result = paginate_query(query)
        return format_response(result, "Classes retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get classes: {str(e)}", status_code=500)

@class_bp.route('/<int:class_id>', methods=['GET'])
@require_role('admin', 'teacher', 'student', 'parent')
def get_class(class_id):
    """Get specific class by ID"""
    try:
        class_obj = Class.query.get_or_404(class_id)
        class_data = class_obj.to_dict()
        
        # Add students information
        students = class_obj.students.filter_by(is_active=True).all()
        students_data = []
        for student in students:
            student_dict = student.to_dict()
            if student.user:
                student_dict['user'] = student.user.to_dict()
            students_data.append(student_dict)
        class_data['students'] = students_data
        
        # Add subjects information
        subjects = class_obj.subjects.filter_by(is_active=True).all()
        subjects_data = []
        for subject in subjects:
            subject_dict = subject.to_dict()
            if subject.teacher and subject.teacher.user:
                subject_dict['teacher'] = {
                    'id': subject.teacher.id,
                    'name': subject.teacher.user.full_name,
                    'employee_id': subject.teacher.employee_id
                }
            subjects_data.append(subject_dict)
        class_data['subjects'] = subjects_data
        
        return format_response(class_data, "Class retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get class: {str(e)}", status_code=500)

@class_bp.route('', methods=['POST'])
@require_role('admin')
def create_class():
    """Create a new class"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'grade_level', 'academic_year']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        # Check if class already exists
        existing_class = Class.query.filter_by(
            name=data['name'],
            grade_level=data['grade_level'],
            academic_year=data['academic_year']
        ).first()
        
        if existing_class:
            return format_error_response("Class with this name, grade level, and academic year already exists", status_code=409)
        
        new_class = Class(
            name=data['name'],
            grade_level=data['grade_level'],
            academic_year=data['academic_year'],
            description=data.get('description'),
            max_students=data.get('max_students', 30)
        )
        
        db.session.add(new_class)
        db.session.commit()
        
        return format_response(new_class.to_dict(), "Class created successfully", status_code=201)
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to create class: {str(e)}", status_code=500)

@class_bp.route('/<int:class_id>', methods=['PUT'])
@require_role('admin')
def update_class(class_id):
    """Update class information"""
    try:
        data = request.get_json()
        class_obj = Class.query.get_or_404(class_id)
        
        # Update fields if provided
        if 'name' in data:
            class_obj.name = data['name']
        if 'grade_level' in data:
            class_obj.grade_level = data['grade_level']
        if 'academic_year' in data:
            class_obj.academic_year = data['academic_year']
        if 'description' in data:
            class_obj.description = data['description']
        if 'max_students' in data:
            max_students = int(data['max_students'])
            if max_students < class_obj.current_students_count:
                return format_error_response(f"Cannot reduce max students below current count ({class_obj.current_students_count})", status_code=400)
            class_obj.max_students = max_students
        
        db.session.commit()
        return format_response(class_obj.to_dict(), "Class updated successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to update class: {str(e)}", status_code=500)

@class_bp.route('/<int:class_id>', methods=['DELETE'])
@require_role('admin')
def delete_class(class_id):
    """Soft delete class (deactivate)"""
    try:
        class_obj = Class.query.get_or_404(class_id)
        
        # Check if class has active students
        if class_obj.current_students_count > 0:
            return format_error_response("Cannot delete class with active students. Please reassign students first.", status_code=400)
        
        class_obj.is_active = False
        db.session.commit()
        
        return format_response(None, "Class deactivated successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to delete class: {str(e)}", status_code=500)

@class_bp.route('/<int:class_id>/students', methods=['GET'])
@require_role('admin', 'teacher')
def get_class_students(class_id):
    """Get all students in a class"""
    try:
        class_obj = Class.query.get_or_404(class_id)
        students = class_obj.students.filter_by(is_active=True).all()
        
        students_data = []
        for student in students:
            student_dict = student.to_dict()
            if student.user:
                student_dict['user'] = student.user.to_dict()
            students_data.append(student_dict)
        
        return format_response(students_data, f"Students in {class_obj.name} retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get class students: {str(e)}", status_code=500)

@class_bp.route('/<int:class_id>/subjects', methods=['GET'])
@require_role('admin', 'teacher', 'student', 'parent')
def get_class_subjects(class_id):
    """Get all subjects for a class"""
    try:
        class_obj = Class.query.get_or_404(class_id)
        subjects = class_obj.subjects.filter_by(is_active=True).all()
        
        subjects_data = []
        for subject in subjects:
            subject_dict = subject.to_dict()
            if subject.teacher and subject.teacher.user:
                subject_dict['teacher'] = {
                    'id': subject.teacher.id,
                    'name': subject.teacher.user.full_name,
                    'employee_id': subject.teacher.employee_id
                }
            subjects_data.append(subject_dict)
        
        return format_response(subjects_data, f"Subjects for {class_obj.name} retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get class subjects: {str(e)}", status_code=500)

@class_bp.route('/<int:class_id>/add-student', methods=['POST'])
@require_role('admin')
def add_student_to_class(class_id):
    """Add a student to a class"""
    try:
        data = request.get_json()
        class_obj = Class.query.get_or_404(class_id)
        
        # Validate required fields
        required_fields = ['student_id']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        student = Student.query.get_or_404(data['student_id'])
        
        # Check class capacity
        if class_obj.current_students_count >= class_obj.max_students:
            return format_error_response("Class has reached maximum capacity", status_code=400)
        
        # Check if student is already in a class
        if student.class_id:
            return format_error_response("Student is already assigned to a class", status_code=409)
        
        student.class_id = class_obj.id
        db.session.commit()
        
        return format_response(
            {'student': student.to_dict(), 'class': class_obj.to_dict()},
            "Student added to class successfully"
        )
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to add student to class: {str(e)}", status_code=500)

@class_bp.route('/<int:class_id>/remove-student', methods=['POST'])
@require_role('admin')
def remove_student_from_class(class_id):
    """Remove a student from a class"""
    try:
        data = request.get_json()
        class_obj = Class.query.get_or_404(class_id)
        
        # Validate required fields
        required_fields = ['student_id']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        student = Student.query.get_or_404(data['student_id'])
        
        # Check if student is in this class
        if student.class_id != class_obj.id:
            return format_error_response("Student is not in this class", status_code=400)
        
        student.class_id = None
        db.session.commit()
        
        return format_response(
            {'student': student.to_dict(), 'class': class_obj.to_dict()},
            "Student removed from class successfully"
        )
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to remove student from class: {str(e)}", status_code=500)