import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import DatePicker from 'react-native-date-picker';
import Themes from '../../Theme/Theme';
import {
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../utils';
import {showMessage} from 'react-native-flash-message';
import {AttendanceRequest} from '../../../APINetwork/ComponentApi';
import {useNavigation} from '@react-navigation/native';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';

const AddAttendance = ({route}) => {
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

  const attendance_Request = async () => {
    const token = await AsyncStorage.getItem('TOKEN');

    if (!punchInTime) {
      showMessage({
        message: 'Please enter Punch In Time',
        type: 'danger',
        duration: 2000,
      });
    } else if (!punchOutTime) {
      showMessage({
        message: 'Please enter Punch Out Time',
        type: 'danger',
        duration: 2000,
      });
    } else if (reasonText.trim() === '') {
      showMessage({
        message: 'Please Enter Reason',
        type: 'danger',
        duration: 2000,
      });
    } else {
      setLoader(true);

      // Format: H:i (e.g., 8:00, 13:45)
      const formatToHi = date => {
        const hours = date.getHours(); // 0-23
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      const data = JSON.stringify({
        date: startdateRequest.toISOString().split('T')[0],
        punch_in: formatToHi(punchInTime),
        punch_out: formatToHi(punchOutTime),
        reason: reasonText,
      });

      const url = `${BASE_URL}/attendance/request/store`;
      console.log(data, url);

      const response = await AttendanceRequest(url, data, token, 0);
      setLoader(false);

      if (response?.data?.status) {
        setReasonText('');
        showMessage({
          message: response?.data?.message,
          type: 'success',
        });
        navigation.goBack();
      } else {
       
      }
    }
  };

  return (
    <ScrollView style={styles.modalContent}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Enter Attendance Details</Text>

        {/* Date Picker */}
        <View style={styles.Date_box}>
          <Text style={{color: '#000'}}>
            {startdateRequest?.toISOString().split('T')[0]}
          </Text>
          <TouchableOpacity onPress={() => setOpenStartDate(true)}>
            <EvilIcons name="calendar" size={25} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Punch In Time */}
        <Text style={styles.label}>Punch In Time</Text>
        <TouchableOpacity
          style={styles.Date_box}
          onPress={() => setOpenPunchIn(true)}>
          <Text style={{color: '#000'}}>
            {punchInTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
          <EvilIcons name="clock" size={25} color="#000" />
        </TouchableOpacity>

        {/* Punch Out Time */}
        <Text style={styles.label}>Punch Out Time</Text>
        <TouchableOpacity
          style={styles.Date_box}
          onPress={() => setOpenPunchOut(true)}>
          <Text style={{color: '#000'}}>
            {punchOutTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
          <EvilIcons name="clock" size={25} color="#000" />
        </TouchableOpacity>

        {/* Reason Input */}
        <Text style={styles.label}>Reason</Text>
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

      {/* Date Pickers */}
      <DatePicker
        modal
        open={openStartDate}
        date={startdateRequest}
        theme="light"
        mode="date"
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

export default AddAttendance;

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
    color: '#333',
    fontSize: 15,
    marginVertical: 5,
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
    marginTop: 15,
    height: 50,
    marginBottom: 5,
    width: responsiveWidth(85),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
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
