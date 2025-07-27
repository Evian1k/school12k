import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  UserCheck,
  BarChart3,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [teacherData, setTeacherData] = useState(null);
  const [todayClasses, setTodayClasses] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [pendingGrades, setPendingGrades] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Mock teacher data
    const mockTeacherData = {
      teacherId: 'TCH2024001',
      name: 'Sarah Teacher',
      subjects: ['Mathematics', 'Physics'],
      classes: ['Grade 10A', 'Grade 10B', 'Grade 11A'],
      totalStudents: 85,
      totalClasses: 3,
      todayClasses: 5,
      pendingGrades: 12,
      attendanceRate: 94,
    };

    const mockTodayClasses = [
      {
        id: 1,
        subject: 'Mathematics',
        class: 'Grade 10A',
        time: '8:00-8:45',
        room: 'Room 101',
        students: 28,
        status: 'completed',
        attendanceMarked: true,
      },
      {
        id: 2,
        subject: 'Physics',
        class: 'Grade 10B',
        time: '9:00-9:45',
        room: 'Lab 201',
        students: 25,
        status: 'in-progress',
        attendanceMarked: false,
      },
      {
        id: 3,
        subject: 'Mathematics',
        class: 'Grade 11A',
        time: '10:00-10:45',
        room: 'Room 101',
        students: 32,
        status: 'upcoming',
        attendanceMarked: false,
      },
      {
        id: 4,
        subject: 'Physics',
        class: 'Grade 10A',
        time: '2:00-2:45',
        room: 'Lab 201',
        students: 28,
        status: 'upcoming',
        attendanceMarked: false,
      },
      {
        id: 5,
        subject: 'Mathematics',
        class: 'Grade 10B',
        time: '3:00-3:45',
        room: 'Room 101',
        students: 25,
        status: 'upcoming',
        attendanceMarked: false,
      },
    ];

    const mockRecentAttendance = [
      {
        id: 1,
        class: 'Grade 10A',
        subject: 'Mathematics',
        date: '2024-01-22',
        present: 26,
        absent: 2,
        late: 0,
        total: 28,
        percentage: 93,
      },
      {
        id: 2,
        class: 'Grade 10B',
        subject: 'Physics',
        date: '2024-01-21',
        present: 23,
        absent: 1,
        late: 1,
        total: 25,
        percentage: 92,
      },
      {
        id: 3,
        class: 'Grade 11A',
        subject: 'Mathematics',
        date: '2024-01-21',
        present: 30,
        absent: 2,
        late: 0,
        total: 32,
        percentage: 94,
      },
    ];

    const mockPendingGrades = [
      {
        id: 1,
        assignment: 'Algebra Quiz #3',
        class: 'Grade 10A',
        subject: 'Mathematics',
        dueDate: '2024-01-25',
        submissions: 25,
        total: 28,
        type: 'quiz',
      },
      {
        id: 2,
        assignment: 'Physics Lab Report',
        class: 'Grade 10B',
        subject: 'Physics',
        dueDate: '2024-01-24',
        submissions: 20,
        total: 25,
        type: 'assignment',
      },
      {
        id: 3,
        assignment: 'Calculus Test',
        class: 'Grade 11A',
        subject: 'Mathematics',
        dueDate: '2024-01-26',
        submissions: 30,
        total: 32,
        type: 'test',
      },
    ];

    const mockStats = {
      totalStudents: 85,
      averageAttendance: 94,
      completedLessons: 45,
      pendingGrades: 12,
      thisWeekClasses: 15,
      gradedAssignments: 28,
    };

    setTeacherData(mockTeacherData);
    setTodayClasses(mockTodayClasses);
    setRecentAttendance(mockRecentAttendance);
    setPendingGrades(mockPendingGrades);
    setStats(mockStats);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'upcoming':
        return <Calendar className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (!teacherData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here's your teaching overview for today
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                My Classes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {teacherData.totalClasses}
              </p>
              <div className="flex items-center mt-2">
                <BookOpen className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {teacherData.subjects.join(', ')}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Students
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {teacherData.totalStudents}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  +5 this semester
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Attendance Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {teacherData.attendanceRate}%
              </p>
              <div className="flex items-center mt-2">
                <UserCheck className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  This week
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Grades
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {teacherData.pendingGrades}
              </p>
              <div className="flex items-center mt-2">
                <BarChart3 className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Assignments
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Today's Classes
              </h3>
              <Link
                to="/teacher/classes"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {todayClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {classItem.subject} - {classItem.class}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {classItem.time} • {classItem.room} • {classItem.students} students
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(classItem.status)}`}>
                      {getStatusIcon(classItem.status)}
                      <span className="ml-1 capitalize">{classItem.status}</span>
                    </span>
                    {!classItem.attendanceMarked && classItem.status === 'completed' && (
                      <button className="text-orange-600 hover:text-orange-500 text-xs">
                        Mark Attendance
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/teacher/attendance"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Mark Attendance
                </span>
              </Link>
              
              <Link
                to="/teacher/grades"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Enter Grades
                </span>
              </Link>
              
              <Link
                to="/teacher/classes"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  View Classes
                </span>
              </Link>
              
              <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors w-full">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Create Assignment
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Attendance
              </h3>
              <Link
                to="/teacher/attendance"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentAttendance.map((attendance) => (
                <div
                  key={attendance.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {attendance.class} - {attendance.subject}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {attendance.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {attendance.percentage}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {attendance.present}/{attendance.total}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pending Grades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pending Grades
              </h3>
              <Link
                to="/teacher/grades"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {pendingGrades.map((grade) => (
                <div
                  key={grade.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {grade.assignment}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {grade.class} • Due: {grade.dueDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {grade.submissions}/{grade.total}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {grade.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherDashboard;