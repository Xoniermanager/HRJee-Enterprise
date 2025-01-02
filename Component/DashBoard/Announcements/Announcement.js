
import { Image, SafeAreaView, StyleSheet, Text, View, FlatList, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import { NavigationContainer } from '@react-navigation/native';
import { getAnnouncement, getNews } from '../../../APINetwork/ComponentApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../utils';
import { showMessage } from "react-native-flash-message";
import Reload from '../../../Reload';


const Announcement = ({ navigation }) => {

  const [getAnnouncementApiData, setGetAnnouncementApiData] = useState('')
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        setLoader(true);
        let token = await AsyncStorage.getItem('TOKEN');
        const url = `${BASE_URL}/announcements/list`;
        const response = await getAnnouncement(url, token);
        if (response?.data?.status === true) {
          showMessage({
            message: `${response?.data?.message}`,
            type: "success",
          });
          setGetAnnouncementApiData(response?.data?.data);
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{}}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>
      <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('AnnouncementDetails', { newsId: item?.id })} style={styles.button}>
        <Text style={styles.buttonText}>Read more</Text>
      </TouchableOpacity>
    </View>
  );

  const image = { uri: 'https://i.postimg.cc/zf8d0r7t/nodata-1.png' };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          marginTop: 15,
        }}>
        <Text style={styles.name}>Announcement</Text>
        <View
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            height: "100%"
          }}>
          {
            loader ?
              <Reload />
              :
              <>
                {
                  getAnnouncementApiData == "" || getAnnouncementApiData == null || getAnnouncementApiData == [] ?
                    <View style={[styles.container_imagebackground, { overflow: 'hidden', borderRadius: 20 }]}>
                      <ImageBackground source={image} resizeMode="cover" style={[styles.image, { borderRadius: 20 }]}>
                        <View style={styles.textContainer}>
                          <Text style={styles.text}>No Data Available</Text>
                        </View>
                      </ImageBackground>
                    </View>

                    :
                    <View style={{ margin: 20, }}>
                      <FlatList
                        data={getAnnouncementApiData}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        contentContainerStyle={styles.listContent}
                      />
                    </View>
                }
              </>
          }


        </View>
      </View>

    </SafeAreaView>
  );
};
export default Announcement;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E64',
  },

  name: {
    color: '#fff',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom: responsiveHeight(3)
  },
  textContainer: {
    alignSelf: "center", alignItems: "center", justifyContent: "center",
  },
  text: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    marginTop: responsiveHeight(50)
  },
  container_imagebackground: {
    flex: 1
  },
  image: {
    flex: 1,
    height: 130, resizeMode: "contain", marginVertical: 5
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  listContent: {
    paddingBottom: 100, // To ensure the last row is not covered by the footer
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  title: {
    fontSize: 16,
    color: '#000',
    textAlign: "center", marginVertical:5
  },
  button: {
    backgroundColor: '#0E0E64',
    padding: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

