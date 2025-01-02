import axios from "axios";
import { showMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from './NavigationService';

const axiosDelete = async (url, data, token) => {

  var config = {
    method: 'delete',
    url: url,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  };

  const response = await axios(config)
    .then(function (response) {

      return (response.data)
    })
    .catch(function (error) {

      if (error.response) {
        const { status } = error.response;
        if (status === 401) {
          // Handle token expired
          showMessage({
            message: 'Your session has expired. Please log in again.',
            type: "danger",
          })
          AsyncStorage.removeItem('TOKEN')
          navigate('LoginScreen'); // Navigate using the navigation service
        }
        else {
          // Server-side error
          let message = 'Server error, please try again';

          if (Array.isArray(error.response.data.message)) {
            // If the message is an array, join its elements into a string
            message = error.response.data.message.join(', ');
          } else if (typeof error.response.data.message === 'object') {
            // If the message is an object, extract and join its values into a string
            message = Object.values(error.response.data.message).flat().join(', ');
          } else if (typeof error.response.data.message === 'string') {
            // If the message is a string, use it directly
            message = error.response.data.message;
          }

          showMessage({
            message: message,
            type: "danger",
          });
        }
      } else if (error.request) {
        // Network error
        showMessage({
          message: 'Network error, please check your connection.',
          type: "danger",
        });
      } else {
        // Other errors
        showMessage({
          message: 'An unexpected error occurred.',
          type: "danger",
        });
      }
      // return JSON.parse(error.request._response)
    });


  return response;

}

export default axiosDelete;