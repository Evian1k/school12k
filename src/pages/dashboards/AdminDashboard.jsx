
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, Calendar, Bell, UserCheck } from 'lucide-react';
import StatsCard from '@/components/charts/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { toast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Students', value: '1,247', icon: Users, trend: 'up', trendValue: '+12%' },
    { title: 'Total Staff', value: '89', icon: UserCheck, trend: 'up', trendValue: '+3%' },
    { title: 'Active Classes', value: '42', icon: BookOpen, trend: 'up', trendValue: '+2%' },
    { title: 'Monthly Revenue', value: '$45,230', icon: DollarSign, trend: 'up', trendValue: '+8%' }
  ];

  const enrollmentData = [
    { month: 'Jan', students: 1100 },
    { month: 'Feb', students: 1150 },
    { month: 'Mar', students: 1180 },
    { month: 'Apr', students: 1200 },
    { month: 'May', students: 1220 },
    { month: 'Jun', students: 1247 }
  ];

  const gradeDistribution = [
    { grade: 'A', count: 312, color: '#10B981' },
    { grade: 'B', count: 456, color: '#3B82F6' },
    { grade: 'C', count: 298, color: '#F59E0B' },
    { grade: 'D', count: 124, color: '#EF4444' },
    { grade: 'F', count: 57, color: '#6B7280' }
  ];

  const recentActivities = [
    { id: 1, action: 'New student enrollment', user: 'John Smith', time: '2 hours ago', type: 'enrollment' },
    { id: 2, action: 'Grade report generated', user: 'Sarah Johnson', time: '4 hours ago', type: 'report' },
    { id: 3, action: 'Fee payment received', user: 'Mike Davis', time: '6 hours ago', type: 'payment' },
    { id: 4, action: 'Staff meeting scheduled', user: 'Admin', time: '1 day ago', type: 'meeting' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Parent-Teacher Conference', date: '2024-02-15', type: 'meeting' },
    { id: 2, title: 'Science Fair', date: '2024-02-20', type: 'event' },
    { id: 3, title: 'Mid-term Exams', date: '2024-02-25', type: 'exam' },
    { id: 4, title: 'Sports Day', date: '2024-03-01', type: 'event' }
  ];

  const handleQuickAction = (action) => {
    toast({
      title: `${action}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - EduManage</title>
        <meta name="description" content="Comprehensive admin dashboard for school management with analytics, student data, and administrative tools." />
      </Helmet>

      <div className="space-y-6 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} delay={index * 0.1} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Enrollment Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Student Enrollment Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Grade Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                  <span>Grade Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ grade, count }) => `${grade}: ${count}`}
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Activity and Events Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <span>Recent Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.user}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={activity.type === 'payment' ? 'success' : 'default'}>
                          {activity.type}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                      <Badge variant={event.type === 'exam' ? 'destructive' : 'default'}>
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button onClick={() => handleQuickAction('Add New Student')} className="h-20 flex-col space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Add Student</span>
                </Button>
                <Button onClick={() => handleQuickAction('Create Class')} variant="outline" className="h-20 flex-col space-y-2">
                  <BookOpen className="h-6 w-6" />
                  <span>Create Class</span>
                </Button>
                <Button onClick={() => handleQuickAction('Generate Report')} variant="outline" className="h-20 flex-col space-y-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>Generate Report</span>
                </Button>
                <Button onClick={() => handleQuickAction('Send Announcement')} variant="outline" className="h-20 flex-col space-y-2">
                  <Bell className="h-6 w-6" />
                  <span>Send Notice</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default AdminDashboard;
