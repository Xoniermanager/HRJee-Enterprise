import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {NavigationContainer} from '@react-navigation/native';
import {getNews} from '../../../APINetwork/ComponentApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../utils';
import {showMessage} from 'react-native-flash-message';
import {useRoute} from '@react-navigation/native';
import Reload from '../../../Reload';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';

const NewsDetails = ({navigation}) => {
  const {currentTheme} = useContext(ThemeContext);
  const [getNewsApiData, setGetNewsApiData] = useState('');
  const [loader, setLoader] = useState(false);
  const route = useRoute();
  const id = route?.params?.newsId;
  async function check() {
    try {
      setLoader(true);
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/news/view-details/${id}`;
      const response = await getNews(url, token);

      if (response?.data?.status === true) {
      
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
        <ScrollView
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
                    {/* <Text style={styles.text}>No Data Available</Text> */}
                  </ImageBackground>
                </View>
              ) : (
                <>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: currentTheme.text,
                      borderTopLeftRadius: 40,
                      borderTopRightRadius: 40,
                      height: 200,
                      width: '100%',
                    }}>
                    <View
                      style={{
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                      }}>
                      <Image
                        style={{
                          height: 198,
                          width: '100%',
                          resizeMode: 'contain',
                        }}
                        source={{uri: getNewsApiData?.image}}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      marginTop: -20,
                      backgroundColor: '#F1416C',
                      borderTopRightRadius: 30,
                      borderBottomLeftRadius: 30,
                      padding: 10,
                      width: '50%',
                      alignSelf: 'flex-end',
                      marginRight: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: currentTheme.text,
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}>
                      {getNewsApiData?.news_Category}
                    </Text>
                  </View>
                  <View style={{margin: 20}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: currentTheme.text,
                        marginBottom: 10,
                      }}>
                      {getNewsApiData?.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: currentTheme.text,
                        marginBottom: 65,
                      }}>
                      {getNewsApiData?.description?.replace(/<[^>]+>/g, '') ==
                      null
                        ? 'There are no available description'
                        : getNewsApiData?.description?.replace(/<[^>]+>/g, '')}
                    </Text>
                  </View>
                </>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default NewsDetails;
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
});
