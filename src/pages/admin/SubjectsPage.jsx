import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { GraduationCap, PlusCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DataTable from '@/components/DataTable';
import { toast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const subjectsData = [
  { id: 'SUB001', name: 'Mathematics', code: 'MATH101', teacher: 'Sarah Johnson' },
  { id: 'SUB002', name: 'Physics', code: 'PHY101', teacher: 'Michael Smith' },
  { id: 'SUB003', name: 'English Literature', code: 'ENG201', teacher: 'Jessica Lee' },
  { id: 'SUB004', name: 'World History', code: 'HIST101', teacher: 'Robert Brown' },
  { id: 'SUB005', name: 'Chemistry', code: 'CHEM101', teacher: 'Michael Smith' },
];

const SubjectsPage = () => {
  const handleAction = (action, subject) => {
    toast({
      title: `Action: ${action}`,
      description: `Performing '${action}' on subject ${subject.name}. This is a demo.`,
    });
  };

  const columns = [
    { accessorKey: 'id', header: 'Subject ID' },
    { accessorKey: 'name', header: 'Subject Name' },
    { accessorKey: 'code', header: 'Subject Code' },
    { accessorKey: 'teacher', header: 'Assigned Teacher' },
    {
      id: 'actions',
      cell: ({ row }) => {
        const subject = row.original;
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
              <DropdownMenuItem onClick={() => handleAction('Edit', subject)}>Edit Subject</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Assign Teacher', subject)}>Assign Teacher</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('View Syllabus', subject)}>View Syllabus</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Subjects Management - EduManage</title>
        <meta name="description" content="Manage all academic subjects offered by the school." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subjects Management</h1>
            <p className="text-muted-foreground">Administer all academic subjects and their details.</p>
          </div>
          <Button onClick={() => handleAction('Add New Subject', {})}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Subject
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subject List</CardTitle>
            <CardDescription>A list of all subjects offered in the curriculum.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={subjectsData} filterColumn="name" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default SubjectsPage;