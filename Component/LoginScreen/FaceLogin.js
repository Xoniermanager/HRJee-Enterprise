import React, {useState, useEffect, useRef, useContext} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_S3_BUCKET} from '@env';
import {
  Camera,
  useCameraPermission,
  useCameraDevice,
} from 'react-native-vision-camera';
import {BlurView} from '@react-native-community/blur';
import {ProgressBar} from 'react-native-paper';
import AWS, {Rekognition, S3} from 'aws-sdk';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
import {showMessage} from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('window');
const FaceLogin = ({route}) => {
    const {FaceData}=route?.params
    const navigation=useNavigation()
  const s3 = new S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION,
  });
  const rekognition = new Rekognition({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION,
  });
  const cameraRef = useRef(null);
  const {requestPermission} = useCameraPermission();
  const [matchProgress, setMatchProgress] = useState(0);
  const [pictureTaken, setPictureTaken] = useState(false);
  const device = useCameraDevice('front');
  useEffect(() => {
    (async () => {
      const status = await Camera.getCameraPermissionStatus();
      if (status !== 'authorized') {
        await requestPermission();
      }
    })();
  }, []);

  useEffect(() => {
      setPictureTaken(false);
      let progressInterval = setInterval(() => {
        setMatchProgress(prev => {
          if (prev >= 1) {
            clearInterval(progressInterval);

            return 1;
          }
          return prev + 0.1;
        });
      }, 1000);

      return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (!pictureTaken) {
      setTimeout(() => takePicture(), 2000);
    }
  }, [pictureTaken]);

  const takePicture = async () => {
    if (cameraRef.current && !pictureTaken) {
      setPictureTaken(true);
      try {
        const options = {quality: 0.5, base64: true};
        const data = await cameraRef.current.takePhoto(options);
        console.log(data,'data')
        let uploaddata = await uploadTmpImage(data.path);
        console.log(uploaddata,'uploaddata')
          const s3ObjectKey = uploaddata?.key;
          console.log(s3ObjectKey,'s3ObjectKey')
          const ss = await compareFaces(s3ObjectKey);
      } catch (error) {
        console.error('Error capturing image:', error);
      }
    }
  };
  const uploadTmpImage = async uri => {
    try {
      let employeeNumber = FaceData.emp_id;
      const fileData = await RNFS.readFile(uri, 'base64');
      const buffer = Buffer.from(fileData, 'base64');
      const rekognitionParams = {
        Image: {Bytes: buffer},
        Attributes: ['ALL'],
      };
      const rekognitionResponse = await rekognition
        .detectFaces(rekognitionParams)
        .promise();
      const facesWithEyeContact = rekognitionResponse.FaceDetails.filter(
        face => {
          const eyesOpen = face.EyesOpen && face.EyesOpen.Value;
          const yaw = face.Pose.Yaw;
          const pitch = face.Pose.Pitch;
          return eyesOpen && Math.abs(yaw) < 20 && Math.abs(pitch) < 20;
        },
      );
      if (rekognitionResponse.FaceDetails.length > 1) {
        showMessage({
          message:
            'Multiple faces detected. Please ensure only one face is in the image for KYC verification.',
          type: 'danger',
        });
        return;
      }
      if (rekognitionResponse.FaceDetails.length === 0) {
        showMessage({
          message: 'No human faces detected. Upload aborted',
          type: 'danger',
        });
       
        return;
      }
      if (facesWithEyeContact.length === 0) {
        showMessage({
          message:
            'No front-facing faces with eye contact detected. Upload aborted.',
          type: 'danger',
        });
        return;
      }
      const params = {
        Bucket: AWS_S3_BUCKET,
        Key: `hrjee_face_login/${employeeNumber}.jpg`,
        Body: buffer,
        ContentType: 'image/jpeg',
      };
      const uploadResponse = await s3.upload(params).promise();
      console.log('✅ Upload successful!', uploadResponse);
      return uploadResponse;
    } catch (error) {
      console.error('S3 Upload Error:', error);
    }
  };
  const compareFaces = async s3ObjectKey => {
    const params = {
      SourceImage: {
        S3Object: {
          Bucket: AWS_S3_BUCKET,
          Name: s3ObjectKey,
        },
      },
      TargetImage: {
        S3Object: {
          Bucket: AWS_S3_BUCKET,
          Name: FaceData.faceImage,
        },
      },
      SimilarityThreshold: 90,
    };
    rekognition.compareFaces(params, (err, data) => {
      if (err) {
        console.log(err.message, ' err.message');
        if (
          err.message ===
          'Requested image should either contain bytes or s3 object.'
        ) {
            navigation.goBack();
          showMessage({
            message: 'Keep Your Face front to the camera',
            type: 'danger',
          });
         
        } else if (err.message === 'Request has invalid parameters') {
            navigation.goBack();
          showMessage({
            message: 'Keep Your Face front to the camera',
            type: 'danger',
          });
        } else {
            navigation.goBack();
          showMessage({
            message: err.message,
            type: 'danger',
          });
         
        }
      } else if (data?.UnmatchedFaces.length > 0) {
        navigation.goBack();
        showMessage({
          message: 'Face do not match',
          type: 'danger',
        });
       
      } else {
          AsyncStorage.setItem(
            'TOKEN',
            FaceData.token,
          );
        showMessage({
            message: 'Face match success' ,
            type: 'success',
          });
          navigation.navigate('MyTabbar');
       
      }
    });
  };
  const getProgressBarColor = () => {
    if (matchProgress < 0.4) return '#FF0000';
    if (matchProgress < 0.7) return '#FFA500';
    return '#00FF00';
  };
  return (
    <View style={styles.container}>
      <BlurView style={styles.blurOverlay} blurType="dark" blurAmount={20} />
      {device ? (
        <View style={styles.cameraContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Camera
                ref={cameraRef}
                style={styles.camera}
                device={device}
                isActive={true}
                photo={true}
              />
            </View>
          </View>
        </View>
      ) : null}
     <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Face Match: {Math.round(matchProgress * 100)}%
          </Text>
          <ProgressBar
            progress={matchProgress}
            color={getProgressBarColor()}
            style={styles.progressBar}
          />
        </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  blurOverlay: {...StyleSheet.absoluteFillObject, zIndex: 1},
  cameraContainer: {
    position: 'absolute',
    top: height * 0.3,
    alignSelf: 'center',
    zIndex: 2,
  },
  outerCircle: {
    width: 300,
    height: 300,
    borderRadius: 250,
    borderWidth: 5,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {width: 280, height: 280, borderRadius: 250, overflow: 'hidden'},
  camera: {width: '100%', height: '100%'},
  progressContainer: {
    position: 'absolute',
    bottom: 130,
    width: '80%',
    alignSelf: 'center',
    zIndex: 3,
  },
  progressText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
  },
  progressBar: {height: 12, borderRadius: 6, backgroundColor: '#444'},
});

export default FaceLogin;
