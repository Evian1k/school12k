
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const UnauthorizedPage = () => {
  return (
    <>
      <Helmet>
        <title>Unauthorized Access - EduManage</title>
        <meta name="description" content="You don't have permission to access this page." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md mx-auto"
        >
          <Card className="glass-effect border-white/20">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
              <p className="text-gray-300 mb-6">
                You don't have permission to access this page. Please contact your administrator if you believe this is an error.
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

export default UnauthorizedPage;
