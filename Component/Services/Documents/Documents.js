
import { Image, SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import { NavigationContainer } from '@react-navigation/native';

const Documents = ({ navigation }) => {

    const services = [
        {
            id: 1,
            uri: require('../../../assets/Document/cv.png'),
            name: "Resume",
            nav: "ApplyLeave",
        },
        {
            id: 2,
            uri: require('../../../assets/Document/offerlatter.png'),
            name: "Offer",
            name1: "Latter",
            nav: "Holiday",
        },
        {
            id: 3,
            uri: require('../../../assets/Document/salary.png'),
            name: "Contact",
            name1: "Aggrement",
            nav: "Salary"
        },
        {
            id: 4,
            uri: require('../../../assets/Document/join.png'),
            name: "Joining",
            name1: "Latter",
            nav: "Documents",
        }
    ]

    {/* This is Services card List */ }

    const renderServicesList = ({ item }) => (
        // <TouchableOpacity   activeOpacity={1} style={{marginTop:item.top, marginVertical: 10, marginHorizontal: responsiveWidth(7.5) }}>
        //     <View style={{ borderRadius: 20, backgroundColor: "#fff", elevation: 7, alignSelf: "center", padding: 20 }}>
        //         <View style={{ justifyContent: "center", borderWidth: 8, borderColor: "#4EC8FA", borderRadius: 100, height: responsiveWidth(25), width: responsiveWidth(25), resizeMode: "contain", alignSelf: "center" }}>
        //             <View style={{marginBottom:5, justifyContent: "center", borderWidth: 5, borderColor: "#fff", borderRadius: 100, height: responsiveWidth(25), width: responsiveWidth(25), resizeMode: "contain", alignSelf: "center" }}>
        //                 <Image style={{ alignSelf: "center", height: responsiveWidth(20), width: responsiveWidth(20), resizeMode: "center" }} source={item?.uri} />
        //             </View>
        //         </View>
        //         <Text style={{textAlign: "center", marginVertical: 5, fontSize: 20, color: "#0E0E64", fontWeight: "bold" }}>{item.name}</Text>
        //         <Text style={{textAlign: "center", marginTop:-10, fontSize: 20, color: "#0E0E64", fontWeight: "bold" }}>{item.name1}</Text>
        //     </View>
        // </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} style={{ marginTop: item.top, marginVertical: 10, marginHorizontal: responsiveWidth(5) }}>
            <View style={{ borderRadius: 20, backgroundColor: "#fff", elevation: 7, padding: 10, width: responsiveWidth(30), }}>
                <View style={{ justifyContent: "center", borderWidth: 8, borderColor: "#4EC8FA", borderRadius: 100, height: responsiveWidth(25), resizeMode: "contain", alignSelf: "center" }}>
                    <View style={{ marginBottom: 5, justifyContent: "center", borderWidth: 5, borderColor: "#fff", borderRadius: 100, height: responsiveWidth(25), resizeMode: "contain", alignSelf: "center" }}>
                        <Image style={{ alignSelf: "center", height: responsiveWidth(20), width: responsiveWidth(20), resizeMode: "center" }} source={item?.uri} />
                    </View>
                </View>
                <Text style={{ textAlign: "center", marginVertical: 5, fontSize: 20, color: "#0E0E64", fontWeight: "bold" }}>{item.name}</Text>
                <Text style={{ textAlign: "center", marginTop: -10, fontSize: 20, color: "#0E0E64", fontWeight: "bold" }}>{item.name1}</Text>
            </View>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={styles.container}>

            <View
                style={{
                    marginTop: 15,
                }}>

                <View style={{ alignSelf: "center" }}>
                    <Text style={styles.name}>Documents</Text>
                </View>

                <View
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#fff',
                        borderTopLeftRadius: 40,
                        marginTop: responsiveHeight(3),
                        borderTopRightRadius: 40,
                    }}>
                    <View style={{ marginTop: 20 }}>
                        <FlatList
                            data={services}
                            renderItem={renderServicesList}
                            contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", }}
                            keyExtractor={item => item.id}
                        />
                    </View>

                </View>
            </View>

        </SafeAreaView>
    );
};
export default Documents;
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