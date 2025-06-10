import {
  Image,
  SafeAreaView,
  Modal,
  StyleSheet,
  Text,
  View,
  FlatList,
  Switch,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  Button,
  ActivityIndicator
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Calendar} from 'react-native-calendars';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import {BASE_URL} from '../../utils';
import {
  getrecentattendence,
  gettodayattendance,
} from '../../APINetwork/ComponentApi';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {ThemeContext} from '../../Store/ConetxtApi.jsx/ConextApi';
import AntDesign from 'react-native-vector-icons/AntDesign';
const Attendance = () => {
  const {currentTheme, activeLog} = useContext(ThemeContext);
  const [dataExport, setDataExport] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [loaderModal, setLoaderModal] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [selectedDate, setSelectedDate] = useState(null);
  const [todayAttendanceDetails, setTodayAttendanceDetails] = useState('');
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [dailyDate, setDailyDate] = useState();
  const [currentMonth, setCurrentMonth] = useState(moment().format('MM'));
  const [monthList, setMonthList] = useState();



  useEffect(() => {
    const initialMonth = moment().format('MM');
    setCurrentMonth(initialMonth);
  }, []);
  const handleMonthChange = month => {
    const formattedMonth = String(month.month).padStart(2, '0');
    setCurrentMonth(formattedMonth);
  };
  const StatusItem = ({color, text, value}) => (
    <View style={[styles.statusItem, {backgroundColor: color}]}>
      <Text style={styles.statusText}>{text}</Text>
      <Text style={styles.statusValue}>{value}</Text>
    </View>
  );
  const LegendItem = ({color, text}) => (
    <View style={styles.legendItem}>
      <View style={[styles.legendColor, {backgroundColor: color}]} />
      <Text style={[styles.legendText, {color: currentTheme.text}]}>
        {text}
      </Text>
    </View>
  );

  const onDayPress = day => {
    setSelectedDate(day.dateString);
    attendance_by_date(day.dateString);
    setModalVisible(true);
  };
  const attendance_by_date = async day => {
    let token = await AsyncStorage.getItem('TOKEN');
    try {
      const url = `${BASE_URL}/attendance?date=${day}`;
      console.log(url);
      const response = await gettodayattendance(url, token);
      if (response?.data?.status) {
        setDailyDate(response?.data?.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error making POST request:', error);
    }
  };
  const attendance_by_month = async day => {
    let token = await AsyncStorage.getItem('TOKEN');
    try {
      const url = `${BASE_URL}/attendance/details/${currentMonth}`;
      const response = await gettodayattendance(url, token);
      if (response?.data?.status) {
        console.log(response?.data?.data, 'response?.data?.data');
        setMonthList(response?.data?.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error making POST request:', error);
    }
  };
  async function getTodayAttendance() {
    let token = await AsyncStorage.getItem('TOKEN');
    try {
      setLoader(true);
      const url = `${BASE_URL}/get-today-attendance`;
      const response = await gettodayattendance(url, token);
      if (response?.data?.status === true) {
        setTodayAttendanceDetails(response?.data?.todayAttendanceDetails);
        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.error('Error making POST request:', error);
      setLoader(false);
    }
  }
  useEffect(() => {
    if (loading) {
      setLoaderModal(true);
    } else {
      setLoaderModal(false);
    }
  }, [loading]);
  useEffect(() => {
    getTodayAttendance();
    attendance_by_month();
  }, [currentMonth]);
  useEffect(() => {
    if (fromDate && toDate) {
      getSearchAttendence();
      getExport();
    }
  }, [fromDate, toDate]);

  const showData = [
    {
      id: 1,
      uri: require('../../assets/HomeScreen/calendar.png'),
      name: 'Working',
      num: monthList?.totalPresent,
      color: '#F2F4FF',
      backgroundcolor: '#7B9BF6',
      fontcolor: '#7B9BF6',
    },
    {
      id: 2,
      uri: require('../../assets/HomeScreen/leave.png'),
      name: 'Leave',
      num: monthList?.totalLeave,
      color: '#FFF6ED',
      backgroundcolor: '#F39331',
      fontcolor: '#F39331',
    },
    {
      id: 3,
      uri: require('../../assets/HomeScreen/medal.png'),
      name: 'HoliDay',
      num: monthList?.totalHoliday,
      color: '#EDFBFE',
      backgroundcolor: '#4EC8FA',
      fontcolor: '#4EC8FA',
    },
  ];
  const renderServicesList = ({item}) => (
    <View
      style={{
        justifyContent: 'center',
        backgroundColor: item.backgroundcolor,
        width: responsiveWidth(22.5),
        marginHorizontal: 5,
        borderRadius: 20,
      }}>
      <View
        style={{
          justifyContent: 'center',
          backgroundColor: item.color,
          width: responsiveWidth(22.5),
          marginTop: 3,
          borderRadius: 20,
        }}>
        <View style={{padding: 10, alignItems: 'center'}}>
          <Text style={{color: item.fontcolor}}>{item.num}</Text>
          <Text style={{marginBottom: 2, color: '#000'}}>{item.name}</Text>
        </View>
      </View>
    </View>
  );
  const getSearchAttendence = async () => {
    function formatDate(dateStr) {
      const [month, day, year] = dateStr.split('/');
      const paddedMonth = month.padStart(2, '0');
      const paddedDay = day.padStart(2, '0');
      return `${year}-${paddedMonth}-${paddedDay}`;
    }

    try {
      let token = await AsyncStorage.getItem('TOKEN');

      let data = {
        from_date: fromDate,
        to_date: toDate,
      };
      data.from_date = formatDate(data.from_date);
      data.to_date = formatDate(data.to_date);
      setLoading(true);
      const url = `${BASE_URL}/search/filter/attendance`;
      const response = await getrecentattendence(url, data, token);
      if (response?.data?.status == true) {
        setLoader(false);
        if (response.data.data == 'No Attendance Found Of Respective Dates') {
          setData([]);
        } else {
          setData(response?.data);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error making POST request:', error);
      setLoading(false);
    }
  };
  const getExport = async () => {
    function formatDate(dateStr) {
      const [month, day, year] = dateStr.split('/');
      const paddedMonth = month.padStart(2, '0');
      const paddedDay = day.padStart(2, '0');
      return `${year}-${paddedMonth}-${paddedDay}`;
    }

    try {
      let token = await AsyncStorage.getItem('TOKEN');

      let data = {
        from_date: fromDate,
        to_date: toDate,
      };
      data.from_date = formatDate(data.from_date);
      data.to_date = formatDate(data.to_date);
      setLoading(true);
      const url = `${BASE_URL}/attendance/export`;
      const response = await getrecentattendence(url, data, token);
      if (response?.data?.status) {
        setLoader(false);
        setDataExport(response.data.data);
      } else {
        setLoading(false);
        activeLog(data, url, 'post', response?.data?.message);
        setDataExport(response.data.message);
      }
    } catch (error) {
      console.error('Error making POST request:', error);
      setLoading(false);
    }
  };

  const punchIn = moment(
    todayAttendanceDetails?.punch_in,
    'YYYY-MM-DD HH:mm:ss',
  );
  const punchOut = moment(
    todayAttendanceDetails?.punch_out,
    'YYYY-MM-DD HH:mm:ss',
  );

  const duration = moment.duration(punchOut.diff(punchIn));
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();

  const [isFromDatePickerVisible, setFromDatePickerVisibility] =
    useState(false);
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);

  const showFromDatePicker = () => setFromDatePickerVisibility(true);
  const hideFromDatePicker = () => setFromDatePickerVisibility(false);

  const handleFromDateConfirm = date => {
    setFromDate(date.toLocaleDateString());
    hideFromDatePicker();
  };

  const showToDatePicker = () => setToDatePickerVisibility(true);
  const hideToDatePicker = () => setToDatePickerVisibility(false);

  const handleToDateConfirm = date => {
    setToDate(date.toLocaleDateString());
    hideToDatePicker();
  };
  const handleExport = () => {
    if (fromDate && toDate) {
      if (dataExport == 'No Attendance found for this two respective dates') {
        showMessage({
          message: 'No Attendance found for this two respective dates',
          type: 'danger',
          duration: 4000,
        });
      } else if (dataExport) {
        Linking.openURL(dataExport.download_url);
      }
    } else {
      showMessage({
        message: 'Please Select the Start Date and End Date',
        type: 'danger',
        duration: 4000,
      });
    }
  };
  const presentDates = monthList?.attendanceDetails?.map(item => item.punch_in.split(' ')[0]);
  const absentDates = monthList?.absentDetails?.map(item => item.date.split(' ')[0]);
  const holidayDates = monthList?.holidayDetails?.map(item => item.date.split(' ')[0]);
  const leaveDetails = monthList?.leaveDetails || [];
  // const outdutyates = ['2025-04-23',];

  const markedDates = {};
      console.log(presentDates,'presentDates')
  presentDates?.forEach(date => {
    markedDates[date] = { status: 'present' };
  });
  absentDates?.forEach(date => {
    markedDates[date] = { status: 'absent' };
  });
  holidayDates?.forEach(date => {
    markedDates[date] = { status: 'holiday' };
  });
  leaveDetails?.forEach(leave => {
    if (leave.is_half_day === 0) {
      const startDate = moment(leave.from);
      const endDate = moment(leave.to);
  
      for (
        let date = moment(startDate);
        date.diff(endDate, 'days') <= 0;
        date.add(1, 'days')
      ) {
        const formattedDate = date.format('YYYY-MM-DD');
        markedDates[formattedDate] = { status: 'leave' };
      }
    }
  });
  leaveDetails?.forEach(leave => {
    if (leave.is_half_day === 1) {
      const startDate = moment(leave.from);
      const endDate = moment(leave.to);
  
      for (
        let date = moment(startDate);
        date.diff(endDate, 'days') <= 0;
        date.add(1, 'days')
      ) {
        const formattedDate = date.format('YYYY-MM-DD');
        markedDates[formattedDate] = { status: 'halfday' };
      }
    }
  });

  // outdutyates?.forEach(date => {
  //   markedDates[date] = { status: 'outduty' };
  // });
 
  
  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: currentTheme.attendance_background_v2},
      ]}>
      <View
        style={{
          marginTop: 15,
        }}>
        <View
          style={{marginTop: 20, alignSelf: 'center', flexDirection: 'row'}}>
          <Text style={[styles.name, {color: currentTheme.text}]}>
            Attendance
          </Text>
          <Switch
            style={{marginLeft: 5}}
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
      {!isEnabled ? (
        <>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: currentTheme.background,
              borderTopLeftRadius: 40,
              marginTop: isEnabled ? responsiveHeight(12) : responsiveHeight(3),
              borderTopRightRadius: 40,
            }}>
            <View style={{marginHorizontal: 15}}>
              <Calendar
              theme={{
                selectedDayBackgroundColor: currentTheme.text,
                todayTextColor: currentTheme.text,
                arrowColor: currentTheme.text,
              }}
              dayComponent={({date, state}) => {
                const isToday = moment().format('YYYY-MM-DD') === date.dateString;
                const isSunday = moment(date.dateString).day() === 0;
                const mark = markedDates[date.dateString];
                let backgroundColor = '#fff';
                let textColor = '#000';
                if (mark?.status === 'holiday' || isSunday) {
                  console.log(mark?.status)
                  backgroundColor = 'blue';
                  textColor = '#fff';
                } else if (mark?.status === 'present') {
                  backgroundColor = 'green';
                  textColor = '#fff';
                } else if (mark?.status === 'absent') {
                  backgroundColor = 'red';
                  textColor = '#fff';
                }
                else if (mark?.status === 'leave') {
                  backgroundColor = 'orange';
                  textColor = '#fff';
                }
                else if (mark?.status === 'halfday') {
                  backgroundColor = 'pink';
                  textColor = '#fff';
                }
                else if (mark?.status === 'outduty') {
                  backgroundColor = 'peachpuff';
                  textColor = '#000';
                }
            return (
                  <TouchableOpacity
                    style={{
                      width: 42,
                      height: 42,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 8,
                      backgroundColor: backgroundColor,
                    }}
                    onPress={() => onDayPress(date)}>
                    <Text
                      style={{
                        color: textColor,
                        fontWeight: '600',
                      }}>
                      {date.day}
                    </Text>
                  </TouchableOpacity>
                );
                  }}
                  style={[
                    styles.calendar,
                    {backgroundColor: currentTheme.background},
                  ]}
                  onMonthChange={handleMonthChange}
                  markingType={'multi-dot'}
/>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                  <View
                    style={[
                      styles.modalView,
                      {backgroundColor: currentTheme.modalBack},
                    ]}>
                    {/* Header */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: currentTheme.text,
                          fontWeight: '500',
                          fontSize: 18,
                        }}>
                        Attendance Details
                      </Text>
                      <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Entypo
                          name="circle-with-cross"
                          size={30}
                          color={currentTheme.text}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View
                      style={{
                        borderWidth: 0.5,
                        marginVertical: 5,
                        opacity: 0.3,
                        borderColor: currentTheme.text,
                      }}
                    />

                    {/* Selected Date */}
                    <View
                      style={{
                        backgroundColor: currentTheme.background,
                        alignSelf: 'flex-start',
                        borderRadius: 10,
                        marginVertical: 5,
                      }}>
                      <Text
                        style={{
                          color: currentTheme.text,
                          padding: 5,
                          marginHorizontal: 5,
                        }}>
                        {selectedDate}
                      </Text>
                    </View>

                    {/* Divider */}
                    <View
                      style={{
                        borderWidth: 0.5,
                        marginVertical: 5,
                        opacity: 0.3,
                        borderColor: currentTheme.text,
                      }}
                    />

                    {/* FlatList */}
                    <FlatList
                      data={dailyDate?.attendance || []}
                      keyExtractor={(_, index) => index.toString()}
                      renderItem={({item, index}) => (
                        <View
                          style={{
                            marginVertical: 8,
                            padding: 10,
                            backgroundColor: currentTheme.background,
                            borderRadius: 10,
                          }}>
                          <Text
                            style={{
                              color: currentTheme.text,
                              fontWeight: '600',
                              fontSize: 16,
                              marginBottom: 8,
                            }}>
                            Shift {index + 1}
                          </Text>

                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View>
                              <Text
                                style={{
                                  color: currentTheme.text,
                                  marginVertical: 5,
                                }}>
                                Punch In
                              </Text>
                              <Text
                                style={{
                                  color: currentTheme.text,
                                  marginVertical: 5,
                                }}>
                                Punch Out
                              </Text>
                              <Text
                                style={{
                                  color: currentTheme.text,
                                  marginVertical: 5,
                                }}>
                                Working Hours
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{
                                  color: currentTheme.text,
                                  marginVertical: 5,
                                }}>
                                {item.punch_in ?? 'N/A'}
                              </Text>
                              <Text
                                style={{
                                  color: currentTheme.text,
                                  marginVertical: 5,
                                }}>
                                {item.punch_out ?? 'N/A'}
                              </Text>
                              <Text
                                style={{
                                  color: currentTheme.text,
                                  marginVertical: 5,
                                }}>
                                {item.total_working_hours ?? 'N/A'}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              borderWidth: 0.5,
                              marginVertical: 5,
                              opacity: 0.3,
                              borderColor: currentTheme.text,
                            }}
                          />
                        </View>
                      )}
                      ListEmptyComponent={() => (
                        <Text style={{color: currentTheme.text, marginTop: 20}}>
                          No attendance data
                        </Text>
                      )}
                    />
                  </View>
                </View>
              </Modal>

              {/* Status Section */}
              <View
                style={[
                  styles.statusContainer,
                  {backgroundColor: currentTheme.background_v2},
                ]}>
                <StatusItem
                  color="green"
                  text="Present"
                  value={monthList?.totalPresent}
                />
                <StatusItem
                  color="red"
                  text="Absent"
                  value={monthList?.totalAbsent}
                />
                <StatusItem
                  color="orange"
                  text="Leave"
                  value={monthList?.totalLeave}
                />
                <StatusItem
                  color="blue"
                  text="Holiday"
                  value={monthList?.totalHoliday}
                />
                <StatusItem
                  color="pink"
                  text="Halfday"
                  value={monthList?.shortAttendance}
                />
              </View>

              {/* Legend */}
              <View style={styles.legendContainer}>
                <LegendItem
                  color="green"
                  text="Present"
                  style={{color: '#fff'}}
                />
                <LegendItem color="red" text="Absent" />
                <LegendItem color="orange" text="Leave" />
                <LegendItem color="blue" text="Holiday" />
                <LegendItem color="pink" text="Halfday" />
                <LegendItem color="peachpuff" text="Outdoor Duty" />
                {/* <LegendItem color="yellow" text="Leave Without Pay" />
                <LegendItem color="lightgreen" text="Logged In" /> */}
              </View>
            </View>
          </View>
          <Modal
        transparent
        animationType="fade"
        visible={loaderModal}
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      </Modal>
        </>
      ) : (
        <>
          <View
            style={{
              height: '100%',
              backgroundColor: currentTheme.background,
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              marginTop: responsiveHeight(1.5),
              flex: 1,
            }}>
            <ScrollView>
              <View
                style={{
                  width: responsiveWidth(90),
                  backgroundColor: currentTheme.background,
                  alignSelf: 'center',
                  marginTop: responsiveHeight(1),
                  borderRadius: 20,
                  shadowColor: '#000',
                  shadowRadius: 10,
                  shadowOpacity: 0.6,
                  elevation: 8,
                  borderWidth: 0.5,
                  borderColor: '#30C1DD',
                  padding: 15,
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                }}>
                <Text
                  style={{
                    marginLeft: 10,
                    marginTop: 5,
                    color: currentTheme.text,
                    fontSize: 16,
                  }}>
                  This Month Attendance
                </Text>
                <View
                  style={{
                    width: '100%',
                    borderWidth: 0.8,
                    borderColor: currentTheme.text,
                    marginVertical: 10,
                  }}></View>

                <FlatList
                  style={{
                    alignSelf: 'center',
                    marginBottom: Platform.OS == 'ios' ? 20 : null,
                  }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={showData}
                  renderItem={renderServicesList}
                  keyExtractor={item => item.id}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginVertical: 0,
                }}>
                <TouchableOpacity
                  onPress={showFromDatePicker}
                  style={{
                    borderWidth: Platform.OS == 'ios' ? 0.2 : null,
                    marginHorizontal: 5,
                    borderRadius: 15,
                    backgroundColor: currentTheme.background,
                    padding: 15,
                    elevation: 7,
                    alignSelf: 'center',
                    marginTop: responsiveHeight(2.5),
                    borderWidth: 0.5,
                    borderColor: currentTheme.text,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: currentTheme.text,
                      textAlign: 'center',
                      marginTop: 5,
                    }}>
                    Start Date
                  </Text>
                  <View
                    style={{
                      backgroundColor: currentTheme.inputText_color,
                      flexDirection: 'row',
                      marginTop: 5,
                      borderRadius: 10,
                      padding: 8,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        marginHorizontal: 20,
                        color: currentTheme.text,
                      }}>
                      {fromDate ? fromDate : '-- / -- / ---- '}
                    </Text>
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: currentTheme.text,
                      }}
                      source={require('../../assets/Attendence/dates.png')}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={showToDatePicker}
                  style={{
                    borderWidth: Platform.OS == 'ios' ? 0.2 : null,
                    marginHorizontal: 5,
                    borderRadius: 15,
                    backgroundColor: currentTheme.background,
                    padding: 15,
                    elevation: 7,
                    alignSelf: 'center',
                    marginTop: responsiveHeight(2.5),
                    borderWidth: 0.5,
                    borderColor: currentTheme.text,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: currentTheme.text,
                      textAlign: 'center',
                      marginTop: 5,
                    }}>
                    End Date
                  </Text>
                  <View
                    style={{
                      backgroundColor: currentTheme.inputText_color,
                      flexDirection: 'row',
                      marginTop: 5,
                      borderRadius: 10,
                      padding: 8,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        marginHorizontal: 20,
                        color: currentTheme.text,
                      }}>
                      {toDate ? toDate : '-- / -- / ---- '}
                    </Text>
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: currentTheme.text,
                      }}
                      source={require('../../assets/Attendence/dates.png')}
                    />
                  </View>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isFromDatePickerVisible}
                  mode="date"
                  onConfirm={handleFromDateConfirm}
                  onCancel={hideFromDatePicker}
                />
                <DateTimePickerModal
                  isVisible={isToDatePickerVisible}
                  mode="date"
                  onConfirm={handleToDateConfirm}
                  onCancel={hideToDatePicker}
                />
              </View>
              <View
                style={{
                  width: responsiveWidth(90),
                  alignSelf: 'center',
                  marginBottom: 100,
                }}>
                <Text
                  style={{
                    color: currentTheme.text,
                    fontWeight: 'bold',
                    fontSize: 20,
                    padding: 5,
                    marginVertical: 5,
                  }}>
                  Logs
                </Text>
                {data?.data?.length > 0 ? (
                  <>
                    {data?.data?.map((elements, index) => {
                      return (
                        <View style={{flexDirection: 'row'}}>
                          <View
                            style={{
                              position: 'absolute',
                              justifyContent: 'center',
                            }}>
                            <View
                              style={{
                                borderWidth: 1.5,
                                height: 50,
                                width: 2,
                                elevation: 7,
                                backgroundColor: currentTheme.text,
                                opacity: 0.3,
                              }}></View>
                            <Image
                              style={{
                                height: 15,
                                width: 15,
                                marginLeft: -6,
                                resizeMode: 'contain',
                                position: 'absolute',
                                tintColor: currentTheme.text,
                              }}
                              source={require('../../assets/Attendence/point.png')}
                            />
                          </View>

                          <View
                            key={index}
                            style={{
                              marginBottom: 5,
                              justifyContent: 'space-between',
                              flex: 1,
                              flexDirection: 'row',
                              padding: 15,
                              borderRadius: 20,
                              marginLeft: 10,
                              backgroundColor: currentTheme.inputText_color,
                            }}>
                            <View>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: currentTheme.text,
                                }}>
                                {elements?.date}
                              </Text>

                              <Text
                                style={{
                                  fontSize: 16,
                                  color: currentTheme.text,
                                  fontWeight: 'bold',
                                }}>
                                {elements?.total_hours}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{
                                  color: currentTheme.text,
                                  fontSize: 15,
                                  marginTop: 4,
                                }}>
                                Punch In: {elements?.punch_in ?? '--'}
                              </Text>
                              <Text
                                style={{
                                  color: currentTheme.text,
                                  fontSize: 15,
                                }}>
                                Punch Out: {elements?.punch_out ?? '--'}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </>
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: currentTheme.text,
                    }}>
                    There are no avaliable Attendance
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>
       
        </>
      )}
    </SafeAreaView>
  );
};
export default Attendance;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E64',
  },

  name: {
    color: '#000',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  calendar: {
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 10,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'navy',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusItem: {
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusValue: {
    color: 'white',
    fontSize: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%', // Adjust the width as needed
    marginBottom: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: 'navy',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  button: {
    backgroundColor: '#0043ae',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
    width: responsiveWidth(15),
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
