import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
  Modal,
} from 'react-native';

import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import {Root} from 'popup-ui';
import LinearGradient from 'react-native-linear-gradient';
import LoginGuestStyle from './LoginGuestStyle';
import {
  faceLogin,
  login,
  setTokenDone,
  token,
} from '../../APINetwork/ComponentApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../utils';
import axios from 'axios';
import FlashMessage from 'react-native-flash-message';
import {showMessage} from 'react-native-flash-message';
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
  const [modalRequest, setModalRequest] = useState(false);
  const [faceEmail, setFaceEmail] = useState('');
  const [loaderFace, setLoaderFace] = useState(false);
  const [faceError, setFaceError] = useState();
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
      if (email == '') {
        showMessage({
          message: 'Please enter email',
          type: 'danger',
          duration: 2000,
        });
      } else if (!emailRegex.test(email)) {
        showMessage({
          message: 'Please enter valid email',
          type: 'danger',
          duration: 2000,
        });
      } else if (password == '') {
        showMessage({
          message: 'Please enter password',
          type: 'danger',
          duration: 2000,
        });
      } else {
        setLoader(true);
        const url = `${BASE_URL}/login`;
        const response = await login(url, data);
        if (response?.data?.status) {
          if (response?.data?.data?.id == 2) {
            if (response.data.data.reset_password == 1) {
              setEmail('');
              setPassword('');
              setEmailError('');
              setPasswordError('');
              setLoader(false);
              if (
                response &&
                response.data &&
                response?.data?.data?.access_token
              ) {
                await AsyncStorage.setItem(
                  'TOKEN',
                  response?.data?.data?.access_token,
                );
                await AsyncStorage.setItem(
                  'reset_password',
                  JSON.stringify(response?.data?.data?.reset_password),
                );
              }
              showMessage({
                message: `${response?.data?.message}`,
                type: 'success',
                duration: 3000,
              });
              navigation.navigate('FirstTimeChangePassword');
            } else {
              setEmail('');
              setPassword('');
              setEmailError('');
              setPasswordError('');
              setLoader(false);
              if (
                response &&
                response.data &&
                response?.data?.data?.access_token
              ) {
                await AsyncStorage.setItem(
                  'TOKEN',
                  response?.data?.data?.access_token,
                );
              }
              showMessage({
                message: `${response?.data?.message}`,
                type: 'success',
                duration: 3000,
              });
              navigation.navigate('MyTabbar');
            }
          } else {
            showMessage({
              message: `${response?.data?.message}`,
              type: 'success',
            });
            setEmail('');
            setPassword('');
            setEmailError('');
            setPasswordError('');
            navigation.navigate('Verification', {
              email: email,
              password: password,
              token: response?.data?.data?.access_token,
            });
            setLoader(false);
          }
        } else {
          setLoader(false);
        }
      }
    } catch (error) {
      console.log('Error making POST request:', error);
      setLoader(false);
    }
  };
  const faceLoginKyc = async () => {
    if (faceEmail.trim() === '') {
      setFaceError('Please enter your Employee ID or email');
    } else {
      setLoaderFace(true);
      const token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/face/login`;
      const data = {
        key: faceEmail,
      };
      let form = 0;
      const response = await faceLogin(url, data, token, form);
      setLoaderFace(false);
      if (response.data.status) {
        if (response.data.data.details.face_recognition == 1) {
          if (response.data.data.details.face_kyc != null) {
            const FaceData = {
              empId: response.data.data.details.emp_id,
              token: response.data.data.access_token,
              faceImage: response.data.data.details.face_kyc,
            };
            setModalRequest(false);
            navigation.navigate('FaceLogin', {FaceData});
          } else {
            // setModalRequest(false);
            setFaceEmail('');
            setFaceError(
              'Face KYC is mandatory for first-time verification. Please log in using your email and password only.',
            );
            showMessage({
              message:
                'Face KYC is mandatory for first-time verification. Please log in using your email and password only.',
              type: 'danger',
              duration: 3000,
            });
          }
        } else {
          // setModalRequest(false);
          setFaceEmail('');
          setFaceError(
            `You don't have access to Face Login. Please log in with your email and password only or contact the admin`,
          );
          showMessage({
            message: `You don't have access to Face Login. Please log in with your email and password only or contact the admin`,
            type: 'danger',
            duration: 3000,
          });
        }
      } else {
        // setModalRequest(false);
        setFaceEmail('');
        setFaceError(response.data.message);
        showMessage({
          message: response.data.message,
          type: 'danger',
        });
      }
    }
  };

  return (
    <SafeAreaView style={LoginGuestStyle.contanier}>
      <Root>
        <Image
          source={require('../../assets/newLogo.jpg')}
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
            style={{width: 25, height: 25, marginRight: 10}}
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
                style={{width: 25, height: 25, marginRight: 10}}
              />
            ) : (
              <Image
                source={require('../../assets/Login/show.png')}
                style={{width: 25, height: 25, marginRight: 10}}
              />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
          <Text style={LoginGuestStyle.forget}>Forget password ?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          // style={LoginGuestStyle.submit_button}
          onPress={() => loginSubmit()}
          disabled={loader}>
          <LinearGradient
            colors={['#4DDBFE', '#33C2F9']}
            style={LoginGuestStyle.submit_button}>
            {loader ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={LoginGuestStyle.submit_text}>Login</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          // style={LoginGuestStyle.submit_button}
          onPress={() => setModalRequest(!modalRequest)}>
          <LinearGradient
            colors={['#8DEACD', '#52B8A2']}
            style={[LoginGuestStyle.submit_button, {overflow: 'hidden'}]}>
            <Text style={LoginGuestStyle.submit_text}>Login with Face ID</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Modal visible={modalRequest} transparent={true} animationType="none">
          <View style={LoginGuestStyle.modalContainer}>
            <View style={LoginGuestStyle.modalContent}>
              <Text style={{color: '#333', fontSize: 15, marginVertical: 5}}>
                EmpId/Email
              </Text>
              <TextInput
                style={LoginGuestStyle.input}
                placeholder="EmpId/Email"
                value={faceEmail}
                onChangeText={prev => setFaceEmail(prev)}
                onChange={() => setFaceError(null)}
                placeholderTextColor="#999"
              />
              {faceError ? (
                <Text style={{color: 'red', textAlign: 'center', fontSize: 13}}>
                  {faceError}
                </Text>
              ) : null}
              {/* Buttons */}
              <View style={LoginGuestStyle.buttonRow}>
                <TouchableOpacity
                  style={LoginGuestStyle.saveButton}
                  onPress={() => faceLoginKyc()}>
                  {loaderFace ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={LoginGuestStyle.buttonText}>Save</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={LoginGuestStyle.closeButton}
                  onPress={() => {
                    setModalRequest(false),
                      setFaceEmail(''),
                      setLoaderFace(false);
                    setFaceError(null);
                  }}>
                  <Text style={LoginGuestStyle.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Root>
      <FlashMessage position="top" />
    </SafeAreaView>
  );
};

export default LoginScreen;
