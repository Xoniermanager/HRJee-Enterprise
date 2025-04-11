import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import messaging from "@react-native-firebase/messaging";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import LoginGuestStyle from './LoginGuestStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { CodeField, Cursor } from 'react-native-confirmation-code-field';
import Themes from '../Theme/Theme';
import { BASE_URL } from '../../utils';

const CELL_COUNT = 4;

const TwoFectorVerification = ({ route }) => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [resendLoader, setResendLoader] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otp, setOtp] = useState('');
  const { email } = route?.params;
  const { password } = route?.params;
  const { token } = route?.params;
  const [fcmtoken, setfcmtoken] = useState();
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      getFCMToken();
    }
  }
  async function getFCMToken() {
    const token = await messaging().getToken();
    console.log(token);
    setfcmtoken(token);
  }
  useEffect(() => {
    requestUserPermission();
  }, []);
  const loginSubmit = async () => {
    let data = { otp, email, password, token };
    setLoader(true);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/verify/otp`,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios
      .request(config)
      .then(async (response) => {
        console.log(response.data.data.reset_password)
        if(response.data.data.reset_password==1){
          setLoader(false);
          if (response && response.data && response?.data?.data?.access_token) {
            await AsyncStorage.setItem('TOKEN', response?.data?.data?.access_token);
            await AsyncStorage.setItem('reset_password', JSON.stringify(response?.data?.data?.reset_password));
          }
          showMessage({
            message: `${response?.data?.message}`,
            type: "success",
          });
          navigation.navigate('FirstTimeChangePassword');
        }
        else{
          if (response && response.data && response?.data?.data?.access_token) {
            await AsyncStorage.setItem('TOKEN', response?.data?.data?.access_token);
          }
          showMessage({
            message: `${response?.data?.message}`,
            type: "success",
          });
          navigation.navigate('MyTabbar');
          setLoader(false);
          setOtpError('');
        }

     
      })
      .catch((error) => {
        if (error.response) {
          let message = 'Server error, please try again';

          if (Array.isArray(error.response.data.message)) {
            message = error.response.data.message.join(', ');
          } else if (typeof error.response.data.message === 'object') {
            // If the message is an object, extract and join its values into a string
            message = Object.values(error.response.data.message).flat().join(', ');
          } else if (typeof error.response.data.message === 'string') {
            // If the message is a string, use it directly
            message = error.response.data.message;
          }

          showMessage({
            message: message,
            type: "danger",
          });
        } else if (error.request) {
          // Network error
          showMessage({
            message: 'Network error, please check your connection.',
            type: "danger",
          });
        } else {
          // Other errors
          showMessage({
            message: 'An unexpected error occurred.',
            type: "danger",
          });
        }
        setLoader(false);
      });
  };

  const resendOTP = async () => {
    setResendLoader(true);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/sendOtp?email=${email}`,
    };

    axios
      .request(config)
      .then((response) => {
        showMessage({
          message: `${response?.data?.message}`,
          type: "success",
        });
        setResendLoader(false);
      })
      .catch((error) => {
        if (error.response) {
          // Server-side error
          let message = 'Server error, please try again';

          if (Array.isArray(error.response.data.message)) {
            // If the message is an array, join its elements into a string
            message = error.response.data.message.join(', ');
          } else if (typeof error.response.data.message === 'object') {
            // If the message is an object, extract and join its values into a string
            message = Object.values(error.response.data.message).flat().join(', ');
          } else if (typeof error.response.data.message === 'string') {
            // If the message is a string, use it directly
            message = error.response.data.message;
          }

          showMessage({
            message: message,
            type: "danger",
          });
        } else if (error.request) {
          // Network error
          showMessage({
            message: 'Network error, please check your connection.',
            type: "danger",
          });
        } else {
          // Other errors
          showMessage({
            message: 'An unexpected error occurred.',
            type: "danger",
          });
        }
        setResendLoader(false);
      });
  };

  return (
    <SafeAreaView style={LoginGuestStyle.contanier}>
      <View style={{ marginTop: responsiveHeight(5) }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: responsiveFontSize(2),
            color: '#fff',
          }}>
          Enter your OTP to confirm
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: responsiveFontSize(2),
            color: '#fff',
          }}>
          your verification
        </Text>
      </View>

      <CodeField
        value={otp}
        onChangeText={setOtp}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />

      {otpError ? <Text style={LoginGuestStyle.error}>{otpError}</Text> : null}

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <TouchableOpacity
          style={styles.button}
          onPress={resendOTP}>
          {resendLoader ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={LoginGuestStyle.submit_text}>Resend</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={loginSubmit}>
          {loader ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={LoginGuestStyle.submit_text}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text
        style={{
          textAlign: 'center',
          fontSize: responsiveFontSize(2),
          color: '#fff',
          marginTop: responsiveHeight(5),
        }}>
        This OTP is valid for 2 minutes.
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginTop: responsiveHeight(3),
    width: responsiveWidth(80),
    alignSelf: 'center',
  },
  cell: {
    width: responsiveWidth(15),
    height: responsiveHeight(6),
    lineHeight: responsiveHeight(6),
    fontSize: responsiveFontSize(2.5),
    borderWidth: 2,
    borderColor: '#00000030', 
    textAlign: 'center',
    backgroundColor: "#fff",
    borderRadius: 5, 
    color: Themes == 'dark' ? '#000' : '#000'
  },
  focusCell: {
    borderColor: '#000',
  },
  button: {
    width: responsiveWidth(40),
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: '#0433DA',
    marginTop: responsiveHeight(7.5),
    height: responsiveHeight(6.25),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TwoFectorVerification;
