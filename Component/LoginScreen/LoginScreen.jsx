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
Modal,
  Dimensions
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
  const { width } = Dimensions.get('window');

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalRequest, setModalRequest] = useState(false);
  const [faceEmail, setFaceEmail] = useState('');
  const [loaderFace, setLoaderFace] = useState(false);
  const [faceError, setFaceError] = useState();
  const [userInfo,setUserInfo]=useState('');
  const [faceData,setFaceData]=useState();
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['1%', '60%'], []);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const loginSubmit = async () => {
    try {
      if (email == '') {
        showMessage({
          message: 'Please enter Employee ID',
          type: 'danger',
          duration: 2000,
        });
      }
      else if (password == '') {
        showMessage({
          message: 'Please enter password',
          type: 'danger',
          duration: 2000,
        });
      } else {
        let data = {
          emp_id: email,
          password: password,
        };
        setLoader(true);
        const url = `${BASE_URL}/login`;
        const response = await login(url, data);
        
        if (response?.data?.status) {
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
          setLoader(false);
        }
      }
    } catch (error) {
      setLoader(false);
      console.log( error.response?.data);
      showMessage({
        message: error.response?.data?.message,
        type: 'danger',
        duration: 2000,
      });
     
     
    }
  };
  const faceLoginKyc = async () => {
    if (faceEmail.trim() === '') {
      setFaceError('Please enter your Employee ID');
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
            const faceData = {
              empId: response.data.data.details.emp_id,
              token: response.data.data.access_token,
              faceImage: response.data.data.details.face_kyc,
            };
            setModalRequest(false);
            setFaceData(faceData)
            setUserInfo(response.data.data)
            bottomSheetRef.current?.expand();
      
          } else {
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
        setFaceEmail('');
        setFaceError(response.data.message);
        showMessage({
          message: response.data.message,
          type: 'danger',
        });
      }
    }
  };
  const Info = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value || '-'}</Text>
    </View>
  );
  const onfaceLogin=()=>{
    navigation.navigate('FaceLogin', {faceData});
    bottomSheetRef.current?.close();
    setFaceEmail('');
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView style={LoginGuestStyle.contanier}>
        <Image
          source={require('../../assets/logo.png')}
          style={LoginGuestStyle.Img_icon}
        />
        <Text style={LoginGuestStyle.LoginGuest_Text}>
          Login to your Account
        </Text>
        <Text style={LoginGuestStyle.Phone_number}>Emp ID</Text>
        <View style={LoginGuestStyle.passInput}>
          <TextInput
            placeholder="Emp ID"
            value={email}
            onChangeText={prev => setEmail(prev)}
            style={LoginGuestStyle.InputPassword}
            onChange={() => setEmailError(null)}
            placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
          />
          <Image
            source={require('../../assets/Login/user.png')}
            style={{width: 25, height: 25, marginRight: 15}}
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
                style={{width: 25, height: 25, marginRight: 15}}
              />
            ) : (
              <Image
                source={require('../../assets/Login/show.png')}
                style={{width: 25, height: 25, marginRight: 15}}
              />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
          <Text style={LoginGuestStyle.forget}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={LoginGuestStyle.submit_button}
          onPress={() => loginSubmit()}
          disabled={loader}>
          {loader ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={LoginGuestStyle.submit_text}>Login</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={LoginGuestStyle.submit_button}
          onPress={() => setModalRequest(!modalRequest)}>
          <Text style={LoginGuestStyle.submit_text}>Login with Face ID</Text>
        </TouchableOpacity>
        <Modal visible={modalRequest}>
          <View style={LoginGuestStyle.modalContainer}>
            <View style={LoginGuestStyle.modalContent}>
              <Text style={{color: '#333', fontSize: 15, marginVertical: 5}}>
                Emp ID
              </Text>
              <TextInput
                style={LoginGuestStyle.input}
                placeholder="Emp Id"
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
        <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints}>
        <View style={styles.sheetContent}>
          <Image source={{ uri: userInfo?.details?.profile_image }} style={styles.avatar} />
          <Text style={styles.name}>{userInfo?.name}</Text>

          <Info label="Date of Birth" value={userInfo?.details?.date_of_birth} />
          <Info label="Phone" value={userInfo?.details?.phone} />
          <Info label="Email" value={userInfo?.email} />
          <Info label="Gender" value={userInfo?.details?.gender === 'M' ? 'Male' : 'Female'} />
          <Info label="Blood Group" value={userInfo?.details?.blood_group} />
          <Info label="Employee ID" value={userInfo?.details?.emp_id} />
          <Info label="Joining Date" value={userInfo?.details?.joining_date} />
          <Info label="Official Email" value={userInfo?.details?.official_email_id} />
          <TouchableOpacity style={styles.button} onPress={()=>onfaceLogin()}>
            <Text style={styles.buttonText}>Go to Face Login</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
      <FlashMessage position="top" />
    </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  openButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    margin: 16,
  },
  openButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  sheetContent: {
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color:'#000'
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    fontWeight: '600',
    color: '#4B5563',
  },
  value: {
    color: '#111827',
  },
  button: {
    backgroundColor: '#0E0E64',
    padding: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
