import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {BASE_URL} from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {gettodayattendance} from '../../APINetwork/ComponentApi';
import moment from 'moment';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {ThemeContext} from '../../Store/ConetxtApi.jsx/ConextApi';
import Reload from '../../Reload';
const AllPunchIn = () => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const monthNames = [
    'Jan',
    'Feb',
    'March',
    'April',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const {currentTheme} = useContext(ThemeContext);
  const [attendanceList, setAttendanceList] = useState(null);
  async function CheckDailyAttendances() {
    try {
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/get-today-attendance`;
      const response = await gettodayattendance(url, token);
      if (response?.data?.status) {
        const attendanceArray = response?.data?.todayAttendanceDetails || [];
        setAttendanceList(attendanceArray);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  }
  useEffect(() => {
    CheckDailyAttendances();
  }, []);
  if(attendanceList==null){
    return <Reload/>
  }
  return (
    <View style={styles.contanier}>
      {attendanceList.map((record, index) => {
        const inTime = moment(record.punch_in).format('HH:mm:ss');
        const outTime = record.punch_out
          ? moment(record.punch_out).format('HH:mm:ss')
          : null;
        let duration = '00:00:00';

        if (record.punch_in && record.punch_out) {
          const timeStart = moment(record.punch_in);
          const timeEnd = moment(record.punch_out);
          const diff = timeEnd.diff(timeStart);
          const dur = moment.duration(diff);
          duration =
            `${String(dur.hours()).padStart(2, '0')}:` +
            `${String(dur.minutes()).padStart(2, '0')}:` +
            `${String(dur.seconds()).padStart(2, '0')}`;
        }

        const date = new Date(record.punch_in);

        return (
          <View
            key={record.id}
            style={{
              marginBottom: responsiveHeight(1),
              padding: 20,
              backgroundColor: currentTheme.background_v2,
              borderColor: currentTheme.background_v2,
              borderRadius: 20,
              borderWidth: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
            }}>
            <View>
              <Text style={{color: currentTheme.text_v2, fontSize: 18}}>
                {days[date.getDay()]}
              </Text>
              <Text style={{color: currentTheme.text_v2, fontSize: 18}}>
                {date.getDate() +
                  ' ' +
                  monthNames[date.getMonth()] +
                  ' ' +
                  date.getFullYear()}
              </Text>

              {record.punch_in && record.punch_out && (
                <>
                  <Text
                    style={{
                      color: currentTheme.text_v2,
                      fontSize: 18,
                      marginTop: 5,
                    }}>
                    Break Time
                  </Text>
                </>
              )}
            </View>

            <View style={{borderColor: currentTheme.text_v2, borderWidth: 1}} />

            <View>
              {record.punch_in && record.punch_out && (
                <>
                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text
                      style={{
                        color: '#00f0ff',
                        fontSize: 18,
                        marginHorizontal: 10,
                      }}>
                      {duration}
                    </Text>
                  </View>
                  <Text style={{color: 'red', fontSize: 15}}>
                    Total Time Elapsed
                  </Text>
                </>
              )}
              <Text style={{color: 'orange', fontSize: 16, marginTop: 20}}>
                {record.total_break_time ?? '00:00:00'}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default AllPunchIn;

const styles = StyleSheet.create({
  contanier: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
});
