
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, DollarSign, TrendingUp, Clock, FileText, Bell, Award } from 'lucide-react';
import StatsCard from '@/components/charts/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { toast } from '@/components/ui/use-toast';

const StudentDashboard = () => {
  const stats = [
    { title: 'Current GPA', value: '3.8', icon: Award, trend: 'up', trendValue: '+0.2' },
    { title: 'Attendance', value: '94%', icon: Calendar, trend: 'up', trendValue: '+2%' },
    { title: 'Assignments Due', value: '3', icon: FileText, trend: 'down', trendValue: '-2' },
    { title: 'Fee Balance', value: '$1,250', icon: DollarSign, trend: 'down', trendValue: '-$500' }
  ];

  const gradeProgress = [
    { month: 'Sep', gpa: 3.4 },
    { month: 'Oct', gpa: 3.5 },
    { month: 'Nov', gpa: 3.6 },
    { month: 'Dec', gpa: 3.7 },
    { month: 'Jan', gpa: 3.8 },
    { month: 'Feb', gpa: 3.8 }
  ];

  const subjectPerformance = [
    { subject: 'Mathematics', grade: 85, fullMark: 100 },
    { subject: 'Science', grade: 92, fullMark: 100 },
    { subject: 'English', grade: 88, fullMark: 100 },
    { subject: 'History', grade: 90, fullMark: 100 },
    { subject: 'Art', grade: 95, fullMark: 100 },
    { subject: 'PE', grade: 87, fullMark: 100 }
  ];

  const todaySchedule = [
    { id: 1, time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', status: 'completed' },
    { id: 2, time: '09:15 - 10:15', subject: 'Science', teacher: 'Ms. Davis', room: 'Lab 1', status: 'completed' },
    { id: 3, time: '11:00 - 12:00', subject: 'English', teacher: 'Mrs. Smith', room: 'Room 203', status: 'upcoming' },
    { id: 4, time: '14:00 - 15:00', subject: 'History', teacher: 'Mr. Brown', room: 'Room 105', status: 'upcoming' }
  ];

  const recentGrades = [
    { id: 1, subject: 'Mathematics', assignment: 'Algebra Quiz', grade: 'A-', points: '88/100', date: '2024-02-10' },
    { id: 2, subject: 'Science', assignment: 'Chemistry Lab', grade: 'A+', points: '95/100', date: '2024-02-08' },
    { id: 3, subject: 'English', assignment: 'Essay Writing', grade: 'B+', points: '85/100', date: '2024-02-05' },
    { id: 4, subject: 'History', assignment: 'Research Project', grade: 'A', points: '92/100', date: '2024-02-03' }
  ];

  const upcomingAssignments = [
    { id: 1, subject: 'Mathematics', title: 'Geometry Test', dueDate: '2024-02-15', priority: 'high' },
    { id: 2, subject: 'Science', title: 'Physics Lab Report', dueDate: '2024-02-18', priority: 'medium' },
    { id: 3, subject: 'English', title: 'Book Review', dueDate: '2024-02-20', priority: 'low' }
  ];

  const announcements = [
    { id: 1, title: 'Parent-Teacher Conference', date: '2024-02-15', type: 'meeting' },
    { id: 2, title: 'Science Fair Registration', date: '2024-02-20', type: 'event' },
    { id: 3, title: 'Mid-term Exam Schedule', date: '2024-02-25', type: 'exam' },
    { id: 4, title: 'Library Hours Extended', date: '2024-02-12', type: 'notice' }
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
        <title>Student Dashboard - EduManage</title>
        <meta name="description" content="Student dashboard for viewing grades, assignments, schedule, and academic progress." />
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
          {/* Grade Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>GPA Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={gradeProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[3.0, 4.0]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="gpa" stroke="#3B82F6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subject Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span>Subject Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={subjectPerformance}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Grade" dataKey="grade" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Schedule and Grades */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span>Today's Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaySchedule.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{schedule.subject}</p>
                        <p className="text-sm text-muted-foreground">{schedule.time} • {schedule.teacher} • {schedule.room}</p>
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

          {/* Recent Grades */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                  <span>Recent Grades</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentGrades.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell className="font-medium">{grade.subject}</TableCell>
                        <TableCell>{grade.assignment}</TableCell>
                        <TableCell>
                          <Badge variant={grade.grade.startsWith('A') ? 'success' : 'default'}>
                            {grade.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>{grade.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Assignments and Announcements */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Assignments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-red-600" />
                  <span>Upcoming Assignments</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">{assignment.subject} • Due: {assignment.dueDate}</p>
                      </div>
                      <Badge variant={
                        assignment.priority === 'high' ? 'destructive' : 
                        assignment.priority === 'medium' ? 'warning' : 'default'
                      }>
                        {assignment.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Announcements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <span>School Announcements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{announcement.title}</p>
                        <p className="text-sm text-muted-foreground">{announcement.date}</p>
                      </div>
                      <Badge variant={announcement.type === 'exam' ? 'destructive' : 'default'}>
                        {announcement.type}
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
                <Button onClick={() => handleQuickAction('View Timetable')} className="h-20 flex-col space-y-2">
                  <Calendar className="h-6 w-6" />
                  <span>View Timetable</span>
                </Button>
                <Button onClick={() => handleQuickAction('Submit Assignment')} variant="outline" className="h-20 flex-col space-y-2">
                  <FileText className="h-6 w-6" />
                  <span>Submit Work</span>
                </Button>
                <Button onClick={() => handleQuickAction('Check Grades')} variant="outline" className="h-20 flex-col space-y-2">
                  <Award className="h-6 w-6" />
                  <span>Check Grades</span>
                </Button>
                <Button onClick={() => handleQuickAction('Pay Fees')} variant="outline" className="h-20 flex-col space-y-2">
                  <DollarSign className="h-6 w-6" />
                  <span>Pay Fees</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default StudentDashboard;
