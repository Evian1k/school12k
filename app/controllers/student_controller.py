from flask import Blueprint, request
from app import db
from app.models.student import Student, parent_student
from app.models.user import User
from app.models.parent import Parent
from app.models.grade import Grade
from app.models.attendance import Attendance
from app.models.fee import Fee
from app.utils.auth import require_role, require_same_user_or_role, get_current_user
from app.utils.helpers import format_response, format_error_response, paginate_query
from app.utils.validators import validate_required_fields

student_bp = Blueprint('student', __name__)

@student_bp.route('', methods=['GET'])
@require_role('admin', 'teacher')
def get_students():
    """Get all students with pagination and filtering"""
    try:
        query = Student.query.filter_by(is_active=True).join(Student.user)
        
        # Filter by class
        class_id = request.args.get('class_id')
        if class_id:
            query = query.filter_by(class_id=class_id)
        
        # Search functionality
        search = request.args.get('search')
        if search:
            query = query.filter(
                db.or_(
                    Student.student_id.ilike(f'%{search}%'),
                    User.first_name.ilike(f'%{search}%'),
                    User.last_name.ilike(f'%{search}%'),
                    User.email.ilike(f'%{search}%')
                )
            )
        
        query = query.order_by(User.last_name, User.first_name)
        result = paginate_query(query)
        
        # Enhance with user data
        for item in result.get('items', []):
            student = Student.query.get(item['id'])
            if student and student.user:
                item['user'] = student.user.to_dict()
        
        return format_response(result, "Students retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get students: {str(e)}", status_code=500)

@student_bp.route('/<int:student_id>', methods=['GET'])
@require_same_user_or_role('admin', 'teacher', 'parent')
def get_student(student_id):
    """Get specific student by ID"""
    try:
        student = Student.query.get_or_404(student_id)
        current_user = get_current_user()
        
        # Check if parent is accessing their own child
        if current_user.role == 'parent':
            parent = current_user.parent_profile
            if parent and student not in parent.children:
                return format_error_response("Access denied - not your child", status_code=403)
        
        student_data = student.to_dict()
        if student.user:
            student_data['user'] = student.user.to_dict()
        
        # Add class information if enrolled
        if student.class_ref:
            student_data['class'] = student.class_ref.to_dict()
        
        # Add parents information
        parents_data = []
        for parent in student.parents:
            if parent.user:
                parent_info = parent.to_dict()
                parent_info['user'] = parent.user.to_dict()
                parents_data.append(parent_info)
        student_data['parents'] = parents_data
        
        return format_response(student_data, "Student retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get student: {str(e)}", status_code=500)

@student_bp.route('/<int:student_id>/grades', methods=['GET'])
@require_same_user_or_role('admin', 'teacher', 'parent')
def get_student_grades(student_id):
    """Get student's grades"""
    try:
        student = Student.query.get_or_404(student_id)
        current_user = get_current_user()
        
        # Check access permissions
        if current_user.role == 'parent':
            parent = current_user.parent_profile
            if parent and student not in parent.children:
                return format_error_response("Access denied", status_code=403)
        elif current_user.role == 'student':
            if student.user_id != current_user.id:
                return format_error_response("Access denied", status_code=403)
        
        # Get grades with optional filtering
        query = Grade.query.filter_by(student_id=student_id)
        
        subject_id = request.args.get('subject_id')
        if subject_id:
            query = query.filter_by(subject_id=subject_id)
        
        academic_year = request.args.get('academic_year')
        if academic_year:
            query = query.join(Grade.subject).filter_by(academic_year=academic_year)
        
        # Only show published grades unless user is admin or teacher
        if current_user.role not in ['admin', 'teacher']:
            query = query.filter_by(is_published=True)
        
        grades = query.order_by(Grade.graded_date.desc()).all()
        
        grades_data = []
        for grade in grades:
            grade_dict = grade.to_dict()
            if grade.subject:
                grade_dict['subject'] = grade.subject.to_dict()
            if grade.teacher and grade.teacher.user:
                grade_dict['teacher'] = {
                    'id': grade.teacher.id,
                    'name': grade.teacher.user.full_name
                }
            grades_data.append(grade_dict)
        
        return format_response(grades_data, "Student grades retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get student grades: {str(e)}", status_code=500)

@student_bp.route('/<int:student_id>/attendance', methods=['GET'])
@require_same_user_or_role('admin', 'teacher', 'parent')
def get_student_attendance(student_id):
    """Get student's attendance records"""
    try:
        student = Student.query.get_or_404(student_id)
        current_user = get_current_user()
        
        # Check access permissions
        if current_user.role == 'parent':
            parent = current_user.parent_profile
            if parent and student not in parent.children:
                return format_error_response("Access denied", status_code=403)
        elif current_user.role == 'student':
            if student.user_id != current_user.id:
                return format_error_response("Access denied", status_code=403)
        
        # Get attendance with optional filtering
        query = Attendance.query.filter_by(student_id=student_id)
        
        start_date = request.args.get('start_date')
        if start_date:
            query = query.filter(Attendance.date >= start_date)
        
        end_date = request.args.get('end_date')
        if end_date:
            query = query.filter(Attendance.date <= end_date)
        
        attendance_records = query.order_by(Attendance.date.desc()).all()
        
        # Calculate attendance statistics
        total_days = len(attendance_records)
        present_days = len([a for a in attendance_records if a.is_present])
        attendance_percentage = round((present_days / total_days) * 100, 2) if total_days > 0 else 0
        
        attendance_data = []
        for record in attendance_records:
            record_dict = record.to_dict()
            if record.subject:
                record_dict['subject'] = record.subject.to_dict()
            attendance_data.append(record_dict)
        
        result = {
            'attendance_records': attendance_data,
            'statistics': {
                'total_days': total_days,
                'present_days': present_days,
                'absent_days': total_days - present_days,
                'attendance_percentage': attendance_percentage
            }
        }
        
        return format_response(result, "Student attendance retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get student attendance: {str(e)}", status_code=500)

@student_bp.route('/<int:student_id>/fees', methods=['GET'])
@require_same_user_or_role('admin', 'parent')
def get_student_fees(student_id):
    """Get student's fee records"""
    try:
        student = Student.query.get_or_404(student_id)
        current_user = get_current_user()
        
        # Check access permissions
        if current_user.role == 'parent':
            parent = current_user.parent_profile
            if parent and student not in parent.children:
                return format_error_response("Access denied", status_code=403)
        
        # Get fees with optional filtering
        query = Fee.query.filter_by(student_id=student_id)
        
        status = request.args.get('status')
        if status:
            query = query.filter_by(status=status)
        
        academic_year = request.args.get('academic_year')
        if academic_year:
            query = query.filter_by(academic_year=academic_year)
        
        fees = query.order_by(Fee.due_date.desc()).all()
        
        # Calculate fee statistics
        total_amount = sum([float(fee.amount) for fee in fees])
        paid_amount = sum([float(fee.paid_amount or 0) for fee in fees])
        balance_due = total_amount - paid_amount
        
        fees_data = [fee.to_dict() for fee in fees]
        
        result = {
            'fees': fees_data,
            'statistics': {
                'total_fees': len(fees),
                'total_amount': total_amount,
                'paid_amount': paid_amount,
                'balance_due': balance_due,
                'overdue_count': len([f for f in fees if f.is_overdue])
            }
        }
        
        return format_response(result, "Student fees retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get student fees: {str(e)}", status_code=500)

@student_bp.route('/<int:student_id>/assign-parent', methods=['POST'])
@require_role('admin')
def assign_parent_to_student(student_id):
    """Assign a parent to a student"""
    try:
        data = request.get_json()
        student = Student.query.get_or_404(student_id)
        
        # Validate required fields
        required_fields = ['parent_id']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        parent = Parent.query.get_or_404(data['parent_id'])
        
        # Check if relationship already exists
        if student in parent.children:
            return format_error_response("Parent is already assigned to this student", status_code=409)
        
        # Add the relationship
        parent.children.append(student)
        db.session.commit()
        
        return format_response(
            {'student': student.to_dict(), 'parent': parent.to_dict()},
            "Parent assigned to student successfully"
        )
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to assign parent: {str(e)}", status_code=500)