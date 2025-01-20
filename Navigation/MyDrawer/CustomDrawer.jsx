import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Switch } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { logout } from '../../APINetwork/ComponentApi';
import { BASE_URL } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { showMessage } from "react-native-flash-message";
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../Store/ConetxtApi.jsx/ConextApi';
import { responsiveFontSize } from 'react-native-responsive-dimensions';


export default function CustomDrawer(props) {
  const [loader, setLoader] = useState(false)
  const navigation = useNavigation()
  const {toggleTheme, currentTheme, theme, isEnabled} =
  useContext(ThemeContext);

  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => handleLogout() }
      ],
      { cancelable: false }
    );
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN')
      console.log("TOKEN", token)
      const url = `${BASE_URL}/logout`;
      console.log("url", url, token)
      const response = await logout(url, token);
      if (response?.data?.status == true) {
        showMessage({
          message: `${response?.data?.message}`,
          type: "success",
        });
        await AsyncStorage.removeItem('TOKEN')
        navigation.navigate('LoginScreen')
        setLoader(false);
      }
      else {
        setLoader(false);
      }
    } catch (error) {
      console.log('Error making POST request:', error);
      setLoader(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <View style={styles.themeToggleContainer}>
            <Text style={[styles.toggleText]}>Theme</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81B0FF' }}
              thumbColor={isEnabled ? '#F5DD4B' : '#F4F3F4'}
              ios_backgroundColor="#3E3E3E"
              onValueChange={toggleTheme}
              value={isEnabled}
              style={{marginRight:60}}
            />
          </View>
        <TouchableOpacity onPress={() => confirmLogout()}>
          <Text style={{ color: '#fff', marginLeft: 35, fontSize: 17, marginTop: 8 }}>Logout</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer_image: {
    width: 20,
    height: 20,

    borderWidth: 0.5,
    borderColor: '#000',
    borderRadius: 20
  },
  drawerText: {
    color: '#000',
    fontSize: 20,
    marginLeft: 15,
    fontWeight: "bold"
  },
  drawerBox: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft:20
  },
});
