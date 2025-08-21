import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../styles';

const Tab = createBottomTabNavigator();

export default function AppNavigator({ route }) {
  const { onAuthStateChange } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Attendance') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        initialParams={{ onAuthStateChange }}
      />
      <Tab.Screen 
        name="Attendance" 
        component={AttendanceScreen}
        initialParams={{ onAuthStateChange }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        initialParams={{ onAuthStateChange }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        initialParams={{ onAuthStateChange }}
      />
    </Tab.Navigator>
  );
}
