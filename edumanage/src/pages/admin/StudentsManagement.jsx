import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Upload,
  FileText,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'react-toastify';

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockStudents = [
    {
      id: 1,
      studentId: 'STU2024001',
      name: 'John Doe',
      email: 'john.doe@student.com',
      class: 'Grade 10A',
      section: 'A',
      rollNumber: '001',
      phone: '+1234567890',
      address: '123 Main St, City',
      dateOfBirth: '2008-05-15',
      gender: 'Male',
      guardianName: 'Robert Doe',
      guardianPhone: '+1234567891',
      status: 'active',
      admissionDate: '2024-01-15',
      avatar: null,
    },
    {
      id: 2,
      studentId: 'STU2024002',
      name: 'Jane Smith',
      email: 'jane.smith@student.com',
      class: 'Grade 10B',
      section: 'B',
      rollNumber: '002',
      phone: '+1234567892',
      address: '456 Oak Ave, City',
      dateOfBirth: '2008-08-22',
      gender: 'Female',
      guardianName: 'Mary Smith',
      guardianPhone: '+1234567893',
      status: 'active',
      admissionDate: '2024-01-16',
      avatar: null,
    },
    {
      id: 3,
      studentId: 'STU2024003',
      name: 'Mike Johnson',
      email: 'mike.johnson@student.com',
      class: 'Grade 11A',
      section: 'A',
      rollNumber: '001',
      phone: '+1234567894',
      address: '789 Pine St, City',
      dateOfBirth: '2007-12-10',
      gender: 'Male',
      guardianName: 'David Johnson',
      guardianPhone: '+1234567895',
      status: 'active',
      admissionDate: '2023-01-15',
      avatar: null,
    },
  ];

  const classes = ['Grade 9A', 'Grade 9B', 'Grade 10A', 'Grade 10B', 'Grade 11A', 'Grade 11B', 'Grade 12A', 'Grade 12B'];
  const statuses = ['active', 'inactive', 'graduated', 'transferred'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStudents(mockStudents);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleAddStudent = (studentData) => {
    const newStudent = {
      id: students.length + 1,
      studentId: `STU2024${String(students.length + 1).padStart(3, '0')}`,
      ...studentData,
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setStudents([...students, newStudent]);
    setShowAddModal(false);
    toast.success('Student added successfully!');
  };

  const handleEditStudent = (studentData) => {
    setStudents(students.map(student => 
      student.id === editingStudent.id ? { ...student, ...studentData } : student
    ));
    setEditingStudent(null);
    toast.success('Student updated successfully!');
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(student => student.id !== studentId));
      toast.success('Student deleted successfully!');
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Student ID', 'Name', 'Email', 'Class', 'Phone', 'Guardian Name', 'Status'],
      ...filteredStudents.map(student => [
        student.studentId,
        student.name,
        student.email,
        student.class,
        student.phone,
        student.guardianName,
        student.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Students data exported successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Students Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage student records, enrollment, and information
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={exportToCSV}
            className="btn-outline flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Students
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {students.length}
              </p>
            </div>
            <UserPlus className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Students
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {students.filter(s => s.status === 'active').length}
              </p>
            </div>
            <UserPlus className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                New This Month
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {students.filter(s => new Date(s.admissionDate).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
            <UserPlus className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Classes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Set(students.map(s => s.class)).size}
              </p>
            </div>
            <FileText className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input-field min-w-[120px]"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field min-w-[120px]"
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status} className="capitalize">
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Guardian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map((student) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          <span className="text-primary-600 dark:text-primary-400 font-medium">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {student.studentId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{student.class}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Roll: {student.rollNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{student.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{student.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{student.guardianName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{student.guardianPhone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : student.status === 'inactive'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {/* View student details */}}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingStudent(student)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Student Modal would go here */}
      {(showAddModal || editingStudent) && (
        <StudentModal
          student={editingStudent}
          onSave={editingStudent ? handleEditStudent : handleAddStudent}
          onClose={() => {
            setShowAddModal(false);
            setEditingStudent(null);
          }}
        />
      )}
    </div>
  );
};

// Simple Modal Component for Adding/Editing Students
const StudentModal = ({ student, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    class: student?.class || '',
    phone: student?.phone || '',
    guardianName: student?.guardianName || '',
    guardianPhone: student?.guardianPhone || '',
    address: student?.address || '',
    dateOfBirth: student?.dateOfBirth || '',
    gender: student?.gender || 'Male',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {student ? 'Edit Student' : 'Add New Student'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="label">Class</label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                  className="input-field"
                  required
                >
                  <option value="">Select Class</option>
                  <option value="Grade 9A">Grade 9A</option>
                  <option value="Grade 9B">Grade 9B</option>
                  <option value="Grade 10A">Grade 10A</option>
                  <option value="Grade 10B">Grade 10B</option>
                </select>
              </div>
              
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="label">Guardian Name</label>
                <input
                  type="text"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({...formData, guardianName: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="label">Guardian Phone</label>
                <input
                  type="tel"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {student ? 'Update' : 'Add'} Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentsManagement;