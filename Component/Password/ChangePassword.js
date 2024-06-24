
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { BASE_URL } from '../../utils';
import { changePasswords } from '../../APINetwork/ComponentApi';
import LoginGuestStyle from '../LoginScreen/LoginGuestStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePassword = ({navigation}) => {
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
        const token = await AsyncStorage.getItem('token')
        console.log(token, 'token')
        try {
            if (newPassword !== confirmPassword) {
                Alert.alert("New passwords do not match");
                return;
            } else {
                setLoader(true);
                const url = `${BASE_URL}/change/password`;
                const response = await changePasswords(url, data, token);
                console.log("response......", response?.data)
                if (response?.data?.status == true) {
                    setLoader(false);
                    setOldPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    alert(response?.data?.message)
                    navigation.goBack()
                } else {
                    // setOldPasswordError('Please enter old password');
                    // setNewPasswordError('Please enter new password');
                    // setConfirmPasswordError('Please enter confirm password');
                    setLoader(false);
                    alert(JSON.stringify(response.response.data?.error))
                }
            }
        } catch (error) {
            console.error('Error making POST request:', error);
        }
    };


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Old Password"
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
                onChange={() => setOldPasswordError(null)}
            />
            {/* {oldPasswordError ? (
                <Text style={LoginGuestStyle.error}>{oldPasswordError}</Text>
            ) : null} */}
            <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                onChange={() => setNewPasswordError(null)}
            />
            {newPasswordError ? (
                <Text style={LoginGuestStyle.error}>{newPasswordError}</Text>
            ) : null}
            <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onChange={() => setConfirmPasswordError(null)}
                setNewPasswordError
            />
            {confirmPasswordError ? (
                <Text style={LoginGuestStyle.error}>{confirmPasswordError}</Text>
            ) : null}
            <Button title="Change Password" onPress={handleChangePassword} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
    },
});

export default ChangePassword;
