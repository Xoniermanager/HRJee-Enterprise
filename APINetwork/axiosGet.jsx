
import axios from 'axios';
import { showMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils';

const axiosGet = async (url, token, navigation) => {

  try {
    const data = await axios({
      method: 'get',
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        let refresh_token=await AsyncStorage.getItem('refresh_token')
        console.log(refresh_token)
      let data = JSON.stringify({
        "refresh_token": refresh_token
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/refresh-token`,
        headers: { 
          'Content-Type': 'application/json', 
        },
        data : data
      };

      axios.request(config)
      .then(async(response) => {
        console.log(response.data,'response')
        await AsyncStorage.setItem(
          'TOKEN',
          response?.data?.access_token,
        );
        await AsyncStorage.setItem(
          'refresh_token',
          response?.data?.refresh_token,
        );
      })
      .catch((error) => {
  
      });

        // AsyncStorage.removeItem('TOKEN')
        // navigate('LoginScreen'); 
      }
      else {
        let message = 'Server error, please try again';
        if (Array.isArray(error.response.data.message)) {
          message = error.response.data.message.join(', ');
        } else if (typeof error.response.data.message === 'object') {
          message = Object.values(error.response.data.message).flat().join(', ');
        } else if (typeof error.response.data.message === 'string') {
          message = error.response.data.message;
        }
      }
    } else if (error.request) {
      showMessage({
        message: 'Network error, please check your connection.',
        type: "danger",
      });
    } else {
      showMessage({
        message: 'An unexpected error occurred.',
        type: "danger",
      });
    }
  }
};
export default axiosGet;
