
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, GraduationCap, ArrowLeft, RefreshCw, CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('email'); // 'email', 'password', or 'verification'
  const [loginMethod, setLoginMethod] = useState('code'); // 'code' or 'password'
  const { sendLoginCode, loginWithPassword, verifyLoginCode, resendCode, loading, pendingVerification } = useAuth();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    // Check if this is the admin email that requires password
    if (email.toLowerCase() === 'emmanuelevian@gmail.com') {
      setLoginMethod('password');
      setStep('password');
      return;
    }
    
    const result = await sendLoginCode(email);
    if (result.success) {
      setStep('verification');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const result = await loginWithPassword(email, password);
    if (result.success) {
      // Navigation handled by auth context
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode) return;
    
    const result = await verifyLoginCode(verificationCode);
    if (result.success) {
      // Navigation handled by auth context
    }
  };

  const handleResendCode = async () => {
    await resendCode();
  };

  const handleBackToEmail = () => {
    setStep('email');
    setEmail('');
    setPassword('');
    setVerificationCode('');
    setLoginMethod('code');
  };

  const fillDemoEmail = (demoEmail) => {
    setEmail(demoEmail);
  };

  const demoAccounts = [
    { role: 'Admin', email: 'emmanuelevian@gmail.com' },
    { role: 'Teacher', email: 'teacher@school.com' },
    { role: 'Student', email: 'student@school.com' },
    { role: 'Parent', email: 'parent@school.com' }
  ];

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
              {step === 'email' ? 'Welcome Back!' : 
               step === 'password' ? 'Enter Password' : 'Check Your Email'}
            </h1>
            <p className="text-xl text-gray-300">
              {step === 'email' 
                ? 'Enter your email address and we\'ll send you a verification code to sign in securely.'
                : step === 'password'
                ? 'Enter your password to complete the login process.'
                : 'We\'ve sent a 6-digit verification code to your email. Enter it below to continue.'
              }
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
                <CardTitle className="text-2xl font-bold text-white flex items-center justify-center space-x-2">
                  {step === 'email' ? (
                    <>
                      <Mail className="w-6 h-6" />
                      <span>Sign In</span>
                    </>
                  ) : step === 'password' ? (
                    <>
                      <Lock className="w-6 h-6" />
                      <span>Admin Login</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      <span>Verify Code</span>
                    </>
                  )}
                </CardTitle>
                <p className="text-gray-300">
                  {step === 'email' 
                    ? 'Enter your email to receive a verification code'
                    : step === 'password'
                    ? `Enter password for ${email}`
                    : `Code sent to ${pendingVerification?.email || email}`
                  }
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {step === 'email' ? (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Email Address</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        autoComplete="email"
                        aria-describedby="email-help"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || !email}
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
                ) : step === 'password' ? (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || !password}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Sign In as Admin
                        </>
                      )}
                    </Button>

                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBackToEmail}
                        className="text-gray-300 hover:text-white p-0 h-auto"
                      >
                        ← Back to Email
                      </Button>
                    </div>
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
                          Verify & Sign In
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
                        onClick={handleBackToEmail}
                        className="text-gray-300 hover:text-white p-0 h-auto"
                      >
                        Change Email
                      </Button>
                    </div>
                  </form>
                )}

                {step === 'email' && (
                  <>
                    {/* Demo Accounts */}
                    <div className="space-y-3">
                      <p className="text-sm text-gray-300 text-center">Quick Demo Access:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {demoAccounts.map((account) => (
                          <Button
                            key={account.role}
                            variant="outline"
                            size="sm"
                            onClick={() => fillDemoEmail(account.email)}
                            className="border-white/20 text-white hover:bg-white/10 text-xs"
                          >
                            {account.role}
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 text-center">
                        Click any role to fill email. Admin requires password, others use verification codes.
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-gray-300">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                          Sign up here
                        </Link>
                      </p>
                    </div>
                  </>
                )}

                {step === 'verification' && (
                  <div className="text-center">
                    <p className="text-xs text-gray-400">
                      The verification code is displayed in the browser console for demo purposes
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

export default LoginPage;
