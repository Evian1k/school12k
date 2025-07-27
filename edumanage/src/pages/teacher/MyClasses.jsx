import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  BarChart3,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const MyClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock classes data
    const mockClasses = [
      {
        id: 1,
        className: 'Grade 10A',
        subject: 'Mathematics',
        section: 'A',
        students: 28,
        room: 'Room 101',
        schedule: [
          { day: 'Monday', time: '8:00-8:45' },
          { day: 'Wednesday', time: '9:00-9:45' },
          { day: 'Friday', time: '10:00-10:45' },
        ],
        attendanceRate: 94,
        averageGrade: 'B+',
        totalLessons: 45,
        completedLessons: 42,
        upcomingAssignments: 2,
        syllabus: 'Algebra, Geometry, Trigonometry',
        description: 'Advanced mathematics course covering algebra, geometry, and basic trigonometry concepts.',
      },
      {
        id: 2,
        className: 'Grade 10B',
        subject: 'Mathematics',
        section: 'B',
        students: 25,
        room: 'Room 101',
        schedule: [
          { day: 'Tuesday', time: '8:00-8:45' },
          { day: 'Thursday', time: '9:00-9:45' },
          { day: 'Friday', time: '2:00-2:45' },
        ],
        attendanceRate: 92,
        averageGrade: 'B',
        totalLessons: 45,
        completedLessons: 40,
        upcomingAssignments: 1,
        syllabus: 'Algebra, Geometry, Trigonometry',
        description: 'Mathematics course focused on fundamental concepts and problem-solving skills.',
      },
      {
        id: 3,
        className: 'Grade 11A',
        subject: 'Physics',
        section: 'A',
        students: 32,
        room: 'Lab 201',
        schedule: [
          { day: 'Monday', time: '10:00-10:45' },
          { day: 'Wednesday', time: '2:00-2:45' },
          { day: 'Thursday', time: '3:00-3:45' },
        ],
        attendanceRate: 96,
        averageGrade: 'A-',
        totalLessons: 40,
        completedLessons: 38,
        upcomingAssignments: 3,
        syllabus: 'Mechanics, Thermodynamics, Waves',
        description: 'Advanced physics covering mechanics, thermodynamics, and wave phenomena.',
      },
      {
        id: 4,
        className: 'Grade 11B',
        subject: 'Physics',
        section: 'B',
        students: 29,
        room: 'Lab 202',
        schedule: [
          { day: 'Tuesday', time: '10:00-10:45' },
          { day: 'Thursday', time: '2:00-2:45' },
          { day: 'Friday', time: '3:00-3:45' },
        ],
        attendanceRate: 93,
        averageGrade: 'B+',
        totalLessons: 40,
        completedLessons: 36,
        upcomingAssignments: 2,
        syllabus: 'Mechanics, Thermodynamics, Waves',
        description: 'Physics course emphasizing practical applications and laboratory experiments.',
      },
    ];

    setTimeout(() => {
      setClasses(mockClasses);
      setIsLoading(false);
    }, 1000);
  }, []);

  const subjects = ['Mathematics', 'Physics'];

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || classItem.subject === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
  };

  const getAttendanceColor = (rate) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 90) return 'text-blue-600';
    if (rate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Classes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your assigned classes and track progress
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button className="btn-outline flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Assignment</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Classes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {classes.length}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
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
                {classes.reduce((total, cls) => total + cls.students, 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
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
                Avg Attendance
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(classes.reduce((total, cls) => total + cls.attendanceRate, 0) / classes.length)}%
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-purple-500" />
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
                Subjects
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {subjects.length}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input-field min-w-[120px]"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClasses.map((classItem, index) => (
          <motion.div
            key={classItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              {/* Class Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {classItem.className}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium">
                    {classItem.subject}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/teacher/classes/${classItem.id}`}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Class Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {classItem.students} students
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {classItem.room}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-gray-400" />
                  <span className={`text-sm font-medium ${getAttendanceColor(classItem.attendanceRate)}`}>
                    {classItem.attendanceRate}% attendance
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${getGradeColor(classItem.averageGrade)}`}>
                    {classItem.averageGrade} avg
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Lessons Progress</span>
                  <span>{classItem.completedLessons}/{classItem.totalLessons}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(classItem.completedLessons / classItem.totalLessons) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Weekly Schedule
                </h4>
                <div className="space-y-1">
                  {classItem.schedule.map((schedule, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{schedule.day}</span>
                      <span>•</span>
                      <span>{schedule.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-2">
                <Link
                  to="/teacher/attendance"
                  className="flex-1 btn-outline text-xs py-2"
                >
                  Take Attendance
                </Link>
                <Link
                  to="/teacher/grades"
                  className="flex-1 btn-primary text-xs py-2"
                >
                  Enter Grades
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No classes found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || selectedSubject !== 'all' 
              ? 'Try adjusting your search filters.' 
              : 'You don\'t have any classes assigned yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyClasses;