import os
from app import create_app, db
from app.models import *

# Create Flask application instance
app = create_app(os.environ.get('FLASK_ENV', 'development'))

@app.shell_context_processor
def make_shell_context():
    """Make database models available in flask shell"""
    return {
        'db': db,
        'User': User,
        'Student': Student,
        'Parent': Parent,
        'Teacher': Teacher,
        'Class': Class,
        'Subject': Subject,
        'Grade': Grade,
        'Attendance': Attendance,
        'Fee': Fee,
        'ReportCard': ReportCard,
        'Notification': Notification,
        'NotificationReceipt': NotificationReceipt,
        'Message': Message
    }

@app.cli.command()
def init_db():
    """Initialize the database"""
    db.create_all()
    print("Database initialized successfully!")

@app.cli.command()
def seed_db():
    """Seed the database with sample data"""
    from seed_data import seed_database
    seed_database()
    print("Database seeded successfully!")

@app.route('/')
def index():
    """API root endpoint"""
    return {
        'message': 'School Management System API',
        'version': '1.0.0',
        'status': 'running',
        'endpoints': {
            'auth': '/api/auth',
            'users': '/api/users',
            'students': '/api/students',
            'teachers': '/api/teachers',
            'classes': '/api/classes',
            'subjects': '/api/subjects',
            'grades': '/api/grades',
            'attendance': '/api/attendance',
            'fees': '/api/fees',
            'notifications': '/api/notifications',
            'messages': '/api/messages',
            'report_cards': '/api/report-cards',
            'admin': '/api/admin'
        }
    }

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return {
        'status': 'healthy',
        'database': 'connected' if db.engine.execute('SELECT 1').fetchone() else 'disconnected'
    }

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)