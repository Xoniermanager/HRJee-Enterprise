import React, { useEffect, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import haversine from 'haversine-distance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../utils';
import { asignTask } from '../../../APINetwork/ComponentApi';

const GOOGLE_MAPS_APIKEY = 'AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg';

const MapTask = () => {
  const [location, setLocation] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [distanceKm, setDistanceKm] = useState('');
  const [visitLocations, setVisitLocations] = useState([]); // Now an array

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This app needs to access your location',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission denied');
            return;
          }
        }
        getCurrentLocation();
      } catch (error) {
        console.warn('Permission request error:', error);
      }
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Location error:', error.message);
          setLocation({ latitude: 28.6139, longitude: 77.2090 }); // fallback
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 5000 }
      );
    };

    requestLocationPermission();
    fetchVisitLocations();
  }, []);

  const fetchVisitLocations = async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/visit-locations`;
      const response = await asignTask(url, token);

      const locations = response?.data?.data
        ?.map((item, index) => {
          const loc = item?.visit_location;
          if (loc?.latitude && loc?.longitude) {
            return {
              id: index.toString(),
              name: `Visit Location ${index + 1}`,
              latitude: parseFloat(loc.latitude),
              longitude: parseFloat(loc.longitude),
            };
          }
          return null;
        })
        .filter(Boolean);

      setVisitLocations(locations);
    } catch (error) {
      console.error('Failed to fetch visit locations:', error);
    }
  };

  const handleMarkerPress = (task) => {
    setSelectedTask(task);
    if (location) {
      const dist = haversine(location, {
        latitude: task.latitude,
        longitude: task.longitude,
      });
      setDistanceKm((dist / 1000).toFixed(2));
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        region={{
          latitude: location?.latitude || 28.6139,
          longitude: location?.longitude || 77.2090,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        }}
      >
        {location && (
          <Marker coordinate={location} title="You Are Here" pinColor="blue" />
        )}

        {visitLocations.map((task) => (
          <Marker
            key={task.id}
            coordinate={{ latitude: task.latitude, longitude: task.longitude }}
            title={task.name}
            description="Visit Location"
            pinColor="green"
            onPress={() => handleMarkerPress(task)}
          />
        ))}

        {location && selectedTask && (
          <MapViewDirections
            origin={location}
            destination={{
              latitude: selectedTask.latitude,
              longitude: selectedTask.longitude,
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="blue"
            onReady={(result) => {
              setDistanceKm(result.distance.toFixed(2));
            }}
            onError={(errorMessage) => {
              console.warn('MapViewDirections error:', errorMessage);
            }}
          />
        )}
      </MapView>

      {selectedTask && distanceKm ? (
        <View style={styles.distanceBox}>
          <Text style={styles.distanceText}>
            Distance to {selectedTask.name}: {distanceKm} KM
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default MapTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  distanceBox: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#ffffffee',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
