import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const loginUser = async (username, password) => {
  try {
    const response = await fetch("https://minor-project-606r.onrender.com/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY":"megha"
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid username or password");
    }

    const data = await response.json();

    // Store tokens
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.access);
    await AsyncStorage.setItem("refresh_token", data.refresh);

    // Store user details (for now just username)
    const user = { username };
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

    return { user, token: data.access };
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// ✅ Add this function
export const checkAuthStatus = async () => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    const user = await AsyncStorage.getItem(USER_DATA_KEY);

    if (token && user) {
      return { isLoggedIn: true, user: JSON.parse(user), token };
    }
    return { isLoggedIn: false };
  } catch (error) {
    console.error("Error checking auth status:", error);
    return { isLoggedIn: false };
  }
};

// ✅ Also add logout (optional, but useful)
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem("refresh_token");
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
