from flask import Blueprint, request
from app import db
from app.models.attendance import Attendance
from app.models.student import Student
from app.models.subject import Subject
from app.utils.auth import require_role, require_same_user_or_role, get_current_user
from app.utils.helpers import format_response, format_error_response, paginate_query
from app.utils.validators import validate_required_fields

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('', methods=['GET'])
@require_role('admin', 'teacher')
def get_attendance_records():
    """Get attendance records with filtering"""
    try:
        current_user = get_current_user()
        query = Attendance.query
        
        # If teacher, filter by subjects they teach
        if current_user.role == 'teacher' and current_user.teacher_profile:
            teacher_subjects = [s.id for s in current_user.teacher_profile.subjects]
            if teacher_subjects:
                query = query.filter(Attendance.subject_id.in_(teacher_subjects))
        
        # Filter by student
        student_id = request.args.get('student_id')
        if student_id:
            query = query.filter_by(student_id=student_id)
        
        # Filter by date range
        start_date = request.args.get('start_date')
        if start_date:
            query = query.filter(Attendance.date >= start_date)
        
        end_date = request.args.get('end_date')
        if end_date:
            query = query.filter(Attendance.date <= end_date)
        
        # Filter by status
        status = request.args.get('status')
        if status:
            query = query.filter_by(status=status)
        
        # Filter by subject
        subject_id = request.args.get('subject_id')
        if subject_id:
            query = query.filter_by(subject_id=subject_id)
        
        query = query.order_by(Attendance.date.desc(), Attendance.student_id)
        result = paginate_query(query)
        
        # Enhance with student and subject data
        for item in result.get('items', []):
            attendance = Attendance.query.get(item['id'])
            if attendance:
                if attendance.student and attendance.student.user:
                    item['student'] = {
                        'id': attendance.student.id,
                        'student_id': attendance.student.student_id,
                        'name': attendance.student.user.full_name
                    }
                if attendance.subject:
                    item['subject'] = attendance.subject.to_dict()
        
        return format_response(result, "Attendance records retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get attendance records: {str(e)}", status_code=500)

@attendance_bp.route('/mark', methods=['POST'])
@require_role('teacher', 'admin')
def mark_attendance():
    """Mark attendance for students"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        
        # Validate required fields
        required_fields = ['attendance_records']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            return format_error_response(error_msg, status_code=400)
        
        attendance_records = data['attendance_records']
        if not isinstance(attendance_records, list):
            return format_error_response("attendance_records must be a list", status_code=400)
        
        created_records = []
        updated_records = []
        
        for record_data in attendance_records:
            # Validate each record
            record_required = ['student_id', 'date', 'status']
            is_valid, error_msg = validate_required_fields(record_data, record_required)
            if not is_valid:
                return format_error_response(f"Invalid attendance record: {error_msg}", status_code=400)
            
            # Validate status
            valid_statuses = ['present', 'absent', 'late', 'excused']
            if record_data['status'] not in valid_statuses:
                return format_error_response(f"Invalid status. Must be one of: {', '.join(valid_statuses)}", status_code=400)
            
            # Check if attendance already exists
            existing_attendance = Attendance.query.filter_by(
                student_id=record_data['student_id'],
                date=record_data['date'],
                subject_id=record_data.get('subject_id'),
                period=record_data.get('period')
            ).first()
            
            if existing_attendance:
                # Update existing record
                existing_attendance.status = record_data['status']
                existing_attendance.check_in_time = record_data.get('check_in_time')
                existing_attendance.check_out_time = record_data.get('check_out_time')
                existing_attendance.notes = record_data.get('notes')
                existing_attendance.marked_by = current_user.id
                updated_records.append(existing_attendance)
            else:
                # Create new record
                attendance = Attendance(
                    student_id=record_data['student_id'],
                    date=record_data['date'],
                    status=record_data['status'],
                    check_in_time=record_data.get('check_in_time'),
                    check_out_time=record_data.get('check_out_time'),
                    notes=record_data.get('notes'),
                    marked_by=current_user.id,
                    subject_id=record_data.get('subject_id'),
                    period=record_data.get('period')
                )
                db.session.add(attendance)
                created_records.append(attendance)
        
        db.session.commit()
        
        total_records = len(created_records) + len(updated_records)
        result = {
            'created': [record.to_dict() for record in created_records],
            'updated': [record.to_dict() for record in updated_records],
            'total_processed': total_records
        }
        
        return format_response(result, f"Successfully processed {total_records} attendance records")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to mark attendance: {str(e)}", status_code=500)

@attendance_bp.route('/student/<int:student_id>', methods=['GET'])
@require_same_user_or_role('admin', 'teacher', 'parent')
def get_student_attendance(student_id):
    """Get attendance records for a specific student"""
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
        query = Attendance.query.filter_by(student_id=student_id)
        
        # Filter by date range
        start_date = request.args.get('start_date')
        if start_date:
            query = query.filter(Attendance.date >= start_date)
        
        end_date = request.args.get('end_date')
        if end_date:
            query = query.filter(Attendance.date <= end_date)
        
        # Filter by subject
        subject_id = request.args.get('subject_id')
        if subject_id:
            query = query.filter_by(subject_id=subject_id)
        
        attendance_records = query.order_by(Attendance.date.desc()).all()
        
        # Calculate statistics
        total_days = len(attendance_records)
        present_days = len([a for a in attendance_records if a.status in ['present', 'late']])
        absent_days = len([a for a in attendance_records if a.status == 'absent'])
        late_days = len([a for a in attendance_records if a.status == 'late'])
        excused_days = len([a for a in attendance_records if a.status == 'excused'])
        
        attendance_percentage = round((present_days / total_days) * 100, 2) if total_days > 0 else 0
        
        # Format attendance data
        attendance_data = []
        for record in attendance_records:
            record_dict = record.to_dict()
            if record.subject:
                record_dict['subject'] = {
                    'id': record.subject.id,
                    'name': record.subject.name,
                    'code': record.subject.code
                }
            attendance_data.append(record_dict)
        
        result = {
            'student': {
                'id': student.id,
                'student_id': student.student_id,
                'name': student.user.full_name if student.user else None
            },
            'attendance_records': attendance_data,
            'statistics': {
                'total_days': total_days,
                'present_days': present_days,
                'absent_days': absent_days,
                'late_days': late_days,
                'excused_days': excused_days,
                'attendance_percentage': attendance_percentage
            }
        }
        
        return format_response(result, "Student attendance retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get student attendance: {str(e)}", status_code=500)

@attendance_bp.route('/class/<int:class_id>', methods=['GET'])
@require_role('admin', 'teacher')
def get_class_attendance(class_id):
    """Get attendance summary for a class"""
    try:
        from app.models.class_model import Class
        
        class_obj = Class.query.get_or_404(class_id)
        
        # Get query parameters
        date = request.args.get('date')
        if not date:
            return format_error_response("Date parameter is required", status_code=400)
        
        # Get students in the class
        students = class_obj.students.filter_by(is_active=True).all()
        
        attendance_summary = []
        for student in students:
            # Get attendance for this student on this date
            attendance_records = Attendance.query.filter_by(
                student_id=student.id,
                date=date
            ).all()
            
            student_summary = {
                'student': {
                    'id': student.id,
                    'student_id': student.student_id,
                    'name': student.user.full_name if student.user else None
                },
                'attendance_records': [record.to_dict() for record in attendance_records],
                'overall_status': 'absent'  # Default to absent
            }
            
            # Determine overall status for the day
            if attendance_records:
                statuses = [record.status for record in attendance_records]
                if 'present' in statuses:
                    student_summary['overall_status'] = 'present'
                elif 'late' in statuses:
                    student_summary['overall_status'] = 'late'
                elif 'excused' in statuses:
                    student_summary['overall_status'] = 'excused'
            
            attendance_summary.append(student_summary)
        
        # Calculate class statistics
        total_students = len(students)
        present_count = len([s for s in attendance_summary if s['overall_status'] in ['present', 'late']])
        absent_count = total_students - present_count
        
        result = {
            'class': class_obj.to_dict(),
            'date': date,
            'attendance_summary': attendance_summary,
            'statistics': {
                'total_students': total_students,
                'present_count': present_count,
                'absent_count': absent_count,
                'attendance_rate': round((present_count / total_students) * 100, 2) if total_students > 0 else 0
            }
        }
        
        return format_response(result, f"Class attendance for {class_obj.name} retrieved successfully")
        
    except Exception as e:
        return format_error_response(f"Failed to get class attendance: {str(e)}", status_code=500)

@attendance_bp.route('/<int:attendance_id>', methods=['PUT'])
@require_role('teacher', 'admin')
def update_attendance(attendance_id):
    """Update an attendance record"""
    try:
        data = request.get_json()
        current_user = get_current_user()
        
        attendance = Attendance.query.get_or_404(attendance_id)
        
        # Check if teacher has permission to update this record
        if current_user.role == 'teacher':
            if not current_user.teacher_profile:
                return format_error_response("Teacher profile not found", status_code=404)
            
            # Teachers can only update records they marked or for subjects they teach
            if (attendance.marked_by != current_user.id and 
                attendance.subject_id not in [s.id for s in current_user.teacher_profile.subjects]):
                return format_error_response("Access denied", status_code=403)
        
        # Update fields if provided
        if 'status' in data:
            valid_statuses = ['present', 'absent', 'late', 'excused']
            if data['status'] not in valid_statuses:
                return format_error_response(f"Invalid status. Must be one of: {', '.join(valid_statuses)}", status_code=400)
            attendance.status = data['status']
        
        if 'check_in_time' in data:
            attendance.check_in_time = data['check_in_time']
        
        if 'check_out_time' in data:
            attendance.check_out_time = data['check_out_time']
        
        if 'notes' in data:
            attendance.notes = data['notes']
        
        # Update marked_by to current user
        attendance.marked_by = current_user.id
        
        db.session.commit()
        return format_response(attendance.to_dict(), "Attendance record updated successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to update attendance: {str(e)}", status_code=500)

@attendance_bp.route('/<int:attendance_id>', methods=['DELETE'])
@require_role('admin')
def delete_attendance(attendance_id):
    """Delete an attendance record (admin only)"""
    try:
        attendance = Attendance.query.get_or_404(attendance_id)
        
        db.session.delete(attendance)
        db.session.commit()
        
        return format_response(None, "Attendance record deleted successfully")
        
    except Exception as e:
        db.session.rollback()
        return format_error_response(f"Failed to delete attendance: {str(e)}", status_code=500)