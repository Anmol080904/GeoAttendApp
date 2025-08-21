import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, layout } from '../styles';
import Card from '../components/Card';
import { getUserProfile } from '../services/api';

export default function DashboardScreen({ navigation, route }) {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { onAuthStateChange } = route.params || {};

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Mark Attendance',
      subtitle: 'Check in/out with location',
      icon: 'location',
      color: colors.primary,
      onPress: () => navigation.navigate('Attendance'),
    },
    {
      title: 'View History',
      subtitle: 'Check your attendance records',
      icon: 'time',
      color: colors.secondary,
      onPress: () => navigation.navigate('History'),
    },
    {
      title: 'Profile',
      subtitle: 'Update your information',
      icon: 'person',
      color: colors.accent,
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  const handleLogout = () => {
    // Call the auth state change function to trigger navigation back to auth
    if (onAuthStateChange) {
      onAuthStateChange(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color={colors.error} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-circle" size={40} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.userName}>
            {userProfile?.name || 'User'}
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="calendar" size={24} color={colors.primary} />
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Days This Month</Text>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <Text style={styles.statNumber}>22</Text>
              <Text style={styles.statLabel}>Present</Text>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="close-circle" size={24} color={colors.error} />
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Absent</Text>
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionItem}
              onPress={action.onPress}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon} size={24} color={colors.white} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.gray} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Checked in at 9:00 AM</Text>
                <Text style={styles.activityTime}>Today</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="location" size={20} color={colors.primary} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Location: Office Building</Text>
                <Text style={styles.activityTime}>Today</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.padding.large,
    paddingVertical: layout.padding.large,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  logoutButton: {
    padding: layout.spacing.small,
  },
  greeting: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  userName: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  profileButton: {
    padding: layout.spacing.small,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: layout.padding.large,
    gap: layout.spacing.medium,
    marginBottom: layout.spacing.large,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    padding: layout.spacing.medium,
  },
  statNumber: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: 'bold',
    marginVertical: layout.spacing.small,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quickActionsContainer: {
    paddingHorizontal: layout.padding.large,
    marginBottom: layout.spacing.large,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: layout.spacing.medium,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.medium,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: layout.spacing.small,
  },
  actionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  recentActivityContainer: {
    paddingHorizontal: layout.padding.large,
    marginBottom: layout.spacing.large,
  },
  activityCard: {
    padding: layout.spacing.medium,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.spacing.small,
  },
  activityIcon: {
    marginRight: layout.spacing.medium,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    ...typography.body2,
    color: colors.textPrimary,
    marginBottom: layout.spacing.small,
  },
  activityTime: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
