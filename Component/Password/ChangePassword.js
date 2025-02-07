import React, {useContext, useState} from 'react';
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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BASE_URL} from '../../utils';
import {changePasswords} from '../../APINetwork/ComponentApi';
import LoginGuestStyle from '../LoginScreen/LoginGuestStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Themes from '../Theme/Theme';
import {ThemeContext} from '../../Store/ConetxtApi.jsx/ConextApi';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
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

  let data = {
    old_password: oldPassword,
    password: newPassword,
    confirm_password: confirmPassword,
  };

  const handleChangePassword = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    console.log(token, 'token');
    try {
      if (newPassword !== confirmPassword) {
        showMessage({
          message: 'New passwords do not match',
          type: 'danger',
        });

        return;
      } else {
        setLoader(true);
        let form = 0;
        const url = `${BASE_URL}/change/password`;
        const response = await changePasswords(url, data, token, form);
        if (response?.data?.status == true) {
          setLoader(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          showMessage({
            message: `${response?.data?.message}`,
            type: 'success',
          });
          navigation.goBack();
        } else {
          showMessage({
            message: `${response?.data?.message}`,
            type: 'danger',
          });
          setLoader(false);
        }
      }
    } catch (error) {
      console.error('Error making POST request:', error);
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
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: currentTheme.inputText_color,
                color: currentTheme.text,
              },
            ]}
            placeholder="Old Password"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
            onChange={() => setOldPasswordError(null)}
            placeholderTextColor={currentTheme.text}
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: currentTheme.inputText_color,
                color: currentTheme.text,
              },
            ]}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            onChange={() => setNewPasswordError(null)}
            placeholderTextColor={currentTheme.text}
          />
          {newPasswordError ? (
            <Text style={LoginGuestStyle.error}>{newPasswordError}</Text>
          ) : null}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: currentTheme.inputText_color,
                color: currentTheme.text,
              },
            ]}
            placeholder="Confirm New Password"
            placeholderTextColor={currentTheme.text}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onChange={() => setConfirmPasswordError(null)}
            // placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
            setNewPasswordError
          />
          {confirmPasswordError ? (
            <Text style={LoginGuestStyle.error}>{confirmPasswordError}</Text>
          ) : null}
          {/* <Button title="Change Password" onPress={handleChangePassword} /> */}
          <TouchableOpacity
            onPress={handleChangePassword}
            style={[
              styles.updateButton,
              {backgroundColor: currentTheme.background_v2},
            ]}>
            <Text style={styles.updateButtonText}>Submit</Text>
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
