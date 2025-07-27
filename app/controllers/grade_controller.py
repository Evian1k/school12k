from flask import Blueprint, request
from app import db
from app.models.grade import Grade
from app.models.student import Student
from app.models.subject import Subject
from app.models.teacher import Teacher
from app.utils.auth import require_role, require_same_user_or_role, get_current_user
from app.utils.helpers import format_response, format_error_response, paginate_query
from app.utils.validators import validate_required_fields, validate_grade_value

grade_bp = Blueprint('grade', __name__)

@grade_bp.route('', methods=['GET'])
@require_role('admin', 'teacher')
def get_grades():
    """Get all grades with pagination and filtering"""
    try:
        current_user = get_current_user()
        query = Grade.query
        
        # If teacher, only show their grades
        if current_user.role == 'teacher' and current_user.teacher_profile:
            query = query.filter_by(teacher_id=current_user.teacher_profile.id)
        
        # Filter by student
        student_id = request.args.get('student_id')
        if student_id:
            query = query.filter_by(student_id=student_id)
        
        # Filter by subject
        subject_id = request.args.get('subject_id')
        if subject_id:
            query = query.filter_by(subject_id=subject_id)
        
        # Filter by grade type
        grade_type = request.args.get('grade_type')
        if grade_type:
            query = query.filter_by(grade_type=grade_type)
        
        # Filter by published status
        is_published = request.args.get('is_published')
        if is_published is not None:
            query = query.filter_by(is_published=is_published.lower() == 'true')
        
        # Filter by academic year
        academic_year = request.args.get('academic_year')
        if academic_year:
            query = query.join(Grade.subject).filter(Subject.academic_year == academic_year)
        
        query = query.order_by(Grade.graded_date.desc())
        result = paginate_query(query)
        
        # Enhance with related data
        for item in result.get('items', []):
            grade = Grade.query.get(item['id'])
            if grade:
                if grade.student and grade.student.user:
                    item['student'] = {
                        'id': grade.student.id,
                        'student_id': grade.student.student_id,
                        'name': grade.student.user.full_name
                    }
                if grade.subject:
                    item['subject'] = grade.subject.to_dict()
                if grade.teacher and grade.teacher.user:
                    item['teacher'] = {
                        'id': grade.teacher.id,
                        'name': grade.teacher.user.full_name
                    }
        
        return format_response(result, "Grades retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get grades: {str(e)}", status_code=500)

@grade_bp.route('/<int:grade_id>', methods=['GET'])
@require_same_user_or_role('admin', 'teacher', 'parent')
def get_grade(grade_id):
    """Get specific grade by ID"""
    try:
        grade = Grade.query.get_or_404(grade_id)
        current_user = get_current_user()
        
        # Check access permissions
        if current_user.role == 'teacher':
            if not current_user.teacher_profile or grade.teacher_id != current_user.teacher_profile.id:
                return format_error_response("Access denied", status_code=403)
        elif current_user.role == 'parent':
            if not current_user.parent_profile:
                return format_error_response("Parent profile not found", status_code=404)
            if grade.student not in current_user.parent_profile.children:
                return format_error_response("Access denied", status_code=403)
        elif current_user.role == 'student':
            if not current_user.student_profile or grade.student_id != current_user.student_profile.id:
                return format_error_response("Access denied", status_code=403)
            # Students can only see published grades
            if not grade.is_published:
                return format_error_response("Grade not published", status_code=404)
        
        grade_data = grade.to_dict()
        
        # Add related information
        if grade.student and grade.student.user:
            grade_data['student'] = {
                'id': grade.student.id,
                'student_id': grade.student.student_id,
                'name': grade.student.user.full_name
            }
        
        if grade.subject:
            grade_data['subject'] = grade.subject.to_dict()
        
        if grade.teacher and grade.teacher.user:
            grade_data['teacher'] = {
                'id': grade.teacher.id,
                'name': grade.teacher.user.full_name,
                'employee_id': grade.teacher.employee_id
            }
        
        return format_response(grade_data, "Grade retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get grade: {str(e)}", status_code=500)

@grade_bp.route('', methods=['POST'])
@require_role('teacher')
def create_grade():
    """Create a new grade (teachers only)"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        teacher = current_user.teacher_profile
        
        if not teacher:
            return format_error_response("Teacher profile not found", status_code=404)
        
        # Validate required fields
        required_fields = ['student_id', 'subject_id', 'grade_type']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        # Verify teacher teaches this subject
        subject = Subject.query.filter_by(
            id=data['subject_id'],
            teacher_id=teacher.id,
            is_active=True
        ).first()
        
        if not subject:
            return format_error_response("You are not authorized to grade this subject", status_code=403)
        
        # Validate student exists and is active
        student = Student.query.filter_by(id=data['student_id'], is_active=True).first()
        if not student:
            return format_error_response("Student not found or inactive", status_code=404)
        
        # Validate grade value if provided
        if 'grade_value' in data:
            is_valid, error_msg = validate_grade_value(data['grade_value'])
            if not is_valid:
                return format_error_response(error_msg, status_code=400)
        
        # Create grade
        grade = Grade(
            student_id=data['student_id'],
            subject_id=data['subject_id'],
            teacher_id=teacher.id,
            grade_type=data['grade_type'],
            assignment_name=data.get('assignment_name'),
            grade_value=data.get('grade_value'),
            max_points=data.get('max_points', 100.0),
            earned_points=data.get('earned_points'),
            weight=data.get('weight', 1.0),
            due_date=data.get('due_date'),
            comments=data.get('comments')
        )
        
        db.session.add(grade)
        db.session.commit()
        
        return format_response(grade.to_dict(), "Grade created successfully", status_code=201)
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to create grade: {str(e)}", status_code=500)

@grade_bp.route('/<int:grade_id>', methods=['PUT'])
@require_role('teacher')
def update_grade(grade_id):
    """Update grade information (teachers only)"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        teacher = current_user.teacher_profile
        
        if not teacher:
            return format_error_response("Teacher profile not found", status_code=404)
        
        grade = Grade.query.filter_by(id=grade_id, teacher_id=teacher.id).first()
        if not grade:
            return format_error_response("Grade not found or access denied", status_code=404)
        
        # Update fields if provided
        if 'assignment_name' in data:
            grade.assignment_name = data['assignment_name']
        
        if 'grade_value' in data:
            is_valid, error_msg = validate_grade_value(data['grade_value'])
            if not is_valid:
                return format_error_response(error_msg, status_code=400)
            grade.grade_value = data['grade_value']
            grade.letter_grade = grade.calculate_letter_grade()
        
        if 'max_points' in data:
            grade.max_points = float(data['max_points'])
        
        if 'earned_points' in data:
            grade.earned_points = float(data['earned_points'])
            # Recalculate grade_value and letter_grade
            if grade.max_points > 0:
                grade.grade_value = round((grade.earned_points / grade.max_points) * 100, 2)
                grade.letter_grade = grade.calculate_letter_grade()
        
        if 'weight' in data:
            grade.weight = float(data['weight'])
        
        if 'due_date' in data:
            grade.due_date = data['due_date']
        
        if 'comments' in data:
            grade.comments = data['comments']
        
        db.session.commit()
        return format_response(grade.to_dict(), "Grade updated successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to update grade: {str(e)}", status_code=500)

@grade_bp.route('/<int:grade_id>', methods=['DELETE'])
@require_role('teacher')
def delete_grade(grade_id):
    """Delete grade (teachers only)"""
    try:
        current_user = get_current_user()
        teacher = current_user.teacher_profile
        
        if not teacher:
            return format_error_response("Teacher profile not found", status_code=404)
        
        grade = Grade.query.filter_by(id=grade_id, teacher_id=teacher.id).first()
        if not grade:
            return format_error_response("Grade not found or access denied", status_code=404)
        
        db.session.delete(grade)
        db.session.commit()
        
        return format_response(None, "Grade deleted successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to delete grade: {str(e)}", status_code=500)

@grade_bp.route('/<int:grade_id>/publish', methods=['PATCH'])
@require_role('teacher')
def publish_grade(grade_id):
    """Publish a grade to make it visible to students/parents"""
    try:
        current_user = get_current_user()
        teacher = current_user.teacher_profile
        
        if not teacher:
            return format_error_response("Teacher profile not found", status_code=404)
        
        grade = Grade.query.filter_by(id=grade_id, teacher_id=teacher.id).first()
        if not grade:
            return format_error_response("Grade not found or access denied", status_code=404)
        
        grade.is_published = True
        db.session.commit()
        
        return format_response(grade.to_dict(), "Grade published successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to publish grade: {str(e)}", status_code=500)

@grade_bp.route('/bulk-create', methods=['POST'])
@require_role('teacher')
def bulk_create_grades():
    """Create multiple grades at once"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        teacher = current_user.teacher_profile
        
        if not teacher:
            return format_error_response("Teacher profile not found", status_code=404)
        
        # Validate required fields
        required_fields = ['grades']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        grades_data = data['grades']
        if not isinstance(grades_data, list):
            return format_error_response("grades must be a list", status_code=400)
        
        created_grades = []
        
        for grade_data in grades_data:
            # Validate each grade
            grade_required = ['student_id', 'subject_id', 'grade_type']
            is_valid, error_msg = validate_required_fields(grade_data, grade_required)
            if not is_valid:
                return format_error_response(f"Invalid grade data: {error_msg}", status_code=400)
            
            # Verify teacher teaches this subject
            subject = Subject.query.filter_by(
                id=grade_data['subject_id'],
                teacher_id=teacher.id,
                is_active=True
            ).first()
            
            if not subject:
                return format_error_response(f"Not authorized to grade subject {grade_data['subject_id']}", status_code=403)
            
            # Create grade
            grade = Grade(
                student_id=grade_data['student_id'],
                subject_id=grade_data['subject_id'],
                teacher_id=teacher.id,
                grade_type=grade_data['grade_type'],
                assignment_name=grade_data.get('assignment_name'),
                grade_value=grade_data.get('grade_value'),
                max_points=grade_data.get('max_points', 100.0),
                earned_points=grade_data.get('earned_points'),
                weight=grade_data.get('weight', 1.0),
                due_date=grade_data.get('due_date'),
                comments=grade_data.get('comments')
            )
            
            db.session.add(grade)
            created_grades.append(grade)
        
        db.session.commit()
        
        result = [grade.to_dict() for grade in created_grades]
        return format_response(result, f"Successfully created {len(created_grades)} grades", status_code=201)
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to create grades: {str(e)}", status_code=500)