import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BarChart3, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const gradesData = [
  { id: 'STU001', name: 'Alice Johnson', score: 92, grade: 'A' },
  { id: 'STU005', name: 'Ethan Davis', score: 85, grade: 'B+' },
  { id: 'STU008', name: 'Grace Lee', score: 78, grade: 'B-' },
  { id: 'STU012', name: 'Kevin White', score: null, grade: null },
  { id: 'STU015', name: 'Olivia Green', score: 95, grade: 'A+' },
];

const GradesPage = () => {
  const handleGradeChange = (studentId, score) => {
    toast({
      title: 'Grade Updated',
      description: `Score for student ${studentId} updated to ${score}.`,
    });
  };

  const handlePublishGrades = () => {
    toast({
      title: 'Grades Published',
      description: 'Grades for Mid-Term Exam have been published successfully.',
      variant: 'success',
    });
  };

  return (
    <>
      <Helmet>
        <title>Enter Grades - EduManage</title>
        <meta name="description" content="Enter and manage student grades for assignments and exams." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enter Grades</h1>
          <p className="text-muted-foreground">Input grades for your students' assessments.</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Grade Entry</CardTitle>
                <CardDescription>Class: Grade 10A | Assessment: Mid-Term Exam</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Select defaultValue="10A">
                  <option value="10A">Grade 10A</option>
                  <option value="10B">Grade 10B</option>
                </Select>
                <Select defaultValue="mid-term">
                  <option value="mid-term">Mid-Term Exam</option>
                  <option value="quiz-1">Algebra Quiz 1</option>
                </Select>
                <Button onClick={handlePublishGrades}>Publish Grades</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Score (out of 100)</TableHead>
                  <TableHead>Letter Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradesData.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        defaultValue={student.score}
                        className="w-24"
                        onChange={(e) => handleGradeChange(student.id, e.target.value)}
                      />
                    </TableCell>
                    <TableCell>{student.grade || 'N/A'}</TableCell>
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