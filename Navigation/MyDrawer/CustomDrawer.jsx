import { StyleSheet, Text, View, TouchableOpacity, Alert, Switch, Platform } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { logout } from '../../APINetwork/ComponentApi';
import { BASE_URL } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import { CommonActions, useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../Store/ConetxtApi.jsx/ConextApi';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import VersionCheck from 'react-native-version-check';
export default function CustomDrawer(props) {
  const [loader, setLoader] = useState(false);
  const [version, setVersion] = useState('');
  const navigation = useNavigation();
  const { toggleTheme, isEnabled } = useContext(ThemeContext);
  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const latestVersion = await VersionCheck.getLatestVersion({
          packageName: Platform.OS === 'ios' ? 'com.appHrjeeEnterprise' : 'com.hrjee_enterprise',
          ignoreErrors: true,
        });
        const currentVersion = VersionCheck.getCurrentVersion();
        setVersion(currentVersion);
      } catch (error) {
        console.error('Error checking app version:', error);
      }
    };

    checkAppVersion();
  }, []);

  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: handleLogout }
      ],
      { cancelable: false }
    );
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/logout`;
      const response = await logout(url, token);

      if (response?.data?.status) {
        showMessage({ message: response.data.message, type: "success" });
        await AsyncStorage.removeItem('TOKEN');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          })
        );
      }
    } catch (error) {
      console.log('Error making POST request:', error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {/* <View style={styles.themeToggleContainer}>
          <Text style={styles.toggleText}>Theme</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81B0FF' }}
            thumbColor={isEnabled ? '#F5DD4B' : '#F4F3F4'}
            ios_backgroundColor="#3E3E3E"
            onValueChange={toggleTheme}
            value={isEnabled}
            style={styles.switch}
          />
        </View> */}
        <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>

      {/* Version Display at Bottom */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version: {version}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
  },
  toggleText: {
    fontSize: responsiveFontSize(2),
    color: '#fff',
    marginLeft: 20,
  },
  switch: {
    marginRight: 60,
  },
  logoutButton: {
    marginLeft: 35,
    marginTop: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 17,
  },
  versionContainer: {
    position: 'absolute',
    bottom: 130,
    left: 0,
    right: 140,
    alignItems: 'center',
  },
  versionText: {
    color: '#fff',
    fontSize: 14,
  },
});

