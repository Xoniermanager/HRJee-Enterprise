
import React, { useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, ScrollView, SafeAreaView, Text, StyleSheet, Alert } from 'react-native';
import { BASE_URL } from '../../utils';
import { changePasswords } from '../../APINetwork/ComponentApi';
import LoginGuestStyle from '../LoginScreen/LoginGuestStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import Themes from '../Theme/Theme';
const ChangePassword = ({ navigation }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [loader, setLoader] = useState(false);

    let data = {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
    };

    const handleChangePassword = async () => {
        const token = await AsyncStorage.getItem('TOKEN')
        console.log(token, 'token')
        try {
            if (newPassword !== confirmPassword) {
                Alert.alert("New passwords do not match");
                return;
            } else {
                setLoader(true);
                const url = `${BASE_URL}/change/password`;
                const response = await changePasswords(url, data, token);
                if (response?.data?.status == true) {
                    setLoader(false);
                    setOldPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    navigation.goBack()
                } else {
                    setLoader(false);
                }
            }
        } catch (error) {
            console.error('Error making POST request:', error);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={{ alignSelf: "center", marginTop: 15, }}>
                <Text style={styles.name}>Change Password</Text>
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
                <View style={{margin:10, marginHorizontal: responsiveWidth(8) }}>
                  <Image style={{height:150, width:150, alignSelf:"center", marginVertical:20, resizeMode:"contain"}}
                  source={require('../../assets/ForgetPassword/reset-password.png')}
                  />
                    <TextInput
                        style={styles.input}
                        placeholder="Old Password"
                        secureTextEntry
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        onChange={() => setOldPasswordError(null)}
                        placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
                        color= {Themes == 'dark' ? '#000' : '#000'}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                        onChange={() => setNewPasswordError(null)}
                        placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
                        color= {Themes == 'dark' ? '#000' : '#000'}
                    />
                    {newPasswordError ? (
                        <Text style={LoginGuestStyle.error}>{newPasswordError}</Text>
                    ) : null}
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm New Password"
                        placeholderTextColor={"#000"}
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        onChange={() => setConfirmPasswordError(null)}
                        // placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
                        color= {Themes == 'dark' ? '#000' : '#000'}
                        setNewPasswordError
                    />
                    {confirmPasswordError ? (
                        <Text style={LoginGuestStyle.error}>{confirmPasswordError}</Text>
                    ) : null}
                    {/* <Button title="Change Password" onPress={handleChangePassword} /> */}
                    <TouchableOpacity onPress={handleChangePassword} style={styles.updateButton} >
                        <Text style={styles.updateButtonText}>Submit</Text>
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
    checkbox: {
        alignSelf: 'center',
    },
    input: {
        backgroundColor: '#e0f7fa',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        textColor: "#000"
        
    },
    updateButton: {
        backgroundColor: '#0052cc',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 2
    },
    updateButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        padding:5
    },
    sameAddressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sameAddressText: {
        fontSize: 16,
    },
});

export default ChangePassword;