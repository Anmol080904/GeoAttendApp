import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.geoattend.com'; // Replace with your actual API URL
const AUTH_TOKEN_KEY = 'auth_token';

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper function to make authenticated API calls
const makeAuthenticatedRequest = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      throw new Error('Session expired. Please login again.');
    }
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
};

// User Profile API calls
export const getUserProfile = async () => {
  try {
    // For now, return mock data from local storage
    // In a real app, this would be: return makeAuthenticatedRequest('/user/profile');
    const userData = await AsyncStorage.getItem('user_data');
    if (userData) {
      return JSON.parse(userData);
    }
    throw new Error('User profile not found');
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    // For now, update local storage
    // In a real app, this would be: return makeAuthenticatedRequest('/user/profile', { method: 'PUT', body: JSON.stringify(profileData) });
    const currentUser = await getUserProfile();
    const updatedUser = { ...currentUser, ...profileData };
    await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

// Attendance API calls
export const markAttendance = async (type, location) => {
  try {
    // For now, return mock success
    // In a real app, this would be: return makeAuthenticatedRequest('/attendance/mark', { method: 'POST', body: JSON.stringify({ type, location }) });
    return { success: true, message: `${type} marked successfully` };
  } catch (error) {
    console.error('Mark attendance error:', error);
    throw error;
  }
};

export const getAttendanceHistory = async (period = 'week') => {
  try {
    // For now, return mock data
    // In a real app, this would be: return makeAuthenticatedRequest(`/attendance/history?period=${period}`);
    const mockHistory = generateMockHistory(period);
    return mockHistory;
  } catch (error) {
    console.error('Get attendance history error:', error);
    throw error;
  }
};

// Helper function to generate mock attendance history
const generateMockHistory = (period) => {
  const today = new Date();
  const history = [];
  
  let daysToGenerate = 7; // week
  if (period === 'month') daysToGenerate = 30;
  if (period === 'year') daysToGenerate = 365;

  for (let i = 0; i < daysToGenerate; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Skip weekends for demo purposes
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const status = Math.random() > 0.1 ? 'present' : 'absent';
    const checkIn = status === 'present' ? '9:00 AM' : null;
    const checkOut = status === 'present' ? '5:00 PM' : null;
    const hours = status === 'present' ? 8 : 0;
    
    history.push({
      id: `day_${i}`,
      date: date.toLocaleDateString(),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      status,
      checkIn,
      checkOut,
      location: status === 'present' ? 'Office Building' : null,
      hours,
    });
  }
  
  return history;
};

// Location API calls
export const getLocationHistory = async () => {
  try {
    // For now, return mock data
    // In a real app, this would be: return makeAuthenticatedRequest('/location/history');
    return [];
  } catch (error) {
    console.error('Get location history error:', error);
    throw error;
  }
};

// Settings API calls
export const getUserSettings = async () => {
  try {
    // For now, return mock data
    // In a real app, this would be: return makeAuthenticatedRequest('/user/settings');
    return {
      notifications: true,
      locationTracking: true,
      privacyMode: false,
    };
  } catch (error) {
    console.error('Get user settings error:', error);
    throw error;
  }
};

export const updateUserSettings = async (settings) => {
  try {
    // For now, return mock success
    // In a real app, this would be: return makeAuthenticatedRequest('/user/settings', { method: 'PUT', body: JSON.stringify(settings) });
    return { success: true, message: 'Settings updated successfully' };
  } catch (error) {
    console.error('Update user settings error:', error);
    throw error;
  }
};

