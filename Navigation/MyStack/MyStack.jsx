import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignUpScreen from '../../Component/SignUpScreen/SignUpScreen';
import OnboardingScreen from '../../Component/Onboarding/OnboardingScreen';
import Splash from '../../Component/Splashscreen/Splash';
import LoginScreen from '../../Component/LoginScreen/LoginScreen';
import LandingPage from '../../Component/LandingPage/LandingPage';
import HomePage from '../../Component/DashBoard/HomePage';
import MyTabbar from '../MyTabbar/MyTabbar';
import Account from '../../Component/Account/Account';
import Services from '../../Component/Services/Services';
import ApplyLeave from '../../Component/Services/Leave/ApplyLeave';
import Holiday from '../../Component/Services/Holiday/Holiday';
import Salary from '../../Component/Services/Salary Slip/Salary';
import Documents from '../../Component/Services/Documents/Documents';
import Resign from '../../Component/Services/Resign/Resign';
import ResignStatus from '../../Component/Services/Resign/ResignStatus';
import TwoFectorVerification from '../../Component/LoginScreen/TwoFectorVerification';
import ForgetPassword from '../../Component/ForgetPassword/ForgetPassword';
import MyDrawer from '../MyDrawer/MyDrawer';
import CustomDrawer from '../MyDrawer/CustomDrawer';
import ChangePassword from '../../Component/Password/ChangePassword';
import HolidayList from '../../Component/Services/Holiday/HolidayList';


const MyStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="MyTabbar"
        component={MyTabbar}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LandingPage"
        component={LandingPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Salary"
        component={Salary}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Account"
        component={Account}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Services"
        component={Services}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ApplyLeave"
        component={ApplyLeave}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Holiday"
        component={Holiday}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Documents"
        component={Documents}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Resign"
        component={Resign}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ResignStatus"
        component={ResignStatus}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Verification"
        component={TwoFectorVerification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HolidayList"
        component={HolidayList}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MyStack;

const styles = StyleSheet.create({});
