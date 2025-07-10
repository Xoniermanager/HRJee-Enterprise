import React, {useState, useEffect, useRef, useContext} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_S3_BUCKET} from '@env';
import {ThemeContext} from '../../Store/ConetxtApi.jsx/ConextApi';
import AWS, {Rekognition, S3} from 'aws-sdk';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../utils';
import {faceuploadKyc} from '../../APINetwork/ComponentApi';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {RNCamera} from 'react-native-camera';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import axios from 'axios';
const {width, height} = Dimensions.get('window');
const FaceCamera = ({punchIn}) => {
  const [tempImage, setTempImage] = useState('');
  const [kycExists, setKycExists] = useState(false);
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
  const {
    isCameraOpen,
    setIsCameraOpen,
    kycModal,
    empyId,
    face_kyc_img,
    setKycModal,
    user_details,
  } = useContext(ThemeContext);
  const [matchProgress, setMatchProgress] = useState(0);
  const progressIntervalRef = useRef(null);
  useEffect(() => {
    if (isCameraOpen) {
      let progress = 0;
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = setInterval(() => {
        progress = Math.min(progress + 0.05, 1);
        setMatchProgress(progress);
      }, 300);
    }
  }, [isCameraOpen]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({quality: 0.5});
        const resizedImage = await ImageResizer.createResizedImage(
          photo.uri,
          640,
          480,
          'JPEG',
          70,
        );
        const base64 = await RNFS.readFile(resizedImage.uri, 'base64');
        const buffer = Buffer.from(base64, 'base64');
        if (face_kyc_img == null) {
          const data = await uploadTmpImage(buffer);
          const listParams = {
            Bucket: AWS_S3_BUCKET,
            Prefix: 'kyc-registration/',
          };
          const s3Response = await s3.listObjectsV2(listParams).promise();
          const kycImages = s3Response.Contents || [];
          console.log(data.key, 'data.key');
          console.log(kycImages, 'kycImages');

          let matchFound = false;
          const comparePromises = kycImages.map(async image => {
            const compareParams = {
              SourceImage: {
                S3Object: {
                  Bucket: AWS_S3_BUCKET,
                  Name: data.key,
                },
              },
              TargetImage: {
                S3Object: {
                  Bucket: AWS_S3_BUCKET,
                  Name: image.Key,
                },
              },
              SimilarityThreshold: 90,
            };

            try {
              const comparisonResult = await rekognition
                .compareFaces(compareParams)
                .promise();
              if (comparisonResult.FaceMatches.length > 0 && !matchFound) {
                matchFound = true;
                showMessage({
                  message:
                    'KYC already registered for this employee. Cannot register again.',
                  type: 'warning',
                  duration: 4000,
                });
                setIsCameraOpen(false);
                setKycModal(false);
              }
            } catch (err) {
              console.log('Comparison error:', err);
            }
          });

          await Promise.all(comparePromises);
          if (!matchFound) {
            let uploaddata = await uploadFirstImage(buffer);
            if (uploaddata) {
              const s3ObjectKey = uploaddata.key;
              uploadFaceKYC(s3ObjectKey);
            }
          }
        } else {
          let uploaddata = await uploadTmpImage(buffer);
          const s3ObjectKey = uploaddata?.key;
          setTempImage(s3ObjectKey);
          if (s3ObjectKey) {
            const ss = await compareFaces(s3ObjectKey);
          }
        }
      } catch (error) {
        console.error('Error capturing image:', error);
        showMessage({
          message: 'Error capturing image. Please try again.',
          type: 'danger',
          duration: 3000,
        });
      }
    }
  };
  const uploadFaceKYC = async key => {
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/user/kyc/registration`;
    let form = 0;
    const data = {
      face_kyc: key,
    };
    const response = await faceuploadKyc(url, data, token, form);
    if (response.data.status) {
      setIsCameraOpen(false);
      user_details();
      setKycModal(false);
      showMessage({
        message: response.data.message,
        type: 'success',
        duration: 3000,
      });
    }
  };
  const punchInFaceKyc = async (s3ObjectKey) => {
    const token = await AsyncStorage.getItem('TOKEN');
    let data = JSON.stringify({
      face_punchin_kyc: s3ObjectKey,
    });
    console.log(data,'data')

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/user/punchIn/image`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
      })
      .catch(error => {
        console.log(error);
      });
  };
  const uploadFirstImage = async buffer => {
    try {
      let employeeNumber = empyId;
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
        setKycModal(false);
        setIsCameraOpen(false);
        showMessage({
          message:
            'Multiple faces detected. Please ensure only one face is in the image for KYC verification.',
          type: 'danger',
          duration: 2000,
        });

        return;
      }

      if (rekognitionResponse.FaceDetails.length === 0) {
        setKycModal(false);
        setIsCameraOpen(false);
        showMessage({
          message: 'No human faces detected. Upload aborted',
          type: 'danger',
          duration: 2000,
        });

        return;
      }

      if (facesWithEyeContact.length === 0) {
        setKycModal(false);
        setIsCameraOpen(false);
        showMessage({
          message:
            'No front-facing faces with eye contact detected. Upload aborted.',
          type: 'danger',
        });
        setIsCameraOpen(false);
        return;
      }
      const params = {
        Bucket: AWS_S3_BUCKET,
        Key: `kyc-registration/${employeeNumber}.jpg`,
        Body: buffer,
        ContentType: 'image/jpeg',
      };
      const uploadResponse = await s3.upload(params).promise();
      console.log('✅ Upload successful!', uploadResponse);
      return uploadResponse;
    } catch (error) {
      setIsCameraOpen(false);
      console.error('S3 Upload Error:', error);
    }
  };
  const uploadTmpImage = async buffer => {
    try {
      let employeeNumber = empyId;
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
        setIsCameraOpen(false);
        return;
      }

      if (rekognitionResponse.FaceDetails.length === 0) {
        showMessage({
          message: 'No human faces detected. Upload aborted',
          type: 'danger',
          duration: 3000,
        });
        setIsCameraOpen(false);
        return;
      }

      if (facesWithEyeContact.length === 0) {
        showMessage({
          message:
            'No front-facing faces with eye contact detected. Upload aborted.',
          type: 'danger',
          duration: 3000,
        });
        setIsCameraOpen(false);
        return;
      }
      const params = {
        Bucket: AWS_S3_BUCKET,
        Key: `hrjee_face_kyc/${employeeNumber}.jpg`,
        Body: buffer,
        ContentType: 'image/jpeg',
      };
      const uploadResponse = await s3.upload(params).promise();
      console.log('✅ Upload successful!', uploadResponse);
      return uploadResponse;
    } catch (error) {
      setIsCameraOpen(false);
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
          Name: face_kyc_img,
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
          showMessage({
            message: 'Keep Your Face front to the camera',
            type: 'danger',
            duration: 3000,
          });
          setIsCameraOpen(false);
        } else if (err.message === 'Request has invalid parameters') {
          setIsCameraOpen(false);
          showMessage({
            message: 'Keep Your Face front to the camera',
            type: 'danger',
            duration: 3000,
          });
        } else {
          showMessage({
            message: err.message,
            type: 'danger',
            duration: 3000,
          });
          setIsCameraOpen(false);
        }
      } else if (data?.UnmatchedFaces.length > 0) {
        showMessage({
          message: 'Employee face does not match the registered data',
          type: 'danger',
          duration: 4000,
        });
        setIsCameraOpen(false);
      } else {
        punchInFaceKyc(s3ObjectKey);
        punchIn();
        setIsCameraOpen(false);
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
      {isCameraOpen && (
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
          {isCameraOpen && (
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
          )}
        </RNCamera>
      )}
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

export default FaceCamera;
