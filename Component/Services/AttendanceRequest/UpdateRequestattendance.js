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
import { showMessage } from 'react-native-flash-message';
import { AttendanceRequest } from '../../../APINetwork/ComponentApi';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../../Store/ConetxtApi.jsx/ConextApi';
const UpdateRequestattendance = ({route}) => {
    const { id } = route?.params || {};
    const {currentTheme} = useContext(ThemeContext);
    const navigation=useNavigation();
    const [loader,setLoader]=useState(false);
  const timeOptions = [
    {label: '08:00 AM', value: '08:00 AM'},
    {label: '08:15 AM', value: '08:15 AM'},
    {label: '08:30 AM', value: '08:30 AM'},
    {label: '08:45 AM', value: '08:45 AM'},
    {label: '09:00 AM', value: '09:00 AM'},
    {label: '09:15 AM', value: '09:15 AM'},
    {label: '09:30 AM', value: '09:30 AM'},
    {label: '09:45 AM', value: '09:45 AM'},
    {label: '10:00 AM', value: '10:00 AM'},
    {label: '10:15 AM', value: '10:15 AM'},
    {label: '10:30 AM', value: '10:30 AM'},
    {label: '10:45 AM', value: '10:45 AM'},
    {label: '11:00 AM', value: '11:00 AM'},
    {label: '11:15 AM', value: '11:15 AM'},
    {label: '11:30 AM', value: '11:30 AM'},
    {label: '11:45 AM', value: '11:45 AM'},
    {label: '12:00 PM', value: '12:00 PM'},
    {label: '12:15 PM', value: '12:15 PM'},
    {label: '12:30 PM', value: '12:30 PM'},
    {label: '12:45 PM', value: '12:45 PM'},
    {label: '01:00 PM', value: '01:00 PM'},
    {label: '01:15 PM', value: '01:15 PM'},
    {label: '01:30 PM', value: '01:30 PM'},
    {label: '01:45 PM', value: '01:45 PM'},
    {label: '02:00 PM', value: '02:00 PM'},
    {label: '02:15 PM', value: '02:15 PM'},
    {label: '02:30 PM', value: '02:30 PM'},
    {label: '02:45 PM', value: '02:45 PM'},
    {label: '03:00 PM', value: '03:00 PM'},
    {label: '03:15 PM', value: '03:15 PM'},
    {label: '03:30 PM', value: '03:30 PM'},
    {label: '03:45 PM', value: '03:45 PM'},
    {label: '04:00 PM', value: '04:00 PM'},
    {label: '04:15 PM', value: '04:15 PM'},
    {label: '04:30 PM', value: '04:30 PM'},
    {label: '04:45 PM', value: '04:45 PM'},
    {label: '05:00 PM', value: '05:00 PM'},
    {label: '05:15 PM', value: '05:15 PM'},
    {label: '05:30 PM', value: '05:30 PM'},
    {label: '05:45 PM', value: '05:45 PM'},
    {label: '06:00 PM', value: '06:00 PM'},
    {label: '06:15 PM', value: '06:15 PM'},
    {label: '06:30 PM', value: '06:30 PM'},
    {label: '06:45 PM', value: '06:45 PM'},
    {label: '07:00 PM', value: '07:00 PM'},
    {label: '07:15 PM', value: '07:15 PM'},
    {label: '07:30 PM', value: '07:30 PM'},
    {label: '07:45 PM', value: '07:45 PM'},
    {label: '08:00 PM', value: '08:00 PM'},
    {label: '08:15 PM', value: '08:15 PM'},
    {label: '08:30 PM', value: '08:30 PM'},
    {label: '08:45 PM', value: '08:45 PM'},
    {label: '09:00 PM', value: '09:00 PM'},
    {label: '09:15 PM', value: '09:15 PM'},
    {label: '09:30 PM', value: '09:30 PM'},
    {label: '09:45 PM', value: '09:45 PM'},
    {label: '10:00 PM', value: '10:00 PM'},
    {label: '10:15 PM', value: '10:15 PM'},
    {label: '10:30 PM', value: '10:30 PM'},
    {label: '10:45 PM', value: '10:45 PM'},
    {label: '11:00 PM', value: '11:00 PM'},
    {label: '11:15 PM', value: '11:15 PM'},
    {label: '11:30 PM', value: '11:30 PM'},
    {label: '11:45 PM', value: '11:45 PM'},
  ];
  const [startdateRequest, setStartdateRequest] = useState(new Date());
  const [openstartdate, setOpenStartDate] = useState(false);
  const [punchInRequest, setPunchInRequest] = useState(null);
  const [punchOut, setPunchOut] = useState(null);
  const [reasonText, setReasonText] = useState('');
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
    console.log(config)
    axios(config)
      .then(response => {
        setStartdateRequest(new Date(response.data.data.date));
        setPunchInRequest(
          response.data.data.punch_in.split(' ')[1].slice(0, 5),
        ); // Extract time from datetime
        setPunchOut(response.data.data.punch_out.split(' ')[1].slice(0, 5));
        setReasonText(response.data.data.reason);
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    getItem();
  }, []);
  function convertTo24Hour(time) {
    let [hours, minutes] = time.match(/\d+/g);
    let period = time.match(/AM|PM/i);

    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (period && period[0].toUpperCase() === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period && period[0].toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }
  const attendance_Request = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    if (punchInRequest == null) {
      setModalRequest(false);
      showMessage({
        message: 'Please enter Punch In Time',
        type: 'danger',
      });
    } else if (punchInRequest == null) {
      setModalRequest(false);
      showMessage({
        message: 'Please enter Punch out Time',
        type: 'danger',
      });
    } else if (reasonText.trim() === '') {
      setModalRequest(false);
      showMessage({
        message: 'Please Enter Reason',
        type: 'danger',
      });
    } else {
        setLoader(true);
      let data = JSON.stringify({
        date: startdateRequest.toISOString().split('T')[0],
        punch_in: convertTo24Hour(punchInRequest),
        punch_out: convertTo24Hour(punchOut),
        reason: reasonText,
      });
      const url = `${BASE_URL}/attendance/request/update/${id}`;
      let form = 0;
      const response = await AttendanceRequest(url, data, token, form);
      setLoader(false);
      if (response.data.status) {
        setLoader(false);
        setPunchInRequest(null);
        setPunchOut(null);
        setReasonText('');
        showMessage({
          message: `${response?.data?.message}`,
          type: 'success',
        });
        navigation.goBack()
      }
    }
  };
  return (
    <ScrollView style={styles.modalContent}>
      <View style={styles.modalContainer}>
        <View>
          <Text style={styles.modalTitle}>Enter Attendance Details</Text>
          <View style={styles.Date_box}>
            <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>
              {startdateRequest?.toISOString().split('T')[0]}
            </Text>
            <TouchableOpacity onPress={() => setOpenStartDate(true)}>
              <EvilIcons
                name="calendar"
                style={{
                  fontSize: 25,
                  color: Themes == 'dark' ? '#000' : '#000',
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          </View>

          <Text style={{color: '#333', fontSize: 15, marginVertical: 5}}>
            Punch In Time
          </Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={[{color: '#000'}]}
            selectedTextStyle={[{color: '#000'}]}
            itemTextStyle={{
              color: '#000',
            }}
            data={timeOptions}
            labelField="label"
            valueField="value"
            placeholder={
              punchInRequest != null ? punchInRequest : 'Select Time'
            }
            value={punchInRequest}
            onChange={item => setPunchInRequest(item.value)}
          />
          {/* Punch Out Time Picker */}
          <Text style={{color: '#333', fontSize: 15, marginVertical: 5}}>
            Punch Out Time
          </Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={[{color: '#000'}]}
            selectedTextStyle={[{color: '#000'}]}
            itemTextStyle={{
              color: '#000',
            }}
            data={timeOptions}
            labelField="label"
            valueField="value"
            placeholder={punchOut != null ? punchOut : 'Select Time'}
            value={punchOut}
            onChange={item => setPunchOut(item.value)}
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
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.saveButton ,{  backgroundColor: currentTheme.background_v2,}]}
              onPress={() => attendance_Request()}>
                 {loader ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save</Text>
          )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <DatePicker
        modal
        open={openstartdate}
        date={startdateRequest}
        theme="light"
        mode="date"
        onConfirm={startdate => {
          setOpenStartDate(false);
          setStartdateRequest(startdate);
        }}
        onCancel={() => {
          setOpenStartDate(false);
        }}
      />
    </ScrollView>
  );
};

export default UpdateRequestattendance;

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
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {color: '#fff', textAlign: 'center', fontWeight: 'bold'},
  dropdown: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
