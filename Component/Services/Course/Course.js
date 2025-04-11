import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BASE_URL} from '../../../utils';
import {courseeList} from '../../../APINetwork/ComponentApi';
import Reload from '../../../Reload';

const Course = () => {
  const navigation = useNavigation();
  const [list, setList] = useState(null);
  const [lastPage, setLastPage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState('');
  const getCourseList = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/course/list`;
    const response = await courseeList(url, token);
    if (response.data.status) {
      setList(response?.data?.data?.data);
      setLastPage(response?.data?.data?.last_page);
    }
  };
  useEffect(() => {
    getCourseList();
  }, []);
  const fetchMore = async () => {
    if (currentPage < lastPage) {
      const nextPage = currentPage + 1;
      const token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/course/list?page=${nextPage}`;
      const response = await courseeList(url, token);
      setLoader(response?.data?.data?.data);
      setCurrentPage(nextPage);
      setList(prevData => [...prevData, ...response?.data?.data?.data]);
    } else {
      setLoader([]);
    }
  };
  if(list==null){
    return <Reload/>
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        onEndReached={() => fetchMore()}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No data found</Text>
          </View>
        }
        ListFooterComponent={() =>
          loader && loader?.length == 0 ? null : loader?.length < 10 ? null : (
            <Reload />
          )
        }
        renderItem={({item, index}) => {
          const dateObj = new Date(item?.created_at);
          const day = dateObj.getUTCDate();
          const month = dateObj.toLocaleString('en-US', {month: 'short'});
          return (
            <View style={styles.card}>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: 'https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp',
                  }} // Replace with actual image URL
                  style={styles.image}
                />
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>{day}</Text>
                  <Text style={styles.monthText}>{month}</Text>
                </View>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={styles.readMore}
                    onPress={() =>
                      navigation.navigate('CourseDetails', {id: item.id})
                    }>
                    <Text style={styles.readMoreText}>Read More</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() =>
                      navigation.navigate('CourseDetails', {id: item.id})
                    }>
                    <Icon name="arrow-right" size={20} color="#FF6600" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8F4F3',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6600',
    textAlign: 'left',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5,
    elevation: 3,
    marginTop: 10,
    borderWidth: 0.5,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  dateBadge: {
    position: 'absolute',
    left: 15,
    bottom: -10,
    backgroundColor: '#FF6600',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  monthText: {
    fontSize: 12,
    color: '#FFF',
  },
  infoContainer: {
    padding: 15,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  readMore: {
    marginTop: 10,
  },
  readMoreText: {
    color: '#FF6600',
    fontWeight: 'bold',
  },
  arrowButton: {
    marginTop: 12,
    marginLeft: 5,
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
});

export default Course;
