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
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect, useMemo, useContext, useRef} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';
import GetLocation from 'react-native-get-location';
import Geolocation from 'react-native-geolocation-service';
import {Calendar} from 'react-native-calendars';
import {ScrollView} from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../utils';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';
import {
  AttendanceRequest,
  LeaveApply,
  breakIn,
  breaklist,
  breakout,
  getLeaveType,
  gettodayattendance,
  locationSend,
  punchin,
} from '../../APINetwork/ComponentApi';
import {Dropdown} from 'react-native-element-dropdown';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import {showMessage} from 'react-native-flash-message';
import HomeSkeleton from '../Skeleton/HomeSkeleton';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ThemeContext} from '../../Store/ConetxtApi.jsx/ConextApi';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import FaceCamera from './FaceCamera';

import axios from 'axios';
import BackgroundService from 'react-native-background-actions';
import NotificationController from '../../PushNotification/NotificationController';
import PullToRefresh from '../../PullToRefresh';
import PunchOutFace from './PunchOutFace';
const HomePage = () => {
  const navigation = useNavigation();
  const [monthDay, setMonth] = useState('');
  const ISFoucs = useIsFocused();
  const date = new Date(selected);
  const [modalRequest, setModalRequest] = useState(false);
  const [startdateRequest, setStartdateRequest] = useState(new Date());
  const [openStartDate, setOpenStartDate] = useState(false);
  const [punchInTime, setPunchInTime] = useState(new Date());
  const [punchOutTime, setPunchOutTime] = useState(new Date());
  const [openPunchIn, setOpenPunchIn] = useState(false);
  const [openPunchOut, setOpenPunchOut] = useState(false);
  const [reasonText, setReasonText] = useState('');
  const [chooseFace, setChooseFace] = useState(1);
  const [breakModal, setBreakModal] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const {
    toggleTheme,
    currentTheme,
    theme,
    isModalVisible,
    setModalVisible,
    setTheme,
    menuaccesssList,
    menuAccess,
    handleOpenCamera,
    isCameraOpen,
    kycModal,
    setKycModal,
    user_details,
    empyName,
    facePermission,
    face_kyc_img,
    requestAttendance,
    locationTracking,
    liveLocationActive,
    empyId,
    getProfileApiData,
    activeLog,
    allowfacenex,
    punchInRadius,
    activeLocation,
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
  const [punch, setPunch] = useState('');
  const [todayAttendanceDetails, setTodayAttendanceDetails] = useState(null);
  const [lastAttendanceDetails, setLastAttendanceDetails] = useState('');
  const [timerOn, settimerOn] = useState(false);
  const [inTime, setinTime] = useState(null);
  const [outTime, setOutTime] = useState(null);
  const [activityTime, setactivityTime] = useState(null);
  const [fullTime, setfullTime] = useState(null);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [loading, setloading] = useState(false);
  const [availableLeavesList, setAvailableLeavesList] = useState(null);
  const [inTimeBreak, setInTimeBreak] = useState(null);
  const [breaktime, setBreaktime] = useState('');
  const [listBreak, setListBreak] = useState(null);
  const [breakValue, setBreakValue] = useState(null);
  const [attendanceId, setAttendanceId] = useState();
  const [fullbreakTime, setFullbreakTime] = useState('');
  const [breakTotatimeStatus, setBreakTotatimeStatus] = useState(false);
  const [breakId, setBreakId] = useState(null);
  const [breakLoader, setBreakLoader] = useState(false);
  const [leaveLoader, setLeaveLoader] = useState(false);
  const [breakDescription, setBreakDescription] = useState(null);
  const BATTERY_API_CALLED_KEY = 'battery_api_called';
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

  const breakingList = async () => {
    let token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/break-details/${attendanceId}`;
    const response = await breaklist(url, token);
    if (response?.data?.status) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`;
      setInTimeBreak(`${currentDate} ${response?.data?.data.start_time}`);
      setBreakId(response?.data?.data.id);
      setBreakTotatimeStatus(false);
    } else {
      setBreakTotatimeStatus(true);
    }
  };
  async function CheckDailyAttendances() {
    try {
      setLoader(true);
      settimerOn(false);
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/get-today-attendance`;
      const response = await gettodayattendance(url, token);

      if (response?.data?.status) {
        const attendanceArray = response?.data?.todayAttendanceDetails;
        setTodayAttendanceDetails(attendanceArray);

        if (!attendanceArray || attendanceArray.length === 0) {
          setinTime(null);
          setOutTime(null);
          setactivityTime(null);
          setFullbreakTime('');
          setloading(false);
          return;
        }

        const lastRecord = [...attendanceArray]
          .reverse()
          .find(item => item.punch_in && item.punch_out);
        const lastShift = attendanceArray[attendanceArray.length - 1].shift;
        const currentTime = moment();
        const shiftEndTime = moment(lastShift.end_time, 'HH:mm:ss');

        if (currentTime.isAfter(shiftEndTime)) {
          setAttendanceId(null);
          setinTime(null);
          setOutTime(null);
          setactivityTime(null);
          settimerOn(false);
          setfullTime(null);
          setFullbreakTime('');
          setloading(false);
          return;
        }

        const lastOngoing = [...attendanceArray]
          .reverse()
          .find(item => item.punch_in && !item.punch_out);

        if (lastRecord) {
          setAttendanceId(lastRecord.id);
          setinTime(lastRecord.punch_in);
          setOutTime(lastRecord.punch_out);
          settimerOn(false);

          const timeStart = moment(lastRecord.punch_in);
          const timeEnd = moment(lastRecord.punch_out);
          const diff = timeEnd.diff(timeStart);
          const duration = moment.duration(diff);
          console.log(duration,'duration')

          const time =
            `${String(duration.hours()).padStart(2, '0')}:` +
            `${String(duration.minutes()).padStart(2, '0')}:` +
            `${String(duration.seconds()).padStart(2, '0')}`;
            console.log(time)
          setfullTime(time);

          // Set full break time
          setFullbreakTime(lastRecord.total_break_time || '');
        } else if (lastOngoing) {
          setAttendanceId(lastOngoing.id);
          setinTime(lastOngoing.punch_in);
          setOutTime(null);
          settimerOn(true);

          // Set full break time
          setFullbreakTime(lastOngoing.total_break_time || '');
          setfullTime('');
        } else {
          setinTime(null);
          setOutTime(null);
          setFullbreakTime('');
          setfullTime('');
        }

        setloading(false);
      } else {
        setinTime(null);
        setOutTime(null);
        setactivityTime(null);
        setFullbreakTime('');
        setloading(false);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setloading(false);
    }
  }

  async function getLastAttendance() {
    try {
      setLoader(true);
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/get-last-attendance`;
      const response = await gettodayattendance(url, token);
      if (response?.data?.status) {
        setLoader(false);
        setLastAttendanceDetails(response?.data);
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
  async function check_leave_type() {
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
  async function breaktypeList() {
    try {
      setLoader(true);
      let token = await AsyncStorage.getItem('TOKEN');

      const url = `${BASE_URL}/break-type/list`;
      const response = await getLeaveType(url, token);
      if (response?.data?.status == true) {
        setListBreak(response?.data?.data);
      } else {
      }
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  }
  useEffect(() => {
    menuAccess();
    breakingList();
    user_details();
    CheckDailyAttendances();
    breaktypeList();
    checkleave();
    getLastAttendance();
    availableLeaves();
    check_leave_type();
  }, [ISFoucs, attendanceId]);
  useEffect(() => {
    const fetchBatteryLevel = async () => {
      try {
        const level = await DeviceInfo.getBatteryLevel();
        const batteryPercent = Math.round(level * 100);
        setBatteryLevel(batteryPercent);
        const apiCalled = await AsyncStorage.getItem(BATTERY_API_CALLED_KEY);
        if (batteryPercent <= 10 && apiCalled !== 'true') {
          await callYourApi(batteryPercent);
          await AsyncStorage.setItem(BATTERY_API_CALLED_KEY, 'true');
        } else if (batteryPercent > 10 && apiCalled === 'true') {
          await AsyncStorage.setItem(BATTERY_API_CALLED_KEY, 'false');
        }
      } catch (error) {
        console.error('Battery check error:', error);
      }
    };

    fetchBatteryLevel();
  }, []);

  const callYourApi = async (batteryPercent) => {
    const token=await AsyncStorage.getItem('TOKEN')
    const title = '🔋 Battery Reminder';
    const message = `This is to inform you that ${empyName} device battery is at ${batteryPercent}%. They may lose connectivity shortly.`;
  console.log(message,',essage')
    try {
      const response = await fetch(`${BASE_URL}/send/notification/battery/percentage`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`},
        body: JSON.stringify({
          title: title,
          message: message,
        }),
      });
      const data = await response.json();
      console.log('API Success:', data);
  
      Alert.alert('🔋 Battery Notification Sent', message);
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Failed to send battery alert to server.');
    }
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
    let interval = null;

    if (timerOn && inTimeBreak) {
      interval = setInterval(() => {
        var timeEnd1 = parseInt(new Date().getTime());
        const startDate = moment(inTimeBreak);
        const timeEnd = moment(timeEnd1);
        const diff = timeEnd.diff(startDate);
        const diffDuration = moment.duration(diff);
        var hours = diffDuration.hours();
        var minutes = diffDuration.minutes();
        var seconds = diffDuration.seconds();
        var time =
          (hours < 10 ? '0' + hours : hours) +
          ':' +
          (minutes < 10 ? '0' + minutes : minutes) +
          ':' +
          (seconds < 10 ? '0' + seconds : seconds);
        setBreaktime(time);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerOn, inTimeBreak]);
  const handleBreakIn = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    if (breakValue == null) {
      setBreakModal(false);
      showMessage({
        message: 'Please enter Break Time',
        type: 'danger',
        duration: 2000,
      });
    } else if (reasonText.trim() === '') {
      setBreakModal(false);
      showMessage({
        message: 'Please Enter Message',
        type: 'danger',
        duration: 2000,
      });
    } else {
      let data = JSON.stringify({
        break_type_id: breakValue,
        employee_attendance_id: attendanceId,
        comment: reasonText,
      });
      const url = `${BASE_URL}/break-in`;
      let form = 0;
      const response = await breakIn(url, data, token, form);
      if (response.data.status) {
        setBreakModal(false);
        setBreakValue(null);
        setReasonText('');
        breakingList();

        showMessage({
          message: `${response?.data?.message}`,
          type: 'success',
        });
      } else {
        setBreakModal(false);
        setBreakValue(null);
        setReasonText('');

        showMessage({
          message: `${response?.data?.message}`,
          type: 'danger',
          duration: 3000,
        });
      }
    }
  };
  const handleBreakOut = async () => {
    setBreakLoader(true);
    let token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/break-out/${breakId}`;
    const response = await breakout(url, token);
    setInTimeBreak(null);
    setBreakLoader(false);
    if (response?.data?.status) {
      setInTimeBreak(null);
      breakingList();
      CheckDailyAttendances();
    }
  };

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Morning',
        value: 'first_half',
        labelStyle: {color: currentTheme.text}, // Customize label style here
        color: currentTheme.text,
        borderColor: currentTheme.text,
      },
      {
        id: '2',
        label: 'Afternoon',
        value: 'second_half',
        labelStyle: {color: currentTheme.text}, // Customize label style here
        color: currentTheme.text,
        borderColor: currentTheme.text,
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
        color: '#000',
        borderColor: '#000',
      },
      {
        id: '2',
        label: 'Afternoon',
        value: 'option2',
        labelStyle: {color: currentTheme.text},
        color: currentTheme.text,
        borderColor: currentTheme.text,
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
        color: currentTheme.text,
        borderColor: currentTheme.text,
      },
      {
        id: '2',
        label: 'Afternoon',
        value: 'option2',
        labelStyle: {color: currentTheme.text},
        color: currentTheme.text,
        borderColor: currentTheme.text,
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
    if (!startDate || !endDate) {
      return 0;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInMs = Math.abs(end - start);
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

  const handlePunchIn = async () => {
    setChooseFace(1);
    if (facePermission == 0) {
      punch_IN();
    } else if (face_kyc_img == null) {
      setKycModal(true);
    } else {
      handleOpenCamera();
    }
  };
  const handlePunchOut = async () => {
    setChooseFace(0);
    console.log(facePermission,'facePermission')
    if (facePermission == 0) {
      punch_Out_EMP();
    } else if (face_kyc_img == null) {
      setKycModal(true);
    } else {
      handleOpenCamera();
    }
  };

  const punch_IN = async () => {
    setloading(true);
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(async location => {
        const lat = parseFloat(location.latitude);
        const long = parseFloat(location.longitude);
        const currentLocation = {latitude: lat, longitude: long};
        const dis = getDistance(activeLocation, currentLocation); // distance in meters
        const radius = punchInRadius;
        const remainingDistance = Math.abs(dis - radius);

        const urlAddress = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg`;
        const address = await axios.get(urlAddress);

        const body = {
          punch_in_latitude: lat,
          punch_in_longitude: long,
          punch_in_address: address.data?.results[0]?.formatted_address,
        };

        // ✅ Radius condition
        if (radius === 0 || dis <= radius) {
          setDisabledBtn(true);
          try {
            const url = `${BASE_URL}/employee/make/attendance`;
            let token = await AsyncStorage.getItem('TOKEN');
            const response = await punchin(url, body, token);
            CheckDailyAttendances();
            if (response?.data?.status) {
              AsyncStorage.setItem(
                'oldLocation',
                JSON.stringify(currentLocation),
              );
              setKycModal(false);
              user_details();
              CheckDailyAttendances();
              setLoader(false);
              setloading(false);
              setPunch(response?.data);
              setDisabledBtn(false);
              showMessage({
                message: `${response?.data?.message}`,
                type: 'success',
                duration: 3000,
              });
            } else {
              showMessage({
                message: `${response?.data?.message}`,
                type: 'danger',
                duration: 4000,
              });
              const payload = {
                data: body,
                url,
                method: 'post',
                message: response?.data?.message,
              };
              activeLog(payload);
              setKycModal(false);
              setLoader(false);
              setloading(false);
              setDisabledBtn(false);
            }
          } catch (error) {
            console.error('Error making POST request:', error);
            setloading(false);
            setKycModal(false);
            setDisabledBtn(false);
            setLoader(false);
          }
        } else {
          setloading(false);
          const dis =
            remainingDistance >= 1000
              ? `${(remainingDistance / 1000).toFixed(2)} kilometers`
              : `${remainingDistance} meters`;
          showMessage({
            message: `You are out of allowed punch-in range. ${dis}  away.`,
            type: 'danger',
            duration: 4000,
          });
        }
      })
      .catch(error => {
        const {code, message} = error;
        setloading(false);
        showMessage({
          message: message,
          type: 'danger',
          duration: 4000,
        });
      });
  };

  const punch_Out_EMP = async punchOutConfirm => {
    setloading(true);
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(async location => {
        var lat = parseFloat(location.latitude);
        var long = parseFloat(location.longitude);
        const currentLocation = {latitude: lat, longitude: long};
        const dis = getDistance(activeLocation, currentLocation); // distance in meters
        const radius = punchInRadius;
        const remainingDistance = Math.abs(dis - radius);

        const urlAddress = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg`;
        const address = await axios.get(urlAddress);
        var body = {
          punch_out_latitude: lat,
          punch_out_longitude: long,
          punch_out_address: address.data?.results[0]?.formatted_address,
          attendance_id: attendanceId,
          ...(punchOutConfirm && {force: true}),
        };

        if (radius === 0 || dis <= radius) {
          setDisabledBtn(true);
          try {
            const url = `${BASE_URL}/employee/make/attendance`;
            let token = await AsyncStorage.getItem('TOKEN');
            const response = await punchin(url, body, token);
            if (response?.data?.status) {
              CheckDailyAttendances();
              getLastAttendance;
              breakingList();
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
              if (response.data.before_punchout_confirm_required) {
                Alert.alert('Punch Out', response?.data?.message, [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () =>
                      punch_Out_EMP(
                        response.data.before_punchout_confirm_required,
                      ),
                  },
                ]);
              }
            }
          } catch (error) {
            console.error('Error making POST request:', error);
            setloading(false);
            setDisabledBtn(false);
            setLoader(false);
          }
        } else {
          setloading(false);
          const dis =
            remainingDistance >= 1000
              ? `${(remainingDistance / 1000).toFixed(2)} kilometers`
              : `${remainingDistance} meters`;
          showMessage({
            message: `You are out of allowed punch-out range. ${dis}  away.`,
            type: 'danger',
            duration: 4000,
          });
        }
      })
      .catch(error => {
        const {code, message} = error;

        setloading(false);
        showMessage({
          message: message,
          type: 'danger',
        });
      });
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
    let punchOutConfirm = false;
    Alert.alert('Are you sure?', 'Do you really want to log out?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => punch_Out_EMP(punchOutConfirm)},
    ]);
  };
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const result = await Geolocation.requestAuthorization('always');
        // You can optionally check for 'granted', 'denied', or 'disabled'
        return result === 'granted';
      } catch (error) {
        console.warn('iOS location permission error:', error);
        return false;
      }
    } else {
      try {
        const fineLocationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'We need access to your location ' +
              'so we can provide location-based services.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (fineLocationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Fine location permission denied');
          return false;
        }

        const backgroundGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );

        if (backgroundGranted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Background location permission denied');
          return false;
        }

        return true;
      } catch (err) {
        console.warn('Android location permission error:', err);
        return false;
      }
    }
  };
  const getDistance = (loc1, loc2) => {
    const toRad = value => (value * Math.PI) / 180;
    const R = 6371e3; // Radius of Earth in meters

    const lat1 = toRad(loc1.latitude);
    const lat2 = toRad(loc2.latitude);
    const deltaLat = toRad(loc2.latitude - loc1.latitude);
    const deltaLon = toRad(loc2.longitude - loc1.longitude);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters

    return distance;
  };
  const sendStoredLocation = async new_location => {
    if (timerOn && locationTracking == 1 && liveLocationActive == 1) {
      try {
        const token = await AsyncStorage.getItem('TOKEN');
        const url = `${BASE_URL}/location-tracking/send`;
        const form = 0;
        const data = {
          user_id: empyId,
          locations: [
            {
              latitude: new_location.latitude.toString(),
              longitude: new_location.longitude.toString(),
            },
          ],
        };
        const response = await locationSend(url, data, token, form);
        console.log(response.data, 'yashlocation');
      } catch (error) {
        console.error('Error sending stored location:', error.response.data);
      }
    } else {
      console.log('Location Tracking Blocked for this user');
    }
  };
  useEffect(() => {
    async function fetchMyAPI() {
      const token = await AsyncStorage.getItem('TOKEN');
      if (token && locationTracking == 1 && liveLocationActive == 1) {
        startBackgroundService();
      } else {
        EndBackgroundService();
      }
    }
    fetchMyAPI();
  }, [timerOn, locationTracking, liveLocationActive]);
  const EndBackgroundService = async () => {
    Geolocation.stopObserving();
    BackgroundService.on('expiration', () => {
      console.log('Background service is being closed :(');
    });
    await BackgroundService.stop();
  };
  const sleep = time => new Promise(resolve => setTimeout(resolve, time));
  const [watchId, setWatchId] = useState(null);
  const startBackgroundService = async () => {
    const veryIntensiveTask = async ({delay}) => {
      const cleanup = () => {
        if (watchId !== null) Geolocation.clearWatch(watchId);
      };

      cleanup();

      while (BackgroundService.isRunning(veryIntensiveTask)) {
        if (!timerOn) {
          cleanup();
          break;
        }

        if (!(await requestLocationPermission())) {
          setTracking(false);
          return;
        }
        watchId = Geolocation.watchPosition(
          async ({coords: {latitude, longitude}}) => {
            try {
              const newLocation = {latitude, longitude};
              const oldLocationStr = await AsyncStorage.getItem('oldLocation');
              const oldLocation = oldLocationStr
                ? JSON.parse(oldLocationStr)
                : null;

              if (oldLocation) {
                const distance = getDistance(oldLocation, newLocation);
                console.log('Distance yash:', Math.floor(distance));

                if (Math.floor(distance) >= 150) {
                  console.log('yash');
                  sendStoredLocation(newLocation, distance, oldLocation);
                  await AsyncStorage.setItem(
                    'oldLocation',
                    JSON.stringify(newLocation),
                  );
                }
              } else {
                await AsyncStorage.setItem(
                  'oldLocation',
                  JSON.stringify(newLocation),
                );
              }
            } catch (error) {
              console.error('Error handling location update:', error);
            }
          },
          error => console.error('Location Error:', error),
          {
            enableHighAccuracy: true,
            distanceFilter: 5,
            interval: 0,
            maximumAge: 0,
            showLocationDialog: true,
          },
        );
        console.log('watchId', watchId);

        setWatchId(watchId);

        await sleep(delay);
      }

      cleanup();
    };

    try {
      await BackgroundService.start(veryIntensiveTask, {
        taskName: 'HRJee Track',
        taskTitle: 'Tracking Location',
        taskDesc: 'Tracking started',
        taskIcon: {name: 'ic_launcher', type: 'mipmap'},
        color: '#ff00ff',
        linkingURI: 'yourSchemeHere://chat/jane',
        parameters: {delay: 1000},
      });
    } catch (e) {
      console.error('Error starting background service:', e);
    }
  };

  const attendance_Request = async () => {
    const token = await AsyncStorage.getItem('TOKEN');

    if (!punchInTime) {
      showMessage({
        message: 'Please enter Punch In Time',
        type: 'danger',
        duration: 2000,
      });
    } else if (!punchOutTime) {
      showMessage({
        message: 'Please enter Punch Out Time',
        type: 'danger',
        duration: 2000,
      });
    } else if (reasonText.trim() === '') {
      showMessage({
        message: 'Please Enter Reason',
        type: 'danger',
        duration: 2000,
      });
    } else {
      setLoader(true);

      // Format: H:i (e.g., 8:00, 13:45)
      const formatToHi = date => {
        const hours = date.getHours(); // 0-23
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      const data = JSON.stringify({
        date: startdateRequest.toISOString().split('T')[0],
        punch_in: formatToHi(punchInTime),
        punch_out: formatToHi(punchOutTime),
        reason: reasonText,
      });

      const url = `${BASE_URL}/attendance/request/store`;
      console.log(data, url);

      const response = await AttendanceRequest(url, data, token, 0);
      setLoader(false);
      setModalRequest(false);
      if (response?.data?.status) {
        setReasonText('');
        showMessage({
          message: response?.data?.message,
          type: 'success',
        });
      } else {
        setModalRequest(false);
      }
    }
  };
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const getLastAttendanceDaily = () => {
    if (lastAttendanceDetails.data == 'No Last Attendance Available') {
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
      return lastAttendanceDetails?.data.map((elements, index) => {
        return (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 10,
              marginVertical: 8,
              padding: 10,
              borderRadius: 10,
              backgroundColor: currentTheme.cardBackground,
              // elevation: 2,
              borderWidth: 0.5,
            }}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: currentTheme.text,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                {elements?.day}
              </Text>
              <Text style={{color: currentTheme.text, fontSize: 16}}>
                {elements?.date}
              </Text>
              <Text
                style={{color: currentTheme.text, fontSize: 15, marginTop: 4}}>
                Punch In:{' '}
                {elements?.punch_in?.split(' ')[1].slice(0, 5) ?? '--'}
              </Text>
              <Text style={{color: currentTheme.text, fontSize: 15}}>
                Punch Out:{' '}
                {elements?.punch_out?.split(' ')[1].slice(0, 5) ?? '--'}
              </Text>
            </View>

            {/* Right Section - Clock and Total Hours */}
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={{
                  tintColor: currentTheme.text,
                  height: 30,
                  width: 30,
                  marginBottom: 4,
                }}
                source={require('../../assets/HomeScreen/clock.png')}
              />
              <Text
                style={{
                  color: currentTheme.text,
                  fontSize: 16,
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
          message: 'Please enter Message',
          type: 'danger',
        });
      } else {
        setLeaveLoader(true);
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
          setLeaveLoader(false);
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
          setLeaveLoader(false);
        }
      }
    } catch (error) {
      setLeaveLoader(false);
      // console.error('Error making POST request:', error);
      showMessage({
        message: `${error.response.data.message}`,
        type: 'danger',
        duration: 6000,
      });

      setLoader(false);
    }
  };
  const getDateRange = (start, end) => {
    let range = {};
    let currentDate = new Date(start);
    const lastDate = new Date(end);

    while (currentDate <= lastDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      range[dateString] = {
        color: '#0E0E64',
        textColor: 'white',
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    range[start] = {
      startingDay: true,
      color: '#0E0E64',
      textColor: 'white',
    };
    range[end] = {
      endingDay: true,
      color: '#0E0E64',
      textColor: 'white',
    };

    return range;
  };
  const onDayPress = day => {
    setSelected(day.dateString);
    setMonth(day);
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
    } else {
      if (new Date(day.dateString) < new Date(startDate)) {
        setEndDate(startDate);
        setStartDate(day.dateString);
      } else {
        setEndDate(day.dateString);
      }
    }
  };
  const markedDates =
    startDate && endDate
      ? getDateRange(startDate, endDate)
      : startDate
      ? {
          [startDate]: {
            startingDay: true,
            color: '#0E0E64',
            textColor: 'white',
          },
        }
      : {};
  if (selected && !markedDates[selected]) {
    markedDates[selected] = {
      selected: true,
      selectedDotColor: '#0E0E64',
      disableTouchEvent: true,
    };
  }

  if (todayAttendanceDetails == null) {
    return <HomeSkeleton />;
  }
  if (isCameraOpen) {
    return chooseFace == 0 ? 
    (
      <PunchOutFace punchout={punch_Out_EMP} />
    ):
    (
      <FaceCamera punchIn={punch_IN} />
    );
  } else {
    return (
      <View style={{flex: 1, backgroundColor: currentTheme.background}}>
        <NotificationController />
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
              <TouchableOpacity onPress={() => navigation.navigate('MyDrawer')}>
                {getProfileApiData?.details?.profile_image ==
                  'https://hrjee-dev.xonierconnect.com/storage' ||
                getProfileApiData?.details?.profile_image == [] ||
                getProfileApiData?.details?.profile_image == null ? (
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
                    source={{uri: getProfileApiData?.details?.profile_image}}
                  />
                )}
              </TouchableOpacity>
              <View style={{marginHorizontal: 15}}>
                <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>
                  {empyName}
                </Text>
                <Text style={{color: '#fff', fontSize: 18}}>
                  {formattedDate}
                </Text>
              </View>
            </View>
          </View>
        </View>
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
                padding: 15,
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
                {inTime && !outTime && (
                  <Text
                    style={{
                      color: currentTheme.text_v2,
                      fontSize: 18,
                      marginTop: 5,
                    }}>
                    Break Time
                  </Text>
                )}
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
                        marginTop: allowfacenex == 1 ? 35 : 0,
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
                    {allowfacenex == 0 ? (
                      <TouchableOpacity
                        onPress={() => handlePunchOut()}
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
                    ) : null}
                  </>
                )}
                {!inTime && !outTime && allowfacenex == 1 && (
                  <View
                    style={{
                      marginTop: 10,
                      maxWidth: 200,
                      alignSelf: 'center',
                      paddingHorizontal: 10,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 14,
                        lineHeight: 20,
                      }}>
                      Please use FaceNex to punch in. Direct access is not
                      allowed.
                    </Text>
                  </View>
                )}

                {!inTime && !outTime && allowfacenex == 0 && (
                  <TouchableOpacity
                    onPress={() => handlePunchIn()}
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
                {breakTotatimeStatus ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                    }}>
                    <Text
                      style={{
                        color: currentTheme.text_v2,
                        fontSize: 18,
                        textAlign: 'center',
                        marginLeft: 32,
                      }}>
                      {fullbreakTime}
                    </Text>
                  </View>
                ) : null}
                {inTimeBreak != null ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                    }}>
                    <Text
                      style={{
                        color: currentTheme.text_v2,
                        fontSize: 18,
                        textAlign: 'center',
                        marginLeft: 32,
                      }}>
                      {breaktime}
                    </Text>
                  </View>
                ) : null}
              </View>
              {/* {todayAttendanceDetails.length > 1 ? (
                <TouchableOpacity
                  onPress={() => navigation.navigate('AllPunchIn')}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 20,
                    backgroundColor: currentTheme.buttonText,
                    borderRadius: 25,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    elevation: 5, // for Android shadow
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                  }}>
                  <Text
                    style={{
                      color: currentTheme.text,
                      fontSize: 16,
                      fontWeight: '400',
                    }}>
                    All Punch IN
                  </Text>
                </TouchableOpacity>
              ) : null} */}
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                onPress={() => setModalRequest(true)}
                style={{marginLeft: 2}}>
                <Text
                  style={[
                    {
                      fontSize: 15,
                      fontWeight: '500',
                      backgroundColor: currentTheme.background_v2,
                      padding: 10,
                      borderRadius: 10,
                      color: '#fff',
                    },
                  ]}>
                  Attendance Request
                </Text>
              </TouchableOpacity>
              {inTime && inTimeBreak == null && !outTime && (
                <TouchableOpacity
                  onPress={() => setBreakModal(true)}
                  style={{marginRight: 2}}>
                  <Text
                    style={[
                      {
                        fontSize: 15,
                        fontWeight: '500',
                        backgroundColor: currentTheme.background_v2,
                        padding: 10,
                        borderRadius: 10,
                        color: '#fff',
                      },
                    ]}>
                    Take Break
                  </Text>
                </TouchableOpacity>
              )}
              {inTimeBreak != null ? (
                <TouchableOpacity
                  onPress={() => handleBreakOut()}
                  style={{
                    marginRight: 2,
                    backgroundColor: currentTheme.background_v2,
                    borderRadius: 10,
                  }}>
                  {breakLoader ? (
                    <ActivityIndicator
                      size="small"
                      color="#fff"
                      style={{padding: 20}}
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '500',
                        padding: 10,
                        borderRadius: 10,
                        color: '#fff',
                      }}>
                      Break out
                    </Text>
                  )}
                </TouchableOpacity>
              ) : null}
            </View>

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
                              backgroundColor: startDate
                                ? 'orange'
                                : currentTheme.background_v2,
                              borderRadius: 100,
                              height: 90,
                              width: 90,
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{
                                color: startDate ? '#000' : '#fff',
                                textAlign: 'center',
                              }}>
                              {startDate
                                ? new Date(startDate).getDate()
                                : 'Start'}
                            </Text>
                            <Text
                              style={{
                                color: startDate ? '#000' : '#fff',
                                textAlign: 'center',
                              }}>
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
                              backgroundColor: endDate
                                ? 'orange'
                                : currentTheme.background_v2,
                              borderRadius: 100,
                              height: 90,
                              width: 90,
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{
                                color: endDate ? '#000' : '#fff',
                                textAlign: 'center',
                              }}>
                              {endDate ? new Date(endDate).getDate() : 'End'}
                            </Text>
                            <Text
                              style={{
                                color: endDate ? '#000' : '#fff',
                                textAlign: 'center',
                              }}>
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
                            onDayPress={onDayPress}
                            markedDates={markedDates}
                            markingType={'period'} // important for range marking
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
                            renderItem={item => (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  padding: 10,
                                  borderBottomWidth: 1,
                                  borderColor: '#ccc',
                                }}>
                                <Text style={{flex: 1, color: '#000'}}>
                                  {item.code}
                                </Text>
                                <Text style={{flex: 2, color: '#000'}}>
                                  {item.name}
                                </Text>
                              </View>
                            )}
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
                            placeholder="Message"
                            numberOfLines={6}
                            textAlignVertical={'top'}
                            onChangeText={text => setReason(text)}
                            style={{height: 120, marginLeft: 15}} // Adjust height as needed
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
                        {leaveLoader ? (
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
                    </ScrollView>
                  </View>
                </View>
              ) : null}
            </View>

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
          animationOutTiming={500}>
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
        <Modal isVisible={kycModal} animationIn="zoomIn" animationOut="zoomOut">
          <View
            style={{
              backgroundColor: 'white',
              padding: 22,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              borderColor: 'rgba(0, 0, 0, 0.1)',
            }}>
            <View style={{alignSelf: 'flex-end'}}>
              <AntDesign
                name="close"
                size={22}
                style={{
                  marginBottom: 5,
                }}
                color="red"
                onPress={() => setKycModal(!kycModal)}
              />
            </View>
            <Image
              source={require('../../assets/kycicon.png')}
              style={{
                width: responsiveWidth(90),
                height: responsiveHeight(28),
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
            />
            <Text
              style={{
                color: '#000',
                fontSize: responsiveFontSize(2),
                fontWeight: 'bold',
                marginTop: responsiveHeight(1),
              }}>
              Please complete your KYC.
            </Text>
            <TouchableOpacity
              style={{
                width: responsiveWidth(30),
                height: responsiveHeight(5),
                backgroundColor: '#0043ae',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: responsiveHeight(1),
              }}
              onPress={() => [handleOpenCamera()]}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: responsiveFontSize(1.7),
                }}>
                Camera
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
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

              <Text style={styles.label}>Punch In Time</Text>
              <TouchableOpacity
                style={styles.Date_box}
                onPress={() => setOpenPunchIn(true)}>
                <Text style={{color: '#000'}}>
                  {punchInTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
                <EvilIcons name="clock" size={25} color="#000" />
              </TouchableOpacity>

              {/* Punch Out Time */}
              <Text style={styles.label}>Punch Out Time</Text>
              <TouchableOpacity
                style={styles.Date_box}
                onPress={() => setOpenPunchOut(true)}>
                <Text style={{color: '#000'}}>
                  {punchOutTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
                <EvilIcons name="clock" size={25} color="#000" />
              </TouchableOpacity>

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
        <Modal visible={breakModal} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={{color: '#333', fontSize: 15, marginVertical: 5}}>
                Select Break Type :-
              </Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={[{color: '#000'}]}
                selectedTextStyle={[{color: '#000'}]}
                itemTextStyle={{
                  color: '#000',
                }}
                data={listBreak}
                labelField="name"
                valueField="id"
                placeholder="Select Break Type"
                value={breakValue}
                onChange={item => [
                  setBreakValue(item.id),
                  setBreakDescription(item),
                ]}
              />
              {breakDescription?.description ? (
                <Text style={{color: '#000', fontSize: 13, marginTop: 5}}>
                  {breakDescription.description}
                </Text>
              ) : null}
              <Text style={{color: '#333', fontSize: 15, marginVertical: 5}}>
                Message :-
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Message"
                value={reasonText}
                onChangeText={prev => setReasonText(prev)}
                placeholderTextColor="#999"
                multiline
              />

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleBreakIn()}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setBreakModal(false)}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <DatePicker
          modal
          open={openStartDate}
          date={startdateRequest}
          theme="light"
          mode="date"
          maximumDate={new Date()}
          onConfirm={date => {
            setOpenStartDate(false);
            setStartdateRequest(date);
          }}
          onCancel={() => setOpenStartDate(false)}
        />

        <DatePicker
          modal
          mode="time"
          open={openPunchIn}
          date={punchInTime}
          onConfirm={time => {
            setOpenPunchIn(false);
            setPunchInTime(time);
          }}
          onCancel={() => setOpenPunchIn(false)}
        />

        <DatePicker
          modal
          mode="time"
          open={openPunchOut}
          date={punchOutTime}
          onConfirm={time => {
            setOpenPunchOut(false);
            setPunchOutTime(time);
          }}
          onCancel={() => setOpenPunchOut(false)}
        />
      </View>
    );
  }
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
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)',
    // width: '100%',
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
