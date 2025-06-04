import {StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Account from '../../Component/Account/Account';
import Services from '../../Component/Services/Services';
import ApplyLeave from '../../Component/Services/Leave/ApplyLeave';
import Holiday from '../../Component/Services/Holiday/Holiday';
import Salary from '../../Component/Services/Salary Slip/Salary';
import Documents from '../../Component/Services/Documents/Documents';
import Resign from '../../Component/Services/Resign/Resign';
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
import ResetPassword from '../../Component/ForgetPassword/ResetPassword';
import PRMList from '../../Component/Services/PRM/PRMList';
import AddPRM from '../../Component/Services/PRM/AddPRM';
import EditPRM from '../../Component/Services/PRM/EditPRM';
import Attendance from '../../Component/Attendance/Attendance';
import CompOff from '../../Component/Services/CompOff/CompOff';
import AddCompoff from '../../Component/Services/CompOff/AddCompoff';
import RequestList from '../../Component/Services/AttendanceRequest/RequestList';
import UpdateRequestattendance from '../../Component/Services/AttendanceRequest/UpdateRequestattendance';
import FirstTimeChangePassword from '../../FirstTimeChangePassword';
import ListOfficeAddress from '../../Component/Services/OfficeAddress/ListOfficeAddress';
import AddAddress from '../../Component/Services/OfficeAddress/AddAddress';
import FaceLogin from '../../Component/LoginScreen/FaceLogin';
import Reward from '../../Component/Services/Reward/Reward';
import Team from '../../Component/Services/Team/Team';
import UserAttendance from '../../Component/Services/Team/UserAttendance';
import UserLeave from '../../Component/Services/Team/UserLeave';
import Course from '../../Component/Services/Course/Course';
import CourseDetails from '../../Component/Services/Course/CourseDetails';
import Maps from '../../Component/Tracking/Maps';
import AllPunchIn from '../../Component/DashBoard/AllPunchIn';

const MyStackTab = () => {
  const {currentTheme} = useContext(ThemeContext);
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      
      <Stack.Screen
        name="Services"
        component={Services}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Attendance"
        component={Attendance}
        options={{
          title: 'Attendance',

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
        name="Salary"
        component={Salary}
        options={{
          title: 'Salary Slip',

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
        name="Account"
        component={Account}
        options={{headerShown: false}}
      />
   
      <Stack.Screen
        name="ApplyLeave"
        component={ApplyLeave}
        options={{
          title: 'Apply Leave',

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
        name="CompOff"
        component={CompOff}
        options={{
          title: 'Comp Off',

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
        name="CourseDetails"
        component={CourseDetails}
        options={{
          title: 'Training',
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
        name="AddCompoff"
        component={AddCompoff}
        options={{
          title: 'Add Comp Off',
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
        name="Course"
        component={Course}
        options={{
          title: 'Training',

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
        name="UserAttendance"
        component={UserAttendance}
        options={{
          title: 'User Attendance',

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
        name="AllPunchIn"
        component={AllPunchIn}
        options={{
          title: 'All Punch IN',

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
        name="Team"
        component={Team}
        options={{
          title: 'Team',

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
        name="UserLeave"
        component={UserLeave}
        options={{
          title: 'User Leave',

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
        name="Reward"
        component={Reward}
        options={{
          title: 'Reward',

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
        name="ResetPassword"
        component={ResetPassword}
        options={{
          title: 'Reset Password',

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
        name="ChangePassword"
        component={ChangePassword}
        options={{
          title: 'Change Password',

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
        name="FirstTimeChangePassword"
        component={FirstTimeChangePassword}
        options={{
          title: 'Reset Password',

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
        options={{
          title: 'Task Location',

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
        name="Maps"
        component={Maps}
        options={{
          title: 'Track Location',

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
        options={{
          title: 'Leaves',
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
        name="PRMList"
        component={PRMList}
        options={{
          title: 'PRM List',
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
        name="AddPRM"
        component={AddPRM}
        options={{
          title: 'Add PRM',
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
        name="EditPRM"
        component={EditPRM}
        options={{
          title: 'Update PRM',

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
      <Stack.Screen
        name="AttendanceRequest"
        component={RequestList}
        options={{
          title: 'Attendance Request',
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
        name="UpdateRequestattendance"
        component={UpdateRequestattendance}
        options={{
          title: 'Attendance Request',
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
        name="ListOfficeAddress"
        component={ListOfficeAddress}
        options={{
          title: 'Address Request',
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
        name="AddAddress"
        component={AddAddress}
        options={{
          title: 'Address Request',
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
    </Stack.Navigator>
  );
};

export default MyStackTab;

const styles = StyleSheet.create({});
