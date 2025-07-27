import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BookOpen, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const myClassesData = [
  { id: 'CLS001', name: 'Grade 10A', subject: 'Mathematics', students: 30, avgGrade: 'A-' },
  { id: 'CLS002', name: 'Grade 10B', subject: 'Mathematics', students: 28, avgGrade: 'B+' },
  { id: 'CLS003', name: 'Grade 11A', subject: 'Mathematics', students: 32, avgGrade: 'B' },
  { id: 'CLS004', name: 'Grade 11B', subject: 'Mathematics', students: 29, avgGrade: 'A' },
];

const ClassesPage = () => {
  const navigate = useNavigate();

  const handleAction = (action, classInfo) => {
    toast({
      title: `Navigating to ${action}`,
      description: `Opening ${action} for class ${classInfo.name}.`,
    });
    // In a real app, you'd navigate to the specific page, e.g.,
    // navigate(`/teacher/attendance?class=${classInfo.id}`);
  };

  return (
    <>
      <Helmet>
        <title>My Classes - EduManage</title>
        <meta name="description" content="View and manage your assigned classes." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
          <p className="text-muted-foreground">An overview of all your assigned classes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myClassesData.map((classInfo, index) => (
            <motion.div
              key={classInfo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="card-hover h-full flex flex-col">
                <CardHeader>
                  <CardTitle>{classInfo.name}</CardTitle>
                  <CardDescription>{classInfo.subject}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center"><Users className="w-4 h-4 mr-2" /> Students</span>
                    <span>{classInfo.students}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center"><BarChart3 className="w-4 h-4 mr-2" /> Avg. Grade</span>
                    <span>{classInfo.avgGrade}</span>
                  </div>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full" onClick={() => handleAction('Class Details', classInfo)}>
                    <BookOpen className="mr-2 h-4 w-4" /> View Class
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default ClassesPage;