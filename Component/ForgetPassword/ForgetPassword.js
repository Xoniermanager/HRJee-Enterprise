import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import LoginGuestStyle from '../LoginScreen/LoginGuestStyle';
import {forget_password} from '../../APINetwork/ComponentApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../utils';
import Themes from '../Theme/Theme';
import {showMessage} from 'react-native-flash-message';

const ForgetPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState();
  const [loader, setLoader] = useState(false);

  let data = {
    email: email,
  };
  const ForgetSubmit = async () => {
    try {
      const Token = await AsyncStorage.getItem('TOKEN');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (email?.trim() === '') {
        showMessage({
          message: 'Please enter email',
          type: 'danger',
          duration: 2000,
        });
      } else if (!emailRegex.test(email)) {
        showMessage({
          message: 'Invalid email address',
          type: 'danger',
          duration:2000,
        });
      } else {
        setLoader(true);
        const url = `${BASE_URL}/forgot/password`;
        const response = await forget_password(url, data, Token);

        if (response?.data?.status == true) {
          showMessage({
            message: `${response?.data?.message}`,
            type: 'success',
            duration: 3000,
          });
          setLoader(false);
          navigation.navigate('ResetPassword', {email: email});
        } else {
          setLoader(false);
        }
      }
    } catch (error) {
      console.log('Error making POST request:', error);
      setLoader(false);
    }
  };
  return (
    <SafeAreaView style={LoginGuestStyle.contanier}>
      <Text style={styles.registeredText}>
        Please provide your registered email address to recover your password.
      </Text>
      <Text style={styles.EmailText}>E-mail</Text>
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={prev => setEmail(prev)}
        style={styles.Input_Text}
        placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
      />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.forget}>Have Password ?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={LoginGuestStyle.submit_button}
        onPress={() => ForgetSubmit()}>
        {loader ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submit_text}>Submit</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  RecoverPasswordText: {
    color: '#37496E',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 15,
  },
  registeredText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 25,
  },
  EmailText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    marginHorizontal: 40,
    marginTop: 10,
    color: '#fff',
  },
  Input_Text: {
    width: responsiveWidth(85),
    borderRadius: 15,
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginTop: 7,
    padding: Platform.OS === 'ios' ? 18 : 10,
    color: '#000',
  },
  forget: {
    fontSize: responsiveFontSize(1.7),
    textAlign: 'right',
    fontWeight: '300',
    marginTop: 10,
    marginRight: 35,
    color: '#fff',
  },
  submit_button: {
    width: responsiveWidth(85),
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: '#003746',
    marginTop: responsiveHeight(7.5),
    height: responsiveHeight(6.25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  submit_text: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
  },
});
