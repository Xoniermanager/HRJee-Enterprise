import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate} from './NavigationService';
import { BASE_URL } from '../utils';
const axiosPost = async (url, data, token, form) => {
  const config = {
    method: 'post',
    url: url,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': form == 1 ? 'multipart/form-data' : 'application/json',
    },
    data,
  };
  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    const {status} = error.response;
    if (status === 401 && token!=null) {
      let refresh_token = await AsyncStorage.getItem('refresh_token');
      let data = JSON.stringify({
        refresh_token: refresh_token,
      });
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/refresh-token`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };
      console.log(config, 'config');
      axios
        .request(config)
        .then(async response => {
          console.log(response.data);
          await AsyncStorage.setItem('TOKEN', response?.data?.access_token);
          await AsyncStorage.setItem(
            'refresh_token',
            response?.data?.refresh_token,
          );
        })
        .catch(error => {
          console.log(error);
        });
    }
console.log(error?.response?.data?.message?.punch_out?.[0],'yash')
    showMessage({
      message: error?.response?.data?.message?.punch_out?.[0] || error?.response?.data?.message?.date?.[0]  || error?.response?.data?.message,
      type: 'danger',
      duration:4000
    });
    return error;
  }
};

export default axiosPost;
