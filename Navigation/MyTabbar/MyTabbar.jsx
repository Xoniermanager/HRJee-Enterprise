import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../../Component/DashBoard/HomePage';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import Attendance from '../../Component/Attendance/Attendance';
import Services from '../../Component/Services/Services';
import MyDrawer from '../MyDrawer/MyDrawer';
import { ThemeContext } from '../../Store/ConetxtApi.jsx/ConextApi';
import MyStack from '../MyStack/MyStack';
import MyStackTab from '../MyStack/MyStackTab';

const MyTabbar = ({ route }) => {
  const Tab = createBottomTabNavigator();
  const { currentTheme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 70,
          backgroundColor: currentTheme.background_v2,
          borderTopWidth: 0,
          position: 'absolute',
          marginBottom: 5,
          marginHorizontal: responsiveWidth(5),
          borderRadius: 100,
        },
      }}
    >
      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <View style={{ marginTop: 5, justifyContent: 'center', alignItems: 'center' }}>
              {!focused ? (
                <View style={styles.inactiveTabIcon}>
                  <Image
                    source={require('../../assets/HomeScreen/home.png')}
                    style={styles.tabImage}
                  />
                </View>
              ) : (
                <View style={[styles.activeTabIcon, { backgroundColor: currentTheme.background_v2 }]}>
                  <Image
                    source={require('../../assets/HomeScreen/home.png')}
                    style={styles.tabImage}
                  />
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Attendances"
        component={Attendance}
        options={{
          unmountOnBlur: true,
          headerShown: false,
          // title: 'Attendance',
          tabBarIcon: ({ focused }) => (
            <View style={{ marginTop: 5, justifyContent: 'center', alignItems: 'center' }}>
              {!focused ? (
                <View style={styles.inactiveTabIcon}>
                  <Image
                    source={require('../../assets/HomeScreen/salary.png')}
                    style={styles.tabImage}
                  />
                </View>
              ) : (
                <View style={[styles.activeTabIcon, { backgroundColor: currentTheme.background_v2 }]}>
                  <Image
                    source={require('../../assets/HomeScreen/salary.png')}
                    style={styles.tabImage}
                  />
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="MyDrawer"
        component={MyDrawer}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <View style={{ marginTop: 5, justifyContent: 'center', alignItems: 'center' }}>
              {!focused ? (
                <View style={styles.inactiveTabIcon}>
                  <Image
                    source={require('../../assets/HomeScreen/user.png')}
                    style={styles.tabImage}
                  />
                </View>
              ) : (
                <View style={[styles.activeTabIcon, { backgroundColor: currentTheme.background_v2 }]}>
                  <Image
                    source={require('../../assets/HomeScreen/user.png')}
                    style={styles.tabImage}
                  />
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Services"
        component={MyStackTab}
        options={{
          unmountOnBlur: true,
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ marginTop: 5, justifyContent: 'center', alignItems: 'center' }}>
              {!focused ? (
                <View style={styles.inactiveTabIcon}>
                  <Image
                    source={require('../../assets/Services/services.png')}
                    style={styles.tabImage}
                  />
                </View>
              ) : (
                <View style={[styles.activeTabIcon, { backgroundColor: currentTheme.background_v2 }]}>
                  <Image
                    source={require('../../assets/Services/services.png')}
                    style={styles.tabImage}
                  />
                </View>
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MyTabbar;

const styles = StyleSheet.create({
  tabImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#fff',
    alignSelf: 'center',
  },
  inactiveTabIcon: {
    borderWidth: 4,
    borderColor: 'transparent',
    borderRadius: 100,
    height: 60,
    width: 60,
    justifyContent: 'center',
  },
  activeTabIcon: {
    marginTop: -60,
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 100,
    height: 60,
    width: 60,
    justifyContent: 'center',
  },
});
