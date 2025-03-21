import axios from 'axios';
import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from './NavigationService';

const axiosPost = async (url, data, token,form) => {
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
    console.log("error", error?.response?.data?.errors)
    // Display error message using react-native-flash-message
    showMessage({
      message: error.response?.data?.message,
      description: error.response?.data?.errors || error.message || "Unknown error",
      type: "danger",
    });
    
    // Optionally handle specific error cases, e.g., redirect on authentication errors
    if (error?.response?.status === 401) {
      // Redirect to login page or any other action
      navigate('Login');
    }

    // Optionally log the error or perform other actions
    console.error("Error in axiosPost:", error);

    // You may want to return a custom response or throw an error to be handled elsewhere
    return Promise.reject(error);
  }
};

export default axiosPost;
