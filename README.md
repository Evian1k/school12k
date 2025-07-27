# EduManage - Comprehensive School Management System

A fully functional, responsive, and production-ready School Management System built with React (Vite) for the frontend and Flask (Python) for the backend API.

## 🌟 Features

### Core Functionality
- **Full Authentication System** - Registration, login, JWT-based secure sessions
- **Role-based Dashboards** - Admin, Teachers, Students, and Guardians
- **Student/Staff Registration** - Complete user management
- **Class and Subject Assignment** - Organize academic structure
- **QR Code-based Attendance** - Modern attendance tracking
- **Real-time SMS/WhatsApp Notifications** - Via Twilio integration
- **Fee Tracking** - Automatic calculations with discounts
- **Grade Management** - Teacher input and auto-generated reports
- **Guardian Access** - View child records and progress
- **School Announcements** - Targeted communication
- **Profile Settings** - User profile management
- **Dashboard Analytics** - Visual data representation

### Frontend Features
- **Modern UI/UX** - Clean, professional design with Tailwind CSS
- **Dark/Light Theme Toggle** - User preference support
- **Fully Responsive** - Mobile-first design
- **Real-time Updates** - Live data synchronization
- **Chart Visualizations** - Using Recharts for analytics
- **Loading States & Error Handling** - Smooth user experience
- **Form Validation** - Client-side validation
- **Accessibility** - WCAG compliant components

### Backend Features
- **RESTful API** - Clean API architecture with Flask
- **PostgreSQL Database** - Robust data storage
- **JWT Security** - Secure authentication
- **CORS Support** - Cross-origin resource sharing
- **Environment Configuration** - .env file support
- **MVC Architecture** - Clean code structure
- **Data Validation** - Server-side validation
- **SMS Integration** - Twilio support for notifications

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **Recharts** - Chart visualization library
- **Lucide React** - Modern icon library

### Backend
- **Flask** - Python web framework
- **Flask-SQLAlchemy** - ORM for database operations
- **Flask-JWT-Extended** - JWT authentication
- **Flask-CORS** - CORS support
- **PostgreSQL** - Primary database
- **Twilio** - SMS/WhatsApp notifications
- **QRCode** - QR code generation
- **Werkzeug** - Password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- PostgreSQL 12+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/edumanage.git
cd edumanage
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Database Setup
1. Create a PostgreSQL database:
```sql
CREATE DATABASE edumanage;
CREATE USER edumanage_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE edumanage TO edumanage_user;
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Edit `.env` with your configuration:
```env
DATABASE_URL=postgresql://edumanage_user:your_password@localhost/edumanage
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Initialize Database with Sample Data
```bash
python init_db.py
```

#### Start Backend Server
```bash
python app.py
```
Backend will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../  # Back to root directory
npm install
```

#### Start Development Server
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

## 👥 Demo Accounts

The system comes with pre-configured demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@edumanage.com | admin123 |
| Teacher | teacher@edumanage.com | teacher123 |
| Student | student@edumanage.com | student123 |
| Guardian | guardian@edumanage.com | guardian123 |

## 📱 User Roles & Permissions

### Admin Dashboard
- View system-wide statistics
- Manage students, teachers, and guardians
- Create and manage classes and subjects
- Monitor fee payments and generate reports
- Send school-wide announcements
- View all attendance records

### Teacher Dashboard
- View assigned classes and students
- Mark attendance (manual and QR code)
- Input and manage grades
- View student performance analytics
- Send announcements to students

### Student Dashboard
- View personal attendance records
- Check grades and academic progress
- View fee status and payment history
- Access class announcements
- Download QR code for attendance

### Guardian Dashboard
- Monitor child's attendance and grades
- View fee status and make payments
- Receive attendance and academic notifications
- Access school announcements

## 🎯 Key Features Walkthrough

### QR Code Attendance
1. Students receive unique QR codes
2. Teachers use the QR scanner in their dashboard
3. Instant attendance marking with SMS notifications to guardians

### Fee Management
- Automatic fee calculation based on class and term
- Discount system support
- Payment tracking and history
- Overdue fee notifications

### Grade Management
- Multi-type assessments (midterm, final, quiz, assignment)
- Automatic grade letter calculation
- Performance analytics and trends
- Parent notifications for grade updates

### Communication System
- Role-based announcements
- SMS notifications via Twilio
- Real-time updates across the platform

## 🛠️ Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
python app.py        # Start development server
python init_db.py    # Reset database with sample data
```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost/edumanage
JWT_SECRET_KEY=your-secret-key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
FLASK_ENV=development
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Students
- `GET /api/students` - Get all students
- `GET /api/students/{id}` - Get student details
- `POST /api/students` - Create new student

### Attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/{student_id}` - Get student attendance
- `POST /api/attendance/qr-scan` - QR code attendance

### Fees
- `GET /api/fees/{student_id}` - Get student fees
- `POST /api/fees` - Create fee record
- `POST /api/fees/{fee_id}/pay` - Record fee payment

### Grades
- `GET /api/grades/{student_id}` - Get student grades
- `POST /api/grades` - Add new grade

### Announcements
- `GET /api/announcements` - Get announcements
- `POST /api/announcements` - Create announcement

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update API base URL in production

### Backend (Railway/Heroku)
1. Set up production database
2. Configure environment variables
3. Deploy using Docker or direct deployment

### Docker Deployment
```bash
# Backend
cd backend
docker build -t edumanage-backend .
docker run -p 5000:5000 edumanage-backend

# Frontend
docker build -t edumanage-frontend .
docker run -p 3000:3000 edumanage-frontend
```

## 📊 Database Schema

### Core Tables
- **users** - All system users (admin, teacher, student, guardian)
- **students** - Student-specific information and QR codes
- **teachers** - Teacher profiles and qualifications
- **guardians** - Guardian information and relationships
- **classes** - Class structure and assignments
- **subjects** - Academic subjects
- **attendance** - Daily attendance records
- **fees** - Fee structure and payments
- **grades** - Academic performance records
- **announcements** - School communications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Flask community for the robust backend framework
- Tailwind CSS for the utility-first CSS approach
- Radix UI for accessible components
- All open-source contributors who made this project possible

## 📞 Support

For support, email support@edumanage.com or join our Discord server.

## 🔄 Updates & Roadmap

### Recent Updates
- ✅ QR code attendance system
- ✅ SMS notifications via Twilio
- ✅ Responsive mobile design
- ✅ Real-time dashboard updates

### Upcoming Features
- 📅 Advanced calendar integration
- 📊 Enhanced analytics and reporting
- 🔔 Push notifications
- 📱 Mobile app development
- 🎯 AI-powered insights

---

**EduManage** - Transforming Education Management, One School at a Time! 🎓