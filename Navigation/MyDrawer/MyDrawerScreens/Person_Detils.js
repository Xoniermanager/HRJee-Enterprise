// import { View, Text, Modal, TextInput, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
// import React, { useState, useEffect } from 'react'
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import axios from 'axios';
// import { BASE_URL } from '../../../utils';
// import { getProfile } from '../../../APINetwork/ComponentApi';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { showMessage } from "react-native-flash-message";
// import {
//   responsiveFontSize, responsiveHeight, responsiveWidth
// } from 'react-native-responsive-dimensions';
// import Reload from '../../../Reload';
// import ProfileDetails from '../../../Component/Skeleton/ProfileDetails';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import { IconButton, MD3Colors } from 'react-native-paper';
// import ImagePicker from 'react-native-image-crop-picker';
// import Themes from '../../../Component/Theme/Theme';
// import RNPickerSelect from 'react-native-picker-select';

// const Person_Details = ({ navigation }) => {
//   const [loader, setLoader] = useState(false);
//   const [getProfileApiData, setGetProfileApiData] = useState('');
//   const [show, setShow] = useState(false)
//   const [formData, setFormData] = useState({
//     name: '',
//     fatherName: '',
//     motherName: '',
//     dOB: '',
//     status: '',
//     gender: '',
//     bloodGroup: '',
//     number: ''
//   });

//   const handleChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   const [modalVisible1, setModalVisible1] = useState(false);
//   const [image, setImage] = useState('')
//   const [mimez, setMimez] = useState(false)
//   const [cameramodal, setCameramodal] = useState(false);
//   const [photo, setPhoto] = useState(null);
//   const [photoPath, setPhotoPath] = useState(null);

//   // choose from front camera  for profile Images////////

//   const takePhotoFromCamera = () => {
//     ImagePicker.openCamera({
//       width: 300,
//       height: 400,
//       cropping: true,
//       includeBase64: true,
//     }).then(image => {
//       setPhoto(image);
//       setPhotoPath(image?.path);
//       setCameramodal(!cameramodal);
//       setModalVisible1(!modalVisible1);
//     }).catch((err) => { console.log(err); })
//   }

//   // choose from library for Profile  choosePhotoFromLibrary

//   const choosePhotoFromLibrary = () => {
//     ImagePicker.openPicker({
//       width: 300,
//       height: 400,
//       cropping: true,
//       includeBase64: true,

//     }).then(image => {
//       setModalVisible1(!modalVisible1);
//       setPhoto(image);
//       setPhotoPath(image?.path);
//       setCameramodal(!cameramodal);
//     }).catch((err) => { console.log(err); });
//   }

//   const handleItemPress = item => {
//     setModalVisible(!modalVisible);
//     setshow(item);
//     setActiveItem(item);
//   };

//   useEffect(() => {
//     getPersonDetails()
//   }, []);

//   const getPersonDetails = async () => {
//     setLoader(true);
//     try {
//       let token = await AsyncStorage.getItem('TOKEN');
//       const url = `${BASE_URL}/profile`;
//       const response = await getProfile(url, token);

//       if (response?.data?.status === true) {
//         setLoader(false);
//         showMessage({
//           message: `${response?.data?.message}`,
//           type: "success",
//         });

//         const { name, father_name, mother_name, date_of_birth, gender, blood_group, phone, marital_status } = response?.data?.data;
//         setFormData({
//           name: name,
//           fatherName: father_name,
//           motherName: mother_name,
//           dOB: date_of_birth,
//           status: marital_status,
//           bloodGroup: blood_group,
//           number: phone,
//           gender: gender
//         });
//         setGetProfileApiData(response?.data?.data);

//       } else {
//         setLoader(false);
//       }
//     } catch (error) {
//       console.error('Error making POST request:', error);
//       setLoader(false);
//     }
//   }

//   const updateProfile = async () => {
//     const token = await AsyncStorage.getItem('TOKEN');
//     const FormData = require('form-data');
//     let data = new FormData();
//     data.append('name', formData?.name);
//     data.append('father_name', formData?.fatherName);
//     data.append('mother_name', formData?.motherName);
//     data.append('blood_group', formData?.bloodGroup);
//     data.append('gender', formData?.gender);
//     data.append('marital_status', formData?.status);
//     data.append('phone', formData?.number);
//     data.append('date_of_birth', formData?.dOB);
//     let config = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: 'https://hrjee-v2.xonierconnect.com/api/update/profile',
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         'Authorization': `Bearer ${token}`,
//       },
//       data: data
//     };
//     axios.request(config)
//       .then((response) => {
//         showMessage({
//           message: `${response?.data?.message}`,
//           type: "success",
//         });
//         // navigation.goBack();
//         getPersonDetails();
//       })
//       .catch((error) => {
//         showMessage({
//           message: `${error?.response?.data}`,
//           type: "danger",
//         });
//       });
//   }

//   // Dropdown options
//   const genderOptions = [
//     { label: 'Male', value: 'M' },
//     { label: 'Female', value: 'F' },
//     { label: 'Other', value: 'O' }
//   ];

//   const maritalStatusOptions = [
//     { label: 'Single', value: 'S' },
//     { label: 'Married', value: 'M' },
//   ];

//   const bloodGroupOptions = [
//     { label: 'A+', value: 'A+' },
//     { label: 'A-', value: 'A-' },
//     { label: 'B+', value: 'B+' },
//     { label: 'B-', value: 'B-' },
//     { label: 'O+', value: 'O+' },
//     { label: 'O-', value: 'O-' }
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={{ marginTop: 0 }}>
//         <View style={{ marginTop: 20, alignSelf: "center" }}>
//           <Text style={{
//             color: '#fff',
//             fontSize: responsiveFontSize(3),
//             textAlign: "center",
//           }}>Person Details</Text>
//         </View>
//       </View>
//       <View
//         style={{
//           width: '100%',
//           height: '100%',
//           backgroundColor: '#fff',
//           borderTopLeftRadius: 40,
//           marginTop: responsiveHeight(2),
//           borderTopRightRadius: 40
//         }}>
//         {
//           loader ? <ProfileDetails />
//             :
//             <>
//               <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                 <View style={{
//                   position: 'relative',
//                 }} >
//                   <View style={{
//                     width: 100,
//                     height: 100,
//                     borderRadius: 50, borderWidth: 2, borderColor: "#0E0E64", marginBottom: 5
//                   }}>
//                     <>
//                       {
//                         photoPath ?
//                           <Image
//                             source={{ uri: photoPath }}
//                             style={styles.profileImage}
//                           />
//                           :
//                           <Image
//                             source={{ uri: getProfileApiData?.profile_image == null || getProfileApiData?.profile_image == "" ? `https://i.postimg.cc/0y72NN2K/user.png` : getProfileApiData?.profile_image }}
//                             style={styles.profileImage}
//                           />
//                       }

//                     </>
//                   </View>
//                   <View style={{ position: 'absolute', right: 5, bottom: 7, }}>
//                     <View style={{ width: 30, marginTop: -60, height: 30, backgroundColor: 'black', borderRadius: 30 / 2, justifyContent: 'center', alignItems: 'center' }}>
//                       <IconButton
//                         icon="camera"
//                         iconColor={MD3Colors.neutral100}
//                         size={20}
//                         onPress={() => setModalVisible1(!modalVisible1)}
//                       />
//                     </View>
//                   </View>
//                 </View>
//               </View>
//               <View style={styles.body}>
//                 <TextInput
//                   style={styles.textinput}
//                   placeholder="Full Name"
//                   value={formData?.name}
//                   onChangeText={(text) => handleChange('name', text)}
//                 />
//                 <TextInput
//                   style={styles.textinput}
//                   placeholder="Father Name"
//                   value={formData?.fatherName}
//                   onChangeText={(text) => handleChange('fatherName', text)}
//                 />
//                 <TextInput
//                   style={styles.textinput}
//                   placeholder="Mother Name"
//                   value={formData?.motherName}
//                   onChangeText={(text) => handleChange('motherName', text)}
//                 />
//                 <TextInput
//                   style={styles.textinput}
//                   placeholder="Date Of Birth"
//                   value={formData?.dOB}
//                   onChangeText={(text) => handleChange('dOB', text)}
//                 />
//                 <RNPickerSelect
//                   placeholder={{ label: 'Select Gender', value: null }}
//                   items={genderOptions}
//                   onValueChange={(value) => handleChange('gender', value)}
//                   value={formData?.gender}
//                   style={pickerSelectStyles}
//                 />
//                 <RNPickerSelect
//                   placeholder={{ label: 'Select Marital Status', value: null }}
//                   items={maritalStatusOptions}
//                   onValueChange={(value) => handleChange('status', value)}
//                   value={formData?.status}
//                   style={pickerSelectStyles}
//                 />
//                 <RNPickerSelect
//                   placeholder={{ label: 'Select Blood Group', value: null }}
//                   items={bloodGroupOptions}
//                   onValueChange={(value) => handleChange('bloodGroup', value)}
//                   value={formData?.bloodGroup}
//                   style={pickerSelectStyles}
//                 />
//                 <TextInput
//                   style={styles.textinput}
//                   placeholder="Phone Number"
//                   value={formData?.number}
//                   onChangeText={(text) => handleChange('number', text)}
//                 />
//                 <TouchableOpacity onPress={() => updateProfile()} style={styles.updateButton}>
//                   <Text style={styles.updateButtonText}>Update Profile</Text>
//                 </TouchableOpacity>
//               </View>
//             </>
//         }
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0E0E64',
//   },
//   body: {
//     padding: 20,
//     marginTop: 10,
//   },
//   textinput: {
//     height: 50,
//     backgroundColor: '#F5F5F5',
//     marginVertical: 10,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#DCDCDC',
//   },
//   profileImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 50,
//   },
//   updateButton: {
//     backgroundColor: '#0E0E64',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     // marginTop: 20,
//   },
//   updateButtonText: {
//     color: '#fff',
//     fontSize: responsiveFontSize(2),
//   }
// });

// // RNPickerSelect styles
// const pickerSelectStyles = StyleSheet.create({
//   inputIOS: {
//     fontSize: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderWidth: 1,
//     borderColor: '#DCDCDC',
//     borderRadius: 4,
//     color: 'black',
//     paddingRight: 30, // to ensure the text is not cut off
//   },
//   inputAndroid: {
//     fontSize: 16,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderWidth: 1,
//     borderColor: '#DCDCDC',
//     borderRadius: 8,
//     color: 'black',
//     paddingRight: 30, // to ensure the text is not cut off
//   },
// });

// export default Person_Details;



import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, Image, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
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
import ProfileDetails from '../../../Component/Skeleton/ProfileDetails';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { IconButton, MD3Colors } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import Themes from '../../../Component/Theme/Theme';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker

const Person_Details = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [getProfileApiData, setGetProfileApiData] = useState('');
  const [show, setShow] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    dOB: '',
    status: '',
    gender: '',
    bloodGroup: '',
    number: ''
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const [modalVisible1, setModalVisible1] = useState(false);
  const [image, setImage] = useState('')
  const [mimez, setMimez] = useState(false)
  const [cameramodal, setCameramodal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPath, setPhotoPath] = useState(null);

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Date picker change handler
  const onDateChange = (event, date) => {
    const selectedDate = date || selectedDate;
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(selectedDate);
    handleChange('dOB', selectedDate.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
  };

  useEffect(() => {
    getPersonDetails()
  }, []);

  const getPersonDetails = async () => {
    setLoader(true);
    try {
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/profile`;
      const response = await getProfile(url, token);

      if (response?.data?.status === true) {
        setLoader(false);
        showMessage({
          message: `${response?.data?.message}`,
          type: "success",
        });

        const { name, father_name, mother_name, date_of_birth, gender, blood_group, phone, marital_status } = response?.data?.data;
        setFormData({
          name: name,
          fatherName: father_name,
          motherName: mother_name,
          dOB: date_of_birth,
          status: marital_status,
          bloodGroup: blood_group,
          number: phone,
          gender: gender
        });
        setGetProfileApiData(response?.data?.data);

      } else {
        setLoader(false);
      }
    } catch (error) {
      console.error('Error making POST request:', error);
      setLoader(false);
    }
  }

  const updateProfile = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const FormData = require('form-data');
    let data = new FormData();
    data.append('name', formData?.name);
    data.append('father_name', formData?.fatherName);
    data.append('mother_name', formData?.motherName);
    data.append('blood_group', formData?.bloodGroup);
    data.append('gender', formData?.gender);
    data.append('marital_status', formData?.status);
    data.append('phone', formData?.number);
    data.append('date_of_birth', formData?.dOB);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://hrjee-v2.xonierconnect.com/api/update/profile',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
      data: data
    };
    console.log("payload update--------", data)
    axios.request(config)
      .then((response) => {
        showMessage({
          message: `${response?.data?.message}`,
          type: "success",
        });
        // navigation.goBack();
        getPersonDetails();
      })
      .catch((error) => {
        showMessage({
          message: `${error?.response?.data?.message}`,
          type: "danger",
        });
      });
  }

  // Dropdown options
  const genderOptions = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' }
  ];

  const maritalStatusOptions = [
    { label: 'Single', value: 'S' },
    { label: 'Married', value: 'M' },
  ];

  const bloodGroupOptions = [
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' }
  ];

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
          borderTopRightRadius: 40
        }}>
        {
          loader ? <ProfileDetails />
            :
            <>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View style={{
                  position: 'relative', marginTop: 10
                }} >
                  <View style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50, borderWidth: 2, borderColor: "#0E0E64", marginBottom: 5
                  }}>
                    <>
                      {
                        photoPath ?
                          <Image
                            source={{ uri: photoPath }}
                            style={styles.profileImage}
                          />
                          :
                          <Image
                            source={{ uri: getProfileApiData?.profile_image == null || getProfileApiData?.profile_image == "" ? `https://i.postimg.cc/0y72NN2K/user.png` : getProfileApiData?.profile_image }}
                            style={styles.profileImage}
                          />
                      }

                    </>
                  </View>
                  <View style={{ position: 'absolute', right: 5, bottom: 7 }}>
                    <View style={{ width: 30, marginTop: -60, height: 30, backgroundColor: 'black', borderRadius: 30 / 2, justifyContent: 'center', alignItems: 'center' }}>
                      <IconButton
                        icon="camera"
                        iconColor={MD3Colors.neutral100}
                        size={20}
                        onPress={() => setModalVisible1(!modalVisible1)}
                      />
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    {show ? <TextInput
                      style={styles.name}
                      placeholder="Your name"
                      value={formData.name}
                      onChangeText={(value) => handleChange('name', value)}
                    /> : <Text style={[styles.name, styles.nameedit]}>{formData.name}</Text>}
                    <TouchableOpacity onPress={() => setShow(!show)}>
                      <AntDesign style={{}} name="edit" size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.email}>{getProfileApiData?.email}</Text>
              </View>

              <View style={styles.body}>
                <TextInput
                  style={styles.textinput}
                  placeholder="Father Name"
                  value={formData?.fatherName}
                  onChangeText={(text) => handleChange('fatherName', text)}
                />
                <TextInput
                  style={styles.textinput}
                  placeholder="Mother Name"
                  value={formData?.motherName}
                  onChangeText={(text) => handleChange('motherName', text)}
                />
                <TouchableOpacity
                  style={[styles.textinputdob]}
                  onPress={() => setShowDatePicker(true)} // Show date picker on press
                >
                  <Text style={{ color: '#333' }}>
                    {formData?.dOB ? formData?.dOB : 'Date Of Birth'}
                  </Text>
                  <Image style={{ height: 20, width: 20 }} source={require('../../../assets/Attendence/dates.png')} />

                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={selectedDate}
                    mode='date'
                    display="default"
                    onChange={onDateChange}
                  />
                )}
                <RNPickerSelect
                  placeholder={{ label: 'Select Gender', value: null }}
                  items={genderOptions}
                  onValueChange={(value) => handleChange('gender', value)}
                  value={formData?.gender}
                  style={pickerSelectStyles}
                />
                <RNPickerSelect
                  placeholder={{ label: 'Select Marital Status', value: null }}
                  items={maritalStatusOptions}
                  onValueChange={(value) => handleChange('status', value)}
                  value={formData?.status}
                  style={pickerSelectStyles}
                />
                <RNPickerSelect
                  placeholder={{ label: 'Select Blood Group', value: null }}
                  items={bloodGroupOptions}
                  onValueChange={(value) => handleChange('bloodGroup', value)}
                  value={formData?.bloodGroup}
                  style={pickerSelectStyles}
                />
                <TextInput
                  style={styles.textinput}
                  placeholder="Phone Number"
                  value={formData?.number}
                  onChangeText={(text) => handleChange('number', text)}
                />
                <TouchableOpacity onPress={() => updateProfile()} style={styles.updateButton}>
                  <Text style={styles.updateButtonText}>Update Profile</Text>
                </TouchableOpacity>
              </View>
            </>
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E64',
  },
  body: {
    padding: 0, marginHorizontal: 15
  },
  textinput: {
    height: 50,
    backgroundColor: '#e0f7fa',
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DCDCDC',
  },
  textinputdob: {
    flexDirection:"row", alignItems:"center", justifyContent:"space-between",
    height: 50,
    backgroundColor: '#e0f7fa',
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DCDCDC',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  updateButton: {
    backgroundColor: '#0E0E64',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    // marginTop: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
  }
});

// RNPickerSelect styles
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is not cut off
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    marginBottom:12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 8,
    backgroundColor: '#e0f7fa',
    color: 'black',
    paddingRight: 30, // to ensure the text is not cut off
  },

});

export default Person_Details;
