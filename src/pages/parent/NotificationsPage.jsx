import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const notificationsData = [
  { id: 'NOTIF001', title: 'Grade Update: Math Quiz', date: '2024-02-15', content: 'Emma scored an A- on the recent Math quiz.', type: 'Grade' },
  { id: 'NOTIF002', title: 'Attendance Alert', date: '2024-02-09', content: 'Emma was marked absent from school today.', type: 'Attendance' },
  { id: 'NOTIF003', title: 'Fee Reminder: Lab Fee', date: '2024-02-08', content: 'A reminder that the Lab Fee of $150 is due on Feb 15.', type: 'Fee' },
  { id: 'NOTIF004', title: 'School Event: Science Fair', date: '2024-02-05', content: 'The annual Science Fair is next week. All parents are invited.', type: 'Event' },
];

const NotificationsPage = () => {
  return (
    <>
      <Helmet>
        <title>Notifications - EduManage</title>
        <meta name="description" content="View notifications regarding your child and school events." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Important updates about your child and the school.</p>
        </div>

        <div className="space-y-4">
          {notificationsData.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{notification.title}</CardTitle>
                      <CardDescription>Received on: {notification.date}</CardDescription>
                    </div>
                    <Badge variant={
                      notification.type === 'Grade' ? 'success' :
                      notification.type === 'Attendance' ? 'destructive' :
                      notification.type === 'Fee' ? 'warning' : 'default'
                    }>{notification.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{notification.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default NotificationsPage;