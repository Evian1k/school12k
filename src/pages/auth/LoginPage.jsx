
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, GraduationCap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@edumanage.com', password: 'admin123' },
    { role: 'Teacher', email: 'teacher@edumanage.com', password: 'teacher123' },
    { role: 'Student', email: 'student@edumanage.com', password: 'student123' },
    { role: 'Guardian', email: 'guardian@edumanage.com', password: 'guardian123' }
  ];

  const fillDemoAccount = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <>
      <Helmet>
        <title>Login - EduManage School Management System</title>
        <meta name="description" content="Login to your EduManage account to access your school management dashboard." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-6"
          >
            <Link to="/" className="inline-flex items-center space-x-3 text-white hover:text-gray-200 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-white">EduManage</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Welcome Back!
            </h1>
            <p className="text-xl text-gray-300">
              Sign in to access your school management dashboard and continue managing your educational institution.
            </p>
          </motion.div>

          {/* Right side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <Card className="glass-effect border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white">Sign In</CardTitle>
                <p className="text-gray-300">Enter your credentials to continue</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                {/* Demo Accounts */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-300 text-center">Quick Demo Access:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {demoAccounts.map((account) => (
                      <Button
                        key={account.role}
                        variant="outline"
                        size="sm"
                        onClick={() => fillDemoAccount(account.email, account.password)}
                        className="border-white/20 text-white hover:bg-white/10 text-xs"
                      >
                        {account.role}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-300">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
