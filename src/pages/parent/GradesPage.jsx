import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const gradesData = [
  { subject: 'Mathematics', term: 'Mid-Term', grade: 'A', score: 92 },
  { subject: 'Science', term: 'Mid-Term', grade: 'A-', score: 90 },
  { subject: 'English', term: 'Mid-Term', grade: 'B+', score: 88 },
  { subject: 'History', term: 'Mid-Term', grade: 'A', score: 95 },
];

const GradesPage = () => {
  return (
    <>
      <Helmet>
        <title>Child's Grades - EduManage</title>
        <meta name="description" content="View your child's academic grades and performance." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Child's Grades</h1>
          <p className="text-muted-foreground">Academic performance of Emma Johnson for the current term.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Overall GPA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-primary">3.80</p>
                <p className="text-muted-foreground">Great Progress</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Scores across different subjects.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={gradesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Grade Report</CardTitle>
            <CardDescription>A breakdown of grades for the Mid-Term.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradesData.map((grade, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{grade.subject}</TableCell>
                    <TableCell>{grade.term}</TableCell>
                    <TableCell>{grade.score}/100</TableCell>
                    <TableCell>
                      <Badge variant={grade.grade.startsWith('A') ? 'success' : 'default'}>{grade.grade}</Badge>
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

export default GradesPage;