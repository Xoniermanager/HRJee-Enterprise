import { Image, SafeAreaView, StyleSheet, TextInput, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import { NavigationContainer } from '@react-navigation/native';
import Themes from '../../Theme/Theme';

const Resign = ({ navigation }) => {
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
                    <Text style={styles.name}>Resign</Text>
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

                        {/* This is profile details */}
                        <View style={{ marginTop: 10, alignSelf: "center", marginTop: responsiveHeight(1), borderTopLeftRadius: 10, borderBottomLeftRadius: expandedprofile == true ? 0 : 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>

                            <Image style={{ height: 150, width: 150, alignSelf: "center", marginVertical: 20, resizeMode: "contain" }}
                                source={require('../../../assets/regin.png')}
                            />

                            <View style={{ borderRadius: 30, marginBottom: 8, padding: 5, backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, }}>
                                <TextInput
                                    placeholder='Subject'
                                    placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
                                    color= {Themes == 'dark' ? '#000' : '#000'}
                                />
                            </View>
                            <View style={{ marginBottom: expandedprofile == true ? 0 : 8, width: "95%", backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, borderTopLeftRadius: 50, borderBottomLeftRadius: expandedprofile == true ? 0 : 50, borderTopRightRadius: 50, borderBottomRightRadius: expandedprofile == true ? 0 : 50, padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={{ color: "#000", fontSize: responsiveFontSize(2.3) }}>Send To</Text>
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
                                            <TouchableOpacity activeOpacity={0.8} style={{ borderColor: "gray", borderWidth: 0.5, marginVertical: 5 }}>
                                                <Text style={{ textAlign: "center", fontSize: 15, color: "#000", fontWeight: "bold" }}>Ashraf Ali</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity activeOpacity={0.8} style={{ borderColor: "gray", borderWidth: 0.5, marginVertical: 5 }}>
                                                <Text style={{ textAlign: "center", fontSize: 15, color: "#000", fontWeight: "bold" }}>Shibli Sone</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity activeOpacity={0.8} style={{ borderColor: "gray", borderWidth: 0.5, marginVertical: 5 }}>
                                                <Text style={{ textAlign: "center", fontSize: 15, color: "#000", fontWeight: "bold" }}>Vishnu</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View> :
                                    null
                            }

                            <View style={{ borderRadius: 30, marginBottom: 8, padding: 5, backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, }}>
                                <TextInput
                                    placeholder='Type Resignation'
                                    numberOfLines={6}
                                    textAlignVertical={'top'}
                                    placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
                                    color= {Themes == 'dark' ? '#000' : '#000'}
                                />
                            </View>

                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate('ResignStatus')} style={{ marginBottom: 5, backgroundColor: "#0433DA", padding: 18, width: "90%", alignSelf: "center", borderRadius: 50 }}>
                            <Text style={{ textAlign: "center", color: "#fff", fontSize: 18, fontWeight: "bold" }}>Submit</Text>
                        </TouchableOpacity>
                    </ScrollView>

                </View>
            </View>

        </SafeAreaView>
    );
};
export default Resign;
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
        marginBottom: responsiveHeight(3)
    },
});