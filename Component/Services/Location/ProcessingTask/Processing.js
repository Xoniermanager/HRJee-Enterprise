import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GetLocation from 'react-native-get-location';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import {ThemeContext} from '../../../../Store/ConetxtApi.jsx/ConextApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../../utils';
import {asignTask, dispositionCode} from '../../../../APINetwork/ComponentApi';
import {Dropdown} from 'react-native-element-dropdown';
import Themes from '../../../Theme/Theme';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {useIsFocused} from '@react-navigation/native';
const image = {uri: 'https://i.postimg.cc/zf8d0r7t/nodata-1.png'};
const Processing = () => {
  const isFocused = useIsFocused();
  const [expanded, setExpanded] = useState(null);
  const {currentTheme} = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [list, setList] = useState(null);
  const [remark, setRemark] = useState('');
  const [remarkError, setRemarkError] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState();
  const [selfieTrue, setSelfieTrue] = useState(false);
  const [fileResponse, setFileResponse] = useState([]);
  const [docmodal, setDocmodal] = useState(false);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [codeList, setCodeList] = useState('');
  const [currentLocation, setCurrentLocation] = useState();
  const [visitAddress, setVisitAddress] = useState();
  const [addressLatiude, setAddressLatiude] = useState('');
  const [updateItem, setUpdateItem] = useState('');
  const [loader, setLoader] = useState(false);
  const [disableCamera, setDisableCamera] = useState(false);
  const [disablePhoto, setDisablePhoto] = useState(false);
  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setPhotoError(null);
        setPhoto(image);
        setSelfieTrue(true);
        setDisableCamera(true);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      // multiple: true,
    })
      .then(image => {
        if (image?.length > 5) {
          alert('You can only select up to 5 photos.');
        } else {
          setPhotoError(null);
          setPhoto(image);
          setSelfieTrue(false);
          setDisablePhoto(true);
        }
      })
      .catch(err => {
        console.log('err........', err);
      });
  };
  const chooseDocumentLibrary = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.pdf],
      });
      setFileResponse(response);
      setDocmodal(!docmodal);
    } catch (err) {
      console.warn(err);
    }
  }, []);
  const getasignTask = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    console.log(token, 'token');
    const url = `${BASE_URL}/assign/task`;
    const response = await asignTask(url, token);
    setList(response.data.data);
  };
  const dispositionCodeList = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    console.log(token, 'token');
    const url = `${BASE_URL}/get/disposition/code`;
    const response = await dispositionCode(url, token);
    setCodeList(response.data.data);
  };
  useEffect(() => {
    getasignTask();
    dispositionCodeList();
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    }).then(async location => {
      var lat = parseFloat(location.latitude);
      var long = parseFloat(location.longitude);
      setCurrentLocation({
        long: long,
        lat: lat,
      });
    });
  }, [isFocused]);
  const AddressTOLatLog = async item => {
    const apiKey = 'AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg'; // Replace with your Google Maps API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      item?.visit_address,
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK') {
        const location = response?.data?.results[0]?.geometry.location;
        setAddressLatiude(location);
      } else {
        // setError('Address not found');
      }
    } catch (err) {}
  };
  const latitude = currentLocation?.lat;
  const longitude = currentLocation?.long;
  const urlAddress = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg`;
  const getAddress = async () => {
    axios
      .get(urlAddress)
      .then(res => {
        setVisitAddress(res.data?.results[0].formatted_address);
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAddress();
  }, [currentLocation]);
  const data =
    list &&
    list.data.filter((item, index) => {
      return item.user_end_status == 'processing';
    });
  const tast_status_update = async item => {
    let latitude = addressLatiude.lat;
    let longitude = addressLatiude.lng;
    const token = await AsyncStorage.getItem('TOKEN');
    let data = new FormData();
    data.append('remark', remark);
    data.append('latitude', latitude);
    data.append('longitude', longitude);
    {
      fileResponse[0] == undefined
        ? null
        : data.append('document', fileResponse[0]);
    }
    data.append('user_end_status', 'completed');
    data.append('disposition_code_id', value);
    data.append('lat_long_address', visitAddress);
    if (selfieTrue) {
      var selfie_image = {
        uri: photo?.path,
        type: photo?.mime,
        name: photo?.modificationDate + '.' + 'jpg',
      };
      data.append('image', selfie_image);
    } else {
      var Galleryimage = {
        uri: photo?.path,
        type: photo?.mime,
        name: photo?.modificationDate + '.' + 'jpg',
      };
      data.append('image', Galleryimage);
    }
    console.log(data, 'data');
    if (remark.trim() === '') {
      showMessage({
        message: 'Please enter some text',
        type: 'danger',
      });
      setRemarkError('Please enter some text');
    } else if (photo == null) {
      showMessage({
        message: 'Please Upload the Image',
        type: 'danger',
      });
      setPhotoError('Please Upload the Image');
    } else if (value == '' || value == null) {
      showMessage({
        message: 'Please select disposition Code',
        type: 'danger',
      });
    } else {
      setLoader(true);
      const url = `${BASE_URL}/update/task/status/${updateItem.id}`;
      console.log(url, token);
      const config = {
        method: 'post',
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        data,
      };
      axios(config)
        .then(response => {
          if (response?.data?.status) {
            setLoader(false);
            setModalVisible(false);
            showMessage({
              message: response?.data?.message,
              type: 'success',
            });
            getasignTask();
          } else {
            setLoader(false);
            setModalVisible(false);
            showMessage({
              message: response?.data?.message,
              type: 'danger',
            });
          }
        })
        .catch(error => {
          setLoader(false);
          setModalVisible(false);
          console.log(error);
          showMessage({
            message: error?.response?.data?.message,
            type: 'danger',
          });
        });
    }
  };

  const renderItem = ({item}) => {
    const isExpanded = expanded === item.id;
    const responseData = JSON.parse(item.response_data || '{}');
    const keys = Object.keys(responseData);
    const displayedKeys = isExpanded ? keys : keys.slice(0, 3);
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#E1FCEB', '#FCFFFD', '#fff']}
        style={styles.card}>
        <TouchableOpacity
          onPress={() => [
            setModalVisible(true),
            setUpdateItem(item),
            AddressTOLatLog(item),
          ]}
          style={styles.button}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>

        <View style={styles.details}>
          {displayedKeys.map((key, index) => (
            <View key={index} style={styles.detailRow}>
              <Text style={styles.label}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </Text>
              <Text style={styles.value}>{responseData[key]}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setExpanded(isExpanded ? null : item.id)}
          style={styles.moreLessButton}>
          {isExpanded ? (
            <AntDesign style={{}} name="caretup" size={30} color="#000" />
          ) : (
            <AntDesign style={{}} name="caretdown" size={30} color="#000" />
          )}
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  return (
    <View style={{backgroundColor: currentTheme.background, flex: 1}}>
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Remarks</Text>
              <TextInput
                style={[styles.input, {color: currentTheme.text}]}
                placeholder="Type here"
                placeholderTextColor={currentTheme.text}
                value={remark}
                multiline={true}
                autoFocus={true}
                onChangeText={text => [setRemark(text)]}
                onChange={() => setRemarkError(null)}
              />
              {remarkError ? (
                <Text
                  style={{
                    color: 'red',
                    marginBottom: 8,
                    textAlign: 'center',
                    fontSize: 13,
                    // marginTop: 5,
                  }}>
                  {remarkError}
                </Text>
              ) : null}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.cameraButton,
                    {borderColor: disableCamera ? 'green' : 'blue'},
                  ]}
                  onPress={() => takePhotoFromCamera()}>
                  <Text
                    style={[
                      styles.buttonTextCammera,
                      {color: disableCamera ? 'green' : 'blue'},
                    ]}>
                    Pick From Camera
                  </Text>
                </TouchableOpacity>
                <Text style={styles.orText}>Or</Text>
                <TouchableOpacity
                  style={[
                    styles.galleryButton,
                    {borderColor: disablePhoto ? 'green' : 'orange'},
                  ]}
                  onPress={() => choosePhotoFromLibrary()}>
                  <Text
                    style={[
                      styles.buttonTextGallery,
                      {color: disablePhoto ? 'green' : 'orange'},
                    ]}>
                    Pick From Gallery
                  </Text>
                </TouchableOpacity>
              </View>
              {photoError ? (
                <Text
                  style={{
                    color: 'red',
                    marginBottom: 8,
                    textAlign: 'center',
                    fontSize: 13,
                    // marginTop: 5,
                  }}>
                  {photoError}
                </Text>
              ) : null}
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => chooseDocumentLibrary()}>
                <Text style={styles.uploadButtonText}>
                  Please upload the Document
                </Text>
              </TouchableOpacity>
              <Dropdown
                selectedTextProps={{
                  style: {
                    color: '#000',
                  },
                }}
                style={{
                  width: responsiveWidth(80),
                  padding: 10,
                  borderWidth: 1,
                  borderColor: '#000',
                  marginBottom: 15,
                }}
                data={codeList}
                maxHeight={300}
                labelField="name"
                valueField="id"
                placeholder={
                  !isFocus
                    ? 'Select Disposition Code'
                    : 'Select Disposition Code'
                }
                value={value}
                onChange={item => {
                  setValue(item.id);
                }}
                placeholderStyle={{
                  color: Themes == 'dark' ? '#000' : '#000',
                }}
                itemTextStyle={{color: Themes == 'dark' ? '#000' : '#000'}}
              />
              <View style={styles.submitCancelContainer}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => tast_status_update()}>
                  {loader ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Submit</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No data found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  textContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  container_imagebackground: {
    flex: 1,
    borderWidth: 1,
  },
  image: {
    flex: 1,
    height: responsiveHeight(65),
  },
  text: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    marginTop: responsiveHeight(50),
  },
  card: {
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    marginBottom: 6,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  taskId: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  customerName: {
    color: '#333',
  },
  date: {
    color: '#FF6347',
  },
  button: {
    backgroundColor: '#FF7F50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginBottom: 5,
    marginTop: -10,
  },
  buttonText: {
    color: '#fff',
    // fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonTextCammera: {
    color: 'blue',
    // fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonTextGallery: {
    color: 'orange',
    // fontWeight: 'bold',
    textAlign: 'center',
  },
  detailRow: {
    justifyContent: 'space-between',
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    color: '#333',
  },
  moreLessButton: {
    alignSelf: 'flex-end',
  },
  moreLessText: {
    color: '#FF7F50',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
  },
  updateButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
  },
  updateButtonText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cameraButton: {
    borderColor: 'blue',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  galleryButton: {
    borderColor: 'orange',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  orText: {
    marginHorizontal: 5,
  },
  uploadButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
  },
  submitCancelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
  },
});

export default Processing;
