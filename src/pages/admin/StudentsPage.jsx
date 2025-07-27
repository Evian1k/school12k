import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, PlusCircle, MoreHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DataTable from '@/components/DataTable';
import { toast } from '@/components/ui/use-toast';
import { studentsAPI } from '@/lib/api';

const StudentsPage = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      const formattedData = response.data.map(student => ({
        id: student.student_id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        class: student.class_name || 'Not assigned',
        guardian: student.guardian_name || 'Not assigned',
        admission_date: student.admission_date,
        status: student.is_active ? 'active' : 'inactive'
      }));
      setStudentsData(formattedData);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load students data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAction = (action, student) => {
    toast({
      title: `Action: ${action}`,
      description: `Performing '${action}' on student ${student.name}. This is a demo.`,
    });
  };

  const columns = [
    { accessorKey: 'id', header: 'Student ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'class', header: 'Class' },
    { accessorKey: 'guardian', header: 'Guardian Name' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={status === 'active' ? 'success' : 'destructive'}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const student = row.original;
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
              <DropdownMenuItem onClick={() => handleAction('View Details', student)}>View Details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Edit', student)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Deactivate', student)} className="text-red-500">Deactivate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Students Management - EduManage</title>
        <meta name="description" content="Manage all students in the school." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Students Management</h1>
            <p className="text-muted-foreground">View, add, and manage all student records.</p>
          </div>
          <Button onClick={() => handleAction('Add Student', {})}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Student
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>A comprehensive list of all students currently enrolled.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading students...</span>
              </div>
            ) : (
              <DataTable columns={columns} data={studentsData} filterColumn="name" />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default StudentsPage;