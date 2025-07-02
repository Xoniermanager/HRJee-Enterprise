import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import {BASE_URL} from '../../../utils';
import {asignTask, deleteRequest} from '../../../APINetwork/ComponentApi';
import Reload from '../../../Reload';
import { showMessage } from 'react-native-flash-message';

const ListSupport = () => {
  const navigation = useNavigation();
  const isfocuesed = useIsFocused();
  const [list, setList] = useState();
  const [loader, setLoader] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const getlist = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/support`;
    const response = await asignTask(url, token);
    if (response.data.status) {
      // console.log(response.data.data.supports?.last_page)
      setList(response.data.data.supports?.data);
      setLoader(response.data.data.supports?.last_page);
    }
  };
  useEffect(() => {
    getlist();
  }, [isfocuesed]);
  console.log(list);
  const fetchMore = async () => {
    if (currentPage < lastPage) {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      const token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/support?page=${nextPage}`;
      const response = await asignTask(url, token);
      setLoader(response.data.supports?.data.data);
      setCurrentPage(nextPage);
      setIsLoading(false);
      setList(prevData => [...prevData, ...response.data.supports?.data.data]);
    } else {
      setLoader([]);
    }
  };

  const handleView = id =>
    Alert.alert('View', `Viewing support request #${id}`);
  const handleEdit = id =>
    Alert.alert('Edit', `Editing support request #${id}`);
  const handleDelete = async(id) =>
  {
    const token = await AsyncStorage.getItem('TOKEN');
    const url=`${BASE_URL}/support/${id}`;
    const data=null;
    const response =await deleteRequest(url,data,token);
         getlist();
        showMessage({
            message: response.data.message,
            type: 'success',
          });

    
  }
  

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.subject}>{item.subject}</Text>
      <Text style={styles.label}>
        Status: <Text style={styles.status}>{item.status}</Text>
      </Text>
      <Text style={styles.label}>Remark: {item.remark}</Text>
      <Text style={styles.label}>Comment: {item.comment}</Text>
      <Text style={styles.date}>
        Created: {item.created_at.slice(0, 16).replace('T', ' ')}
      </Text>
      <Text style={styles.date}>
        Updated: {item.updated_at.slice(0, 16).replace('T', ' ')}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.view]}
          onPress={() => handleView(item.id)}>
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.edit]}
          onPress={() => navigation.navigate('SupportPage',{id:item.id})}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        {item?.remark == null ? (
          <TouchableOpacity
            style={[styles.button, styles.delete]}
            onPress={() => handleDelete(item.id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Header & Add Button */}
      <View style={styles.header}>
        <Text style={styles.title}>Support Requests</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('SupportPage')}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList to render support items */}
      <FlatList
        data={list}
        onEndReached={() => fetchMore()}
        ListEmptyComponent={
            <View>
              <Image
                source={{
                  uri: 'https://static.vecteezy.com/system/resources/thumbnails/013/927/147/small_2x/adaptive-interface-design-illustration-concept-on-white-background-vector.jpg',
                }}
                style={{padding: 20, height: 250}}
              />
              <Text
                style={{
                  fontSize: 18,
                  color: '#000',
                  fontWeight: '500',
                  textAlign: 'center',
                }}>
                Data Not Found
              </Text>
            </View>
          }
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.1}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 16}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F4F4F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#0E0E64',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 3,
  },
  subject: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  label: {
    fontSize: 14,
    marginBottom: 2,
    color: '#555',
  },
  status: {
    color: '#DC2626',
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  view: {
    backgroundColor: '#10B981',
  },
  edit: {
    backgroundColor: '#F59E0B',
  },
  delete: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '500',
  },
});

export default ListSupport;
