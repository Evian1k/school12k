from datetime import datetime, timezone, date, timedelta
from app import create_app, db
from app.models import *
from app.utils.helpers import get_current_academic_year

def seed_database():
    """Seed the database with sample data"""
    app = create_app()
    
    with app.app_context():
        # Drop and recreate tables
        db.drop_all()
        db.create_all()
        
        # Create admin user
        admin = User(
            email='admin@school.edu',
            password='admin123',
            first_name='System',
            last_name='Administrator',
            role='admin',
            phone='+1234567890',
            address='123 School District Ave'
        )
        db.session.add(admin)
        
        # Create teachers
        teachers_data = [
            {
                'email': 'john.smith@school.edu',
                'password': 'teacher123',
                'first_name': 'John',
                'last_name': 'Smith',
                'phone': '+1234567891',
                'department': 'Mathematics',
                'employee_id': 'EMP240001',
                'qualification': 'M.S. Mathematics',
                'experience_years': 10,
                'specialization': 'Algebra and Calculus'
            },
            {
                'email': 'sarah.johnson@school.edu',
                'password': 'teacher123',
                'first_name': 'Sarah',
                'last_name': 'Johnson',
                'phone': '+1234567892',
                'department': 'English',
                'employee_id': 'EMP240002',
                'qualification': 'M.A. English Literature',
                'experience_years': 8,
                'specialization': 'Creative Writing'
            },
            {
                'email': 'mike.brown@school.edu',
                'password': 'teacher123',
                'first_name': 'Mike',
                'last_name': 'Brown',
                'phone': '+1234567893',
                'department': 'Science',
                'employee_id': 'EMP240003',
                'qualification': 'Ph.D. Physics',
                'experience_years': 12,
                'specialization': 'Physics and Chemistry'
            }
        ]
        
        teachers = []
        for teacher_data in teachers_data:
            # Create user
            user = User(
                email=teacher_data['email'],
                password=teacher_data['password'],
                first_name=teacher_data['first_name'],
                last_name=teacher_data['last_name'],
                role='teacher',
                phone=teacher_data['phone']
            )
            db.session.add(user)
            db.session.flush()
            
            # Create teacher profile
            teacher = Teacher(
                user_id=user.id,
                employee_id=teacher_data['employee_id'],
                department=teacher_data['department'],
                qualification=teacher_data['qualification'],
                experience_years=teacher_data['experience_years'],
                specialization=teacher_data['specialization']
            )
            db.session.add(teacher)
            teachers.append(teacher)
        
        # Create classes
        academic_year = get_current_academic_year()
        classes_data = [
            {'name': 'Class 9A', 'grade_level': '9th Grade', 'max_students': 30},
            {'name': 'Class 9B', 'grade_level': '9th Grade', 'max_students': 30},
            {'name': 'Class 10A', 'grade_level': '10th Grade', 'max_students': 28},
            {'name': 'Class 11A', 'grade_level': '11th Grade', 'max_students': 25},
            {'name': 'Class 12A', 'grade_level': '12th Grade', 'max_students': 25}
        ]
        
        classes = []
        for class_data in classes_data:
            class_obj = Class(
                name=class_data['name'],
                grade_level=class_data['grade_level'],
                academic_year=academic_year,
                description=f"{class_data['name']} - {academic_year}",
                max_students=class_data['max_students']
            )
            db.session.add(class_obj)
            classes.append(class_obj)
        
        db.session.flush()
        
        # Create subjects
        subjects_data = [
            {'name': 'Mathematics', 'code': 'MATH101', 'teacher_idx': 0, 'class_idx': 0, 'credits': 4},
            {'name': 'English Literature', 'code': 'ENG101', 'teacher_idx': 1, 'class_idx': 0, 'credits': 3},
            {'name': 'Physics', 'code': 'PHY101', 'teacher_idx': 2, 'class_idx': 0, 'credits': 4},
            {'name': 'Advanced Mathematics', 'code': 'MATH201', 'teacher_idx': 0, 'class_idx': 2, 'credits': 4},
            {'name': 'Chemistry', 'code': 'CHEM101', 'teacher_idx': 2, 'class_idx': 1, 'credits': 4}
        ]
        
        subjects = []
        for subject_data in subjects_data:
            subject = Subject(
                name=subject_data['name'],
                code=subject_data['code'],
                academic_year=academic_year,
                teacher_id=teachers[subject_data['teacher_idx']].id,
                class_id=classes[subject_data['class_idx']].id,
                credits=subject_data['credits'],
                description=f"{subject_data['name']} for {academic_year}"
            )
            db.session.add(subject)
            subjects.append(subject)
        
        # Create parent users and students
        students_data = [
            {
                'student': {
                    'email': 'alice.williams@student.edu',
                    'password': 'student123',
                    'first_name': 'Alice',
                    'last_name': 'Williams',
                    'phone': '+1234567894',
                    'student_id': 'ST240001',
                    'date_of_birth': date(2008, 3, 15),
                    'class_idx': 0
                },
                'parent': {
                    'email': 'robert.williams@email.com',
                    'password': 'parent123',
                    'first_name': 'Robert',
                    'last_name': 'Williams',
                    'phone': '+1234567895',
                    'occupation': 'Engineer',
                    'workplace': 'Tech Corp'
                }
            },
            {
                'student': {
                    'email': 'bob.davis@student.edu',
                    'password': 'student123',
                    'first_name': 'Bob',
                    'last_name': 'Davis',
                    'phone': '+1234567896',
                    'student_id': 'ST240002',
                    'date_of_birth': date(2008, 7, 22),
                    'class_idx': 0
                },
                'parent': {
                    'email': 'linda.davis@email.com',
                    'password': 'parent123',
                    'first_name': 'Linda',
                    'last_name': 'Davis',
                    'phone': '+1234567897',
                    'occupation': 'Doctor',
                    'workplace': 'City Hospital'
                }
            },
            {
                'student': {
                    'email': 'carol.miller@student.edu',
                    'password': 'student123',
                    'first_name': 'Carol',
                    'last_name': 'Miller',
                    'phone': '+1234567898',
                    'student_id': 'ST240003',
                    'date_of_birth': date(2007, 11, 8),
                    'class_idx': 1
                },
                'parent': {
                    'email': 'james.miller@email.com',
                    'password': 'parent123',
                    'first_name': 'James',
                    'last_name': 'Miller',
                    'phone': '+1234567899',
                    'occupation': 'Teacher',
                    'workplace': 'Elementary School'
                }
            }
        ]
        
        students = []
        parents = []
        
        for data in students_data:
            # Create student user
            student_user = User(
                email=data['student']['email'],
                password=data['student']['password'],
                first_name=data['student']['first_name'],
                last_name=data['student']['last_name'],
                role='student',
                phone=data['student']['phone']
            )
            db.session.add(student_user)
            db.session.flush()
            
            # Create student profile
            student = Student(
                user_id=student_user.id,
                student_id=data['student']['student_id'],
                date_of_birth=data['student']['date_of_birth'],
                class_id=classes[data['student']['class_idx']].id,
                emergency_contact=data['parent']['first_name'] + ' ' + data['parent']['last_name'],
                emergency_phone=data['parent']['phone']
            )
            db.session.add(student)
            students.append(student)
            
            # Create parent user
            parent_user = User(
                email=data['parent']['email'],
                password=data['parent']['password'],
                first_name=data['parent']['first_name'],
                last_name=data['parent']['last_name'],
                role='parent',
                phone=data['parent']['phone']
            )
            db.session.add(parent_user)
            db.session.flush()
            
            # Create parent profile
            parent = Parent(
                user_id=parent_user.id,
                occupation=data['parent']['occupation'],
                workplace=data['parent']['workplace'],
                relationship_to_students='Parent',
                is_primary_contact=True
            )
            db.session.add(parent)
            parents.append(parent)
        
        db.session.flush()
        
        # Associate parents with students
        for i, (student, parent) in enumerate(zip(students, parents)):
            parent.children.append(student)
        
        # Create sample grades
        for i, student in enumerate(students):
            for j, subject in enumerate(subjects):
                if subject.class_id == student.class_id:
                    # Create some sample grades
                    grade1 = Grade(
                        student_id=student.id,
                        subject_id=subject.id,
                        teacher_id=subject.teacher_id,
                        grade_type='assignment',
                        assignment_name='Assignment 1',
                        grade_value=85 + (i * 2) + (j * 3),
                        max_points=100,
                        earned_points=85 + (i * 2) + (j * 3),
                        is_published=True
                    )
                    db.session.add(grade1)
                    
                    grade2 = Grade(
                        student_id=student.id,
                        subject_id=subject.id,
                        teacher_id=subject.teacher_id,
                        grade_type='quiz',
                        assignment_name='Quiz 1',
                        grade_value=88 + (i * 1) + (j * 2),
                        max_points=100,
                        earned_points=88 + (i * 1) + (j * 2),
                        is_published=True
                    )
                    db.session.add(grade2)
        
        # Create sample attendance records
        start_date = date.today() - timedelta(days=30)
        for i in range(20):  # 20 days of attendance
            current_date = start_date + timedelta(days=i)
            for student in students:
                # 90% attendance rate
                status = 'present' if (i + student.id) % 10 != 0 else 'absent'
                attendance = Attendance(
                    student_id=student.id,
                    date=current_date,
                    status=status,
                    marked_by=admin.id,
                    period='Morning'
                )
                db.session.add(attendance)
        
        # Create sample fees
        for student in students:
            # Tuition fee
            tuition_fee = Fee(
                student_id=student.id,
                fee_type='tuition',
                amount=5000.00,
                due_date=date.today() + timedelta(days=30),
                academic_year=academic_year,
                description='Tuition fee for academic year',
                created_by=admin.id
            )
            db.session.add(tuition_fee)
            
            # Library fee
            library_fee = Fee(
                student_id=student.id,
                fee_type='library',
                amount=200.00,
                due_date=date.today() + timedelta(days=15),
                academic_year=academic_year,
                description='Library access fee',
                created_by=admin.id
            )
            db.session.add(library_fee)
        
        # Create sample notifications
        general_notification = Notification(
            title='Welcome to New Academic Year',
            message='Welcome students and parents to the new academic year. We look forward to a great year of learning!',
            created_by=admin.id,
            notification_type='general',
            priority='medium',
            target_audience='all'
        )
        db.session.add(general_notification)
        general_notification.mark_as_sent()
        
        # Class specific notification
        class_notification = Notification(
            title='Parent-Teacher Meeting',
            message='Parent-teacher meeting scheduled for Class 9A on next Friday at 3 PM.',
            created_by=teachers[0].user.id,
            notification_type='event',
            priority='high',
            target_audience='specific_class',
            target_class_id=classes[0].id
        )
        db.session.add(class_notification)
        class_notification.mark_as_sent()
        
        # Create sample messages
        message1 = Message(
            sender_id=parents[0].user.id,
            recipient_id=teachers[0].user.id,
            subject='Question about homework',
            body='Hi Mr. Smith, I wanted to ask about the math homework assigned yesterday. Could you please clarify the requirements for problem #5?',
            message_type='inquiry'
        )
        db.session.add(message1)
        
        # Reply to the message
        reply1 = Message(
            sender_id=teachers[0].user.id,
            recipient_id=parents[0].user.id,
            subject='Re: Question about homework',
            body='Hi Mr. Williams, Thank you for your question. For problem #5, students need to show all work steps and provide a graph. Let me know if you need further clarification.',
            message_type='inquiry',
            parent_message_id=None  # Will be set after message1 is committed
        )
        db.session.add(reply1)
        
        # Commit all changes
        db.session.commit()
        
        # Update reply parent message ID
        reply1.parent_message_id = message1.id
        db.session.commit()
        
        print("Sample data created successfully!")
        print("\nSample Login Credentials:")
        print("========================")
        print("Admin: admin@school.edu / admin123")
        print("Teacher: john.smith@school.edu / teacher123")
        print("Student: alice.williams@student.edu / student123")
        print("Parent: robert.williams@email.com / parent123")
        print("\nAPI Base URL: http://localhost:5000/api")
        print("Documentation: Check the README.md file for API endpoints")

if __name__ == '__main__':
    seed_database()