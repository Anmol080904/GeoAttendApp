import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, layout } from '../styles';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { getUserProfile, updateUserProfile } from '../services/api';
import { logout } from '../services/auth';

export default function ProfileScreen({ navigation, route }) {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editedProfile, setEditedProfile] = useState({});
  const { onAuthStateChange } = route.params || {};

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await getUserProfile();
      setUserProfile(profile);
      setEditedProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateUserProfile(editedProfile);
      setUserProfile(editedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Call the auth state change function to trigger navigation back to auth
              if (onAuthStateChange) {
                onAuthStateChange(false);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        { label: 'Full Name', key: 'name', icon: 'person' },
        { label: 'Email', key: 'email', icon: 'mail', editable: false },
        { label: 'Phone', key: 'phone', icon: 'call' },
        { label: 'Department', key: 'department', icon: 'business' },
        { label: 'Position', key: 'position', icon: 'briefcase' },
      ]
    },
    {
      title: 'Work Information',
      items: [
        { label: 'Employee ID', key: 'employeeId', icon: 'card', editable: false },
        { label: 'Join Date', key: 'joinDate', icon: 'calendar', editable: false },
        { label: 'Work Schedule', key: 'workSchedule', icon: 'time' },
      ]
    }
  ];

  const renderProfileSection = (section) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Card style={styles.sectionCard}>
        {section.items.map((item) => (
          <View key={item.key} style={styles.profileItem}>
            <View style={styles.profileItemLeft}>
              <Ionicons name={item.icon} size={20} color={colors.primary} />
              <Text style={styles.profileItemLabel}>{item.label}</Text>
            </View>
            {isEditing && item.editable !== false ? (
              <InputField
                value={editedProfile[item.key] || ''}
                onChangeText={(text) => setEditedProfile({
                  ...editedProfile,
                  [item.key]: text
                })}
                style={styles.editInput}
                placeholder={`Enter ${item.label.toLowerCase()}`}
              />
            ) : (
              <Text style={styles.profileItemValue}>
                {userProfile?.[item.key] || 'Not set'}
              </Text>
            )}
          </View>
        ))}
      </Card>
    </View>
  );

  const renderQuickStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Quick Stats</Text>
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>95%</Text>
          <Text style={styles.statLabel}>Attendance Rate</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>160</Text>
          <Text style={styles.statLabel}>Total Hours</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>22</Text>
          <Text style={styles.statLabel}>Days Present</Text>
        </Card>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Ionicons 
              name={isEditing ? 'close' : 'create'} 
              size={24} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        </View>

        {/* Profile Picture and Basic Info */}
        <View style={styles.profileHeader}>
          <View style={styles.profilePicture}>
            <Ionicons name="person" size={48} color={colors.white} />
          </View>
          <Text style={styles.profileName}>
            {userProfile?.name || 'User Name'}
          </Text>
          <Text style={styles.profileEmail}>
            {userProfile?.email || 'user@email.com'}
          </Text>
        </View>

        {/* Quick Stats */}
        {renderQuickStats()}

        {/* Profile Sections */}
        {profileSections.map(renderProfileSection)}

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={isLoading}
              style={styles.saveButton}
            />
            <Button
              title="Cancel"
              onPress={handleCancel}
              style={styles.cancelButton}
              textStyle={{ color: colors.textSecondary }}
            />
          </View>
        )}

        {/* Settings and Logout */}
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="notifications" size={20} color={colors.primary} />
                <Text style={styles.settingItemText}>Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.gray} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="lock-closed" size={20} color={colors.primary} />
                <Text style={styles.settingItemText}>Privacy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.gray} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="help-circle" size={20} color={colors.primary} />
                <Text style={styles.settingItemText}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.gray} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    paddingVertical: layout.padding.medium,
  },
  backButton: {
    padding: layout.spacing.small,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  editButton: {
    padding: layout.spacing.small,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: layout.padding.large,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.spacing.medium,
  },
  profileName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: layout.spacing.small,
  },
  profileEmail: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  statsContainer: {
    paddingHorizontal: layout.padding.large,
    marginVertical: layout.spacing.large,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: layout.spacing.medium,
  },
  statsRow: {
    flexDirection: 'row',
    gap: layout.spacing.medium,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: layout.spacing.medium,
  },
  statNumber: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: layout.spacing.small,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: layout.padding.large,
    marginBottom: layout.spacing.large,
  },
  sectionCard: {
    padding: layout.spacing.medium,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: layout.spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.small,
  },
  profileItemLabel: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  profileItemValue: {
    ...typography.body2,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  editInput: {
    flex: 1,
    marginLeft: layout.spacing.medium,
  },
  actionButtons: {
    paddingHorizontal: layout.padding.large,
    marginBottom: layout.spacing.large,
    gap: layout.spacing.medium,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.backgroundSecondary,
  },
  settingsContainer: {
    paddingHorizontal: layout.padding.large,
    marginBottom: layout.spacing.large,
  },
  settingsCard: {
    padding: layout.spacing.medium,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: layout.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.small,
  },
  settingItemText: {
    ...typography.body2,
    color: colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: layout.spacing.large,
    marginHorizontal: layout.padding.large,
    marginBottom: layout.spacing.large,
    gap: layout.spacing.small,
  },
  logoutText: {
    ...typography.body1,
    color: colors.error,
    fontWeight: '600',
  },
});
