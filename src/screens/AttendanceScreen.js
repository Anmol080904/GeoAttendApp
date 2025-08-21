import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, layout } from '../styles';
import MapViewComponent from '../components/MapViewComponent';
import Button from '../components/Button';
import { getCurrentLocation, markAttendance } from '../services/location';
import { getUserProfile } from '../services/api';

export default function AttendanceScreen({ navigation, route }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState('idle'); // idle, checked-in, checked-out
  const [userProfile, setUserProfile] = useState(null);
  const { onAuthStateChange } = route.params || {};

  useEffect(() => {
    loadUserProfile();
    getLocation();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const getLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
    } catch (error) {
      Alert.alert('Location Error', 'Unable to get your current location');
    }
  };

  const handleCheckIn = async () => {
    if (!currentLocation) {
      Alert.alert('Error', 'Location not available. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      await markAttendance('check-in', currentLocation);
      setAttendanceStatus('checked-in');
      Alert.alert('Success', 'Successfully checked in!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!currentLocation) {
      Alert.alert('Error', 'Location not available. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      await markAttendance('check-out', currentLocation);
      setAttendanceStatus('checked-out');
      Alert.alert('Success', 'Successfully checked out!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Call the auth state change function to trigger navigation back to auth
    if (onAuthStateChange) {
      onAuthStateChange(false);
    }
  };

  const getStatusColor = () => {
    switch (attendanceStatus) {
      case 'checked-in':
        return colors.success;
      case 'checked-out':
        return colors.warning;
      default:
        return colors.gray;
    }
  };

  const getStatusText = () => {
    switch (attendanceStatus) {
      case 'checked-in':
        return 'Checked In';
      case 'checked-out':
        return 'Checked Out';
      default:
        return 'Not Checked In';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Attendance</Text>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Mark your attendance with location</Text>
      </View>

      {/* Status Card */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
        <Text style={styles.statusTime}>
          {attendanceStatus === 'checked-in' ? 'Since 9:00 AM' : 
           attendanceStatus === 'checked-out' ? 'At 5:00 PM' : 'Not available'}
        </Text>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <Text style={styles.sectionTitle}>Your Location</Text>
        {currentLocation ? (
          <MapViewComponent 
            location={currentLocation}
            style={styles.map}
          />
        ) : (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map" size={48} color={colors.gray} />
            <Text style={styles.mapPlaceholderText}>Loading location...</Text>
          </View>
        )}
      </View>

      {/* Location Info */}
      <View style={styles.locationInfo}>
        <View style={styles.locationItem}>
          <Ionicons name="location" size={20} color={colors.primary} />
          <Text style={styles.locationText}>
            {currentLocation ? 'Office Building, Floor 3' : 'Location unavailable'}
          </Text>
        </View>
        <View style={styles.locationItem}>
          <Ionicons name="time" size={20} color={colors.primary} />
          <Text style={styles.locationText}>
            {new Date().toLocaleTimeString()}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {attendanceStatus === 'idle' && (
          <Button
            title="Check In"
            onPress={handleCheckIn}
            loading={isLoading}
            style={[styles.actionButton, styles.checkInButton]}
          />
        )}
        
        {attendanceStatus === 'checked-in' && (
          <Button
            title="Check Out"
            onPress={handleCheckOut}
            loading={isLoading}
            style={[styles.actionButton, styles.checkOutButton]}
          />
        )}

        {attendanceStatus === 'checked-out' && (
          <View style={styles.completedContainer}>
            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            <Text style={styles.completedText}>Day Complete!</Text>
            <Text style={styles.completedSubtext}>You can check in again tomorrow</Text>
          </View>
        )}
      </View>

      {/* Refresh Location Button */}
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={getLocation}
        disabled={isLoading}
      >
        <Ionicons name="refresh" size={20} color={colors.primary} />
        <Text style={styles.refreshText}>Refresh Location</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: layout.padding.large,
    paddingVertical: layout.padding.medium,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  logoutButton: {
    padding: layout.spacing.small,
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
    marginTop: layout.spacing.small,
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: layout.padding.large,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: layout.spacing.small,
  },
  statusText: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: layout.spacing.small,
  },
  statusTime: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  mapContainer: {
    paddingHorizontal: layout.padding.large,
    marginVertical: layout.spacing.large,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: layout.spacing.medium,
  },
  map: {
    height: 200,
    borderRadius: layout.borderRadius.medium,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: layout.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: layout.spacing.small,
  },
  locationInfo: {
    paddingHorizontal: layout.padding.large,
    marginBottom: layout.spacing.large,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.medium,
  },
  locationText: {
    ...typography.body2,
    color: colors.textPrimary,
    marginLeft: layout.spacing.small,
  },
  actionContainer: {
    paddingHorizontal: layout.padding.large,
    marginBottom: layout.spacing.large,
  },
  actionButton: {
    marginBottom: layout.spacing.medium,
  },
  checkInButton: {
    backgroundColor: colors.success,
  },
  checkOutButton: {
    backgroundColor: colors.warning,
  },
  completedContainer: {
    alignItems: 'center',
    paddingVertical: layout.spacing.large,
  },
  completedText: {
    ...typography.h3,
    color: colors.success,
    marginTop: layout.spacing.medium,
    marginBottom: layout.spacing.small,
  },
  completedSubtext: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: layout.spacing.medium,
    gap: layout.spacing.small,
  },
  refreshText: {
    ...typography.body2,
    color: colors.primary,
  },
});
