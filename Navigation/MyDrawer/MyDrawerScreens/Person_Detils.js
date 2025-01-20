import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import { ThemeContext } from '../../../Store/ConetxtApi.jsx/ConextApi';
const Person_Detils = () => {
  const {currentTheme} = useContext(ThemeContext);
  const [details, setDetails] = useState({
    email: '',
    password: '',
    fatherName: '',
    motherName: '',
    maritalStatus: '',
    empStatus: '',
    phoneNumber: '',
  });
  const handleInputChange = (key, value) => {
    setDetails(prev => ({...prev, [key]: value}));
  };
  const [image, setImage] = useState();
  return (
    <SafeAreaView
    style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.headers}>Basic Details</Text>
        <View
          style={{
            marginBottom: responsiveHeight(10),
            backgroundColor:currentTheme.background,
            borderTopLeftRadius: 40,
            marginTop: responsiveHeight(3),
            borderTopRightRadius: 40,
            padding: 20,
          }}>
          <View style={styles.profileSection}>
            <Image
              source={{uri: image ? image : 'https://via.placeholder.com/100'}}
              style={[styles.profileImage,{borderColor:currentTheme.text}]}
            />
            <TouchableOpacity
              onPress={() =>
                ImagePicker.openPicker({
                  width: 300,
                  height: 400,
                  cropping: true,
                }).then(image => {
                  setImage(image.path);
                })
              }
              style={{position: 'absolute'}}>
              <MaterialIcons
                style={{marginLeft: 60}}
                name="add-a-photo"
                size={30}
                color={currentTheme.text}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.name,{color:currentTheme.text}]}>Aditya Chauhan</Text>

          <View style={[styles.inputContainer,{backgroundColor:currentTheme.inputText_color,}]}>
            <TextInput
              style={[styles.textInput,{color:currentTheme.text}]}
              placeholder="Email"
              placeholderTextColor={currentTheme.text}
              value={details.email}
              onChangeText={value => handleInputChange('email', value)}
            />
          </View>
       <View style={[styles.inputContainer,{backgroundColor:currentTheme.inputText_color}]}>
            <TextInput
              style={[styles.textInput,{color:currentTheme.text}]}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor={currentTheme.text}
              value={details.password}
              onChangeText={value => handleInputChange('password', value)}
            />
          </View>

       <View style={[styles.inputContainer,{backgroundColor:currentTheme.inputText_color}]}>
            <TextInput
              style={[styles.textInput,{color:currentTheme.text}]}
              placeholder="Father's Name"
              placeholderTextColor={currentTheme.text}
              value={details.fatherName}
              onChangeText={value => handleInputChange('fatherName', value)}
            />
          </View>

       <View style={[styles.inputContainer,{backgroundColor:currentTheme.inputText_color}]}>
            <TextInput
              style={[styles.textInput,{color:currentTheme.text}]}
              placeholder="Mother's Name"
              placeholderTextColor={currentTheme.text}
              value={details.motherName}
              onChangeText={value => handleInputChange('motherName', value)}
            />
          </View>

       <View style={[styles.inputContainer,{backgroundColor:currentTheme.inputText_color}]}>
            <TextInput
              style={[styles.textInput,{color:currentTheme.text}]}
              placeholder="Marital Status"
              placeholderTextColor={currentTheme.text}
              value={details.maritalStatus}
              onChangeText={value => handleInputChange('maritalStatus', value)}
            />
          </View>

       <View style={[styles.inputContainer,{backgroundColor:currentTheme.inputText_color}]}>
            <TextInput
              style={[styles.textInput,{color:currentTheme.text}]}
              placeholder="Emp Status"
              placeholderTextColor={currentTheme.text}
              value={details.empStatus}
              onChangeText={value => handleInputChange('empStatus', value)}
            />
          </View>

       <View style={[styles.inputContainer,{backgroundColor:currentTheme.inputText_color}]}>
            <TextInput
              style={[styles.textInput,{color:currentTheme.text}]}
              placeholder="Phone Number"
              placeholderTextColor={currentTheme.text}
              keyboardType="phone-pad"
              value={details.phoneNumber}
              onChangeText={value => handleInputChange('phoneNumber', value)}
            />
          </View>

          <TouchableOpacity style={[styles.updateButton,{backgroundColor: currentTheme.background_v2}]}>
            <Text style={styles.updateText}>Update</Text>
          </TouchableOpacity>
        </View>
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'contain',
    borderWidth:0.5
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
});
