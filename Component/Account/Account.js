import LinearGradient from 'react-native-linear-gradient';
import React, { useState, useContext, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { BASE_URL } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Reload from '../../Reload';
import { getProfile } from '../../APINetwork/ComponentApi';
import { showMessage } from "react-native-flash-message";
import RNFetchBlob from 'rn-fetch-blob';
import AccountSkeleton from '../Skeleton/AccountSkeleton';
import Themes from '../Theme/Theme';



const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const Account = ({ title, description }) => {
  const showData = [
    {
      id: 1,
      uri: require('../../assets/HomeScreen/calendar.png'),
      name: 'Attendance',
      num: 20,
      backgroundcolor: '#BAAEFC',
    },
    {
      id: 2,
      uri: require('../../assets/HomeScreen/leave.png'),
      name: 'Leave',
      num: 20,
      backgroundcolor: '#F9B7D5',
    },
    {
      id: 3,
      uri: require('../../assets/HomeScreen/medal.png'),
      name: 'Award',
      num: 20,
      backgroundcolor: '#44D5FB',
    },
  ];
  const [getProfileApiData, setGetProfileApiData] = useState('');
  const [getAssetsApiData, setGetAssetsApiData] = useState('');
  const [item, setURI] = useState('');
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState(false);


  const navigation = useNavigation();

  const renderServicesList = ({ item }) => (
    <View
      style={{
        justifyContent: 'center',
        backgroundColor: item.backgroundcolor,
        width: responsiveWidth(28),
        height: responsiveHeight(15),
        marginHorizontal: 5,
        borderRadius: 20,
      }}>
      <View style={{ padding: 10, alignItems: 'center' }}>
        <Image
          style={{ height: 50, width: 50, marginBottom: 2 }}
          source={item.uri}
        />
        <Text numberOfLines={1} style={{ marginBottom: 2, fontSize: 16, color: '#000' }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 16, color: '#000' }}>{item.num}</Text>
      </View>
    </View>
  );

  {
    /* THis code is less more */
  }

  const [expandedbank, setExpandedBank] = useState(false);
  const [expandedassets, setExpandedAssets] = useState(false);
  const [expandeddocuments, setExpandedDocuments] = useState(false);
  const [bankdetailsdata, setBankDetailsData] = useState('');
  const [documentdetailsdata, setGetDocumentApiData] = useState([]);

  const toggleExpandedBank = () => {
    setExpandedBank(!expandedbank);
  };
  const toggleExpandedAssets = () => {
    setExpandedAssets(!expandedassets);
  };
  const toggleExpandedDocuments = () => {
    setExpandedDocuments(!expandeddocuments);
  };

  // const BankDetails = async () => {
  //   try {
  //     let token = await AsyncStorage.getItem('token');
  //     const response = await axios.get(`${BASE_URL}/user/bank/details`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setBankDetailsData(response?.data?.data);
  //   } catch (error) {
  //     if (error.response) {
  //       // Backend error handling
  //       console.error('Backend returned status:', error.response.status);
  //       console.error('Backend error data:', error.response.data);
  //       throw new Error(error.response.data.message || 'Something went wrong');
  //     } else if (error.request) {
  //       // Network error handling
  //       console.error('Network error:', error.request);
  //       throw new Error('Network error, please try again');
  //     } else {
  //       // General error handling
  //       console.error('Error:', error.message);
  //       throw new Error('An unknown error occurred');
  //     }
  //   }
  // };

  useEffect(() => {
    async function check() {
      try {
        setLoader(true);
        let token = await AsyncStorage.getItem('TOKEN');
        const url = `${BASE_URL}/user/details`;
        const response = await getProfile(url, token);

        if (response?.data?.status === true) {
          // showMessage({
          //   message: `${response?.data?.message}`,
          //   type: "success",
          // });
          setGetProfileApiData(response?.data?.data);
          setBankDetailsData(response?.data?.data?.bank_details);
          setGetDocumentApiData(response?.data?.data?.document_details);
          setGetAssetsApiData(response?.data?.data?.asset_details);
          setLoader(false);
        } else {
          setLoader(false);
        }
      } catch (error) {
        console.error('Error making POST request:', error);
        setLoader(false);
      }
    }
    check();
  }, []);

  const historyDownload = (item) => {
    if (item != null) {
      setShow(true)
      if (Platform.OS === 'ios' || Platform.OS == 'android') {
        downloadHistory(item);
      } else {
        try {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'storage title',
              message: 'storage_permission',
            },
          ).then(granted => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('Storage Permission Granted.');
              setShow(false)

              downloadHistory(item);
            } else {
              alert('storage_permission')
              setShow(false)

            }
          });
        } catch (err) {
          //To handle permission related issue
          console.log('error', err);
          setloading(false)

        }
      }
    }
    else {
      alert('No record found!')
      setShow(false)
    }


  };
  const downloadHistory = async (item) => {
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let date = new Date();
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/Report_Download' +
          Math.floor(date.getTime() + date.getSeconds() / 2),
        description: 'Risk Report Download',
      },
    };
    config(options)
      .fetch('GET', item)
      .then(res => {
        alert('Report Downloaded Successfully.')
        setShow(false)
      });
  };


  if (loader) {
    return <AccountSkeleton />
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* this is code of profile details */}
        <View
          style={{
            marginTop: 15,
          }}>
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <Text style={styles.name}>Profile</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.dispatch(DrawerActions.openDrawer('MyDrawer'))
              }
              style={{ marginLeft: 5 }}>
              <FontAwesome style={{}} name="edit" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 10, alignSelf: 'center' }}>
            {
              getProfileApiData?.profile_image == "" || getProfileApiData?.profile_image == [] || getProfileApiData?.profile_image == null ?
                <Image
                  style={{
                    height: 100,
                    width: 100,
                    resizeMode: 'contain',
                    marginVertical: 5,
                    alignSelf: 'center',
                  }}
                  source={require('../../assets/HomeScreen/profile.png')}
                />
                :
                <Image
                  style={{
                    height: 100,
                    width: 100,
                    resizeMode: 'contain',
                    marginVertical: 5,
                    alignSelf: 'center',
                  }}
                  source={{ uri: 'https://i.postimg.cc/L69jybXV/512.png' }} // Replace with the actual image URL
                />
            }
            <Text style={styles.name}>{getProfileApiData.name}</Text>
            <Text style={styles.name}>{getProfileApiData?.phone}</Text>
            <Text style={styles.name}>{getProfileApiData?.email}</Text>
          </View>
        </View>

        <View
          style={{
            marginBottom: responsiveHeight(10),
            backgroundColor: '#fff',
            borderTopLeftRadius: 40,
            marginTop: responsiveHeight(3),
            borderTopRightRadius: 40,
          }}>
          <Text
            style={{
              fontSize: 18,
              color: '#0E0E64',
              alignSelf: 'center',
              marginVertical: 10,
              fontWeight: 'bold',
            }}>
            At work for : 4 years, 1 month, 20 Day
          </Text>
          <FlatList
            style={{ alignSelf: 'center' }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={showData}
            renderItem={renderServicesList}
            keyExtractor={item => item.id}
          />
          {/* This is bank details */}
          <View
            style={{
              alignSelf: 'center',
              marginTop: responsiveHeight(1),
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: expandedbank == true ? 0 : 10,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
            }}>
            <View
              style={{
                marginBottom: expandedbank == true ? 0 : 8,
                borderWidth: 1,
                borderColor: '#00f0ff',
                width: '95%',
                backgroundColor: '#fff',
                opacity: 1,
                elevation: 10,
                borderTopLeftRadius: 50,
                borderBottomLeftRadius: expandedbank == true ? 0 : 50,
                borderTopRightRadius: 50,
                borderBottomRightRadius: expandedbank == true ? 0 : 50,
                padding: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{ color: '#000', fontSize: responsiveFontSize(2.3) }}>
                Bank Details
              </Text>
              <TouchableOpacity onPress={() => toggleExpandedBank()}>
                {expandedbank ? (
                  <Image
                    style={{ height: 30, width: 30, resizeMode: 'contain' }}
                    source={require('../../assets/HomeScreen/up.png')}
                  />
                ) : (
                  <>
                    <Image
                      style={{ height: 30, width: 30, resizeMode: 'contain' }}
                      source={require('../../assets/HomeScreen/down.png')}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>
            {expandedbank ? (
              <View
                style={{
                  marginBottom: expandedbank == true ? 8 : 0,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}>
                <View
                  style={{
                    borderTopWidth: expandedbank == true ? 0 : 2,
                    borderWidth: 1,
                    borderColor: '#00f0ff',
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }}>
                  <>
                    <View style={styles.card}>
                      <View style={styles.content}>
                        <Text style={styles.title}>A/C Holder</Text>
                        <Text style={styles.title}>
                          {bankdetailsdata?.account_name ? bankdetailsdata?.account_name : 'N/A'}
                        </Text>
                      </View>
                      <View style={styles.content}>
                        <Text style={styles.title}>A/C Number</Text>
                        <Text style={styles.title}>
                          {bankdetailsdata?.account_number ? bankdetailsdata?.account_number : 'N/A'}
                        </Text>
                      </View>
                      <View style={styles.content}>
                        <Text style={styles.title}>Bank Name</Text>
                        <Text style={styles.title}>
                          {bankdetailsdata?.bank_name ? bankdetailsdata?.bank_name : 'N/A'}
                        </Text>
                      </View>
                      <View style={styles.content}>
                        <Text style={styles.title}>IFSC/RTGS Code</Text>
                        <Text style={styles.title}>
                          {bankdetailsdata?.ifsc_code ? bankdetailsdata?.ifsc_code : 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </>
                </View>
              </View>
            ) : null}
          </View>

          {/* This is company details */}
          <View
            style={{
              alignSelf: 'center',
              marginTop: responsiveHeight(1),
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: expandedassets == true ? 0 : 10,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
            }}>
            <View
              style={{
                marginBottom: expandedassets == true ? 0 : 8,
                borderWidth: 1,
                borderColor: '#00f0ff',
                width: '95%',
                backgroundColor: '#fff',
                opacity: 1,
                elevation: 10,
                borderTopLeftRadius: 50,
                borderBottomLeftRadius: expandedassets == true ? 0 : 50,
                borderTopRightRadius: 50,
                borderBottomRightRadius: expandedassets == true ? 0 : 50,
                padding: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{ color: '#000', fontSize: responsiveFontSize(2.3) }}>
                Assets
              </Text>
              <TouchableOpacity onPress={toggleExpandedAssets}>
                {expandedassets ? (
                  <Image
                    style={{ height: 30, width: 30, resizeMode: 'contain' }}
                    source={require('../../assets/HomeScreen/up.png')}
                  />
                ) : (
                  <>
                    <Image
                      style={{ height: 30, width: 30, resizeMode: 'contain' }}
                      source={require('../../assets/HomeScreen/down.png')}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>
            {expandedassets ? (
              <View
                style={{
                  marginBottom: expandedassets == true ? 8 : 0,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}>
                <View
                  style={{
                    borderTopWidth: expandedassets == true ? 0 : 2,
                    borderWidth: 1,
                    borderColor: '#00f0ff',
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }}>
                  <>
                    {
                      getAssetsApiData?.map((elements, index) => {
                        return (
                          <View key={index} style={styles.card}>
                            <View style={styles.content}>
                              <Text style={styles.title}>Assigned Date</Text>
                              <Text style={styles.title}>
                                {elements?.assigned_date ? elements?.assigned_date : 'N/A'}
                              </Text>
                            </View>
                            <View style={styles.content}>
                              <Text style={styles.title}>Returned Date</Text>
                              <Text style={styles.title}>
                                {elements?.returned_date ? elements?.returned_date : 'N/A'}
                              </Text>
                            </View>
                            <View style={styles.content}>
                              <Text style={styles.title}>Comment</Text>
                              <Text style={styles.title}>
                                {elements?.comment ? elements?.comment : 'N/A'}
                              </Text>
                            </View>
                          </View>
                        )
                      })
                    }
                  </>
                </View>
              </View>
            ) : null}
          </View>

          {/* This is Address details */}
          <View
            style={{
              marginBottom: responsiveHeight(20),
              alignSelf: 'center',
              marginTop: responsiveHeight(1),
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: expandeddocuments == true ? 0 : 10,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
            }}>
            <View
              style={{
                marginBottom: expandeddocuments == true ? 0 : 8,
                borderWidth: 1,
                borderColor: '#00f0ff',
                width: '95%',
                backgroundColor: '#fff',
                opacity: 1,
                elevation: 10,
                borderTopLeftRadius: 50,
                borderBottomLeftRadius: expandeddocuments == true ? 0 : 50,
                borderTopRightRadius: 50,
                borderBottomRightRadius: expandeddocuments == true ? 0 : 50,
                padding: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{ color: '#000', fontSize: responsiveFontSize(2.3) }}>
                Documents
              </Text>
              <TouchableOpacity onPress={toggleExpandedDocuments}>
                {expandeddocuments ? (
                  <Image
                    style={{ height: 30, width: 30, resizeMode: 'contain' }}
                    source={require('../../assets/HomeScreen/up.png')}
                  />
                ) : (
                  <>
                    <Image
                      style={{ height: 30, width: 30, resizeMode: 'contain' }}
                      source={require('../../assets/HomeScreen/down.png')}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>
            {expandeddocuments ? (
              <View
                style={{
                  marginBottom: expandeddocuments == true ? 8 : 0,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}>
                <View
                  style={{
                    borderTopWidth: expandeddocuments == true ? 0 : 2,
                    borderWidth: 1,
                    borderColor: '#00f0ff',
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }}>
                  <>
                    {
                      documentdetailsdata?.map((elements, index) => {

                        let fileURL = elements?.document;
                        console.log(fileURL, 'fileURL')
                        let fileName = elements?.document_types?.name
                        let fileExtension = fileURL.split(".").pop();

                        return (
                          <View key={index} style={styles.card}>
                            <View style={styles.content}>
                              <Text style={styles.title}>{fileName}</Text>
                              <Text style={styles.description}>{fileExtension}</Text>
                              <TouchableOpacity onPress={() => historyDownload(fileURL)}
                              >
                                <Text style={[styles.description, styles.downloadtxt]}>Download</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )
                      })
                    }
                  </>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Account;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E64',
  },

  name: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tinyLogo: {
    width: 70,
    height: 70,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  downloadtxt: {
    color: "blue",
    fontWeight: "bold"
  },
  options: {
    width: 65,
    height: 65,
  },
  skill: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderStyle: 'dashed',
    borderRadius: 5,
    backgroundColor: '#d3e3fd30',
    borderColor: '#0c57d0',
  },
  heading: { fontWeight: '500', fontSize: 15 },
  heading_grey: { fontSize: 14, color: 'grey', fontWeight: '300' },
  add_txt: { fontSize: 14, color: '#efad37', fontWeight: '600' },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    marginTop: 5,
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: 'grey',
  },
  heading_modal: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
    color: 'blue',
  },
  btnStyle: {
    width: '40%',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  input_title: { marginBottom: 3, fontSize: 14, fontWeight: '500' },
  input_top_margin: { marginTop: 15 },
  input: {
    height: 45,
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20,
    marginHorizontal: 50,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginBottom: 25,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 45,
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,

    // width: '80%',
  },
  bottomsheetTxt: { fontSize: 17 },
  bottomsheetLogo: { fontSize: 22, marginRight: 15 },
  bottomsheetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    borderRadius: 15,
    shadowRadius: 4,
    backgroundColor: '#fff',
    elevation: 7,
    borderWidth: 1,
    borderColor: '#e2ddfe',
    width: responsiveWidth(95),
    height: responsiveHeight(75),
  },
  modalView1: {
    borderRadius: 15,
    shadowRadius: 4,
    backgroundColor: '#fff',
    elevation: 7,
    borderWidth: 1,
    borderColor: '#e2ddfe',
    width: responsiveWidth(55),
    height: responsiveHeight(25),
  },
  takepic: {
    width: 160,
    height: 40,
    backgroundColor: '#75CFC5',
    opacity: 3,
    elevation: 2,
    justifyContent: 'center',
    borderRadius: 8,
  },
  takepictext: {
    fontSize: 13,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  takepic1: {
    width: 160,
    height: 40,
    backgroundColor: '#75CFC5',
    opacity: 3,
    elevation: 2,
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  locationText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: 'red',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    margin: 10,
    overflow: 'hidden', justifyContent:"space-between"
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 0, 
    color:Themes == 'dark' ? '#000' : '#000'
  },
  description: {
    fontSize: 14,
    color: '#000',
  },
});
