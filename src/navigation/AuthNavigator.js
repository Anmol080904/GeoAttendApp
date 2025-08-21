import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

export default function AuthNavigator({ route }) {
  const { onAuthStateChange } = route.params || {};

  return (
    <Stack.Navigator 
      initialRouteName="Landing"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen 
        name="Landing" 
        component={LandingScreen}
        initialParams={{ onAuthStateChange }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        initialParams={{ onAuthStateChange }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        initialParams={{ onAuthStateChange }}
      />
    </Stack.Navigator>
  );
}
