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
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import { BASE_URL } from '../../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Address = ({navigation}) => {
  const [cameramodal, setCameramodal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPath, setPhotoPath] = useState(null);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [name, setname] = useState('');
  const [fathername, setFatherName] = useState('');
  const [mothername, setMotherName] = useState('');
  const [mobileno, setMobileNo] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [blood, setBlood] = useState('');

  const [Userdata, setUserdata] = useState({
    name: '',
    fathername: '',
    mothername: '',
    mobileno: '',
    blood: ''
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

useEffect(()=>{
  get_employee_detail()
},[])

  const get_employee_detail = async () => {
    alert('hiiijhbhb')
    setloading(true);
    const token = await AsyncStorage.getItem('token');
    console.log("dsdgdf", token)

    const config = {
      headers: {Token: token},
    };

    axios
      .post(`${BASE_URL}/profile`, config)
      .then(response => {
        if (response.data.status === 200) {
          setloading(false);
          try {
            // setUserdata({
              
            // });

            // var profilePath = response?.data?.data?.image;
            // setPhotoPath(profilePath);
            console.log("res----------", response.data)
          } catch (e) {
            setloading(false);
          }
        } else {
          setloading(false);
        }
      })
      .catch(error => {
        setloading(false);
      });
  };
  const UpdateProfile = async () => {
    setloading(true);

    const token = await AsyncStorage.getItem('Token');

    const formData = new FormData();
    formData.append('father_name', Userdata?.fatherName);
    formData.append('dob', dateTxt?.txt1);
    formData.append('SEX', Userdata?.gender);
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
        <Text style={styles.name}>Address Detils</Text>
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
        {/* This is profile details */}
        <View
          style={{
            backgroundColor: '#fff',
            padding: 5,
            elevation: 7,
            opacity: 1,
            marginHorizontal: 10,
            marginVertical: 10,
            marginTop: 20,
            borderRadius: 20,
          }}>
          <View
            style={{
              marginTop: responsiveHeight(1),
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              marginHorizontal: 10,
            }}>
            <Text style={{color: '#000', fontSize: 18, marginBottom: 10}}>
              Address
            </Text>
            <View
              style={{
                borderRadius: 30,
                marginBottom: 8,
                padding: 5,
                backgroundColor: '#EDFBFE',
                opacity: 1,
                elevation: 10,
              }}>
              <TextInput placeholder="Mobile No" />
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
                <Picker.Item label="Country" value="Country" />
                <Picker.Item label="Married" value="married" />
                <Picker.Item label="Divorced" value="divorced" />
                <Picker.Item label="Widowed" value="widowed" />
              </Picker>
            </View>
          </View>
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
              <Picker
                selectedValue={selectedStatus}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedStatus(itemValue)
                }
                style={styles.picker}>
                <Picker.Item label="State" value="State" />
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
                <Picker.Item label="City" value="City" />
                <Picker.Item label="Married" value="married" />
                <Picker.Item label="Divorced" value="divorced" />
                <Picker.Item label="Widowed" value="widowed" />
              </Picker>
            </View>
          </View>
        </View>

        <TouchableOpacity
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
export default Address;
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
