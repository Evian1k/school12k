from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)
    
    # Register blueprints
    from app.controllers.auth_controller import auth_bp
    from app.controllers.user_controller import user_bp
    from app.controllers.student_controller import student_bp
    from app.controllers.teacher_controller import teacher_bp
    from app.controllers.class_controller import class_bp
    from app.controllers.subject_controller import subject_bp
    from app.controllers.grade_controller import grade_bp
    from app.controllers.attendance_controller import attendance_bp
    from app.controllers.fee_controller import fee_bp
    from app.controllers.notification_controller import notification_bp
    from app.controllers.message_controller import message_bp
    from app.controllers.report_card_controller import report_card_bp
    from app.controllers.admin_controller import admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(student_bp, url_prefix='/api/students')
    app.register_blueprint(teacher_bp, url_prefix='/api/teachers')
    app.register_blueprint(class_bp, url_prefix='/api/classes')
    app.register_blueprint(subject_bp, url_prefix='/api/subjects')
    app.register_blueprint(grade_bp, url_prefix='/api/grades')
    app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
    app.register_blueprint(fee_bp, url_prefix='/api/fees')
    app.register_blueprint(notification_bp, url_prefix='/api/notifications')
    app.register_blueprint(message_bp, url_prefix='/api/messages')
    app.register_blueprint(report_card_bp, url_prefix='/api/report-cards')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    return app