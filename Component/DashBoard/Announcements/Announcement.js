import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  TouchableOpacity,
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
          borderColor: currentTheme.text,
        },
      ]}>
      <Image source={{uri: item.image}} style={styles.cardImage} />
      <Text numberOfLines={2} style={[styles.cardTitle, {color:'#fff'}]}>
        {item.title}
      </Text>
      
      <TouchableOpacity
        onPress={() => navigation.navigate('AnnouncementDetails', {newsId: item.id})}
        style={[styles.readMoreButton]}>
        <Text style={styles.readMoreText}>Read more</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <ImageBackground
        source={{uri: 'https://i.postimg.cc/zf8d0r7t/nodata-1.png'}}
        resizeMode="contain"
        style={styles.emptyImage}>
        <Text style={styles.emptyText}>No Data Available</Text>
      </ImageBackground>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
      <Text style={styles.header}>Announcement</Text>
      <View style={[styles.content, {backgroundColor: currentTheme.background}]}>
        {loading ? (
          <Reload />
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
  header: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: responsiveHeight(2),
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 16,
  },
  card: {
    width: '48%',
    borderRadius: 10,
    // height: responsiveHeight(35),
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    height: responsiveHeight(20),
    width: '100%',
  },
  cardTitle: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
   
  },
  readMoreButton: {
    paddingBottom:8,
    alignItems: 'center',
    // marginBottom:50
  },
  readMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine:'underline'
  },
  row: {
    justifyContent: 'space-between',
  },
  flatListContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: responsiveWidth(80),
    height: responsiveHeight(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
});
