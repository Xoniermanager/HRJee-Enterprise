import { Image, SafeAreaView, StyleSheet, Text, View, FlatList, Switch, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
const Attendance = () => {

    const showData = [
        {
            id: 1,
            uri: require('../../assets/HomeScreen/calendar.png'),
            name: 'Working',
            num: 13,
            color: "#F2F4FF",
            backgroundcolor: "#7B9BF6",
            fontcolor: "#7B9BF6"
        },
        {
            id: 2,
            uri: require('../../assets/HomeScreen/leave.png'),
            name: 'Leave',
            num: 0,
            color: "#FFF6ED",
            backgroundcolor: "#F39331",
            fontcolor: "#F39331"
        },
        {
            id: 3,
            uri: require('../../assets/HomeScreen/medal.png'),
            name: 'Half Day',
            num: 0,
            color: "#EDFBFE",
            backgroundcolor: "#4EC8FA",
            fontcolor: "#4EC8FA"
        }
    ]

    const [startdate, setStartDate] = useState(new Date());

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);


    {/* This is Services card List */ }

    const renderServicesList = ({ item }) => (
        <View style={{ justifyContent: "center", backgroundColor: item.backgroundcolor, width: responsiveWidth(22.5), marginHorizontal: 5, borderRadius: 20 }}>
            <View style={{ justifyContent: "center", backgroundColor: item.color, width: responsiveWidth(22.5), marginTop: 3, borderRadius: 20 }}>
                <View style={{ padding: 10, alignItems: "center" }}>
                    <Text style={{ color: item.fontcolor }}>{item.num}</Text>
                    <Text style={{ marginBottom: 2, color: "#000" }}>{item.name}</Text>
                </View>
            </View>
        </View>
    );





    return (
        <SafeAreaView style={styles.container}>

            <View
                style={{
                    marginTop: 15
                }}>

                <View style={{ marginTop: 20, alignSelf: "center" }}>
                    <Text style={styles.name}>Attendance</Text>
                </View>
                {/* <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                /> */}
            </View>
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 40,
                    marginTop: responsiveHeight(12),
                    borderTopRightRadius: 40,
                }}>
                <View style={{
                    width: responsiveWidth(90), height: responsiveHeight(17), backgroundColor: '#fff', alignSelf: 'center', position: 'absolute', marginTop: responsiveHeight(12), borderRadius: 20, shadowColor: '#000',
                    shadowRadius: 10,
                    shadowOpacity: 0.6,
                    elevation: 8,
                    borderWidth: 0.5, borderColor: "#30C1DD",
                    padding: 15,
                    shadowOffset: {
                        width: 0,
                        height: 4
                    }
                }}>
                    <Text style={{ marginLeft: 10, marginTop: 5, color: "#000", fontSize: 16 }}>This Month Attendance</Text>
                    <View style={{ width: '100%', borderWidth: 0.8, borderColor: '#000', marginVertical: 10 }}></View>

                    <View>
                        <FlatList style={{ alignSelf: "center" }} horizontal showsHorizontalScrollIndicator={false}
                            data={showData}
                            renderItem={renderServicesList}
                            keyExtractor={item => item.id}
                        />
                        <View style={{ flexDirection: "row", alignSelf: "center", marginVertical: 8, }}>
                            <View style={{ marginHorizontal: 5, borderRadius: 15, backgroundColor: "#fff", padding: 15, elevation: 7, alignSelf: "center", marginTop: responsiveHeight(2.5) }}>
                                <Image style={{ height: 50, width: 50, resizeMode: "contain", alignSelf: "center" }} source={require('../../assets/Attendence/thumb.png')} />
                                <Text style={{ fontSize: 20, color: "#000", textAlign: "center", marginTop: 5 }}>Form Date</Text>
                                <View style={{ backgroundColor: "#EDFBFE", flexDirection: "row", marginTop: 5, borderRadius: 10, padding: 8 }}>
                                    <Text style={{ fontSize: 16, marginHorizontal: 20 }}>04-02-2024</Text>
                                    <Image style={{ height: 20, width: 20 }} source={require('../../assets/Attendence/dates.png')} />
                                </View>
                            </View>
                            <View style={{ marginHorizontal: 5, borderRadius: 15, backgroundColor: "#fff", padding: 15, elevation: 7, alignSelf: "center", marginTop: responsiveHeight(2.5) }}>
                                <Image style={{ height: 50, width: 50, resizeMode: "contain", alignSelf: "center" }} source={require('../../assets/Attendence/thumb.png')} />
                                <Text style={{ fontSize: 20, color: "#000", textAlign: "center", marginTop: 5 }}>Form Date</Text>
                                <View style={{ backgroundColor: "#EDFBFE", flexDirection: "row", marginTop: 5, borderRadius: 10, padding: 8 }}>
                                    <Text style={{ fontSize: 16, marginHorizontal: 20 }}>04-02-2024</Text>
                                    <Image style={{ height: 20, width: 20 }} source={require('../../assets/Attendence/dates.png')} />
                                </View>
                            </View>
                        </View>

                        {/* Logs codes */}

                        <Text style={{ color: "#0E0E64", fontWeight: "bold", fontSize: 20, padding: 5, marginVertical: 5 }}>Logs</Text>
                        <View style={{ flexDirection: "row", }}>
                            <View style={{ position: "relative", justifyContent: "center" }}>
                                <View style={{ borderWidth: 1.5, height: 50, width: 2, elevation: 7, backgroundColor: "#000", opacity: 0.3 }}></View>
                                <Image style={{ height: 15, width: 15, marginLeft: -7, resizeMode: "contain", position: "absolute" }} source={require('../../assets/Attendence/point.png')} />
                            </View>
                            <View style={{ justifyContent: "space-between", flex: 1, flexDirection: "row", padding: 15, borderRadius: 20, marginLeft: 10, backgroundColor: "#EDFBFE" }}>
                                <Text style={{ fontSize: 20, color: "#000" }}>26-03-2024</Text>
                                <Text style={{ fontSize: 20, color: "#000", fontWeight: "bold" }}>10:00 Hours</Text>
                            </View>
                        </View>
                    </View>
                </View>


            </View>










            <View style={{
                width: responsiveWidth(90), height: responsiveHeight(20), backgroundColor: '#fff', alignSelf: 'center', position: 'absolute', marginTop: responsiveHeight(10), borderRadius: 20, shadowColor: '#30C1DD',
                shadowRadius: 10,
                shadowOpacity: 0.6,
                elevation: 8,
                shadowOffset: {
                    width: 0,
                    height: 4
                }
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ color: '#000', fontSize: responsiveFontSize(2) }}>Today</Text>
                    <Text style={{ color: '#000', fontSize: responsiveFontSize(2) }}>In Time</Text>
                    <Text style={{ color: '#000', fontSize: responsiveFontSize(2) }}>Out Time</Text>

                </View>
                <View style={{ width: '100%', borderWidth: 0.5, borderColor: '#000', marginTop: 5 }}>

                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 15 }}>
                    <Text style={{ color: '#000', fontSize: responsiveFontSize(1.6) }}>05 Apr 2024</Text>
                    <Text style={{ color: '#000', fontSize: responsiveFontSize(1.6) }}>09:00 AM</Text>
                    <Text style={{ color: '#000', fontSize: responsiveFontSize(1.6) }}>07:03 PM</Text>

                </View>
                <View style={{ width: 80, height: 80, borderRadius: 50, borderWidth: 1, marginTop: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderColor: '#f1416C' }}>
                    <Text>09:30</Text>
                </View>
            </View>



        </SafeAreaView>
    );
};
export default Attendance;
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

    },
});