import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {Root, Popup} from 'popup-ui';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';
import {BASE_URL} from '../../../utils';
import {showMessage} from 'react-native-flash-message';
import Themes from '../../Theme/Theme';
const AddCompoff = () => {
  const navigation = useNavigation();
  const {currentTheme,empyName,empyId} = useContext(ThemeContext);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [remark, setRemark] = useState('');
  const {} = useContext(ThemeContext);
  const [loader, setLoader] = useState(false);
  const [balanceCompOff, setBalanceCompOff] = useState('');
  const getBalncCompfo = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const config = {
      method: 'get',
      url: `${BASE_URL}/comp-offs`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    axios(config)
      .then(respnse => {
        setBalanceCompOff(respnse.data.data.balanced);
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    getBalncCompfo();
  }, []);
  const UpdateCompOff = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    if (startDate == null) {
      showMessage({
        message: 'Please select the start date',
        type: 'danger',
      });
    } else if (endDate == null) {
      showMessage({
        message: 'Please select the end date',
        type: 'danger',
      });
    }
    else if (remark.trim() === '') {
        showMessage({
          message: 'Please  enter the remark text.',
          type: 'danger',
        });
      }
    else {
      setLoader(true);
      let data = JSON.stringify({
        start_date: startDate?.toISOString().split('T')[0],
        end_date: endDate?.toISOString().split('T')[0],
        user_remark: remark,
      });
      const config = {
        method: 'post',
        url: `${BASE_URL}/comp-offs/add`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };
      console.log(data, 'data');
      axios(config)
        .then(response => {
          setLoader(false);
          if (response.data.status == true) {
            showMessage({
              message: response.data.message,
              type: 'success',
            });
            navigation.goBack();
          } else {
            showMessage({
              message: response.data.message,
              type: 'danger',
            });
          }
        })
        .catch(err => {
          setLoader(false);
          console.log(err);
        });
    }
  };
  return (
    <>
      <Root>
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Employee ID</Text>
              <TextInput
                style={styles.inputs}
                value={JSON.stringify(empyId)}
                editable={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.inputs}
                value={empyName}
                editable={false}
              />
            </View>
          </View>

          <Text style={styles.balanceText}>
            Balance Comp Off : {balanceCompOff}
          </Text>

          <View>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              style={styles.dateInput}>
              <Text style={styles.dateText}>
                {startDate
                  ? startDate.toISOString().split('T')[0]
                  : 'yyyy-mm-dd'}
              </Text>
              <EvilIcons
                name="calendar"
                style={{
                  fontSize: 25,
                  color: Themes == 'dark' ? '#000' : '#000',
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartPicker(false);
                  if (selectedDate) setStartDate(selectedDate);
                }}
              />
            )}
          </View>

          <View>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              style={styles.dateInput}>
              <Text style={styles.dateText}>
                {endDate ? endDate.toISOString().split('T')[0] : 'yyyy-mm-dd'}
              </Text>
              <EvilIcons
                name="calendar"
                style={{
                  fontSize: 25,
                  color: Themes == 'dark' ? '#000' : '#000',
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowEndPicker(false);
                  if (selectedDate) setEndDate(selectedDate);
                }}
              />
            )}
          </View>
          <TextInput
            placeholder={'Remark...'}
            value={remark}
            onChangeText={text => setRemark(text)}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: currentTheme.background_v2},
            ]}
            onPress={() => UpdateCompOff()}>
            {loader ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </Root>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  balanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    color: '#888',
  },
  button: {
    backgroundColor: '#0043ae',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
    marginTop: 10,
  },
});

export default AddCompoff;
