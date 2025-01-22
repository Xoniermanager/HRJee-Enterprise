import {StyleSheet, Text, View} from 'react-native';
import {Appearance, Switch} from 'react-native';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {lightTheme, darkTheme} from '../../Theme/theme';
export const ThemeContext = createContext();
const ConextApi = ({children}) => {
  const [alrmNoti, setAlrmNoti] = useState([]);
  const [viewMedi, setViewMedi] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const systemColorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(systemColorScheme);
  const [isManual, setIsManual] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
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
          console.log('first');
          setTheme(savedTheme);
          setIsManual(true);
          setModalVisible(true);
        }
      }
    };
    loadTheme();
  }, []);
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
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ConextApi;
const styles = StyleSheet.create({});
