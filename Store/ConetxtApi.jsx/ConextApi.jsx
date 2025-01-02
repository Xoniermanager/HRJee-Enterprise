import { StyleSheet, Text, View } from 'react-native'
import { Appearance, Switch } from 'react-native';
import React, { Children, createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../../Theme/theme';
export const ThemeContext = createContext();
const ConextApi = ({ children }) => {
  const [alrmNoti, setAlrmNoti] = useState([])
  const [viewMedi, setViewMedi] = useState(false)

  const systemColorScheme = Appearance.getColorScheme(); // System theme
  const [theme, setTheme] = useState(systemColorScheme); // State for theme
  const [isManual, setIsManual] = useState(false); // Tracks manual override
  const [isEnabled, setIsEnabled] = useState(false);
  // Load saved theme preference from storage
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
        setIsManual(true);
        setIsEnabled(!isEnabled)
      }
    };
    loadTheme();
  }, []);
  const toggle = () => {
    setDarkTheme(!darkTheme);
  };
  const saveTheme = async (theme) => {
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
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setTheme(colorScheme);
      });
      return () => subscription.remove();
    }
  }, [isManual]);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;
  return (
    <ThemeContext.Provider value={{ darkTheme, toggle, setAlrmNoti, alrmNoti, setViewMedi, viewMedi, theme, toggleTheme, currentTheme ,isEnabled, }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ConextApi

const styles = StyleSheet.create({})