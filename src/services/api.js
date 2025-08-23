// apiService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Centralized configurable base URLs
const USER_API_BASE_URL = process.env.EXPO_PUBLIC_USER_API_BASE_URL || 'https://minor-project-606r.onrender.com/api/users';
const ADMIN_API_BASE_URL = process.env.EXPO_PUBLIC_ADMIN_API_BASE_URL || 'https://minor-project-606r.onrender.com/api/admin';

const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

// ====== Helpers ======
const getAuthToken = async () => {
  return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
};

const makeAuthenticatedRequest = async (baseUrl, endpoint, options = {}) => {
  const token = await getAuthToken();
  if (!token) throw new Error('Authentication required');

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...options,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, defaultOptions);

  if (!response.ok) {
    if (response.status === 401) {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      throw new Error('Session expired. Please login again.');
    }
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
};

// ================= USERS =================

// Login User
export const loginUser = async (username, password) => {
  const response = await fetch(`${USER_API_BASE_URL}/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error('Invalid credentials');

  const data = await response.json();

  await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.tokens.access);
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.tokens.refresh);

  const user = {
    id: data.user_id,
    username,
    role: data.role,
  };
  await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

  return { user, token: data.tokens.access };
};

// Register User
export const registerUser = async (formData) => {
  const response = await fetch(`${USER_API_BASE_URL}/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!response.ok) throw new Error('Registration failed');
  return response.json();
};

// Logout User
export const logoutUser = async () => {
  const refresh = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);

  const response = await fetch(`${USER_API_BASE_URL}/logout/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  await AsyncStorage.removeItem(USER_DATA_KEY);

  return response.json();
};

// Update User Profile
export const updateUserProfile = async (roll, profileData) => {
  return makeAuthenticatedRequest(USER_API_BASE_URL, `/update/${roll}/`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

// Delete User
export const deleteUser = async (roll) => {
  return makeAuthenticatedRequest(USER_API_BASE_URL, `/delete/${roll}/`, {
    method: 'DELETE',
  });
};

// ================= ADMIN =================

// Admin Login
export const loginAdmin = async (username, password) => {
  const response = await fetch(`${ADMIN_API_BASE_URL}/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error('Invalid credentials');

  const data = await response.json();

  await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.tokens.access);
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.tokens.refresh);

  const user = {
    id: data.user_id,
    username,
    role: data.role, // "admin" or "superuser"
  };
  await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

  return { user, token: data.tokens.access };
};

// Register Admin
export const registerAdmin = async (formData) => {
  return makeAuthenticatedRequest(ADMIN_API_BASE_URL, '/register/', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

// Get Admin Profile
export const getAdminProfile = async () => {
  return makeAuthenticatedRequest(ADMIN_API_BASE_URL, '/profile/', {
    method: 'GET',
  });
};

// Update Admin Privileges
export const updateAdminPrivileges = async (privileges) => {
  return makeAuthenticatedRequest(ADMIN_API_BASE_URL, '/update-privileges/', {
    method: 'PUT',
    body: JSON.stringify({ privileges }),
  });
};
