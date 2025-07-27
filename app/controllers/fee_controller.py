from flask import Blueprint, request
from app import db
from app.models.fee import Fee
from app.models.student import Student
from app.utils.auth import require_role, require_same_user_or_role, get_current_user
from app.utils.helpers import format_response, format_error_response, paginate_query, get_current_academic_year
from app.utils.validators import validate_required_fields

fee_bp = Blueprint('fee', __name__)

@fee_bp.route('', methods=['GET'])
@require_role('admin', 'parent')
def get_fees():
    """Get fees with filtering"""
    try:
        current_user = get_current_user()
        query = Fee.query
        
        # If parent, only show fees for their children
        if current_user.role == 'parent' and current_user.parent_profile:
            children_ids = [child.id for child in current_user.parent_profile.children]
            query = query.filter(Fee.student_id.in_(children_ids))
        
        # Filter by student
        student_id = request.args.get('student_id')
        if student_id:
            query = query.filter_by(student_id=student_id)
        
        # Filter by status
        status = request.args.get('status')
        if status:
            query = query.filter_by(status=status)
        
        # Filter by fee type
        fee_type = request.args.get('fee_type')
        if fee_type:
            query = query.filter_by(fee_type=fee_type)
        
        # Filter by academic year
        academic_year = request.args.get('academic_year')
        if academic_year:
            query = query.filter_by(academic_year=academic_year)
        
        # Filter by due date range
        due_date_from = request.args.get('due_date_from')
        if due_date_from:
            query = query.filter(Fee.due_date >= due_date_from)
        
        due_date_to = request.args.get('due_date_to')
        if due_date_to:
            query = query.filter(Fee.due_date <= due_date_to)
        
        query = query.order_by(Fee.due_date.desc())
        result = paginate_query(query)
        
        # Enhance with student data
        for item in result.get('items', []):
            fee = Fee.query.get(item['id'])
            if fee and fee.student and fee.student.user:
                item['student'] = {
                    'id': fee.student.id,
                    'student_id': fee.student.student_id,
                    'name': fee.student.user.full_name
                }
        
        return format_response(result, "Fees retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get fees: {str(e)}", status_code=500)

@fee_bp.route('/<int:fee_id>', methods=['GET'])
@require_same_user_or_role('admin', 'parent')
def get_fee(fee_id):
    """Get specific fee by ID"""
    try:
        fee = Fee.query.get_or_404(fee_id)
        current_user = get_current_user()
        
        # Check access permissions for parents
        if current_user.role == 'parent':
            if not current_user.parent_profile:
                return format_error_response("Parent profile not found", status_code=404)
            if fee.student not in current_user.parent_profile.children:
                return format_error_response("Access denied", status_code=403)
        
        fee_data = fee.to_dict()
        
        # Add student information
        if fee.student and fee.student.user:
            fee_data['student'] = {
                'id': fee.student.id,
                'student_id': fee.student.student_id,
                'name': fee.student.user.full_name
            }
        
        return format_response(fee_data, "Fee retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get fee: {str(e)}", status_code=500)

@fee_bp.route('', methods=['POST'])
@require_role('admin')
def create_fee():
    """Create a new fee"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        
        # Validate required fields
        required_fields = ['student_id', 'fee_type', 'amount', 'due_date']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        # Validate student exists
        student = Student.query.filter_by(id=data['student_id'], is_active=True).first()
        if not student:
            return format_error_response("Student not found or inactive", status_code=404)
        
        # Validate fee type
        valid_fee_types = ['tuition', 'library', 'laboratory', 'sports', 'transportation', 'exam', 'miscellaneous']
        if data['fee_type'] not in valid_fee_types:
            return format_error_response(f"Invalid fee type. Must be one of: {', '.join(valid_fee_types)}", status_code=400)
        
        # Set academic year if not provided
        academic_year = data.get('academic_year', get_current_academic_year())
        
        # Create fee
        fee = Fee(
            student_id=data['student_id'],
            fee_type=data['fee_type'],
            amount=data['amount'],
            due_date=data['due_date'],
            academic_year=academic_year,
            semester=data.get('semester', 'full_year'),
            description=data.get('description'),
            created_by=current_user.id
        )
        
        db.session.add(fee)
        db.session.commit()
        
        return format_response(fee.to_dict(), "Fee created successfully", status_code=201)
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to create fee: {str(e)}", status_code=500)

@fee_bp.route('/<int:fee_id>', methods=['PUT'])
@require_role('admin')
def update_fee(fee_id):
    """Update fee information"""
    try:
        data = request.get_json()
        fee = Fee.query.get_or_404(fee_id)
        
        # Update fields if provided
        if 'amount' in data:
            fee.amount = data['amount']
        
        if 'due_date' in data:
            fee.due_date = data['due_date']
        
        if 'description' in data:
            fee.description = data['description']
        
        if 'late_fee' in data:
            fee.late_fee = data['late_fee']
        
        if 'discount' in data:
            fee.discount = data['discount']
        
        if 'notes' in data:
            fee.notes = data['notes']
        
        # Update status based on changes
        fee.update_status()
        
        db.session.commit()
        return format_response(fee.to_dict(), "Fee updated successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to update fee: {str(e)}", status_code=500)

@fee_bp.route('/<int:fee_id>/payment', methods=['POST'])
@require_role('admin')
def make_payment(fee_id):
    """Process a payment for a fee"""
    try:
        data = request.get_json()
        fee = Fee.query.get_or_404(fee_id)
        current_user = get_current_user()
        
        # Validate required fields
        required_fields = ['amount']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        payment_amount = float(data['amount'])
        
        # Validate payment amount
        if payment_amount <= 0:
            return format_error_response("Payment amount must be greater than 0", status_code=400)
        
        if payment_amount > fee.balance_due:
            return format_error_response(f"Payment amount cannot exceed balance due ({fee.balance_due})", status_code=400)
        
        # Process payment
        fee.make_payment(
            amount=payment_amount,
            payment_method=data.get('payment_method'),
            transaction_id=data.get('transaction_id'),
            processed_by=current_user.id
        )
        
        db.session.commit()
        
        result = {
            'fee': fee.to_dict(),
            'payment_amount': payment_amount,
            'remaining_balance': fee.balance_due
        }
        
        return format_response(result, "Payment processed successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to process payment: {str(e)}", status_code=500)

@fee_bp.route('/student/<int:student_id>', methods=['GET'])
@require_same_user_or_role('admin', 'parent')
def get_student_fees(student_id):
    """Get all fees for a specific student"""
    try:
        student = Student.query.get_or_404(student_id)
        current_user = get_current_user()
        
        # Check access permissions for parents
        if current_user.role == 'parent':
            if not current_user.parent_profile:
                return format_error_response("Parent profile not found", status_code=404)
            if student not in current_user.parent_profile.children:
                return format_error_response("Access denied", status_code=403)
        
        # Build query
        query = Fee.query.filter_by(student_id=student_id)
        
        # Filter by status
        status = request.args.get('status')
        if status:
            query = query.filter_by(status=status)
        
        # Filter by academic year
        academic_year = request.args.get('academic_year')
        if academic_year:
            query = query.filter_by(academic_year=academic_year)
        
        fees = query.order_by(Fee.due_date.desc()).all()
        
        # Calculate statistics
        total_amount = sum([float(fee.amount) for fee in fees])
        paid_amount = sum([float(fee.paid_amount or 0) for fee in fees])
        balance_due = total_amount - paid_amount
        overdue_fees = [fee for fee in fees if fee.is_overdue]
        
        fees_data = [fee.to_dict() for fee in fees]
        
        result = {
            'student': {
                'id': student.id,
                'student_id': student.student_id,
                'name': student.user.full_name if student.user else None
            },
            'fees': fees_data,
            'statistics': {
                'total_fees': len(fees),
                'total_amount': total_amount,
                'paid_amount': paid_amount,
                'balance_due': balance_due,
                'overdue_count': len(overdue_fees),
                'overdue_amount': sum([fee.balance_due for fee in overdue_fees])
            }
        }
        
        return format_response(result, "Student fees retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get student fees: {str(e)}", status_code=500)

@fee_bp.route('/overdue', methods=['GET'])
@require_role('admin')
def get_overdue_fees():
    """Get all overdue fees"""
    try:
        fees = Fee.query.filter_by(status='overdue').order_by(Fee.due_date).all()
        
        fees_data = []
        for fee in fees:
            fee_dict = fee.to_dict()
            if fee.student and fee.student.user:
                fee_dict['student'] = {
                    'id': fee.student.id,
                    'student_id': fee.student.student_id,
                    'name': fee.student.user.full_name
                }
            fees_data.append(fee_dict)
        
        # Calculate statistics
        total_overdue_amount = sum([fee.balance_due for fee in fees])
        
        result = {
            'overdue_fees': fees_data,
            'statistics': {
                'total_overdue_fees': len(fees),
                'total_overdue_amount': total_overdue_amount
            }
        }
        
        return format_response(result, "Overdue fees retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get overdue fees: {str(e)}", status_code=500)

@fee_bp.route('/<int:fee_id>', methods=['DELETE'])
@require_role('admin')
def delete_fee(fee_id):
    """Delete a fee (admin only)"""
    try:
        fee = Fee.query.get_or_404(fee_id)
        
        # Check if fee has payments
        if fee.paid_amount and fee.paid_amount > 0:
            return format_error_response("Cannot delete fee with payments. Please refund payments first.", status_code=400)
        
        db.session.delete(fee)
        db.session.commit()
        
        return format_response(None, "Fee deleted successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to delete fee: {str(e)}", status_code=500)