import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, Modal, View, Image, Text,Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import ConextApi from './Store/ConetxtApi.jsx/ConextApi';
import MyStack from './Navigation/MyStack/MyStack';
import 'react-native-gesture-handler';
import FlashMessage from "react-native-flash-message";
import { navigationRef } from './APINetwork/NavigationService';
import NetInfo from '@react-native-community/netinfo';
import VersionCheck from 'react-native-version-check';
const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const update = async () => {
    Linking.openURL(
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/in/app/hrjee-enterprise/id6740908270'
        : 'https://play.google.com/store/apps/details?id=com.hrjee_enterprise',
    );
  };

  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const latestVersion = await VersionCheck.getLatestVersion({
          packageName: Platform.OS === 'ios' ? 'com.appHrjeeEnterprise' : 'com.hrjee_enterprise',
          ignoreErrors: true,
        })
        const currentVersion = VersionCheck.getCurrentVersion();
        console.log(currentVersion,latestVersion,'hellox')
        if (latestVersion>currentVersion) {
          Alert.alert(
            'Update Required',
            'A new version of the app is available. Please update to continue using the app.',
            [
              {
                text: 'Update Now',
                onPress: () => {
                  update();
                },
              },
            ],
            { cancelable: false },
          );
        } else {
        }
      } catch (error) {
        // Handle error while checking app version
        console.error('Error checking app version:', error);
      }
    };

    checkAppVersion();
  }, []);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        setIsModalVisible(true);
      } else {
        setIsModalVisible(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  return (
    <ConextApi>
      <StatusBar barStyle="light-content" backgroundColor="#0E0E64" />
      <NavigationContainer ref={navigationRef}>
        <MyStack />
      </NavigationContainer>
      <FlashMessage position="top" />  
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image  
              source={ require('./assets/no-signal.png') } 
              style={styles.image}
            />
            <Text style={styles.modalText}>Your internet is turned off. Please check your connection.</Text>
           
          </View>
        </View>
      </Modal>
    </ConextApi>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0E0E64',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
export default App;
