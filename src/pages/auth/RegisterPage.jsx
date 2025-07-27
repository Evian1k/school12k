
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, GraduationCap, ArrowLeft, RefreshCw, CheckCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student'
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('registration'); // 'registration' or 'verification'
  const { sendRegistrationCode, verifyRegistrationCode, resendCode, loading, pendingVerification } = useAuth();

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    const result = await sendRegistrationCode(formData);
    if (result.success) {
      setStep('verification');
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode) return;
    
    const result = await verifyRegistrationCode(verificationCode);
    if (result.success) {
      // Navigation handled by auth context
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleResendCode = async () => {
    await resendCode();
  };

  const handleBackToRegistration = () => {
    setStep('registration');
    setVerificationCode('');
  };

  return (
    <>
      <Helmet>
        <title>Register - EduManage School Management System</title>
        <meta name="description" content="Create your EduManage account to start managing your educational institution efficiently." />
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
              {step === 'registration' ? 'Join EduManage' : 'Verify Your Email'}
            </h1>
            <p className="text-xl text-gray-300">
              {step === 'registration' 
                ? 'Create your account and start transforming your educational institution with our comprehensive management system.'
                : 'We\'ve sent a 6-digit verification code to your email. Enter it below to complete your registration.'
              }
            </p>
          </motion.div>

          {/* Right side - Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <Card className="glass-effect border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white flex items-center justify-center space-x-2">
                  {step === 'registration' ? (
                    <>
                      <UserPlus className="w-6 h-6" />
                      <span>Create Account</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-6 h-6" />
                      <span>Verify Email</span>
                    </>
                  )}
                </CardTitle>
                <p className="text-gray-300">
                  {step === 'registration' 
                    ? 'Fill in your details to get started'
                    : `Code sent to ${pendingVerification?.email || formData.email}`
                  }
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {step === 'registration' ? (
                  <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Full Name</label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        autoComplete="name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Email Address</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        autoComplete="email"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Role</label>
                      <Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="bg-white/10 border-white/20 text-white"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="parent">Parent</option>
                        <option value="admin">Administrator</option>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Sending Code...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Verification Code
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerificationSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Verification Code</label>
                      <Input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit code"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-center text-lg tracking-widest"
                        maxLength={6}
                        autoComplete="one-time-code"
                      />
                      <p className="text-xs text-gray-400 text-center">
                        Check your email for the verification code
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || verificationCode.length !== 6}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Verify & Create Account
                        </>
                      )}
                    </Button>

                    <div className="flex justify-between items-center text-sm">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleResendCode}
                        disabled={loading}
                        className="text-gray-300 hover:text-white p-0 h-auto"
                      >
                        Resend Code
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBackToRegistration}
                        className="text-gray-300 hover:text-white p-0 h-auto"
                      >
                        Change Details
                      </Button>
                    </div>
                  </form>
                )}

                {step === 'registration' && (
                  <div className="text-center">
                    <p className="text-gray-300">
                      Already have an account?{' '}
                      <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                )}

                {step === 'verification' && (
                  <div className="text-center space-y-2">
                    <p className="text-xs text-gray-400">
                      The verification code is displayed in the browser console for demo purposes
                    </p>
                    <p className="text-gray-300">
                      Already have an account?{' '}
                      <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
