import {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Calendar} from 'react-native-calendars';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getHoliday} from '../../../APINetwork/ComponentApi';
import {BASE_URL} from '../../../utils';
import Reload from '../../../Reload';
import {showMessage} from 'react-native-flash-message';
import HolidayList from './HolidayList';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';

const Holiday = ({navigation}) => {
  const [selected, setSelected] = useState('');
  const {currentTheme} = useContext(ThemeContext);
  const [holidays, setHolidays] = useState([]);
  const [monthlyHolidays, setMonthlyHolidays] = useState([]);
  const [loader, setLoader] = useState(false);
  const getMonthlyHolidays = dateString => {
    const selectedMonth = new Date(dateString).getMonth() + 1;
    const filteredHolidays = holidays?.filter(holiday => {
      const holidayMonth = new Date(holiday.date).getMonth() + 1;
      return holidayMonth === selectedMonth;
    });
    setMonthlyHolidays(filteredHolidays);
  };
  const fetchHolidays = async () => {
    setLoader(true);
    try {
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/holiday/list`;
      const response = await getHoliday(url, token);
      showMessage({
        message: `${response?.data?.message}`,
        type: 'success',
      });
      setHolidays(response?.data?.data);
      getMonthlyHolidays(new Date().toISOString().split('T')[0]); // Initialize with current month's holidays
    } catch (error) {
      console.error('Error fetching holiday data:', error?.response?.data);
    }
  };
  useEffect(() => {
    fetchHolidays();
  }, []);

  // if (holidays?.length === 0) {
  //     return <Reload />
  // }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
      <View style={{marginTop: 15}}>
        <View style={{alignSelf: 'center'}}>
          <Text style={styles.name}>Holiday</Text>
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
          <Calendar
            style={{
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
              backgroundColor: currentTheme.background,
            }}
            onDayPress={day => {
              setSelected(day.dateString);
              getMonthlyHolidays(day.dateString);
            }}
            markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: 'orange',
              },
            }}
          />

          <View style={{marginHorizontal: responsiveWidth(5)}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  color: currentTheme.text,
                  marginVertical: 10,
                  fontSize: 18,
                  fontWeight: '500',
                }}>
                Holiday of the month
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('HolidayList')}>
                <Text
                  style={{
                    color: currentTheme.text,
                    marginVertical: 10,
                    fontSize: 18,
                    fontWeight: '500',
                  }}>
                  View all
                </Text>
              </TouchableOpacity>
            </View>
            {monthlyHolidays?.length > 0 ? (
              monthlyHolidays?.map((holiday, index) => (
                <View
                  key={index}
                  style={{
                    height: responsiveHeight(10),
                    borderRadius: 15,
                    flexDirection: 'row',
                    backgroundColor: currentTheme.background_v2,
                    borderWidth: 0.5,
                    borderColor: '#0E0E64',
                    elevation: 3,
                    marginBottom: 5,
                  }}>
                  <View
                    style={{
                      marginLeft: 20,
                      backgroundColor: '#fff',
                      height: 70,
                      width: 50,
                      justifyContent: 'center',
                      borderBottomRightRadius: 30,
                      borderBottomLeftRadius: 30,
                    }}>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        resizeMode: 'contain',
                        alignSelf: 'center',
                      }}
                      source={require('../../../assets/HomeScreen/calendar.png')}
                    />
                  </View>
                  <View style={{marginLeft: 20, justifyContent: 'center'}}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: '500',
                      }}>
                      {holiday.name}
                    </Text>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: '500',
                      }}>
                      {holiday.date}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text
                style={{
                  color: currentTheme.text,
                  fontSize: 18,
                  fontWeight: '500',
                }}>
                No holidays available this month
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Holiday;

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
});
