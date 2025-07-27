import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const announcementsData = [
  { id: 'ANN001', title: 'Parent-Teacher Conference Schedule', date: '2024-02-15', content: 'The parent-teacher conference will be held next week. Please book your slots.', type: 'Event' },
  { id: 'ANN002', title: 'Science Fair Winners', date: '2024-02-14', content: 'Congratulations to the winners of the annual science fair!', type: 'Achievement' },
  { id: 'ANN003', title: 'Mid-Term Exam Timetable', date: '2024-02-12', content: 'The timetable for the upcoming mid-term exams has been posted.', type: 'Exam' },
  { id: 'ANN004', title: 'Library Closure Notice', date: '2024-02-10', content: 'The library will be closed this Friday for maintenance.', type: 'Notice' },
];

const AnnouncementsPage = () => {
  return (
    <>
      <Helmet>
        <title>Announcements - EduManage</title>
        <meta name="description" content="View school-wide announcements and updates." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">Stay updated with the latest news from the school.</p>
        </div>

        <div className="space-y-4">
          {announcementsData.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{announcement.title}</CardTitle>
                      <CardDescription>Posted on: {announcement.date}</CardDescription>
                    </div>
                    <Badge variant={announcement.type === 'Exam' ? 'destructive' : 'default'}>{announcement.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{announcement.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default AnnouncementsPage;