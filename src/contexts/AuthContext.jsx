
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Demo authentication - In production, replace with actual API call
      const mockUsers = [
        { id: 1, email: 'admin@school.com', password: 'admin123', role: 'admin', name: 'John Admin' },
        { id: 2, email: 'teacher@school.com', password: 'teacher123', role: 'teacher', name: 'Sarah Teacher' },
        { id: 3, email: 'student@school.com', password: 'student123', role: 'student', name: 'Mike Student' },
        { id: 4, email: 'parent@school.com', password: 'parent123', role: 'parent', name: 'Lisa Parent' }
      ];

      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const token = 'mock-jwt-token-' + foundUser.id;
        const userData = { ...foundUser };
        delete userData.password;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
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
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Demo registration - In production, replace with actual API call
      const newUser = {
        id: Date.now(),
        ...userData,
        role: userData.role || 'student'
      };
      
      const token = 'mock-jwt-token-' + newUser.id;
      delete newUser.password;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      toast({
        title: "Registration Successful",
        description: `Welcome to the school system, ${newUser.name}!`,
      });
      
      navigate('/');
      return { success: true };
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
