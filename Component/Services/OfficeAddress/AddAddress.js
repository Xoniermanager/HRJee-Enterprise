import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../utils';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {AttendanceRequest} from '../../../APINetwork/ComponentApi';
import {useNavigation} from '@react-navigation/native';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';

const AddAddress = ({route}) => {
  const addressRef = useRef();
  const id = route?.params?.id;
  const {currentTheme} = useContext(ThemeContext);
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [reasonText, setReasonText] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const GOOGLE_PLACES_API_KEY = "AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg";

  const getItem = async () => {
    if (!id) {
      setIsDataLoaded(true);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const config = {
        method: 'get',
        url: `${BASE_URL}/address/request/details/${id}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios(config);
      setReasonText(response.data.data.reason || '');
      setAddress(response.data.data.address || '');
      setLat(response.data.data.latitude || '');
      setLong(response.data.data.longitude || '');

      if (addressRef.current && response.data.data.address) {
        addressRef.current.setAddressText(response.data.data.address);
      }

      setIsDataLoaded(true);
    } catch (error) {
      console.log(error);
      setIsDataLoaded(true);
    }
  };

  useEffect(() => {
    getItem();
  }, []);

  useEffect(() => {
    if (isDataLoaded && addressRef.current && address) {
      addressRef.current.setAddressText(address);
    }
  }, [isDataLoaded, address]);

  const fetchCoordinates = async (selectedAddress) => {
    if (selectedAddress && selectedAddress.trim() !== '') {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          {
            params: {
              address: selectedAddress,
              key: GOOGLE_PLACES_API_KEY,
            },
          },
        );

        if (response.data.results.length > 0) {
          const location = response.data.results[0].geometry.location;
          setLat(location.lat.toString());
          setLong(location.lng.toString());
        } else {
          setLat('');
          setLong('');
        }
      } catch (error) {
        console.log(error, 'error');
        showMessage({
          message: 'Failed to fetch coordinates',
          type: 'danger',
        });
        setLat('');
        setLong('');
      }
    } else {
      setLat('');
      setLong('');
    }
  };

  const address_Request = async () => {
    const token = await AsyncStorage.getItem('TOKEN');

    if (address.trim() === '') {
      showMessage({
        message: 'Please enter your address.',
        type: 'danger',
      });
      return;
    }

    if (reasonText.trim() === '') {
      showMessage({
        message: 'Please enter a reason.',
        type: 'danger',
      });
      return;
    }

    if (!lat || !long) {
      showMessage({
        message: 'Location data is incomplete. Please check your address.',
        type: 'danger',
      });
      return;
    }

    setLoader(true);

    try {
      let data = JSON.stringify({
        address: address,
        latitude: lat,
        longitude: long,
        reason: reasonText,
      });

      const url = id
        ? `${BASE_URL}/address/request/update/${id}`
        : `${BASE_URL}/address/request/store`;

      let form = 0;
      const response = await AttendanceRequest(url, data, token, form);

      if (response.data.status) {
        showMessage({
          message: `${response?.data?.message}`,
          type: 'success',
        });
        navigation.goBack();
      } else {
        showMessage({
          message: 'Failed to submit request.',
          type: 'danger',
        });
      }
    } catch (error) {
      showMessage({
        message: 'An error occurred while processing your request.',
        type: 'danger',
      });
    } finally {
      setLoader(false);
    }
  };

  const handleAddressSelect = (data, details = null) => {
    const selectedAddress = data?.description || '';
    setAddress(selectedAddress);
    fetchCoordinates(selectedAddress);
    Keyboard.dismiss();
  };

  const handleAddressChange = (text) => {
    setAddress(text);
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      showMessage({
        message: 'Location permission denied',
        type: 'danger',
      });
      return;
    }

    setLoader(true);
    Geolocation.getCurrentPosition(
      async (position) => {
        const {latitude, longitude} = position.coords;
        setLat(latitude.toString());
        setLong(longitude.toString());

        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json`,
            {
              params: {
                latlng: `${latitude},${longitude}`,
                key: GOOGLE_PLACES_API_KEY,
              },
            }
          );

          if (response.data.results.length > 0) {
            const formattedAddress = response.data.results[0].formatted_address;
            setAddress(formattedAddress);
            if (addressRef.current) {
              addressRef.current.setAddressText(formattedAddress);
            }
          } else {
            showMessage({
              message: 'Unable to find address for this location.',
              type: 'danger',
            });
          }
        } catch (error) {
          console.log('Geocoding error:', error);
          showMessage({
            message: 'Failed to fetch address from location.',
            type: 'danger',
          });
        } finally {
          setLoader(false);
        }
      },
      (error) => {
        console.log('Location error:', error);
        showMessage({
          message: 'Failed to get current location.',
          type: 'danger',
        });
        setLoader(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  if (!isDataLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={currentTheme.background_v2} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.modalContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={[styles.locationButton, { backgroundColor: currentTheme.background_v2 }]}
          onPress={getCurrentLocation}
        >
          <Text style={styles.locationButtonText}>Use Current Location</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Address</Text>
        
        <View style={styles.autocompleteWrapper}>
          <GooglePlacesAutocomplete
            ref={addressRef}
            placeholder="Search for a place"
            placeholderTextColor="#999"
            onPress={handleAddressSelect}
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: "en",
              components: 'country:in',
            }}
            textInputProps={{
              value: address,
              onChangeText: handleAddressChange,
              placeholderTextColor: '#999',
              returnKeyType: 'done',
              onSubmitEditing: () => {
                if (address.trim()) {
                  fetchCoordinates(address);
                }
              },
            }}
            fetchDetails={true}
            onFail={(error) => console.log(error)}
            onNotFound={() => console.log('no results')}
            listEmptyComponent={() => (
              <View style={styles.emptyResultsContainer}>
                <Text style={styles.emptyResultsText}>No results found</Text>
              </View>
            )}
            styles={{
              container: styles.autocompleteContainer,
              textInput: styles.textInput,
              poweredContainer: styles.poweredContainer,
              listView: styles.listView,
              description: styles.description,
              row: styles.row,
              separator: styles.separator,
            }}
            debounce={300}
            minLength={2}
            enablePoweredByContainer={false}
            suppressDefaultStyles={false}
          />
        </View>

        <Text style={styles.sectionTitle}>Latitude</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          placeholder="Latitude will be auto-filled"
          value={lat}
          placeholderTextColor="#999"
          editable={false}
        />

        <Text style={styles.sectionTitle}>Longitude</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          placeholder="Longitude will be auto-filled"
          value={long}
          placeholderTextColor="#999"
          editable={false}
        />

        <Text style={styles.sectionTitle}>Reason</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter reason for address request"
          value={reasonText}
          onChangeText={setReasonText}
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: currentTheme.background_v2 }]}
            onPress={address_Request}
            disabled={loader}
          >
            {loader ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {id ? 'Update' : 'Save'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddAddress;

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    color: '#000',
    backgroundColor: '#fff',
  },
  readOnlyInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    marginTop: 20,
    marginBottom: 30,
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  autocompleteWrapper: {
    zIndex: 1,
    marginBottom: 10,
  },
  autocompleteContainer: {
    flex: 0,
  },
  textInput: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  poweredContainer: {
    display: 'none',
  },
  listView: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 5,
    maxHeight: 200,
  },
  description: {
    fontSize: 15,
    color: "#333",
  },
  row: {
    padding: 15,
    backgroundColor: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  emptyResultsContainer: {
    padding: 15,
    alignItems: 'center',
  },
  emptyResultsText: {
    color: '#666',
    fontSize: 14,
  },
  locationButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    alignSelf:'flex-end'
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
