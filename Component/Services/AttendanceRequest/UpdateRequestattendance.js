import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import DatePicker from 'react-native-date-picker';
import Themes from '../../Theme/Theme';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../utils';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {AttendanceRequest} from '../../../APINetwork/ComponentApi';
import {useNavigation} from '@react-navigation/native';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';

const UpdateRequestattendance = ({route}) => {
  const {id} = route?.params || {};
  const {currentTheme} = useContext(ThemeContext);
  const navigation = useNavigation();

  const [loader, setLoader] = useState(false);
  const [startdateRequest, setStartdateRequest] = useState(new Date());
  const [openStartDate, setOpenStartDate] = useState(false);

  const [punchInTime, setPunchInTime] = useState(new Date());
  const [punchOutTime, setPunchOutTime] = useState(new Date());
  const [openPunchIn, setOpenPunchIn] = useState(false);
  const [openPunchOut, setOpenPunchOut] = useState(false);

  const [reasonText, setReasonText] = useState('');

  useEffect(() => {
    const getItem = async () => {
      const token = await AsyncStorage.getItem('TOKEN');
      const config = {
        method: 'get',
        url: `${BASE_URL}/attendance/request/details/${id}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios(config);
        const data = response.data.data;

        setStartdateRequest(new Date(data.date));

        // Convert "16:25" to Date object
        const parseTime = timeStr => {
          const [hours, minutes] = timeStr.split(':');
          const date = new Date();
          date.setHours(parseInt(hours));
          date.setMinutes(parseInt(minutes));
          date.setSeconds(0);
          return date;
        };

        const punchIn = data.punch_in.split(' ')[1].slice(0, 5);
        const punchOut = data.punch_out.split(' ')[1].slice(0, 5);

        setPunchInTime(parseTime(punchIn));
        setPunchOutTime(parseTime(punchOut));
        setReasonText(data.reason);
      } catch (error) {
        console.log(error);
        showMessage({
          message: 'Failed to load attendance details.',
          type: 'danger',
        });
      }
    };

    getItem();
  }, []);

  const attendance_Request = async () => {
    const token = await AsyncStorage.getItem('TOKEN');

    if (!punchInTime) {
      showMessage({message: 'Please enter Punch In Time', type: 'danger'});
      return;
    }

    if (!punchOutTime) {
      showMessage({message: 'Please enter Punch Out Time', type: 'danger'});
      return;
    }

    if (reasonText.trim() === '') {
      showMessage({message: 'Please enter reason', type: 'danger'});
      return;
    }

    setLoader(true);

    const formatToHi = date => {
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const data = JSON.stringify({
      date: startdateRequest.toISOString().split('T')[0],
      punch_in: formatToHi(punchInTime),
      punch_out: formatToHi(punchOutTime),
      reason: reasonText,
    });

    const url = `${BASE_URL}/attendance/request/update/${id}`;
    const response = await AttendanceRequest(url, data, token, 0);
    setLoader(false);

    if (response?.data?.status) {
      showMessage({
        message: response.data.message,
        type: 'success',
      });
      navigation.goBack();
    } else {
      
    }
  };

  return (
    <ScrollView style={styles.modalContent}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Enter Attendance Details</Text>

        {/* Date Field */}
        <View style={styles.Date_box}>
          <Text style={{color: '#000'}}>
            {startdateRequest.toISOString().split('T')[0]}
          </Text>
          <TouchableOpacity onPress={() => setOpenStartDate(true)}>
            <EvilIcons name="calendar" size={25} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Punch In */}
        <Text style={styles.label}>Punch In Time</Text>
        <TouchableOpacity
          style={styles.Date_box}
          onPress={() => setOpenPunchIn(true)}>
          <Text style={{color: '#000'}}>
            {punchInTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          <EvilIcons name="clock" size={25} color="#000" />
        </TouchableOpacity>

        {/* Punch Out */}
        <Text style={styles.label}>Punch Out Time</Text>
        <TouchableOpacity
          style={styles.Date_box}
          onPress={() => setOpenPunchOut(true)}>
          <Text style={{color: '#000'}}>
            {punchOutTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          <EvilIcons name="clock" size={25} color="#000" />
        </TouchableOpacity>

        {/* Reason */}
        <Text style={{color: '#333', fontSize: 15, marginVertical: 5}}>
          Reason
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Reason"
          value={reasonText}
          onChangeText={setReasonText}
          placeholderTextColor="#999"
          multiline
        />

        {/* Save Button */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.saveButton, {backgroundColor: currentTheme.background_v2}]}
            onPress={attendance_Request}>
            {loader ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Picker Modals */}
      <DatePicker
        modal
        open={openStartDate}
        date={startdateRequest}
        mode="date"
        theme="light"
        maximumDate={new Date()}
        onConfirm={date => {
          setOpenStartDate(false);
          setStartdateRequest(date);
        }}
        onCancel={() => setOpenStartDate(false)}
      />

      <DatePicker
        modal
        mode="time"
        open={openPunchIn}
        date={punchInTime}
        onConfirm={time => {
          setOpenPunchIn(false);
          setPunchInTime(time);
        }}
        onCancel={() => setOpenPunchIn(false)}
      />

      <DatePicker
        modal
        mode="time"
        open={openPunchOut}
        date={punchOutTime}
        onConfirm={time => {
          setOpenPunchOut(false);
          setPunchOutTime(time);
        }}
        onCancel={() => setOpenPunchOut(false)}
      />
    </ScrollView>
  );
};

export default UpdateRequestattendance;

// Styles
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
  label: {
    marginTop: 10,
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
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
  Date_box: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 15,
    height: 50,
    marginBottom: 5,
    width: responsiveWidth(85),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
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
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
