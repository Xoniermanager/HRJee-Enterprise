import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';

import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { Root, Popup, Toast } from 'popup-ui';
import LoginGuestStyle from './LoginGuestStyle';
import { login, setTokenDone, token } from '../../APINetwork/ComponentApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../utils';
import axios from 'axios';
import FlashMessage from "react-native-flash-message";
import { showMessage } from "react-native-flash-message";
import Themes from '../Theme/Theme';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logindata, setLogInData] = useState('');
  const [loader, setLoader] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  const loginSubmit = async () => {
    try {
      let data = {
        email: email,
        password: password,
      };
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email == "") {
        showMessage({
          message: "Please enter email",
          type: "danger",
        });
      }
      else if (!emailRegex.test(email)) {
        showMessage({
          message: "Please enter valid email",
          type: "danger",
        });
      }
      else if (password == "") {
        showMessage({
          message: "Please enter password",
          type: "danger",
        });
      }
      else {
        setLoader(true);
        const url = `${BASE_URL}/login`;
        const response = await login(url, data);
        if (response?.data?.status) {
            if(response?.data?.data?.id==2){
              if(response.data.data.reset_password==1){
                setEmail('');
                setPassword('');
                setEmailError('');
                setPasswordError('');
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
                setEmail('');
                setPassword('');
                setEmailError('');
                setPasswordError('');
                setLoader(false);
                if (response && response.data && response?.data?.data?.access_token) {
                  await AsyncStorage.setItem('TOKEN', response?.data?.data?.access_token);
                }
                showMessage({
                  message: `${response?.data?.message}`,
                  type: "success",
                });
                navigation.navigate('MyTabbar');
              }
             
            }
            else{
              showMessage({
                message: `${response?.data?.message}`,
                type: "success",
              });
              setEmail('');
              setPassword('');
              setEmailError('');
              setPasswordError('');
              navigation.navigate('Verification', { email: email, password: password, token: response?.data?.data?.access_token });
              setLoader(false);
            }
         
        }
        else {
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
      <Root>
        <Image
          source={require('../../assets/logo.png')}
          style={LoginGuestStyle.Img_icon}
        />
        <Text style={LoginGuestStyle.LoginGuest_Text}>
          Login to your Account
        </Text>
 
       <Text style={LoginGuestStyle.Phone_number}>E-mail</Text>
        <View style={LoginGuestStyle.passInput}>
          <TextInput
            placeholder="E-mail"
            value={email}
            onChangeText={prev => setEmail(prev)}
            style={LoginGuestStyle.InputPassword}
            onChange={() => setEmailError(null)}
            placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
          />
          <Image
            source={require('../../assets/Login/user.png')}
            style={{ width: 25, height: 25, marginRight: 10 }}
          />
        </View>


        <Text style={LoginGuestStyle.Phone_number}>Password</Text>
        <View style={LoginGuestStyle.passInput}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={prev => setPassword(prev)}
            secureTextEntry={!showPassword}
            style={LoginGuestStyle.InputPassword}
            onChange={() => setPasswordError(null)}
            placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
          />
          <TouchableOpacity onPress={() => toggleShowPassword()}>
            {showPassword ? (
              <Image
                source={require('../../assets/Login/hide.png')}
                style={{ width: 25, height: 25, marginRight: 10 }}
              />
            ) : (
              <Image
                source={require('../../assets/Login/show.png')}
                style={{ width: 25, height: 25, marginRight: 10 }}
              />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgetPassword')}>
          <Text style={LoginGuestStyle.forget}>Forget password ?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={LoginGuestStyle.submit_button}
          onPress={() => loginSubmit()}
          // onPress={() => navigation.navigate('MyTabbar')}
          disabled={loader}
        >
          {loader ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={LoginGuestStyle.submit_text}>Login</Text>
          )}
        </TouchableOpacity>
      </Root>
      <FlashMessage position="top" />
    </SafeAreaView>
  );

};

export default LoginScreen;





