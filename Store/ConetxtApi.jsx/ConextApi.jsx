import {StyleSheet, Text, View} from 'react-native';
import {Appearance, Switch} from 'react-native';
import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {lightTheme, darkTheme} from '../../Theme/theme';
import {getProfile, menuaccess} from '../../APINetwork/ComponentApi';
import {BASE_URL} from '../../utils';
import { Camera, useCameraPermission, useCameraDevice } from 'react-native-vision-camera';
export const ThemeContext = createContext();
const ConextApi = ({children}) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [alrmNoti, setAlrmNoti] = useState([]);
  const [viewMedi, setViewMedi] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [kycModal,setKycModal]=useState(false);
  const systemColorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(systemColorScheme);
  const [isManual, setIsManual] = useState(false);
  const [menuaccesssList, setMenuaccessList] = useState();
  const [isEnabled, setIsEnabled] = useState(false);
  const [facePermission,setFacePermission]=useState('');
  const [empyId,setEmpyId]=useState();
  const [empyName,setEmpyName]=useState('')
  const [face_kyc_img, setFace_kyc_img] = useState();
  const [requestAttendance,setRequestAttendance]=useState();
  const [requestAnnouncements,setRequestAnnouncements]=useState();
  const [menuAccessServies,setMenuAccessServies]=useState()
  const [compOff,setCompOff]=useState();
  const [rewardList,setRewardList]=useState('');
  const [teamUser,setTeamUser]=useState()
  const services = [
    {
      id: '1',
      name: 'Policies',
      uri:
        theme === 'light'
          ? require('../../assets/HomeScreen/h1.png')
          : require('../../assets/home2.png'),
      nav: 'Policy',
    },
    {
      id: '2',
      name: 'Employee News',
      uri:
        theme === 'light'
          ? require('../../assets/HomeScreen/h2.png')
          : require('../../assets/home3.png'),
      nav: 'News',
    },

    {
      id: '3',
      name: 'Announcements',
      uri:
        theme === 'light'
          ? require('../../assets/announcement.png')
          : require('../../assets/announcement1.png'),
      nav: 'Announcement',
    },
  ];


  async function menuAccess() {
    try {
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/menu-access`;
      const response = await menuaccess(url, token);
      if (response?.data?.status === true) {
        if (response?.data?.status === true) {
          const apiServices = response?.data.data.filter(
            item => item.status === 1,
          );
          const matchedServices = services.filter(localService =>
            apiServices.some(
              apiService => apiService.title === localService.name,
            ),
          );
          setMenuaccessList(matchedServices);
        }
      }
    } catch (error) {
      console.error('Error fetching menu access:', error);
    }
  }
  async function user_details() {
    try {
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/profile/details`;
      const response = await getProfile(url, token);
      setRewardList(response?.data?.data?.user_reward);
      setTeamUser(response?.data?.data?.manager_employees);
      let options = []
      const serviesData=[ {
        id: 1,
        uri: require('../../assets/Services/s2.png'),
        name: 'Leave',
        nav: 'Leaves',
      },
      {
        id: 3,
        uri: require('../../assets/Services/s4.png'),
        name: 'Visit Location',
        nav: 'LocationList',
      },
      {
        id: 4,
        uri: require('../../assets/Services/s4.png'),
        name: 'Team',
        nav: 'Team',
      },
   
    ]
      response?.data?.data.menu_access?.map((item) => {
        if (item.id=="94") {
          options.push({
            id: 94,
            uri: require('../../assets/Services/s5.png'),
            name: 'Attendance Request',
            nav: 'AttendanceRequest',
          })
        } else if (item.id=="95") {
          options.push({
            id: 95,
            uri: require('../../assets/ofiiceAddress.png'),
            name: 'Office Address',
            nav: 'ListOfficeAddress',
          })
        }
        else if (item.id=="103") {
          options.push({
            id: 103,
            uri: require('../../assets/Services/s3.png'),
            name: 'Holiday',
            nav: 'Holiday',
          })
        }
        else if (item.id=="104") {
          options.push({
            id: 104,
            uri: require('../../assets/Services/s6.png'),
            name: 'Resign',
            nav: 'Resign',
          })
        }
        else if (item.id=="105") {
          options.push({
            id: 105,
            uri: require('../../assets/Services/s5.png'),
            name: 'PRM',
            nav: 'PRMList',
          })
          
        } 
        else if (item.id=="110") {
          options.push({
            id: 110,
            uri: require('../../assets/HomeScreen/medal.png'),
            name: 'Reward',
            nav: 'Reward',
          })
          
        }    
        return item;
      })
      setMenuAccessServies([...serviesData, ...options]);

      if (response?.data?.status === true) {
        const RequestAttendance = response?.data?.data?.menu_access?.filter(
          item => item?.id == '76',
        );
        console.log(RequestAttendance,'RequestAttendance')
        setRequestAttendance(RequestAttendance);
        const Announcements = response?.data?.data?.menu_access?.filter(
          item => item?.id == '78',
        );
        setRequestAnnouncements(Announcements);
        const CompOffs = response?.data?.data?.menu_access?.filter(
          item => item?.id == '91',
        );
        setCompOff(CompOffs);
        setEmpyId(response?.data?.data?.details?.user_id);
        setEmpyName(response?.data?.data?.name);
        let facekycPermission=response?.data?.data?.details?.face_recognition
        let facekycAdd=response?.data?.data?.details?.face_kyc
        setFace_kyc_img(facekycAdd);
        setFacePermission(response?.data?.data?.details?.face_recognition);
        if(facekycPermission==1){
          if(facekycAdd==null)
          setKycModal(true)
        }
        
      } else {
      
      }
    } catch (error) {
      console.log('Error making POST request:', error);
    
    }
  }
  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        if (savedTheme == 'dark') {
          setTheme(savedTheme);
          setIsManual(true);
          setIsEnabled(!isEnabled);
          setModalVisible(false);
        } else {
          setTheme(savedTheme);
          setIsManual(true);
          setModalVisible(true);
        }
      } else {
        setModalVisible(true);
      }
    };
    loadTheme();
    menuAccess();
    user_details()
  }, [theme]);
  const toggle = () => {
    // setDarkTheme(!darkTheme);
  };
  const saveTheme = async theme => {
    await AsyncStorage.setItem('theme', theme);
  };
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIsManual(true);
    saveTheme(newTheme);
    setIsEnabled(previousState => !previousState);
  };
  useEffect(() => {
    if (!isManual) {
      const subscription = Appearance.addChangeListener(({colorScheme}) => {
        setTheme(colorScheme);
      });
      return () => subscription.remove();
    }
  }, [isManual]);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;
  return (
    <ThemeContext.Provider
      value={{
        darkTheme,
        toggle,
        setAlrmNoti,
        alrmNoti,
        setViewMedi,
        viewMedi,
        theme,
        toggleTheme,
        currentTheme,
        isEnabled,
        setIsEnabled,
        setTheme,
        isModalVisible,
        setModalVisible,
        menuaccesssList,
        menuAccess,
        setIsCameraOpen,
        isCameraOpen,
        handleOpenCamera,
        facePermission,
        kycModal,
        setKycModal,
        user_details,
        empyId,
        face_kyc_img,
        empyName,
        requestAttendance,
        requestAnnouncements,
        compOff,
        menuAccessServies,
        rewardList,
        teamUser
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ConextApi;
const styles = StyleSheet.create({});
