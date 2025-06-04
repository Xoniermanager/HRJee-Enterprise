import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Pressable,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getProfile} from '../../../APINetwork/ComponentApi';
import {BASE_URL} from '../../../utils';
import CheckBox from 'react-native-check-box';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/native';
const Person_Detils = () => {
  const navigation = useNavigation();
  const {currentTheme} = useContext(ThemeContext);
  const [loader, setLoader] = useState(false);
  const [isFromDatePickerVisible, setFromDatePickerVisibility] =
    useState(false);
  const [isMale, setIsMale] = useState(false);
  const [isFemale, setIsFemale] = useState(false);
  const [other, setOther] = useState(false);
  const [married, setMarried] = useState(false);
  const [single, setSingle] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [details, setDetails] = useState({
    name: '',
    email: '',
    father_name: '',
    mother_name: '',
    marital_status: '',
    blood_group: '',
    phone: '',
    gender: '',
    profile_image: '',
  });
  const [fromDate, setFromDate] = useState(null);
  const [image, setImage] = useState();
  const handleInputChange = (key, value) => {
    setDetails(prev => ({...prev, [key]: value}));
  };
  const handleGenderChange = gender => {
    console.log(gender, 'gender');
    setDetails(prev => ({...prev, gender}));
    if (gender === 'M') {
      setIsMale(true);
      setIsFemale(false);
      setOther(false);
    } else if (gender === 'F') {
      setIsMale(false);
      setIsFemale(true);
      setOther(false);
    } else if (gender === 'O') {
      setIsMale(false);
      setIsFemale(false);
      setOther(true);
    }
  };
  const handleMerridChange = marital_status => {
    setDetails(prev => ({...prev, marital_status}));
    if (marital_status === 'M') {
      setMarried(true);
      setSingle(false);
    } else if (marital_status === 'S') {
      setMarried(false);
      setSingle(true);
    }
  };
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSelect = group => {
    setSelectedGroup(group);
  };

  const showFromDatePicker = () => setFromDatePickerVisibility(true);
  const hideFromDatePicker = () => setFromDatePickerVisibility(false);

  const handleFromDateConfirm = date_of_birth => {
    setFromDate(date_of_birth);
    hideFromDatePicker();
  };
  var Start_date = fromDate;
  console.log(Start_date);
  var dd = String(Start_date?.getDate()).padStart(2, '0');
  var mm = String(Start_date?.getMonth() + 1).padStart(2, '0');
  var yyyy = Start_date?.getFullYear();
  Start_date = yyyy + '-' + mm + '-' + dd;
  async function check() {
    try {
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/profile/details`;
      const response = await getProfile(url, token);
      if (response?.data?.status === true) {
        setDetails({
          name: response.data.data.name,
          email: response.data.data.email,
          father_name: response.data.data.details.father_name,
          mother_name: response.data.data.details.mother_name,
          blood_group: response.data.data.details.blood_group,
          phone: response.data.data.details.phone,
          profile_image: response.data.data.details.profile_image,
          date_of_birth: response.data.data.details.date_of_birth,
        });
        setSelectedGroup(response.data.data.details.blood_group);
        handleGenderChange(response.data.data.details.gender);
        handleMerridChange(response.data.data.details.marital_status);
      } else {
      }
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  }
  useEffect(() => {
    check();
  }, []);

  const Update_Profile = async () => {
    setLoader(true);
    const token = await AsyncStorage.getItem('TOKEN');
    let data = new FormData();
    data.append('father_name', details.father_name);
    data.append('mother_name', details?.mother_name);
    data.append('blood_group', selectedGroup);
    data.append('gender', details.gender);
    data.append('marital_status', details.marital_status);
    data.append('phone', details.phone);
    if (image && image.path && image.mime && image.modificationDate) {
      var imagepath = {
        uri: image.path,
        type: image.mime,
        name: `${image.modificationDate}.jpg`,
      };
      data.append('profile_image', imagepath);
    }
    data.append(
      'date_of_birth',
      Start_date != 'undefined-NaN-undefined'
        ? Start_date
        : details.date_of_birth,
    );
    data.append('name', details.name);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/update/profile`,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
    axios
      .request(config)
      .then(response => {
        setLoader(false);
        showMessage({
          message: response.data.message,
          type: 'success',
        });
        check();
        navigation.goBack();
      })
      .catch(error => {
        setLoader(false);
        console.log(error.response.data);
        if (error.response?.data?.message) {
          const errorMessages = Object.values(error.response.data.message);
          if (errorMessages.length > 0) {
            showMessage({
              message: errorMessages[0][0], // Display the first error message
              type: 'danger',
            });
          }
        }
      });
  };
  const handleImagePick = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage(image);
    });
  };
  const profileImageUri =
    image?.path ||
    (details?.profile_image === 'https://hrjee-dev.xonierconnect.com/storage'
      ? 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
      : details?.profile_image);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
      <View
        style={[
          styles.headerContainer,
          {backgroundColor: currentTheme.background_v2},
        ]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Basic Details</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginBottom: responsiveHeight(10),
            backgroundColor: currentTheme.background,
            borderTopLeftRadius: 40,
            marginTop: responsiveHeight(3),
            borderTopRightRadius: 40,
            padding: 20,
          }}>
         <View
      style={[
        styles.profileSection,
        {
          borderColor: currentTheme.text,
          shadowColor: currentTheme.text,
        },
      ]}>
      <Image
        source={{uri: profileImageUri}}
        style={styles.profileImage}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleImagePick}>
        <MaterialIcons name="add-a-photo" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
          <View
            style={[
              styles.inputContainer,
              {backgroundColor: currentTheme.inputText_color},
            ]}>
            <TextInput
              style={[styles.textInput, {color: currentTheme.text}]}
              placeholder="Name"
              placeholderTextColor={currentTheme.text}
              value={details.name}
              onChangeText={value => handleInputChange('name', value)}
            />
          </View>
          <View
            style={[
              styles.inputContainer,
              {backgroundColor: currentTheme.inputText_color},
            ]}>
            <TextInput
              style={[styles.textInput, {color: currentTheme.text}]}
              placeholder="Father's Name"
              placeholderTextColor={currentTheme.text}
              value={details.father_name}
              onChangeText={value => handleInputChange('father_name', value)}
            />
          </View>

          <View
            style={[
              styles.inputContainer,
              {backgroundColor: currentTheme.inputText_color},
            ]}>
            <TextInput
              style={[styles.textInput, {color: currentTheme.text}]}
              placeholder="Mother's Name"
              placeholderTextColor={currentTheme.text}
              value={details.mother_name}
              onChangeText={value => handleInputChange('mother_name', value)}
            />
          </View>
          <View
            style={[
              styles.inputContainer,
              {backgroundColor: currentTheme.inputText_color},
            ]}>
            <TextInput
              style={[styles.textInput, {color: currentTheme.text}]}
              placeholder="Phone Number"
              placeholderTextColor={currentTheme.text}
              keyboardType="phone-pad"
              value={details.phone}
              onChangeText={value => handleInputChange('phone', value)}
            />
          </View>
          <Text style={[styles.label, {color: currentTheme.text}]}>
             Blood Group
          </Text>
          <FlatList
            data={bloodGroups}
            keyExtractor={item => item}
            numColumns={4}
            contentContainerStyle={styles.listContainer}
            renderItem={({item}) => {
              const isSelected = item === selectedGroup;
              return (
                <Pressable
                  onPress={() => handleSelect(item)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected
                        ? currentTheme.primary
                        : currentTheme.card,
                      borderColor: isSelected ? 'green' : currentTheme.border,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.chipText,
                      {color: isSelected ? 'green' : currentTheme.text},
                    ]}>
                    {item}
                  </Text>
                </Pressable>
              );
            }}
          />
            <Text style={[styles.label, {color: currentTheme.text}]}>
             Marital Status
          </Text>
          <View
            style={[
              styles.checkboxContainer,
              {backgroundColor: currentTheme.inputText_color},
            ]}>
              
            <CheckBox
              isChecked={single}
              onClick={() => handleMerridChange('S')}
              rightText="Single"
              rightTextStyle={[styles.checkboxText, {color: currentTheme.text}]}
              checkBoxColor={currentTheme.text}
            />
            <CheckBox
              isChecked={married}
              onClick={() => handleMerridChange('M')}
              rightText="Married"
              rightTextStyle={[styles.checkboxText, {color: currentTheme.text}]}
              checkBoxColor={currentTheme.text}
            />
          </View>
          <Text style={[styles.label, {color: currentTheme.text}]}>
             Gender
          </Text>
          <View
            style={[
              styles.checkboxContainer,
              {backgroundColor: currentTheme.inputText_color},
            ]}>
            <CheckBox
              isChecked={isMale}
              onClick={() => handleGenderChange('M')}
              rightText="Male"
              rightTextStyle={[styles.checkboxText, {color: currentTheme.text}]}
              checkBoxColor={currentTheme.text}
            />
            <CheckBox
              isChecked={isFemale}
              onClick={() => handleGenderChange('F')}
              rightText="Female"
              rightTextStyle={[styles.checkboxText, {color: currentTheme.text}]}
              checkBoxColor={currentTheme.text}
            />
            <CheckBox
              isChecked={other}
              onClick={() => handleGenderChange('O')}
              rightText="Other"
              rightTextStyle={[styles.checkboxText, {color: currentTheme.text}]}
              checkBoxColor={currentTheme.text}
            />
          </View>
          <Text style={[styles.label, {color: currentTheme.text}]}>
             D.O.B
          </Text>
          <TouchableOpacity
            onPress={showFromDatePicker}
            style={[
              styles.checkboxContainer,
              {
                backgroundColor: currentTheme.inputText_color,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            ]}>
            <Text
              style={{
                fontSize: 16,
                marginHorizontal: 20,
                color: currentTheme.text,
              }}>
              {Start_date != 'undefined-NaN-undefined'
                ? Start_date
                : details?.date_of_birth}
            </Text>
            <Image
              style={{
                height: 20,
                width: 20,
                tintColor: currentTheme.text,
              }}
              source={require('../../../assets/Attendence/dates.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Update_Profile()}
            style={[
              styles.updateButton,
              {backgroundColor: currentTheme.background_v2},
            ]}>
            {loader ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.updateText}>Update</Text>
            )}
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          isVisible={isFromDatePickerVisible}
          mode="date"
          onConfirm={handleFromDateConfirm}
          onCancel={hideFromDatePicker}
        />
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
  headers: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.5),
    marginTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#001B76',
    marginBottom: 20,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 120,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
  },
  editText: {
    fontSize: 16,
    color: '#001B76',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0F7FE',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  updateButton: {
    backgroundColor: '#001B76',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  updateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    backgroundColor: '#E0F7FE',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8', // Change as per design
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileSection: {
    width: 130,
    height: 130,
    borderWidth: 2,
    borderRadius: 65,
    // overflow: 'hidden',  // Removed to allow the icon to go outside
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 65, // Ensures image is clipped as a circle
  },
  addButton: {
    position: 'absolute',
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: 6,
    elevation: 4,
    right: -2,
    bottom: -3,
    borderWidth: 2,
    borderColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  listContainer: {
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 6,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
  },
  chipText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
