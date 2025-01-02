import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput
} from 'react-native';
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import { Calendar } from 'react-native-calendars';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHoliday } from '../../../APINetwork/ComponentApi';
import { BASE_URL } from '../../../utils';
import Reload from '../../../Reload';
import { showMessage } from "react-native-flash-message";
import HolidayListSkeleton from '../../Skeleton/HolidayListSkeleton';
import CardSkeletonTextFieldBorderRadious from '../../Skeleton/CardStyle/CardSkeletonTextFieldBorderRadious';


const HolidayList = ({ navigation }) => {
    const [selected, setSelected] = useState('');
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [holidays, setHolidays] = useState([]);
    const [expandedProfile, setExpandedProfile] = useState(false);
    const [monthlyHolidays, setMonthlyHolidays] = useState([]);
    const [loader, setLoader] = useState(false);

    console.log("--------", monthlyHolidays)

    const getMonthlyHolidays = (dateString) => {
        const selectedMonth = new Date(dateString).getMonth() + 1;
        const filteredHolidays = holidays?.filter(holiday => {
            const holidayMonth = new Date(holiday.date).getMonth() + 1;
            return holidayMonth === selectedMonth;
        });
        setMonthlyHolidays(filteredHolidays);
    };

    useEffect(() => {
        const fetchHolidays = async () => {
            setLoader(true);
            try {
                let token = await AsyncStorage.getItem('TOKEN');
                const url = `${BASE_URL}/holiday/list`;
                const response = await getHoliday(url, token);
                showMessage({
                    message: `${response?.data?.message}`,
                    type: "success",
                });
                setHolidays(response?.data?.data);
                getMonthlyHolidays(new Date().toISOString().split('T')[0]); // Initialize with current month's holidays
                setLoader(false);
            } catch (error) {
                console.error('Error fetching holiday data:', error?.response?.data);
                setLoader(false);
            }
        };

        fetchHolidays();
    }, []);

    return ( 
        <SafeAreaView style={styles.container}>
            <View style={{ marginTop: 15 }}>
                <View style={{ alignSelf: "center" }}>
                    <Text style={styles.name}>Holiday List</Text>
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
                        
                        {
                            loader ? <HolidayListSkeleton/> 
                            : 
                            <View style={{ marginHorizontal: responsiveWidth(5), marginTop: responsiveHeight(1) }}>
                                {holidays?.length > 0 ? (
                                    holidays?.map((holiday, index) => (
                                        <View key={index} style={{ height: responsiveHeight(10), borderRadius: 15, flexDirection: "row", backgroundColor: "#fff", borderWidth: 0.5, borderColor: "#0E0E64", elevation: 3, marginBottom: 5 }}>
                                            <View style={{ marginLeft: 20, backgroundColor: "#0E0E64", height: 70, width: 50, justifyContent: "center", borderBottomRightRadius: 30, borderBottomLeftRadius: 30 }}>
                                                <Image style={{ height: 30, width: 30, resizeMode: "contain", alignSelf: "center" }} source={require('../../../assets/HomeScreen/calendar.png')} />
                                            </View>
                                            <View style={{ marginLeft: 20, justifyContent: "center" }}>
                                                <Text style={{ color: "#0E0E64", fontSize: 18, fontWeight: "500" }}>{holiday.name}</Text>
                                                <Text style={{ color: "#0E0E64", fontSize: 18, fontWeight: "500" }}>{holiday.date}</Text>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <View style={{ alignSelf: "center", justifyContent: "center", alignItems: "center", flex: 1 }}>
                                        <Text style={{ color: "#0E0E64", fontSize: 18, fontWeight: "500", textAlign: "center" }}>No holidays available this month</Text>
                                    </View>
                                )}
                            </View>
                        }

                    </ScrollView>



            </View>
        </SafeAreaView>
    );
};

export default HolidayList;

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

