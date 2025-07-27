from flask import Blueprint, request
from app import db
from app.models.report_card import ReportCard
from app.models.student import Student
from app.utils.auth import require_role, require_same_user_or_role, get_current_user
from app.utils.helpers import format_response, format_error_response, paginate_query, get_current_academic_year
from app.utils.validators import validate_required_fields

report_card_bp = Blueprint('report_card', __name__)

@report_card_bp.route('', methods=['GET'])
@require_role('admin', 'teacher')
def get_report_cards():
    """Get report cards with filtering"""
    try:
        query = ReportCard.query
        
        # Filter by student
        student_id = request.args.get('student_id')
        if student_id:
            query = query.filter_by(student_id=student_id)
        
        # Filter by academic year
        academic_year = request.args.get('academic_year')
        if academic_year:
            query = query.filter_by(academic_year=academic_year)
        
        # Filter by semester
        semester = request.args.get('semester')
        if semester:
            query = query.filter_by(semester=semester)
        
        # Filter by published status
        is_published = request.args.get('is_published')
        if is_published is not None:
            query = query.filter_by(is_published=is_published.lower() == 'true')
        
        query = query.order_by(ReportCard.created_at.desc())
        result = paginate_query(query)
        
        # Enhance with student data
        for item in result.get('items', []):
            report_card = ReportCard.query.get(item['id'])
            if report_card and report_card.student and report_card.student.user:
                item['student'] = {
                    'id': report_card.student.id,
                    'student_id': report_card.student.student_id,
                    'name': report_card.student.user.full_name
                }
        
        return format_response(result, "Report cards retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get report cards: {str(e)}", status_code=500)

@report_card_bp.route('/<int:report_card_id>', methods=['GET'])
@require_same_user_or_role('admin', 'teacher', 'parent')
def get_report_card(report_card_id):
    """Get specific report card by ID"""
    try:
        report_card = ReportCard.query.get_or_404(report_card_id)
        current_user = get_current_user()
        
        # Check access permissions
        if current_user.role == 'parent':
            if not current_user.parent_profile:
                return format_error_response("Parent profile not found", status_code=404)
            if report_card.student not in current_user.parent_profile.children:
                return format_error_response("Access denied", status_code=403)
        elif current_user.role == 'student':
            if not current_user.student_profile or report_card.student_id != current_user.student_profile.id:
                return format_error_response("Access denied", status_code=403)
            # Students can only see published report cards
            if not report_card.is_published:
                return format_error_response("Report card not published", status_code=404)
        
        report_card_data = report_card.to_dict()
        
        # Add student information
        if report_card.student and report_card.student.user:
            report_card_data['student'] = {
                'id': report_card.student.id,
                'student_id': report_card.student.student_id,
                'name': report_card.student.user.full_name
            }
        
        # Add class information
        if report_card.student and report_card.student.class_ref:
            report_card_data['class'] = report_card.student.class_ref.to_dict()
        
        # Add detailed grades breakdown
        from app.models.grade import Grade
        from app.models.subject import Subject
        
        grades = Grade.query.filter_by(
            student_id=report_card.student_id,
            is_published=True
        ).join(Grade.subject).filter_by(academic_year=report_card.academic_year).all()
        
        subjects_breakdown = {}
        for grade in grades:
            subject_name = grade.subject.name
            if subject_name not in subjects_breakdown:
                subjects_breakdown[subject_name] = {
                    'subject_code': grade.subject.code,
                    'credits': grade.subject.credits,
                    'grades': [],
                    'average_grade': 0.0,
                    'letter_grade': 'F'
                }
            
            subjects_breakdown[subject_name]['grades'].append({
                'type': grade.grade_type,
                'assignment': grade.assignment_name,
                'grade_value': grade.grade_value,
                'letter_grade': grade.letter_grade,
                'date': grade.graded_date.isoformat() if grade.graded_date else None
            })
        
        # Calculate subject averages
        for subject_name, subject_data in subjects_breakdown.items():
            if subject_data['grades']:
                total_points = sum([g['grade_value'] for g in subject_data['grades'] if g['grade_value']])
                subject_data['average_grade'] = round(total_points / len(subject_data['grades']), 2)
                
                # Calculate letter grade
                avg = subject_data['average_grade']
                if avg >= 90:
                    subject_data['letter_grade'] = 'A'
                elif avg >= 80:
                    subject_data['letter_grade'] = 'B'
                elif avg >= 70:
                    subject_data['letter_grade'] = 'C'
                elif avg >= 60:
                    subject_data['letter_grade'] = 'D'
                else:
                    subject_data['letter_grade'] = 'F'
        
        report_card_data['subjects_breakdown'] = subjects_breakdown
        
        return format_response(report_card_data, "Report card retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get report card: {str(e)}", status_code=500)

@report_card_bp.route('', methods=['POST'])
@require_role('admin', 'teacher')
def create_report_card():
    """Create a new report card"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        
        # Validate required fields
        required_fields = ['student_id']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        # Validate student exists
        student = Student.query.filter_by(id=data['student_id'], is_active=True).first()
        if not student:
            return format_error_response("Student not found or inactive", status_code=404)
        
        # Set defaults
        academic_year = data.get('academic_year', get_current_academic_year())
        semester = data.get('semester', 'full_year')
        
        # Check if report card already exists
        existing_report = ReportCard.query.filter_by(
            student_id=data['student_id'],
            academic_year=academic_year,
            semester=semester
        ).first()
        
        if existing_report:
            return format_error_response("Report card already exists for this student, academic year, and semester", status_code=409)
        
        # Create report card
        report_card = ReportCard(
            student_id=data['student_id'],
            academic_year=academic_year,
            semester=semester,
            generated_by=current_user.id
        )
        
        db.session.add(report_card)
        db.session.commit()
        
        return format_response(report_card.to_dict(), "Report card created successfully", status_code=201)
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to create report card: {str(e)}", status_code=500)

@report_card_bp.route('/<int:report_card_id>', methods=['PUT'])
@require_role('admin', 'teacher')
def update_report_card(report_card_id):
    """Update report card information"""
    try:
        data = request.get_json()
        report_card = ReportCard.query.get_or_404(report_card_id)
        
        # Update fields if provided
        if 'teacher_comments' in data:
            report_card.teacher_comments = data['teacher_comments']
        
        if 'principal_comments' in data:
            report_card.principal_comments = data['principal_comments']
        
        if 'behavior_grade' in data:
            report_card.behavior_grade = data['behavior_grade']
        
        if 'conduct_points' in data:
            report_card.conduct_points = int(data['conduct_points'])
        
        if 'extracurricular_activities' in data:
            report_card.extracurricular_activities = data['extracurricular_activities']
        
        if 'achievements' in data:
            report_card.achievements = data['achievements']
        
        if 'areas_for_improvement' in data:
            report_card.areas_for_improvement = data['areas_for_improvement']
        
        if 'next_term_begins' in data:
            report_card.next_term_begins = data['next_term_begins']
        
        if 'is_promoted' in data:
            report_card.is_promoted = data['is_promoted']
        
        # Recalculate metrics
        report_card.calculate_metrics()
        
        db.session.commit()
        return format_response(report_card.to_dict(), "Report card updated successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to update report card: {str(e)}", status_code=500)

@report_card_bp.route('/<int:report_card_id>/publish', methods=['PATCH'])
@require_role('admin', 'teacher')
def publish_report_card(report_card_id):
    """Publish a report card"""
    try:
        report_card = ReportCard.query.get_or_404(report_card_id)
        
        # Publish the report card
        report_card.publish()
        
        db.session.commit()
        
        return format_response(report_card.to_dict(), "Report card published successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to publish report card: {str(e)}", status_code=500)

@report_card_bp.route('/student/<int:student_id>', methods=['GET'])
@require_same_user_or_role('admin', 'teacher', 'parent')
def get_student_report_cards(student_id):
    """Get all report cards for a specific student"""
    try:
        student = Student.query.get_or_404(student_id)
        current_user = get_current_user()
        
        # Check access permissions
        if current_user.role == 'parent':
            if not current_user.parent_profile:
                return format_error_response("Parent profile not found", status_code=404)
            if student not in current_user.parent_profile.children:
                return format_error_response("Access denied", status_code=403)
        elif current_user.role == 'student':
            if not current_user.student_profile or student.id != current_user.student_profile.id:
                return format_error_response("Access denied", status_code=403)
        
        # Build query
        query = ReportCard.query.filter_by(student_id=student_id)
        
        # Students and parents can only see published report cards
        if current_user.role in ['student', 'parent']:
            query = query.filter_by(is_published=True)
        
        # Filter by academic year
        academic_year = request.args.get('academic_year')
        if academic_year:
            query = query.filter_by(academic_year=academic_year)
        
        report_cards = query.order_by(ReportCard.academic_year.desc(), ReportCard.semester).all()
        
        report_cards_data = []
        for report_card in report_cards:
            report_data = report_card.to_dict()
            report_cards_data.append(report_data)
        
        result = {
            'student': {
                'id': student.id,
                'student_id': student.student_id,
                'name': student.user.full_name if student.user else None
            },
            'report_cards': report_cards_data
        }
        
        return format_response(result, "Student report cards retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get student report cards: {str(e)}", status_code=500)

@report_card_bp.route('/class/<int:class_id>/generate', methods=['POST'])
@require_role('admin', 'teacher')
def generate_class_report_cards(class_id):
    """Generate report cards for all students in a class"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        
        from app.models.class_model import Class
        class_obj = Class.query.get_or_404(class_id)
        
        # Set defaults
        academic_year = data.get('academic_year', get_current_academic_year())
        semester = data.get('semester', 'full_year')
        
        # Get all active students in the class
        students = class_obj.students.filter_by(is_active=True).all()
        
        created_report_cards = []
        skipped_students = []
        
        for student in students:
            # Check if report card already exists
            existing_report = ReportCard.query.filter_by(
                student_id=student.id,
                academic_year=academic_year,
                semester=semester
            ).first()
            
            if existing_report:
                skipped_students.append({
                    'student_id': student.id,
                    'name': student.user.full_name if student.user else None,
                    'reason': 'Report card already exists'
                })
                continue
            
            # Create report card
            report_card = ReportCard(
                student_id=student.id,
                academic_year=academic_year,
                semester=semester,
                generated_by=current_user.id
            )
            
            db.session.add(report_card)
            created_report_cards.append(report_card)
        
        db.session.commit()
        
        result = {
            'class': class_obj.to_dict(),
            'created_count': len(created_report_cards),
            'skipped_count': len(skipped_students),
            'created_report_cards': [rc.to_dict() for rc in created_report_cards[:10]],  # First 10 for preview
            'skipped_students': skipped_students
        }
        
        return format_response(result, f"Generated {len(created_report_cards)} report cards for {class_obj.name}")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to generate class report cards: {str(e)}", status_code=500)

@report_card_bp.route('/<int:report_card_id>/add-parent-comment', methods=['PATCH'])
@require_role('parent')
def add_parent_comment(report_card_id):
    """Add parent comment to report card"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        report_card = ReportCard.query.get_or_404(report_card_id)
        
        # Check if parent has access to this report card
        if not current_user.parent_profile:
            return format_error_response("Parent profile not found", status_code=404)
        
        if report_card.student not in current_user.parent_profile.children:
            return format_error_response("Access denied", status_code=403)
        
        # Validate required fields
        required_fields = ['parent_comments']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        report_card.parent_comments = data['parent_comments']
        db.session.commit()
        
        return format_response(report_card.to_dict(), "Parent comment added successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to add parent comment: {str(e)}", status_code=500)

@report_card_bp.route('/<int:report_card_id>', methods=['DELETE'])
@require_role('admin')
def delete_report_card(report_card_id):
    """Delete report card (admin only)"""
    try:
        report_card = ReportCard.query.get_or_404(report_card_id)
        
        # Check if report card is published
        if report_card.is_published:
            return format_error_response("Cannot delete published report card", status_code=400)
        
        db.session.delete(report_card)
        db.session.commit()
        
        return format_response(None, "Report card deleted successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to delete report card: {str(e)}", status_code=500)