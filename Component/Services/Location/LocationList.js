import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, {Marker} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import {Dropdown} from 'react-native-element-dropdown';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import {showMessage} from 'react-native-flash-message';

import GetLocation from 'react-native-get-location';
import { UpdateStatusTask, asignTask } from '../../../APINetwork/ComponentApi';
import { BASE_URL } from '../../../utils';
import PullToRefresh from '../../../PullToRefresh';
const TaskPage = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(0);
  const [mapView, setMapView] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [taskFilter, setTaskFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [addressLatitude, setAddressLatitude] = useState(null);
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
  const [loader, setLoader] = useState(false);
  const [disableCamera, setDisableCamera] = useState(false);
  const [disablePhoto, setDisablePhoto] = useState(false);
  const [disableDoc, setDisableDoc] = useState(false);
  const [query, setQuery] = useState('');
  const [userStatus, setUserStatus] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [resetLoader, setResetLoader] = useState(false);
  const userstatusData = [
    {label: 'Pending', value: 'pending'},
    {label: 'Processing', value: 'processing'},
    {label: 'Complete', value: 'completed'},
  ];
  const FinalStatusData = [
    ...userstatusData,
    {label: 'Reject', value: 'rejected'},
  ];

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
      setDisableDoc(true);
    } catch (err) {
      console.warn(err);
    }
  }, []);
  const getTask = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/assign/task`;
    const response = await asignTask(url, token);
    if (response.data.status) {
      setList(response.data.data.data);
    }
  };
  const dispositionCodeList = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    console.log(token, 'token');
    const url = `${BASE_URL}/get/disposition/code`;
    const response = await asignTask(url, token);
    setCodeList(response.data.data);
  };
  useEffect(() => {
    getTask();
    dispositionCodeList();
  }, []);
  useEffect(() => {
    if (modalVisible) {
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
    }
  }, [modalVisible]);
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
  const handleRefresh = async () => {
    getTask();
  };

  const fetchLatLng = async item => {
    const apiKey = 'AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg';
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        item?.visit_address,
      )}&key=${apiKey}`;
      const response = await axios.get(url);
      const location = response?.data?.results[0]?.geometry?.location;
      if (location) {
        setAddressLatitude(location);
      }
    } catch (error) {
      console.log('Geocode API error:', error);
    }
  };
  const UpdateStatus = async id => {
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/change/task/status/${id}`;
    let form = 0;
    const data = {
      user_end_status: 'processing',
    };
    const response = await UpdateStatusTask(url, data, token, form);
    if (response.data.status) {
      showMessage({
        message: response.data.message,
        type: 'success',
      });
      getTask();
    }
  };
  const TaskCardBasic = ({item}) => {
    const responseData = JSON.parse(item.response_data || '{}');
    const status = item.user_end_status?.toUpperCase() || 'UNKNOWN';
    const statusColor =
      item.user_end_status === 'pending'
        ? '#FFD700'
        : item.user_end_status === 'processing'
        ? '#ADD8E6'
        : item.user_end_status === 'completed'
        ? '#90EE90'
        : '#D3D3D3';

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {backgroundColor: selected === item.id ? '#D3E6F7' : '#F9F9F9'},
        ]}
        onPress={() => [setSelected(item.id), fetchLatLng(item)]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.taskTitle}>{responseData.city}</Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                backgroundColor: statusColor,
                color: '#2C648C',
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 10,
                marginRight: 10,
                fontSize: 12,
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}>
              {status}
            </Text>

            {item.user_end_status === 'completed' ? null : (
              <Menu>
                <MenuTrigger>
                  <Icon name="dots-vertical" size={18} color="#2C648C" />
                </MenuTrigger>
                <MenuOptions customStyles={menuOptionsStyle}>
                  {item.user_end_status === 'pending' ? (
                    <MenuOption onSelect={() => UpdateStatus(item.id)}>
                      <Text style={styles.menuText}>Processing</Text>
                    </MenuOption>
                  ) : null}
                  {item.user_end_status === 'processing' ? (
                    <MenuOption
                      onSelect={() => [
                        setModalVisible(true),
                        fetchLatLng(item),
                        setSelected(item.id),
                      ]}>
                      <Text style={styles.menuText}>Update Task</Text>
                    </MenuOption>
                  ) : null}
                </MenuOptions>
              </Menu>
            )}
          </View>
        </View>

        {/* Name and Remark */}
        <View style={styles.row}>
          <Icon name="clock-time-four-outline" size={18} color="#2C648C" />
          <Text style={styles.rowText}>{responseData.name}</Text>

          <Icon
            name="view-dashboard-outline"
            size={18}
            color="#2C648C"
            style={{marginLeft: 20}}
          />
          <Text style={styles.rowText}>{item.remark || 'No Remark'}</Text>
        </View>

        {/* Address and Navigate */}
        <View style={styles.row}>
          <Icon name="map-marker" size={18} color="#2C648C" />
          <Text style={styles.address}>{item.visit_address}</Text>

          {addressLatitude && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Map', {
                  lat: addressLatitude.lat,
                  lng: addressLatitude.lng,
                  visitAddress:item.visit_address,
                  name:responseData.name,
                  phone:responseData.phone,
                })
              }
              style={{marginLeft: 30}}>
              <Icon
                name="arrow-right-circle-outline"
                size={22}
                color="#2C648C"
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  const TaskCardWithMap = ({item}) => {
    const responseData = JSON.parse(item.response_data || '{}');
    const status = item.user_end_status || item.user_end_status || 'unknown';
    const statusColor =
      item.user_end_status === 'pending'
        ? '#FFD700'
        : item.user_end_status === 'processing'
        ? '#ADD8E6'
        : item.user_end_status === 'completed'
        ? '#90EE90'
        : '#D3D3D3';
    return (
      <TouchableOpacity
        style={[
          styles.card,
          {backgroundColor: selected === item.id ? '#D3E6F7' : '#F9F9F9'},
        ]}
        onPress={() => [
          setSelected(item.id),
          fetchLatLng(item),
          setSelected(item.id),
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.taskTitle}>{responseData.name}</Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                backgroundColor: statusColor,
                color: '#2C648C',
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 'bold',
                marginRight: 10,
                textTransform: 'uppercase',
              }}>
              {status}
            </Text>

            {item.user_end_status === 'completed' ? null : (
              <Menu>
                <MenuTrigger>
                  <Icon name="dots-vertical" size={18} color="#2C648C" />
                </MenuTrigger>
                <MenuOptions customStyles={menuOptionsStyle}>
                  {item.user_end_status === 'pending' ? (
                    <MenuOption onSelect={() => UpdateStatus(item.id)}>
                      <Text style={styles.menuText}>Processing</Text>
                    </MenuOption>
                  ) : null}
                  {item.user_end_status === 'processing' ? (
                    <MenuOption
                      onSelect={() => [
                        setModalVisible(true),
                        fetchLatLng(item),
                        setSelected(item.id),
                      ]}>
                      <Text style={styles.menuText}>Update Task</Text>
                    </MenuOption>
                  ) : null}
                </MenuOptions>
              </Menu>
            )}
          </View>
        </View>

        {/* Name and Remark */}
        <View style={styles.row}>
          <Icon name="clock-time-four-outline" size={18} color="#2C648C" />
          <Text style={styles.rowText}>{responseData.name}</Text>

          <Icon
            name="view-dashboard-outline"
            size={18}
            color="#2C648C"
            style={{marginLeft: 20}}
          />
          <Text style={styles.rowText}>{item.remark || 'No Remark'}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="map-marker" size={18} color="#2C648C" />
          <Text style={styles.address}>{item.visit_address}</Text>

          {addressLatitude && selected == item.id && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Map', {
                  lat: addressLatitude.lat,
                  lng: addressLatitude.lng,
                  visitAddress:item.visit_address,
                  name:responseData.name,
                  phone:responseData.phone,
                })
              }
              style={{marginLeft: 8}}>
              <Icon
                name="arrow-right-circle-outline"
                size={22}
                color="#2C648C"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Google Map View */}
        {addressLatitude && selected == item.id && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: addressLatitude.lat,
              longitude: addressLatitude.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Marker
              coordinate={{
                latitude: addressLatitude.lat,
                longitude: addressLatitude.lng,
              }}
            />
          </MapView>
        )}
      </TouchableOpacity>
    );
  };
  const renderItem = ({item, index}) => {
    return (
      <View>
        {mapView ? (
          <TaskCardWithMap item={item} index={index} />
        ) : (
          <TaskCardBasic item={item} index={index} />
        )}
      </View>
    );
  };
  const tast_status_update = async item => {
    let latitude = addressLatitude.lat;
    let longitude = addressLatitude.lng;
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
      const url = `${BASE_URL}/update/task/status/${selected}`;
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
            getTask();
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
          console.log(error?.response?.data);
          showMessage({
            message: error?.response?.data?.message,
            type: 'danger',
          });
        });
    }
  };
  const handleSearch = async text => {
    setQuery(text);
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/assign/task?search_term=${text}`;
    console.log(url);
    const response = await getAccesss(url, token);
    if (response.data.status) {
      setList(response.data.data.data);
    }
  };
  const filter_handle = async () => {
    setResetLoader(true);
    const token = await AsyncStorage.getItem('TOKEN');
    let queryParams = [];
    if (userStatus) {
      queryParams.push(`user_end_status=${encodeURIComponent(userStatus)}`);
    }
    if (systemStatus) {
      queryParams.push(`final_status=${encodeURIComponent(systemStatus)}`);
    }
    if (locationFilter) {
      queryParams.push(`visit_address=${encodeURIComponent(locationFilter)}`);
    }
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    const url = `${BASE_URL}/assign/task${queryString}`;
    console.log('Filter URL:', url);

    try {
      const response = await getAccesss(url, token);
      setResetLoader(false);
      if (response.data?.status) {
        setFilterVisible(false);
        setList(response.data.data.data);
      }
    } catch (error) {
      console.error('Filter API error:', error);
    }
  };

  const resetFilters = () => {
    getTask()
    setUserStatus(null);
    setSystemStatus(null);
    setLocationFilter('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <PullToRefresh onRefresh={handleRefresh}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        {list==null && (
        <Modal transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={{color: '#000', marginTop: 10,fontWeight:'bold',fontSize:16}}>Processing...</Text>
          </View>
        </Modal>
      )}
        <View style={styles.header}>
          <Text style={styles.headerText}>My Tasks</Text>
          <View style={styles.headerRightIcons}>
            <TouchableOpacity onPress={() => setFilterVisible(true)}>
              <Icon
                name="filter-variant"
                size={24}
                color="#000"
                style={{marginRight: 16}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMapView(!mapView)}>
              <Icon
                name={mapView ? 'map-outline' : 'map-marker-outline'}
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          </View>
        </View>
        <TextInput
          placeholder="Search..."
          placeholderTextColor={'#9999'}
          value={query}
          onChangeText={text => handleSearch(text)}
          style={[styles.input, {marginHorizontal: 20}]}
        />
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
                style={[
                  styles.input,
                  {
                    color: '#000',
                    width: '100%',
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    borderRadius: 10,
                    marginBottom: 20,
                    paddingHorizontal: 10,
                  },
                ]}
                placeholder="Type here"
                placeholderTextColor={'#999'}
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
                style={[
                  styles.uploadButton,
                  {backgroundColor: disableDoc ? 'green' : 'blue'},
                ]}
                onPress={() => chooseDocumentLibrary()}>
                {disableDoc ? (
                  <Text style={[styles.uploadButtonText]}>
                    Success upload document
                  </Text>
                ) : (
                  <Text style={[styles.uploadButtonText]}>
                    Please upload the Document
                  </Text>
                )}
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
                  color: '#000',
                }}
                itemTextStyle={{color: '#000'}}
              />
              <View style={styles.submitCancelContainer}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => tast_status_update()}>
                  {loader ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={{color: '#fff'}}>Submit</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={{color: '#000'}}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View style={{marginBottom: 60}}>
          <FlatList
            data={list}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View>
                <Image
                  source={{
                    uri: 'https://static.vecteezy.com/system/resources/thumbnails/013/927/147/small_2x/adaptive-interface-design-illustration-concept-on-white-background-vector.jpg',
                  }}
                  style={{padding: 20, height: 250}}
                />
                <Text
                  style={{
                    fontSize: 18,
                    color: '#000',
                    fontWeight: '500',
                    textAlign: 'center',
                  }}>
                  Data Not Found
                </Text>
              </View>
            }
          />
        </View>
        {filterVisible && (
          <View style={styles.sidebarOverlay}>
            <View style={styles.sidebar}>
              <TouchableOpacity
                style={{alignSelf: 'flex-end'}}
                onPress={() => setFilterVisible(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.sidebarTitle}>Filters</Text>

              <Text style={styles.filterLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={locationFilter}
                onChangeText={setLocationFilter}
                placeholder="Enter location"
                placeholderTextColor={'#999'}
              />

              <Text style={styles.filterLabel}>User End Status</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={'#999'}
                selectedTextStyle={{color: '#000'}}
                itemTextStyle={{color: '#000'}}
                data={userstatusData}
                labelField="label"
                valueField="value"
                placeholder="Select status"
                value={userStatus}
                onChange={item => setUserStatus(item.value)}
              />
              <Text style={styles.filterLabel}>Final Status</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={'#999'}
                selectedTextStyle={{color: '#000'}}
                itemTextStyle={{color: '#000'}}
                data={FinalStatusData}
                labelField="label"
                valueField="value"
                placeholder="Select status"
                value={systemStatus}
                onChange={item => setSystemStatus(item.value)}
              />

              <View style={{marginTop: 20}}>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => filter_handle()}>
                  {resetLoader ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.applyText}>Apply Filter</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => resetFilters()}>
                  <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </PullToRefresh>
    </SafeAreaView>
  );
};

export default TaskPage;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {fontSize: 22, fontWeight: '700', color: '#2C3E50'},
  headerRightIcons: {flexDirection: 'row', alignItems: 'center'},
  listContent: {padding: 20},
  timestamp: {
    fontSize: 14,
    color: '#A3A3C2',
    marginVertical: 10,
    textAlign: 'center',
  },
  card: {
    padding: 15,
    borderRadius: 18,
    marginBottom: 20,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
  },
  row: {flexDirection: 'row', alignItems: 'center', marginBottom: 6},
  rowText: {marginLeft: 6, fontSize: 14, color: '#2C3E50'},
  address: {
    marginLeft: 6,
    fontSize: 13,
    color: '#2C3E50',
    flexShrink: 1,
  },
  map: {
    width: '100%',
    height: 150,
    marginTop: 10,
    borderRadius: 10,
  },
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  sidebar: {
    width: '70%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    alignSelf: 'flex-end',
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  filterLabel: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    color: '#000',
  },
  applyButton: {
    backgroundColor: '#2C648C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  applyText: {
    color: '#fff',
    fontWeight: '600',
  },
  resetButton: {
    borderWidth: 1,
    borderColor: '#2C648C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetText: {
    color: '#2C648C',
    fontWeight: '600',
  },
  menuIcon: {
    padding: 6,
  },
  menuText: {
    fontSize: 16,
    padding: 8,
    color: '#333',
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
    backgroundColor: '#2a3c6c',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
  dropdown: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const menuOptionsStyle = {
  optionsContainer: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 5,
  },
};
