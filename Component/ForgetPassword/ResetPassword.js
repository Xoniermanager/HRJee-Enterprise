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
      email: email,
      password: password,
      password_confirmation: confirmPassword,
      otp: otp,
    };
    const token = await AsyncStorage.getItem('token');
    if (
      password.trim() === '' ||
      confirmPassword.trim() === '' ||
      otp.trim() === ''
    ) {
      setLoader(false);
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: 'Password and OTP Fields are mendatory ',
        buttonText: 'Ok',
        callback: () => [Popup.hide()],
      });
    } else if (password != confirmPassword) {
      setLoader(false);

      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: 'Password Mismatched',
        buttonText: 'Ok',
        callback: () => [Popup.hide()],
      });
    } else {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://hrjee-v2.xonierconnect.com/api/password/reset',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'ci_session=ngc399claf516efh767kho1ldnmsf952',
        },
        data: data,
      };

      axios
        .request(config)
        .then(response => {
          if (response.data.status == 1) {
            setLoader(false);
            Popup.show({
              type: 'Success',
              title: 'Success',
              button: true,
              textBody: response.data.message,
              buttonText: 'Ok',
              callback: () => [Popup.hide(), navigation.navigate('LoginScreen')],
            });
          } else if (response.data.status == 0) {
            setloading(false);
            setLoader(false);

            Popup.show({
              type: 'Warning',
              title: 'Warning',
              button: true,
              textBody: response.data.message,
              buttonText: 'Ok',
              callback: () => [Popup.hide()],
            });
          }
        })
        .catch(error => {
          setLoader(false);

          console.log(error);
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody: error.response.data.message,
            buttonText: 'Ok',
            callback: () => [Popup.hide()],
          });
          console.log(error);
          setloading(false);
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
              onChangeText={text =>
                // setpassword({...password, currentPassword: text})
                setPassword(text)
              }
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
                  backgroundColor: "#0433DA",
                marginTop: responsiveHeight(7.5),
                height: responsiveHeight(6.25),
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: "#000",
              }}
              onPress={() => resendOTP()}>
              {resendloader ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text
                  style={{
                    color: "#fff",
                    fontSize: responsiveFontSize(2.1),
                    fontWeight: '500',
                  }}>
                  resend
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: responsiveWidth(40),
                borderRadius: 30,
                alignSelf: 'center',
                backgroundColor: "#0433DA",
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
                  submit
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
    backgroundColor:"#fff"
  },
});
