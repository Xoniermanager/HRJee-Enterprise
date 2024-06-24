
import { Image, SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import { NavigationContainer } from '@react-navigation/native';

const Services = ({ navigation }) => {

    const services = [
        {
            id: 1,
            uri: require('../../assets/Services/s2.png'),
            name: "Leave",
            nav: "ApplyLeave",
        },
        {
            id: 2,
            uri: require('../../assets/Services/s3.png'),
            name: "Holiday",
            nav: "Holiday",
            top: 30
        },
        {
            id: 3,
            uri: require('../../assets/Services/s4.png'),
            name: "Payslip",
            nav: "Salary"
        },
        {
            id: 4,
            uri: require('../../assets/Services/s5.png'),
            name: "Documents",
            nav: "Documents",
            top: 30
        },
        {
            id: 5,
            uri: require('../../assets/Services/s6.png'),
            name: "Resign",
            nav: "Resign",
        },
    ]

    {/* This is Services card List */ }

    const renderServicesList = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate(item.nav)} activeOpacity={1} style={{marginHorizontal:responsiveWidth(5),  borderRadius: 20, backgroundColor: "#fff", elevation: 7, padding: 10, marginTop: item.top, width: responsiveWidth(35), height: responsiveHeight(20) }}>
            <View style={{ justifyContent: "center", borderWidth: 8, borderColor: "#4EC8FA", borderRadius: 100, height: responsiveWidth(25), resizeMode: "contain", alignSelf: "center" }}>
            <View style={{ marginBottom: 5, justifyContent: "center", borderWidth: 5, borderColor: "#fff", borderRadius: 100, height: responsiveWidth(25), resizeMode: "contain", alignSelf: "center" }}>
            <Image style={{ alignSelf: "center", height: responsiveWidth(20), width: responsiveWidth(20), resizeMode: "center" }} source={item?.uri} />
            </View>
            </View>
            <Text style={{ textAlign: "center", marginVertical: 5, fontSize: 20, color: "#0E0E64", fontWeight: "bold" }}>{item.name}</Text>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={styles.container}>

            <View
                style={{
                    marginTop: 15, 
                }}>
                <Text style={styles.name}>Services</Text>
                <View
                    style={{
                        backgroundColor: '#fff', 
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                        
                    }}>
                    <FlatList
                        data={services}
                        renderItem={renderServicesList}
                        contentContainerStyle={{flexDirection:"row",  marginTop:responsiveHeight(2), flexWrap:"wrap", justifyContent:"space-between",  height:responsiveHeight(100)}}
                        keyExtractor={item => item.id}
                    />

                </View>
            </View>

        </SafeAreaView>
    );
};
export default Services;
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
        marginBottom: responsiveHeight(10)
    },
});