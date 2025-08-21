import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { checkAuthStatus } from '../services/auth';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus()
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        setIsLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setIsLoading(false);
      });
  }, []);

  const handleAuthStateChange = (authenticated) => {
    setIsAuthenticated(authenticated);
  };

  if (isLoading) {
    return null; // You can add a splash screen here
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen 
          name="App" 
          component={AppNavigator}
          initialParams={{ onAuthStateChange: handleAuthStateChange }}
        />
      ) : (
        <Stack.Screen 
          name="Auth" 
          component={AuthNavigator} 
          initialParams={{ onAuthStateChange: handleAuthStateChange }} 
        />
      )}
    </Stack.Navigator>
  );
}
