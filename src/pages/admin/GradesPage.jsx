import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BarChart3, PlusCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DataTable from '@/components/DataTable';
import { toast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const gradesData = [
  { id: 'GRD001', student: 'Alice Johnson', class: '10A', subject: 'Mathematics', grade: 'A', score: 92, term: 'Mid-Term' },
  { id: 'GRD002', student: 'Bob Williams', class: '11B', subject: 'Physics', grade: 'B+', score: 88, term: 'Mid-Term' },
  { id: 'GRD003', student: 'Charlie Brown', class: '9C', subject: 'English', grade: 'C', score: 75, term: 'Mid-Term' },
  { id: 'GRD004', student: 'Alice Johnson', class: '10A', subject: 'Physics', grade: 'A-', score: 90, term: 'Mid-Term' },
  { id: 'GRD005', student: 'Diana Miller', class: '12A', subject: 'Chemistry', grade: 'B', score: 82, term: 'Mid-Term' },
];

const GradesPage = () => {
  const handleAction = (action, grade) => {
    toast({
      title: `Action: ${action}`,
      description: `Performing '${action}' on grade for ${grade.student}. This is a demo.`,
    });
  };

  const columns = [
    { accessorKey: 'student', header: 'Student Name' },
    { accessorKey: 'class', header: 'Class' },
    { accessorKey: 'subject', header: 'Subject' },
    { accessorKey: 'term', header: 'Term' },
    { accessorKey: 'score', header: 'Score' },
    {
      accessorKey: 'grade',
      header: 'Grade',
      cell: ({ row }) => {
        const grade = row.original.grade;
        return <Badge variant={grade.startsWith('A') ? 'success' : grade.startsWith('B') ? 'default' : 'warning'}>{grade}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const grade = row.original;
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
              <DropdownMenuItem onClick={() => handleAction('Edit Grade', grade)}>Edit Grade</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('View Details', grade)}>View Details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Grades Management - EduManage</title>
        <meta name="description" content="Manage student grades and performance records." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Grades Management</h1>
            <p className="text-muted-foreground">Input, view, and manage student grades.</p>
          </div>
          <Button onClick={() => handleAction('Add New Grade', {})}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Grade
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Grade Records</CardTitle>
            <CardDescription>A list of recent grade entries for students.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={gradesData} filterColumn="student" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default GradesPage;