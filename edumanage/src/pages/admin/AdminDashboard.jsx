import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  UserPlus,
  Plus,
  BarChart3,
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      name: 'Total Students',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: GraduationCap,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Teachers',
      value: '45',
      change: '+3%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      name: 'Total Classes',
      value: '28',
      change: '+2',
      changeType: 'positive',
      icon: BookOpen,
      color: 'bg-purple-500',
    },
    {
      name: 'Fees Collected',
      value: '$45,670',
      change: '+8%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New student registered',
      user: 'John Doe',
      time: '2 minutes ago',
      type: 'student',
    },
    {
      id: 2,
      action: 'Fee payment received',
      user: 'Sarah Smith',
      amount: '$1,200',
      time: '1 hour ago',
      type: 'payment',
    },
    {
      id: 3,
      action: 'New teacher added',
      user: 'Mike Johnson',
      time: '3 hours ago',
      type: 'teacher',
    },
    {
      id: 4,
      action: 'Class schedule updated',
      user: 'Admin',
      time: '5 hours ago',
      type: 'schedule',
    },
  ];

  const quickActions = [
    {
      name: 'Add Student',
      icon: UserPlus,
      href: '/admin/students',
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    },
    {
      name: 'Add Teacher',
      icon: Plus,
      href: '/admin/teachers',
      color: 'bg-green-100 text-green-600 hover:bg-green-200',
    },
    {
      name: 'Create Class',
      icon: BookOpen,
      href: '/admin/classes',
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    },
    {
      name: 'View Reports',
      icon: BarChart3,
      href: '/admin/reports',
      color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's what's happening at your school today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400">
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                      from last month
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <a
                  key={action.name}
                  href={action.href}
                  className={`p-4 rounded-lg transition-colors ${action.color} flex flex-col items-center text-center`}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">{action.name}</span>
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activities
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.action}</span>
                    {activity.user && (
                      <>
                        {' by '}
                        <span className="font-medium text-primary-600 dark:text-primary-400">
                          {activity.user}
                        </span>
                      </>
                    )}
                    {activity.amount && (
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {' '}({activity.amount})
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Overview
        </h3>
        <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">
              Chart visualization would go here
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;