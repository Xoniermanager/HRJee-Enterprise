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
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {Root, Popup} from 'popup-ui';
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
  const [loading, setloading] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const {email} = route.params;
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const reset_Password = async () => {
    setLoader(true);
    const data = {
      emp_id: email,
      password: password,
      confirm_password: confirmPassword,
      otp: otp,
    };
      console.log(data,'data')
    if (
      password.trim() === '' ||
      confirmPassword.trim() === '' ||
      otp.trim() === ''
    ) {
   
      showMessage({
        message: `Password and OTP Fields are mendatory`,
        type: 'danger',
        duration: 2000,
      });
    } 
    else if (password.length < 8) {
      setLoader(false);
      showMessage({
        message: `Password must be at least 8 characters`,
        type: 'danger',
        duration:2000,
      });
    
    }
    else if (password != confirmPassword) {
      setLoader(false);
      showMessage({
        message: `Password Mismatched`,
        type: 'danger',
        duration: 2000,
      });
    } else {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/reset/password`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      axios
        .request(config)
        .then(response => {
          if (response.data.status) {
            setLoader(false);
            showMessage({
              message: `${response?.data?.message}`,
              type: 'success',
              duration: 3000,
            });
            navigation.navigate('LoginScreen');
          } else {
            setloading(false);
            setLoader(false);
            showMessage({
              message: response.data.message,
              type: 'danger',
              duration: 3000,
            });
          }
        })
        .catch(error => {
          setLoader(false);
          console.log(error);
          showMessage({
            message: error.response.data.message,
            type: 'danger',
            duration: 3000,
          });
          setloading(false);
        });
    }
  };
  const resendOTP = async () => {
    setResendLoader(true);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/sendOtp?emp_id=${email}`,
    };

    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        setResendLoader(false);
        showMessage({
          message: `${response?.data?.message}`,
          type: 'success',
          duration: 3000,
        });
      })
      .catch(error => {
        console.log(error);
        setResendLoader(false);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#0E0E64'}}>
      <Root>
        <ScrollView>
          <View style={{marginVertical: 10, marginHorizontal: 20}}>
            <TextInput
              style={[styles.input, {color: theme == 'dark' ? '#000' : '#000'}]}
              placeholder="Password"
              placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
              autoCapitalize="none"
              value={password}

              onChangeText={text => setPassword(text)}
            />
          </View>
          <View style={{marginVertical: 10, marginHorizontal: 20}}>
            <TextInput
              style={[styles.input, {color: theme == 'dark' ? '#000' : '#000'}]}
              placeholder="Confirm Password"
              placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
            />
          </View>
          <View style={{marginVertical: 10, marginHorizontal: 20}}>
            <TextInput
              style={[styles.input, {color: theme == 'dark' ? '#000' : '#000'}]}
              placeholder="OTP"
              autoCapitalize="none"
              keyboardType="number-pad"
              placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
              maxLength={4}
              value={otp}
              onChangeText={text => setOTP(text)}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
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
                borderWidth: 1,
                borderColor: '#000',
              }}
              onPress={() => resendOTP()}>
              {resendloader ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: responsiveFontSize(2.1),
                    fontWeight: '500',
                  }}>
                  Resend
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
              onPress={() => reset_Password()}>
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
            This OTP is valid for 5 minutes.
          </Text>
        </ScrollView>
      </Root>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  tinyLogo: {
    width: 75,
    height: 75,
    borderRadius: 100,
    marginRight: 20,
    borderWidth: 1,
    borderColor: 'white',
    // backgroundColor: 'pink',
  },
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
