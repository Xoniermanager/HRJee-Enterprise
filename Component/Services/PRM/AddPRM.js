import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
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
import {PRMCategory, getLeaveType} from '../../../APINetwork/ComponentApi';
import HomeSkeleton from '../../Skeleton/HomeSkeleton';
import Themes from '../../Theme/Theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import Reload from '../../../Reload';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
const AddPRM = () => {
  const navigation = useNavigation();
  const {currentTheme,} = useContext(ThemeContext);
  const [list, setList] = useState(null);
  const [loader, setLoader] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [value1, setValue1] = useState();
  const [isFocus, setIsFocus] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [details, setDetails] = useState({
    Text: '',
    amount: '',
  });
  const handleInputChange = (key, value) => {
    setDetails(prev => ({...prev, [key]: value}));
  };
  const handleDateChange = (event, selectedDate) => {
    setOpenStartDate(false);
    setStartDate(selectedDate);
  };
  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      // multiple: true,
    })
      .then(image => {
        setPhoto(image);
      })
      .catch(err => {
        console.log('err........', err);
      });
  };
  const getasignTask = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/get/prm/Category`;
    const response = await PRMCategory(url, token);
    setList(response.data.data);
  };
  useEffect(() => {
    getasignTask();
  }, []);
  if (list == null) {
    return <Reload />;
  }
  const Update_Profile = async () => {
    if (value1 == null) {
      showMessage({
        message: 'Please select the Category',
        type: 'danger',
      });
    } else if (details.Text.trim() === '' || details.amount.trim() === '') {
      showMessage({
        message: 'Please enter the text',
        type: 'danger',
      });
    } else {
      setLoader(true);
      const token = await AsyncStorage.getItem('TOKEN');
      let data = new FormData();
      data.append('remark', details?.Text);
      data.append('category_id', value1);
      data.append('amount', details.amount);
      data.append('bill_date', startDate.toISOString().split('T')[0]);
      if (photo && photo.path && photo.mime && photo.modificationDate) {
        var imagepath = {
          uri: photo.path,
          type: photo.mime,
          name: `${photo.modificationDate}.jpg`,
        };
        data.append('document', imagepath);
      }
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/add/prm/request`,
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
          navigation.goBack();
        })
        .catch(error => {

          setLoader(false);
        });
    }
  };
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: currentTheme.background,
          borderTopLeftRadius: 40,
          marginTop: responsiveHeight(3),
          borderTopRightRadius: 40,
        }}>
        <View
          style={[
            styles.inputContainer,
            {backgroundColor: currentTheme.inputText_color},
          ]}>
          <Dropdown
            selectedTextProps={{
              style: {
                color: '#000',
              },
            }}
            style={{width: responsiveWidth(80), padding: 10}}
            data={list}
            maxHeight={300}
            labelField="name"
            valueField="id"
            placeholder={
              !isFocus ? 'Select PRM Category' : 'Select PRM Category'
            }
            value={value1}
            onChange={item => {
              setValue1(item.id);
            }}
            placeholderStyle={{
              color: Themes == 'dark' ? '#000' : '#000',
            }}
            itemTextStyle={{color: Themes == 'dark' ? '#000' : '#000'}}
          />
        </View>
        <View
          style={[
            styles.Date_box,
            {backgroundColor: currentTheme.inputText_color},
          ]}>
          <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>
            {startDate.toISOString().split('T')[0]}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setOpenStartDate(true);
            }}
            style={{marginLeft: 10}}>
            <EvilIcons
              name="calendar"
              style={{
                fontSize: 25,
                color: Themes == 'dark' ? '#000' : '#000',
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.inputContainer,
            {backgroundColor: currentTheme.inputText_color},
          ]}>
          <TextInput
            style={[styles.textInput, {color: currentTheme.text}]}
            placeholder="Amount"
            placeholderTextColor={currentTheme.text}
            value={details.amount}
            onChangeText={value => handleInputChange('amount', value)}
          />
        </View>
        <View
          style={[
            styles.inputContainer,
            {backgroundColor: currentTheme.inputText_color},
          ]}>
          <TextInput
            style={[styles.textInput, {color: currentTheme.text}]}
            placeholder="Type Text..."
            placeholderTextColor={currentTheme.text}
            value={details.Text}
            onChangeText={value => handleInputChange('Text', value)}
          />
        </View>
        <View
          style={[
            styles.Date_box,
            {width: responsiveWidth(90), height: responsiveHeight(10)},
          ]}>
          {photo ? (
            <Image
              style={{width: responsiveWidth(40), height: responsiveHeight(8)}}
              source={{uri: photo.path}}
            />
          ) : (
            <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>
              Image Upload
            </Text>
          )}
          <TouchableOpacity
            onPress={() => choosePhotoFromLibrary()}
            style={{marginLeft: 10}}>
            <AntDesign
              name="clouduploado"
              style={{
                fontSize: 25,
                color: Themes == 'dark' ? '#000' : '#000',
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
        </View>
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
        {openStartDate && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E64',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0F7FE',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    margin: 20,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  Date_box: {
    flexDirection: 'row',
    backgroundColor: '#E0F7FE',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
    width: responsiveWidth(90),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  updateButton: {
    backgroundColor: '#001B76',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,

    width: responsiveWidth(90),
    alignSelf: 'center',
  },
  updateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default AddPRM;
