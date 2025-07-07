import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Linking,
  Switch,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  DrawerActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {BASE_URL} from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getProfile} from '../../APINetwork/ComponentApi';
import RNFetchBlob from 'rn-fetch-blob';
import AccountSkeleton from '../Skeleton/AccountSkeleton';
import Themes from '../Theme/Theme';
import {ThemeContext} from '../../Store/ConetxtApi.jsx/ConextApi';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
const Account = () => {
  const {currentTheme, liveLocationActive} = useContext(ThemeContext);
  const IsFouced = useIsFocused();
  const showData = [
    {
      id: 1,
      uri: require('../../assets/HomeScreen/calendar.png'),
      name: 'Attendance',

      backgroundcolor: '#BAAEFC',
      nav: 'Attendances',
    },
    {
      id: 2,
      uri: require('../../assets/HomeScreen/leave.png'),
      name: 'Leave',

      backgroundcolor: '#F9B7D5',
      nav: 'Leaves',
    },
    {
      id: 3,
      uri: require('../../assets/Shift.png'),
      name: 'Shift',

      backgroundcolor: '#44D5FB',
      nav: 'Shift',
    },
    {
      id: 4,
      uri: require('../../assets/HomeScreen/medal.png'),
      name: 'Award',

      backgroundcolor: '#F9B7D5',
      nav: 'Reward',
    },
  ];
  const [getProfileApiData, setGetProfileApiData] = useState('');
  const [getAssetsApiData, setGetAssetsApiData] = useState('');
  const [loader, setLoader] = useState(false);
  const navigation = useNavigation();
  const renderServicesList = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.nav)}
      style={{
        justifyContent: 'center',
        backgroundColor: item.backgroundcolor,
        width: responsiveWidth(28),
        height: responsiveHeight(15),
        marginHorizontal: 5,
        borderRadius: 20,
      }}>
      <View style={{padding: 10, alignItems: 'center'}}>
        <Image
          style={{height: 50, width: 50, marginBottom: 2}}
          source={item.uri}
        />
        <Text
          numberOfLines={1}
          style={{marginBottom: 2, fontSize: 16, color: currentTheme.text}}>
          {item.name}
        </Text>
        <Text style={{fontSize: 16, color: currentTheme.text}}>{item.num}</Text>
      </View>
    </TouchableOpacity>
  );
  const [expandedbank, setExpandedBank] = useState(false);
  const [expandedassets, setExpandedAssets] = useState(false);
  const [expandeddocuments, setExpandedDocuments] = useState(false);
  const [bankdetailsdata, setBankDetailsData] = useState('');
  const [documentdetailsdata, setGetDocumentApiData] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = async () => {
    setIsEnabled(previous => !previous);
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      console.log(token);
      let config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/toggle-location-tracking`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.request(config);
      console.log(response.data.message);
      if (response.data.status) {
        showMessage({message: response.data.message, type: 'success'});
      } else {
        setIsEnabled(isEnabled);
        showMessage({message: response.data.message, type: 'danger'});
      }
    } catch (error) {
      console.log(error);
    }
  };
  const toggleExpandedBank = () => {
    setExpandedBank(!expandedbank);
  };
  const toggleExpandedAssets = () => {
    setExpandedAssets(!expandedassets);
  };
  const toggleExpandedDocuments = () => {
    setExpandedDocuments(!expandeddocuments);
  };
  async function check() {
    try {
      setLoader(true);
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/profile/details`;
      const response = await getProfile(url, token);

      if (response?.data?.status === true) {
        setGetProfileApiData(response?.data?.data);
        setBankDetailsData(response?.data?.data?.bank_details);
        setGetDocumentApiData(response?.data?.data?.document_details);
        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.log('Error making POST request:', error);
      setLoader(false);
    }
  }
  async function AssetsList() {
    try {
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/assets`;
      const response = await getProfile(url, token);

      if (response?.data?.status === true) {
        setGetAssetsApiData(response?.data?.data);
        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.log('Error making POST request:', error);
      setLoader(false);
    }
  }
  useEffect(() => {
    if (liveLocationActive === 0) {
      setIsEnabled(false);
    } else {
      setIsEnabled(true);
    }
  }, [liveLocationActive]);

  useEffect(() => {
    check();
    AssetsList();
  }, [IsFouced]);
  if (loader) {
    return <AccountSkeleton />;
  }
  function calculateWorkDuration(joiningDateStr) {
    const startDate = new Date(joiningDateStr);
    const endDate = new Date();
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();
    if (days < 0) {
      months--;
      const previousMonth = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        0,
      );
      days += previousMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return `At work for: ${years} year${
      years !== 1 ? 's' : ''
    }, ${months} month${months !== 1 ? 's' : ''}, ${days} day${
      days !== 1 ? 's' : ''
    }`;
  }
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginTop: 15,
          }}>
          <View style={{marginTop: 10, alignSelf: 'center'}}>
            {getProfileApiData?.details?.profile_image == '' ||
            getProfileApiData?.details?.profile_image == [] ||
            getProfileApiData?.details?.profile_image == null ? (
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
            ) : (
              <Image
                style={{
                  height: 90,
                  width: 90,
                  marginVertical: 5,
                  borderRadius: 50,
                  alignSelf: 'center',
                }}
                source={{uri: getProfileApiData?.details?.profile_image}}
              />
            )}
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Text style={styles.name}>Profile</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.dispatch(DrawerActions.openDrawer('MyDrawer'))
                }
                style={{marginLeft: 5}}>
                <FontAwesome style={{}} name="edit" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{getProfileApiData?.name}</Text>
            {/* <Text style={styles.name}>{getProfileApiData?.details?.phone}</Text>
            <Text style={styles.name}>{getProfileApiData?.email}</Text> */}
          </View>
        </View>

        <View
          style={{
            marginBottom: responsiveHeight(10),
            backgroundColor: currentTheme.background,
            borderTopLeftRadius: 40,
            marginTop: responsiveHeight(3),
            borderTopRightRadius: 40,
          }}>
          <Text
            style={{
              fontSize: 15,
              color: currentTheme.text,
              alignSelf: 'center',
              marginVertical: 10,
              fontWeight: 'bold',
            }}>
            {calculateWorkDuration(getProfileApiData?.details?.joining_date)}
          </Text>
          <FlatList
            style={{alignSelf: 'center'}}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={showData}
            renderItem={renderServicesList}
            keyExtractor={item => item.id}
          />
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
                borderColor: currentTheme.background_v2,
                width: '95%',
                backgroundColor: currentTheme.background,
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
              <Text
                style={{
                  color: currentTheme.text,
                  fontSize: responsiveFontSize(2.3),
                }}>
                Location Tracking
              </Text>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
            <View
              style={{
                marginBottom: expandedbank == true ? 0 : 8,
                borderWidth: 1,
                borderColor: currentTheme.background_v2,
                width: '95%',
                backgroundColor: currentTheme.background,
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
              <Text
                style={{
                  color: currentTheme.text,
                  fontSize: responsiveFontSize(2.3),
                }}>
                Bank Details
              </Text>
              <TouchableOpacity onPress={() => toggleExpandedBank()}>
                {expandedbank ? (
                  <Image
                    style={{
                      height: 30,
                      width: 30,
                      resizeMode: 'contain',
                      tintColor: currentTheme.text,
                    }}
                    source={require('../../assets/HomeScreen/up.png')}
                  />
                ) : (
                  <>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        resizeMode: 'contain',
                        tintColor: currentTheme.text,
                      }}
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
                    borderColor: currentTheme.background_v2,
                    backgroundColor: currentTheme.background,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }}>
                  <>
                    <View
                      style={[
                        styles.card,
                        {
                          borderColor: currentTheme.background_v2,
                          backgroundColor: currentTheme.background,
                          borderWidth: 0.5,
                        },
                      ]}>
                      <View style={styles.content}>
                        <Text
                          style={[styles.title, {color: currentTheme.text}]}>
                          A/C Holder
                        </Text>
                        <Text
                          style={[styles.title, {color: currentTheme.text}]}>
                          {bankdetailsdata?.account_name
                            ? bankdetailsdata?.account_name
                            : 'N/A'}
                        </Text>
                      </View>
                      <View style={styles.content}>
                        <Text
                          style={[styles.title, {color: currentTheme.text}]}>
                          A/C Number
                        </Text>
                        <Text
                          style={[styles.title, {color: currentTheme.text}]}>
                          {bankdetailsdata?.account_number
                            ? bankdetailsdata?.account_number
                            : 'N/A'}
                        </Text>
                      </View>
                      <View style={styles.content}>
                        <Text
                          style={[styles.title, {color: currentTheme.text}]}>
                          Bank Name
                        </Text>
                        <Text
                          style={[styles.title, {color: currentTheme.text}]}>
                          {bankdetailsdata?.bank_name
                            ? bankdetailsdata?.bank_name
                            : 'N/A'}
                        </Text>
                      </View>
                      <View style={styles.content}>
                        <Text
                          style={[styles.title, {color: currentTheme.text}]}>
                          IFSC/RTGS Code
                        </Text>
                        <Text
                          style={[styles.title, {color: currentTheme.text}]}>
                          {bankdetailsdata?.ifsc_code
                            ? bankdetailsdata?.ifsc_code
                            : 'N/A'}
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
                borderColor: currentTheme.background_v2,
                width: '95%',
                backgroundColor: currentTheme.background,
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
              <Text
                style={{
                  color: currentTheme.text,
                  fontSize: responsiveFontSize(2.3),
                }}>
                Assets
              </Text>
              <TouchableOpacity onPress={toggleExpandedAssets}>
                {expandedassets ? (
                  <Image
                    style={{
                      height: 30,
                      width: 30,
                      resizeMode: 'contain',
                      tintColor: currentTheme.text,
                    }}
                    source={require('../../assets/HomeScreen/up.png')}
                  />
                ) : (
                  <>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        resizeMode: 'contain',
                        tintColor: currentTheme.text,
                      }}
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
                    borderColor: currentTheme.background_v2,
                    backgroundColor: currentTheme.background,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }}>
                  {getAssetsApiData && getAssetsApiData.length > 0 ? (
                    getAssetsApiData.map((elements, index) => (
                      <View
                        key={index}
                        style={[
                          styles.card,
                          {
                            backgroundColor: currentTheme.background,
                            borderWidth: 0.5,
                            borderColor: currentTheme.background_v2,
                          },
                        ]}>
                        <View style={styles.content}>
                          <Text
                            style={[styles.title, {color: currentTheme.text}]}>
                            Assigned Date
                          </Text>
                          <Text
                            style={[styles.title, {color: currentTheme.text}]}>
                            {elements?.assigned_date || 'N/A'}
                          </Text>
                        </View>
                        <View style={styles.content}>
                          <Text
                            style={[styles.title, {color: currentTheme.text}]}>
                            Returned Date
                          </Text>
                          <Text
                            style={[styles.title, {color: currentTheme.text}]}>
                            {elements?.returned_date || 'N/A'}
                          </Text>
                        </View>
                        <View style={styles.content}>
                          <Text
                            style={[styles.title, {color: currentTheme.text}]}>
                            Comment
                          </Text>
                          <Text
                            style={[styles.title, {color: currentTheme.text}]}>
                            {elements?.comment || 'N/A'}
                          </Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={{padding: 16, alignItems: 'center'}}>
                      <Text style={{color: currentTheme.text, fontSize: 14}}>
                        No Data Found
                      </Text>
                    </View>
                  )}
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
                borderColor: currentTheme.background_v2,
                width: '95%',
                backgroundColor: currentTheme.background,
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
              <Text
                style={{
                  color: currentTheme.text,
                  fontSize: responsiveFontSize(2.3),
                }}>
                Documents
              </Text>
              <TouchableOpacity onPress={toggleExpandedDocuments}>
                {expandeddocuments ? (
                  <Image
                    style={{
                      height: 30,
                      width: 30,
                      resizeMode: 'contain',
                      tintColor: currentTheme.text,
                    }}
                    source={require('../../assets/HomeScreen/up.png')}
                  />
                ) : (
                  <>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        resizeMode: 'contain',
                        tintColor: currentTheme.text,
                      }}
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
                    borderColor: currentTheme.background_v2,
                    backgroundColor: currentTheme.background,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }}>
                  {documentdetailsdata && documentdetailsdata.length > 0 ? (
                    documentdetailsdata.map((elements, index) => {
                      let fileURL = elements?.document;
                      let fileName = elements?.document_types?.name;
                      let fileExtension = fileURL?.split('.').pop();

                      return (
                        <View
                          key={index}
                          style={[
                            styles.card,
                            {
                              backgroundColor: currentTheme.background,
                              borderWidth: 0.5,
                              borderColor: currentTheme.background_v2,
                            },
                          ]}>
                          <View style={styles.content}>
                            <Text
                              style={[
                                styles.title,
                                {color: currentTheme.text},
                              ]}>
                              {fileName || 'Unknown Document'}
                            </Text>
                            <Text
                              style={[
                                styles.description,
                                {color: currentTheme.text},
                              ]}>
                              {fileExtension || 'Unknown'}
                            </Text>
                            {fileURL ? (
                              <TouchableOpacity
                                onPress={() => Linking.openURL(fileURL)}>
                                <Text
                                  style={[
                                    styles.description,
                                    styles.downloadtxt,
                                  ]}>
                                  Download
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <Text
                                style={[
                                  styles.description,
                                  {color: currentTheme.text},
                                ]}>
                                No file URL available
                              </Text>
                            )}
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <View style={{padding: 16, alignItems: 'center'}}>
                      <Text style={{color: currentTheme.text, fontSize: 14}}>
                        No Documents Found
                      </Text>
                    </View>
                  )}
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
    color: 'blue',
    fontWeight: 'bold',
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
  heading: {fontWeight: '500', fontSize: 15},
  heading_grey: {fontSize: 14, color: 'grey', fontWeight: '300'},
  add_txt: {fontSize: 14, color: '#efad37', fontWeight: '600'},
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
  input_title: {marginBottom: 3, fontSize: 14, fontWeight: '500'},
  input_top_margin: {marginTop: 15},
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
  bottomsheetTxt: {fontSize: 17},
  bottomsheetLogo: {fontSize: 22, marginRight: 15},
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    margin: 10,
    overflow: 'hidden',
    justifyContent: 'space-between',
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
    color: Themes == 'dark' ? '#000' : '#000',
  },
  description: {
    fontSize: 14,
    color: '#000',
  },
});
