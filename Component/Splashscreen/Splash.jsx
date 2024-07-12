import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
  const navigation = useNavigation();
  setTimeout(async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    console.log("splash token ", token)
    if (token !== null) {
      navigation.navigate('MyTabbar')
    } else {
      navigation.navigate('OnboardingScreen');
    }
  }, 2000);
  return (
    <View style={styles.conatiner}>
      <Image source={require('../../assets/logo.png')} style={{ resizeMode: 'contain', width: '75%' }} />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: '#0E0E64',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
