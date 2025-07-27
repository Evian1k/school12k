import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BookOpen, PlusCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DataTable from '@/components/DataTable';
import { toast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const classesData = [
  { id: 'CLS001', name: 'Grade 10A', teacher: 'Sarah Johnson', students: 30, room: '101' },
  { id: 'CLS002', name: 'Grade 10B', teacher: 'Michael Smith', students: 28, room: '102' },
  { id: 'CLS003', name: 'Grade 11A', teacher: 'Jessica Lee', students: 32, room: '201' },
  { id: 'CLS004', name: 'Grade 11B', teacher: 'Robert Brown', students: 29, room: '202' },
  { id: 'CLS005', name: 'Grade 12A', teacher: 'Emily White', students: 25, room: '301' },
];

const ClassesPage = () => {
  const handleAction = (action, classInfo) => {
    toast({
      title: `Action: ${action}`,
      description: `Performing '${action}' on class ${classInfo.name}. This is a demo.`,
    });
  };

  const columns = [
    { accessorKey: 'id', header: 'Class ID' },
    { accessorKey: 'name', header: 'Class Name' },
    { accessorKey: 'teacher', header: 'Class Teacher' },
    { accessorKey: 'students', header: 'No. of Students' },
    { accessorKey: 'room', header: 'Room No.' },
    {
      id: 'actions',
      cell: ({ row }) => {
        const classInfo = row.original;
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
              <DropdownMenuItem onClick={() => handleAction('View Roster', classInfo)}>View Roster</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Edit', classInfo)}>Edit Class</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Assign Teacher', classInfo)}>Assign Teacher</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Classes Management - EduManage</title>
        <meta name="description" content="Manage all classes in the school." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Classes Management</h1>
            <p className="text-muted-foreground">Organize and manage all classes and their details.</p>
          </div>
          <Button onClick={() => handleAction('Create New Class', {})}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Class
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Class List</CardTitle>
            <CardDescription>A list of all active classes in the school.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={classesData} filterColumn="name" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default ClassesPage;