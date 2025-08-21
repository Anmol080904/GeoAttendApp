import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, layout } from '../styles';
import Card from '../components/Card';
import { getAttendanceHistory } from '../services/api';

export default function HistoryScreen({ navigation, route }) {
  const [historyData, setHistoryData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const { onAuthStateChange } = route.params || {};

  useEffect(() => {
    loadHistory();
  }, [selectedPeriod]);

  const loadHistory = async () => {
    try {
      const data = await getAttendanceHistory(selectedPeriod);
      setHistoryData(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPeriodText = () => {
    switch (selectedPeriod) {
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
      default:
        return 'This Week';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return { name: 'checkmark-circle', color: colors.success };
      case 'absent':
        return { name: 'close-circle', color: colors.error };
      case 'late':
        return { name: 'time', color: colors.warning };
      default:
        return { name: 'help-circle', color: colors.gray };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present':
        return 'Present';
      case 'absent':
        return 'Absent';
      case 'late':
        return 'Late';
      default:
        return 'Unknown';
    }
  };

  const renderHistoryItem = ({ item }) => {
    const statusIcon = getStatusIcon(item.status);
    
    return (
      <Card style={styles.historyItem}>
        <View style={styles.historyHeader}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.dayText}>{item.day}</Text>
          </View>
          <View style={styles.statusContainer}>
            <Ionicons 
              name={statusIcon.name} 
              size={24} 
              color={statusIcon.color} 
            />
            <Text style={[styles.statusText, { color: statusIcon.color }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>
        
        {item.checkIn && (
          <View style={styles.timeRow}>
            <View style={styles.timeItem}>
              <Ionicons name="log-in" size={16} color={colors.primary} />
              <Text style={styles.timeLabel}>Check In:</Text>
              <Text style={styles.timeValue}>{item.checkIn}</Text>
            </View>
            {item.checkOut && (
              <View style={styles.timeItem}>
                <Ionicons name="log-out" size={16} color={colors.secondary} />
                <Text style={styles.timeLabel}>Check Out:</Text>
                <Text style={styles.timeValue}>{item.checkOut}</Text>
              </View>
            )}
          </View>
        )}
        
        {item.location && (
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={colors.gray} />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        )}
        
        {item.hours && (
          <View style={styles.hoursRow}>
            <Ionicons name="time" size={16} color={colors.gray} />
            <Text style={styles.hoursText}>
              Total Hours: {item.hours}h
            </Text>
          </View>
        )}
      </Card>
    );
  };

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      {['week', 'month', 'year'].map((period) => (
        <TouchableOpacity
          key={period}
          style={[
            styles.periodButton,
            selectedPeriod === period && styles.periodButtonActive
          ]}
          onPress={() => setSelectedPeriod(period)}
        >
          <Text style={[
            styles.periodButtonText,
            selectedPeriod === period && styles.periodButtonTextActive
          ]}>
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

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
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Attendance History</Text>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>View your attendance records</Text>
      </View>

      {renderPeriodSelector()}

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>{getPeriodText()}</Text>
        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryNumber}>
              {historyData.filter(item => item.status === 'present').length}
            </Text>
            <Text style={styles.summaryLabel}>Present</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryNumber}>
              {historyData.filter(item => item.status === 'absent').length}
            </Text>
            <Text style={styles.summaryLabel}>Absent</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryNumber}>
              {historyData.filter(item => item.status === 'late').length}
            </Text>
            <Text style={styles.summaryLabel}>Late</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={historyData}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    width: '100%',
  },
  logoutButton: {
    padding: layout.spacing.small,
  },
  subtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: layout.spacing.small,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: layout.padding.large,
    marginBottom: layout.spacing.large,
    gap: layout.spacing.small,
  },
  periodButton: {
    flex: 1,
    paddingVertical: layout.spacing.small,
    paddingHorizontal: layout.spacing.medium,
    borderRadius: layout.borderRadius.small,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodButtonText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  periodButtonTextActive: {
    color: colors.white,
  },
  summaryContainer: {
    paddingHorizontal: layout.padding.large,
    marginBottom: layout.spacing.large,
  },
  summaryTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: layout.spacing.medium,
  },
  summaryStats: {
    flexDirection: 'row',
    gap: layout.spacing.medium,
  },
  summaryStat: {
    flex: 1,
    alignItems: 'center',
    padding: layout.spacing.medium,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: layout.borderRadius.medium,
  },
  summaryNumber: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: layout.spacing.small,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  listContainer: {
    paddingHorizontal: layout.padding.large,
    paddingBottom: layout.spacing.large,
  },
  historyItem: {
    marginBottom: layout.spacing.medium,
    padding: layout.spacing.medium,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.medium,
  },
  dateContainer: {
    alignItems: 'flex-start',
  },
  dateText: {
    ...typography.h4,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  dayText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
    marginTop: layout.spacing.small,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.spacing.medium,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.small,
  },
  timeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  timeValue: {
    ...typography.body2,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.small,
    gap: layout.spacing.small,
  },
  locationText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.small,
  },
  hoursText: {
    ...typography.body2,
    color: colors.textSecondary,
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
});
