import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const timetableData = {
  Monday: [
    { time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Mr. Johnson', room: '101' },
    { time: '09:15 - 10:15', subject: 'Science', teacher: 'Ms. Davis', room: 'Lab 1' },
    { time: '11:00 - 12:00', subject: 'English', teacher: 'Mrs. Smith', room: '203' },
  ],
  Tuesday: [
    { time: '08:00 - 09:00', subject: 'History', teacher: 'Mr. Brown', room: '105' },
    { time: '09:15 - 10:15', subject: 'Art', teacher: 'Ms. Green', room: 'Art Room' },
    { time: '11:00 - 12:00', subject: 'Physical Education', teacher: 'Mr. White', room: 'Gym' },
  ],
  // ... add other days
};

const TimetablePage = () => {
  return (
    <>
      <Helmet>
        <title>My Timetable - EduManage</title>
        <meta name="description" content="View your weekly class schedule." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Timetable</h1>
          <p className="text-muted-foreground">Your weekly class schedule.</p>
        </div>

        <div className="space-y-8">
          {Object.entries(timetableData).map(([day, schedule], index) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{day}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Room</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedule.map((slot, slotIndex) => (
                        <TableRow key={slotIndex}>
                          <TableCell>{slot.time}</TableCell>
                          <TableCell className="font-medium">{slot.subject}</TableCell>
                          <TableCell>{slot.teacher}</TableCell>
                          <TableCell>{slot.room}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default TimetablePage;