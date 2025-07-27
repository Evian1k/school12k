
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock email service - In production, replace with actual email service
const sendVerificationEmail = async (email, code, type = 'verification') => {
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`📧 Email sent to ${email}:`);
  console.log(`🔐 Verification Code: ${code}`);
  console.log(`📋 Type: ${type}`);
  
  // In production, integrate with services like:
  // - SendGrid
  // - Mailgun
  // - AWS SES
  // - Nodemailer
  
  return { success: true };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Only set user if email is verified
        if (parsedUser.emailVerified) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const storeVerificationCode = (email, code, userData = null) => {
    const verificationData = {
      email,
      code,
      timestamp: Date.now(),
      expiresAt: Date.now() + (15 * 60 * 1000), // 15 minutes
      userData
    };
    localStorage.setItem('verification_pending', JSON.stringify(verificationData));
    setPendingVerification(verificationData);
  };

  const getUserDatabase = () => {
    const defaultUsers = [
      { id: 1, email: 'admin@school.com', role: 'admin', name: 'John Admin', emailVerified: true },
      { id: 2, email: 'teacher@school.com', role: 'teacher', name: 'Sarah Teacher', emailVerified: true },
      { id: 3, email: 'student@school.com', role: 'student', name: 'Mike Student', emailVerified: true },
      { id: 4, email: 'parent@school.com', role: 'parent', name: 'Lisa Parent', emailVerified: true }
    ];
    
    const registeredUsers = JSON.parse(localStorage.getItem('verifiedUsers') || '[]');
    return [...defaultUsers, ...registeredUsers];
  };

  const sendLoginCode = async (email) => {
    try {
      setLoading(true);
      
      const users = getUserDatabase();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error('No account found with this email address');
      }

      const code = generateVerificationCode();
      storeVerificationCode(email, code, user);
      
      await sendVerificationEmail(email, code, 'login');
      
      toast({
        title: "Verification Code Sent",
        description: `A 6-digit code has been sent to ${email}. Check your email and enter the code to sign in.`,
      });
      
      return { success: true, message: 'Verification code sent to your email' };
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Unable to send verification code",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const verifyLoginCode = async (code) => {
    try {
      setLoading(true);
      
      const verificationData = JSON.parse(localStorage.getItem('verification_pending') || '{}');
      
      if (!verificationData.code || !verificationData.userData) {
        throw new Error('No verification in progress. Please request a new code.');
      }
      
      if (Date.now() > verificationData.expiresAt) {
        localStorage.removeItem('verification_pending');
        setPendingVerification(null);
        throw new Error('Verification code has expired. Please request a new one.');
      }
      
      if (code !== verificationData.code) {
        throw new Error('Invalid verification code. Please check and try again.');
      }
      
      // Login successful
      const userData = verificationData.userData;
      const token = 'verified-token-' + userData.id + '-' + Date.now();
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.removeItem('verification_pending');
      setPendingVerification(null);
      setUser(userData);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.name}!`,
      });
      
      // Navigate based on role
      switch (userData.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'teacher':
          navigate('/teacher');
          break;
        case 'student':
          navigate('/student');
          break;
        case 'parent':
          navigate('/parent');
          break;
        default:
          navigate('/');
      }
      
      return { success: true };
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const sendRegistrationCode = async (userData) => {
    try {
      setLoading(true);
      
      // Check if user already exists
      const users = getUserDatabase();
      const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      
      if (existingUser) {
        throw new Error('An account with this email already exists. Try signing in instead.');
      }
      
      const code = generateVerificationCode();
      const newUserData = {
        id: Date.now(),
        ...userData,
        emailVerified: false,
        createdAt: new Date().toISOString()
      };
      
      storeVerificationCode(userData.email, code, newUserData);
      
      await sendVerificationEmail(userData.email, code, 'registration');
      
      toast({
        title: "Verification Code Sent",
        description: `A 6-digit code has been sent to ${userData.email}. Enter the code to complete your registration.`,
      });
      
      return { success: true, message: 'Verification code sent to your email' };
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message || "Unable to send verification code",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const verifyRegistrationCode = async (code) => {
    try {
      setLoading(true);
      
      const verificationData = JSON.parse(localStorage.getItem('verification_pending') || '{}');
      
      if (!verificationData.code || !verificationData.userData) {
        throw new Error('No verification in progress. Please start registration again.');
      }
      
      if (Date.now() > verificationData.expiresAt) {
        localStorage.removeItem('verification_pending');
        setPendingVerification(null);
        throw new Error('Verification code has expired. Please register again.');
      }
      
      if (code !== verificationData.code) {
        throw new Error('Invalid verification code. Please check and try again.');
      }
      
      // Registration successful
      const userData = { ...verificationData.userData, emailVerified: true };
      
      // Store in verified users database
      const verifiedUsers = JSON.parse(localStorage.getItem('verifiedUsers') || '[]');
      verifiedUsers.push(userData);
      localStorage.setItem('verifiedUsers', JSON.stringify(verifiedUsers));
      
      // Log them in
      const token = 'verified-token-' + userData.id + '-' + Date.now();
      const sessionUser = { ...userData };
      delete sessionUser.password; // Don't store password in session
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(sessionUser));
      localStorage.removeItem('verification_pending');
      setPendingVerification(null);
      setUser(sessionUser);
      
      toast({
        title: "Registration Successful",
        description: `Welcome to EduManage, ${userData.name}! Your account has been verified.`,
      });
      
      // Navigate based on role
      switch (userData.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'teacher':
          navigate('/teacher');
          break;
        case 'student':
          navigate('/student');
          break;
        case 'parent':
          navigate('/parent');
          break;
        default:
          navigate('/');
      }
      
      return { success: true };
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      const verificationData = JSON.parse(localStorage.getItem('verification_pending') || '{}');
      
      if (!verificationData.email) {
        throw new Error('No verification in progress');
      }
      
      const newCode = generateVerificationCode();
      const updatedData = {
        ...verificationData,
        code: newCode,
        timestamp: Date.now(),
        expiresAt: Date.now() + (15 * 60 * 1000)
      };
      
      localStorage.setItem('verification_pending', JSON.stringify(updatedData));
      setPendingVerification(updatedData);
      
      await sendVerificationEmail(verificationData.email, newCode, 'resend');
      
      toast({
        title: "Code Resent",
        description: `A new verification code has been sent to ${verificationData.email}`,
      });
      
      return { success: true };
    } catch (error) {
      toast({
        title: "Resend Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('verification_pending');
    setUser(null);
    setPendingVerification(null);
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const clearAllData = () => {
    localStorage.removeItem('verifiedUsers');
    localStorage.removeItem('verification_pending');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPendingVerification(null);
    toast({
      title: "All Data Cleared",
      description: "All user data has been cleared from the system.",
    });
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    pendingVerification,
    sendLoginCode,
    verifyLoginCode,
    sendRegistrationCode,
    verifyRegistrationCode,
    resendCode,
    logout,
    clearAllData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
