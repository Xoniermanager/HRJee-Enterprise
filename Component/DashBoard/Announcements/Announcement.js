// import {
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   ImageBackground,
//   TouchableOpacity,
// } from 'react-native';
// import React, {useState, useEffect, useContext} from 'react';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';
// import {getAnnouncement} from '../../../APINetwork/ComponentApi';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {BASE_URL} from '../../../utils';
// import Reload from '../../../Reload';
// import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';

// const Announcement = ({navigation}) => {
//   const {currentTheme} = useContext(ThemeContext);
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAnnouncements = async () => {
//       try {
//         const token = await AsyncStorage.getItem('TOKEN');
//         const url = `${BASE_URL}/announcements/list`;
//         const response = await getAnnouncement(url, token);
//         if (response?.data?.status === true) {
//           setAnnouncements(response.data.data || []);
//         }
//       } catch (error) {
//         console.error('Announcement fetch error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnnouncements();
//   }, []);

//   const renderItem = ({item}) => (
//     <TouchableOpacity
//     onPress={() => navigation.navigate('AnnouncementDetails', {newsId: item.id})}
//       style={[
//         styles.card,
//         {
//           backgroundColor: currentTheme.background_v2,
//           borderColor: currentTheme.text,
//         },
//       ]}>
//       <Image source={{uri: item.image}} style={styles.cardImage} />
//       <Text numberOfLines={2} style={[styles.cardTitle, {color:'#fff'}]}>
//         {item.title}
//       </Text>
      
//       <TouchableOpacity
//         onPress={() => navigation.navigate('AnnouncementDetails', {newsId: item.id})}
//         style={[styles.readMoreButton]}>
//         <Text style={styles.readMoreText}>Read more</Text>
//       </TouchableOpacity>
//     </TouchableOpacity>
//   );

//   const EmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <ImageBackground
//         source={{uri: 'https://i.postimg.cc/zf8d0r7t/nodata-1.png'}}
//         resizeMode="contain"
//         style={styles.emptyImage}>
//         <Text style={styles.emptyText}>No Data Available</Text>
//       </ImageBackground>
//     </View>
//   );

//   return (
//     <SafeAreaView style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
//       <Text style={styles.header}>Announcement</Text>
//       <View style={[styles.content, {backgroundColor: currentTheme.background}]}>
//         {loading ? (
//           <Reload />
//         ) : announcements.length === 0 ? (
//           <EmptyState />
//         ) : (
//           <FlatList
//             data={announcements}
//             renderItem={renderItem}
//             keyExtractor={item => item.id.toString()}
//             numColumns={2}
//             columnWrapperStyle={styles.row}
//             contentContainerStyle={styles.flatListContent}
//             showsVerticalScrollIndicator={false}
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Announcement;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     fontSize: responsiveFontSize(3),
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//     marginVertical: responsiveHeight(2),
//   },
//   content: {
//     flex: 1,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     padding: 16,
//   },
//   card: {
//     width: '48%',
//     borderRadius: 10,
//     // height: responsiveHeight(35),
//     borderWidth: 1,
//     overflow: 'hidden',
//     marginBottom: 16,
//   },
//   cardImage: {
//     height: responsiveHeight(20),
//     width: '100%',
//   },
//   cardTitle: {
//     fontSize: 14,
//     textAlign: 'center',
//     marginVertical: 8,
   
//   },
//   readMoreButton: {
//     paddingBottom:8,
//     alignItems: 'center',
//     // marginBottom:50
//   },
//   readMoreText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     textDecorationLine:'underline'
//   },
//   row: {
//     justifyContent: 'space-between',
//   },
//   flatListContent: {
//     paddingBottom: 100,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyImage: {
//     width: responsiveWidth(80),
//     height: responsiveHeight(40),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyText: {
//     marginTop: 20,
//     fontSize: 18,
//     color: '#000',
//     textAlign: 'center',
//   },
// });
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {getAnnouncement} from '../../../APINetwork/ComponentApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../utils';
import Reload from '../../../Reload';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';

const Announcement = ({navigation}) => {
  const {currentTheme} = useContext(ThemeContext);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = await AsyncStorage.getItem('TOKEN');
        const url = `${BASE_URL}/announcements/list`;
        const response = await getAnnouncement(url, token);
        if (response?.data?.status === true) {
          setAnnouncements(response.data.data || []);
        }
      } catch (error) {
        console.error('Announcement fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AnnouncementDetails', {newsId: item.id})}
      style={[
        styles.card,
        {
          backgroundColor: currentTheme.background_v2,
          shadowColor: currentTheme.text,
        },
      ]}
      activeOpacity={0.8}>
      
      {/* Image Container with Loading State */}
      <View style={styles.imageContainer}>
        <Image 
          source={{uri: item.image}} 
          style={styles.cardImage}
          resizeMode="cover"
          onLoadStart={() => {}}
          onLoadEnd={() => {}}
          onError={() => {}}
        />
        {/* Gradient Overlay */}
        <View style={styles.imageOverlay} />
      </View>

      {/* Content Container */}
      <View style={styles.cardContent}>
        <Text 
          numberOfLines={3} 
          style={[styles.cardTitle, {color: '#fff'}]}
        >
          {item.title}
        </Text>
        
        <View style={styles.cardFooter}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AnnouncementDetails', {newsId: item.id})}
            style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Read More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <ImageBackground
        source={{uri: 'https://i.postimg.cc/zf8d0r7t/nodata-1.png'}}
        resizeMode="contain"
        style={styles.emptyImage}>
        <Text style={[styles.emptyText, {color: currentTheme.text}]}>
          No Announcements Available
        </Text>
        <Text style={[styles.emptySubText, {color: currentTheme.text + '80'}]}>
          Check back later for updates
        </Text>
      </ImageBackground>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>📢 Announcements</Text>
      </View>

      {/* Content */}
      <View style={[styles.content, {backgroundColor: currentTheme.background}]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={currentTheme.primary || '#007AFF'} />
            <Text style={[styles.loadingText, {color: currentTheme.text}]}>
              Loading announcements...
            </Text>
          </View>
        ) : announcements.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={announcements}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{height: 16}} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Announcement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  header: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 4,
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    height: responsiveHeight(18),
    width: '100%',
  },
  cardImage: {
    height: '100%',
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cardContent: {
    padding: 12,
    minHeight: responsiveHeight(12),
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 8,
    textAlign: 'left',
  },
  cardFooter: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  readMoreButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  readMoreText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: responsiveFontSize(1.6),
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  flatListContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
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
    marginTop: 20,
    fontSize: responsiveFontSize(2.2),
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: responsiveFontSize(1.8),
    textAlign: 'center',
  },
});
