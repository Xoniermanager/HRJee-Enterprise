import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import LoginGuestStyle from './LoginGuestStyle';
import {TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../utils';
// import messaging from '@react-native-firebase/messaging';
// import NotificationController from '../../NotificationController.android';
import axios from 'axios';
import {Root, Popup, Toast} from 'popup-ui';
import {login} from '../../APINetwork/ComponentApi';
import {useNavigation} from '@react-navigation/native';

const TwoFectorVerification = ({route}) => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [resendloader, setResendLoader] = useState(false);
  const [otpError, setOtpError] = useState('');
  const {email} = route?.params;
  const {password} = route?.params;
  // const {id} = route?.params;
  const [otp, setOtp] = useState('');
  const [tok, setTok] = useState();
  console.log(email);

  const loginSubmit = async () => {
    let data = {
      otp: otp,
      email: email,
      password: password,
    };
    if (otp.trim() === '') {
      setOtpError('Please enter some text');
    } else {
      setLoader(true);
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://hrjee-v2.xonierconnect.com/api/verify/otp',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Cookie:
            'XSRF-TOKEN=eyJpdiI6InViRHk5Nm1SaDNwVWZaa1lrZTlscmc9PSIsInZhbHVlIjoidU9HQnlaV0xMcHFOb2Jqa0pzQVJxNkV3VVMrR1NJVEdYMXNObjNRdzJxSUI3V2tJQkFncW9vRndBYUFReTNVY3lIbXpKYlgrRkJHZGRDZ0ZxZlRYY05ySGR5YUU2N1AxSXJ6b2RGTWhacTh3akhPOGZvcDBKRFc2VUtoZ21Zek8iLCJtYWMiOiI2MTZiODdjYjdlOTFjNTgwODA3OGFkNzBmNjdhNDgxZTZiMjUwMzc0NTkyOGMzOTQyOTNjM2VhMzhjZWY0ZjliIiwidGFnIjoiIn0%3D; hrjee_v2_session=eyJpdiI6IjdtNVFYdzFvR2s4dEZxVHdkRVlZUmc9PSIsInZhbHVlIjoiZVJ1blI2VHJucDFSdnBHYitDQ2t4SnF3WGs5ZGQ4dHV4ZnhRZ1pHSVpPUjYwZ0hlZVBHKzlpdUJTdHJwV1g1aWxwODVEMXI2WEZ1Z0pCZmhDMlc2TjNiTXk3MDFSbVI0QklJV1hGTHhxemZhcmFaWDltdDE0RklndVpKMXFGU0UiLCJtYWMiOiJjNmQ2MjgxZWI1YWJhODAxMTNlNDYwYTEzYzE1ZjRkNjY2NDFlMmMxZDRlZTE2MzZkNmZjN2FmNzRjNGQwODA1IiwidGFnIjoiIn0%3D',
        },
        data: data,
      };

      axios
        .request(config)
        .then(async response => {
          console.log(JSON.stringify(response.data?.data));
          if (response && response.data && response?.data?.data?.access_token) {
            await AsyncStorage.setItem('token', response?.data?.data?.access_token);
          }
          navigation.navigate('MyTabbar');
          setLoader(false);
          setOtpError('');
        })
        .catch(error => {
          console.log(error);
          setLoader(false);
          setOtpError('');
        });
    }
  };

  const resendOTP = async () => {
    setResendLoader(true);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://hrjee-v2.xonierconnect.com/api/sendOtp?email=${email}`,
      headers: {
        Cookie:
          'XSRF-TOKEN=eyJpdiI6InViRHk5Nm1SaDNwVWZaa1lrZTlscmc9PSIsInZhbHVlIjoidU9HQnlaV0xMcHFOb2Jqa0pzQVJxNkV3VVMrR1NJVEdYMXNObjNRdzJxSUI3V2tJQkFncW9vRndBYUFReTNVY3lIbXpKYlgrRkJHZGRDZ0ZxZlRYY05ySGR5YUU2N1AxSXJ6b2RGTWhacTh3akhPOGZvcDBKRFc2VUtoZ21Zek8iLCJtYWMiOiI2MTZiODdjYjdlOTFjNTgwODA3OGFkNzBmNjdhNDgxZTZiMjUwMzc0NTkyOGMzOTQyOTNjM2VhMzhjZWY0ZjliIiwidGFnIjoiIn0%3D; hrjee_v2_session=eyJpdiI6IjdtNVFYdzFvR2s4dEZxVHdkRVlZUmc9PSIsInZhbHVlIjoiZVJ1blI2VHJucDFSdnBHYitDQ2t4SnF3WGs5ZGQ4dHV4ZnhRZ1pHSVpPUjYwZ0hlZVBHKzlpdUJTdHJwV1g1aWxwODVEMXI2WEZ1Z0pCZmhDMlc2TjNiTXk3MDFSbVI0QklJV1hGTHhxemZhcmFaWDltdDE0RklndVpKMXFGU0UiLCJtYWMiOiJjNmQ2MjgxZWI1YWJhODAxMTNlNDYwYTEzYzE1ZjRkNjY2NDFlMmMxZDRlZTE2MzZkNmZjN2FmNzRjNGQwODA1IiwidGFnIjoiIn0%3D',
      },
    };

    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        setResendLoader(false);
      })
      .catch(error => {
        console.log(error);
        setResendLoader(false);
      });
  };
  return (
    <SafeAreaView style={LoginGuestStyle.contanier}>
      <Root>
        <View style={{marginTop: responsiveHeight(5)}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: responsiveFontSize(2),
              color: '#fff',
            }}>
            Enter your OTP confirm{' '}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: responsiveFontSize(2),
              color: '#fff',
            }}>
            your verfication
          </Text>
        </View>

        <TextInput
          placeholder="Verification...."
          value={otp}
          onChangeText={prev => setOtp(prev)}
          keyboardType="number-pad"
          maxLength={4}
          style={[LoginGuestStyle.Input_Text, {marginTop: responsiveHeight(3)}]}
          onChange={() => setOtpError(null)}
        />
        {otpError ? (
          <Text style={LoginGuestStyle.error}>{otpError}</Text>
        ) : null}
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <TouchableOpacity
            style={{
              width: responsiveWidth(40),
              borderRadius: 20,
              alignSelf: 'center',
              backgroundColor: '#0433DA',
              marginTop: responsiveHeight(7.5),
              height: responsiveHeight(6.25),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => resendOTP()}>
            {resendloader ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={LoginGuestStyle.submit_text}>resend</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: responsiveWidth(40),
              borderRadius: 20,
              alignSelf: 'center',
              backgroundColor: '#0433DA',
              marginTop: responsiveHeight(7.5),
              height: responsiveHeight(6.25),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => loginSubmit()}>
            {loader ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={LoginGuestStyle.submit_text}>submit</Text>
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
      </Root>
    </SafeAreaView>
  );
};

export default TwoFectorVerification;

const styles = StyleSheet.create({});
