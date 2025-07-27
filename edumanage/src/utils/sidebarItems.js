import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  ClipboardList,
  UserCheck,
  BarChart3,
  User,
  Calendar,
  MessageSquare,
  FileText,
  Baby,
  CreditCard,
  Bell,
} from 'lucide-react';

export const getSidebarItems = (role) => {
  const items = {
    admin: [
      {
        name: 'Dashboard',
        path: '/admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        name: 'Students',
        path: '/admin/students',
        icon: GraduationCap,
      },
      {
        name: 'Teachers',
        path: '/admin/teachers',
        icon: Users,
      },
      {
        name: 'Classes',
        path: '/admin/classes',
        icon: BookOpen,
      },
      {
        name: 'Fees Management',
        path: '/admin/fees',
        icon: DollarSign,
      },
    ],
    teacher: [
      {
        name: 'Dashboard',
        path: '/teacher/dashboard',
        icon: LayoutDashboard,
      },
      {
        name: 'My Classes',
        path: '/teacher/classes',
        icon: BookOpen,
      },
      {
        name: 'Attendance',
        path: '/teacher/attendance',
        icon: UserCheck,
      },
      {
        name: 'Grades',
        path: '/teacher/grades',
        icon: BarChart3,
      },
    ],
    student: [
      {
        name: 'Dashboard',
        path: '/student/dashboard',
        icon: LayoutDashboard,
      },
      {
        name: 'My Profile',
        path: '/student/profile',
        icon: User,
      },
      {
        name: 'My Grades',
        path: '/student/grades',
        icon: BarChart3,
      },
      {
        name: 'Attendance',
        path: '/student/attendance',
        icon: Calendar,
      },
      {
        name: 'Announcements',
        path: '/student/announcements',
        icon: Bell,
      },
    ],
    parent: [
      {
        name: 'Dashboard',
        path: '/parent/dashboard',
        icon: LayoutDashboard,
      },
      {
        name: 'Child Info',
        path: '/parent/child-info',
        icon: Baby,
      },
      {
        name: 'Academic Performance',
        path: '/parent/child-grades',
        icon: BarChart3,
      },
      {
        name: 'Attendance',
        path: '/parent/child-attendance',
        icon: Calendar,
      },
      {
        name: 'Fee Payments',
        path: '/parent/fees',
        icon: CreditCard,
      },
    ],
  };

  return items[role] || [];
};