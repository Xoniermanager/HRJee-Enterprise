// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ActivityIndicator,
//   SafeAreaView,
// } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';
// import LoginGuestStyle from './LoginGuestStyle';
// import { TextInput } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from '../../utils';
// // import messaging from '@react-native-firebase/messaging';
// // import NotificationController from '../../NotificationController.android';
// import axios from 'axios';
// import { Root, Popup, Toast } from 'popup-ui';
// import { login } from '../../APINetwork/ComponentApi';
// import { useNavigation } from '@react-navigation/native';
// import { showMessage } from "react-native-flash-message";

// const TwoFectorVerification = ({ route }) => {
//   const navigation = useNavigation();
//   const [loader, setLoader] = useState(false);
//   const [resendloader, setResendLoader] = useState(false);
//   const [otpError, setOtpError] = useState('');

//   // const {id} = route?.params;
//   const [otp, setOtp] = useState('');
//   const { email } = route?.params;
//   const { password } = route?.params;
//   const loginSubmit = async () => {


//     let token = await AsyncStorage.getItem('TOKEN');

//     let data = {
//       otp: otp,
//       email: email,
//       password: password,
//     };

//     setLoader(true);
//     let config = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: 'https://hrjee-v2.xonierconnect.com/api/verify/otp',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         Cookie:
//           'XSRF-TOKEN=eyJpdiI6InViRHk5Nm1SaDNwVWZaa1lrZTlscmc9PSIsInZhbHVlIjoidU9HQnlaV0xMcHFOb2Jqa0pzQVJxNkV3VVMrR1NJVEdYMXNObjNRdzJxSUI3V2tJQkFncW9vRndBYUFReTNVY3lIbXpKYlgrRkJHZGRDZ0ZxZlRYY05ySGR5YUU2N1AxSXJ6b2RGTWhacTh3akhPOGZvcDBKRFc2VUtoZ21Zek8iLCJtYWMiOiI2MTZiODdjYjdlOTFjNTgwODA3OGFkNzBmNjdhNDgxZTZiMjUwMzc0NTkyOGMzOTQyOTNjM2VhMzhjZWY0ZjliIiwidGFnIjoiIn0%3D; hrjee_v2_session=eyJpdiI6IjdtNVFYdzFvR2s4dEZxVHdkRVlZUmc9PSIsInZhbHVlIjoiZVJ1blI2VHJucDFSdnBHYitDQ2t4SnF3WGs5ZGQ4dHV4ZnhRZ1pHSVpPUjYwZ0hlZVBHKzlpdUJTdHJwV1g1aWxwODVEMXI2WEZ1Z0pCZmhDMlc2TjNiTXk3MDFSbVI0QklJV1hGTHhxemZhcmFaWDltdDE0RklndVpKMXFGU0UiLCJtYWMiOiJjNmQ2MjgxZWI1YWJhODAxMTNlNDYwYTEzYzE1ZjRkNjY2NDFlMmMxZDRlZTE2MzZkNmZjN2FmNzRjNGQwODA1IiwidGFnIjoiIn0%3D',
//       },
//       data: data,
//     };
//     console.log(config, 'config')
//     axios
//       .request(config)
//       .then(async response => {
//         navigation.navigate('MyTabbar');
//         setLoader(false);
//         setOtpError('');
//       })
//       .catch(error => {
//         if (error.response) {
//           // error?.response?.data?.length> 0 ?
//           // showMessage({
//           //   message: `${error?.response?.data?.message}` || 'Server error, please try again',
//           //   type: "danger",
//           // })
//           // :
//           // showMessage({
//           //   message: `${error?.response?.data?.error?.otp}` || 'Server error, please try again',
//           //   type: "danger",
//           // });
//           showMessage({
//             message: `${error?.response?.data?.message}` || 'Server error, please try again',
//             type: "danger",
//           })
//         } else if (error.request) {
//           // Network error
//           showMessage({
//             message: 'Network error, please check your connection.',
//             type: "danger",
//           });
//           // alert('Network error, please check your connection.')
//         } else {
//           // Other errors
//           showMessage({
//             message: 'An unexpected error occurred.',
//             type: "danger",
//           });
//           // alert('An unexpected error occurred.')
//         }
//         // console.log("console.......",error?.response?.data);
//         setLoader(false);
//         // setOtpError('');
//       });

//   };

//   const resendOTP = async () => {
//     setResendLoader(true);
//     let config = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: `https://hrjee-v2.xonierconnect.com/api/sendOtp?email=${email}`,
//       headers: {
//         Cookie:
//           'XSRF-TOKEN=eyJpdiI6InViRHk5Nm1SaDNwVWZaa1lrZTlscmc9PSIsInZhbHVlIjoidU9HQnlaV0xMcHFOb2Jqa0pzQVJxNkV3VVMrR1NJVEdYMXNObjNRdzJxSUI3V2tJQkFncW9vRndBYUFReTNVY3lIbXpKYlgrRkJHZGRDZ0ZxZlRYY05ySGR5YUU2N1AxSXJ6b2RGTWhacTh3akhPOGZvcDBKRFc2VUtoZ21Zek8iLCJtYWMiOiI2MTZiODdjYjdlOTFjNTgwODA3OGFkNzBmNjdhNDgxZTZiMjUwMzc0NTkyOGMzOTQyOTNjM2VhMzhjZWY0ZjliIiwidGFnIjoiIn0%3D; hrjee_v2_session=eyJpdiI6IjdtNVFYdzFvR2s4dEZxVHdkRVlZUmc9PSIsInZhbHVlIjoiZVJ1blI2VHJucDFSdnBHYitDQ2t4SnF3WGs5ZGQ4dHV4ZnhRZ1pHSVpPUjYwZ0hlZVBHKzlpdUJTdHJwV1g1aWxwODVEMXI2WEZ1Z0pCZmhDMlc2TjNiTXk3MDFSbVI0QklJV1hGTHhxemZhcmFaWDltdDE0RklndVpKMXFGU0UiLCJtYWMiOiJjNmQ2MjgxZWI1YWJhODAxMTNlNDYwYTEzYzE1ZjRkNjY2NDFlMmMxZDRlZTE2MzZkNmZjN2FmNzRjNGQwODA1IiwidGFnIjoiIn0%3D',
//       },
//     };

//     axios
//       .request(config)
//       .then(response => {
//         console.log(JSON.stringify(response.data));
//         setResendLoader(false);
//       })
//       .catch(error => {
//         console.log(error);
//         setResendLoader(false);
//       });
//   };
//   return (
//     <>

//       <SafeAreaView style={LoginGuestStyle.contanier}>
//         <Root>
//           <View style={{ marginTop: responsiveHeight(5) }}>
//             <Text
//               style={{
//                 textAlign: 'center',
//                 fontSize: responsiveFontSize(2),
//                 color: '#fff',
//               }}>
//               Enter your OTP confirm{' '}
//             </Text>
//             <Text
//               style={{
//                 textAlign: 'center',
//                 fontSize: responsiveFontSize(2),
//                 color: '#fff',
//               }}>
//               your verfication
//             </Text>
//           </View>
//           <TextInput
//             placeholder="Verification...."
//             value={otp}
//             onChangeText={prev => setOtp(prev)}
//             keyboardType="number-pad"
//             maxLength={4}
//             style={[LoginGuestStyle.Input_Text, { marginTop: responsiveHeight(3) }]}
//             onChange={() => setOtpError(null)}
//           />
//           {otpError ? (
//             <Text style={LoginGuestStyle.error}>{otpError}</Text>
//           ) : null}
//           <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
//             <TouchableOpacity
//               style={{
//                 width: responsiveWidth(40),
//                 borderRadius: 20,
//                 alignSelf: 'center',
//                 backgroundColor: '#0433DA',
//                 marginTop: responsiveHeight(7.5),
//                 height: responsiveHeight(6.25),
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}
//               onPress={() => resendOTP()}>
//               {resendloader ? (
//                 <ActivityIndicator size="small" color="#fff" />
//               ) : (
//                 <Text style={LoginGuestStyle.submit_text}>resend</Text>
//               )}
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={{
//                 width: responsiveWidth(40),
//                 borderRadius: 20,
//                 alignSelf: 'center',
//                 backgroundColor: '#0433DA',
//                 marginTop: responsiveHeight(7.5),
//                 height: responsiveHeight(6.25),
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}
//               onPress={() => loginSubmit()}>
//               {loader ? (
//                 <ActivityIndicator size="small" color="#fff" />
//               ) : (
//                 <Text style={LoginGuestStyle.submit_text}>submit</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//           <Text
//             style={{
//               textAlign: 'center',
//               fontSize: responsiveFontSize(2),
//               color: '#fff',
//               marginTop: responsiveHeight(5),
//             }}>
//             This OTP is valid for 2 minutes.
//           </Text>
//         </Root>
//       </SafeAreaView>
//     </>
//   );
// };

// export default TwoFectorVerification;

// const styles = StyleSheet.create({});



import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
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

  const loginSubmit = async () => {
    let data = { otp, email, password, token };

    setLoader(true);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://hrjee-v2.xonierconnect.com/api/verify/otp',
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
        setLoader(false);
      });
  };

  const resendOTP = async () => {
    setResendLoader(true);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://hrjee-v2.xonierconnect.com/api/sendOtp?email=${email}`,
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
