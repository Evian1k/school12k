#!/usr/bin/env python3
"""
Database initialization script for EduManage
Creates sample data for testing and demonstration
"""

import sys
import os
from datetime import datetime, date, timedelta
from werkzeug.security import generate_password_hash

# Add the current directory to the path to import our app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, User, Student, Teacher, Guardian, Class, Subject, ClassSubject, Fee, Grade, Announcement, generate_qr_code

def init_database():
    """Initialize the database with sample data"""
    with app.app_context():
        # Drop all tables and recreate them
        print("Dropping existing tables...")
        db.drop_all()
        
        print("Creating new tables...")
        db.create_all()
        
        # Create users
        print("Creating users...")
        
        # Admin user
        admin_user = User(
            email='admin@edumanage.com',
            password_hash=generate_password_hash('admin123'),
            first_name='System',
            last_name='Administrator',
            phone='+1-555-0100',
            role='admin'
        )
        db.session.add(admin_user)
        
        # Teacher users
        teacher1_user = User(
            email='teacher@edumanage.com',
            password_hash=generate_password_hash('teacher123'),
            first_name='Sarah',
            last_name='Johnson',
            phone='+1-555-0101',
            role='teacher'
        )
        db.session.add(teacher1_user)
        
        teacher2_user = User(
            email='teacher2@edumanage.com',
            password_hash=generate_password_hash('teacher123'),
            first_name='Michael',
            last_name='Davis',
            phone='+1-555-0102',
            role='teacher'
        )
        db.session.add(teacher2_user)
        
        # Guardian users
        guardian1_user = User(
            email='guardian@edumanage.com',
            password_hash=generate_password_hash('guardian123'),
            first_name='John',
            last_name='Smith',
            phone='+1-555-0201',
            role='guardian'
        )
        db.session.add(guardian1_user)
        
        guardian2_user = User(
            email='guardian2@edumanage.com',
            password_hash=generate_password_hash('guardian123'),
            first_name='Maria',
            last_name='Garcia',
            phone='+1-555-0202',
            role='guardian'
        )
        db.session.add(guardian2_user)
        
        # Student users
        student1_user = User(
            email='student@edumanage.com',
            password_hash=generate_password_hash('student123'),
            first_name='Alice',
            last_name='Smith',
            phone='+1-555-0301',
            role='student'
        )
        db.session.add(student1_user)
        
        student2_user = User(
            email='student2@edumanage.com',
            password_hash=generate_password_hash('student123'),
            first_name='Bob',
            last_name='Garcia',
            phone='+1-555-0302',
            role='student'
        )
        db.session.add(student2_user)
        
        student3_user = User(
            email='student3@edumanage.com',
            password_hash=generate_password_hash('student123'),
            first_name='Charlie',
            last_name='Brown',
            phone='+1-555-0303',
            role='student'
        )
        db.session.add(student3_user)
        
        db.session.commit()
        
        # Create teachers
        print("Creating teachers...")
        teacher1 = Teacher(
            user_id=teacher1_user.id,
            teacher_id='TCH000001',
            department='Mathematics',
            qualification='M.Sc. Mathematics'
        )
        db.session.add(teacher1)
        
        teacher2 = Teacher(
            user_id=teacher2_user.id,
            teacher_id='TCH000002',
            department='Science',
            qualification='M.Sc. Physics'
        )
        db.session.add(teacher2)
        
        # Create guardians
        print("Creating guardians...")
        guardian1 = Guardian(
            user_id=guardian1_user.id,
            relationship_to_student='father',
            occupation='Engineer'
        )
        db.session.add(guardian1)
        
        guardian2 = Guardian(
            user_id=guardian2_user.id,
            relationship_to_student='mother',
            occupation='Doctor'
        )
        db.session.add(guardian2)
        
        db.session.commit()
        
        # Create classes
        print("Creating classes...")
        class1 = Class(
            name='Grade 10',
            grade='10',
            section='A',
            teacher_id=teacher1.id,
            academic_year='2024-25'
        )
        db.session.add(class1)
        
        class2 = Class(
            name='Grade 11',
            grade='11',
            section='B',
            teacher_id=teacher2.id,
            academic_year='2024-25'
        )
        db.session.add(class2)
        
        db.session.commit()
        
        # Create students
        print("Creating students...")
        student1 = Student(
            user_id=student1_user.id,
            student_id='STU000001',
            class_id=class1.id,
            guardian_id=guardian1.id,
            date_of_birth=date(2008, 5, 15),
            address='123 Main St, Anytown, ST 12345',
            qr_code=generate_qr_code(f'student:{student1_user.id}:STU000001')
        )
        db.session.add(student1)
        
        student2 = Student(
            user_id=student2_user.id,
            student_id='STU000002',
            class_id=class1.id,
            guardian_id=guardian2.id,
            date_of_birth=date(2008, 8, 22),
            address='456 Oak Ave, Anytown, ST 12345',
            qr_code=generate_qr_code(f'student:{student2_user.id}:STU000002')
        )
        db.session.add(student2)
        
        student3 = Student(
            user_id=student3_user.id,
            student_id='STU000003',
            class_id=class2.id,
            guardian_id=guardian1.id,
            date_of_birth=date(2007, 12, 10),
            address='789 Pine St, Anytown, ST 12345',
            qr_code=generate_qr_code(f'student:{student3_user.id}:STU000003')
        )
        db.session.add(student3)
        
        db.session.commit()
        
        # Create subjects
        print("Creating subjects...")
        subjects_data = [
            ('Mathematics', 'MATH101', 'Basic Mathematics'),
            ('English', 'ENG101', 'English Language and Literature'),
            ('Science', 'SCI101', 'General Science'),
            ('History', 'HIST101', 'World History'),
            ('Geography', 'GEO101', 'Physical and Human Geography')
        ]
        
        subjects = []
        for name, code, description in subjects_data:
            subject = Subject(name=name, code=code, description=description)
            db.session.add(subject)
            subjects.append(subject)
        
        db.session.commit()
        
        # Create class-subject assignments
        print("Creating class-subject assignments...")
        for subject in subjects:
            # Assign subjects to class1 with teacher1
            class_subject1 = ClassSubject(
                class_id=class1.id,
                subject_id=subject.id,
                teacher_id=teacher1.id
            )
            db.session.add(class_subject1)
            
            # Assign subjects to class2 with teacher2
            class_subject2 = ClassSubject(
                class_id=class2.id,
                subject_id=subject.id,
                teacher_id=teacher2.id
            )
            db.session.add(class_subject2)
        
        db.session.commit()
        
        # Create fee records
        print("Creating fee records...")
        for student in [student1, student2, student3]:
            # Term 1 fee
            fee1 = Fee(
                student_id=student.id,
                academic_year='2024-25',
                term='Term 1',
                amount=1500.00,
                discount=0.00,
                final_amount=1500.00,
                due_date=date(2024, 4, 30),
                paid_amount=1500.00,
                status='paid',
                payment_date=date(2024, 3, 15)
            )
            db.session.add(fee1)
            
            # Term 2 fee (pending)
            fee2 = Fee(
                student_id=student.id,
                academic_year='2024-25',
                term='Term 2',
                amount=1500.00,
                discount=100.00,
                final_amount=1400.00,
                due_date=date(2024, 8, 31),
                paid_amount=0.00,
                status='pending'
            )
            db.session.add(fee2)
        
        db.session.commit()
        
        # Create grade records
        print("Creating grade records...")
        for subject in subjects[:3]:  # Only for first 3 subjects
            for student in [student1, student2, student3]:
                # Midterm exam
                grade1 = Grade(
                    student_id=student.id,
                    subject_id=subject.id,
                    class_id=student.class_id,
                    exam_type='Midterm',
                    marks_obtained=85.0,
                    total_marks=100.0,
                    grade_letter='B+',
                    academic_year='2024-25',
                    term='Term 1',
                    created_by=teacher1_user.id
                )
                db.session.add(grade1)
                
                # Assignment
                grade2 = Grade(
                    student_id=student.id,
                    subject_id=subject.id,
                    class_id=student.class_id,
                    exam_type='Assignment',
                    marks_obtained=92.0,
                    total_marks=100.0,
                    grade_letter='A',
                    academic_year='2024-25',
                    term='Term 1',
                    created_by=teacher1_user.id
                )
                db.session.add(grade2)
        
        db.session.commit()
        
        # Create announcements
        print("Creating announcements...")
        announcements_data = [
            ('Welcome to New Academic Year', 'Welcome to the 2024-25 academic year! We wish all students success.', 'all'),
            ('Parent-Teacher Meeting', 'Parent-teacher meeting scheduled for next Friday at 3 PM.', 'guardians'),
            ('Science Fair Registration', 'Registration for the annual science fair is now open.', 'students'),
            ('Staff Meeting', 'Monthly staff meeting scheduled for Monday at 10 AM.', 'teachers')
        ]
        
        for title, content, audience in announcements_data:
            announcement = Announcement(
                title=title,
                content=content,
                target_audience=audience,
                created_by=admin_user.id
            )
            db.session.add(announcement)
        
        db.session.commit()
        
        print("Database initialized successfully!")
        print("\nDemo accounts created:")
        print("Admin: admin@edumanage.com / admin123")
        print("Teacher: teacher@edumanage.com / teacher123")
        print("Student: student@edumanage.com / student123")
        print("Guardian: guardian@edumanage.com / guardian123")

if __name__ == '__main__':
    init_database()