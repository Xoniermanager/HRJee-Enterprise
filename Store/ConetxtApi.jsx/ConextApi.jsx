import {StyleSheet, Text, View} from 'react-native';
import {Appearance, Switch} from 'react-native';
import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {lightTheme, darkTheme} from '../../Theme/theme';
import {menuaccess} from '../../APINetwork/ComponentApi';
import {BASE_URL} from '../../utils';
export const ThemeContext = createContext();
const ConextApi = ({children}) => {
  const [alrmNoti, setAlrmNoti] = useState([]);
  const [viewMedi, setViewMedi] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const systemColorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(systemColorScheme);
  const [isManual, setIsManual] = useState(false);
  const [menuaccesssList, setMenuaccessList] = useState();
  const [isEnabled, setIsEnabled] = useState(false);
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
    // {
    //   id: '3',
    //   name: 'Payslip',
    //   uri:
    //     theme === 'light'
    //       ? require('../../assets/HomeScreen/h3.png')
    //       : require('../../assets/home1.png'),
    //   nav: 'Salary',
    // },
    {
      id: '3',
      name: 'Policies',
      uri:
        theme === 'light'
          ? require('../../assets/HomeScreen/h3.png')
          : require('../../assets/home1.png'),
          nav: 'Salary',    
        },
    {
      id: '4',
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
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ConextApi;
const styles = StyleSheet.create({});
