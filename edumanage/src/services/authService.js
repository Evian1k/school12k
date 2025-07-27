import api from './api';

// Mock data for demo purposes when backend is not available
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@edumanage.com',
    password: 'admin123',
    name: 'John Administrator',
    role: 'admin',
    avatar: null,
  },
  {
    id: 2,
    email: 'teacher@edumanage.com',
    password: 'teacher123',
    name: 'Sarah Teacher',
    role: 'teacher',
    avatar: null,
    subjects: ['Mathematics', 'Physics'],
    classes: ['Grade 10A', 'Grade 11B'],
  },
  {
    id: 3,
    email: 'student@edumanage.com',
    password: 'student123',
    name: 'Mike Student',
    role: 'student',
    avatar: null,
    studentId: 'STU2024001',
    class: 'Grade 10A',
    section: 'A',
  },
  {
    id: 4,
    email: 'parent@edumanage.com',
    password: 'parent123',
    name: 'Emily Parent',
    role: 'parent',
    avatar: null,
    children: [
      {
        id: 3,
        name: 'Mike Student',
        class: 'Grade 10A',
        studentId: 'STU2024001',
      },
    ],
  },
];

// Generate mock JWT token
const generateMockToken = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

export const authService = {
  async login(credentials) {
    try {
      // Try real API first
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Fallback to mock data if API is not available
      console.warn('API not available, using mock data');
      
      const user = MOCK_USERS.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      const { password, ...userWithoutPassword } = user;
      const token = generateMockToken(user);
      
      return {
        user: userWithoutPassword,
        token,
      };
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      // Mock registration
      console.warn('API not available, using mock registration');
      
      const existingUser = MOCK_USERS.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }
      
      const newUser = {
        id: MOCK_USERS.length + 1,
        ...userData,
        avatar: null,
      };
      
      MOCK_USERS.push(newUser);
      
      const { password, ...userWithoutPassword } = newUser;
      const token = generateMockToken(newUser);
      
      return {
        user: userWithoutPassword,
        token,
      };
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      // Mock current user from token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = MOCK_USERS.find(u => u.id === payload.id);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      } catch (error) {
        throw new Error('Invalid token');
      }
    }
  },

  async updateProfile(userData) {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      // Mock profile update
      console.warn('API not available, using mock profile update');
      
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userIndex = MOCK_USERS.findIndex(u => u.id === payload.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...userData };
      const { password, ...userWithoutPassword } = MOCK_USERS[userIndex];
      
      return userWithoutPassword;
    }
  },

  async changePassword(passwordData) {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      // Mock password change
      console.warn('API not available, using mock password change');
      
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userIndex = MOCK_USERS.findIndex(u => u.id === payload.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      if (MOCK_USERS[userIndex].password !== passwordData.currentPassword) {
        throw new Error('Current password is incorrect');
      }
      
      MOCK_USERS[userIndex].password = passwordData.newPassword;
      
      return { message: 'Password changed successfully' };
    }
  },
};