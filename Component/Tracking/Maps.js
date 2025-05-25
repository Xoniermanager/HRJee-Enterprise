import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {Card} from 'react-native-paper';
import axios from 'axios';
import { BASE_URL } from '../../utils';

const {width, height} = Dimensions.get('window');

const Maps = ({route}) => {
  const mapRef = useRef(null);
  const {id} = route.params;
  const [mapDataApi, setMapDataApi] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const GOOGLEMAPKEY = 'AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg';
  const getLocation = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const config = {
      method: 'get',
      url: `${BASE_URL}/location-tracking/get-locations?user_id=${id}&only_new_locations=0`,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(config);
      if (response.data.status) {
        const parsedPoints = response.data.data.map(item => ({
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
        }));
        setMapDataApi(parsedPoints);

        if (mapRef.current && parsedPoints.length > 0) {
          mapRef.current.fitToCoordinates(parsedPoints, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      }
    } catch (error) {
      console.log('Location fetch error:', error);
    }
  };

  useEffect(() => {
    getLocation();
    const interval = setInterval(() => {
      getLocation();
    }, 100000); 
    return () => clearInterval(interval);
  }, []);

  const renderMarker = (point, index) => (
    <Marker
      key={`marker-${index}`}
      coordinate={point}
      title={`Point ${index + 1}`}
      pinColor={index === 0 ? 'blue' : index === mapDataApi.length - 1 ? 'red' : 'green'}
    />
  );

  const renderDirections = useMemo(() => {
    if (mapDataApi.length >= 2) {
      const origin = mapDataApi[0];
      const destination = mapDataApi[mapDataApi.length - 1];
      const waypoints = mapDataApi.slice(1, -1);

      return (
        <MapViewDirections
          origin={origin}
          destination={destination}
          waypoints={waypoints}
          apikey={GOOGLEMAPKEY}
          strokeWidth={4}
          strokeColor="blue"
          optimizeWaypoints={false}
          onReady={result => {
            setTotalDistance(result.distance * 1000); // convert to meters
          }}
        />
      );
    }
    return null;
  }, [mapDataApi]);

  return (
    <View style={{flex: 1}}>
      <MapView
        ref={mapRef}
        style={styles.mapContainer}
        initialRegion={{
          latitude: 28.6139,
          longitude: 77.209,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {mapDataApi.map((point, index) => renderMarker(point, index))}
        {renderDirections}
      </MapView>

      <Card style={styles.infoCard}>
        <Text style={styles.infoText}>
          {mapDataApi.length >= 2
            ? `Total Distance: ${(totalDistance / 1000).toFixed(2)} km`
            : 'Waiting for location data...'}
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    width: width,
    height: height,
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
  },
});

export default Maps;
