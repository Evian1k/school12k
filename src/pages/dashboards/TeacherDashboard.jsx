
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, BookOpen, Calendar, CheckCircle, Clock, FileText, Bell } from 'lucide-react';
import StatsCard from '@/components/charts/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from '@/components/ui/use-toast';

const TeacherDashboard = () => {
  const stats = [
    { title: 'My Classes', value: '6', icon: BookOpen, trend: 'up', trendValue: '+1' },
    { title: 'Total Students', value: '156', icon: Users, trend: 'up', trendValue: '+8' },
    { title: 'Pending Grades', value: '23', icon: FileText, trend: 'down', trendValue: '-5' },
    { title: 'Today\'s Classes', value: '4', icon: Clock, trend: 'up', trendValue: '+1' }
  ];

  const attendanceData = [
    { class: 'Math 10A', present: 28, absent: 2 },
    { class: 'Math 10B', present: 25, absent: 5 },
    { class: 'Math 11A', present: 30, absent: 0 },
    { class: 'Math 11B', present: 27, absent: 3 }
  ];

  const todaySchedule = [
    { id: 1, time: '08:00 - 09:00', subject: 'Mathematics', class: '10A', room: 'Room 101', status: 'completed' },
    { id: 2, time: '09:15 - 10:15', subject: 'Mathematics', class: '10B', room: 'Room 101', status: 'completed' },
    { id: 3, time: '11:00 - 12:00', subject: 'Mathematics', class: '11A', room: 'Room 102', status: 'upcoming' },
    { id: 4, time: '14:00 - 15:00', subject: 'Mathematics', class: '11B', room: 'Room 102', status: 'upcoming' }
  ];

  const recentAssignments = [
    { id: 1, title: 'Algebra Quiz', class: '10A', dueDate: '2024-02-15', submitted: 25, total: 30 },
    { id: 2, title: 'Geometry Project', class: '10B', dueDate: '2024-02-18', submitted: 20, total: 30 },
    { id: 3, title: 'Calculus Test', class: '11A', dueDate: '2024-02-20', submitted: 28, total: 30 },
    { id: 4, title: 'Statistics Assignment', class: '11B', dueDate: '2024-02-22', submitted: 15, total: 30 }
  ];

  const pendingTasks = [
    { id: 1, task: 'Grade Algebra Quiz - 10A', priority: 'high', dueDate: 'Today' },
    { id: 2, task: 'Prepare Geometry Lesson Plan', priority: 'medium', dueDate: 'Tomorrow' },
    { id: 3, task: 'Update Student Progress Reports', priority: 'low', dueDate: 'This Week' },
    { id: 4, task: 'Parent Meeting - John Smith', priority: 'high', dueDate: 'Tomorrow' }
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
        <title>Teacher Dashboard - EduManage</title>
        <meta name="description" content="Teacher dashboard for managing classes, students, assignments, and academic activities." />
      </Helmet>

      <div className="space-y-6 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} delay={index * 0.1} />
          ))}
        </div>

        {/* Today's Schedule and Attendance */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Today's Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaySchedule.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{schedule.subject} - {schedule.class}</p>
                        <p className="text-sm text-muted-foreground">{schedule.time} • {schedule.room}</p>
                      </div>
                      <Badge variant={schedule.status === 'completed' ? 'success' : 'default'}>
                        {schedule.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Class Attendance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Class Attendance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="class" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" fill="#10B981" name="Present" />
                    <Bar dataKey="absent" fill="#EF4444" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Assignments and Tasks */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Assignments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span>Recent Assignments</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.title}</TableCell>
                        <TableCell>{assignment.class}</TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {assignment.submitted}/{assignment.total}
                          </span>
                        </TableCell>
                        <TableCell>{assignment.dueDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <span>Pending Tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{task.task}</p>
                        <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                      </div>
                      <Badge variant={
                        task.priority === 'high' ? 'destructive' : 
                        task.priority === 'medium' ? 'warning' : 'default'
                      }>
                        {task.priority}
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
                <Button onClick={() => handleQuickAction('Mark Attendance')} className="h-20 flex-col space-y-2">
                  <CheckCircle className="h-6 w-6" />
                  <span>Mark Attendance</span>
                </Button>
                <Button onClick={() => handleQuickAction('Enter Grades')} variant="outline" className="h-20 flex-col space-y-2">
                  <FileText className="h-6 w-6" />
                  <span>Enter Grades</span>
                </Button>
                <Button onClick={() => handleQuickAction('Create Assignment')} variant="outline" className="h-20 flex-col space-y-2">
                  <BookOpen className="h-6 w-6" />
                  <span>New Assignment</span>
                </Button>
                <Button onClick={() => handleQuickAction('Send Notice')} variant="outline" className="h-20 flex-col space-y-2">
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

export default TeacherDashboard;
