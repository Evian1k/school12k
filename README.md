# School Management System API

A comprehensive RESTful API for managing a school system built with Flask, SQLAlchemy, and JWT authentication. This system supports multiple user roles (Admin, Teacher, Student, Parent) with role-based access control and complete CRUD operations for all school entities.

## 🚀 Features

### ✅ Core Features Implemented

- **User Authentication & Authorization**
  - Secure password hashing with bcrypt
  - JWT token authentication (access & refresh tokens)
  - Role-based access control (Admin, Teacher, Student, Parent)
  - User registration and login endpoints

- **Complete Models & Relationships**
  - User, Student, Parent, Teacher, Grade, Class, Subject, Attendance, Fee, ReportCard, Notification, Message
  - Proper foreign key relationships and constraints
  - Many-to-many relationships (Parent-Student)

- **RESTful API Endpoints**
  - Full CRUD operations for all models
  - Pagination support
  - Advanced filtering and search
  - Role-specific data access

- **School Management Features**
  - Class and subject management
  - Grade recording and report card generation
  - Attendance tracking
  - Fee management and payment processing
  - Notification system
  - Internal messaging system

- **Data Integrity & Validation**
  - Input validation for all endpoints
  - UTC timezone handling
  - Email and phone validation
  - Grade value validation (0-100)

## 🛠 Technology Stack

- **Framework**: Flask 2.3.3
- **Database ORM**: SQLAlchemy 3.0.5
- **Authentication**: JWT (Flask-JWT-Extended)
- **Password Hashing**: bcrypt
- **Database Migrations**: Flask-Migrate
- **Validation**: Custom validators with email-validator
- **CORS**: Flask-CORS
- **Environment**: python-dotenv

## 📋 Prerequisites

- Python 3.8+
- pip (Python package installer)

## 🔧 Installation & Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd school-management-system
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Environment Configuration**
Copy the `.env` file and update as needed:
```bash
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET_KEY=jwt-secret-key-change-in-production
DATABASE_URL=sqlite:///school_management.db
JWT_ACCESS_TOKEN_EXPIRES=3600
JWT_REFRESH_TOKEN_EXPIRES=2592000
```

5. **Initialize Database**
```bash
flask init-db
```

6. **Seed Database with Sample Data**
```bash
flask seed-db
```

7. **Run the Application**
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## 🔐 Sample Login Credentials

After running the seed command, you can use these credentials:

- **Admin**: `admin@school.edu` / `admin123`
- **Teacher**: `john.smith@school.edu` / `teacher123`
- **Student**: `alice.williams@student.edu` / `student123`
- **Parent**: `robert.williams@email.com` / `parent123`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All endpoints (except registration and login) require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 🔑 Authentication Endpoints

### Register User
```http
POST /api/auth/register
```
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

### Login
```http
POST /api/auth/login
```
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Refresh Token
```http
POST /api/auth/refresh
```
*Requires refresh token in Authorization header*

### Get Current User Info
```http
GET /api/auth/me
```

### Change Password
```http
POST /api/auth/change-password
```
```json
{
  "current_password": "oldpassword",
  "new_password": "NewSecurePass123!"
}
```

---

## 👥 User Management Endpoints

### Get Users
```http
GET /api/users?role=student&search=john&page=1&per_page=20
```
*Admin/Teacher only*

### Get User by ID
```http
GET /api/users/{user_id}
```

### Update User
```http
PUT /api/users/{user_id}
```
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+1987654321",
  "address": "456 Oak Ave"
}
```

### Deactivate User
```http
DELETE /api/users/{user_id}
```
*Admin only*

---

## 🎓 Student Endpoints

### Get Students
```http
GET /api/students?class_id=1&search=alice&page=1&per_page=20
```

### Get Student Details
```http
GET /api/students/{student_id}
```

### Get Student Grades
```http
GET /api/students/{student_id}/grades?subject_id=1&academic_year=2024-2025
```

### Get Student Attendance
```http
GET /api/students/{student_id}/attendance?start_date=2024-01-01&end_date=2024-01-31
```

### Get Student Fees
```http
GET /api/students/{student_id}/fees?status=pending&academic_year=2024-2025
```

### Assign Parent to Student
```http
POST /api/students/{student_id}/assign-parent
```
```json
{
  "parent_id": 1
}
```
*Admin only*

---

## 👨‍🏫 Teacher Endpoints

### Get Teachers
```http
GET /api/teachers?department=Mathematics&search=john
```

### Get Teacher Details
```http
GET /api/teachers/{teacher_id}
```

### Get Teacher's Subjects
```http
GET /api/teachers/{teacher_id}/subjects
```

### Get Teacher's Students
```http
GET /api/teachers/{teacher_id}/students
```

### Mark Attendance (Bulk)
```http
POST /api/teachers/mark-attendance
```
```json
{
  "attendance_records": [
    {
      "student_id": 1,
      "date": "2024-01-15",
      "status": "present",
      "subject_id": 1,
      "period": "Morning",
      "check_in_time": "08:00:00",
      "notes": "On time"
    }
  ]
}
```

### Assign Grade
```http
POST /api/teachers/assign-grade
```
```json
{
  "student_id": 1,
  "subject_id": 1,
  "grade_type": "assignment",
  "assignment_name": "Math Quiz 1",
  "grade_value": 85.5,
  "max_points": 100,
  "earned_points": 85.5,
  "comments": "Good work!"
}
```

### Publish Grade
```http
PATCH /api/teachers/grades/{grade_id}/publish
```

---

## 🏫 Class Management Endpoints

### Get Classes
```http
GET /api/classes?academic_year=2024-2025&grade_level=9th Grade
```

### Get Class Details
```http
GET /api/classes/{class_id}
```

### Create Class
```http
POST /api/classes
```
```json
{
  "name": "Class 10A",
  "grade_level": "10th Grade",
  "academic_year": "2024-2025",
  "description": "Science-focused class",
  "max_students": 30
}
```
*Admin only*

### Update Class
```http
PUT /api/classes/{class_id}
```

### Get Class Students
```http
GET /api/classes/{class_id}/students
```

### Get Class Subjects
```http
GET /api/classes/{class_id}/subjects
```

### Add Student to Class
```http
POST /api/classes/{class_id}/add-student
```
```json
{
  "student_id": 1
}
```
*Admin only*

---

## 📖 Subject Endpoints

### Get Subjects
```http
GET /api/subjects?teacher_id=1&class_id=1&academic_year=2024-2025
```

### Get Subject Details
```http
GET /api/subjects/{subject_id}
```

### Create Subject
```http
POST /api/subjects
```
```json
{
  "name": "Advanced Physics",
  "code": "PHY201",
  "description": "Advanced physics concepts",
  "credits": 4,
  "teacher_id": 1,
  "class_id": 1,
  "semester": "full_year"
}
```
*Admin only*

### Assign Teacher to Subject
```http
POST /api/subjects/{subject_id}/assign-teacher
```
```json
{
  "teacher_id": 1
}
```
*Admin only*

---

## 📊 Grade Endpoints

### Get Grades
```http
GET /api/grades?student_id=1&subject_id=1&grade_type=assignment&is_published=true
```

### Create Grade
```http
POST /api/grades
```
```json
{
  "student_id": 1,
  "subject_id": 1,
  "grade_type": "exam",
  "assignment_name": "Midterm Exam",
  "grade_value": 92.5,
  "max_points": 100,
  "weight": 2.0,
  "comments": "Excellent understanding"
}
```
*Teacher only*

### Update Grade
```http
PUT /api/grades/{grade_id}
```

### Bulk Create Grades
```http
POST /api/grades/bulk-create
```
```json
{
  "grades": [
    {
      "student_id": 1,
      "subject_id": 1,
      "grade_type": "quiz",
      "assignment_name": "Pop Quiz 1",
      "grade_value": 88
    }
  ]
}
```

---

## 📅 Attendance Endpoints

### Get Attendance Records
```http
GET /api/attendance?student_id=1&start_date=2024-01-01&end_date=2024-01-31&status=present
```

### Mark Attendance (Bulk)
```http
POST /api/attendance/mark
```
```json
{
  "attendance_records": [
    {
      "student_id": 1,
      "date": "2024-01-15",
      "status": "present",
      "check_in_time": "08:00:00",
      "period": "Morning"
    }
  ]
}
```

### Get Student Attendance
```http
GET /api/attendance/student/{student_id}?start_date=2024-01-01&end_date=2024-01-31
```

### Get Class Attendance for Date
```http
GET /api/attendance/class/{class_id}?date=2024-01-15
```

### Update Attendance Record
```http
PUT /api/attendance/{attendance_id}
```
```json
{
  "status": "late",
  "notes": "Arrived 15 minutes late"
}
```

---

## 💰 Fee Management Endpoints

### Get Fees
```http
GET /api/fees?student_id=1&status=pending&fee_type=tuition&academic_year=2024-2025
```

### Create Fee
```http
POST /api/fees
```
```json
{
  "student_id": 1,
  "fee_type": "tuition",
  "amount": 5000.00,
  "due_date": "2024-02-15",
  "academic_year": "2024-2025",
  "description": "Semester tuition fee"
}
```
*Admin only*

### Process Payment
```http
POST /api/fees/{fee_id}/payment
```
```json
{
  "amount": 2500.00,
  "payment_method": "Credit Card",
  "transaction_id": "TXN123456"
}
```
*Admin only*

### Get Student Fees
```http
GET /api/fees/student/{student_id}?status=overdue
```

### Get Overdue Fees
```http
GET /api/fees/overdue
```
*Admin only*

---

## 🔔 Notification Endpoints

### Get Notifications
```http
GET /api/notifications?unread_only=true
```

### Create Notification
```http
POST /api/notifications
```
```json
{
  "title": "Parent-Teacher Meeting",
  "message": "Reminder: Parent-teacher meeting scheduled for Friday at 3 PM",
  "notification_type": "event",
  "priority": "high",
  "target_audience": "parents",
  "expires_at": "2024-01-20T15:00:00Z"
}
```
*Admin/Teacher only*

### Mark Notification as Read
```http
POST /api/notifications/{notification_id}/mark-read
```

### Mark All Notifications as Read
```http
POST /api/notifications/mark-all-read
```

---

## 💬 Message Endpoints

### Get Messages
```http
GET /api/messages?type=inbox&is_read=false&search=homework
```

### Send Message
```http
POST /api/messages
```
```json
{
  "recipient_id": 2,
  "subject": "Question about assignment",
  "body": "Could you please clarify the requirements for the math assignment?",
  "message_type": "inquiry",
  "priority": "medium"
}
```

### Reply to Message
```http
POST /api/messages/{message_id}/reply
```
```json
{
  "body": "The assignment requires showing all work steps and includes a bonus question."
}
```

### Mark Message as Read
```http
PATCH /api/messages/{message_id}/mark-read
```

### Star/Unstar Message
```http
PATCH /api/messages/{message_id}/star
```

### Archive/Unarchive Message
```http
PATCH /api/messages/{message_id}/archive
```

### Get Users for Messaging
```http
GET /api/messages/users?search=john
```

---

## 📄 Report Card Endpoints

### Get Report Cards
```http
GET /api/report-cards?student_id=1&academic_year=2024-2025&is_published=true
```

### Create Report Card
```http
POST /api/report-cards
```
```json
{
  "student_id": 1,
  "academic_year": "2024-2025",
  "semester": "first"
}
```
*Admin/Teacher only*

### Update Report Card
```http
PUT /api/report-cards/{report_card_id}
```
```json
{
  "teacher_comments": "Excellent progress in all subjects",
  "behavior_grade": "A",
  "conduct_points": 95,
  "achievements": "Honor roll, Math competition winner"
}
```

### Publish Report Card
```http
PATCH /api/report-cards/{report_card_id}/publish
```

### Get Student Report Cards
```http
GET /api/report-cards/student/{student_id}?academic_year=2024-2025
```

### Generate Class Report Cards
```http
POST /api/report-cards/class/{class_id}/generate
```
```json
{
  "academic_year": "2024-2025",
  "semester": "first"
}
```

### Add Parent Comment
```http
PATCH /api/report-cards/{report_card_id}/add-parent-comment
```
```json
{
  "parent_comments": "We're very proud of the progress shown this semester."
}
```
*Parent only*

---

## 🔧 Admin Dashboard Endpoints

### Get Dashboard Statistics
```http
GET /api/admin/dashboard
```
*Admin only*

### Get All Users (Admin View)
```http
GET /api/admin/users?role=student&is_active=true&search=john
```

### Toggle User Status
```http
PATCH /api/admin/users/{user_id}/toggle-status
```

### Assign User Role
```http
PATCH /api/admin/users/{user_id}/assign-role
```
```json
{
  "role": "teacher"
}
```

### Bulk Create Fees
```http
POST /api/admin/fees/bulk-create
```
```json
{
  "fee_type": "tuition",
  "amount": 5000.00,
  "due_date": "2024-02-15",
  "academic_year": "2024-2025",
  "target": {
    "type": "all_students"
  }
}
```

### Financial Report
```http
GET /api/admin/reports/financial?academic_year=2024-2025&start_date=2024-01-01
```

---

## 📊 Data Models

### User
- id, email, password_hash, first_name, last_name, phone, address, role, is_active, created_at, updated_at

### Student
- id, user_id, student_id, class_id, date_of_birth, enrollment_date, emergency_contact, emergency_phone, medical_info, is_active

### Teacher
- id, user_id, employee_id, department, hire_date, qualification, experience_years, specialization, salary, is_active

### Parent
- id, user_id, occupation, workplace, work_phone, relationship_to_students, is_primary_contact

### Class
- id, name, grade_level, academic_year, description, max_students, is_active

### Subject
- id, name, code, description, credits, teacher_id, class_id, academic_year, semester, is_active

### Grade
- id, student_id, subject_id, teacher_id, grade_value, letter_grade, grade_type, assignment_name, max_points, earned_points, weight, graded_date, due_date, comments, is_published

### Attendance
- id, student_id, date, status, check_in_time, check_out_time, notes, marked_by, subject_id, period

### Fee
- id, student_id, fee_type, amount, due_date, paid_date, paid_amount, status, academic_year, semester, description, payment_method, transaction_id, late_fee, discount

---

## 🔒 Security Features

- **Password Security**: bcrypt hashing with salt
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions based on user roles
- **Input Validation**: Comprehensive validation for all inputs
- **SQL Injection Prevention**: SQLAlchemy ORM with parameterized queries
- **CORS Protection**: Configurable CORS settings

## 🎯 Role-Based Permissions

### Admin
- Full system access
- User management
- Class and subject creation
- Fee management
- Financial reports
- System configuration

### Teacher
- Grade management for their subjects
- Attendance marking
- Student progress tracking
- Communication with students/parents
- Report card contributions

### Student
- View own grades and attendance
- Access study materials
- Internal messaging
- View fees and payments
- Access report cards

### Parent
- View children's academic progress
- Communication with teachers
- Fee payments and history
- Attendance monitoring
- Report card access

## 🚀 Frontend Integration

This API is designed to work seamlessly with modern frontend frameworks:

- **React/Vue/Angular**: Full REST API support
- **Mobile Apps**: JWT token authentication
- **Real-time Updates**: WebSocket support can be added
- **File Uploads**: Attachment support in messages and notifications

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "status": "error",
  "error": "Validation failed",
  "message": "Missing required fields: email, password",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## 🔧 Development Commands

```bash
# Initialize database
flask init-db

# Seed database with sample data
flask seed-db

# Run development server
python app.py

# Access Flask shell with models
flask shell

# Database migrations (if needed)
flask db init
flask db migrate -m "Migration message"
flask db upgrade
```

## 📈 Performance Considerations

- **Pagination**: All list endpoints support pagination
- **Indexing**: Database indexes on frequently queried fields
- **Lazy Loading**: Relationships loaded only when needed
- **Query Optimization**: Efficient SQL queries through SQLAlchemy
- **Caching**: Ready for Redis/Memcached integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Ready for Production**: This API is fully functional and ready to be connected to any React, Vue, Angular, or mobile frontend. All endpoints are documented, tested, and follow REST conventions.
