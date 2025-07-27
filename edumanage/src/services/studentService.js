import api from './api';

// Mock data for students
let mockStudents = [
  {
    id: 1,
    studentId: 'STU2024001',
    name: 'John Doe',
    email: 'john.doe@student.com',
    phone: '+1234567890',
    address: '123 Main St, City',
    dateOfBirth: '2008-05-15',
    gender: 'Male',
    class: 'Grade 10A',
    section: 'A',
    rollNumber: '001',
    guardianName: 'Robert Doe',
    guardianPhone: '+1234567891',
    guardianEmail: 'robert.doe@parent.com',
    status: 'active',
    admissionDate: '2024-01-15',
    avatar: null,
    bloodGroup: 'O+',
    religion: 'Christianity',
    nationality: 'American',
    previousSchool: 'ABC Elementary',
    medicalInfo: 'None',
    emergencyContact: '+1234567892',
    feeBalance: 1200,
    totalFees: 5000,
    paidFees: 3800,
  },
  {
    id: 2,
    studentId: 'STU2024002',
    name: 'Jane Smith',
    email: 'jane.smith@student.com',
    phone: '+1234567893',
    address: '456 Oak Ave, City',
    dateOfBirth: '2008-08-22',
    gender: 'Female',
    class: 'Grade 10B',
    section: 'B',
    rollNumber: '002',
    guardianName: 'Mary Smith',
    guardianPhone: '+1234567894',
    guardianEmail: 'mary.smith@parent.com',
    status: 'active',
    admissionDate: '2024-01-16',
    avatar: null,
    bloodGroup: 'A+',
    religion: 'Islam',
    nationality: 'American',
    previousSchool: 'XYZ Elementary',
    medicalInfo: 'Allergic to peanuts',
    emergencyContact: '+1234567895',
    feeBalance: 800,
    totalFees: 5000,
    paidFees: 4200,
  },
  {
    id: 3,
    studentId: 'STU2024003',
    name: 'Mike Johnson',
    email: 'mike.johnson@student.com',
    phone: '+1234567896',
    address: '789 Pine St, City',
    dateOfBirth: '2007-12-10',
    gender: 'Male',
    class: 'Grade 11A',
    section: 'A',
    rollNumber: '001',
    guardianName: 'David Johnson',
    guardianPhone: '+1234567897',
    guardianEmail: 'david.johnson@parent.com',
    status: 'active',
    admissionDate: '2023-01-15',
    avatar: null,
    bloodGroup: 'B+',
    religion: 'Judaism',
    nationality: 'American',
    previousSchool: 'PQR Middle School',
    medicalInfo: 'Asthma',
    emergencyContact: '+1234567898',
    feeBalance: 0,
    totalFees: 5200,
    paidFees: 5200,
  },
  {
    id: 4,
    studentId: 'STU2024004',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@student.com',
    phone: '+1234567899',
    address: '321 Elm St, City',
    dateOfBirth: '2009-03-18',
    gender: 'Female',
    class: 'Grade 9A',
    section: 'A',
    rollNumber: '015',
    guardianName: 'Jennifer Wilson',
    guardianPhone: '+1234567800',
    guardianEmail: 'jennifer.wilson@parent.com',
    status: 'active',
    admissionDate: '2024-02-01',
    avatar: null,
    bloodGroup: 'AB+',
    religion: 'Hindu',
    nationality: 'American',
    previousSchool: 'DEF Elementary',
    medicalInfo: 'None',
    emergencyContact: '+1234567801',
    feeBalance: 2500,
    totalFees: 4800,
    paidFees: 2300,
  },
];

export const studentService = {
  // Get all students with optional filters
  async getStudents(filters = {}) {
    try {
      const response = await api.get('/students', { params: filters });
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      
      let filteredStudents = [...mockStudents];
      
      // Apply filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredStudents = filteredStudents.filter(student =>
          student.name.toLowerCase().includes(searchTerm) ||
          student.studentId.toLowerCase().includes(searchTerm) ||
          student.email.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.class && filters.class !== 'all') {
        filteredStudents = filteredStudents.filter(student =>
          student.class === filters.class
        );
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredStudents = filteredStudents.filter(student =>
          student.status === filters.status
        );
      }
      
      return {
        students: filteredStudents,
        total: filteredStudents.length,
        page: filters.page || 1,
        limit: filters.limit || 10,
      };
    }
  },

  // Get single student by ID
  async getStudent(id) {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      const student = mockStudents.find(s => s.id === parseInt(id));
      if (!student) {
        throw new Error('Student not found');
      }
      return student;
    }
  },

  // Create new student
  async createStudent(studentData) {
    try {
      const response = await api.post('/students', studentData);
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      
      const newStudent = {
        id: Math.max(...mockStudents.map(s => s.id)) + 1,
        studentId: `STU2024${String(mockStudents.length + 1).padStart(3, '0')}`,
        ...studentData,
        status: 'active',
        admissionDate: new Date().toISOString().split('T')[0],
        avatar: null,
        feeBalance: studentData.totalFees || 5000,
        paidFees: 0,
      };
      
      mockStudents.push(newStudent);
      return newStudent;
    }
  },

  // Update student
  async updateStudent(id, studentData) {
    try {
      const response = await api.put(`/students/${id}`, studentData);
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      
      const index = mockStudents.findIndex(s => s.id === parseInt(id));
      if (index === -1) {
        throw new Error('Student not found');
      }
      
      mockStudents[index] = { ...mockStudents[index], ...studentData };
      return mockStudents[index];
    }
  },

  // Delete student
  async deleteStudent(id) {
    try {
      await api.delete(`/students/${id}`);
      return { success: true };
    } catch (error) {
      console.warn('API not available, using mock data');
      
      const index = mockStudents.findIndex(s => s.id === parseInt(id));
      if (index === -1) {
        throw new Error('Student not found');
      }
      
      mockStudents.splice(index, 1);
      return { success: true };
    }
  },

  // Get student grades
  async getStudentGrades(id) {
    try {
      const response = await api.get(`/students/${id}/grades`);
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      
      // Mock grades data
      return [
        { subject: 'Mathematics', grade: 'A', score: 95, date: '2024-01-20', type: 'Quiz', teacher: 'Ms. Johnson' },
        { subject: 'Physics', grade: 'B+', score: 87, date: '2024-01-18', type: 'Test', teacher: 'Mr. Smith' },
        { subject: 'Chemistry', grade: 'A-', score: 91, date: '2024-01-15', type: 'Assignment', teacher: 'Dr. Brown' },
        { subject: 'English', grade: 'A', score: 94, date: '2024-01-12', type: 'Essay', teacher: 'Ms. Davis' },
        { subject: 'History', grade: 'B', score: 83, date: '2024-01-10', type: 'Project', teacher: 'Mr. Wilson' },
      ];
    }
  },

  // Get student attendance
  async getStudentAttendance(id, filters = {}) {
    try {
      const response = await api.get(`/students/${id}/attendance`, { params: filters });
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      
      // Mock attendance data
      return {
        present: 85,
        absent: 7,
        late: 3,
        total: 95,
        percentage: 92,
        records: [
          { date: '2024-01-22', status: 'present', subject: 'Mathematics' },
          { date: '2024-01-22', status: 'present', subject: 'Physics' },
          { date: '2024-01-21', status: 'late', subject: 'Chemistry' },
          { date: '2024-01-21', status: 'present', subject: 'English' },
          { date: '2024-01-20', status: 'present', subject: 'History' },
        ]
      };
    }
  },

  // Get classes list for dropdown
  async getClasses() {
    try {
      const response = await api.get('/classes');
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      
      return [
        'Grade 9A', 'Grade 9B', 'Grade 9C',
        'Grade 10A', 'Grade 10B', 'Grade 10C',
        'Grade 11A', 'Grade 11B', 'Grade 11C',
        'Grade 12A', 'Grade 12B', 'Grade 12C'
      ];
    }
  },

  // Bulk operations
  async bulkUpdateStudents(studentIds, updateData) {
    try {
      const response = await api.put('/students/bulk', { studentIds, updateData });
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      
      studentIds.forEach(id => {
        const index = mockStudents.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
          mockStudents[index] = { ...mockStudents[index], ...updateData };
        }
      });
      
      return { success: true, updated: studentIds.length };
    }
  },

  // Export students data
  async exportStudents(format = 'csv', filters = {}) {
    try {
      const response = await api.get('/students/export', { 
        params: { format, ...filters },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      
      const students = await this.getStudents(filters);
      return students.students;
    }
  },

  // Get student statistics
  async getStudentStats() {
    try {
      const response = await api.get('/students/stats');
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      
      const totalStudents = mockStudents.length;
      const activeStudents = mockStudents.filter(s => s.status === 'active').length;
      const currentMonth = new Date().getMonth();
      const newThisMonth = mockStudents.filter(s => 
        new Date(s.admissionDate).getMonth() === currentMonth
      ).length;
      
      const classCounts = mockStudents.reduce((acc, student) => {
        acc[student.class] = (acc[student.class] || 0) + 1;
        return acc;
      }, {});
      
      return {
        total: totalStudents,
        active: activeStudents,
        inactive: totalStudents - activeStudents,
        newThisMonth,
        byClass: classCounts,
        byGender: {
          male: mockStudents.filter(s => s.gender === 'Male').length,
          female: mockStudents.filter(s => s.gender === 'Female').length,
        },
      };
    }
  },
};