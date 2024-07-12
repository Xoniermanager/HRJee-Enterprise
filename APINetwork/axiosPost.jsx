import axios from "axios";
import FlashMessage from "react-native-flash-message";
import { showMessage } from "react-native-flash-message";

const axiosPost = async (url, data, token,) => {

  var config = {
    method: 'post',
    url: url,
    headers: {
      Authorization: `Bearer ${token}`,
      // 'Content-Type': 'multipart/form-data',
      'Content-Type': 'application/json',
    },
    data
  };

  const response = await axios(config)
    .then(function (response) {
      return (response)
    })
    .catch(function (error) {
      console.log("------", error.response.data.message)
      // return (error)
      if (error.response) {
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
    });


  return response;

}

export default axiosPost;