import { Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Platform } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import { NavigationContainer } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import CheckBox from '@react-native-community/checkbox';
import { LeaveApply, getLeaveType, token } from '../../../APINetwork/ComponentApi';
import { BASE_URL } from '../../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import Reload from '../../../Reload';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import CardSkeletonBorder from '../../Skeleton/CardStyle/CardSkeletonBorder';
import ProfileDetails from '../../Skeleton/ProfileDetails';
import ApplyLeaveSkeleton from '../../Skeleton/ApplyLeaveSkeleton';
import Themes from '../../Theme/Theme';


const ApplyLeave = ({ navigation }) => {
    const [selected, setSelected] = useState('');
    const [monthDay, setMonth] = useState('');
    const date = new Date(selected);
    const month = date.toLocaleString('default', { month: 'long' }); // Get full month name
    // const month = date.getMonth() + 1; // Get month number (1-12)

    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const [getleavetypeapidata, setGetLeaveTypeApiData] = useState([])
    const [loader, setLoader] = useState(false);
    const [value1, setValue1] = useState()
    const [isFocus, setIsFocus] = useState(false);
    const [reason, setReason] = useState(false);
    const [selectedId, setSelectedId] = useState('')
    const [selectedId1, setSelectedId1] = useState('')
    const [selectedId2, setSelectedId2] = useState('')
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    console.log("choose------", selectedId)

    const radioButtons: RadioButtonProps[] = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Morning',
            value: 'first_half',
            labelStyle:{ color: Themes == 'dark' ? '#000' : '#000'} // Customize label style here
        },
        {
            id: '2',
            label: 'Afternoon',
            value: 'second_half',
            labelStyle:{ color: Themes == 'dark' ? '#000' : '#000'} // Customize label style here
        }
    ]), []);
    const radioButtons1: RadioButtonProps[] = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Morning',
            value: 'option1',
            labelStyle:{ color: Themes == 'dark' ? '#000' : '#000'} // Customize label style here

        },
        {
            id: '2',
            label: 'Afternoon',
            value: 'option2',
            labelStyle:{ color: Themes == 'dark' ? '#000' : '#000'} // Customize label style here

        }
    ]), []);
    const radioButtons2: RadioButtonProps[] = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Morning',
            value: 'option1',
            labelStyle:{ color: Themes == 'dark' ? '#000' : '#000'} // Customize label style here

        },
        {
            id: '2',
            label: 'Afternoon',
            value: 'option2',
            labelStyle:{ color: Themes == 'dark' ? '#000' : '#000'} // Customize label style here

        }
    ]), []);


    const calculateDaysBetweenDates = () => {
        // Ensure startDate and endDate are valid dates
        if (!startDate || !endDate) {
            return 0; // Handle the case where either date is not set
        }

        // Convert startDate and endDate to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Calculate the difference in milliseconds
        const differenceInMs = Math.abs(end - start);

        // Convert milliseconds to days
        const daysDifference = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

        return daysDifference;
    };

    // Example usage
    const daysBetween = calculateDaysBetweenDates();

    const handlePress = (type) => {
        const currentDate = selected; // Get the currently selected date
        if (type === 1) {
            setStartDate(currentDate); // Set start date
        } else if (type === 2) {
            setEndDate(currentDate); // Set end date
        }
        setSelected(currentDate); // Highlight selected date
    };

    // This is starting api part

    useEffect(() => {
        async function check() {

            try {
                setLoader(true);
                let token = await AsyncStorage.getItem('TOKEN');

                const url = `${BASE_URL}/leave/type`;
                const response = await getLeaveType(url, token);
                if (response?.data?.status == true) {
                    // showMessage({
                    //     message: `${response?.data?.message}`,
                    //     type: "success",
                    // });
                    setGetLeaveTypeApiData(response?.data?.data)
                    setLoader(false);
                }
                else {
                    setLoader(false);
                }
            } catch (error) {
                console.error('Error making POST request:', error);
                setLoader(false);
            }
        }
        check()
    }, [])

    const handleSubmit = async () => {
        try {
            if (startDate == "" || startDate == [] || startDate == undefined) {
                showMessage({
                    message: "Please select startdate",
                    type: "danger",
                });
            }
            else if (endDate == "" || endDate == [] || endDate == undefined) {
                showMessage({
                    message: "Please select enddate",
                    type: "danger",
                });
            }
            else if (value1 == undefined || value1 == "" || value1 == []) {
                showMessage({
                    message: "Please select leave type",
                    type: "danger",
                });
            }
            else if (reason == "") {
                showMessage({
                    message: "Please enter reason",
                    type: "danger",
                });
            }
            else {
                setLoader(true);
                const token = await AsyncStorage.getItem('TOKEN')
                const url = `${BASE_URL}/apply/leave`;

                let data = {
                    leave_type_id: value1,
                    from: startDate,
                    to: endDate,
                    reason: reason,
                };

                if (toggleCheckBox) {
                    if (startDate == endDate) {
                        data.is_half_day = true;
                        data.from_half_day = selectedId == 1 ? 'first_half' : 'second_half';
                    } else {
                        data.is_half_day = true;
                        data.from_half_day = selectedId1 == 1 ? 'first_half' : 'second_half';
                        data.to_half_day = selectedId2 == 1 ? 'first_half' : 'second_half';
                    }
                }

                console.log("payload------------", data)
                const response = await LeaveApply(url, data, token);
                if (response?.data?.status == true) {
                    showMessage({
                        message: `${response?.data?.message}`,
                        type: "success",
                    });
                    navigation.goBack()
                    setLoader(false);
                }
                else {
                    setLoader(false);
                }
            }
        } catch (error) {
            console.error('Error making POST request:', error);
            setLoader(false);
        }
    };

    // This is ending api part

    // if (getleavetypeapidata == '') {
    //     return <Reload />
    // }

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
                {
                    loader ? <ApplyLeaveSkeleton />
                        :
                        <>
                            <View style={{ flexDirection: "row", marginTop: responsiveHeight(3), alignSelf: "center", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ alignItems: "center", marginHorizontal: responsiveWidth(2) }}>
                                    <TouchableOpacity onPress={() => handlePress(1)} style={{ backgroundColor: "#0E0E64", borderRadius: 100, height: 90, width: 90, justifyContent: "center" }}>
                                        <Text style={{ color: "#fff", fontSize: 15, textAlign: "center" }}>{startDate ? new Date(startDate).getDate() : 'Start'}</Text>
                                        <Text style={{ color: "#fff", fontSize: 15, textAlign: "center" }}>{startDate ? new Date(startDate).toLocaleString('default', { month: 'long' }) : 'Date'}</Text>
                                    </TouchableOpacity>
                                    <Image style={{ height: 50, width: 50, }} source={require('../../../assets/ApplyLeave/arrow-down.png')} />
                                    <TouchableOpacity onPress={() => handlePress(2)} style={{ backgroundColor: "#0E0E64", borderRadius: 100, height: 90, width: 90, justifyContent: "center" }}>
                                        <Text style={{ color: "#fff", fontSize: 15, textAlign: "center" }}>{endDate ? new Date(endDate).getDate() : 'End'}</Text>
                                        <Text style={{ color: "#fff", fontSize: 15, textAlign: "center" }}>{endDate ? new Date(endDate).toLocaleString('default', { month: 'long' }) : 'Date'}</Text>
                                    </TouchableOpacity>
                                    <Text style={{ color: "#0E0E64", fontSize: 18, marginTop: responsiveHeight(1) }}>{daysBetween} Days</Text>
                                </View>
                                <View style={{ marginHorizontal: responsiveWidth(2) }}>
                                    <Calendar style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: "#fff", elevation: 7, width: responsiveWidth(70) }}
                                        onDayPress={day => {
                                            setSelected(day.dateString);
                                            setMonth(day);

                                            if (!startDate) {
                                                setStartDate(day.dateString); // Set start date if it's not already set
                                            } else if (!endDate) {
                                                setEndDate(day.dateString); // Set end date if start date is already set
                                            }
                                        }}
                                        markedDates={{
                                            [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' },
                                            [startDate]: { startingDay: true, color: 'orange', textColor: 'white' },
                                            [endDate]: { endingDay: true, color: 'orange', textColor: 'white' },
                                        }}
                                    />


                                    {/* <Text>End date greater then start date</Text> */}
                                </View>
                            </View>
                            {
                                startDate > endDate ?
                                    showMessage({
                                        message: `End date greater then start date, Please select valid details`,
                                        type: "danger",
                                    })
                                    // <Text style={{ textAlign: "center" }}>End date greater then start date, Please select valid details</Text>
                                    :
                                    null
                            }
                            <View style={{ flexDirection: "row", marginHorizontal: responsiveWidth(2) }}>
                                <CheckBox
                                    disabled={false}
                                    value={toggleCheckBox}
                                    onValueChange={(newValue) => setToggleCheckBox(newValue)}
                                    tintColors={{ true: color = "#000", false: color = "#000" }}

                                />
                                <Text style={{ alignSelf: "center", fontSize: 16, color: "#000", marginHorizontal: Platform.OS == 'ios' ? 8: null }}>Is half day</Text>
                            </View>
                            {
                                toggleCheckBox == true ?
                                    startDate == endDate ?
                                        <View style={{ borderRadius: 10, backgroundColor: "#EDFBFE", padding: 5, marginHorizontal: responsiveWidth(2) }}>
                                            <RadioGroup containerStyle={{ flexDirection: "row", }}
                                                radioButtons={radioButtons}
                                                onPress={setSelectedId}
                                                selectedId={selectedId}
                                            />
                                        </View>
                                        :
                                        <View style={{ borderRadius: 10, backgroundColor: "#EDFBFE", padding: 5, marginHorizontal: responsiveWidth(2) }}>
                                            <Text style={{color: Themes == 'dark' ? '#000' : '#000' }}>First day of leave</Text>
                                            <RadioGroup containerStyle={{ flexDirection: "row" }}
                                                radioButtons={radioButtons1}
                                                onPress={setSelectedId1}
                                                selectedId={selectedId1}
                                            />
                                            <Text style={{  color: Themes == 'dark' ? '#000' : '#000' }}>Last day of leave</Text>
                                            <RadioGroup containerStyle={{ flexDirection: "row" }}
                                                radioButtons={radioButtons2}
                                                onPress={setSelectedId2}
                                                selectedId={selectedId2}
                                            />
                                        </View>
                                    :
                                    null
                            }

                            {/* This is profile details */}
                            <View style={{ marginHorizontal: responsiveWidth(2), marginTop: responsiveHeight(1), borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                                <View style={{ backgroundColor: "#EDFBFE", padding: 10, marginBottom: 5, borderRadius: 10 }}>
                                    <Dropdown selectedTextProps={{
                                        style: {
                                            color: '#000',
                                        },
                                    }}
                                        style={styles.input}
                                        data={getleavetypeapidata && getleavetypeapidata}
                                        maxHeight={300}
                                        labelField="name"
                                        valueField="id"
                                        placeholder={!isFocus ? 'Select leave type' : '...'}
                                        value={value1}
                                        onChange={item => {
                                            setValue1(item.id);
                                        }}
                                        placeholderStyle={{
                                            color: Themes == 'dark' ? '#000' : '#000',          // Assuming Themes.colors.placeholder is defined
                                          }}
                                          itemTextStyle={{   color: Themes == 'dark' ? '#000' : '#000',  }}
                                    />
                                </View>
                                <View style={{ borderRadius: 30, marginBottom: 8, padding: 5, backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, }}>
                                    <TextInput
                                        placeholder='Reason'
                                        numberOfLines={6}
                                        textAlignVertical={'top'}
                                        onChangeText={(text) => setReason(text)}
                                        placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
                                        color= {Themes == 'dark' ? '#000' : '#000'}
                                    />
                                </View>

                            </View>

                            <TouchableOpacity onPress={() => handleSubmit()} style={{ marginBottom: 5, backgroundColor: "#0433DA", padding: 18, width: "90%", alignSelf: "center", borderRadius: 50 }}>
                                <Text style={{ textAlign: "center", color: "#fff", fontSize: 18, fontWeight: "bold" }}>Submit</Text>
                            </TouchableOpacity>
                        </>
                }



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