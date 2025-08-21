import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { colors, layout } from '../styles';

export default function MapViewComponent({ location, style, ...props }) {
  if (!location) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={styles.placeholderText}>Location not available</Text>
      </View>
    );
  }

  const region = {
    latitude: location.latitude || 0,
    longitude: location.longitude || 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <MapView
      style={[styles.map, style]}
      region={region}
      showsUserLocation={true}
      showsMyLocationButton={false}
      {...props}
    >
      <Marker
        coordinate={{
          latitude: location.latitude || 0,
          longitude: location.longitude || 0,
        }}
        title="Your Location"
        description="Current position"
        pinColor={colors.primary}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 200,
  },
  placeholder: {
    width: '100%',
    height: 200,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: layout.borderRadius.medium,
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});

