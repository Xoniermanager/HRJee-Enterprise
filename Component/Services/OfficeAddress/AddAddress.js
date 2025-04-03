import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../utils';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {AttendanceRequest} from '../../../APINetwork/ComponentApi';
import {useNavigation} from '@react-navigation/native';
import { ThemeContext } from '../../../Store/ConetxtApi.jsx/ConextApi';
const AddAddress = ({route}) => {
  const id = route?.params?.id;
  const {currentTheme} = useContext(ThemeContext);
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [reasonText, setReasonText] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');

  const getItem = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const config = {
      method: 'get',
      url: `${BASE_URL}/address/request/details/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    axios(config)
      .then(response => {
        setReasonText(response.data.data.reason);
        setAddress(response.data.data.address);
        setLat(response.data.data.latitude);
        setLong(response.data.data.longitude);
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    getItem();
  }, []);
  const fetchCoordinates = async address => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address,
            key: 'AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg',
          },
        },
      );
      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        setLat(location.lat.toString());
        setLong(location.lng.toString());
      }
    } catch (error) {
      showMessage({
        message: `${error.response.data.error_message}`,
        type: 'danger',
      });
    }
  };
  const address_Request = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    if (address.trim() === '') {
      showMessage({
        message: 'Please enter your address.',
        type: 'danger',
      });
    } else if (reasonText.trim() === '') {
      showMessage({
        message: 'Please enter a reason.',
        type: 'danger',
      });
    } else {
      setLoader(true);
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
      setLoader(false);

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
    }
  };

  return (
    <ScrollView style={styles.modalContent}>
      <View style={styles.modalContainer}>
        <View>
          <Text style={{color: '#333', fontSize: 15, marginVertical: 5}}>
            Address
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={text => {
              setAddress(text);
              fetchCoordinates(text);
            }}
            placeholderTextColor="#999"
            multiline
          />
          <Text style={{color: '#333', fontSize: 15, marginVertical: 5}}>
            Latitude
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            value={lat}
            placeholderTextColor="#999"
            multiline
          />
          <Text style={{color: '#333', fontSize: 15, marginVertical: 5}}>
            Latitude
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            value={long}
            placeholderTextColor="#999"
            multiline
          />
          <Text style={{color: '#333', fontSize: 15, marginVertical: 5}}>
            Reason
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Reason"
            value={reasonText}
            onChangeText={prev => setReasonText(prev)}
            placeholderTextColor="#999"
            multiline
          />
          <View style={[styles.buttonRow]}>
            <TouchableOpacity
              style={[styles.saveButton,{  backgroundColor: currentTheme.background_v2,}]}
              onPress={() => address_Request()}>
              {loader ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
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
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#0043ae',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  buttonText: {color: '#fff', textAlign: 'center', fontWeight: 'bold'},
});
