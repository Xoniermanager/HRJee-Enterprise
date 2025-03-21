
import { Image, SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, Platform } from 'react-native';
import React, { useContext, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import { NavigationContainer } from '@react-navigation/native';
import Themes from '../Theme/Theme';
import { ThemeContext } from '../../Store/ConetxtApi.jsx/ConextApi';

const Services = ({ navigation }) => {
    const {currentTheme} = useContext(ThemeContext);

    const services = [
        {
            id: 1,
            uri: require('../../assets/Services/s2.png'),
            name: "Leave",
            nav : 'Leaves'
        },
        {
            id: 2,
            uri: require('../../assets/Services/s3.png'),
            name: "Holiday",
            nav: "Holiday",
        },
        {
            id: 3,
            uri: require('../../assets/Services/s4.png'),
            name: "Visit Location",
            nav: "LocationList"
        },
        // {
        //     id: 4,
        //     uri: require('../../assets/Services/s5.png'),
        //     name: "Documents",
        //     nav: "Documents",
        // },
        {
            id: 4,
            uri: require('../../assets/Services/s6.png'),
            name: "Resign",
            nav: "Resign",
        },
        {
            id: 5,
            uri: require('../../assets/Services/s5.png'),
            name: "PRM",
            nav: "PRMList",
        },
    ]

    {/* This is Services card List */ }

    const renderServicesList = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate(item.nav)} activeOpacity={1} style={[styles.item,{borderColor: currentTheme.background_v2,backgroundColor: currentTheme.background,borderWidth:0.5}]}>
            <Image source={item.uri} style={styles.icon} />
            <Text  style={[styles.title,{color:currentTheme.text}]}>{item.name}</Text>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={[styles.container,{backgroundColor:currentTheme.background_v2}]}>

            <View
                style={{
                    marginTop: 15,
                }}>
                <Text style={styles.name}>Services</Text>
                <View
                    style={{
                        backgroundColor: currentTheme.background,
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                        height: "100%"
                    }}>
                    <FlatList
                        data={services}
                        renderItem={renderServicesList}
                        numColumns={2}
                        keyExtractor={item => item.id}
                        columnWrapperStyle={styles.row}
                        contentContainerStyle={styles.containerlist}
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
    containerlist: {
        padding: 16
    },
    name: {
        color: '#fff',
        fontSize: responsiveFontSize(3),
        fontWeight: 'bold',
        textAlign: "center",
        marginBottom: responsiveHeight(3)
    },

    row: {
        justifyContent: 'space-between',
    },
    icon: {
        width: 70,
        height: 70,
        marginBottom: 8, resizeMode:"contain"
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',  color:Themes == 'dark' ? '#000' : '#000'
    },
    item: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        width: '48%',
        alignItems: 'center',
        borderRadius: 8,
        elevation:7, borderWidth: Platform.OS == "ios" ? 0.3 : null
    },
});

