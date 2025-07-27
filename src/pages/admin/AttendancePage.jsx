import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DataTable from '@/components/DataTable';
import { toast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const attendanceData = [
  { id: 'ATT001', student: 'Alice Johnson', class: '10A', date: '2024-02-12', status: 'Present' },
  { id: 'ATT002', student: 'Bob Williams', class: '11B', date: '2024-02-12', status: 'Present' },
  { id: 'ATT003', student: 'Charlie Brown', class: '9C', date: '2024-02-12', status: 'Absent' },
  { id: 'ATT004', student: 'Diana Miller', class: '12A', date: '2024-02-12', status: 'Present' },
  { id: 'ATT005', student: 'Ethan Davis', class: '10A', date: '2024-02-12', status: 'Late' },
];

const AttendancePage = () => {
  const handleAction = (action, record) => {
    toast({
      title: `Action: ${action}`,
      description: `Performing '${action}' on attendance for ${record.student}. This is a demo.`,
    });
  };

  const columns = [
    { accessorKey: 'student', header: 'Student Name' },
    { accessorKey: 'class', header: 'Class' },
    { accessorKey: 'date', header: 'Date' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={status === 'Present' ? 'success' : status === 'Absent' ? 'destructive' : 'warning'}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const record = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleAction('Edit Status', record)}>Edit Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('View History', record)}>View History</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Attendance Management - EduManage</title>
        <meta name="description" content="Track and manage student attendance." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
            <p className="text-muted-foreground">Monitor daily student attendance records.</p>
          </div>
          <Button onClick={() => handleAction('Take Attendance', {})}>
            <CheckCircle className="mr-2 h-4 w-4" /> Take Attendance
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daily Attendance Log</CardTitle>
            <CardDescription>Attendance records for today.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={attendanceData} filterColumn="student" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default AttendancePage;