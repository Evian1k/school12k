import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Bell, PlusCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DataTable from '@/components/DataTable';
import { toast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const noticesData = [
  { id: 'NTC001', title: 'Math Club Meeting', date: '2024-02-14', audience: 'Grade 10A, 10B', status: 'Sent' },
  { id: 'NTC002', title: 'Extra Class for Geometry', date: '2024-02-16', audience: 'Grade 11A', status: 'Sent' },
  { id: 'NTC003', title: 'Upcoming Test Reminder', date: '2024-02-18', audience: 'All My Classes', status: 'Sent' },
  { id: 'NTC004', title: 'Project Submission Deadline', date: '2024-02-20', audience: 'Grade 10B', status: 'Draft' },
];

const NoticesPage = () => {
  const handleAction = (action, notice) => {
    toast({
      title: `Action: ${action}`,
      description: `Performing '${action}' on notice: "${notice.title}". This is a demo.`,
    });
  };

  const columns = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'date', header: 'Date Sent' },
    { accessorKey: 'audience', header: 'Audience' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={status === 'Sent' ? 'success' : 'secondary'}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const notice = row.original;
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
              <DropdownMenuItem onClick={() => handleAction('Edit', notice)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Send', notice)}>Send</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Delete', notice)} className="text-red-500">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Notices - EduManage</title>
        <meta name="description" content="Send notices and communications to students and parents." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Send Notices</h1>
            <p className="text-muted-foreground">Communicate with your students and their parents.</p>
          </div>
          <Button onClick={() => handleAction('Create New Notice', {})}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Notice
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notice History</CardTitle>
            <CardDescription>A list of all notices you have sent or drafted.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={noticesData} filterColumn="title" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default NoticesPage;