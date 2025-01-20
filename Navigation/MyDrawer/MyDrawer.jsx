import { StyleSheet, Text, View, Image, TouchableOpacity, Button } from 'react-native';
import React, { useContext, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Account from '../../Component/Account/Account';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Person_Detils from './MyDrawerScreens/Person_Detils';
import Address from './MyDrawerScreens/Address';
import CustomDrawer from './CustomDrawer';
import PunchIn from './MyDrawerScreens/PunchIn';
import PunchOut from './MyDrawerScreens/PunchOut';
import ChangePassword from '../../Component/Password/ChangePassword';
import { ThemeContext } from '../../Store/ConetxtApi.jsx/ConextApi';

const MyDrawer = () => {
  const Drawer = createDrawerNavigator();
  const navigation = useNavigation()
  const {currentTheme} = useContext(ThemeContext);
  return (
    <Drawer.Navigator
    drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={({ }) => ({
        drawerLabel: () => null,
        title: null,
        drawerIcon: () => null,
        drawerLabelStyle: {
          color: '#000',
          fontSize: 20,
        },
        drawerStyle: {
          backgroundColor:currentTheme.background_v2,
        },
        headerShown: false,


        drawerPosition: 'right',
        //   headerLeft:()=>{
        //     return (
        //       <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer('MyDrawer'))} style={{marginLeft:5}}>
        //       <FontAwesome style={{}} name="edit" size={30} color="#000" />
        //   </TouchableOpacity>
        //     )
        // }

      })}>

      <Drawer.Screen
        name="Account"
        component={Account}
        options={{
          drawerIcon: ({ }) => (
            <View style={styles.drawerBox}>
              <Text style={styles.drawerText}>Profile</Text>
            </View>
          ),
        }}
      />

      <Drawer.Screen
        name="Person_Detils"
        component={Person_Detils}
        options={{
          drawerIcon: ({}) => (
            <View style={styles.drawerBox}>
              <Text style={styles.drawerText}>Person Details</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Address"
        component={Address}
        options={{
          drawerIcon: ({}) => (
            <View style={styles.drawerBox}>
              <Text style={styles.drawerText}>Address</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="PunchIn"
        component={PunchIn}
        options={{
          drawerIcon: ({}) => (
            <View style={styles.drawerBox}>
              <Text style={styles.drawerText}>Punch In</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="PunchOut"
        component={PunchOut}
        options={{
          drawerIcon: ({}) => (
            <View style={styles.drawerBox}>
              <Text style={styles.drawerText}>Punch Out</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          drawerIcon: ({}) => (
            <View style={styles.drawerBox}>
              <Text style={styles.drawerText}>Change Password</Text>
            </View>
          ),
        }}
      />
      

    </Drawer.Navigator>
  );
};
export default MyDrawer;
const styles = StyleSheet.create({
  drawer_image: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  drawerText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.9),
    marginLeft: 15,
  },
  drawerBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});


















