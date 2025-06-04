import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {Root} from 'popup-ui';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {BASE_URL} from '../../utils';
import {showMessage} from 'react-native-flash-message';

const ResetPassword = ({route}) => {
  const theme = useColorScheme();
  const navigation = useNavigation();
  const [resendloader, setResendLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOTP] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(120); // 2 minutes
  const {email} = route.params;

  // Countdown Timer
  useEffect(() => {
    if (secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const reset_Password = async () => {
    setLoader(true);
    const data = {
      emp_id: email,
      password: password,
      confirm_password: confirmPassword,
      otp: otp,
    };

    if (
      password.trim() === '' ||
      confirmPassword.trim() === '' ||
      otp.trim() === ''
    ) {
      showMessage({
        message: `Password and OTP fields are mandatory`,
        type: 'danger',
        duration: 2000,
      });
      setLoader(false);
    } else if (password.length < 8) {
      setLoader(false);
      showMessage({
        message: `Password must be at least 8 characters`,
        type: 'danger',
        duration: 2000,
      });
    } else if (password !== confirmPassword) {
      setLoader(false);
      showMessage({
        message: `Password mismatch`,
        type: 'danger',
        duration: 2000,
      });
    } else {
      try {
        const response = await axios.post(`${BASE_URL}/reset/password`, data, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.data.status) {
          setLoader(false);
          showMessage({
            message: `${response?.data?.message}`,
            type: 'success',
            duration: 3000,
          });
          navigation.navigate('LoginScreen');
        } else {
          setLoader(false);
          showMessage({
            message: response.data.message,
            type: 'danger',
            duration: 3000,
          });
        }
      } catch (error) {
        setLoader(false);
        console.log(error);
        showMessage({
          message: error.response?.data?.message || 'Something went wrong',
          type: 'danger',
          duration: 3000,
        });
      }
    }
  };

  const resendOTP = async () => {
    setResendLoader(true);
    try {
      const response = await axios.post(`${BASE_URL}/sendOtp?emp_id=${email}`);
      setResendLoader(false);
      setSecondsRemaining(120); // Reset timer
      showMessage({
        message: `${response?.data?.message}`,
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      setResendLoader(false);
      showMessage({
        message: 'Failed to resend OTP',
        type: 'danger',
        duration: 3000,
      });
    }
  };

  // Format timer as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(secondsRemaining / 60).toString().padStart(2, '0');
    const seconds = (secondsRemaining % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <View style={{flex: 1, backgroundColor: '#0E0E64'}}>
      <Root>
        <ScrollView>
          <View style={{marginVertical: 10, marginHorizontal: 20}}>
            <TextInput
              style={[styles.input, {color: '#000'}]}
              placeholder="Password"
              placeholderTextColor="#000"
              autoCapitalize="none"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
            />
          </View>
          <View style={{marginVertical: 10, marginHorizontal: 20}}>
            <TextInput
              style={[styles.input, {color: '#000'}]}
              placeholder="Confirm Password"
              placeholderTextColor="#000"
              autoCapitalize="none"
              value={confirmPassword}
              secureTextEntry
              onChangeText={setConfirmPassword}
            />
          </View>
          <View style={{marginVertical: 10, marginHorizontal: 20}}>
            <TextInput
              style={[styles.input, {color: '#000'}]}
              placeholder="OTP"
              autoCapitalize="none"
              keyboardType="number-pad"
              placeholderTextColor="#000"
              maxLength={4}
              value={otp}
              onChangeText={setOTP}
            />
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <TouchableOpacity
              disabled={secondsRemaining > 0}
              style={{
                width: responsiveWidth(40),
                borderRadius: 30,
                alignSelf: 'center',
                backgroundColor: secondsRemaining > 0 ? '#999' : '#0433DA',
                marginTop: responsiveHeight(7.5),
                height: responsiveHeight(6.25),
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#000',
              }}
              onPress={resendOTP}>
              {resendloader ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: responsiveFontSize(2.1),
                    fontWeight: '500',
                  }}>
                  {secondsRemaining > 0
                    ? `Resend in ${formatTime()}`
                    : 'Resend'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: responsiveWidth(40),
                borderRadius: 30,
                alignSelf: 'center',
                backgroundColor: '#0433DA',
                marginTop: responsiveHeight(7.5),
                height: responsiveHeight(6.25),
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={reset_Password}>
              {loader ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: responsiveFontSize(2.1),
                    fontWeight: '500',
                  }}>
                  Submit
                </Text>
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
            OTP valid for: {formatTime()}
          </Text>
        </ScrollView>
      </Root>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  input: {
    marginTop: 5,
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
});
