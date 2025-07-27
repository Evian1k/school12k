import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, UserCheck, BarChart3 } from 'lucide-react';

const TeacherDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Teacher Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your classes and track student progress.
        </p>
      </div>

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
                4
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
                120
              </p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Teacher Dashboard Content
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          This is a placeholder for the teacher dashboard. Full implementation coming soon.
        </p>
      </div>
    </div>
  );
};

export default TeacherDashboard;