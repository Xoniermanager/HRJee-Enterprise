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
import {NavigationContainer} from '@react-navigation/native';
import {getNews} from '../../../APINetwork/ComponentApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../utils';
import {showMessage} from 'react-native-flash-message';
import Reload from '../../../Reload';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';
const News = ({navigation}) => {
  const {currentTheme} = useContext(ThemeContext);
  const [getNewsApiData, setGetNewsApiData] = useState('');
  const [loader, setLoader] = useState(false);
  async function check() {
    try {
      setLoader(true);
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/news/list`;
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
        {/* <Text style={styles.name}>News</Text> */}
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
            <View style={{margin: 20}}>
            <FlatList
        data={getNewsApiData}
        keyExtractor={(index) => index.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={{
                uri: 'https://static.vecteezy.com/system/resources/thumbnails/013/927/147/small_2x/adaptive-interface-design-illustration-concept-on-white-background-vector.jpg',
              }}
              style={styles.emptyImage}
            />
            <Text style={[styles.emptyText, {color: currentTheme.text}]}>
              No News Found
            </Text>
          </View>
        }
        renderItem={({item, index})=>{
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
                      width: responsiveWidth(30)
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
                      color:currentTheme.newsText,
                      width: '90%',
                      fontSize: 16,
                      marginTop:10
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
                        navigation.navigate('NewsDetails', {
                          newsId: item?.id,
                        })
                      }
                      style={{
                        backgroundColor:currentTheme.news_background,
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
                        color:currentTheme.newsText,
                        fontSize: 16,
                      }}>
                      {item?.date}
                    </Text>
                    
                  </View>
               
                </View>
               
              </View>
              <View
                style={{
                  marginTop:-17,
                  backgroundColor: '#F1416C',
                  borderTopRightRadius: 30,
                  borderBottomLeftRadius: 30,
                  padding: 10,
                  width: '50%',
                  alignSelf: 'flex-end',
                  marginRight: 0,
                  position:'absolute'
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {item?.news_Category}
                </Text>
              </View>
            </View>
          );
        }}
        />
        
      </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
export default News;
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: responsiveWidth(70),
    height: responsiveHeight(35),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 20,
  },
});

