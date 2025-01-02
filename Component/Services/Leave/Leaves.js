import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, FlatList } from 'react-native';
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';



const Leaves = ({navigation}) => {
    const showData = [
        {
            id: 1,
            uri: require('../../../assets/HomeScreen/calendar.png'),
            name: 'View',
            num: 'Calendar',
            backgroundcolor: '#44D5FB',
        },
        {
            id: 2,
            uri: require('../../../assets/HomeScreen/holiday.png'),
            name: 'View',
            num: 'Holiday',
            backgroundcolor: '#F9B7D5',
        },
        {
            id: 3,
            uri: require('../../../assets/HomeScreen/leave.png'),
            name: 'Leave',
            num: 'Balance',
            backgroundcolor: '#BAAEFC',
        },
    ];
    const renderServicesList = ({ item }) => (
        <View
            style={{
                justifyContent: 'center',
                backgroundColor: item.backgroundcolor,
                width: responsiveWidth(28),
                height: responsiveHeight(18),
                marginHorizontal: 5,
                borderRadius: 20,
            }}>
            <View style={{ padding: 10, alignItems: 'center' }}>
                <Image
                    style={{ height: 60, width: 60, marginBottom: 10 }}
                    source={item.uri}
                />
                <Text style={{ marginBottom: 2, fontSize: 16, color: '#000' }}>
                    {item.name}
                </Text>
                <Text style={{ fontSize: 16, color: '#000' }}>{item.num}</Text>
            </View>
        </View>
    );
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ alignSelf: "center", marginTop: 15, }}>
                <Text style={styles.name}>Leaves</Text>
            </View>
            <ScrollView style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
                borderTopLeftRadius: 40,
                marginTop: responsiveHeight(3),
                borderTopRightRadius: 40
            }}>
                <View style={{ margin: 18 }}>
                    <View style={styles.menu}>
                        <FlatList
                            style={{ alignSelf: 'center' }}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={showData}
                            renderItem={renderServicesList}
                            keyExtractor={item => item.id}
                        />
                    </View>
                    <View style={styles.leaveStatus}>
                        <View style={[styles.leaveItem, styles.approved]}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <AntDesign style={{ backgroundColor: "#0CD533", padding: 12, borderRadius: 30 }} name="calendar" size={30} color="#fff" />
                                <View>
                                    <Text style={styles.leaveText}>12 May 2024</Text>
                                    <Text style={styles.leaveText}>1 Day - Vacation Leave</Text>
                                </View>
                                <View style={{ backgroundColor: "#0CD533", borderRadius: 10 }}>
                                    <Text style={styles.statusText}>Approved</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.leaveItem, styles.applied]}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <AntDesign style={{ backgroundColor: "#0000ff", padding: 12, borderRadius: 30 }} name="calendar" size={30} color="#fff" />
                                <View>
                                    <Text style={styles.leaveText}>12 May 2024</Text>
                                    <Text style={styles.leaveText}>1 Day - Vacation Leave</Text>
                                </View>
                                <View style={{ backgroundColor: "#0000ff", borderRadius: 10 }}>
                                    <Text style={styles.statusText}>Applied  </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.leaveItem, styles.rejected]}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <AntDesign style={{ backgroundColor: "red", padding: 12, borderRadius: 30 }} name="calendar" size={30} color="#fff" />
                                <View style={{width:responsiveWidth(40)}}>
                                    <Text style={styles.leaveText}>12 May 2024</Text>
                                    <Text style={styles.leaveText}>1 Day - Vacation Leave</Text>
                                </View>
                                <View style={{ backgroundColor: "red", borderRadius: 10 }}>
                                    <Text style={styles.statusText}>Rejected</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={()=> navigation.navigate('ApplyLeave')} style={styles.applyButton}>
                        <Text style={styles.applyButtonText}>Apply Leave</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

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
        marginBottom: responsiveHeight(0)
    },
    container1: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    menu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 10,
        marginBottom: 25
    },
    menuItem: {
        flex: 1,
        margin: 5,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#add8e6', // Default background color
    },
    menuText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    leaveStatus: {
        marginBottom: 20,
    },
    leaveItem: {
        marginBottom: responsiveHeight(2),
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#ffffff', // Default background color
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 7,
    },
    leaveText: {
        fontSize: 16,
        color: "#000",
        fontWeight: "bold",
        textAlign:"center"
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10,
        marginVertical: 8,
        color: "#fff",
    },
    approved: {
        borderLeftWidth: 5,
        borderLeftColor: '#0CD533',
    },
    applied: {
        borderLeftWidth: 5,
        borderLeftColor: 'blue',
    },
    rejected: {
        borderLeftWidth: 5,
        borderLeftColor: 'red',
    },
    applyButton: {
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#0000ff',
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
export default Leaves;

