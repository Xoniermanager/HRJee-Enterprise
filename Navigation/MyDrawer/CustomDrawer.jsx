import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
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


export default function CustomDrawer(props) {
  const [loader, setLoader] = useState(false)
  const navigation = useNavigation()


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
