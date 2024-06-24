import { Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import { NavigationContainer } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import CheckBox from '@react-native-community/checkbox';


const Holiday = ({ navigation }) => {
    const [selected, setSelected] = useState('');
    const [toggleCheckBox, setToggleCheckBox] = useState(false)

    {/* THis code is less more */ }

    const [expandedprofile, setExpandedProfile] = useState(false);


    const toggleExpandedProfile = () => {
        setExpandedProfile(!expandedprofile);
    };
    return (
            <SafeAreaView style={styles.container}>

                <View
                    style={{
                        marginTop: 15,
                    }}>

                    <View style={{ alignSelf: "center" }}>
                        <Text style={styles.name}>Holiday</Text>
                    </View>

                    <ScrollView
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#fff',
                            borderTopLeftRadius: 40,
                            marginTop: responsiveHeight(3),
                            borderTopRightRadius: 40,
                        }}>

                        <Calendar style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: "#fff", }}
                            onDayPress={day => {
                                setSelected(day.dateString);
                            }}
                            markedDates={{
                                [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                            }}
                        />
                        <View style={{ marginHorizontal: responsiveWidth(5) }}>
                            <Text style={{ color: "#0E0E64", marginVertical: 10, fontSize: 18, fontWeight:"500" }}>Holiday of the month</Text>
                            <View style={{ height: responsiveHeight(10), borderRadius: 15, flexDirection: "row", backgroundColor: "#fff", elevation: 7, marginBottom:5 }}>
                                <View style={{ marginLeft: 20, backgroundColor: "#0E0E64", height: 70, width: 50, justifyContent: "center", borderBottomRightRadius: 30, borderBottomLeftRadius: 30 }}>
                                    <Image style={{ height: 30, width: 30, resizeMode: "contain", alignSelf: "center" }} source={require('../../../assets/HomeScreen/calendar.png')} />
                                </View>
                                <View style={{ marginLeft: 20, justifyContent: "center" }}>
                                    <Text style={{ color: "#0E0E64", fontSize: 18, fontWeight:"500" }}>Weekend</Text>
                                    <Text style={{ color: "#0E0E64", fontSize: 18,  fontWeight:"500" }}>2024-03-07</Text>
                                </View>
                            </View>
                            <View style={{ height: responsiveHeight(10), borderRadius: 15, flexDirection: "row", backgroundColor: "#fff", elevation: 7, marginBottom:5 }}>
                                <View style={{ marginLeft: 20, backgroundColor: "#0E0E64", height: 70, width: 50, justifyContent: "center", borderBottomRightRadius: 30, borderBottomLeftRadius: 30 }}>
                                    <Image style={{ height: 30, width: 30, resizeMode: "contain", alignSelf: "center" }} source={require('../../../assets/HomeScreen/calendar.png')} />
                                </View>
                                <View style={{ marginLeft: 20, justifyContent: "center" }}>
                                    <Text style={{ color: "#0E0E64", fontSize: 18, fontWeight:"500" }}>Weekend</Text>
                                    <Text style={{ color: "#0E0E64", fontSize: 18,  fontWeight:"500" }}>2024-03-07</Text>
                                </View>
                            </View>
                        </View>                     
                    </ScrollView>
                </View>

            </SafeAreaView>
    );
};
export default Holiday;
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
    checkbox: {
        alignSelf: 'center',
    }
});