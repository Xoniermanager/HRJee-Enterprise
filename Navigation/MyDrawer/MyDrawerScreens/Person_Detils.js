import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Button,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Modal from 'react-native-modal';
import {IconButton, MD3Colors} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from '../../../utils';

const Person_Detils = ({navigation}) => {
  const [cameramodal, setCameramodal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPath, setPhotoPath] = useState(null);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Marital Status');
  const [loading, setloading] = useState(false);

  const [Userdata, setUserdata] = useState({
    name: '',
    fathername: '',
    mothername: '',
    mobileno: '',
    blood: '',
  });

  // choose from front camera  for profile Images////////
  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    })
      .then(image => {
        setPhoto(image);
        setPhotoPath(image?.path);
        setCameramodal(!cameramodal);
        setModalVisible1(!modalVisible1);
      })
      .catch(err => {
        console.log(err);
      });
  };

  // choose from library for Profile  choosePhotoFromLibrary

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    })
      .then(image => {
        // setImage(image.path)
        // setMimez(image?.mime)
        setModalVisible1(!modalVisible1);
        setPhoto(image);
        setPhotoPath(image?.path);

        // setStore(`data:${image.mime};base64,${image.data}`)  //convert image base 64

        setCameramodal(!cameramodal);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    get_employee_detail();
  }, []);

  const get_employee_detail = async () => {
    setloading(true);
    const token = await AsyncStorage.getItem('token');
    let config = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    axios
      .get(`${BASE_URL}/profile`, config)
      .then(response => {
        if (response.data.status === true) {
          setloading(false);
          try {
            setUserdata(response?.data?.data);

            // var profilePath = response?.data?.data?.image;
            // setPhotoPath(profilePath);
            console.log('res----------', response.data);
          } catch (e) {
            setloading(false);
          }
        } else {
          console.log('error........', response);
          setloading(false);
        }
      })
      .catch(error => {
        console.log('error........', error?.response?.data);
        setloading(false);
      });
  };
  const UpdateProfile = async () => {
    setloading(true);

    const token = await AsyncStorage.getItem('Token');

    const formData = new FormData();
    formData.append('name', Userdata?.name);
    formData.append('email', Userdata?.email);
    formData.append('mobile_no', Userdata?.phone);
    formData.append('permanent_address', Userdata?.permanentAddress);
    if (photo) {
      // var photoFormData = ;
      formData.append('image', {
        uri: photo?.path,
        type: photo?.mime,
        name: photo?.modificationDate + '.' + 'jpg',
        // name: photo?.modificationDate
      });
    }

    fetch(`${apiUrl}/SecondPhaseApi/update_employee_data`, {
      method: 'POST',
      headers: {
        Token: token,
        Accept: 'application/json',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(response => {
        setloading(false);
        setModalVisible(!modalVisible);
        get_employee_detail();

        Popup.show({
          type: 'Success',
          title: 'Success',
          button: true,
          textBody: response?.msg,
          buttonText: 'Ok',
          callback: () => [Popup.hide()],
        });
      })
      .catch(err => {
        setloading(false);

        if (err.response.status == '401') {
        }
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{alignSelf: 'center', marginTop: 15}}>
        <Text style={styles.name}>Person Details</Text>
      </View>

      <ScrollView
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
          borderTopLeftRadius: 40,
          marginTop: responsiveHeight(3),
          borderTopRightRadius: 40,
        }}>
        <View style={{marginVertical: 10, alignSelf: 'center'}}>
          <>
            {photoPath ? (
              <Image
                source={{uri: photoPath}}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 150 / 2,
                  overflow: 'hidden',
                  borderWidth: 2,
                  borderColor: 'green',
                }}
              />
            ) : (
              <Image
                source={{uri: `https://i.postimg.cc/0y72NN2K/user.png`}}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 150 / 2,
                  overflow: 'hidden',
                  borderWidth: 2,
                  borderColor: 'green',
                }}
              />
            )}

            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: 'black',
                borderRadius: 30 / 2,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -40,
                marginLeft: 90,
              }}>
              <IconButton
                icon="camera"
                iconColor={MD3Colors.neutral100}
                size={20}
                onPress={() => setModalVisible1(true)}
              />
            </View>
          </>
        </View>

        {/* This is profile details */}
        <View
          style={{
            marginTop: responsiveHeight(1),
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            marginHorizontal: 10,
          }}>
          <View
            style={{
              borderRadius: 30,
              marginBottom: 8,
              padding: 5,
              backgroundColor: '#EDFBFE',
              opacity: 1,
              elevation: 10,
            }}>
            <TextInput
              placeholder="Name"
              onChangeText={text =>
                setUserdata({...Userdata, fatherName: text})
              }
              value={Userdata.name}
            />
          </View>
          <View
            style={{
              borderRadius: 30,
              marginBottom: 8,
              padding: 5,
              backgroundColor: '#EDFBFE',
              opacity: 1,
              elevation: 10,
            }}>
            <TextInput
              placeholder="Father Name"
              onChangeText={text =>
                setUserdata({...Userdata, fatherName: text})
              }
              value={Userdata.father_name}
            />
          </View>
          <View
            style={{
              borderRadius: 30,
              marginBottom: 8,
              padding: 5,
              backgroundColor: '#EDFBFE',
              opacity: 1,
              elevation: 10,
            }}>
            <TextInput
              placeholder="Mother Name"
              onChangeText={text =>
                setUserdata({...Userdata, fatherName: text})
              }
              value={Userdata.mother_name}
            />
          </View>
          <View
            style={{
              borderRadius: 30,
              marginBottom: 8,
              padding: 5,
              backgroundColor: '#EDFBFE',
              opacity: 1,
              elevation: 10,
            }}>
            <TextInput placeholder="Mobile Number" 
            onChangeText={text =>
              setUserdata({...Userdata, fatherName: text})
            }
            value={Userdata.phone}
            />
          </View>
          <View
            style={{
              borderRadius: 30,
              marginBottom: 8,
              padding: 5,
              backgroundColor: '#EDFBFE',
              opacity: 1,
              elevation: 10,
            }}>
            <Picker
              selectedValue={selectedStatus}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedStatus(itemValue)
              }
              style={styles.picker}>
              <Picker.Item label="Marital Status" value="Marital Status" />
              <Picker.Item label="Married" value="married" />
              <Picker.Item label="Divorced" value="divorced" />
              <Picker.Item label="Widowed" value="widowed" />
            </Picker>
          </View>
          <View
            style={{
              borderRadius: 30,
              marginBottom: 8,
              padding: 5,
              backgroundColor: '#EDFBFE',
              opacity: 1,
              elevation: 10,
            }}>
            <Picker
              selectedValue={selectedStatus}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedStatus(itemValue)
              }
              style={styles.picker}>
              <Picker.Item label="Blood" value="Blood" />
              <Picker.Item label="A" value="A" />
              <Picker.Item label="AB" value="AB" />
              <Picker.Item label="A+" value="A+" />
              <Picker.Item label="B+" value="B+" />
            </Picker>
          </View>
        </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible1}
            onRequestClose={() => {
              Alert.alert('screen has been closed.');
              setModalVisible1(!modalVisible1);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView1}>
                <View
                  style={{
                    marginVertical: responsiveHeight(2),
                    alignSelf: 'center',
                  }}>
                  <View style={{marginBottom: 10, alignItems: 'flex-end'}}>
                    <AntDesign
                      name="close"
                      size={22}
                      color="red"
                      onPress={() => setModalVisible1(!modalVisible1)}
                      // onPress={() => setModalVisible(!modalVisible)}
                    />
                  </View>
                  <View style={styles.takepic}>
                    <TouchableOpacity onPress={takePhotoFromCamera}>
                      <Text style={styles.takepictext}>PICK FROM CAMERA</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.takepic1}>
                    <TouchableOpacity onPress={choosePhotoFromLibrary}>
                      <Text style={styles.takepictext}>PICK FROM GALLERY</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        <TouchableOpacity onPress={()=> UpdateProfile()}
          style={{
            marginBottom: 5,
            backgroundColor: '#0433DA',
            padding: 18,
            width: '90%',
            alignSelf: 'center',
            borderRadius: 50,
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            Update
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Person_Detils;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E64',
  },

  name: {
    color: '#fff',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: responsiveHeight(0),
  },
  checkbox: {
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView1: {
    borderRadius: 15,
    shadowRadius: 4,
    backgroundColor: '#fff',
    elevation: 7,
    borderWidth: 1,
    borderColor: '#e2ddfe',
    width: responsiveWidth(55),
    height: responsiveHeight(25),
  },
  takepic: {
    width: 160,
    height: 40,
    backgroundColor: '#75CFC5',
    opacity: 3,
    elevation: 2,
    justifyContent: 'center',
    borderRadius: 8,
  },
  takepictext: {
    fontSize: 13,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  takepic1: {
    width: 160,
    height: 40,
    backgroundColor: '#75CFC5',
    opacity: 3,
    elevation: 2,
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    width: '100%',
    height: 50,
  },
});
