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
    // const {id} = route?.params;
    const [otp, setOtp] = useState('');
    const [tok, setTok] = useState();

    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
      if (enabled) {
        CheckToken()
      }
    }
  
  
    const CheckToken = async () => {
      const FCMTOKEN = await messaging().getToken();
      console.log(FCMTOKEN,'FCMTOKEN')
      setTok(FCMTOKEN);
    };
  
  useEffect(()=>{
    requestUserPermission()
  },[])

    // const getaccess = async token => {
    //   if (token) {
    //     let config = {
    //       method: 'post',
    //       maxBodyLength: Infinity,
    //       url: `http://192.168.1.16:8000/api/setToken?fcm_token=${tok}`,
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     };
    //     axios
    //       .request(config)
    //       .then(response => {
    //         console.log(token, 'token-------------', tok);
    //       })
    //       .catch(error => {
    //         console.log(error, 'bsjkdbfkjsbjsjb');
    //       });
    //   } else {
    //     console.log('first');
    //   }
    // };
    let data = {
      // id: id,
      otp: otp,
    };
    const loginSubmit = async () => {
      if (otp.trim() === '') {
          setOtpError('Please enter some text');
        }
        else {
          setLoader(true);
          const url = `${BASE_URL}/otp/verification`;
          const response = await login(url, data);
      
          if (response.status == 200) {
            setLoader(false);
            setOtpError('')
            // getaccess(response?.data?.token);
            await AsyncStorage.setItem('token', response?.data?.token);
            await AsyncStorage.setItem(
              'PRN',
              JSON.stringify(response?.data?.prn_status),
            );
            if (response?.data?.prn_status == 1) {
              navigation.navigate('PatientTabBar');
            } else {
              navigation.navigate('PRNTabBar');
            }
          } else {
            Popup.show({
              type: 'Warning',
              title: 'Warning',
              button: true,
              textBody: 'OTP is not correct',
              buttonText: 'Ok',
            });
            setLoader(false);
            setOtpError('')
  
          }
        }
     
    };
  
    const resendOTP = async () => {
      const data = {
        id: id,
      };
      setResendLoader(true);
      console.log(data, 'data');
      const url = `${BASE_URL}/resend/otp`;
      const response = await login(url, data);
  
      if (response.status == 200) {
        setResendLoader(false);
        Popup.show({
          type: 'Success',
          title: 'Successfully',
          button: true,
          textBody: 'We sent you Otp on your Email.',
          buttonText: 'Ok',
        });
      } else {
        Popup.show({
          type: 'Warning',
          title: 'Warning',
          button: true,
          textBody: 'O',
          buttonText: 'Ok',
        });
        setResendLoader(false);
      }
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