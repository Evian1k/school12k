from flask import Blueprint, request
from app import db
from app.models.user import User
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.parent import Parent
from app.models.class_model import Class
from app.models.subject import Subject
from app.models.fee import Fee
from app.models.notification import Notification
from app.utils.auth import require_role, get_current_user
from app.utils.helpers import format_response, format_error_response, paginate_query
from app.utils.validators import validate_required_fields

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
@require_role('admin')
def get_dashboard_stats():
    """Get dashboard statistics for admin"""
    try:
        stats = {
            'users': {
                'total': User.query.count(),
                'students': User.query.filter_by(role='student', is_active=True).count(),
                'teachers': User.query.filter_by(role='teacher', is_active=True).count(),
                'parents': User.query.filter_by(role='parent', is_active=True).count(),
                'admins': User.query.filter_by(role='admin', is_active=True).count(),
                'inactive': User.query.filter_by(is_active=False).count()
            },
            'classes': {
                'total': Class.query.filter_by(is_active=True).count(),
                'with_students': Class.query.join(Student).filter(Class.is_active == True).distinct().count()
            },
            'subjects': {
                'total': Subject.query.filter_by(is_active=True).count(),
                'with_teachers': Subject.query.filter(Subject.teacher_id.isnot(None), Subject.is_active == True).count()
            },
            'fees': {
                'total_pending': Fee.query.filter_by(status='pending').count(),
                'total_overdue': Fee.query.filter_by(status='overdue').count(),
                'total_paid': Fee.query.filter_by(status='paid').count()
            },
            'notifications': {
                'active': Notification.query.filter_by(is_active=True).count(),
                'sent': Notification.query.filter(Notification.sent_at.isnot(None)).count()
            }
        }
        
        return format_response(stats, "Dashboard statistics retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get dashboard stats: {str(e)}", status_code=500)

@admin_bp.route('/users', methods=['GET'])
@require_role('admin')
def get_all_users():
    """Get all users with pagination and filtering"""
    try:
        query = User.query
        
        # Filter by role
        role = request.args.get('role')
        if role:
            query = query.filter_by(role=role)
        
        # Filter by active status
        is_active = request.args.get('is_active')
        if is_active is not None:
            query = query.filter_by(is_active=is_active.lower() == 'true')
        
        # Search by name or email
        search = request.args.get('search')
        if search:
            query = query.filter(
                db.or_(
                    User.first_name.ilike(f'%{search}%'),
                    User.last_name.ilike(f'%{search}%'),
                    User.email.ilike(f'%{search}%')
                )
            )
        
        # Order by created_at descending
        query = query.order_by(User.created_at.desc())
        
        result = paginate_query(query)
        return format_response(result, "Users retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get users: {str(e)}", status_code=500)

@admin_bp.route('/users/<int:user_id>/toggle-status', methods=['PATCH'])
@require_role('admin')
def toggle_user_status(user_id):
    """Toggle user active status"""
    try:
        user = User.query.get_or_404(user_id)
        current_user = get_current_user()
        
        # Prevent admin from deactivating themselves
        if user.id == current_user.id:
            return format_error_response("You cannot deactivate your own account", status_code=400)
        
        user.is_active = not user.is_active
        db.session.commit()
        
        status = "activated" if user.is_active else "deactivated"
        return format_response(user.to_dict(), f"User {status} successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to toggle user status: {str(e)}", status_code=500)

@admin_bp.route('/users/<int:user_id>/assign-role', methods=['PATCH'])
@require_role('admin')
def assign_user_role(user_id):
    """Assign role to user"""
    try:
        data = request.get_json()
        user = User.query.get_or_404(user_id)
        current_user = get_current_user()
        
        # Validate required fields
        required_fields = ['role']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        # Validate role
        allowed_roles = ['admin', 'teacher', 'student', 'parent']
        if data['role'] not in allowed_roles:
            return format_error_response(f"Invalid role. Must be one of: {', '.join(allowed_roles)}", status_code=400)
        
        # Prevent admin from changing their own role
        if user.id == current_user.id:
            return format_error_response("You cannot change your own role", status_code=400)
        
        old_role = user.role
        user.role = data['role']
        db.session.commit()
        
        return format_response(user.to_dict(), f"User role changed from {old_role} to {data['role']}")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to assign role: {str(e)}", status_code=500)

@admin_bp.route('/classes', methods=['POST'])
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

@admin_bp.route('/classes/<int:class_id>/assign-students', methods=['POST'])
@require_role('admin')
def assign_students_to_class(class_id):
    """Assign students to a class"""
    try:
        data = request.get_json()
        class_obj = Class.query.get_or_404(class_id)
        
        # Validate required fields
        required_fields = ['student_ids']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        student_ids = data['student_ids']
        if not isinstance(student_ids, list):
            return format_error_response("student_ids must be a list", status_code=400)
        
        # Check class capacity
        current_count = class_obj.current_students_count
        if current_count + len(student_ids) > class_obj.max_students:
            return format_error_response(f"Class capacity exceeded. Available spots: {class_obj.available_spots}", status_code=400)
        
        # Assign students
        assigned_count = 0
        for student_id in student_ids:
            student = Student.query.get(student_id)
            if student and student.is_active:
                student.class_id = class_id
                assigned_count += 1
        
        db.session.commit()
        
        return format_response(
            {'assigned_count': assigned_count, 'class': class_obj.to_dict()},
            f"Successfully assigned {assigned_count} students to class"
        )
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to assign students: {str(e)}", status_code=500)

@admin_bp.route('/fees/bulk-create', methods=['POST'])
@require_role('admin')
def bulk_create_fees():
    """Create fees for multiple students"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        
        # Validate required fields
        required_fields = ['fee_type', 'amount', 'due_date', 'academic_year', 'target']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        target = data['target']
        created_fees = []
        
        # Get target students
        if target['type'] == 'all_students':
            students = Student.query.filter_by(is_active=True).all()
        elif target['type'] == 'class' and 'class_id' in target:
            students = Student.query.filter_by(class_id=target['class_id'], is_active=True).all()
        elif target['type'] == 'specific' and 'student_ids' in target:
            students = Student.query.filter(Student.id.in_(target['student_ids']), Student.is_active == True).all()
        else:
            return format_error_response("Invalid target specification", status_code=400)
        
        # Create fees for each student
        for student in students:
            fee = Fee(
                student_id=student.id,
                fee_type=data['fee_type'],
                amount=data['amount'],
                due_date=data['due_date'],
                academic_year=data['academic_year'],
                semester=data.get('semester', 'full_year'),
                description=data.get('description'),
                created_by=current_user.id
            )
            db.session.add(fee)
            created_fees.append(fee)
        
        db.session.commit()
        
        return format_response(
            {
                'created_count': len(created_fees),
                'fees': [fee.to_dict() for fee in created_fees[:10]]  # Return first 10 for preview
            },
            f"Successfully created {len(created_fees)} fees",
            status_code=201
        )
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to create fees: {str(e)}", status_code=500)

@admin_bp.route('/reports/financial', methods=['GET'])
@require_role('admin')
def get_financial_report():
    """Get financial report"""
    try:
        # Get query parameters
        academic_year = request.args.get('academic_year')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Base query
        query = Fee.query
        
        if academic_year:
            query = query.filter_by(academic_year=academic_year)
        
        if start_date:
            query = query.filter(Fee.due_date >= start_date)
        
        if end_date:
            query = query.filter(Fee.due_date <= end_date)
        
        fees = query.all()
        
        # Calculate totals
        total_amount = sum([float(fee.amount) for fee in fees])
        paid_amount = sum([float(fee.paid_amount or 0) for fee in fees])
        pending_amount = total_amount - paid_amount
        
        # Calculate by status
        status_breakdown = {}
        for status in ['pending', 'paid', 'partial', 'overdue']:
            status_fees = [fee for fee in fees if fee.status == status]
            status_breakdown[status] = {
                'count': len(status_fees),
                'amount': sum([float(fee.amount) for fee in status_fees])
            }
        
        # Calculate by fee type
        type_breakdown = {}
        for fee in fees:
            if fee.fee_type not in type_breakdown:
                type_breakdown[fee.fee_type] = {'count': 0, 'amount': 0}
            type_breakdown[fee.fee_type]['count'] += 1
            type_breakdown[fee.fee_type]['amount'] += float(fee.amount)
        
        report = {
            'summary': {
                'total_fees': len(fees),
                'total_amount': total_amount,
                'paid_amount': paid_amount,
                'pending_amount': pending_amount,
                'collection_rate': round((paid_amount / total_amount) * 100, 2) if total_amount > 0 else 0
            },
            'status_breakdown': status_breakdown,
            'type_breakdown': type_breakdown
        }
        
        return format_response(report, "Financial report generated successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to generate financial report: {str(e)}", status_code=500)