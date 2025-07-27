import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { UserCheck, PlusCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DataTable from '@/components/DataTable';
import { toast } from '@/components/ui/use-toast';

const staffData = [
  { id: 'STF001', name: 'Sarah Johnson', role: 'Teacher', department: 'Mathematics', joined: '2020-08-15', status: 'active' },
  { id: 'STF002', name: 'Michael Smith', role: 'Teacher', department: 'Science', joined: '2019-07-20', status: 'active' },
  { id: 'STF003', name: 'Emily Brown', role: 'Librarian', department: 'Library', joined: '2021-01-10', status: 'active' },
  { id: 'STF004', name: 'David Wilson', role: 'Accountant', department: 'Finance', joined: '2018-03-01', status: 'on_leave' },
  { id: 'STF005', name: 'Jessica Lee', role: 'Teacher', department: 'English', joined: '2022-09-01', status: 'active' },
];

const StaffPage = () => {
  const handleAction = (action, staff) => {
    toast({
      title: `Action: ${action}`,
      description: `Performing '${action}' on staff member ${staff.name}. This is a demo.`,
    });
  };

  const columns = [
    { accessorKey: 'id', header: 'Staff ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'role', header: 'Role' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'joined', header: 'Date Joined' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.status;
        return <Badge variant={status === 'active' ? 'success' : 'warning'}>{status.replace('_', ' ')}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const staff = row;
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
              <DropdownMenuItem onClick={() => handleAction('View Details', staff)}>View Details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Edit', staff)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Assign Role', staff)}>Assign Role</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Staff Management - EduManage</title>
        <meta name="description" content="Manage all staff members in the school." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
            <p className="text-muted-foreground">View, add, and manage all staff records.</p>
          </div>
          <Button onClick={() => handleAction('Add New Staff', {})}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Staff
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Staff List</CardTitle>
            <CardDescription>A comprehensive list of all staff members.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={staffData} filterColumn="name" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default StaffPage;