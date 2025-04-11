import React, {useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {Card} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
const {width, height} = Dimensions.get('window');
const Maps = () => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [mapDataApi, setMapDataApi] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const GOOGLEMAPKEY = 'AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg';
  const addDemoCoordinates = () => {
    const demoCoords = [
      {latitude: 28.6247716, longitude: 77.2137852, type: 'punch_in'}, // Noida
      {latitude: 28.6291175, longitude: 77.3777632, type: 'punch_out'},   // Work wing noida sector 63 h - 187
 
    ];
    setMapDataApi(demoCoords);
    const punchIn = demoCoords.find(point => point.type === 'punch_in');
    const punchOut = demoCoords.find(point => point.type === 'punch_out');

    setOrigin(punchIn || null);
    setDestination(punchOut || null);
  };
  const renderMarker = (point, index) => (
    <Marker
      key={`api-marker-${index}`}
      coordinate={point}
      title={
        point?.type === 'punch_in'
          ? 'Punch In'
          : point?.type === 'punch_out'
          ? 'Punch Out'
          : 'Current Location'
      }
      pinColor={
        point?.type === 'punch_in'
          ? 'blue'
          : point?.type === 'punch_out'
          ? 'red'
          : 'green'
      }
    />
  );
  const renderDirections = useMemo(() => {
    if (origin && destination) {
      return (
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLEMAPKEY}
          optimizeWaypoints
          strokeWidth={3}
          strokeColor="blue"
          onReady={result => {
            setTotalDistance(result.distance * 1000);
          }}
        />
      );
    }
    return null;
  }, [origin, destination]);

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
        region={region}>
        {mapDataApi.map((point, index) => renderMarker(point, index))}
        {renderDirections}
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={addDemoCoordinates}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Add Demo Markers</Text>
        </TouchableOpacity>
      </View>

      <Card style={styles.infoCard}>
        <Text style={styles.infoText}>
          {origin && destination
            ? `Total Distance: ${(totalDistance / 1000).toFixed(2)} km`
            : origin
            ? 'Waiting for Punch Out...'
            : 'No route data available'}
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
  buttonContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  iconButton: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
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
