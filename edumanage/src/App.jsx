import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';

// Layout Components
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import ParentDashboard from './pages/parent/ParentDashboard';

// Admin Pages
import StudentsManagement from './pages/admin/StudentsManagement';
import TeachersManagement from './pages/admin/TeachersManagement';
import ClassesManagement from './pages/admin/ClassesManagement';
import FeesManagement from './pages/admin/FeesManagement';

// Teacher Pages
import MyClasses from './pages/teacher/MyClasses';
import Attendance from './pages/teacher/Attendance';
import Grades from './pages/teacher/Grades';

// Student Pages
import MyProfile from './pages/student/MyProfile';
import MyGrades from './pages/student/MyGrades';
import MyAttendance from './pages/student/MyAttendance';
import Announcements from './pages/student/Announcements';

// Parent Pages
import ChildInfo from './pages/parent/ChildInfo';
import ChildGrades from './pages/parent/ChildGrades';
import ChildAttendance from './pages/parent/ChildAttendance';
import FeePayments from './pages/parent/FeePayments';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Dashboard Redirect Component
const DashboardRedirect = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'teacher':
      return <Navigate to="/teacher/dashboard" replace />;
    case 'student':
      return <Navigate to="/student/dashboard" replace />;
    case 'parent':
      return <Navigate to="/parent/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Unauthorized Page
const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">403</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        You don't have permission to access this page.
      </p>
      <button
        onClick={() => window.history.back()}
        className="btn-primary"
      >
        Go Back
      </button>
    </div>
  </div>
);

// App Routes Component
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <DashboardRedirect /> : <LoginPage />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <DashboardRedirect /> : <RegisterPage />
        }
      />

      {/* Dashboard Redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? <DashboardRedirect /> : <Navigate to="/login" replace />
        }
      />

      {/* Protected Routes with Layout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/students"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <StudentsManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/teachers"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <TeachersManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/classes"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ClassesManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/fees"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <FeesManagement />
                    </ProtectedRoute>
                  }
                />

                {/* Teacher Routes */}
                <Route
                  path="/teacher/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <TeacherDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/classes"
                  element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <MyClasses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/attendance"
                  element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <Attendance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/grades"
                  element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <Grades />
                    </ProtectedRoute>
                  }
                />

                {/* Student Routes */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/profile"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <MyProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/grades"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <MyGrades />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/attendance"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <MyAttendance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/announcements"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <Announcements />
                    </ProtectedRoute>
                  }
                />

                {/* Parent Routes */}
                <Route
                  path="/parent/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['parent']}>
                      <ParentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/parent/child-info"
                  element={
                    <ProtectedRoute allowedRoles={['parent']}>
                      <ChildInfo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/parent/child-grades"
                  element={
                    <ProtectedRoute allowedRoles={['parent']}>
                      <ChildGrades />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/parent/child-attendance"
                  element={
                    <ProtectedRoute allowedRoles={['parent']}>
                      <ChildAttendance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/parent/fees"
                  element={
                    <ProtectedRoute allowedRoles={['parent']}>
                      <FeePayments />
                    </ProtectedRoute>
                  }
                />

                {/* Unauthorized Route */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
            
            {/* Toast Container */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />

            {/* WhatsApp Floating Button */}
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63z"/>
              </svg>
            </a>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
