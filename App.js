
import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, Modal, View, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import ConextApi from './Store/ConetxtApi.jsx/ConextApi';
import MyStack from './Navigation/MyStack/MyStack';
import 'react-native-gesture-handler';
import FlashMessage from "react-native-flash-message";
import { navigationRef } from './APINetwork/NavigationService';
import NetInfo from '@react-native-community/netinfo';

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
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
// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
// import { Camera, useCameraPermission, useCameraDevice } from 'react-native-vision-camera';
// import { BlurView } from '@react-native-community/blur';
// import { ProgressBar } from 'react-native-paper';

// const { width, height } = Dimensions.get('window');

// const App = () => {
//   const cameraRef = useRef(null);
//   const { hasPermission, requestPermission } = useCameraPermission();
//   const [isCameraOpen, setIsCameraOpen] = useState(false);
//   const [matchProgress, setMatchProgress] = useState(0);
//   const device = useCameraDevice('back');

//   useEffect(() => {
//     (async () => {
//       const status = await Camera.getCameraPermissionStatus();
//       if (status !== 'authorized') {
//         await requestPermission();
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     if (isCameraOpen) {
//       let progressInterval = setInterval(() => {
//         setMatchProgress((prev) => {
//           if (prev >= 1) {
//             clearInterval(progressInterval);
//             return 1;
//           }
//           return prev + 0.1;
//         });
//       }, 1000);
//       return () => clearInterval(progressInterval);
//     }
//   }, [isCameraOpen]);

//   const handleOpenCamera = () => {
//     if (!hasPermission) {
//       alert('Camera permission is required');
//       return;
//     }
//     setIsCameraOpen(true);
//   };

//   const getProgressBarColor = () => {
//     if (matchProgress < 0.4) return '#FF0000';
//     if (matchProgress < 0.7) return '#FFA500';
//     return '#00FF00';
//   };

//   return (
//     <View style={styles.container}>
//       <BlurView style={styles.blurOverlay} blurType="dark" blurAmount={20} />
//       {isCameraOpen && device ? (
//         <View style={styles.cameraContainer}>
//           <View style={styles.outerCircle}>
//             <View style={styles.innerCircle}>
//               <Camera ref={cameraRef} style={styles.camera} device={device} isActive={true} />
//             </View>
//           </View>
//         </View>
//       ) : (
//         <TouchableOpacity style={styles.button} onPress={handleOpenCamera}>
//           <Text style={styles.buttonText}>Open Camera</Text>
//         </TouchableOpacity>
//       )}
//       {isCameraOpen && (
//         <View style={styles.progressContainer}>
//           <Text style={styles.progressText}>Face Match: {Math.round(matchProgress * 100)}%</Text>
//           <ProgressBar progress={matchProgress} color={getProgressBarColor()} style={styles.progressBar} />
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
//   blurOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
//   cameraContainer: {
//     position: 'absolute',
//     top: height * 0.3,
//     alignSelf: 'center',
//     zIndex: 2,
//   },
//   outerCircle: {
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     borderWidth: 5,
//     borderColor: '#FFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   innerCircle: {
//     width: 180,
//     height: 180,
//     borderRadius: 90,
//     overflow: 'hidden',
//   },
//   camera: { width: '100%', height: '100%' },
//   progressContainer: {
//     position: 'absolute',
//     bottom: 50,
//     width: '80%',
//     alignSelf: 'center',
//     zIndex: 3,
//   },
//   progressText: { color: '#FFF', textAlign: 'center', fontSize: 18, marginBottom: 10 },
//   progressBar: { height: 12, borderRadius: 6, backgroundColor: '#444' },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 10,
//     position: 'absolute',
//     bottom: height * 0.2,
//     zIndex: 4,
//   },
//   buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
// });

// export default App;
