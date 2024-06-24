import { Image, SafeAreaView, StyleSheet, TextInput, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import { NavigationContainer } from '@react-navigation/native';

const ResignStatus = ({ navigation }) => {
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
                    <Text style={styles.name}>Resign Status</Text>
                </View>

                <View
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#fff',
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                    }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{marginTop:20, borderRadius: 30, marginBottom: 8, padding: 5, backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, width:"95%", alignSelf:"center"}}>
                            <View style={{ marginBottom: 5 }}>
                                <Text style={{ color: "#000", fontWeight: "bold", marginLeft: 10 }}>Subject</Text>
                                <Text style={{ marginLeft: 10 }}>This is the subject</Text>
                            </View>

                            <View style={{ marginBottom: 5 }}>
                                <Text style={{ color: "#000", fontWeight: "bold", marginLeft: 10 }}>Mail to</Text>
                                <Text style={{ marginLeft: 10 }}>demo@xoniertech.com</Text>
                                <Text style={{ marginLeft: 10 }}>hr@xoniertech.com</Text>
                            </View>
                            <Text style={{ color: "#000", fontWeight: "bold", marginLeft: 10 }}>Message</Text>
                            <Text style={{ marginLeft: 10 }}>This is the main content for resignation latter</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('ResignStatus')} style={{ marginBottom: 5, backgroundColor: "green", padding: 18, width: "90%", alignSelf: "center", borderRadius: 50 }}>
                            <Text style={{ textAlign: "center", color: "#fff", fontSize: 18, fontWeight: "bold" }}>Approved</Text>
                        </TouchableOpacity>
                    </ScrollView>

                </View>
            </View>

        </SafeAreaView>
    );
};
export default ResignStatus;
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