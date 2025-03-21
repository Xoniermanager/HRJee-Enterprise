import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import {
  responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Pending from './PendingTask/Pending';
import Processing from './ProcessingTask/Processing';
import Done from './DoneTask/Done';
import { ThemeContext } from '../../../Store/ConetxtApi.jsx/ConextApi';

const Tab = createMaterialTopTabNavigator();

const LocationList = ({ navigation }) => {
  const {currentTheme} = useContext(ThemeContext);
  const tabBarOptions = {
    style: {
      backgroundColor: '#0043ae',
      marginTop: 0,
      width: "90%",
      alignSelf: "center",
      borderRadius: 10,
      overflow: 'hidden',
    },
    activeTintColor: '#000',
    inactiveTintColor: '#fff',
    indicatorStyle: {
      backgroundColor: '#fff',
      height: '100%',
      borderRadius: 10,
    },
    pressOpacity: 1,
  };

  return (
    <SafeAreaView style={[styles.container,{backgroundColor:currentTheme.background_v2}]}>
      <View style={{ marginTop: 15 }}>
        {/* <Text style={styles.name}>Task Location</Text> */}
        <View style={[styles.tabContainer,{backgroundColor:currentTheme.background}]}>
          <Tab.Navigator tabBarOptions={tabBarOptions}>
            <Tab.Screen name="My Tasks" component={Pending} />
            <Tab.Screen name="Progress" component={Processing} />
            <Tab.Screen name="Completed" component={Done} />
          </Tab.Navigator>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LocationList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E64',
  },
  name: {
    color: '#fff',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom: responsiveHeight(3),
  },
  tabContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: "100%",
    paddingTop: 15,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
