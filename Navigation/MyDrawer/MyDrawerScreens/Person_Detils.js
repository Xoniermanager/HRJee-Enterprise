import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { BASE_URL } from '../../../utils';
import { getProfile } from '../../../APINetwork/ComponentApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import {
  responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import Reload from '../../../Reload';


const Person_Details = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [getProfileApiData, setGetProfileApiData] = useState('');
  const [formData, setFormData] = useState({
    fatherName: '',
    motherName: '',
    dOB: '',
    status: '',
    gender: '',
    bloodGroup: '',
    number: ''
  });
  useEffect(() => {
    async function check() {
      try {
        setLoader(true);
        let token = await AsyncStorage.getItem('TOKEN');
        const url = `${BASE_URL}/profile`;
        const response = await getProfile(url, token);

        if (response?.data?.status === true) {
          showMessage({
            message: `${response?.data?.message}`,
            type: "success",
          });

          const { father_name, mother_name, date_of_birth, gender, blood_group, phone } = response?.data?.data;

          setGetProfileApiData(response?.data?.data);
          setFormData({
            fatherName: father_name,
            motherName: mother_name,
            dOB: date_of_birth,
            status: gender,
            bloodGroup: blood_group,
            number: phone,
            gender: gender
          });

          setLoader(false);
        } else {
          setLoader(false);
        }
      } catch (error) {
        console.error('Error making POST request:', error);
        setLoader(false);
      }
    }
    check();
  }, []);



  // const updateProfile = async () => {
  //   try {
  //     setLoader(true);
  //     let token = await AsyncStorage.getItem('TOKEN');
  //     console.log("token-------", token)
  //     const url = 'https://hrjee-v2.xonierconnect.com/api/update/profile';
  //     const response = await axios.post(url, formData, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (response?.data?.status == true) {
  //       showMessage({
  //         message: `${response?.data?.message}`,
  //         type: "success",
  //       });
  //     } else {
  //       showMessage({
  //         message: 'Update failed!',
  //         type: "danger",
  //       });
  //     }
  //     setLoader(false);
  //   } catch (error) {
  //     console.error('Error updating profile:', error?.response?.data);
  //     showMessage({
  //       message: 'An error occurred while updating the profile.',
  //       type: "danger",
  //     });
  //     setLoader(false);
  //   }
  // };

  const updateProfile = async () => {
    setLoader(true);

    const token = await AsyncStorage.getItem('TOKEN');

    const Data = new FormData();
    Data.append('name', getProfileApiData?.name);
    Data.append('father_name', formData?.fatherName);
    Data.append('mother_name', formData?.motherName);
    Data.append('blood_group', formData?.bloodGroup);
    Data.append('gender', formData?.gender);
    Data.append('marital_status', formData?.status);
    Data.append('phone', formData?.number);
    Data.append('date_of_birth', formData?.dOB);
    fetch(`${BASE_URL}/update/profile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // make sure content-type is set
      },
      body: Data,
    })
      .then(response => response.json())
      .then(response => {
        if (response?.status == true) {
          showMessage({
            message: `${response?.message}`,
            type: "success",
          });
          navigation.goBack()
          setLoader(false);

        }
        else {
          showMessage({
            message: `${response?.message}`,
            type: "success",
          });
          setLoader(false);

        }
      })
      .catch(error => {
        console.log("res++++++++++2", error)
        setLoader(false);
        if (error.response) {
          // Server-side error
          let message = 'Server error, please try again';

          if (Array.isArray(error.response.data.message)) {
            // If the message is an array, join its elements into a string
            message = error.response.data.message.join(', ');
          } else if (typeof error.response.data.message === 'object') {
            // If the message is an object, extract and join its values into a string
            message = Object.values(error.response.data.message).flat().join(', ');
          } else if (typeof error.response.data.message === 'string') {
            // If the message is a string, use it directly
            message = error.response.data.message;
          }

          showMessage({
            message: message,
            type: "danger",
          });
        } else if (error.request) {
          // Network error
          showMessage({
            message: 'Network error, please check your connection.',
            type: "danger",
          });
        } else {
          // Other errors
          showMessage({
            message: 'An unexpected error occurred.',
            type: "danger",
          });
        }
      });

    // const FormData = require('form-data');
    // let data = new FormData();
    // data.append('name', 'fdfdf');
    // data.append('father_name', 'password');
    // data.append('mother_name', 'password');
    // data.append('blood_group', 'A+');
    // data.append('gender', 'M');
    // data.append('marital_status', 'M');
    // data.append('phone', '3465433435');
    // data.append('date_of_birth', '1990-07-09');

    // let config = {
    //   method: 'post',
    //   maxBodyLength: Infinity,
    //   url: 'https://hrjee-v2.xonierconnect.com/api/update/profile',
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //     'Authorization': `Bearer ${token}`,
    //   },
    //   data: data
    // };

    // axios.request(config)
    //   .then((response) => {
    //     console.log(JSON.stringify(response.data));
    //   })
    //   .catch((error) => {
    //     console.log(error?.response?.data);
    //   });

  }


  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  if (!getProfileApiData) {
    return <Reload />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop: 0 }}>
        <View style={{ marginTop: 20, alignSelf: "center" }}>
          <Text style={{
            color: '#fff',
            fontSize: responsiveFontSize(3),
            textAlign: "center",
          }}>Person Details</Text>
        </View>
      </View>
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
          borderTopLeftRadius: 40,
          marginTop: responsiveHeight(2),
          borderTopRightRadius: 40,
        }}>
        <Image
          source={{ uri: 'https://i.postimg.cc/L69jybXV/512.png' }} // Replace with the actual image URL
          style={styles.profileImage}
        />
        <Text style={styles.name}>{getProfileApiData?.name}</Text>
        <Text style={styles.email}>{getProfileApiData?.email}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Father's Name"
            value={formData.fatherName}
            onChangeText={(value) => handleChange('fatherName', value)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mother's Name"
            value={formData.motherName}
            onChangeText={(value) => handleChange('motherName', value)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="DOB"
            value={formData.dOB}
            onChangeText={(value) => handleChange('dOB', value)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Marital Status"
            value={formData.status}
            onChangeText={(value) => handleChange('status', value)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Gender"
            value={formData.gender}
            onChangeText={(value) => handleChange('gender', value)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Blood Group"
            value={formData.bloodGroup}
            onChangeText={(value) => handleChange('bloodGroup', value)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Number"
            value={formData.number}
            onChangeText={(value) => handleChange('number', value)}
          />
        </View>
        <TouchableOpacity onPress={() => updateProfile()} style={styles.updateButton}>
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Person_Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E64',
  },
  name: {
    color: '#000',
    fontSize: responsiveFontSize(2),
    textAlign: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  input: {
    flex: 3,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: responsiveWidth(5),
    backgroundColor: "#e0f7fa",
  },
  updateButton: {
    backgroundColor: '#0E0E64',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 20,
    marginHorizontal: responsiveWidth(5),
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
});
