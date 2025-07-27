import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Settings, 
  GraduationCap,
  UserCheck,
  DollarSign,
  Bell,
  FileText,
  Clock,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Sidebar = ({ isMobileOpen, onCloseMobile, isCollapsed, onToggleCollapse }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', path: `/${user?.role}` }
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { icon: Users, label: 'Students', path: '/admin/students' },
          { icon: UserCheck, label: 'Staff', path: '/admin/staff' },
          { icon: BookOpen, label: 'Classes', path: '/admin/classes' },
          { icon: GraduationCap, label: 'Subjects', path: '/admin/subjects' },
          { icon: BarChart3, label: 'Grades', path: '/admin/grades' },
          { icon: Calendar, label: 'Attendance', path: '/admin/attendance' },
          { icon: DollarSign, label: 'Fees', path: '/admin/fees' },
          { icon: Bell, label: 'Announcements', path: '/admin/announcements' },
        ];
      case 'teacher':
        return [
          ...baseItems,
          { icon: Users, label: 'My Classes', path: '/teacher/classes' },
          { icon: Calendar, label: 'Attendance', path: '/teacher/attendance' },
          { icon: BarChart3, label: 'Grades', path: '/teacher/grades' },
          { icon: FileText, label: 'Assignments', path: '/teacher/assignments' },
          { icon: Bell, label: 'Notices', path: '/teacher/notices' },
        ];
      case 'student':
        return [
          ...baseItems,
          { icon: BarChart3, label: 'My Grades', path: '/student/grades' },
          { icon: Calendar, label: 'Attendance', path: '/student/attendance' },
          { icon: Clock, label: 'Timetable', path: '/student/timetable' },
          { icon: DollarSign, label: 'Fees', path: '/student/fees' },
          { icon: FileText, label: 'Assignments', path: '/student/assignments' },
          { icon: Bell, label: 'Announcements', path: '/student/announcements' },
        ];
      case 'parent':
        return [
          ...baseItems,
          { icon: BarChart3, label: 'Child\'s Grades', path: '/parent/grades' },
          { icon: Calendar, label: 'Attendance', path: '/parent/attendance' },
          { icon: DollarSign, label: 'Fee Status', path: '/parent/fees' },
          { icon: Bell, label: 'Notifications', path: '/parent/notifications' },
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();
  const settingsPath = `/${user?.role}/settings`;

  const NavItem = ({ item }) => {
    const isActive = location.pathname.startsWith(item.path) && (item.path !== `/${user?.role}` || location.pathname === item.path);
    const commonClasses = 'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group';
    
    if (isCollapsed) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to={item.path}
                onClick={onCloseMobile}
                className={cn(
                  'justify-center',
                  commonClasses,
                  isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
                aria-label={item.label}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-800 text-white border-none">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Link
        to={item.path}
        onClick={onCloseMobile}
        className={cn(commonClasses, isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white')}
      >
        <item.icon className="h-5 w-5" />
        <AnimatePresence>
          {!isCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-medium">{item.label}</motion.span>}
        </AnimatePresence>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onCloseMobile}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? '5rem' : '16rem' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 z-50 h-full sidebar-gradient border-r border-gray-700 lg:static lg:z-auto transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
          {/* Logo */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white whitespace-nowrap">EduManage</span>
                </motion.div>
              )}
            </AnimatePresence>
            {isCollapsed && (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          <nav className="flex-1 p-2 space-y-2 mt-4">
            {menuItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>

          <div className="p-2 mt-auto">
             <NavItem item={{ icon: Settings, label: 'Settings', path: '/settings' }} />
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className={cn("flex items-center space-x-3 p-2 rounded-lg bg-gray-800/50", isCollapsed && "justify-center")}>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-white font-medium truncate whitespace-nowrap">{user?.name}</p>
                    <p className="text-gray-400 text-sm capitalize whitespace-nowrap">{user?.role}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;