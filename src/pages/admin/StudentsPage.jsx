import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, PlusCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DataTable from '@/components/DataTable';
import { toast } from '@/components/ui/use-toast';

const studentsData = [
  { id: 'STU001', name: 'Alice Johnson', class: '10A', dob: '2008-05-12', parent: 'John Johnson', status: 'active' },
  { id: 'STU002', name: 'Bob Williams', class: '11B', dob: '2007-09-23', parent: 'Jane Williams', status: 'active' },
  { id: 'STU003', name: 'Charlie Brown', class: '9C', dob: '2009-02-18', parent: 'Charles Brown', status: 'inactive' },
  { id: 'STU004', name: 'Diana Miller', class: '12A', dob: '2006-11-30', parent: 'David Miller', status: 'active' },
  { id: 'STU005', name: 'Ethan Davis', class: '10A', dob: '2008-07-07', parent: 'Emily Davis', status: 'active' },
];

const StudentsPage = () => {
  const handleAction = (action, student) => {
    toast({
      title: `Action: ${action}`,
      description: `Performing '${action}' on student ${student.name}. This is a demo.`,
    });
  };

  const columns = [
    { accessorKey: 'id', header: 'Student ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'class', header: 'Class' },
    { accessorKey: 'dob', header: 'Date of Birth' },
    { accessorKey: 'parent', header: 'Parent Name' },
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
            <DataTable columns={columns} data={studentsData} filterColumn="name" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default StudentsPage;