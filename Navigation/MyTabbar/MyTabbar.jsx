import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../../Component/DashBoard/HomePage';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import LoginScreen from '../../Component/LoginScreen/LoginScreen';
import SignUpScreen from '../../Component/SignUpScreen/SignUpScreen';
import LandingPage from '../../Component/LandingPage/LandingPage';
import Account from '../../Component/Account/Account';
import Attendance from '../../Component/Attendance/Attendance';
import Services from '../../Component/Services/Services';
import MyDrawer from '../MyDrawer/MyDrawer';
import { ThemeContext } from '../../Store/ConetxtApi.jsx/ConextApi';

const MyTabbar = ({ route }) => {
  const Tab = createBottomTabNavigator();
  const {currentTheme} = useContext(ThemeContext);

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
          position:'absolute', marginBottom:5,
          marginHorizontal: responsiveWidth(5), borderRadius: 100,  
        },
      }}>
      <Tab.Screen
        name="HomePage"
        component={HomePage}

        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                marginTop: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {
                !focused ?
                  <View style={{ borderWidth: 4, borderColor: "transparent", borderRadius: 100, height: 60, width: 60, justifyContent: "center" }}>
                    <Image
                      source={require('../../assets/HomeScreen/home.png')}
                      style={{
                        width: 30,
                        height: 30, resizeMode: "contain",
                        tintColor: "#fff", alignSelf: "center"
                      }}
                    />
                  </View>
                  :
                  <View style={{ backgroundColor: currentTheme.background_v2, marginTop: -60, borderWidth: 4, borderColor: "#fff", borderRadius: 100, height: 60, width: 60, justifyContent: "center" }}>
                    <Image
                      source={require('../../assets/HomeScreen/home.png')}
                      style={{
                        width: 30,
                        height: 30, resizeMode: "contain",
                        tintColor: "#fff", alignSelf: "center"
                      }}
                    />
                  </View>

              }


              {/* <Text
                style={{
                  color: focused ? '#E5539B' : '#ffffff',fontSize:responsiveFontSize(1.6)
                }}>
                Home
              </Text> */}
            </View>
          ),
        }}
      />
      

      <Tab.Screen
        name="Attendance"
        component={Attendance}

        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                marginTop: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {
                !focused ?
                  <View style={{ borderWidth: 4, borderColor: "transparent", borderRadius: 100, height: 60, width: 60, justifyContent: "center" }}>
                    <Image
                      source={require('../../assets/HomeScreen/salary.png')}
                      style={{
                        width: 30,
                        height: 30, resizeMode: "contain",
                        tintColor: "#fff", alignSelf: "center"
                      }}
                    />
                  </View>
                  :
                  <View style={{ backgroundColor: currentTheme.background_v2, marginTop: -60, borderWidth: 4, borderColor: "#fff", borderRadius: 100, height: 60, width: 60, justifyContent: "center" }}>
                    <Image
                      source={require('../../assets/HomeScreen/salary.png')}
                      style={{
                        width: 30,
                        height: 30, resizeMode: "contain",
                        tintColor: "#fff", alignSelf: "center"
                      }}
                    />
                  </View>

              }


              {/* <Text
                style={{
                  color: focused ? '#E5539B' : '#ffffff',fontSize:responsiveFontSize(1.6)
                }}>
                Home
              </Text> */}
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
            <View
              style={{
                marginTop: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {
                !focused ?
                  <View style={{ borderWidth: 4, borderColor: "transparent", borderRadius: 100, height: 60, width: 60, justifyContent: "center" }}>
                    <Image
                      source={require('../../assets/HomeScreen/user.png')}
                      style={{
                        width: 30,
                        height: 30, resizeMode: "contain",
                        tintColor: "#fff", alignSelf: "center"
                      }}
                    />
                  </View>
                  :
                  <View style={{ backgroundColor: currentTheme.background_v2, marginTop: -60, borderWidth: 4, borderColor: "#fff", borderRadius: 100, height: 60, width: 60, justifyContent: "center" }}>
                    <Image
                      source={require('../../assets/HomeScreen/user.png')}
                      style={{
                        width: 30,
                        height: 30, resizeMode: "contain",
                        tintColor: "#fff", alignSelf: "center"
                      }}
                    />
                  </View>

              }


              {/* <Text
                style={{
                  color: focused ? '#E5539B' : '#ffffff',fontSize:responsiveFontSize(1.6)
                }}>
                Home
              </Text> */}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Services"
        component={Services}

        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                marginTop: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {
                !focused ?
                  <View style={{ borderWidth: 4, borderColor: "transparent", borderRadius: 100, height: 60, width: 60, justifyContent: "center" }}>
                    <Image
                      source={require('../../assets/Services/services.png')}
                      style={{
                        width: 30,
                        height: 30, resizeMode: "contain",
                        tintColor: "#fff", alignSelf: "center"
                      }}
                    />
                  </View>
                  :
                  <View style={{ backgroundColor: currentTheme.background_v2, marginTop: -60, borderWidth: 4, borderColor: "#fff", borderRadius: 100, height: 60, width: 60, justifyContent: "center" }}>
                    <Image
                      source={require('../../assets/Services/services.png')}
                      style={{
                        width: 30,
                        height: 30, resizeMode: "contain",
                        tintColor: "#fff", alignSelf: "center"
                      }}
                    />
                  </View>

              }


              {/* <Text
                style={{
                  color: focused ? '#E5539B' : '#ffffff',fontSize:responsiveFontSize(1.6)
                }}>
                Home
              </Text> */}
            </View>
          ),
        }}
      />

      {/* <Tab.Screen
        name="EmergencySupport"
        component={AdministerList}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                marginTop: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/HomeWork.png')}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: focused ? '#E5539B' : '#ffffff',
                }}
              />
              <Text
                style={{
                  color: focused ? '#E5539B' : '#ffffff',fontSize:responsiveFontSize(1.6)
                }}>
                Administer 
              </Text>
            </View>
          ),
        }}
      /> */}
      {/* <Tab.Screen
        name="More"
        component={
          MyDrawer
        }
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => (
            <View
              style={{
                marginTop: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/profile_1.png')}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: focused ? '#E5539B' : '#ffffff',
                }}
              />
              <Text
                style={{
                  color: focused ? '#E5539B' : '#ffffff',fontSize:responsiveFontSize(1.6)
                }}>
                Profile
              </Text>
            </View>
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default MyTabbar;

const styles = StyleSheet.create({});
