import { Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import { NavigationContainer } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import CheckBox from '@react-native-community/checkbox';


const ApplyLeave = ({ navigation }) => {
    const [selected, setSelected] = useState('');
    const [toggleCheckBox, setToggleCheckBox] = useState(false)

    {/* THis code is less more */ }

    const [expandedprofile, setExpandedProfile] = useState(false);


    const toggleExpandedProfile = () => {
        setExpandedProfile(!expandedprofile);
    };
    return (

        <SafeAreaView style={styles.container}>



            <View style={{ alignSelf: "center", marginTop: 15, }}>
                <Text style={styles.name}>Apply Leave</Text>
            </View>



            <ScrollView
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 40,
                    marginTop: responsiveHeight(3),
                    borderTopRightRadius: 40
                }}>
                <View style={{ flexDirection: "row", marginTop: responsiveHeight(3), alignSelf: "center", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ alignItems: "center", marginHorizontal: responsiveWidth(2) }}>
                        <View style={{ backgroundColor: "#0E0E64", borderRadius: 100, height: 80, width: 80, justifyContent: "center" }}>
                            <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>8</Text>
                            <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>JAN</Text>
                        </View>
                        <Image style={{ height: 50, width: 50, }} source={require('../../../assets/ApplyLeave/arrow-down.png')} />
                        <View style={{ backgroundColor: "#0E0E64", borderRadius: 100, height: 80, width: 80, justifyContent: "center" }}>
                            <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>10</Text>
                            <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>JAN</Text>
                        </View>
                        <Text style={{ color: "#0E0E64", fontSize: 20, marginTop: responsiveHeight(1) }}>3 Days</Text>
                    </View>
                    <View style={{ marginHorizontal: responsiveWidth(2) }}>
                        <Calendar style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: "#fff", elevation: 7, width: responsiveWidth(70) }}
                            onDayPress={day => {
                                setSelected(day.dateString);
                            }}
                            markedDates={{
                                [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                            }}
                        />
                    </View>
                </View>
                {/* This is profile details */}
                <View style={{ alignSelf: "center", marginTop: responsiveHeight(1), borderTopLeftRadius: 10, borderBottomLeftRadius: expandedprofile == true ? 0 : 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                    <View style={{ marginBottom: expandedprofile == true ? 0 : 8, width: "95%", backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, borderTopLeftRadius: 50, borderBottomLeftRadius: expandedprofile == true ? 0 : 50, borderTopRightRadius: 50, borderBottomRightRadius: expandedprofile == true ? 0 : 50, padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ color: "#000", fontSize: responsiveFontSize(2.3) }}>Select Leave Type</Text>
                        <TouchableOpacity onPress={toggleExpandedProfile}>
                            {
                                expandedprofile ?
                                    <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../../assets/HomeScreen/up.png')} />
                                    :
                                    <>
                                        <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../../assets/HomeScreen/down.png')} />

                                    </>
                            }
                        </TouchableOpacity>
                    </View>
                    {
                        expandedprofile ?
                            <View style={{ marginBottom: expandedprofile == true ? 8 : 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                <View style={{ borderTopWidth: expandedprofile == true ? 0 : 2, backgroundColor: "#EDFBFE", borderTopLeftRadius: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10, marginVertical: 8 }}>
                                        <View style={{}}>
                                            <Text style={{ color: "#000", fontSize: 20, fontWeight: "500" }}>Monday</Text>
                                            <Text style={{ color: "#000", fontSize: 18 }}>08-04-2024</Text>
                                        </View>
                                        <View style={{}}>
                                            <Image style={{ color: "#000", fontSize: 20, fontWeight: "500", height: 30, width: 30, alignSelf: "center" }} source={require('../../../assets/HomeScreen/clock.png')} />
                                            <Text style={{ color: "#000", fontSize: 18, textAlign: "center" }}>08:20</Text>
                                        </View>
                                    </View>
                                </View>
                            </View> :
                            null
                    }

                    <View style={{ borderRadius: 30, marginBottom: 8, padding: 5, backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, }}>
                        <TextInput
                            placeholder='Emergency Contact Number'
                        />
                    </View>
                    <View style={{ borderRadius: 30, marginBottom: 8, padding: 5, backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, }}>
                        <TextInput
                            placeholder='Notes'
                            numberOfLines={6}
                            textAlignVertical={'top'}
                        />
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <CheckBox
                            disabled={false}
                            value={toggleCheckBox}
                            onValueChange={(newValue) => setToggleCheckBox(newValue)}
                        />
                        <Text style={{ alignSelf: "center", fontSize: 16, color: "#000" }}>I accept leave policy</Text>
                    </View>
                </View>

                <TouchableOpacity style={{ marginBottom: 5, backgroundColor: "#0433DA", padding: 18, width: "90%", alignSelf: "center", borderRadius: 50 }}>
                    <Text style={{ textAlign: "center", color: "#fff", fontSize: 18, fontWeight: "bold" }}>Submit</Text>
                </TouchableOpacity>

            </ScrollView>

        </SafeAreaView>

    );
};
export default ApplyLeave;
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