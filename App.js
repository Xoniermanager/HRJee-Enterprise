
import { StyleSheet, Text, View, StatusBar } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import ConextApi from './Store/ConetxtApi.jsx/ConextApi';
import MyStack from './Navigation/MyStack/MyStack';
import 'react-native-gesture-handler';
import FlashMessage from "react-native-flash-message";

const App = () => {
  return (
    <ConextApi>
      <StatusBar barStyle="light-content" backgroundColor="#0E0E64" />
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
      <FlashMessage position="top" />
    </ConextApi>
  )
}

export default App

const styles = StyleSheet.create({})


