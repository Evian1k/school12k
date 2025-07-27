import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  BookOpen,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
  Award,
  Target,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [recentGrades, setRecentGrades] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    // Mock student data
    const mockStudentData = {
      studentId: 'STU2024001',
      name: 'Mike Student',
      class: 'Grade 10A',
      section: 'A',
      rollNumber: '001',
      academicYear: '2024-2025',
      overallGPA: 3.8,
      attendancePercentage: 92,
      totalSubjects: 6,
      upcomingExams: 2,
    };

    const mockGrades = [
      { subject: 'Mathematics', grade: 'A', score: 95, date: '2024-01-20', type: 'Quiz' },
      { subject: 'Physics', grade: 'B+', score: 87, date: '2024-01-18', type: 'Test' },
      { subject: 'Chemistry', grade: 'A-', score: 91, date: '2024-01-15', type: 'Assignment' },
      { subject: 'English', grade: 'A', score: 94, date: '2024-01-12', type: 'Essay' },
      { subject: 'History', grade: 'B', score: 83, date: '2024-01-10', type: 'Project' },
    ];

    const mockAttendance = {
      present: 85,
      absent: 7,
      late: 3,
      total: 95,
      percentage: 92,
      weeklyData: [
        { day: 'Mon', status: 'present' },
        { day: 'Tue', status: 'present' },
        { day: 'Wed', status: 'late' },
        { day: 'Thu', status: 'present' },
        { day: 'Fri', status: 'present' },
      ]
    };

    const mockAnnouncements = [
      {
        id: 1,
        title: 'Mid-term Exams Schedule Released',
        content: 'The schedule for mid-term examinations has been posted on the portal.',
        date: '2024-01-20',
        type: 'exam',
        priority: 'high',
      },
      {
        id: 2,
        title: 'Science Fair Registration Open',
        content: 'Students can now register for the annual science fair competition.',
        date: '2024-01-18',
        type: 'event',
        priority: 'medium',
      },
      {
        id: 3,
        title: 'Library Hours Extended',
        content: 'Library will now be open until 8 PM on weekdays.',
        date: '2024-01-15',
        type: 'info',
        priority: 'low',
      },
    ];

    const mockTimetable = [
      { period: 1, time: '8:00-8:45', subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'Room 101' },
      { period: 2, time: '8:45-9:30', subject: 'Physics', teacher: 'Mr. Smith', room: 'Lab 201' },
      { period: 3, time: '9:30-10:15', subject: 'Chemistry', teacher: 'Dr. Brown', room: 'Lab 202' },
      { period: 4, time: '10:30-11:15', subject: 'English', teacher: 'Ms. Davis', room: 'Room 103' },
      { period: 5, time: '11:15-12:00', subject: 'History', teacher: 'Mr. Wilson', room: 'Room 104' },
      { period: 6, time: '1:00-1:45', subject: 'Biology', teacher: 'Dr. Taylor', room: 'Lab 203' },
    ];

    setStudentData(mockStudentData);
    setRecentGrades(mockGrades);
    setAttendanceData(mockAttendance);
    setAnnouncements(mockAnnouncements);
    setTimetable(mockTimetable);
  }, []);

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
  };

  const getAnnouncementIcon = (type) => {
    switch (type) {
      case 'exam': return AlertCircle;
      case 'event': return Calendar;
      default: return Bell;
    }
  };

  if (!studentData) {
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
          Here's your academic overview for today
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
                Overall GPA
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {studentData.overallGPA}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  +0.2 from last semester
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
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
                Attendance
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {studentData.attendancePercentage}%
              </p>
              <div className="flex items-center mt-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {attendanceData.present}/{attendanceData.total} days
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
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
                Subjects
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {studentData.totalSubjects}
              </p>
              <div className="flex items-center mt-2">
                <BookOpen className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  This semester
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
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
                Upcoming Exams
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {studentData.upcomingExams}
              </p>
              <div className="flex items-center mt-2">
                <Clock className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  This week
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Grades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Grades
              </h3>
              <a
                href="/student/grades"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium"
              >
                View All
              </a>
            </div>
            <div className="space-y-3">
              {recentGrades.slice(0, 5).map((grade, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {grade.subject}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {grade.type} • {grade.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {grade.score}%
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(grade.grade)}`}>
                      {grade.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Attendance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              This Week's Attendance
            </h3>
            <div className="space-y-3">
              {attendanceData.weeklyData?.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {day.day}
                  </span>
                  <div className="flex items-center space-x-2">
                    {day.status === 'present' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {day.status === 'absent' && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    {day.status === 'late' && (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className="text-sm capitalize text-gray-900 dark:text-white">
                      {day.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {attendanceData.percentage}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Timetable */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Today's Schedule
            </h3>
            <div className="space-y-3">
              {timetable.slice(0, 6).map((period, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                        {period.period}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {period.subject}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {period.teacher} • {period.room}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {period.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Announcements
              </h3>
              <a
                href="/student/announcements"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium"
              >
                View All
              </a>
            </div>
            <div className="space-y-3">
              {announcements.map((announcement) => {
                const Icon = getAnnouncementIcon(announcement.type);
                return (
                  <div
                    key={announcement.id}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        announcement.priority === 'high' 
                          ? 'bg-red-100 dark:bg-red-900'
                          : announcement.priority === 'medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900'
                          : 'bg-blue-100 dark:bg-blue-900'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          announcement.priority === 'high'
                            ? 'text-red-600 dark:text-red-400'
                            : announcement.priority === 'medium'
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {announcement.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {announcement.content}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {announcement.date}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;