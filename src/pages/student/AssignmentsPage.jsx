import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

const assignmentsData = [
  { id: 'ASG001', subject: 'Mathematics', title: 'Algebra Quiz', dueDate: '2024-02-15', status: 'Graded', grade: 'A-' },
  { id: 'ASG002', subject: 'Science', title: 'Physics Lab Report', dueDate: '2024-02-18', status: 'Submitted' },
  { id: 'ASG003', subject: 'English', title: 'Book Review', dueDate: '2024-02-20', status: 'Pending' },
  { id: 'ASG004', subject: 'History', title: 'Research Project', dueDate: '2024-02-22', status: 'Graded', grade: 'A' },
  { id: 'ASG005', subject: 'Art', title: 'Still Life Drawing', dueDate: '2024-02-25', status: 'Pending' },
];

const AssignmentsPage = () => {
  const handleAction = (action, assignment) => {
    toast({
      title: `Action: ${action}`,
      description: `Performing '${action}' for assignment: "${assignment.title}". This is a demo.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>My Assignments - EduManage</title>
        <meta name="description" content="View and manage your assignments." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Assignments</h1>
          <p className="text-muted-foreground">Keep track of your coursework and submissions.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assignment List</CardTitle>
            <CardDescription>All your assignments, both pending and completed.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignmentsData.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.subject}</TableCell>
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>{assignment.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant={
                        assignment.status === 'Graded' ? 'success' :
                        assignment.status === 'Submitted' ? 'default' : 'warning'
                      }>{assignment.status}</Badge>
                    </TableCell>
                    <TableCell>{assignment.grade || 'N/A'}</TableCell>
                    <TableCell>
                      {assignment.status === 'Pending' && (
                        <Button size="sm" onClick={() => handleAction('Submit', assignment)}>Submit</Button>
                      )}
                      {assignment.status !== 'Pending' && (
                        <Button size="sm" variant="outline" onClick={() => handleAction('View', assignment)}>View</Button>
                      )}
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

export default AssignmentsPage;