import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useMemo, useContext} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import CheckBox from '@react-native-community/checkbox';
import {
  LeaveApply,
  getLeaveType,
  token,
} from '../../../APINetwork/ComponentApi';
import {BASE_URL} from '../../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import {Dropdown} from 'react-native-element-dropdown';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import ApplyLeaveSkeleton from '../../Skeleton/ApplyLeaveSkeleton';
import Themes from '../../Theme/Theme';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';

const ApplyLeave = ({navigation}) => {
  const {currentTheme} = useContext(ThemeContext);
  const [selected, setSelected] = useState('');
  const [monthDay, setMonth] = useState('');
  const date = new Date(selected);
  const month = date.toLocaleString('default', {month: 'long'});
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [getleavetypeapidata, setGetLeaveTypeApiData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loaderApply, setLoaderApply] = useState(false);
  const [value1, setValue1] = useState();
  const [isFocus, setIsFocus] = useState(false);
  const [reason, setReason] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [selectedId1, setSelectedId1] = useState('');
  const [selectedId2, setSelectedId2] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [availableLeavesList, setAvailableLeavesList] = useState(null);
  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1',
        label: 'Morning',
        value: 'first_half',
        labelStyle: {color: '#fff'}, // Customize label style here
      },
      {
        id: '2',
        label: 'Afternoon',
        value: 'second_half',
        labelStyle: {color: '#fff'}, // Customize label style here
      },
    ],
    [],
  );
  const radioButtons1: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Morning',
        value: 'option1',
        labelStyle: {color: '#fff'}, // Customize label style here
      },
      {
        id: '2',
        label: 'Afternoon',
        value: 'option2',
        labelStyle: {color: '#fff'}, // Customize label style here
      },
    ],
    [],
  );
  const radioButtons2: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1',
        label: 'Morning',
        value: 'option1',
        labelStyle: {color: '#fff'},
      },
      {
        id: '2',
        label: 'Afternoon',
        value: 'option2',
        labelStyle: {color: '#fff'},
      },
    ],
    [],
  );
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
  const daysBetween = calculateDaysBetweenDates();
  const handlePress = type => {
    const currentDate = selected;
    if (type === 1) {
      setStartDate(currentDate);
    } else if (type === 2) {
      setEndDate(currentDate);
    }
    setSelected(currentDate);
  };
  async function check() {
    try {
      setLoader(true);
      let token = await AsyncStorage.getItem('TOKEN');

      const url = `${BASE_URL}/leave-types`;
      const response = await getLeaveType(url, token);
      if (response?.data?.status == true) {
        setGetLeaveTypeApiData(response?.data?.data);
        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.log('Error making POST request:', error);
      setLoader(false);
    }
  }
  async function availableLeaves() {
    try {
      setLoader(true);
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/available-leaves`;
      const response = await getLeaveType(url, token);
      if (response?.data?.status) {
        setLoader(false);
        setAvailableLeavesList(response?.data?.data);
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.log('Error making POST request:', error);
    }
  }
  useEffect(() => {
    check();
    availableLeaves();
  }, []);
  if (availableLeaves == null) {
    return <ApplyLeaveSkeleton />;
  }

  const handleSubmit = async () => {
    try {
      if (startDate == '' || startDate == [] || startDate == undefined) {
        showMessage({
          message: 'Please select startdate',
          type: 'danger',
        });
      } else if (endDate == '' || endDate == [] || endDate == undefined) {
        showMessage({
          message: 'Please select enddate',
          type: 'danger',
        });
      } else if (value1 == undefined || value1 == '' || value1 == []) {
        showMessage({
          message: 'Please select leave type',
          type: 'danger',
        });
      } else if (reason == '') {
        showMessage({
          message: 'Please enter reason',
          type: 'danger',
        });
      } else {
        setLoaderApply(true);
        const token = await AsyncStorage.getItem('TOKEN');
        const url = `${BASE_URL}/apply/leave`;
        let data = {
          leave_type_id: value1,
          from: startDate,
          to: endDate,
          is_half_day: toggleCheckBox ? 1 : 0,
          reason: reason,
          ...(toggleCheckBox && {
            from_half_day: selectedId1 == 1 ? 'first_half' : 'second_half',
            to_half_day: selectedId2 == 1 ? 'first_half' : 'second_half',
          }),
        };

        if (toggleCheckBox) {
          if (startDate == endDate) {
            data.is_half_day = true;
            data.from_half_day = selectedId == 1 ? 'first_half' : 'second_half';
          } else {
            data.is_half_day = true;
            data.from_half_day =
              selectedId1 == 1 ? 'first_half' : 'second_half';
            data.to_half_day = selectedId2 == 1 ? 'first_half' : 'second_half';
          }
        }

        const response = await LeaveApply(url, data, token);
        setLoaderApply(false);
        if (response?.data?.status == true) {
          showMessage({
            message: `${response?.data?.message}`,
            type: 'success',
          });
          navigation.goBack();
        } else {
        }
      }
    } catch (error) {
      setLoaderApply(false);
      showMessage({
        message: `${error.response.data.message}`,
        type: 'danger',
      });
      setLoader(false);
    }
  };

 
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
      <View style={{alignSelf: 'center', marginTop: 15}}></View>
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: currentTheme.background,
          borderTopLeftRadius: 40,
          marginTop: responsiveHeight(3),
          borderTopRightRadius: 40,
        }}>
        {loader ? (
          <ApplyLeaveSkeleton />
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
                marginTop: responsiveHeight(3),
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  alignItems: 'center',
                  marginHorizontal: responsiveWidth(2),
                }}>
                <TouchableOpacity
                  onPress={() => handlePress(1)}
                  style={{
                    backgroundColor: currentTheme.background_v2,
                    borderRadius: 100,
                    height: 90,
                    width: 90,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{color: '#fff', fontSize: 15, textAlign: 'center'}}>
                    {startDate ? new Date(startDate).getDate() : 'Start'}
                  </Text>
                  <Text
                    style={{color: '#fff', fontSize: 15, textAlign: 'center'}}>
                    {startDate
                      ? new Date(startDate).toLocaleString('default', {
                          month: 'long',
                        })
                      : 'Date'}
                  </Text>
                </TouchableOpacity>
                <Image
                  style={{height: 50, width: 50, tintColor: currentTheme.text}}
                  source={require('../../../assets/ApplyLeave/arrow-down.png')}
                />
                <TouchableOpacity
                  onPress={() => handlePress(2)}
                  style={{
                    backgroundColor: currentTheme.background_v2,
                    borderRadius: 100,
                    height: 90,
                    width: 90,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{color: '#fff', fontSize: 15, textAlign: 'center'}}>
                    {endDate ? new Date(endDate).getDate() : 'End'}
                  </Text>
                  <Text
                    style={{color: '#fff', fontSize: 15, textAlign: 'center'}}>
                    {endDate
                      ? new Date(endDate).toLocaleString('default', {
                          month: 'long',
                        })
                      : 'Date'}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    color: currentTheme.text,
                    fontSize: 18,
                    marginTop: responsiveHeight(1),
                  }}>
                  {daysBetween} Days
                </Text>
              </View>
              <View style={{marginHorizontal: responsiveWidth(2)}}>
                <Calendar
                  style={{
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    backgroundColor: currentTheme.background,
                    elevation: 7,
                    width: responsiveWidth(70),
                  }}
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
                    [selected]: {
                      selected: true,
                      disableTouchEvent: true,
                      selectedDotColor: 'orange',
                    },
                    [startDate]: {
                      startingDay: true,
                      color: 'orange',
                      textColor: 'white',
                    },
                    [endDate]: {
                      endingDay: true,
                      color: 'orange',
                      textColor: 'white',
                    },
                  }}
                />

                {/* <Text>End date greater then start date</Text> */}
              </View>
            </View>
            {startDate > endDate
              ? showMessage({
                  message: `End date greater then start date, Please select valid details`,
                  type: 'danger',
                })
              : // <Text style={{ textAlign: "center" }}>End date greater then start date, Please select valid details</Text>
                null}
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: responsiveWidth(2),
              }}>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={newValue => setToggleCheckBox(newValue)}
                tintColors={{
                  true: (color = currentTheme.text),
                  false: (color = currentTheme.text),
                }}
              />
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 16,
                  color: currentTheme.text,
                  marginHorizontal: Platform.OS == 'ios' ? 8 : null,
                }}>
                Is half day
              </Text>
            </View>
            {toggleCheckBox == true ? (
              startDate == endDate ? (
                <View
                  style={{
                    borderRadius: 10,
                    backgroundColor: currentTheme.background_v2,
                    padding: 5,
                    marginHorizontal: responsiveWidth(2),
                  }}>
                  <RadioGroup
                    containerStyle={{flexDirection: 'row'}}
                    radioButtons={radioButtons}
                    onPress={setSelectedId}
                    selectedId={selectedId}
                  />
                </View>
              ) : (
                <View
                  style={{
                    borderRadius: 10,
                    backgroundColor: currentTheme.background_v2,
                    padding: 5,
                    marginHorizontal: responsiveWidth(2),
                  }}>
                  <Text style={{color: Themes == 'dark' ? '#fff' : '#fff'}}>
                    From Half day
                  </Text>
                  <RadioGroup
                    containerStyle={{flexDirection: 'row'}}
                    radioButtons={radioButtons1}
                    onPress={setSelectedId1}
                    selectedId={selectedId1}
                  />
                  <Text style={{color: Themes == 'dark' ? '#fff' : '#fff'}}>
                    To Half day
                  </Text>
                  <RadioGroup
                    containerStyle={{flexDirection: 'row'}}
                    radioButtons={radioButtons2}
                    onPress={setSelectedId2}
                    selectedId={selectedId2}
                  />
                </View>
              )
            ) : null}

            {/* This is profile details */}
            <View
              style={{
                marginHorizontal: responsiveWidth(2),
                marginTop: responsiveHeight(1),
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
              }}>
              <View
                style={{
                  backgroundColor: '#EDFBFE',
                  padding: 10,
                  marginBottom: 10,
                  borderRadius: 10,
                  marginHorizontal: 20,
                  paddingVertical: 15,
                }}>
                <Dropdown
                  selectedTextProps={{
                    style: {
                      color: '#000',
                    },
                  }}
                  style={{}}
                  data={getleavetypeapidata}
                  maxHeight={300}
                  labelField="name"
                  valueField="id"
                  placeholder={!isFocus ? 'Select leave type' : '...'}
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
                style={{
                  borderRadius: 30,
                  marginBottom: 8,
                  padding: 5,
                  backgroundColor: '#EDFBFE',
                  opacity: 1,
                  elevation: 10,
                  marginHorizontal: 20,
                }}>
                <TextInput
                  placeholder="Reason"
                  numberOfLines={6}
                  textAlignVertical={'top'}
                  onChangeText={text => setReason(text)}
                  placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
                  color={Themes == 'dark' ? '#000' : '#000'}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => handleSubmit()}
              style={{
                marginBottom: 5,
                backgroundColor: currentTheme.background_v2,
                padding: 18,
                width: '90%',
                alignSelf: 'center',
                borderRadius: 50,
              }}>
              {loaderApply ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                  Submit
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default ApplyLeave;
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
