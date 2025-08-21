import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const loginUser = async (email, password) => {
  try {
    // In a real app, this would be an API call
    // For now, we'll simulate a successful login
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: email,
      department: 'Engineering',
      position: 'Software Developer',
      employeeId: 'EMP001',
      joinDate: '2023-01-15',
      workSchedule: '9:00 AM - 5:00 PM',
      phone: '+1234567890'
    };

    const mockToken = 'mock_jwt_token_' + Date.now();

    // Store auth data
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, mockToken);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(mockUser));

    return { user: mockUser, token: mockToken };
  } catch (error) {
    throw new Error('Login failed. Please try again.');
  }
};

export const registerUser = async (name, email, password) => {
  try {
    // In a real app, this would be an API call
    // For now, we'll simulate a successful registration
    const mockUser = {
      id: '1',
      name: name,
      email: email,
      department: 'Engineering',
      position: 'Software Developer',
      employeeId: 'EMP001',
      joinDate: new Date().toISOString().split('T')[0],
      workSchedule: '9:00 AM - 5:00 PM',
      phone: ''
    };

    return { user: mockUser };
  } catch (error) {
    throw new Error('Registration failed. Please try again.');
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const checkAuthStatus = async () => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    
    if (token && userData) {
      // In a real app, you would validate the token with your backend
      return true;
    }
    return false;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const updateUserProfile = async (updatedData) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('User not found');
    }

    const updatedUser = { ...currentUser, ...updatedData };
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    throw new Error('Failed to update profile');
  }
};

