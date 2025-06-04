import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Text,
  StyleSheet,
  Alert,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';

import LoginGuestStyle from '../LoginScreen/LoginGuestStyle';
import Themes from '../Theme/Theme';
import { changePasswords } from '../../APINetwork/ComponentApi';
import { BASE_URL } from '../../utils';
import { ThemeContext } from '../../Store/ConetxtApi.jsx/ConextApi';


const ChangePassword = () => {
  const navigation = useNavigation();
  const {currentTheme} = useContext(ThemeContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loader, setLoader] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setShowconfirmPassword] = useState(false);
  const toggleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleShowconfirmPassword = () => {
    setShowconfirmPassword(!showconfirmPassword);
  };
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Exit App", "Are you sure you want to exit?", [
        { text: "Cancel", style: "cancel" },
        { text: "Exit", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);



  const handleChangePassword = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    try {
      if (oldPassword.trim() === '') {
        showMessage({
          message: `Enter the old Password`,
          type: 'danger',
        });
      } else if (newPassword.trim() === '') {
        showMessage({
          message: `Enter the new Password`,
          type: 'danger',
        });
      } else if (confirmPassword.trim() === '') {
        showMessage({
          message: `Confirm your Password`,
          type: 'danger',
        });
      } else if (newPassword !== confirmPassword) {
        showMessage({
          message: 'New passwords do not match',
          type: 'danger',
        });

        return;
      } else {
        let data = {
          old_password: oldPassword,
          password:newPassword,
          confirm_password: confirmPassword,
        };
        setLoader(true);
        let form = 0;
        const url = `${BASE_URL}/change/password`;
        const response = await changePasswords(url, data, token, form);
        if (response?.data?.status == true) {
          let reset_password = 0;
          await AsyncStorage.setItem(
            'reset_password',
            JSON.stringify(reset_password),
          );
          setLoader(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          showMessage({
            message: `${response?.data?.message}`,
            type: 'success',
          });
          navigation.navigate('MyTabbar');
        } else {
          showMessage({
            message: `${response?.data?.message}`,
            type: 'danger',
          });
          setLoader(false);
        }
      }
    } catch (error) {  
      setLoader(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
         <View
        style={[
          styles.headerContainer,
          {backgroundColor: currentTheme.background_v2},
        ]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Change Password</Text>
      </View>
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: currentTheme.background,
          borderTopLeftRadius: 40,
          marginTop: responsiveHeight(3),
          borderTopRightRadius: 40,
        }}>
        <View style={{margin: 10, marginHorizontal: responsiveWidth(8)}}>
          <Image
            style={{
              height: 150,
              width: 150,
              alignSelf: 'center',
              marginVertical: 20,
              resizeMode: 'contain',
            }}
            source={require('../../assets/ForgetPassword/reset-password.png')}
          />
          <View
            style={[
              LoginGuestStyle.passInput,
              {backgroundColor: currentTheme.inputText_color},
            ]}>
            <TextInput
              placeholder="Old Password"
              value={oldPassword}
              onChangeText={prev => setOldPassword(prev)}
              secureTextEntry={!showOldPassword}
              style={LoginGuestStyle.InputPassword}
              onChange={() => setOldPasswordError(null)}
              placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
            />
            <TouchableOpacity onPress={() => toggleShowOldPassword()}>
              {showOldPassword ? (
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
          <View
            style={[
              LoginGuestStyle.passInput,
              {backgroundColor: currentTheme.inputText_color},
            ]}>
            <TextInput
              placeholder="New Password"
              value={newPassword}
              onChangeText={prev => setNewPassword(prev)}
              secureTextEntry={!showPassword}
              style={LoginGuestStyle.InputPassword}
              onChange={() => setNewPasswordError(null)}
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

          {newPasswordError ? (
            <Text style={LoginGuestStyle.error}>{newPasswordError}</Text>
          ) : null}
          <View
            style={[
              LoginGuestStyle.passInput,
              {backgroundColor: currentTheme.inputText_color},
            ]}>
            <TextInput
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={prev => setConfirmPassword(prev)}
              secureTextEntry={!showconfirmPassword}
              style={LoginGuestStyle.InputPassword}
              onChange={() => setConfirmPasswordError(null)}
              placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
            />
            <TouchableOpacity onPress={() => toggleShowconfirmPassword()}>
              {showconfirmPassword ? (
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
          {confirmPasswordError ? (
            <Text style={LoginGuestStyle.error}>{confirmPasswordError}</Text>
          ) : null}
          <TouchableOpacity
            onPress={handleChangePassword}
            style={[
              styles.updateButton,
              {backgroundColor: currentTheme.background_v2, marginTop: 20},
            ]}>
               {loader ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.updateButtonText}>Submit</Text>
          )}
         
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E64',
  },

  name: {
    color: '#fff',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: responsiveHeight(0),
  },
  checkbox: {
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    textColor: '#000',
  },
  updateButton: {
    backgroundColor: '#0052cc',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 2,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    padding: 5,
  },
  sameAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sameAddressText: {
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8', // Change as per design
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ChangePassword;
