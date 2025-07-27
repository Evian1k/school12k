import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

const feeData = [
  { id: 'INV001', item: 'Tuition Fee', amount: 2000, dueDate: '2024-02-01', status: 'Paid' },
  { id: 'INV002', item: 'Lab Fee', amount: 150, dueDate: '2024-02-15', status: 'Unpaid' },
  { id: 'INV003', item: 'Library Fee', amount: 50, dueDate: '2024-02-15', status: 'Paid' },
  { id: 'INV004', item: 'Sports Fee', amount: 100, dueDate: '2024-02-15', status: 'Unpaid' },
  { id: 'INV005', item: 'Transport Fee', amount: 200, dueDate: '2024-02-01', status: 'Paid' },
];

const FeesPage = () => {
  const handlePayment = (fee) => {
    toast({
      title: 'Redirecting to Payment',
      description: `Processing payment for ${fee.item}. This is a demo.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>My Fees - EduManage</title>
        <meta name="description" content="View and manage your fee payments." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Fees</h1>
          <p className="text-muted-foreground">Your fee payment history and outstanding dues.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-destructive">$250.00</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Next Due Date</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">2024-03-15</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fee History</CardTitle>
            <CardDescription>A detailed list of your fee transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeData.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>{fee.id}</TableCell>
                    <TableCell className="font-medium">{fee.item}</TableCell>
                    <TableCell>${fee.amount.toFixed(2)}</TableCell>
                    <TableCell>{fee.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant={fee.status === 'Paid' ? 'success' : 'destructive'}>{fee.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {fee.status === 'Unpaid' && (
                        <Button size="sm" onClick={() => handlePayment(fee)}>Pay Now</Button>
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

export default FeesPage;