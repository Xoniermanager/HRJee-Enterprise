import {StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ApplyLeave from '../../Component/Services/Leave/ApplyLeave';
import Leaves from '../../Component/Services/Leave/Leaves';
import {ThemeContext} from '../../Store/ConetxtApi.jsx/ConextApi';
import CompOff from '../../Component/Services/CompOff/CompOff';
import AddCompoff from '../../Component/Services/CompOff/AddCompoff';
import Reward from '../../Component/Services/Reward/Reward';
import UserLeave from '../../Component/Services/Team/UserLeave';
import MyDrawer from '../MyDrawer/MyDrawer';
import Shift from '../../Component/Account/Shift';
const MyStackDrawer = () => {
  const {currentTheme} = useContext(ThemeContext);
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Services"
        component={MyDrawer}
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
        name="Shift"
        component={Shift}
        options={{
          title: 'Employee Shift',
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

export default MyStackDrawer;

const styles = StyleSheet.create({});
