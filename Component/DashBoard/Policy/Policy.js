// import {
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   ImageBackground,
//   TouchableOpacity,
//   ScrollView,
//   FlatList,
// } from 'react-native';
// import React, {useState, useEffect, useContext} from 'react';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {NavigationContainer} from '@react-navigation/native';
// import {getNews} from '../../../APINetwork/ComponentApi';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {BASE_URL} from '../../../utils';
// import {showMessage} from 'react-native-flash-message';
// import Reload from '../../../Reload';
// import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';
// import {useNavigation} from '@react-navigation/native';
// import PullToRefresh from '../../../PullToRefresh';
// const Policy = () => {
//   const navigation = useNavigation();
//   const [getNewsApiData, setGetNewsApiData] = useState('');
//   const {currentTheme} = useContext(ThemeContext);
//   const [loader, setLoader] = useState(false);
//   async function check() {
//     try {
//       setLoader(true);
//       let token = await AsyncStorage.getItem('TOKEN');
//       const url = `${BASE_URL}/policy/list`;
//       const response = await getNews(url, token);

//       if (response?.data?.status === true) {
//         // showMessage({
//         //   message: `${response?.data?.message}`,
//         //   type: 'success',
//         // });

//         setGetNewsApiData(response?.data?.data);

//         setLoader(false);
//       } else {
//         setLoader(false);
//       }
//     } catch (error) {
//       console.error('Error making POST request:', error);
//       setLoader(false);
//     }
//   }
//   useEffect(() => {
//     check();
//   }, []);
//   const image = {uri: 'https://i.postimg.cc/zf8d0r7t/nodata-1.png'};
//   return (
//     <SafeAreaView
//       style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
        
//       <View
//         style={{
//           marginTop: 15,
//         }}>
//         <View
//           style={[
//             styles.headerContainer,
//             {backgroundColor: currentTheme.background_v2},
//           ]}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}>
//             <Ionicons name="arrow-back" size={24} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.title}>Policy</Text>
//         </View>
//         <View
//           style={{
//             backgroundColor: currentTheme.background,
//             borderTopLeftRadius: 40,
//             borderTopRightRadius: 40,
//             height: '100%',
//           }}>
//           {loader ? (
//             <Reload />
//           ) : (
//                <View style={{margin: 20}}>
//                   <FlatList
//                     data={getNewsApiData}
//                     keyExtractor={index => index.toString()}
//                     ListEmptyComponent={
//                       <View>
//                         <Image
//                           source={{
//                             uri: 'https://static.vecteezy.com/system/resources/thumbnails/013/927/147/small_2x/adaptive-interface-design-illustration-concept-on-white-background-vector.jpg',
//                           }}
//                           style={{padding: 20, height: 250}}
//                         />
//                         <Text
//                           style={{
//                             fontSize: 18,
//                             color: '#000',
//                             fontWeight: '500',
//                             textAlign: 'center',
//                           }}>
//                           Data Not Found
//                         </Text>
//                       </View>
//                     }
//                     renderItem={({item, index}) => {
//                       return (
//                         <View
//                           key={index}
//                           style={{
//                             marginTop: 8,
//                             marginBottom: responsiveHeight(2.5),
//                             elevation: 7,
//                             opacity: 1,
//                             borderRadius: 10,
//                             backgroundColor: currentTheme.news_background_v2,
//                             borderWidth: 0.5,
//                             borderColor: currentTheme.text,
//                           }}>
//                           <View style={{flexDirection: 'row'}}>
//                             <View
//                               style={{
//                                 alignSelf: 'flex-start',
//                                 borderTopLeftRadius: 10,
//                                 borderBottomLeftRadius: 10,
//                               }}>
//                               <Image
//                                 style={{
//                                   height: responsiveHeight(15),
//                                   width: responsiveWidth(30),
//                                   borderWidth:0.5,
//                                   resizeMode:'cover'
//                                 }}
//                                 source={{uri: item?.image}}
//                               />
//                             </View>
//                             <View
//                               style={{
//                                 height: 130,
//                                 width: '60%',
//                                 marginHorizontal: 15,
//                                 justifyContent: 'center',
//                                 alignSelf: 'flex-end',
//                               }}>
//                               <View
//                                 style={{
//                                   flexDirection: 'row',
//                                   justifyContent: 'space-between',
//                                   marginVertical: 5,
//                                   alignItems: 'center',
//                                   marginTop: 25,
                                 
//                                 }}>
//                                 <TouchableOpacity
//                                   onPress={() =>
//                                     navigation.navigate('PolicyDetails', {
//                                       newsId: item?.id,
//                                     })
//                                   }
//                                   style={{
//                                     backgroundColor:
//                                       currentTheme.news_background,
//                                     borderRadius: 10,
//                                     width: 100,
//                                   }}>
//                                   <Text
//                                     style={{
//                                       color: '#fff',
//                                       padding: 8,
//                                       textAlign: 'center',
//                                     }}>
//                                     Read more
//                                   </Text>
//                                 </TouchableOpacity>
//                                 <Text
//                                   style={{
//                                     marginRight: 10,
//                                     color: currentTheme.newsText,
//                                     fontSize: 16,
//                                   }}>
//                                   {item?.date}
//                                 </Text>
//                               </View>
//                             </View>
//                           </View>
//                           <View
//                             style={{
//                               marginTop: -17,
//                               backgroundColor: '#F1416C',
//                               borderTopRightRadius: 30,
//                               borderBottomLeftRadius: 30,
//                               padding: 10,
//                               width: '50%',
//                               alignSelf: 'flex-end',
//                               marginRight: 0,
//                               position: 'absolute',
//                             }}>
//                             <Text
//                               style={{
//                                 fontSize: 15,
//                                 color: '#fff',
//                                 fontWeight: 'bold',
//                                 textAlign: 'center',
//                               }}>
//                               {item?.policy_Category}
//                             </Text>
//                           </View>
//                         </View>
//                       );
//                     }}
//                   />
                 
//                 </View>
//           )}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };
// export default Policy;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0E0E64',
//   },

//   name: {
//     color: '#fff',
//     fontSize: responsiveFontSize(3),
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: responsiveHeight(3),
//   },
//   textContainer: {
//     alignSelf: 'center',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   text: {
//     color: '#000',
//     fontSize: 18,
//     textAlign: 'center',
//     marginTop: responsiveHeight(50),
//   },
//   container_imagebackground: {
//     flex: 1,
//   },
//   image: {
//     flex: 1,
//     height: responsiveHeight(65),
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#f8f8f8', // Change as per design
//   },
//   backButton: {
//     marginRight: 16,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
// });
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
import PullToRefresh from '../../../PullToRefresh';

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

  // ✅ Default fallback image for policy items
  const getDefaultPolicyImage = (policyCategory) => {
    const defaultImages = {
      'Attendance Policy': 'https://img.freepik.com/free-vector/employee-attendance-concept-illustration_114360-2659.jpg',
      'Leave Policy': 'https://img.freepik.com/free-vector/leave-application-concept-illustration_114360-8803.jpg',
      'Work From Home Policy': 'https://img.freepik.com/free-vector/work-from-home-concept-illustration_114360-1075.jpg',
      'General': 'https://img.freepik.com/free-vector/company-policy-concept-illustration_114360-8926.jpg',
      default: 'https://img.freepik.com/free-vector/policy-concept-illustration_114360-8925.jpg'
    };
    return defaultImages[policyCategory] || defaultImages.default;
  };

  const image = {uri: 'https://i.postimg.cc/zf8d0r7t/nodata-1.png'};

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
      <View style={{marginTop: 15}}>
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
            <View style={{margin: 20}}>
              <FlatList
                data={getNewsApiData}
                keyExtractor={(item, index) => `policy-${index}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 100}}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Image
                      source={{
                        uri: 'https://static.vecteezy.com/system/resources/thumbnails/013/927/147/small_2x/adaptive-interface-design-illustration-concept-on-white-background-vector.jpg',
                      }}
                      style={styles.emptyImage}
                    />
                    <Text style={[styles.emptyText, {color: currentTheme.text}]}>
                      No Policies Found
                    </Text>
                  </View>
                }
                renderItem={({item, index}) => {
                  return (
                    <View key={index} style={[styles.policyCard, {
                      backgroundColor: currentTheme.news_background_v2,
                      borderColor: currentTheme.text,
                    }]}>
                      {/* ✅ Image Container with better styling */}
                      <View style={styles.imageContainer}>
                        <Image
                          style={styles.policyImage}
                          source={{
                            uri: item?.image || getDefaultPolicyImage(item?.policy_Category)
                          }}
                          resizeMode="cover"
                          // ✅ Add fallback for broken images
                          onError={() => {
                            console.log('Image failed to load, using default');
                          }}
                        />
                        {/* ✅ Image overlay for better text visibility */}
                        <View style={styles.imageOverlay} />
                      </View>

                      {/* ✅ Content Container */}
                      <View style={styles.contentContainer}>
                        {/* ✅ Policy Category Badge */}
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryText}>
                            {item?.policy_Category || 'General Policy'}
                          </Text>
                        </View>

                        {/* ✅ Action Row */}
                        <View style={styles.actionRow}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('PolicyDetails', {
                                newsId: item?.id,
                              })
                            }
                            style={[styles.readMoreButton, {
                              backgroundColor: currentTheme.news_background,
                            }]}>
                            <Text style={styles.readMoreText}>Read more</Text>
                          </TouchableOpacity>
                          
                          <Text style={[styles.dateText, {
                            color: currentTheme.newsText,
                          }]}>
                            {item?.date || 'No Date'}
                          </Text>
                        </View>
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

export default Policy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E64',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  // ✅ Empty State Styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyImage: {
    width: responsiveWidth(60),
    height: responsiveHeight(25),
    resizeMode: 'contain',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 20,
  },

  // ✅ Policy Card Styles
  policyCard: {
    marginBottom: responsiveHeight(2.5),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderRadius: 15,
    borderWidth: 0.5,
    overflow: 'hidden', // ✅ Important for proper image clipping
    position: 'relative',
  },

  // ✅ Image Container Styles
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: responsiveHeight(15),
  },
  policyImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5', // ✅ Fallback background color
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)', // ✅ Subtle overlay for better contrast
  },

  // ✅ Content Container Styles
  contentContainer: {
    padding: 15,
    position: 'relative',
  },

  // ✅ Category Badge Styles
  categoryBadge: {
    position: 'absolute',
    top: -25, // ✅ Overlaps with image
    right: 0,
    backgroundColor: '#F1416C',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 20,
    minWidth: responsiveWidth(35),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // ✅ Action Row Styles
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  readMoreButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  readMoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // ✅ Legacy styles (keeping for compatibility)
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
