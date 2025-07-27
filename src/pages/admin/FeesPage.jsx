import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { DollarSign, PlusCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DataTable from '@/components/DataTable';
import { toast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const feesData = [
  { id: 'FEE001', student: 'Alice Johnson', class: '10A', amount: 2500, dueDate: '2024-03-01', status: 'Paid' },
  { id: 'FEE002', student: 'Bob Williams', class: '11B', amount: 2800, dueDate: '2024-03-01', status: 'Unpaid' },
  { id: 'FEE003', student: 'Charlie Brown', class: '9C', amount: 2200, dueDate: '2024-03-01', status: 'Paid' },
  { id: 'FEE004', student: 'Diana Miller', class: '12A', amount: 3000, dueDate: '2024-03-01', status: 'Overdue' },
  { id: 'FEE005', student: 'Ethan Davis', class: '10A', amount: 2500, dueDate: '2024-03-01', status: 'Paid' },
];

const FeesPage = () => {
  const handleAction = (action, fee) => {
    toast({
      title: `Action: ${action}`,
      description: `Performing '${action}' for student ${fee.student}. This is a demo.`,
    });
  };

  const columns = [
    { accessorKey: 'student', header: 'Student Name' },
    { accessorKey: 'class', header: 'Class' },
    { accessorKey: 'amount', header: 'Amount ($)' },
    { accessorKey: 'dueDate', header: 'Due Date' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={status === 'Paid' ? 'success' : status === 'Unpaid' ? 'warning' : 'destructive'}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const fee = row.original;
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
              <DropdownMenuItem onClick={() => handleAction('Record Payment', fee)}>Record Payment</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Send Reminder', fee)}>Send Reminder</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('View Invoice', fee)}>View Invoice</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Fees Management - EduManage</title>
        <meta name="description" content="Manage student fee payments and records." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fees Management</h1>
            <p className="text-muted-foreground">Track and manage all student fee transactions.</p>
          </div>
          <Button onClick={() => handleAction('Generate Invoices', {})}>
            <PlusCircle className="mr-2 h-4 w-4" /> Generate Invoices
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fee Records</CardTitle>
            <CardDescription>A list of all student fee records for the current term.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={feesData} filterColumn="student" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default FeesPage;