import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useMemo, useContext} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';
import {Calendar} from 'react-native-calendars';
import {ScrollView} from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../utils';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Modal from 'react-native-modal';
import {
  AttendanceRequest,
  LeaveApply,
  getHoliday,
  getLeaveType,
  getProfile,
  gettodayattendance,
  punchin,
} from '../../APINetwork/ComponentApi';
import {Dropdown} from 'react-native-element-dropdown';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import {showMessage} from 'react-native-flash-message';
import HomeSkeleton from '../Skeleton/HomeSkeleton';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ThemeContext} from '../../Store/ConetxtApi.jsx/ConextApi';
import {useIsFocused} from '@react-navigation/native';
const HomePage = ({navigation}) => {
  const [monthDay, setMonth] = useState('');

  const ISFoucs = useIsFocused();
  const date = new Date(selected);
  const month = date.toLocaleString('default', {month: 'long'});
  const [modalRequest, setModalRequest] = useState(false);
  const [startdateRequest, setStartdateRequest] = useState(new Date());
  const [openstartdate, setOpenStartDate] = useState(false);
  const [punchInRequest, setPunchInRequest] = useState(null);
  const [punchOut, setPunchOut] = useState(null);
  const [reasonText, setReasonText] = useState('');
  const {
    toggleTheme,
    currentTheme,
    theme,
    isModalVisible,
    setModalVisible,
    setTheme,
    menuaccesssList,
    menuAccess,
  } = useContext(ThemeContext);
  const [getleavetypeapidata, setGetLeaveTypeApiData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [value1, setValue1] = useState();
  const [isFocus, setIsFocus] = useState(false);
  const [reason, setReason] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [selectedId1, setSelectedId1] = useState('');
  const [selectedId2, setSelectedId2] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [getProfileApiData, setGetProfileApiData] = useState('');
  const [punch, setPunch] = useState('');
  const [todayAttendanceDetails, setTodayAttendanceDetails] = useState('');
  const [lastAttendanceDetails, setLastAttendanceDetails] = useState('');
  const [timerOn, settimerOn] = useState(false);
  const [inTime, setinTime] = useState(null);
  const [outTime, setOutTime] = useState(null);
  const [activityTime, setactivityTime] = useState(null);
  const [fullTime, setfullTime] = useState(null);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [loading, setloading] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const timeOptions = [
    {label: '08:00 AM', value: '08:00 AM'},
    {label: '08:15 AM', value: '08:15 AM'},
    {label: '08:30 AM', value: '08:30 AM'},
    {label: '08:45 AM', value: '08:45 AM'},
    {label: '09:00 AM', value: '09:00 AM'},
    {label: '09:15 AM', value: '09:15 AM'},
    {label: '09:30 AM', value: '09:30 AM'},
    {label: '09:45 AM', value: '09:45 AM'},
    {label: '10:00 AM', value: '10:00 AM'},
    {label: '10:15 AM', value: '10:15 AM'},
    {label: '10:30 AM', value: '10:30 AM'},
    {label: '10:45 AM', value: '10:45 AM'},
    {label: '11:00 AM', value: '11:00 AM'},
    {label: '11:15 AM', value: '11:15 AM'},
    {label: '11:30 AM', value: '11:30 AM'},
    {label: '11:45 AM', value: '11:45 AM'},
    {label: '12:00 PM', value: '12:00 PM'},
    {label: '12:15 PM', value: '12:15 PM'},
    {label: '12:30 PM', value: '12:30 PM'},
    {label: '12:45 PM', value: '12:45 PM'},
    {label: '01:00 PM', value: '01:00 PM'},
    {label: '01:15 PM', value: '01:15 PM'},
    {label: '01:30 PM', value: '01:30 PM'},
    {label: '01:45 PM', value: '01:45 PM'},
    {label: '02:00 PM', value: '02:00 PM'},
    {label: '02:15 PM', value: '02:15 PM'},
    {label: '02:30 PM', value: '02:30 PM'},
    {label: '02:45 PM', value: '02:45 PM'},
    {label: '03:00 PM', value: '03:00 PM'},
    {label: '03:15 PM', value: '03:15 PM'},
    {label: '03:30 PM', value: '03:30 PM'},
    {label: '03:45 PM', value: '03:45 PM'},
    {label: '04:00 PM', value: '04:00 PM'},
    {label: '04:15 PM', value: '04:15 PM'},
    {label: '04:30 PM', value: '04:30 PM'},
    {label: '04:45 PM', value: '04:45 PM'},
    {label: '05:00 PM', value: '05:00 PM'},
    {label: '05:15 PM', value: '05:15 PM'},
    {label: '05:30 PM', value: '05:30 PM'},
    {label: '05:45 PM', value: '05:45 PM'},
    {label: '06:00 PM', value: '06:00 PM'},
    {label: '06:15 PM', value: '06:15 PM'},
    {label: '06:30 PM', value: '06:30 PM'},
    {label: '06:45 PM', value: '06:45 PM'},
    {label: '07:00 PM', value: '07:00 PM'},
    {label: '07:15 PM', value: '07:15 PM'},
    {label: '07:30 PM', value: '07:30 PM'},
    {label: '07:45 PM', value: '07:45 PM'},
    {label: '08:00 PM', value: '08:00 PM'},
    {label: '08:15 PM', value: '08:15 PM'},
    {label: '08:30 PM', value: '08:30 PM'},
    {label: '08:45 PM', value: '08:45 PM'},
    {label: '09:00 PM', value: '09:00 PM'},
    {label: '09:15 PM', value: '09:15 PM'},
    {label: '09:30 PM', value: '09:30 PM'},
    {label: '09:45 PM', value: '09:45 PM'},
    {label: '10:00 PM', value: '10:00 PM'},
    {label: '10:15 PM', value: '10:15 PM'},
    {label: '10:30 PM', value: '10:30 PM'},
    {label: '10:45 PM', value: '10:45 PM'},
    {label: '11:00 PM', value: '11:00 PM'},
    {label: '11:15 PM', value: '11:15 PM'},
    {label: '11:30 PM', value: '11:30 PM'},
    {label: '11:45 PM', value: '11:45 PM'},
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
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const d = new Date();
  var mon = d.getMonth() + 1 <= 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;

  var day = d.getDate() <= 9 ? '0' + d.getDate() : d.getDate();

  const datetime = d.getFullYear() + '-' + mon + '-' + day;
  const hours =
    d.getHours() < 10
      ? `0${d.getHours()}`
      : d.getHours() + ':' + d.getMinutes();

  const [holidays, setHolidays] = useState([]);
  const [monthlyHolidays, setMonthlyHolidays] = useState([]);

  const getMonthlyHolidays = dateString => {
    const selectedMonth = new Date(dateString).getMonth() + 1;
    const filteredHolidays = holidays?.filter(holiday => {
      const holidayMonth = new Date(holiday.date).getMonth() + 1;
      return holidayMonth === selectedMonth;
    });
    setMonthlyHolidays(filteredHolidays);
  };
  useEffect(() => {
    const fetchHolidays = async () => {
      setLoader(true);
      try {
        let token = await AsyncStorage.getItem('TOKEN');
        const url = `${BASE_URL}/holiday/list`;
        const response = await getHoliday(url, token);
        setHolidays(response?.data?.data);
        getMonthlyHolidays(new Date().toISOString().split('T')[0]);
      } catch (error) {
        console.error('Error fetching holiday data:', error?.response?.data);
      }
    };

    fetchHolidays();
  }, []);
  async function check() {
    try {
      setLoader(true);
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/profile`;
      const response = await getProfile(url, token, navigation);

      if (response?.data?.status === true) {
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

  async function CheckDailyAttendances() {
    try {
      setLoader(true);
      settimerOn(false);
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/get-today-attendance`;
      const response = await gettodayattendance(url, token);
      if (response?.data?.status) {
        const data = response?.data?.todayAttendanceDetails;
        if (data == null) {
          setinTime(null);
          setOutTime(null);
          setactivityTime(null);
          setloading(false);
        } else if (
          response?.data?.todayAttendanceDetails?.punch_in != '' &&
          response?.data?.todayAttendanceDetails?.punch_out == null
        ) {
          setTodayAttendanceDetails(response?.data?.todayAttendanceDetails);
          setinTime(response?.data?.todayAttendanceDetails?.punch_in);
          setOutTime(response?.data?.todayAttendanceDetails?.punch_out);
          settimerOn(true);
          setloading(false);
        } else if (data.punch_in != '' && data.punch_out != '') {
          console.log('2');
          settimerOn(false);
          setinTime(data.punch_in);
          setOutTime(data.punch_out);
          setloading(false);

          var timeEnd1 = moment(data.punch_out);
          const startDate = moment(data.punch_in);
          const timeEnd = moment(timeEnd1);
          const diff = timeEnd.diff(startDate);
          const diffDuration = moment.duration(diff);
          var days = diffDuration.days();
          var hours = diffDuration.hours();
          var minutes = diffDuration.minutes();
          var seconds = diffDuration.seconds();
          var time =
            (hours < 10 ? '0' + hours : hours) +
            ':' +
            (minutes < 10 ? '0' + minutes : minutes) +
            ':' +
            (seconds < 10 ? '0' + seconds : seconds);
          setfullTime(time);
        }
      } else {
        setinTime(null);
        setOutTime(null);
        setactivityTime(null);
        setloading(false);
      }
    } catch (error) {
      console.error('Error making POST request:', error);
      setloading(false);
    }
  }
  async function getLastAttendance() {
    try {
      setLoader(true);
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/get-last-attendance`;
      const response = await gettodayattendance(url, token);

      if (response?.data?.status === true) {
        console.log(response?.data?.data, 'hello');
        setLoader(false);
        setLastAttendanceDetails(response?.data?.data);
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.error('Error making POST request:', error);
      setLoader(false);
    }
  }
  async function checkleave() {
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
      console.error('Error making POST request:', error);
      setLoader(false);
    }
  }
  useEffect(() => {
    menuAccess();
    check();
    CheckDailyAttendances();
    checkleave();
    getLastAttendance();
  }, [ISFoucs]);

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Morning',
        value: 'first_half',
        labelStyle: {color: currentTheme.text}, // Customize label style here
      },
      {
        id: '2',
        label: 'Afternoon',
        value: 'second_half',
        labelStyle: {color: currentTheme.text}, // Customize label style here
      },
    ],
    [],
  );
  const radioButtons1: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1',
        label: 'Morning',
        value: 'option1',
        labelStyle: {color: currentTheme.text},
      },
      {
        id: '2',
        label: 'Afternoon',
        value: 'option2',
        labelStyle: {color: currentTheme.text},
      },
    ],
    [],
  );
  const radioButtons2: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Morning',
        value: 'option1',
        labelStyle: {color: currentTheme.text}, // Customize label style here
      },
      {
        id: '2',
        label: 'Afternoon',
        value: 'option2',
        labelStyle: {color: currentTheme.text}, // Customize label style here
      },
    ],
    [],
  );
  const currentDate = new Date();
  const options = {
    weekday: 'long',
    day: 'numeric',
    year: 'numeric',
    month: 'long',
  };
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
  useEffect(() => {
    let interval = null;
    if (timerOn == true && inTime != null) {
      interval = setInterval(() => {
        var timeEnd1 = parseInt(new Date().getTime());
        const startDate = moment(inTime);
        const timeEnd = moment(timeEnd1);
        const diff = timeEnd.diff(startDate);
        const diffDuration = moment.duration(diff);
        var days = diffDuration.days();
        var hours = diffDuration.hours();
        var minutes = diffDuration.minutes();
        var seconds = diffDuration.seconds();
        var time =
          (hours < 10 ? '0' + hours : hours) +
          ':' +
          (minutes < 10 ? '0' + minutes : minutes) +
          ':' +
          (seconds < 10 ? '0' + seconds : seconds);
        setactivityTime(time);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [timerOn]);
  useEffect(() => {
    async function check() {
      try {
        setLoader(true);
        let token = await AsyncStorage.getItem('TOKEN');
        const url = `${BASE_URL}/leave/type`;
        const response = await getLeaveType(url, token);
        if (response?.data?.status == true) {
          setGetLeaveTypeApiData(response?.data?.data);
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
  const Punch_IN_Out = async () => {
    setloading(true);
    setDisabledBtn(true);
    try {
      const url = `${BASE_URL}/employee/make/attendance`;
      let token = await AsyncStorage.getItem('TOKEN');
      const response = await punchin(url, token);
      CheckDailyAttendances();
      if (response?.data?.status) {
        CheckDailyAttendances();
        setLoader(false);
        setloading(false);
        setPunch(response?.data);
        setDisabledBtn(false);
        showMessage({
          message: `${response?.data?.message}`,
          type: 'success',
        });
      } else {
        setLoader(false);
        setloading(false);
        setDisabledBtn(false);
      }
    } catch (error) {
      console.error('Error making POST request:', error);
      setloading(false);
      setDisabledBtn(false);
      setLoader(false);
    }
  };
  const renderServicesList = ({item}) => (
    <TouchableOpacity onPress={() => navigation.navigate(item.nav)}>
      <Image
        style={{
          height: responsiveHeight(18),
          width: responsiveWidth(35),
          resizeMode: 'contain',
          overflow: 'hidden',
        }}
        source={item.uri}
      />
      <Text
        style={{
          position: 'absolute',
          bottom: 5,
          alignSelf: 'center',
          fontSize: responsiveFontSize(1.9),
          color: '#fff',
          fontWeight: '500',
        }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  const [expandedapplyleave, setExpandedApplyLeave] = useState(false);
  const toggleExpandedApplyLeave = () => {
    setExpandedApplyLeave(!expandedapplyleave);
  };
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  const [selected, setSelected] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const handleLogout = () => {
    Alert.alert('Are you sure?', 'Do you really want to log out?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => Punch_IN_Out()},
    ]);
  };

  if (loader) {
    return <HomeSkeleton />;
  }
  function convertTo24Hour(time) {
    let [hours, minutes] = time.match(/\d+/g);
    let period = time.match(/AM|PM/i);

    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (period && period[0].toUpperCase() === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period && period[0].toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }
  const attendance_Request = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    if (punchInRequest == null) {
      setModalRequest(false);
      showMessage({
        message: 'Please enter Punch In Time',
        type: 'danger',
      });
    } else if (punchInRequest == null) {
      setModalRequest(false);
      showMessage({
        message: 'Please enter Punch out Time',
        type: 'danger',
      });
    } else if (reasonText.trim() === '') {
      setModalRequest(false);
      showMessage({
        message: 'Please Enter Reason',
        type: 'danger',
      });
    } else {
      let data = JSON.stringify({
        date: startdateRequest.toISOString().split('T')[0],
        punch_in: convertTo24Hour(punchInRequest),
        punch_out: convertTo24Hour(punchOut),
        reason: reasonText,
      });
      const url = `${BASE_URL}/attendance/request/store`;
      let form = 0;
      const response = await AttendanceRequest(url, data, token, form);
      if (response.data.status) {
        setModalRequest(false);
        setPunchInRequest(null);
        setPunchOut(null);
        setReasonText('');
        showMessage({
          message: `${response?.data?.message}`,
          type: 'success',
        });
      }
    }
  };
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const getLastAttendanceDaily = () => {
    if (lastAttendanceDetails == 'No Last Attendance Available') {
      return (
        <View>
          <Text
            style={{
              color: currentTheme.text,
              fontSize: 16,
              textAlign: 'center',
            }}>
            No Last Attendance Available
          </Text>
        </View>
      );
    } else {
      return lastAttendanceDetails?.map((elements, index) => {
        return (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 10,
              marginVertical: 8,
            }}>
            <View style={{}}>
              <Text
                style={{
                  color: currentTheme.text,
                  fontSize: 20,
                  fontWeight: '500',
                }}>
                {elements?.day}
              </Text>
              <Text style={{color: currentTheme.text, fontSize: 18}}>
                {elements?.date}
              </Text>
            </View>
            <View style={{}}>
              <Image
                style={{
                  tintColor: currentTheme.text,
                  fontSize: 20,
                  fontWeight: '500',
                  height: 30,
                  width: 30,
                  alignSelf: 'center',
                }}
                source={require('../../assets/HomeScreen/clock.png')}
              />
              <Text
                style={{
                  color: currentTheme.text,
                  fontSize: 18,
                  textAlign: 'center',
                }}>
                {elements?.total_hours}
              </Text>
            </View>
          </View>
        );
      });
    }
  };
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
        if (response?.data?.status == true) {
          showMessage({
            message: `${response?.data?.message}`,
            type: 'success',
          });
          setExpandedApplyLeave(false);
          setSelectedId1('');
          setSelectedId2('');
          setStartDate('');
          setEndDate('');
          navigation.navigate('Leaves');
        } else {
        }
      }
    } catch (error) {
      // console.error('Error making POST request:', error);
      showMessage({
        message: `${error.response.data.message}`,
        type: 'danger',
      });
      console.log(error.response.data.message);
      setLoader(false);
    }
  };

  return (
    <>
      <View style={{flex: 1, backgroundColor: currentTheme.background}}>
        <View style={styles.parent}>
          <View
            style={[
              styles.child,
              {backgroundColor: currentTheme.background_v2},
            ]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 15,
              }}>
              {getProfileApiData?.profile_image == '' ||
              getProfileApiData?.profile_image == [] ||
              getProfileApiData?.profile_image == null ? (
                <Image
                  style={{
                    height: 120,
                    width: 120,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                  source={require('../../assets/HomeScreen/profile.png')}
                />
              ) : (
                <Image
                  style={{
                    height: 90,
                    width: 90,
                    // resizeMode: 'contain',
                    alignSelf: 'center',
                    borderRadius: 50,
                  }}
                  source={{uri: getProfileApiData?.profile_image}}
                />
              )}
              <View style={{marginHorizontal: 15}}>
                {/* <Switch
                  trackColor={{false: '#767577', true: '#81B0FF'}}
                  thumbColor={isEnabled ? '#F5DD4B' : '#F4F3F4'}
                  ios_backgroundColor="#3E3E3E"
                  onValueChange={toggleTheme}
                  value={isEnabled}
                /> */}
                <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>
                  {getProfileApiData?.name}
                </Text>
                <Text style={{color: '#fff', fontSize: 18}}>
                  {formattedDate}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* This is Services list */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginBottom: 100,
              marginHorizontal: 10,
              alignSelf: 'center',
              marginTop: responsiveHeight(2),
            }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={menuaccesssList}
              renderItem={renderServicesList}
              keyExtractor={item => item.id}
            />
            <View
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
                <Text
                  style={{
                    color: currentTheme.text_v2,
                    fontSize: 18,
                    marginBottom: 5,
                    marginTop: 5,
                  }}>
                  {days[d.getDay()]}
                </Text>
                <Text
                  style={{
                    color: currentTheme.text_v2,
                    fontSize: 18,
                    marginTop: 5,
                  }}>
                  {d.getDate() +
                    ' ' +
                    monthNames[d.getMonth()] +
                    ' ' +
                    d.getFullYear()}
                </Text>
              </View>
              <View
                style={{
                  borderColor: currentTheme.text_v2,
                  borderWidth: 1,
                }}></View>
              <View>
                {inTime && !outTime && (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 8,
                      }}>
                      <AntDesign
                        name="rightcircle"
                        style={{
                          fontSize: 23,
                          color: '#fff',
                        }}
                      />
                      <Text
                        style={{
                          color: currentTheme.text_v2,
                          fontSize: 18,
                          textAlign: 'center',
                          marginHorizontal: 10,
                        }}>
                        {activityTime}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleLogout()}
                      style={{
                        backgroundColor: currentTheme.buttonText,
                        borderRadius: 20,
                        height: 40,
                        justifyContent: 'center',
                        width: 120,
                        height: 40,
                      }}>
                      {loading ? (
                        <ActivityIndicator color="#0E0E64" />
                      ) : (
                        <Text
                          style={{
                            textAlign: 'center',
                            color: currentTheme.text,
                            fontSize: 16,
                            textAlign: 'center',
                          }}>
                          Punch Out
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}

                {!inTime && !outTime && (
                  <TouchableOpacity
                    onPress={() => Punch_IN_Out()}
                    disabled={disabledBtn == true ? true : false}
                    style={{
                      backgroundColor: currentTheme.buttonText,
                      borderRadius: 20,
                      height: 40,
                      justifyContent: 'center',
                      width: 120,
                      marginTop: 10,
                    }}>
                    {loading ? (
                      <ActivityIndicator color="#0E0E64" />
                    ) : (
                      <Text
                        style={{
                          textAlign: 'center',
                          color: currentTheme.text,
                          fontSize: 18,
                          textAlign: 'center',
                        }}>
                        Punch In
                      </Text>
                    )}
                  </TouchableOpacity>
                )}

                {inTime && outTime && (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#00f0ff',
                          fontSize: 18,
                          textAlign: 'center',
                          marginHorizontal: 10,
                          marginBottom: 5,
                          marginTop: 5,
                          marginTop: 5,
                        }}>
                        {fullTime}
                      </Text>
                    </View>
                    <Text style={{color: 'red', marginTop: 5, fontSize: 18}}>
                      Total Time Elapsed
                    </Text>
                  </>
                )}
              </View>
            </View>
            <TouchableOpacity onPress={() => setModalRequest(true)}>
              <Text
                style={[
                  {
                    fontSize: 18,
                    fontWeight: '600',
                    textDecorationLine: 'underline',
                    textAlign: 'right',
                    marginRight: 8,
                  },
                  {color: theme == 'dark' ? '#000' : '#000'},
                ]}>
                Attendance Request
              </Text>
            </TouchableOpacity>

            <View>
              <View
                style={{
                  backgroundColor: '#AA9AFD',
                  marginTop: responsiveHeight(1),
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: expandedapplyleave == true ? 0 : 10,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                }}>
                <View
                  style={{
                    width: '98%',
                    marginLeft: '2%',
                    backgroundColor: currentTheme.background,
                    opacity: 1,
                    elevation: 10,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: expandedapplyleave == true ? 0 : 10,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius:
                      expandedapplyleave == true ? 0 : 10,
                    padding: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderWidth: 0.5,
                    borderColor: '#333',
                  }}>
                  <LinearGradient
                    style={{padding: 10, borderRadius: 10}}
                    colors={['#AA9AFD', '#8370ED']}>
                    <Image
                      style={{height: 30, width: 30, resizeMode: 'contain'}}
                      source={require('../../assets/HomeScreen/h5.png')}
                    />
                  </LinearGradient>
                  <Text
                    style={{
                      color: currentTheme.text,
                      fontSize: responsiveFontSize(2.3),
                    }}>
                    Apply Leave
                  </Text>
                  <TouchableOpacity onPress={toggleExpandedApplyLeave}>
                    {expandedapplyleave ? (
                      <Image
                        style={{
                          height: 30,
                          width: 30,
                          resizeMode: 'contain',
                          tintColor: currentTheme.text,
                        }}
                        source={require('../../assets/HomeScreen/up.png')}
                      />
                    ) : (
                      <>
                        <Image
                          style={{
                            height: 30,
                            width: 30,
                            resizeMode: 'contain',
                            tintColor: currentTheme.text,
                          }}
                          source={require('../../assets/HomeScreen/down.png')}
                        />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              {expandedapplyleave ? (
                <View
                  style={{
                    backgroundColor: '#AA9AFD',
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}>
                  <View
                    style={{
                      width: '98%',
                      marginLeft: '2%',
                      backgroundColor: currentTheme.background,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    }}>
                    <ScrollView
                      style={{
                        width: '100%',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
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
                            <Text style={{color: '#fff', textAlign: 'center'}}>
                              {startDate
                                ? new Date(startDate).getDate()
                                : 'Start'}
                            </Text>
                            <Text style={{color: '#fff', textAlign: 'center'}}>
                              {startDate
                                ? new Date(startDate).toLocaleString(
                                    'default',
                                    {month: 'long'},
                                  )
                                : 'Date'}
                            </Text>
                          </TouchableOpacity>
                          <Image
                            style={{
                              height: 50,
                              width: 50,
                              tintColor: currentTheme.text,
                            }}
                            source={require('../../assets/ApplyLeave/arrow-down.png')}
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
                            <Text style={{color: '#fff', textAlign: 'center'}}>
                              {endDate ? new Date(endDate).getDate() : 'End'}
                            </Text>
                            <Text style={{color: '#fff', textAlign: 'center'}}>
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
                              width: responsiveWidth(60),
                            }}
                            onDayPress={day => {
                              setSelected(day.dateString);
                              setMonth(day);

                              if (!startDate) {
                                setStartDate(day.dateString);
                              } else if (!endDate) {
                                setEndDate(day.dateString);
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
                        </View>
                      </View>
                      {startDate > endDate
                        ? showMessage({
                            message: `End date greater then start date, Please select valid details`,
                            type: 'danger',
                          })
                        : null}
                      <View
                        style={{
                          flexDirection: 'row',
                          marginHorizontal: responsiveWidth(2),
                        }}>
                        <CheckBox
                          disabled={false}
                          value={toggleCheckBox}
                          onValueChange={newValue =>
                            setToggleCheckBox(newValue)
                          }
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
                              backgroundColor: currentTheme.inputText_color,
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
                              backgroundColor: '#EDFBFE',
                              padding: 5,
                              marginHorizontal: responsiveWidth(2),
                            }}>
                            <Text style={{color: '#000'}}>
                              First day of leave
                            </Text>
                            <RadioGroup
                              containerStyle={{flexDirection: 'row'}}
                              radioButtons={radioButtons1}
                              onPress={setSelectedId1}
                              selectedId={selectedId1}
                            />
                            <Text style={{color: '#000'}}>
                              Last day of leave
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
                            backgroundColor: currentTheme.background_v2,
                            padding: 10,
                            marginBottom: 5,
                            borderRadius: 10,
                          }}>
                          <Dropdown
                            selectedTextProps={{
                              style: {
                                color: '#fff',
                              },
                            }}
                            data={getleavetypeapidata && getleavetypeapidata}
                            maxHeight={300}
                            labelField="name"
                            valueField="id"
                            placeholder={!isFocus ? 'Select leave type' : '...'}
                            value={value1}
                            onChange={item => {
                              setValue1(item.id);
                            }}
                            placeholderStyle={{
                              color: '#fff',
                            }}
                            itemTextStyle={{
                              color: '#000',
                            }}
                          />
                        </View>

                        <View
                          style={{
                            borderRadius: 20,
                            marginBottom: 8,
                            padding: 5,
                            backgroundColor: currentTheme.background_v2,
                            opacity: 1,
                            elevation: 10,
                          }}>
                          <TextInput
                            placeholder="Reason"
                            numberOfLines={6}
                            textAlignVertical={'top'}
                            onChangeText={text => setReason(text)}
                            style={{height: 120}} // Adjust height as needed
                            placeholderTextColor={'#fff'}
                            color={'#fff'}
                          />
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() => handleSubmit()}
                        style={{
                          marginBottom: 5,
                          backgroundColor: currentTheme.background_v2,
                          padding: 15,
                          width: '60%',
                          alignSelf: 'center',
                          borderRadius: 50,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: 'bold',
                          }}>
                          Submit
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                </View>
              ) : null}
            </View>

            {/* This is Holiday management */}
            {/* <View>
              <View
                style={{
                  backgroundColor: '#8AEBC3',
                  marginTop: responsiveHeight(1),
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: expandedholiday == true ? 0 : 10,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                }}>
                <View
                  style={{
                    width: '98%',
                    marginLeft: '2%',
                    backgroundColor: currentTheme.background,
                    opacity: 1,
                    elevation: 10,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: expandedholiday == true ? 0 : 10,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: expandedholiday == true ? 0 : 10,
                    padding: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderWidth: 0.5,
                    borderColor: '#333',
                  }}>
                  <LinearGradient
                    style={{padding: 10, borderRadius: 10}}
                    colors={['#8AEBC3', '#39CB8E']}>
                    <Image
                      style={{height: 30, width: 30, resizeMode: 'contain'}}
                      source={require('../../assets/HomeScreen/calendar.png')}
                    />
                  </LinearGradient>
                  <Text
                    style={{
                      color: currentTheme.text,
                      fontSize: responsiveFontSize(2.3),
                    }}>
                    Holiday Management
                  </Text>
                  <TouchableOpacity onPress={toggleExpandedHoliday}>
                    {expandedholiday ? (
                      <Image
                        style={{
                          height: 30,
                          width: 30,
                          resizeMode: 'contain',
                          tintColor: currentTheme.text,
                        }}
                        source={require('../../assets/HomeScreen/up.png')}
                      />
                    ) : (
                      <>
                        <Image
                          style={{
                            height: 30,
                            width: 30,
                            resizeMode: 'contain',
                            tintColor: currentTheme.text,
                          }}
                          source={require('../../assets/HomeScreen/down.png')}
                        />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              {expandedholiday ? (
                <View
                  style={{
                    backgroundColor: currentTheme.background_v2,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}>
                  <View
                    style={{
                      width: '98%',
                      marginLeft: '2%',
                      backgroundColor: currentTheme.background,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    }}>
                    <ScrollView
                      style={{
                        width: '100%',
                        backgroundColor: currentTheme.background,
                        borderTopLeftRadius: 40,
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
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
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
                                backgroundColor: currentTheme.background,
                                borderWidth: 0.5,
                                borderColor: currentTheme.text,
                                elevation: 3,
                                marginBottom: 10,
                              }}>
                              <View
                                style={{
                                  marginLeft: 20,
                                  backgroundColor: '#0E0E64',
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
                                  source={require('../../assets/HomeScreen/calendar.png')}
                                />
                              </View>
                              <View
                                style={{
                                  marginLeft: 20,
                                  justifyContent: 'center',
                                }}>
                                <Text
                                  style={{
                                    color: currentTheme.text,
                                    fontSize: 18,
                                    fontWeight: '500',
                                  }}>
                                  {holiday.name}
                                </Text>
                                <Text
                                  style={{
                                    color: currentTheme.text,
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
                              textAlign: 'center',
                            }}>
                            No holidays available this month
                          </Text>
                        )}
                      </View>
                    </ScrollView>
                  </View>
                </View>
              ) : null}
            </View> */}

            {/* This is recent attendence */}
            <View>
              <View
                style={{
                  backgroundColor: '#FABED7',
                  marginTop: responsiveHeight(1),
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: expanded == true ? 0 : 10,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                }}>
                <View
                  style={{
                    width: '98%',
                    marginLeft: '2%',
                    backgroundColor: currentTheme.background,
                    opacity: 1,
                    elevation: 10,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: expanded == true ? 0 : 10,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: expanded == true ? 0 : 10,
                    padding: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderWidth: 0.5,
                    borderColor: '#333',
                  }}>
                  <LinearGradient
                    style={{padding: 10, borderRadius: 10}}
                    colors={['#FABED7', '#FF94C3']}>
                    <Image
                      style={{height: 30, width: 30, resizeMode: 'contain'}}
                      source={require('../../assets/HomeScreen/recentattendance.png')}
                    />
                  </LinearGradient>
                  <Text
                    style={{
                      color: currentTheme.text,
                      fontSize: responsiveFontSize(2.3),
                    }}>
                    Recent Attendance
                  </Text>
                  <TouchableOpacity onPress={toggleExpanded}>
                    {expanded ? (
                      <Image
                        style={{
                          height: 30,
                          width: 30,
                          resizeMode: 'contain',
                          tintColor: currentTheme.text,
                        }}
                        source={require('../../assets/HomeScreen/up.png')}
                      />
                    ) : (
                      <>
                        <Image
                          style={{
                            height: 30,
                            width: 30,
                            resizeMode: 'contain',
                            tintColor: currentTheme.text,
                          }}
                          source={require('../../assets/HomeScreen/down.png')}
                        />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              {expanded ? (
                <View
                  style={{
                    backgroundColor: '#FABED7',
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}>
                  <View
                    style={{
                      width: '98%',
                      marginLeft: '2%',
                      backgroundColor: currentTheme.background,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        borderColor: '#4148fe',
                        borderTopWidth: 0.8,
                      }}></View>
                    {getLastAttendanceDaily()}
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>
        <Modal
          // isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          style={styles.modal}
          animationIn="slideInUp" // Animation when showing the modal
          animationOut="slideOutDown" // Animation when hiding the modal
          animationInTiming={500} // Duration for animation in (milliseconds)
          animationOutTiming={500} // Duration for animation out (milliseconds)
        >
          <View style={styles.bottomSheet}>
            <Text style={styles.title}>Introducing</Text>
            <Text style={styles.subTitle}>Dark Mode</Text>
            <Text style={styles.description}>
              Choose your preferred app theme. You can also change this later
              from your profile.
            </Text>

            {['light', 'dark'].map(val => (
              <TouchableOpacity
                key={val}
                style={styles.option}
                onPress={() => [setTheme(val), toggleTheme()]}>
                <Text style={styles.optionText}>
                  {capitalizeFirstLetter(val)}
                </Text>
                <View
                  style={[
                    styles.radioCircle,
                    theme === val && styles.selectedRadio,
                  ]}
                />
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={toggleModal} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Preference</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>

      <Modal visible={modalRequest} transparent={true} animationType="none">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Attendance Details</Text>
            <View style={styles.Date_box}>
              <Text style={{color: theme == 'dark' ? '#000' : '#000'}}>
                {startdateRequest?.toISOString().split('T')[0]}
              </Text>
              <TouchableOpacity onPress={() => setOpenStartDate(true)}>
                <EvilIcons
                  name="calendar"
                  style={{
                    fontSize: 25,
                    color: theme == 'dark' ? '#000' : '#000',
                    alignSelf: 'center',
                  }}
                />
              </TouchableOpacity>
            </View>

            <Text style={{color: '#333', fontSize: 15, marginVertical: 5}}>
              Punch In Time
            </Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={[{color: '#000'}]}
              selectedTextStyle={[{color: '#000'}]}
              itemTextStyle={{
                color: '#000',
              }}
              data={timeOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Time"
              value={punchInRequest}
              onChange={item => setPunchInRequest(item.value)}
            />
            {/* Punch Out Time Picker */}
            <Text style={{color: '#333', fontSize: 15, marginVertical: 5}}>
              Punch Out Time
            </Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={[{color: '#000'}]}
              selectedTextStyle={[{color: '#000'}]}
              itemTextStyle={{
                color: '#000',
              }}
              data={timeOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Time"
              value={punchOut}
              onChange={item => setPunchOut(item.value)}
            />

            <Text style={{color: '#333', fontSize: 15, marginVertical: 5}}>
              Reason
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Reason"
              value={reasonText}
              onChangeText={prev => setReasonText(prev)}
              placeholderTextColor="#999"
            />

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => attendance_Request()}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalRequest(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <DatePicker
        modal
        open={openstartdate}
        date={startdateRequest}
        theme="light"
        mode="date"
        onConfirm={startdate => {
          setOpenStartDate(false);
          setStartdateRequest(startdate);
        }}
        onCancel={() => {
          setOpenStartDate(false);
        }}
      />
    </>
  );
};
export default HomePage;
const styles = StyleSheet.create({
  parent: {
    height: '25%',
    width: '100%',
    transform: [{scaleX: 2}],
    borderBottomStartRadius: 200,
    borderBottomEndRadius: 200,
    overflow: 'hidden',
  },
  child: {
    flex: 1,
    transform: [{scaleX: 0.5}],
    backgroundColor: '#0E0E64',
    justifyContent: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheet: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 16,
    color: '#B5B5B5',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: '#B5B5B5',
    textAlign: 'center',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    backgroundColor: '#FF3D71',
  },
  saveButton: {
    backgroundColor: '#242B3A',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  Date_box: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 15,
    height: 50,
    marginBottom: 5,
    width: responsiveWidth(65),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#0043ae',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {color: '#fff', textAlign: 'center', fontWeight: 'bold'},
  dropdown: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
