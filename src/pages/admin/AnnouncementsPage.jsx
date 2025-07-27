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

const announcementsData = [
  { id: 'ANN001', title: 'Parent-Teacher Conference', date: '2024-02-15', audience: 'Parents, Teachers', status: 'Published' },
  { id: 'ANN002', title: 'Science Fair Registration', date: '2024-02-10', audience: 'Students', status: 'Published' },
  { id: 'ANN003', title: 'Mid-Term Exam Schedule', date: '2024-02-08', audience: 'All', status: 'Published' },
  { id: 'ANN004', title: 'School Holiday Notice', date: '2024-03-01', audience: 'All', status: 'Draft' },
  { id: 'ANN005', title: 'Sports Day Announcement', date: '2024-02-20', audience: 'All', status: 'Published' },
];

const AnnouncementsPage = () => {
  const handleAction = (action, announcement) => {
    toast({
      title: `Action: ${action}`,
      description: `Performing '${action}' on announcement: "${announcement.title}". This is a demo.`,
    });
  };

  const columns = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'date', header: 'Publish Date' },
    { accessorKey: 'audience', header: 'Audience' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={status === 'Published' ? 'success' : 'secondary'}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const announcement = row.original;
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
              <DropdownMenuItem onClick={() => handleAction('Edit', announcement)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Publish', announcement)}>Publish</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Delete', announcement)} className="text-red-500">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Announcements - EduManage</title>
        <meta name="description" content="Create and manage school-wide announcements." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
            <p className="text-muted-foreground">Create, publish, and manage school announcements.</p>
          </div>
          <Button onClick={() => handleAction('Create New Announcement', {})}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Announcement
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Announcement List</CardTitle>
            <CardDescription>A list of all past and present announcements.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={announcementsData} filterColumn="title" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default AnnouncementsPage;