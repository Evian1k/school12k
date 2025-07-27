import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Frown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 Not Found - EduManage</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md mx-auto"
        >
          <Card className="glass-effect border-white/20">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Frown className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-5xl font-bold text-white mb-2">404</h1>
              <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
              <p className="text-gray-300 mb-6">
                Sorry, the page you are looking for could not be found. It might have been removed, had its name changed, or is temporarily unavailable.
              </p>
              
              <Link to="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;