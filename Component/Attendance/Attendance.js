import {
  Image,
  SafeAreaView,
  Modal,
  StyleSheet,
  TextInput,
  Text,
  View,
  FlatList,
  Switch,
  TouchableOpacity,
  ScrollView,
  Button,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import LinearGradient from 'react-native-linear-gradient';
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
import Themes from '../Theme/Theme';
import {ThemeContext} from '../../Store/ConetxtApi.jsx/ConextApi';

const Attendance = () => {
  const showData = [
    {
      id: 1,
      uri: require('../../assets/HomeScreen/calendar.png'),
      name: 'Working',
      num: 13,
      color: '#F2F4FF',
      backgroundcolor: '#7B9BF6',
      fontcolor: '#7B9BF6',
    },
    {
      id: 2,
      uri: require('../../assets/HomeScreen/leave.png'),
      name: 'Leave',
      num: 0,
      color: '#FFF6ED',
      backgroundcolor: '#F39331',
      fontcolor: '#F39331',
    },
    {
      id: 3,
      uri: require('../../assets/HomeScreen/medal.png'),
      name: 'Half Day',
      num: 0,
      color: '#EDFBFE',
      backgroundcolor: '#4EC8FA',
      fontcolor: '#4EC8FA',
    },
  ];
  const {currentTheme} = useContext(ThemeContext);

  const [startdate, setStartDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [selectedDate, setSelectedDate] = useState(null);
  const [todayAttendanceDetails, setTodayAttendanceDetails] = useState('');
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const StatusItem = ({color, text, value}) => (
    <View style={[styles.statusItem, {backgroundColor: color}]}>
      <Text style={styles.statusText}>{text}</Text>
      <Text style={styles.statusValue}>{value}</Text>
    </View>
  );

  const LegendItem = ({color, text}) => (
    <View style={styles.legendItem}>
      <View style={[styles.legendColor, {backgroundColor: color}]} />
      <Text style={[styles.legendText,{color:currentTheme.text}]}>{text}</Text>
    </View>
  );

  {
    /* This is Services card List */
  }

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

  const onDayPress = day => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  // api calling start

  useEffect(() => {
    getTodayAttendance();
  }, []);

  async function getTodayAttendance() {
    let token = await AsyncStorage.getItem('TOKEN');
    try {
      setLoader(true);
      const url = `${BASE_URL}/get-today-attendance`;
      const response = await gettodayattendance(url, token);
      if (response?.data?.status === true) {
        // showMessage({
        //     message: `${response?.data?.message}`,
        //     type: "success",
        // });
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
    if (fromDate && toDate) {
      getSearchAttendence();
    }
  }, [fromDate, toDate]);

  const getSearchAttendence = async () => {
    function formatDate(dateStr) {
      // Split the input date string by '/'
      const [month, day, year] = dateStr.split('/');

      // Pad month and day with leading zeros if needed
      const paddedMonth = month.padStart(2, '0');
      const paddedDay = day.padStart(2, '0');

      // Return the date in 'YYYY-MM-DD' format
      return `${year}-${paddedMonth}-${paddedDay}`;
    }

    try {
      let token = await AsyncStorage.getItem('TOKEN');

      let data = {
        from_date: fromDate,
        to_date: toDate,
      };

      // Convert the dates to the desired format
      data.from_date = formatDate(data.from_date);
      data.to_date = formatDate(data.to_date);

      console.log(data);

      setLoading(true);
      const url = `${BASE_URL}/search/filter/attendance`;
      const response = await getrecentattendence(url, data, token);
      if (response?.data?.status == true) {
        // showMessage({
        //     message: `${response?.data?.data}`,
        //     type: "success",
        // });
        setLoader(false);
        setData(response?.data);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error making POST request:', error);
      setLoading(false);
    }
  };

  // Calculate the difference
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
    setFromDate(date.toLocaleDateString()); // Format date as needed
    hideFromDatePicker();
  };

  const showToDatePicker = () => setToDatePickerVisibility(true);
  const hideToDatePicker = () => setToDatePickerVisibility(false);

  const handleToDateConfirm = date => {
    setToDate(date.toLocaleDateString()); // Format date as needed
    hideToDatePicker();
  };

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
                  height: responsiveHeight(20),
                  backgroundColor: currentTheme.background,
                  alignSelf: 'center',
                  marginTop:
                    Platform.OS == 'ios'
                      ? responsiveHeight(3)
                      : responsiveHeight(1.5),
                  borderRadius: 20,
                  shadowColor: '#30C1DD',
                  shadowRadius: 10,
                  shadowOpacity: 0.6,
                  elevation: 8,
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  borderWidth: 0.5,
                  borderColor: currentTheme.text,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      color: currentTheme.text,
                      fontSize: responsiveFontSize(2),
                    }}>
                    Today
                  </Text>
                  <Text
                    style={{
                      color: currentTheme.text,
                      fontSize: responsiveFontSize(2),
                    }}>
                    In Time
                  </Text>
                  <Text
                    style={{
                      color: currentTheme.text,
                      fontSize: responsiveFontSize(2),
                    }}>
                    Out Time
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    borderWidth: 0.5,
                    borderColor: currentTheme.text,
                    marginTop: 5,
                  }}></View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <Text
                    style={{
                      color: currentTheme.text,
                      fontSize: responsiveFontSize(1.6),
                    }}>
                    {todayAttendanceDetails == null
                      ? 'N/A'
                      : moment(
                          todayAttendanceDetails?.punch_in,
                          'YYYY-MM-DD HH:mm:ss',
                        ).format('dddd')}
                  </Text>
                  <Text
                    style={{
                      color: currentTheme.text,
                      fontSize: responsiveFontSize(1.6),
                    }}>
                    {todayAttendanceDetails == null
                      ? 'N/A'
                      : moment(
                          todayAttendanceDetails?.punch_in,
                          'YYYY-MM-DD HH:mm:ss',
                        ).format('hh:mm:ss A')}
                  </Text>
                  <Text
                    style={{color: '#000', fontSize: responsiveFontSize(1.6)}}>
                    {todayAttendanceDetails == null ||
                    todayAttendanceDetails?.punch_out == null
                      ? 'N/A'
                      : moment(
                          todayAttendanceDetails?.punch_out,
                          'YYYY-MM-DD HH:mm:ss',
                        ).format('hh:mm:ss A')}
                  </Text>
                </View>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 50,
                    borderWidth: 1,
                    marginTop: 10,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: currentTheme.text,
                  }}>
                  <Text style={{color: currentTheme.text, fontSize: 16}}>
                    {todayAttendanceDetails == null ||
                    todayAttendanceDetails?.punch_out == null
                      ? 'N/A'
                      : `${hours}h ${minutes}m`}
                  </Text>
                </View>
              </View>
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
                  <Image
                    style={{
                      height: 50,
                      width: 50,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                      tintColor: currentTheme.text,
                    }}
                    source={require('../../assets/Attendence/thumb.png')}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      color: currentTheme.text,
                      textAlign: 'center',
                      marginTop: 5,
                    }}>
                    Form Date
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
                  <Image
                    style={{
                      height: 50,
                      width: 50,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                      tintColor: currentTheme.text,
                    }}
                    source={require('../../assets/Attendence/thumb.png')}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      color: currentTheme.text,
                      textAlign: 'center',
                      marginTop: 5,
                    }}>
                    To Date
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

              {/* Logs codes */}
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
                                backgroundColor: currentTheme.background,
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
                              backgroundColor: '#EDFBFE',
                            }}>
                            <Text
                              style={{fontSize: 16, color: currentTheme.text}}>
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
                        </View>
                      );
                    })}
                  </>
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: Themes == 'dark' ? '#000' : '#000',
                    }}>
                    There are no avaliable Attendance
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>
        </>
      ) : (
        <>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: currentTheme.background,
              borderTopLeftRadius: 40,
              marginTop: !isEnabled
                ? responsiveHeight(12)
                : responsiveHeight(3),
              borderTopRightRadius: 40,
            }}>
            <View style={{marginHorizontal: 15}}>
              {/* Calendar */}
              <Calendar
                // You can customize the calendar here
                theme={{
                  selectedDayBackgroundColor: currentTheme.text,
                  todayTextColor: currentTheme.text,
                  arrowColor: currentTheme.text,
                }}
                style={[
                  styles.calendar,
                  {backgroundColor: currentTheme.background},
                ]}
                markedDates={{
                  '2024-05-09': {
                    selected: true,
                    selectedColor: currentTheme.text,
                  },
                }}
                onDayPress={onDayPress}
              />

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalContainer}>
                  <View style={[styles.modalView,{backgroundColor:currentTheme.modalBack}]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color:currentTheme.text,
                          fontWeight: '500',
                          fontSize: 18,
                        }}>
                        Attendance Details
                      </Text>
                      <TouchableOpacity
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Entypo
                          style={{}}
                          name="circle-with-cross"
                          size={30}
                          color={currentTheme.text}
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        borderWidth: 0.5,
                        marginVertical: 5,
                        elevation: 1,
                        opacity: 0.3,
                        borderColor: currentTheme.text,
                      }}></View>
                    <View
                      style={{
                        backgroundColor:currentTheme.background,
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
                        10 May 2024
                      </Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 0.5,
                        marginVertical: 5,
                        elevation: 1,
                        opacity: 0.3,
                        borderColor:currentTheme.text,
                      }}></View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={{alignSelf: 'flex-start'}}>
                        <Text
                          style={{
                            color:currentTheme.text,
                            fontSize: 16,
                            marginVertical: 10,
                          }}>
                          Punch In
                        </Text>
                        <Text
                          style={{
                            color:currentTheme.text,
                            fontSize: 16,
                            marginVertical: 10,
                          }}>
                          Punch Out
                        </Text>
                        <Text
                          style={{
                            color: currentTheme.text,
                            fontSize: 16,
                            marginVertical: 10,
                          }}>
                          Working Hours
                        </Text>
                        <Text
                          style={{
                            color: currentTheme.text,
                            fontSize: 16,
                            marginVertical: 10,
                          }}>
                          Status
                        </Text>
                      </View>

                      <View style={{alignSelf: 'flex-end'}}>
                        <View
                          style={{
                            backgroundColor: currentTheme.background,
                            borderRadius: 10,
                            marginVertical: 5,
                          }}>
                          <Text
                            style={{color: currentTheme.text, fontSize: 16, padding: 5}}>
                            09:30 AM
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: currentTheme.background,
                            borderRadius: 10,
                            marginVertical: 5,
                          }}>
                          <Text
                            style={{color: currentTheme.text, fontSize: 16, padding: 5}}>
                            09:30 AM
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: currentTheme.background,
                            borderRadius: 10,
                            marginVertical: 5,
                          }}>
                          <Text
                            style={{color: currentTheme.text, fontSize: 16, padding: 5}}>
                            09:30 AM
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: currentTheme.background,
                            borderRadius: 10,
                            marginVertical: 5,
                          }}>
                          <Text
                            style={{
                              color: currentTheme.text,
                              fontSize: 16,
                              padding: 5,
                              textAlign: 'center',
                            }}>
                            Absent
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>

              {/* Status Section */}
              <View
                style={[
                  styles.statusContainer,
                  {backgroundColor: currentTheme.background_v2},
                ]}>
                <StatusItem color="green" text="Present" value="0.0" />
                <StatusItem color="red" text="Absent" value="0.0" />
                <StatusItem color="orange" text="Leave" value="0.0" />
                <StatusItem color="blue" text="Holiday" value="0.0" />
                <StatusItem color="pink" text="Halfday" value="0.0" />
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
                <LegendItem color="yellow" text="Leave Without Pay" />
                <LegendItem color="lightgreen" text="Logged In" />
              </View>
            </View>
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
});
