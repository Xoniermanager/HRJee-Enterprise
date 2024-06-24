import { StyleSheet, Text, View } from 'react-native'
import React,{Children, createContext,useState} from 'react'

export const ThemeContext = createContext();
const ConextApi = ({children}) => {
  const [darkTheme, setDarkTheme] = React.useState(false);
  const [alrmNoti,setAlrmNoti]=useState([])
  const [viewMedi,setViewMedi]=useState(false)
  const toggle = () => {
    setDarkTheme(!darkTheme);
  };
  return (
    <ThemeContext.Provider value={{darkTheme, toggle,setAlrmNoti,alrmNoti,setViewMedi,viewMedi}}>
    {children}
  </ThemeContext.Provider>
  )
}

export default ConextApi

const styles = StyleSheet.create({})