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
        <title>Fee Status - EduManage</title>
        <meta name="description" content="View and manage your child's fee payments." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fee Status</h1>
          <p className="text-muted-foreground">Fee payment history for Emma Johnson.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fee History</CardTitle>
            <CardDescription>A detailed list of fee transactions.</CardDescription>
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