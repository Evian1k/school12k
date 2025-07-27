// Date formatting utilities
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', mergedOptions);
  } catch (error) {
    return dateString;
  }
};

export const formatTime = (timeString) => {
  try {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    return timeString;
  }
};

export const formatDateTime = (dateTimeString) => {
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    return dateTimeString;
  }
};

// Number formatting utilities
export const formatCurrency = (amount, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    return `$${amount}`;
  }
};

export const formatPercentage = (value, decimals = 0) => {
  try {
    return `${Number(value).toFixed(decimals)}%`;
  } catch (error) {
    return `${value}%`;
  }
};

export const formatNumber = (value, options = {}) => {
  try {
    return new Intl.NumberFormat('en-US', options).format(value);
  } catch (error) {
    return value.toString();
  }
};

// String formatting utilities
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.split(' ').map(capitalizeFirst).join(' ');
};

export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + suffix;
};

// Grade formatting utilities
export const getGradeColor = (grade) => {
  if (!grade) return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
  
  const gradeUpper = grade.toString().toUpperCase();
  
  if (gradeUpper.startsWith('A')) {
    return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
  }
  if (gradeUpper.startsWith('B')) {
    return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
  }
  if (gradeUpper.startsWith('C')) {
    return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
  }
  if (gradeUpper.startsWith('D')) {
    return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200';
  }
  if (gradeUpper.startsWith('F')) {
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
  }
  
  return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
};

export const getAttendanceStatus = (percentage) => {
  if (percentage >= 95) return { color: 'text-green-600', label: 'Excellent' };
  if (percentage >= 90) return { color: 'text-blue-600', label: 'Good' };
  if (percentage >= 85) return { color: 'text-yellow-600', label: 'Average' };
  if (percentage >= 75) return { color: 'text-orange-600', label: 'Below Average' };
  return { color: 'text-red-600', label: 'Poor' };
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Phone number formatting
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phoneNumber;
};

// Student ID formatting
export const formatStudentId = (id) => {
  if (!id) return '';
  return id.toString().toUpperCase();
};

// Class name formatting
export const formatClassName = (className) => {
  if (!className) return '';
  return className.replace(/([a-z])([A-Z])/g, '$1 $2');
};

// Time ago formatting
export const timeAgo = (dateString) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return formatDate(dateString);
  } catch (error) {
    return dateString;
  }
};

// Export CSV utility
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};