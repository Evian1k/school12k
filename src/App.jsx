import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import { Toaster } from '@/components/ui/toaster';
import { Loader2 } from 'lucide-react';

const LoadingFallback = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-background">
    <Loader2 className="h-16 w-16 animate-spin text-primary" />
  </div>
);

// Lazy load pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

// Lazy load dashboards
const AdminDashboard = lazy(() => import('@/pages/dashboards/AdminDashboard'));
const TeacherDashboard = lazy(() => import('@/pages/dashboards/TeacherDashboard'));
const StudentDashboard = lazy(() => import('@/pages/dashboards/StudentDashboard'));
const ParentDashboard = lazy(() => import('@/pages/dashboards/ParentDashboard'));

// Lazy load Admin pages
const StudentsPage = lazy(() => import('@/pages/admin/StudentsPage'));
const StaffPage = lazy(() => import('@/pages/admin/StaffPage'));
const AdminClassesPage = lazy(() => import('@/pages/admin/ClassesPage'));
const SubjectsPage = lazy(() => import('@/pages/admin/SubjectsPage'));
const AdminGradesPage = lazy(() => import('@/pages/admin/GradesPage'));
const AdminAttendancePage = lazy(() => import('@/pages/admin/AttendancePage'));
const FeesPage = lazy(() => import('@/pages/admin/FeesPage'));
const AnnouncementsPage = lazy(() => import('@/pages/admin/AnnouncementsPage'));

// Lazy load Teacher pages
const TeacherClassesPage = lazy(() => import('@/pages/teacher/ClassesPage'));
const TeacherAttendancePage = lazy(() => import('@/pages/teacher/AttendancePage'));
const TeacherGradesPage = lazy(() => import('@/pages/teacher/GradesPage'));
const TeacherAssignmentsPage = lazy(() => import('@/pages/teacher/AssignmentsPage'));
const NoticesPage = lazy(() => import('@/pages/teacher/NoticesPage'));

// Lazy load Student pages
const StudentGradesPage = lazy(() => import('@/pages/student/GradesPage'));
const StudentAttendancePage = lazy(() => import('@/pages/student/AttendancePage'));
const TimetablePage = lazy(() => import('@/pages/student/TimetablePage'));
const StudentFeesPage = lazy(() => import('@/pages/student/FeesPage'));
const StudentAssignmentsPage = lazy(() => import('@/pages/student/AssignmentsPage'));
const StudentAnnouncementsPage = lazy(() => import('@/pages/student/AnnouncementsPage'));

// Lazy load Parent pages
const ParentGradesPage = lazy(() => import('@/pages/parent/GradesPage'));
const ParentAttendancePage = lazy(() => import('@/pages/parent/AttendancePage'));
const ParentFeesPage = lazy(() => import('@/pages/parent/FeesPage'));
const ParentNotificationsPage = lazy(() => import('@/pages/parent/NotificationsPage'));

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<SettingsPage />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Layout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="staff" element={<StaffPage />} />
                <Route path="classes" element={<AdminClassesPage />} />
                <Route path="subjects" element={<SubjectsPage />} />
                <Route path="grades" element={<AdminGradesPage />} />
                <Route path="attendance" element={<AdminAttendancePage />} />
                <Route path="fees" element={<FeesPage />} />
                <Route path="announcements" element={<AnnouncementsPage />} />
                <Route path="settings" element={<Navigate to="/settings" />} />
              </Route>

              {/* Teacher Routes */}
              <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><Layout /></ProtectedRoute>}>
                <Route index element={<TeacherDashboard />} />
                <Route path="classes" element={<TeacherClassesPage />} />
                <Route path="attendance" element={<TeacherAttendancePage />} />
                <Route path="grades" element={<TeacherGradesPage />} />
                <Route path="assignments" element={<TeacherAssignmentsPage />} />
                <Route path="notices" element={<NoticesPage />} />
                <Route path="profile" element={<Navigate to="/settings" />} />
              </Route>

              {/* Student Routes */}
              <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><Layout /></ProtectedRoute>}>
                <Route index element={<StudentDashboard />} />
                <Route path="grades" element={<StudentGradesPage />} />
                <Route path="attendance" element={<StudentAttendancePage />} />
                <Route path="timetable" element={<TimetablePage />} />
                <Route path="fees" element={<StudentFeesPage />} />
                <Route path="assignments" element={<StudentAssignmentsPage />} />
                <Route path="announcements" element={<StudentAnnouncementsPage />} />
                <Route path="profile" element={<Navigate to="/settings" />} />
              </Route>

              {/* Parent Routes */}
              <Route path="/parent" element={<ProtectedRoute allowedRoles={['parent']}><Layout /></ProtectedRoute>}>
                <Route index element={<ParentDashboard />} />
                <Route path="grades" element={<ParentGradesPage />} />
                <Route path="attendance" element={<ParentAttendancePage />} />
                <Route path="fees" element={<ParentFeesPage />} />
                <Route path="notifications" element={<ParentNotificationsPage />} />
                <Route path="profile" element={<Navigate to="/settings" />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;