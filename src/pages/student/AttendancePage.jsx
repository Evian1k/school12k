import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const attendanceData = [
  { date: '2024-02-12', status: 'Present' },
  { date: '2024-02-11', status: 'Present' },
  { date: '2024-02-10', status: 'Present' },
  { date: '2024-02-09', status: 'Absent' },
  { date: '2024-02-08', status: 'Present' },
  { date: '2024-02-07', status: 'Late' },
  { date: '2024-02-06', status: 'Present' },
];

const attendanceSummary = [
  { name: 'Present', value: 5, color: '#10B981' },
  { name: 'Absent', value: 1, color: '#EF4444' },
  { name: 'Late', value: 1, color: '#F59E0B' },
];

const AttendancePage = () => {
  return (
    <>
      <Helmet>
        <title>My Attendance - EduManage</title>
        <meta name="description" content="View your attendance records and summary." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
          <p className="text-muted-foreground">Your attendance record for the current month.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-primary">94%</p>
                <p className="text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Attendance Summary</CardTitle>
                <CardDescription>A visual breakdown of your attendance.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={attendanceSummary} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {attendanceSummary.map((entry, index) => (
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

        <Card>
          <CardHeader>
            <CardTitle>Attendance Log</CardTitle>
            <CardDescription>Your daily attendance records.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Icon</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{record.date}</TableCell>
                    <TableCell>
                      <Badge variant={record.status === 'Present' ? 'success' : record.status === 'Absent' ? 'destructive' : 'warning'}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.status === 'Present' && <CheckCircle className="text-green-500" />}
                      {record.status === 'Absent' && <XCircle className="text-red-500" />}
                      {record.status === 'Late' && <Clock className="text-yellow-500" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default AttendancePage;