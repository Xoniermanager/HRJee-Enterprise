import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
  const navigation = useNavigation();
  setTimeout(async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const reset_password = await AsyncStorage.getItem('reset_password');
    if (token !== null && reset_password==0) {
      navigation.navigate('MyTabbar')
    } 
    else  if (token !== null && reset_password==1) {
      navigation.navigate('FirstTimeChangePassword')
    } 
    else  if (token !== null) {
      navigation.navigate('MyTabbar')
    } 
    else {
      navigation.navigate('OnboardingScreen');
    }
  }, 2000);
  return (
    <View style={styles.conatiner}>
      <Image source={require('../../assets/newLogo.jpg')} style={{ alignSelf: 'center',
        marginTop:30,
        height:250, width: 250, resizeMode:"contain",
        borderRadius:125}} />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: '#5A6A77',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
