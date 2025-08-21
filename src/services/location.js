import * as Location from 'expo-location';

// Request location permissions
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }
    return true;
  } catch (error) {
    console.error('Location permission error:', error);
    throw error;
  }
};

// Get current location
export const getCurrentLocation = async () => {
  try {
    // First check if we have permission
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission required');
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      maximumAge: 10000, // 10 seconds
      timeout: 15000, // 15 seconds
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: location.timestamp,
    };
  } catch (error) {
    console.error('Get current location error:', error);
    throw new Error('Unable to get current location. Please check your location settings.');
  }
};

// Watch location changes
export const startLocationWatching = async (callback) => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission required');
    }

    const locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000, // Update every 10 seconds
        distanceInterval: 10, // Update every 10 meters
      },
      (location) => {
        const locationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          timestamp: location.timestamp,
        };
        callback(locationData);
      }
    );

    return locationSubscription;
  } catch (error) {
    console.error('Start location watching error:', error);
    throw error;
  }
};

// Stop location watching
export const stopLocationWatching = (subscription) => {
  if (subscription) {
    subscription.remove();
  }
};

// Get address from coordinates (reverse geocoding)
export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (reverseGeocode.length > 0) {
      const address = reverseGeocode[0];
      return {
        street: address.street || '',
        city: address.city || '',
        region: address.region || '',
        country: address.country || '',
        postalCode: address.postalCode || '',
        name: address.name || '',
        fullAddress: [
          address.street,
          address.city,
          address.region,
          address.country,
        ].filter(Boolean).join(', '),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

// Calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Check if location is within specified radius
export const isLocationWithinRadius = (centerLat, centerLon, targetLat, targetLon, radiusKm) => {
  const distance = calculateDistance(centerLat, centerLon, targetLat, targetLon);
  return distance <= radiusKm;
};

// Mark attendance with location
export const markAttendance = async (type, location) => {
  try {
    // Get address for the location
    const address = await getAddressFromCoordinates(location.latitude, location.longitude);
    
    const attendanceData = {
      type, // 'check-in' or 'check-out'
      location: {
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        accuracy: location.accuracy,
        address: address?.fullAddress || 'Unknown location',
        timestamp: new Date().toISOString(),
      },
    };

    // In a real app, you would send this to your backend
    // For now, we'll just return the data
    console.log('Attendance marked:', attendanceData);
    
    return {
      success: true,
      message: `${type} marked successfully`,
      data: attendanceData,
    };
  } catch (error) {
    console.error('Mark attendance error:', error);
    throw new Error('Failed to mark attendance. Please try again.');
  }
};

// Get location history (mock data for now)
export const getLocationHistory = async () => {
  try {
    // In a real app, this would fetch from your backend
    // For now, return mock data
    return [
      {
        id: '1',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060,
        },
        address: 'New York, NY, USA',
        type: 'check-in',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060,
        },
        address: 'New York, NY, USA',
        type: 'check-out',
      },
    ];
  } catch (error) {
    console.error('Get location history error:', error);
    throw error;
  }
};

