import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, PlusCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DataTable from '@/components/DataTable';
import { toast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const assignmentsData = [
  { id: 'ASG001', title: 'Algebra Quiz', class: '10A', dueDate: '2024-02-15', submissions: '25/30' },
  { id: 'ASG002', title: 'Geometry Project', class: '10B', dueDate: '2024-02-18', submissions: '20/28' },
  { id: 'ASG003', title: 'Calculus Test', class: '11A', dueDate: '2024-02-20', submissions: '28/32' },
  { id: 'ASG004', title: 'Statistics Homework', class: '11B', dueDate: '2024-02-22', submissions: '15/29' },
  { id: 'ASG005', title: 'Trigonometry Worksheet', class: '10A', dueDate: '2024-02-25', submissions: '0/30' },
];

const AssignmentsPage = () => {
  const handleAction = (action, assignment) => {
    toast({
      title: `Action: ${action}`,
      description: `Performing '${action}' on assignment: "${assignment.title}". This is a demo.`,
    });
  };

  const columns = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'class', header: 'Class' },
    { accessorKey: 'dueDate', header: 'Due Date' },
    { accessorKey: 'submissions', header: 'Submissions' },
    {
      id: 'actions',
      cell: ({ row }) => {
        const assignment = row.original;
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
              <DropdownMenuItem onClick={() => handleAction('View Submissions', assignment)}>View Submissions</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Grade', assignment)}>Grade</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Edit', assignment)}>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Assignments - EduManage</title>
        <meta name="description" content="Create and manage assignments for your classes." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
            <p className="text-muted-foreground">Create, distribute, and grade assignments.</p>
          </div>
          <Button onClick={() => handleAction('Create New Assignment', {})}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Assignment
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assignment List</CardTitle>
            <CardDescription>A list of all your created assignments.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={assignmentsData} filterColumn="title" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default AssignmentsPage;