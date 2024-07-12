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


const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tok, setTok] = useState();



  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const loginSubmit = async () => {
    try {
      let data = {
        email: email,
        password: password,
      };
      console.log("data------", data)

      //  await AsyncStorage.setItem('EMAIL', JSON.stringify(email))
      //  await AsyncStorage.setItem('PASSWORD', JSON.stringify(password))

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
        if (response?.data?.status == true) {
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
        else {
          setLoader(false);
        }
      }
    } catch (error) {
      console.error('Error making POST request:', error);
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
          />
          <Image
            source={require('../../assets/Login/user.png')}
            style={{ width: 25, height: 25, marginRight: 10 }}
          />
        </View>

        {emailError ? (
          <Text style={LoginGuestStyle.error}>{emailError}</Text>
        ) : null}
        <Text style={LoginGuestStyle.Phone_number}>Password</Text>
        <View style={LoginGuestStyle.passInput}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={prev => setPassword(prev)}
            secureTextEntry={!showPassword}
            style={LoginGuestStyle.InputPassword}
            onChange={() => setPasswordError(null)}
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
        {passwordError ? (
          <Text style={LoginGuestStyle.error}>{passwordError}</Text>
        ) : null}
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





