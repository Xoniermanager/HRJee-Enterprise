import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  StatusBar,
  Modal,
  View,
  Image,
  Text,
  Alert,
  Linking,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import ConextApi from './Store/ConetxtApi.jsx/ConextApi';
import MyStack from './Navigation/MyStack/MyStack';
import 'react-native-gesture-handler';
import FlashMessage from 'react-native-flash-message';
import {navigationRef} from './APINetwork/NavigationService';
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
    const compareVersions = (v1, v2) => {
      const clean = version => version.split('-')[0]; // Remove -beta, -alpha etc.
      const v1Parts = clean(v1).split('.').map(Number);
      const v2Parts = clean(v2).split('.').map(Number);
      const len = Math.max(v1Parts.length, v2Parts.length);

      for (let i = 0; i < len; i++) {
        const a = v1Parts[i] || 0;
        const b = v2Parts[i] || 0;
        if (a > b) return 1;
        if (a < b) return -1;
      }
      return 0;
    };

    const checkAppVersion = async () => {
      try {
        const latestVersion = await VersionCheck.getLatestVersion({
          packageName:
            Platform.OS === 'ios'
              ? 'com.appHrjeeEnterprise'
              : 'com.hrjee_enterprise',
          ignoreErrors: true,
        });

        const currentVersion = VersionCheck.getCurrentVersion();
        console.log('Latest:', latestVersion, 'Current:', currentVersion);

        if (compareVersions(latestVersion, currentVersion) === 1) {
          Alert.alert(
            'Update Required',
            'A new version of the app is available. Please update to continue using the app.',
            [
              {
                text: 'Update Now',
                onPress: () => {
                  VersionCheck.getStoreUrl().then(url => {
                    Linking.openURL(url);
                  });
                },
              },
            ],
            {cancelable: false},
          );
        }
      } catch (error) {
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
        onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={require('./assets/no-signal.png')}
              style={styles.image}
            />
            <Text style={styles.modalText}>
              Your internet is turned off. Please check your connection.
            </Text>
          </View>
        </View>
      </Modal>
    </ConextApi>
  );
};
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
