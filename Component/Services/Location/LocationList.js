// // import { StyleSheet, Text, View } from 'react-native'
// // import React from 'react'
// // import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// // import Pending from './PendingTask/Pending';
// // import Processing from './ProcessingTask/Processing';
// // import Done from './DoneTask/Done';


// // const Tab = createMaterialTopTabNavigator();


// // const LocationList = () => {
//     // const tabBarOptions = {
//     //     style: {
//     //         backgroundColor: '#0043ae',
//     //     },
//     //     activeTintColor: '#000',
//     //     inactiveTintColor: '#fff',
//     //     indicatorStyle: { backgroundColor: '#fff', height: '100%' },
//     //     pressOpacity: 1,
//     // }
// //     return (
// // <Tab.Navigator tabBarOptions={tabBarOptions}>
// //     <Tab.Screen name="Pending" component={Pending} />
// //     <Tab.Screen name="Processing" component={Processing} />
// //     <Tab.Screen name="Done" component={Done} />
// // </Tab.Navigator>
// //     )
// // }

// // export default LocationList

// // const styles = StyleSheet.create({})


// import { Image, SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import {
//     responsiveFontSize, responsiveHeight, responsiveWidth
// } from 'react-native-responsive-dimensions';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import Pending from './PendingTask/Pending';
// import Processing from './ProcessingTask/Processing';
// import Done from './DoneTask/Done';

// const Tab = createMaterialTopTabNavigator();

// const News = ({ navigation }) => {
//     const tabBarOptions = {
//         style: {
//             backgroundColor: '#0043ae', marginTop:20, width: "90%", alignSelf:"center"
//         },
//         activeTintColor: '#000',
//         inactiveTintColor: '#fff',
//         indicatorStyle: { backgroundColor: '#fff', height: '100%'},
//         pressOpacity: 1,
//     }
//     return (
//         <SafeAreaView style={styles.container}>

//             <View
//                 style={{
//                     marginTop: 15,
//                 }}>
//                 <Text style={styles.name}>Task Location</Text>
//                 <View
//                     style={{
//                         backgroundColor: '#fff',
//                         borderTopLeftRadius: 40,
//                         borderTopRightRadius: 40,
//                         height: "100%", 
//                     }}>
                        
//                     <Tab.Navigator tabBarOptions={tabBarOptions}>
//                         <Tab.Screen name="Pending" component={Pending} />
//                         <Tab.Screen name="Processing" component={Processing} />
//                         <Tab.Screen name="Done" component={Done} />
//                     </Tab.Navigator>
//                 </View>
//             </View>

//         </SafeAreaView>
//     );
// };
// export default News;
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#0E0E64',
//     },

//     name: {
//         color: '#fff',
//         fontSize: responsiveFontSize(3),
//         fontWeight: 'bold',
//         textAlign: "center",
//         marginBottom: responsiveHeight(3)
//     },
// });


import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Pending from './PendingTask/Pending';
import Processing from './ProcessingTask/Processing';
import Done from './DoneTask/Done';

const Tab = createMaterialTopTabNavigator();

const LocationList = ({ navigation }) => {
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
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop: 15 }}>
        <Text style={styles.name}>Task Location</Text>
        <View style={styles.tabContainer}>
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
