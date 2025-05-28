import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationContainer} from '@react-navigation/native';
import {getNews} from '../../../APINetwork/ComponentApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../utils';
import {showMessage} from 'react-native-flash-message';
import Reload from '../../../Reload';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';
import {useNavigation} from '@react-navigation/native';
const Policy = () => {
  const navigation = useNavigation();
  const [getNewsApiData, setGetNewsApiData] = useState('');
  const {currentTheme} = useContext(ThemeContext);
  const [loader, setLoader] = useState(false);
  async function check() {
    try {
      setLoader(true);
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/policy/list`;
      const response = await getNews(url, token);

      if (response?.data?.status === true) {
        showMessage({
          message: `${response?.data?.message}`,
          type: 'success',
        });

        setGetNewsApiData(response?.data?.data);

        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.error('Error making POST request:', error);
      setLoader(false);
    }
  }
  useEffect(() => {
    check();
  }, []);
  const image = {uri: 'https://i.postimg.cc/zf8d0r7t/nodata-1.png'};
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
      <View
        style={{
          marginTop: 15,
        }}>
        <View
          style={[
            styles.headerContainer,
            {backgroundColor: currentTheme.background_v2},
          ]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Policy</Text>
        </View>
        <View
          style={{
            backgroundColor: currentTheme.background,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            height: '100%',
          }}>
          {loader ? (
            <Reload />
          ) : (
            <>
              {getNewsApiData == '' ||
              getNewsApiData == null ||
              getNewsApiData == [] ? (
                <View
                  style={[
                    styles.container_imagebackground,
                    {overflow: 'hidden', borderRadius: 20},
                  ]}>
                  <ImageBackground
                    source={image}
                    resizeMode="cover"
                    style={[styles.image, {borderRadius: 20}]}>
                    <View style={styles.textContainer}>
                      <Text style={[styles.text, {color: currentTheme.text}]}>
                        No Data Available
                      </Text>
                    </View>
                  </ImageBackground>
                </View>
              ) : (
                <View style={{margin: 20}}>
                  <FlatList
                    data={getNewsApiData}
                    keyExtractor={index => index.toString()}
                    renderItem={({item, index}) => {
                      return (
                        <View
                          key={index}
                          style={{
                            marginTop: 8,
                            marginBottom: responsiveHeight(2.5),
                            elevation: 7,
                            opacity: 1,
                            borderRadius: 10,
                            backgroundColor: currentTheme.news_background_v2,
                            borderWidth: 0.5,
                            borderColor: currentTheme.text,
                          }}>
                          <View style={{flexDirection: 'row'}}>
                            <View
                              style={{
                                alignSelf: 'flex-start',
                                borderTopLeftRadius: 10,
                                borderBottomLeftRadius: 10,
                              }}>
                              <Image
                                style={{
                                  height: responsiveHeight(15),
                                  width: responsiveWidth(30),
                                }}
                                source={{uri: item?.image}}
                              />
                            </View>
                            <View
                              style={{
                                height: 130,
                                width: '60%',
                                marginHorizontal: 15,
                                justifyContent: 'center',
                                alignSelf: 'flex-end',
                              }}>
                              <Text
                                style={{
                                  color: currentTheme.newsText,
                                  width: '90%',
                                  fontSize: 16,
                                  marginTop: 10,
                                }}>
                                {item?.title}
                              </Text>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginVertical: 5,
                                  alignItems: 'center',
                                }}>
                                <TouchableOpacity
                                  onPress={() =>
                                    navigation.navigate('PolicyDetails', {
                                      newsId: item?.id,
                                    })
                                  }
                                  style={{
                                    backgroundColor:
                                      currentTheme.news_background,
                                    borderRadius: 10,
                                    width: 100,
                                  }}>
                                  <Text
                                    style={{
                                      color: '#fff',
                                      padding: 8,
                                      textAlign: 'center',
                                    }}>
                                    Read more
                                  </Text>
                                </TouchableOpacity>
                                <Text
                                  style={{
                                    marginRight: 10,
                                    color: currentTheme.newsText,
                                    fontSize: 16,
                                  }}>
                                  {item?.date}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View
                            style={{
                              marginTop: -17,
                              backgroundColor: '#F1416C',
                              borderTopRightRadius: 30,
                              borderBottomLeftRadius: 30,
                              padding: 10,
                              width: '50%',
                              alignSelf: 'flex-end',
                              marginRight: 0,
                              position: 'absolute',
                            }}>
                            <Text
                              style={{
                                fontSize: 15,
                                color: '#fff',
                                fontWeight: 'bold',
                                textAlign: 'center',
                              }}>
                              {item?.policy_Category}
                            </Text>
                          </View>
                        </View>
                      );
                    }}
                  />
                 
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Policy;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E64',
  },

  name: {
    color: '#fff',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: responsiveHeight(3),
  },
  textContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    marginTop: responsiveHeight(50),
  },
  container_imagebackground: {
    flex: 1,
  },
  image: {
    flex: 1,
    height: responsiveHeight(65),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8', // Change as per design
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
