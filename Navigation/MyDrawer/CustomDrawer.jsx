import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { logout } from '../../APINetwork/ComponentApi';
import { BASE_URL } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomDrawer(props) {
  const navigation = props.navigation;


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
    const token = await AsyncStorage.getItem('token');
    console.log("token", token)
    try {
      const url = `${BASE_URL}/logout`;
      const response = await logout(url, token);
      AsyncStorage.removeItem('token')
      navigation.navigate('OnboardingScreen')
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={{ color: '#fff', marginLeft: 35, fontSize: 17 }}>Change Password</Text>
        </TouchableOpacity>
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
});
