import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, Check, X, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const attendanceData = [
  { id: 'STU001', name: 'Alice Johnson', status: 'Present' },
  { id: 'STU005', name: 'Ethan Davis', status: 'Present' },
  { id: 'STU008', name: 'Grace Lee', status: 'Absent' },
  { id: 'STU012', name: 'Kevin White', status: 'Late' },
  { id: 'STU015', name: 'Olivia Green', status: 'Present' },
];

const AttendancePage = () => {
  const handleStatusChange = (studentId, newStatus) => {
    toast({
      title: 'Attendance Updated',
      description: `Student ${studentId} marked as ${newStatus}.`,
    });
  };

  const handleSubmitAttendance = () => {
    toast({
      title: 'Attendance Submitted',
      description: 'Today\'s attendance for Grade 10A has been submitted successfully.',
      variant: 'success',
    });
  };

  return (
    <>
      <Helmet>
        <title>Mark Attendance - EduManage</title>
        <meta name="description" content="Mark and manage student attendance for your classes." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mark Attendance</h1>
          <p className="text-muted-foreground">Select a class and mark today's attendance.</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Grade 10A - Mathematics</CardTitle>
                <CardDescription>Date: {new Date().toLocaleDateString()}</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Select defaultValue="10A">
                  <option value="10A">Grade 10A</option>
                  <option value="10B">Grade 10B</option>
                  <option value="11A">Grade 11A</option>
                </Select>
                <Button onClick={handleSubmitAttendance}>Submit Attendance</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === 'Present' ? 'success' : student.status === 'Absent' ? 'destructive' : 'warning'}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(student.id, 'Present')}>Present</Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(student.id, 'Absent')}>Absent</Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(student.id, 'Late')}>Late</Button>
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