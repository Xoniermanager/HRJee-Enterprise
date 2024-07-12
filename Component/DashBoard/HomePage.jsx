import { Dimensions, StyleSheet, Text, View, Image, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native'
import React, { useState, useEffect, useMemo } from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import LinearGradient from 'react-native-linear-gradient';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { ScrollView } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../utils';
import axios from 'axios';
import { LeaveApply, getLeaveType, getProfile } from '../../APINetwork/ComponentApi';
import { Dropdown } from 'react-native-element-dropdown';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import { showMessage } from "react-native-flash-message";


const HomePage = ({ navigation }) => {

  ///////////

  // const [selected, setSelected] = useState('');
  const [monthDay, setMonth] = useState('');
  const date = new Date(selected);
  const month = date.toLocaleString('default', { month: 'long' }); // Get full month name
  // const month = date.getMonth() + 1; // Get month number (1-12)

  // const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const [getleavetypeapidata, setGetLeaveTypeApiData] = useState([])
  const [loader, setLoader] = useState(false);
  const [value1, setValue1] = useState()
  const [isFocus, setIsFocus] = useState(false);
  const [reason, setReason] = useState(false);
  const [selectedId, setSelectedId] = useState('')
  const [selectedId1, setSelectedId1] = useState('')
  const [selectedId2, setSelectedId2] = useState('')
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [getProfileApiData, setGetProfileApiData] = useState('');

  const [holidays, setHolidays] = useState([]);
  const [monthlyHolidays, setMonthlyHolidays] = useState([]);

  const getMonthlyHolidays = (dateString) => {
      const selectedMonth = new Date(dateString).getMonth() + 1;
      const filteredHolidays = holidays?.filter(holiday => {
          const holidayMonth = new Date(holiday.date).getMonth() + 1;
          return holidayMonth === selectedMonth;
      });
      setMonthlyHolidays(filteredHolidays);
  };

  useEffect(() => {
    async function check() {
      try {
        setLoader(true);
        let token = await AsyncStorage.getItem('TOKEN');
        const url = `${BASE_URL}/profile`;
        const response = await getProfile(url, token);

        if (response?.data?.status === true) {
          showMessage({
            message: `${response?.data?.message}`,
            type: "success",
          });
          setGetProfileApiData(response?.data?.data);
          setLoader(false);
        } else {
          setLoader(false);
        }
      } catch (error) {
        console.error('Error making POST request:', error);
        setLoader(false);
      }
    }
    check();
  }, []);
  console.log("choose------", selectedId)


  useEffect(() => {
    async function check() {

      try {
        setLoader(true);
        let token = await AsyncStorage.getItem('TOKEN');

        const url = `${BASE_URL}/leave/type`;
        const response = await getLeaveType(url, token);
        if (response?.data?.status == true) {
          // showMessage({
          //     message: `${response?.data?.message}`,
          //     type: "success",
          // });
          setGetLeaveTypeApiData(response?.data?.data)
          setLoader(false);
        }
        else {
          setLoader(false);
        }
      } catch (error) {
        console.error('Error making POST request:', error);
        setLoader(false);
      }
    }
    check()
  }, [])

  const radioButtons: RadioButtonProps[] = useMemo(() => ([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Morning',
      value: 'first_half'
    },
    {
      id: '2',
      label: 'Afternoon',
      value: 'second_half'
    }
  ]), []);
  const radioButtons1: RadioButtonProps[] = useMemo(() => ([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Morning',
      value: 'option1'
    },
    {
      id: '2',
      label: 'Afternoon',
      value: 'option2'
    }
  ]), []);
  const radioButtons2: RadioButtonProps[] = useMemo(() => ([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Morning',
      value: 'option1'
    },
    {
      id: '2',
      label: 'Afternoon',
      value: 'option2'
    }
  ]), []);

  // Get the current date
  const currentDate = new Date();

  // Format the date as "Friday, 5 April 2024"
  const options = { weekday: 'long', day: 'numeric', year: 'numeric', month: 'long' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);

  const calculateDaysBetweenDates = () => {
    // Ensure startDate and endDate are valid dates
    if (!startDate || !endDate) {
      return 0; // Handle the case where either date is not set
    }

    // Convert startDate and endDate to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds
    const differenceInMs = Math.abs(end - start);

    // Convert milliseconds to days
    const daysDifference = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

    return daysDifference;
  };

  // Example usage
  const daysBetween = calculateDaysBetweenDates();

  const handlePress = (type) => {
    const currentDate = selected; // Get the currently selected date
    if (type === 1) {
      setStartDate(currentDate); // Set start date
    } else if (type === 2) {
      setEndDate(currentDate); // Set end date
    }
    setSelected(currentDate); // Highlight selected date
  };

  // This is starting api part

  useEffect(() => {
    async function check() {

      try {
        setLoader(true);
        let token = await AsyncStorage.getItem('TOKEN');

        const url = `${BASE_URL}/leave/type`;
        const response = await getLeaveType(url, token);
        if (response?.data?.status == true) {
          // showMessage({
          //     message: `${response?.data?.message}`,
          //     type: "success",
          // });
          setGetLeaveTypeApiData(response?.data?.data)
          setLoader(false);
        }
        else {
          setLoader(false);
        }
      } catch (error) {
        console.error('Error making POST request:', error);
        setLoader(false);
      }
    }
    check()
  }, [])

  const handleSubmit = async () => {
    try {
      if (startDate == "" || startDate == [] || startDate == undefined) {
        showMessage({
          message: "Please select startdate",
          type: "danger",
        });
      }
      else if (endDate == "" || endDate == [] || endDate == undefined) {
        showMessage({
          message: "Please select enddate",
          type: "danger",
        });
      }
      else if (value1 == undefined || value1 == "" || value1 == []) {
        showMessage({
          message: "Please select leave type",
          type: "danger",
        });
      }
      else if (reason == "") {
        showMessage({
          message: "Please enter reason",
          type: "danger",
        });
      }
      else {
        setLoader(true);
        const token = await AsyncStorage.getItem('TOKEN')
        const url = `${BASE_URL}/apply/leave`;

        let data = {
          leave_type_id: value1,
          from: startDate,
          to: endDate,
          reason: reason,
        };

        if (toggleCheckBox) {
          if (startDate == endDate) {
            data.is_half_day = true;
            data.from_half_day = selectedId == 1 ? 'first_half' : 'second_half';
          } else {
            data.is_half_day = true;
            data.from_half_day = selectedId1 == 1 ? 'first_half' : 'second_half';
            data.to_half_day = selectedId2 == 1 ? 'first_half' : 'second_half';
          }
        }

        console.log("payload------------", data)
        const response = await LeaveApply(url, data, token);
        if (response?.data?.status == true) {
          showMessage({
            message: `${response?.data?.message}`,
            type: "success",
          });
          setLoader(false);
        }
        else {
          setLoader(false);
        }
      }
    } catch (error) {
      console.error('Error making POST request:', error);
      setLoader(false);
    }
  };

  //////////
  const services = [
    {
      id: "1",
      name: "Policies",
      uri: require('../../assets/HomeScreen/h1.png')
    },
    {
      id: "2",
      name: "News",
      uri: require('../../assets/HomeScreen/h2.png')
    },
    {
      id: "3",
      name: "Payslip",
      uri: require('../../assets/HomeScreen/h3.png')
    }]

  {/* This is Services card List */ }

  const renderServicesList = ({ item }) => (
    <View>
      <Image style={{ height: responsiveHeight(18), width: responsiveWidth(35), resizeMode: "contain", overflow: 'hidden' }} source={item.uri} />
      <Text style={{ position: 'absolute', bottom: 5, alignSelf: 'center', fontSize: responsiveFontSize(2.5), color: '#fff', fontWeight: '500' }}>{item.name}</Text>
    </View>
  );

  {/* THis code is less more */ }

  const [expandedholiday, setExpandedHoliday] = useState(false);
  const toggleExpandedHoliday = () => {
    setExpandedHoliday(!expandedholiday);
  };

  const [expandedapplyleave, setExpandedApplyLeave] = useState(false);
  const toggleExpandedApplyLeave = () => {
    setExpandedApplyLeave(!expandedapplyleave);
  };

  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };


  const [selected, setSelected] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false)

  {/* THis code is less more */ }

  const [expandedprofile, setExpandedProfile] = useState(false);


  const toggleExpandedProfile = () => {
    setExpandedProfile(!expandedprofile);
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.parent}>
          <View style={styles.child}>
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 15 }}>
              {
                getProfileApiData?.profile_image == "" || getProfileApiData?.profile_image == [] || getProfileApiData?.profile_image == null ?
                  <Image style={{ height: 120, width: 120, resizeMode: "contain", alignSelf: "center" }} source={require('../../assets/HomeScreen/profile.png')} />
                  :
                  <Image style={{ height: 120, width: 120, resizeMode: "contain", alignSelf: "center" }} source={{ uri: 'https://i.postimg.cc/L69jybXV/512.png' }} // Replace with the actual image URL
                  />

              }
              <View style={{ marginHorizontal: 15 }}>
                <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>{getProfileApiData?.name}</Text>
                <Text style={{ color: "#fff", fontSize: 18, }}>{formattedDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* This is map function using */}

        {/* {
          services?.map((elements, index) => {
            return (
              <View style={{  }}>
                <View key={index}>
                  <View><Image style={{ height: 100, width: 100 }} source={elements.uri} /></View>
                </View>
              </View>
            )
          })

        } */}

        {/* This is Services list */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginBottom: 100, width: responsiveWidth(95), alignSelf: "center", marginTop: responsiveHeight(2) }}>
            <FlatList horizontal showsHorizontalScrollIndicator={false}
              data={services}
              renderItem={renderServicesList}
              keyExtractor={item => item.id}
            />

            {/* This is Punch in & Punch out */}
            <View style={{ marginBottom: responsiveHeight(1), padding: 20, backgroundColor: "#0E0E64", borderColor: "#0433DA", borderRadius: 20, borderWidth: 5, flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
              <View>
                <Text style={{ color: "#00f0ff", fontSize: 18, marginBottom: 5 }}>Friday</Text>
                <Text style={{ color: "#00f0ff", fontSize: 18, marginTop: 5 }}>05-04-2024</Text>
              </View>
              <View style={{ borderColor: "#00f0ff", borderWidth: 1, }}></View>
              <View>
                <Text style={{ color: "#00f0ff", fontSize: 18, marginBottom: 5, width: responsiveWidth(35), textAlign: "center" }}>09:30:00</Text>
                <TouchableOpacity style={{ backgroundColor: "#00f0ff", borderRadius: 20, }}>
                  <Text style={{ textAlign: "center", color: "#000", padding: 8, fontSize: 18, }}>Punch in</Text>
                </TouchableOpacity>
              </View>

            </View>

            {/* This is apply leave  */}
            <View>
              <View style={{ backgroundColor: "#AA9AFD", marginTop: responsiveHeight(1), borderTopLeftRadius: 10, borderBottomLeftRadius: expandedapplyleave == true ? 0 : 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                <View style={{ width: "98%", marginLeft: "2%", backgroundColor: "#fff", opacity: 1, elevation: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: expandedapplyleave == true ? 0 : 10, borderTopRightRadius: 10, borderBottomRightRadius: expandedapplyleave == true ? 0 : 10, padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <LinearGradient style={{ padding: 10, borderRadius: 10 }} colors={['#AA9AFD', '#8370ED',]}>
                    <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/h5.png')} />
                  </LinearGradient>
                  <Text style={{ color: "#000", fontSize: responsiveFontSize(2.3) }}>Apply Leave</Text>
                  <TouchableOpacity onPress={toggleExpandedApplyLeave}>
                    {
                      expandedapplyleave ?
                        <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/up.png')} />
                        :
                        <>
                          <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/down.png')} />

                        </>
                    }
                  </TouchableOpacity>
                </View>
              </View>
              {
                expandedapplyleave ?
                  <View style={{ backgroundColor: "#AA9AFD", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                    <View style={{ width: "98%", marginLeft: "2%", backgroundColor: "#fff", borderTopLeftRadius: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                      <ScrollView
                        style={{
                          width: '100%',
                        }}>
                        <View style={{ flexDirection: "row", alignSelf: "center", alignItems: "center", justifyContent: "space-between" }}>
                          <View style={{ alignItems: "center", marginHorizontal: responsiveWidth(2) }}>
                            <TouchableOpacity onPress={() => handlePress(1)} style={{ backgroundColor: "#0E0E64", borderRadius: 100, height: 90, width: 90, justifyContent: "center" }}>
                              <Text style={{ color: "#fff", textAlign: "center" }}>{startDate ? new Date(startDate).getDate() : 'Start'}</Text>
                              <Text style={{ color: "#fff", textAlign: "center" }}>{startDate ? new Date(startDate).toLocaleString('default', { month: 'long' }) : 'Date'}</Text>
                            </TouchableOpacity>
                            <Image style={{ height: 50, width: 50, }} source={require('../../assets/ApplyLeave/arrow-down.png')} />
                            <TouchableOpacity onPress={() => handlePress(2)} style={{ backgroundColor: "#0E0E64", borderRadius: 100, height: 90, width: 90, justifyContent: "center" }}>
                              <Text style={{ color: "#fff", textAlign: "center" }}>{endDate ? new Date(endDate).getDate() : 'End'}</Text>
                              <Text style={{ color: "#fff", textAlign: "center" }}>{endDate ? new Date(endDate).toLocaleString('default', { month: 'long' }) : 'Date'}</Text>
                            </TouchableOpacity>
                            <Text style={{ color: "#0E0E64", fontSize: 18, marginTop: responsiveHeight(1) }}>{daysBetween} Days</Text>
                          </View>
                          <View style={{ marginHorizontal: responsiveWidth(2) }}>
                            <Calendar style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: "#fff", elevation: 7, width: responsiveWidth(60) }}
                              onDayPress={day => {
                                setSelected(day.dateString);
                                setMonth(day);

                                if (!startDate) {
                                  setStartDate(day.dateString); // Set start date if it's not already set
                                } else if (!endDate) {
                                  setEndDate(day.dateString); // Set end date if start date is already set
                                }
                              }}
                              markedDates={{
                                [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' },
                                [startDate]: { startingDay: true, color: 'orange', textColor: 'white' },
                                [endDate]: { endingDay: true, color: 'orange', textColor: 'white' },
                              }}
                            />


                            {/* <Text>End date greater then start date</Text> */}
                          </View>
                        </View>
                        {
                          startDate > endDate ?
                            showMessage({
                              message: `End date greater then start date, Please select valid details`,
                              type: "danger",
                            })
                            // <Text style={{ textAlign: "center" }}>End date greater then start date, Please select valid details</Text>
                            :
                            null
                        }
                        <View style={{ flexDirection: "row", marginHorizontal: responsiveWidth(2) }}>
                          <CheckBox
                            disabled={false}
                            value={toggleCheckBox}
                            onValueChange={(newValue) => setToggleCheckBox(newValue)}
                          />
                          <Text style={{ alignSelf: "center", fontSize: 16, color: "#000" }}>Is half day</Text>
                        </View>
                        {
                          toggleCheckBox == true ?
                            startDate == endDate ?
                              <View style={{ borderRadius: 10, backgroundColor: "#EDFBFE", padding: 5, marginHorizontal: responsiveWidth(2) }}>
                                <RadioGroup containerStyle={{ flexDirection: "row" }}
                                  radioButtons={radioButtons}
                                  onPress={setSelectedId}
                                  selectedId={selectedId}
                                />
                              </View>
                              :
                              <View style={{ borderRadius: 10, backgroundColor: "#EDFBFE", padding: 5, marginHorizontal: responsiveWidth(2) }}>
                                <Text style={{ color: "#000" }}>First day of leave</Text>
                                <RadioGroup containerStyle={{ flexDirection: "row" }}
                                  radioButtons={radioButtons1}
                                  onPress={setSelectedId1}
                                  selectedId={selectedId1}
                                />
                                <Text style={{ color: "#000" }}>Last day of leave</Text>
                                <RadioGroup containerStyle={{ flexDirection: "row" }}
                                  radioButtons={radioButtons2}
                                  onPress={setSelectedId2}
                                  selectedId={selectedId2}
                                />
                              </View>
                            :
                            null
                        }

                        {/* This is profile details */}
                        <View style={{ marginHorizontal: responsiveWidth(2), marginTop: responsiveHeight(1), borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                          {
                            getleavetypeapidata?.map((item, index) => {
                              return (
                                <View key={index} style={{ backgroundColor: "#EDFBFE", padding: 10, marginBottom: 5, borderRadius: 10 }}>
                                  <Dropdown selectedTextProps={{
                                    style: {
                                      color: '#000',
                                    },
                                  }}
                                    style={styles.input}
                                    placeholderStyle={styles.placeholderStyle}
                                    data={getleavetypeapidata && getleavetypeapidata}
                                    maxHeight={300}
                                    labelField="name"
                                    valueField="id"
                                    placeholder={!isFocus ? 'Select leave type' : '...'}
                                    value={value1 ? value1 : item?.state_id}
                                    onChange={item => {
                                      setValue1(item.id);
                                    }}
                                  />
                                </View>

                              )
                            })
                          }

                          <View style={{ borderRadius: 30, marginBottom: 8, padding: 5, backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, }}>
                            <TextInput
                              placeholder='Reason'
                              numberOfLines={6}
                              textAlignVertical={'top'}
                              onChangeText={(text) => setReason(text)}
                            />
                          </View>

                        </View>

                        <TouchableOpacity onPress={() => handleSubmit()} style={{ marginBottom: 5, backgroundColor: "#0433DA", padding: 15, width: "60%", alignSelf: "center", borderRadius: 50 }}>
                          <Text style={{ textAlign: "center", color: "#fff", fontSize: 18, fontWeight: "bold" }}>Submit</Text>
                        </TouchableOpacity>

                      </ScrollView>
                    </View>
                  </View> :
                  null
              }
            </View>

            {/* This is Holiday management */}
            <View>
              <View style={{ backgroundColor: "#8AEBC3", marginTop: responsiveHeight(1), borderTopLeftRadius: 10, borderBottomLeftRadius: expandedholiday == true ? 0 : 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                <View style={{ width: "98%", marginLeft: "2%", backgroundColor: "#fff", opacity: 1, elevation: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: expandedholiday == true ? 0 : 10, borderTopRightRadius: 10, borderBottomRightRadius: expandedholiday == true ? 0 : 10, padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <LinearGradient style={{ padding: 10, borderRadius: 10 }} colors={['#8AEBC3', '#39CB8E',]}>
                    <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/calendar.png')} />
                  </LinearGradient>
                  <Text style={{ color: "#000", fontSize: responsiveFontSize(2.3) }}>Holiday Management</Text>
                  <TouchableOpacity onPress={toggleExpandedHoliday}>
                    {
                      expandedholiday ?
                        <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/up.png')} />
                        :
                        <>
                          <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/down.png')} />

                        </>
                    }
                  </TouchableOpacity>
                </View>
              </View>
              {
                expandedholiday ?
                  <View style={{ backgroundColor: "#8AEBC3", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                    <View style={{ width: "98%", marginLeft: "2%", backgroundColor: "#fff", borderTopLeftRadius: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                      <ScrollView
                        style={{
                          width: '100%',
                          backgroundColor: '#fff',
                          borderTopLeftRadius: 40,
                          borderTopRightRadius: 40,
                        }}>

                        <Calendar
                          style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: "#fff" }}
                          onDayPress={day => {
                            setSelected(day.dateString);
                            getMonthlyHolidays(day.dateString);
                          }}
                          markedDates={{
                            [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                          }}
                        />

                        <View style={{ marginHorizontal: responsiveWidth(5) }}>
                          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ color: "#0E0E64", marginVertical: 10, fontSize: 18, fontWeight: "500" }}>Holiday of the month</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('HolidayList')}>
                              <Text style={{ color: "#0E0E64", marginVertical: 10, fontSize: 18, fontWeight: "500" }}>View all</Text>
                            </TouchableOpacity>
                          </View>
                          {monthlyHolidays?.length > 0 ? (
                            monthlyHolidays?.map((holiday, index) => (
                              <View key={index} style={{ height: responsiveHeight(10), borderRadius: 15, flexDirection: "row", backgroundColor: "#fff", borderWidth: 0.5, borderColor: "#0E0E64", elevation: 3, marginBottom: 5 }}>
                                <View style={{ marginLeft: 20, backgroundColor: "#0E0E64", height: 70, width: 50, justifyContent: "center", borderBottomRightRadius: 30, borderBottomLeftRadius: 30 }}>
                                  <Image style={{ height: 30, width: 30, resizeMode: "contain", alignSelf: "center" }} source={require('../../assets/HomeScreen/calendar.png')} />
                                </View>
                                <View style={{ marginLeft: 20, justifyContent: "center" }}>
                                  <Text style={{ color: "#0E0E64", fontSize: 18, fontWeight: "500" }}>{holiday.name}</Text>
                                  <Text style={{ color: "#0E0E64", fontSize: 18, fontWeight: "500" }}>{holiday.date}</Text>
                                </View>
                              </View>
                            ))
                          ) : (
                            <Text style={{ color: "#0E0E64", fontSize: 18, fontWeight: "500" , textAlign:"center"}}>No holidays available this month</Text>
                          )}
                        </View>
                      </ScrollView>
                    </View>
                  </View> :
                  null
              }
            </View>

            {/* This is recent attendence */}
            <View>
              <View style={{ backgroundColor: "#FABED7", marginTop: responsiveHeight(1), borderTopLeftRadius: 10, borderBottomLeftRadius: expanded == true ? 0 : 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                <View style={{ width: "98%", marginLeft: "2%", backgroundColor: "#fff", opacity: 1, elevation: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: expanded == true ? 0 : 10, borderTopRightRadius: 10, borderBottomRightRadius: expanded == true ? 0 : 10, padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <LinearGradient style={{ padding: 10, borderRadius: 10 }} colors={['#FABED7', '#FF94C3',]}>
                    <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/recentattendance.png')} />
                  </LinearGradient>
                  <Text style={{ color: "#000", fontSize: responsiveFontSize(2.3) }}>Recent Attendance</Text>
                  <TouchableOpacity onPress={toggleExpanded}>
                    {
                      expanded ?
                        <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/up.png')} />
                        :
                        <>
                          <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/down.png')} />

                        </>
                    }
                  </TouchableOpacity>
                </View>
              </View>
              {
                expanded ?
                  <View style={{ backgroundColor: "#FABED7", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                    <View style={{ width: "98%", marginLeft: "2%", backgroundColor: "#fff", borderTopLeftRadius: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                      <View style={{ flex: 1, borderColor: '#4148fe', borderTopWidth: 0.8, }}></View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10, marginVertical: 8 }}>
                        <View style={{}}>
                          <Text style={{ color: "#000", fontSize: 20, fontWeight: "500" }}>Monday</Text>
                          <Text style={{ color: "#000", fontSize: 18 }}>08-04-2024</Text>
                        </View>
                        <View style={{}}>
                          <Image style={{ color: "#000", fontSize: 20, fontWeight: "500", height: 30, width: 30, alignSelf: "center" }} source={require('../../assets/HomeScreen/clock.png')} />
                          <Text style={{ color: "#000", fontSize: 18, textAlign: "center" }}>08:20</Text>
                        </View>
                      </View>
                    </View>
                  </View> :
                  null
              }
            </View>
          </View>
        </ScrollView>
      </View>
    </>


  )
}

export default HomePage

const styles = StyleSheet.create({
  parent: {
    height: '25%',
    width: '100%',
    transform: [{ scaleX: 2 }],
    borderBottomStartRadius: 200,
    borderBottomEndRadius: 200,
    overflow: 'hidden'
  },
  child: {
    flex: 1,
    transform: [{ scaleX: 0.5 }],
    backgroundColor: '#0E0E64',
    justifyContent: 'center',
  }
})