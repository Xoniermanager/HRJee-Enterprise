import {StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
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
import TwoFectorVerification from '../../Component/LoginScreen/TwoFectorVerification';
import ForgetPassword from '../../Component/ForgetPassword/ForgetPassword';
import MyDrawer from '../MyDrawer/MyDrawer';
import CustomDrawer from '../MyDrawer/CustomDrawer';
import ChangePassword from '../../Component/Password/ChangePassword';
import HolidayList from '../../Component/Services/Holiday/HolidayList';
import Announcement from '../../Component/DashBoard/Announcements/Announcement';
import News from '../../Component/DashBoard/News/News';
import Policy from '../../Component/DashBoard/Policy/Policy';
import NewsDetails from '../../Component/DashBoard/News/NewsDetails';
import AnnouncementDetails from '../../Component/DashBoard/Announcements/AnnouncementDetails';
import LocationList from '../../Component/Services/Location/LocationList';
import Pending from '../../Component/Services/Location/PendingTask/Pending';
import Processing from '../../Component/Services/Location/ProcessingTask/Processing';
import Done from '../../Component/Services/Location/DoneTask/Done';
import Leaves from '../../Component/Services/Leave/Leaves';
import PolicyDetails from '../../Component/DashBoard/Policy/PolicyDetails';
import ProfileDetails from '../../Component/Skeleton/ProfileDetails';
import {ThemeContext} from '../../Store/ConetxtApi.jsx/ConextApi';
import ApplyResign from '../../Component/Services/Resign/ApplyResign';
import WithdrawResign from '../../Component/Services/Resign/WithdrawResign';

const MyStack = () => {
  const {currentTheme} = useContext(ThemeContext);
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
        options={{
          title: 'Holiday',

          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: currentTheme.background_v2,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '500',
          },
        }}
      />
      <Stack.Screen
        name="Documents"
        component={Documents}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Resign"
        component={Resign}
        options={{
          title: 'Resign',

          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: currentTheme.background_v2,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '500',
          },
        }}
      />
      <Stack.Screen
        name="ApplyResign"
        component={ApplyResign}
        options={{
          title: 'Apply Resign',

          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: currentTheme.background_v2,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '500',
          },
        }}
      />
      <Stack.Screen
        name="WithdrawResign"
        component={WithdrawResign}
        options={{
          title: 'Withdraw Resign',

          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: currentTheme.background_v2,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '500',
          },
        }}
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
        options={{
          title: 'Holiday List',

          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: currentTheme.background_v2,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '500',
          },
        }}
      />
      <Stack.Screen
        name="Announcement"
        component={Announcement}
        options={{
          title: 'Announcement',

          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: currentTheme.background_v2,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '500',
          },
        }}
      />
      <Stack.Screen
        name="News"
        component={News}
        options={{
          title: 'News',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: currentTheme.background_v2,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '500',
          },
        }}
      />
      <Stack.Screen
        name="NewsDetails"
        component={NewsDetails}
        options={{
          title: 'News Details',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: currentTheme.background_v2,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '500',
          },
        }}
      />
      <Stack.Screen
        name="Policy"
        component={Policy}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AnnouncementDetails"
        component={AnnouncementDetails}
        options={{
          title: 'Announcement Details',

          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: currentTheme.background_v2,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '500',
          },
        }}
      />
      <Stack.Screen
        name="LocationList"
        component={LocationList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Pending"
        component={Pending}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Processing"
        component={Processing}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Done"
        component={Done}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Leaves"
        component={Leaves}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PolicyDetails"
        component={PolicyDetails}
        options={{
          title: 'Policy Details',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: currentTheme.background_v2,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '500',
          },
        }}
      />
      <Stack.Screen
        name="ProfileDetails"
        component={ProfileDetails}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MyStack;

const styles = StyleSheet.create({});
