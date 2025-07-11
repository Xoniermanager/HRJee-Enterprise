import React, {useState, useEffect, useRef, useContext} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_S3_BUCKET} from '@env';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {RNCamera} from 'react-native-camera';
import AWS, {Rekognition, S3} from 'aws-sdk';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageResizer from '@bam.tech/react-native-image-resizer';
const {width, height} = Dimensions.get('window');
const FaceLogin = ({route}) => {
  const {faceData} = route?.params;
  const navigation = useNavigation();
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
  const [matchProgress, setMatchProgress] = useState(0);
  const [pictureTaken, setPictureTaken] = useState(false);
 

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
  const takePicture = async () => {
    if (cameraRef.current && !pictureTaken) {
      setPictureTaken(true);
      try {
        const data = await cameraRef.current.takePictureAsync({quality: 0.5});
        const resizedImage = await ImageResizer.createResizedImage(
          data.uri,
          640,
          480,
          'JPEG',
          70,
        );
        const base64 = await RNFS.readFile(resizedImage.uri, 'base64');
        const buffer = Buffer.from(base64, 'base64')
        let uploaddata = await uploadTmpImage(buffer);
        const s3ObjectKey = uploaddata?.key;
        if(s3ObjectKey){
          const compareFace = await compareFaces(s3ObjectKey);
        }
       
      } catch (error) {
        console.error('Error capturing image:', error);
      }
    }
  };
  const uploadTmpImage = async (buffer) => {
    try {
      let employeeNumber = faceData.emp_id;
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
          duration: 3000,
        });
        return;
      }
      if (rekognitionResponse.FaceDetails.length === 0) {
        showMessage({
          message: 'No human faces detected. Upload aborted',
          type: 'danger',
          duration: 3000,
        });

        return;
      }
      if (facesWithEyeContact.length === 0) {
        showMessage({
          message:
            'No front-facing faces with eye contact detected. Upload aborted.',
          type: 'danger',
          duration: 3000,
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
          Name: faceData.faceImage,
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
            duration: 3000,
          });
        } else if (err.message === 'Request has invalid parameters') {
          navigation.goBack();
          showMessage({
            message: 'Keep Your Face front to the camera',
            type: 'danger',
            duration: 3000,
          });
        } else {
          navigation.goBack();
          showMessage({
            message: err.message,
            type: 'danger',
            duration: 3000,
          });
        }
      } else if (data?.UnmatchedFaces.length > 0) {
        navigation.goBack();
        showMessage({
          message: 'Face do not match',
          type: 'danger',
          duration: 3000,
        });
      } else {
        AsyncStorage.setItem('TOKEN', faceData.token);
        showMessage({
          message: 'User face matched successfully.',
          type: 'success',
          duration: 5000,
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
      <RNCamera
        ref={cameraRef}
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          width: '100%',
          height: '80%',
        }}
        type={RNCamera.Constants.Type.front}
        captureAudio={false}
        onCameraReady={takePicture}>
         <View style={styles.progressContainer}>
              <AnimatedCircularProgress
                size={150}
                width={15}
                fill={matchProgress * 100}
                tintColor={getProgressBarColor(matchProgress)}
                backgroundColor="#e0e0e0"
                duration={300}
                rotation={0}>
                {fill =>
                  Math.round(fill) !== 100 ? (
                    <Text style={styles.progressText}>
                      {Math.round(fill)}% Recognised
                    </Text>
                  ) : (
                    <Text style={styles.progressText}>Please Wait</Text>
                  )
                }
              </AnimatedCircularProgress>
            </View>
      </RNCamera>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 90,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  progressBar: {height: 12, borderRadius: 6, backgroundColor: '#444'},
});

export default FaceLogin;
