
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, Calendar, DollarSign, TrendingUp, Bell, Award, BookOpen, Clock } from 'lucide-react';
import StatsCard from '@/components/charts/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from '@/components/ui/use-toast';

const ParentDashboard = () => {
  const stats = [
    { title: 'Child\'s GPA', value: '3.8', icon: Award, trend: 'up', trendValue: '+0.2' },
    { title: 'Attendance Rate', value: '94%', icon: Calendar, trend: 'up', trendValue: '+2%' },
    { title: 'Outstanding Fees', value: '$1,250', icon: DollarSign, trend: 'down', trendValue: '-$500' },
    { title: 'Unread Messages', value: '3', icon: Bell, trend: 'up', trendValue: '+1' }
  ];

  const academicProgress = [
    { month: 'Sep', gpa: 3.4, attendance: 92 },
    { month: 'Oct', gpa: 3.5, attendance: 94 },
    { month: 'Nov', gpa: 3.6, attendance: 93 },
    { month: 'Dec', gpa: 3.7, attendance: 95 },
    { month: 'Jan', gpa: 3.8, attendance: 94 },
    { month: 'Feb', gpa: 3.8, attendance: 94 }
  ];

  const subjectGrades = [
    { subject: 'Mathematics', currentGrade: 'A-', points: 88 },
    { subject: 'Science', currentGrade: 'A+', points: 95 },
    { subject: 'English', currentGrade: 'B+', points: 85 },
    { subject: 'History', currentGrade: 'A', points: 92 },
    { subject: 'Art', currentGrade: 'A+', points: 98 },
    { subject: 'PE', currentGrade: 'B+', points: 87 }
  ];

  const recentActivities = [
    { id: 1, activity: 'Math Quiz Completed', grade: 'A-', date: '2024-02-10', subject: 'Mathematics' },
    { id: 2, activity: 'Science Project Submitted', grade: 'A+', date: '2024-02-08', subject: 'Science' },
    { id: 3, activity: 'English Essay Graded', grade: 'B+', date: '2024-02-05', subject: 'English' },
    { id: 4, activity: 'History Test Completed', grade: 'A', date: '2024-02-03', subject: 'History' }
  ];

  const upcomingEvents = [
    { id: 1, event: 'Parent-Teacher Conference', date: '2024-02-15', time: '2:00 PM', type: 'meeting' },
    { id: 2, event: 'Science Fair Presentation', date: '2024-02-20', time: '10:00 AM', type: 'event' },
    { id: 3, event: 'Mid-term Exams Begin', date: '2024-02-25', time: '8:00 AM', type: 'exam' },
    { id: 4, event: 'Sports Day', date: '2024-03-01', time: '9:00 AM', type: 'event' }
  ];

  const feeBreakdown = [
    { item: 'Tuition Fee', amount: 800, status: 'paid' },
    { item: 'Library Fee', amount: 50, status: 'paid' },
    { item: 'Lab Fee', amount: 150, status: 'pending' },
    { item: 'Sports Fee', amount: 100, status: 'pending' },
    { item: 'Transport Fee', amount: 200, status: 'paid' }
  ];

  const notifications = [
    { id: 1, title: 'Assignment Due Reminder', message: 'Math homework due tomorrow', time: '2 hours ago', type: 'reminder' },
    { id: 2, title: 'Grade Update', message: 'Science quiz grade posted', time: '1 day ago', type: 'grade' },
    { id: 3, title: 'School Event', message: 'Science fair registration open', time: '2 days ago', type: 'event' },
    { id: 4, title: 'Fee Reminder', message: 'Lab fee payment due next week', time: '3 days ago', type: 'fee' }
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
        <title>Parent Dashboard - EduManage</title>
        <meta name="description" content="Parent dashboard for monitoring child's academic progress, attendance, fees, and school communications." />
      </Helmet>

      <div className="space-y-6 animate-fade-in">
        {/* Child Info Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="card-hover bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Emma Johnson</h2>
                  <p className="text-blue-100">Grade 10A • Student ID: STU2024001</p>
                  <p className="text-blue-100">Class Teacher: Ms. Sarah Davis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} delay={index * 0.1} />
          ))}
        </div>

        {/* Academic Progress and Subject Grades */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Academic Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Academic Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={academicProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" domain={[3.0, 4.0]} />
                    <YAxis yAxisId="right" orientation="right" domain={[85, 100]} />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="gpa" stroke="#3B82F6" strokeWidth={3} name="GPA" />
                    <Line yAxisId="right" type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={3} name="Attendance %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subject Grades */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span>Current Subject Grades</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectGrades}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="points" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activities and Upcoming Events */}
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
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span>Recent Academic Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.activity}</TableCell>
                        <TableCell>{activity.subject}</TableCell>
                        <TableCell>
                          <Badge variant={activity.grade.startsWith('A') ? 'success' : 'default'}>
                            {activity.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>{activity.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{event.event}</p>
                        <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
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

        {/* Fee Status and Notifications */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Fee Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span>Fee Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeBreakdown.map((fee, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{fee.item}</TableCell>
                        <TableCell>${fee.amount}</TableCell>
                        <TableCell>
                          <Badge variant={fee.status === 'paid' ? 'success' : 'warning'}>
                            {fee.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2"><Bell className="h-5 w-5 text-red-600" />
                  <span>Recent Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                      <Badge variant={
                        notification.type === 'reminder' ? 'warning' : 
                        notification.type === 'grade' ? 'success' : 'default'
                      }>
                        {notification.type}
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
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button onClick={() => handleQuickAction('Pay Fees')} className="h-20 flex-col space-y-2">
                  <DollarSign className="h-6 w-6" />
                  <span>Pay Fees</span>
                </Button>
                <Button onClick={() => handleQuickAction('Schedule Meeting')} variant="outline" className="h-20 flex-col space-y-2">
                  <Calendar className="h-6 w-6" />
                  <span>Schedule Meeting</span>
                </Button>
                <Button onClick={() => handleQuickAction('View Report Card')} variant="outline" className="h-20 flex-col space-y-2">
                  <Award className="h-6 w-6" />
                  <span>View Report</span>
                </Button>
                <Button onClick={() => handleQuickAction('Contact Teacher')} variant="outline" className="h-20 flex-col space-y-2">
                  <Bell className="h-6 w-6" />
                  <span>Contact Teacher</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default ParentDashboard;
