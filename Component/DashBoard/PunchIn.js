import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PunchIn = () => {
    const Punch_IN_Out = async () => {
        setloading(true);
        setDisabledBtn(true);
        try {
          const url = `${BASE_URL}/employee/make/attendance`;
          let token = await AsyncStorage.getItem('TOKEN');
          const response = await punchin(url, token);
          CheckDailyAttendances();
          if (response?.data?.status) {
            CheckDailyAttendances();
            setLoader(false);
            setloading(false);
            setPunch(response?.data);
            setDisabledBtn(false);
            showMessage({
              message: `${response?.data?.message}`,
              type: 'success',
            });
          } else {
            setLoader(false);
            setloading(false);
            setDisabledBtn(false);
          }
        } catch (error) {
          console.error('Error making POST request:', error);
          setloading(false);
          setDisabledBtn(false);
          setLoader(false);
        }
      };
}

export default PunchIn

const styles = StyleSheet.create({})