import {StyleSheet, Text, View} from 'react-native';
import {Appearance,} from 'react-native';
import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {lightTheme, darkTheme} from '../../Theme/theme';
import {getProfile, log_activity, menuaccess} from '../../APINetwork/ComponentApi';
import {BASE_URL} from '../../utils';
import axios from 'axios';
export const ThemeContext = createContext();
const ConextApi = ({children}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [alrmNoti, setAlrmNoti] = useState([]);
  const [viewMedi, setViewMedi] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [kycModal,setKycModal]=useState(false);
  const systemColorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(systemColorScheme);
  const [isManual, setIsManual] = useState(false);
  const [menuaccesssList, setMenuaccessList] = useState(null);
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
  const [teamUser,setTeamUser]=useState();
  const [locationTracking,setLocationTracking]=useState(null);
  const [liveLocationActive,setLiveLocationActive]=useState(null);
  const [getProfileApiData, setGetProfileApiData] = useState('');
  const [allowfacenex,setAllowfacenex]=useState(null);
  const services = [
    {
      id: '1',
      name: 'Policies',
      uri:
        'light' === 'light'
          ? require('../../assets/HomeScreen/h1.png')
          : require('../../assets/home2.png'),
      nav: 'Policy',
    },
    {
      id: '2',
      name: 'Employee News',
      uri:
        'light' === 'light'
          ? require('../../assets/HomeScreen/h2.png')
          : require('../../assets/home3.png'),
      nav: 'News',
    },

    {
      id: '3',
      name: 'Announcements',
      uri:
        'light' === 'light'
          ? require('../../assets/announcement.png')
          : require('../../assets/announcement1.png'),
      nav: 'Announcement',
    },
    {
      id: '4',
      name: 'Payslip',
      uri:
        'light' === 'light'
        ? require('../../assets/HomeScreen/h3.png')
        : require('../../assets/HomeScreen/h3.png'),
      nav: 'Salary',
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
      {
        id: 5,
        uri: require('../../assets/HomeScreen/course.webp'),
        name: 'Training',
        nav: 'Course',
      },
      {
        id: 6,
        uri: require('../../assets/Services/s7.png'),
        name: 'Upload Document',
        nav: 'UploadDocumentScreen',
      },
      {
        id: 7,
        uri: require('../../assets/Services/s8.webp'),
        name: 'Reports',
        nav: 'TaskReportScreen',
      },
      {
        id: 8,
        uri: require('../../assets/Services/s9.webp'),
        name: 'Support',
        nav: 'SupportPage',
      },
     ]
      response?.data?.data.menu_access?.map((item) => {
        if (item.title=="Request Attendance") {
          options.push({
            id: 113,
            uri: require('../../assets/Services/s5.png'),
            name: 'Attendance Request',
            nav: 'AttendanceRequest',
          })
        } else if (item.title=="Request Address") {
          options.push({
            id: 114,
            uri: require('../../assets/ofiiceAddress.png'),
            name: 'Office Address',
            nav: 'ListOfficeAddress',
          })
        }
        else if (item.title=="Holidays") {
          options.push({
            id: 122,
            uri: require('../../assets/Services/s3.png'),
            name: 'Holiday',
            nav: 'Holiday',
          })
        }
        else if (item.title=="Resignation") {
          options.push({
            id: 123,
            uri: require('../../assets/Services/s6.png'),
            name: 'Resign',
            nav: 'Resign',
          })
        }
        else if (item.title=="PRM") {
          options.push({
            id: 124,
            uri: require('../../assets/Services/s5.png'),
            name: 'PRM',
            nav: 'PRMList',
          })
          
        } 
        else if (item.title=="My Rewards") {
          options.push({
            id: 129,
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
          item => item?.title == 'Attendance Request',
        );

        setRequestAttendance(RequestAttendance);
        const Announcements = response?.data?.data?.menu_access?.filter(
          item => item?.title == 'Announcements',
        );
        setRequestAnnouncements(Announcements);
        const CompOffs = response?.data?.data?.menu_access?.filter(
          item => item?.title == 'Comp Offs',
        );
        setCompOff(CompOffs);
        setGetProfileApiData(response?.data?.data);
        setEmpyId(response?.data?.data?.details?.user_id);
        setEmpyName(response?.data?.data?.name);
        let facekycPermission=response?.data?.data?.details?.face_recognition
        let facekycAdd=response?.data?.data?.details?.face_kyc
        setFace_kyc_img(facekycAdd);
        setFacePermission(response?.data?.data?.details?.face_recognition);
        setAllowfacenex(response?.data?.data?.details?.allow_face_nex);
        setRewardList(response?.data?.data?.user_reward);
        setTeamUser(response?.data?.data?.manager_employees);
        setLocationTracking(response.data.data.details.location_tracking);
        setLiveLocationActive(response.data.data.details.live_location_active);
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
  const activeLog=async(payload)=>{
    const token=await AsyncStorage.getItem('TOKEN');
    console.log(token)
    const data={
      "request_body":JSON.stringify(payload.data),
      "response_code":'null',
      "response_body": payload.message,
      "url": payload.url,
      "method": payload.method
    }
let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `${BASE_URL}/log-activity/create`,
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${token}`
  },
  data : data
};
axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
  }
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
        teamUser,
        locationTracking,
        liveLocationActive,
        getProfileApiData,
        activeLog,
        allowfacenex,
        
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ConextApi;
const styles = StyleSheet.create({});
