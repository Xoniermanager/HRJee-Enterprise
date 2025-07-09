import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';
import {BASE_URL} from '../../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PRMCategory} from '../../../APINetwork/ComponentApi';
import DateTimePicker from '@react-native-community/datetimepicker';
import Reload from '../../../Reload';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const EditPRM = ({route}) => {
  const navigation = useNavigation();
  const {currentTheme} = useContext(ThemeContext);
  const id = route?.params?.id;
  const isEdit = !!id;

  // States
  const [list, setList] = useState(null);
  const [loader, setLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [value1, setValue1] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [details, setDetails] = useState({
    Text: '',
    amount: '',
  });

  // Handlers
  const handleInputChange = (key, value) => {
    setDetails(prev => ({...prev, [key]: value}));
  };

  const handleDateChange = (event, selectedDate) => {
    setOpenStartDate(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const choosePhotoFromLibrary = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {text: 'Camera', onPress: openCamera},
        {text: 'Gallery', onPress: openGallery},
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true}
    );
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setPhoto(image);
      })
      .catch(err => {
        console.log('Camera error:', err);
      });
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setPhoto(image);
      })
      .catch(err => {
        console.log('Gallery error:', err);
      });
  };

  const removeImage = () => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Remove', style: 'destructive', onPress: () => setPhoto(null)},
      ]
    );
  };

  // API Calls
  const getCategoryList = async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/get/prm/Category`;
      const response = await PRMCategory(url, token);
      setList(response.data.data);
    } catch (error) {
      console.log('Category fetch error:', error);
      showMessage({
        message: 'Failed to load categories',
        type: 'danger',
      });
    }
  };

  const getDetailsForEdit = async () => {
    if (!isEdit) return;
    
    setPageLoader(true);
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/get/prm/request/details/${id}`;
      const response = await PRMCategory(url, token);
      
      const data = response.data.data;
      setDetails({
        Text: data.remark || '',
        amount: data.amount || '',
      });
      
      if (data.document) {
        setPhoto({path: data.document});
      }
      
      setValue1(data.category_id);
      
      if (data.bill_date) {
        setStartDate(new Date(data.bill_date));
      }
    } catch (error) {
      console.log('Details fetch error:', error);
      showMessage({
        message: 'Failed to load details',
        type: 'danger',
      });
    } finally {
      setPageLoader(false);
    }
  };

  const validateForm = () => {
    if (!value1) {
      showMessage({
        message: 'Please select the Category',
        type: 'danger',
      });
      return false;
    }
    
    if (details.amount.trim() === '') {
      showMessage({
        message: 'Please enter the Amount',
        type: 'danger',
      });
      return false;
    }
    
    if (details.Text.trim() === '') {
      showMessage({
        message: 'Please enter the Message',
        type: 'danger',
      });
      return false;
    }
    
    return true;
  };

  const submitForm = async () => {
    if (!validateForm()) return;

    setLoader(true);
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      let data = new FormData();
      
      data.append('remark', details.Text);
      data.append('category_id', value1);
      data.append('amount', details.amount);
      data.append('bill_date', formatDate(startDate));
      
      if (photo && photo.path && photo.mime && photo.modificationDate) {
        const imagePath = {
          uri: photo.path,
          type: photo.mime,
          name: `${photo.modificationDate}.jpg`,
        };
        data.append('document', imagePath);
      }

      const url = isEdit 
        ? `${BASE_URL}/update/prm/request/${id}`
        : `${BASE_URL}/add/prm/request`;

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };

      const response = await axios.request(config);
      
      showMessage({
        message: response.data.message,
        type: 'success',
      });
      navigation.goBack();
    } catch (error) {
      console.log('Submit error:', error);
      showMessage({
        message: error.response?.data?.message || 'Something went wrong',
        type: 'danger',
      });
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getCategoryList();
    getDetailsForEdit();
  }, []);

  if (list === null || pageLoader) {
    return <Reload />;
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isEdit ? 'Edit PRM Request' : 'Add PRM Request'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={[styles.scrollContainer, {backgroundColor: currentTheme.background}]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, {color: currentTheme.text}]}>
              <MaterialIcons name="category" size={16} color={currentTheme.text} /> Category
            </Text>
            <View style={[styles.inputWrapper, {backgroundColor: currentTheme.inputText_color}]}>
              <Dropdown
                selectedTextProps={{
                  style: {color: currentTheme.text},
                }}
                style={styles.dropdown}
                data={list}
                maxHeight={250}
                labelField="name"
                valueField="id"
                placeholder="Select PRM Category"
                value={value1}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setValue1(item.id);
                  setIsFocus(false);
                }}
                placeholderStyle={[styles.placeholderStyle, {color: currentTheme.text + '80'}]}
                itemTextStyle={{color: currentTheme.text}}
                containerStyle={styles.dropdownContainer}
                itemContainerStyle={styles.dropdownItem}
              />
            </View>
          </View>

          {/* Date Picker */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, {color: currentTheme.text}]}>
             Bill Date
            </Text>
            <TouchableOpacity
              style={[styles.dateButton, {backgroundColor: currentTheme.inputText_color}]}
              onPress={() => setOpenStartDate(true)}
            >
              <Text style={[styles.dateText, {color: currentTheme.text}]}>
                {formatDate(startDate)}
              </Text>
              <EvilIcons name="calendar" size={24} color={currentTheme.text} />
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, {color: currentTheme.text}]}>
             Amount
            </Text>
            <View style={[styles.inputWrapper, {backgroundColor: currentTheme.inputText_color}]}>
              <TextInput
                style={[styles.textInput, {color: currentTheme.text}]}
                placeholder="Enter amount"
                placeholderTextColor={currentTheme.text + '80'}
                value={details.amount}
                onChangeText={value => handleInputChange('amount', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Message Input */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, {color: currentTheme.text}]}>
              Message
            </Text>
            <View style={[styles.inputWrapper, {backgroundColor: currentTheme.inputText_color}]}>
              <TextInput
                style={[styles.textInput, styles.textArea, {color: currentTheme.text}]}
                placeholder="Enter your message"
                placeholderTextColor={currentTheme.text + '80'}
                value={details.Text}
                onChangeText={value => handleInputChange('Text', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Image Upload */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, {color: currentTheme.text}]}>
              Document
            </Text>
            <View style={[styles.imageUploadContainer, {backgroundColor: currentTheme.inputText_color}]}>
              {photo ? (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    style={styles.imagePreview}
                    source={{uri: photo.path}}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={removeImage}
                  >
                    <MaterialIcons name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <MaterialIcons name="cloud-upload" size={32} color={currentTheme.text + '60'} />
                  <Text style={[styles.uploadText, {color: currentTheme.text + '80'}]}>
                    Tap to upload document
                  </Text>
                </View>
              )}
              
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={choosePhotoFromLibrary}
              >
                <MaterialIcons name="add-a-photo" size={20} color={currentTheme.text} />
                <Text style={[styles.uploadButtonText, {color: currentTheme.text}]}>
                  {photo ? 'Change' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, {backgroundColor: currentTheme.background_v2}]}
            onPress={submitForm}
            disabled={loader}
          >
            {loader ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialIcons name="check" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>
                  {isEdit ? 'Update Request' : 'Submit Request'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      {openStartDate && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 10,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: '600',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdown: {
    flex: 1,
  },
  dropdownContainer: {
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
  },
  placeholderStyle: {
    fontSize: responsiveFontSize(1.8),
  },
  textInput: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dateText: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
  },
  imageUploadContainer: {
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imagePreviewContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 15,
  },
  imagePreview: {
    width: responsiveWidth(60),
    height: responsiveHeight(25),
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#ff4444',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  uploadText: {
    fontSize: responsiveFontSize(1.7),
    marginTop: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  uploadButtonText: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    marginLeft: 5,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom:70
  },
  submitButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default EditPRM;
