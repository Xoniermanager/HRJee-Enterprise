import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';
import { useNavigation } from '@react-navigation/native';

const PunchOut = () => {
  const navigation=useNavigation()
  const {currentTheme} = useContext(ThemeContext);
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
    
      <View style={[styles.headerContainer,{backgroundColor: currentTheme.background_v2}]}>
      <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Punch Out</Text>
    </View>
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: currentTheme.background,
          borderTopLeftRadius: 40,
          marginTop: responsiveHeight(3),
          borderTopRightRadius: 40,
        }}>
        <View style={{margin: 18}}>
          <View
            style={{
              backgroundColor: currentTheme.background,
              padding: 10,
              borderRadius: 35,
              elevation: 7,
              opacity: 1,
              marginVertical: 10,
              marginTop: responsiveHeight(0),
              borderWidth: 0.5,
              borderColor: currentTheme.background_v2,
            }}>
            <View style={styles.dateTimeContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <AntDesign
                  style={{}}
                  name="calendar"
                  size={30}
                  marginHorizontal={5}
                  color={currentTheme.text}
                />
                <Text style={[styles.label, {color: currentTheme.text}]}>
                  Date
                </Text>
              </View>
              <Text style={[styles.date, {color: currentTheme.text}]}>
                Mon, 15 Jul 2024
              </Text>
            </View>
            <View
              style={{
                borderWidth: 0.2,
                elevation: 7,
                opacity: 1,
                borderColor: currentTheme.background_v2,
              }}></View>
            <View style={styles.dateTimeContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons
                  style={{}}
                  name="clock-time-four-outline"
                  size={30}
                  marginHorizontal={5}
                  color={currentTheme.text}
                />
                <Text style={[styles.label, {color: currentTheme.text}]}>
                  Time
                </Text>
              </View>
              <Text style={[styles.time, {color: currentTheme.text}]}>
                04:20 PM
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: currentTheme.background,
              padding: 10,
              borderRadius: 35,
              elevation: 7,
              opacity: 1,
              marginVertical: 10,
              marginTop: responsiveHeight(0),
              borderWidth: 0.5,
              borderColor: currentTheme.background_v2,
            }}>
            <View style={styles.dateTimeContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons
                  style={{}}
                  name="timetable"
                  size={30}
                  marginHorizontal={5}
                  color={currentTheme.text}
                />
                <Text style={[styles.label, {color: currentTheme.text}]}>
                  Duration
                </Text>
              </View>
              <Text style={[styles.date, {color: currentTheme.text}]}>
                00:01 Hours
              </Text>
            </View>
            <View
              style={{
                borderWidth: 0.2,
                elevation: 7,
                opacity: 1,
                borderColor: '#000',
              }}></View>
            <View style={styles.dateTimeContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <SimpleLineIcons
                  style={{}}
                  name="note"
                  size={20}
                  marginHorizontal={5}
                  color={currentTheme.text}
                />
                <Text style={[styles.label, {color: currentTheme.text}]}>
                  Add a notes
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.punchInButton,
              {backgroundColor: currentTheme.background_v2},
            ]}>
            <Text style={styles.punchInButtonText}>PUNCH OUT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#2E248B',
    padding: 16,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E248B',
    marginTop: 16,
  },
  dropdown: {
    height: 50,
    backgroundColor: '#E1F6F4',
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  input: {
    height: 50,
    borderColor: '#E1F6F4',
    borderWidth: 1,
    backgroundColor: '#E1F6F4',
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0A58ED',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: '#0052cc',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 2,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkbox: {
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    textColor: '#000',
  },
  updateButton: {
    backgroundColor: '#0052cc',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 2,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sameAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sameAddressText: {
    fontSize: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    marginVertical: 15,
    borderBottomColor: '#ccc',
  },
  label: {
    fontSize: 18,
    color: '#555',
  },
  date: {
    fontSize: 18,
    color: '#000',
  },
  time: {
    fontSize: 18,
    color: '#000',
  },
  lastPunchOutContainer: {
    marginVertical: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  lastPunchOut: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  addNoteContainer: {
    marginVertical: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addNoteText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  punchInButton: {
    backgroundColor: '#0033CC',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  punchInButtonText: {
    color: '#fff',
    fontSize: 18,
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
});
export default PunchOut;
