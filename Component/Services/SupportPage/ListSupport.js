import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import { BASE_URL } from '../../../utils';
import { asignTask, deleteRequest } from '../../../APINetwork/ComponentApi';
import { showMessage } from 'react-native-flash-message';

const ListSupport = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [lastPage, setLastPage] = useState('');
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const getList = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/support`;
    const response = await asignTask(url, token);
    if (response?.data?.status) {
      setList(response.data.data.supports?.data || []);
      setLastPage(response?.data?.data?.last_page || 1);
    }
  };

  useEffect(() => {
    if (isFocused) getList();
  }, [isFocused]);

  const fetchMore = async () => {
    if (currentPage < lastPage) {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      const token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/support?page=${nextPage}`;
      const response = await asignTask(url, token);
      const newData = response?.data?.supports?.data?.data || [];
      setList(prevData => [...prevData, ...newData]);
      setCurrentPage(nextPage);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/support/${id}`;
    const response = await deleteRequest(url, null, token);
    if (response?.data?.message) {
      showMessage({
        message: response.data.message,
        type: 'success',
      });
      getList();
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.subject}>{item.subject}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>

      {item?.remark ? (
        <View style={styles.block}>
          <Text style={styles.label}>Remark:</Text>
          <Text style={styles.value}>{item.remark}</Text>
        </View>
      ) : null}

      <View style={styles.block}>
        <Text style={styles.label}>Comment:</Text>
        <Text style={styles.value}>{item.comment}</Text>
      </View>

      <Text style={styles.date}>
        Created: {item.created_at.slice(0, 16).replace('T', ' ')}
      </Text>
      <Text style={styles.date}>
        Updated: {item.updated_at.slice(0, 16).replace('T', ' ')}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.edit]}
          onPress={() => navigation.navigate('SupportPage', { id: item.id })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        {!item?.remark && (
          <TouchableOpacity
            style={[styles.button, styles.delete]}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Support Requests</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('SupportPage')}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={list}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.1}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Image
              source={{
                uri: 'https://static.vecteezy.com/system/resources/thumbnails/013/927/147/small_2x/adaptive-interface-design-illustration-concept-on-white-background-vector.jpg',
              }}
              style={{ width: 250, height: 250, marginBottom: 20 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 18, color: '#000', fontWeight: '500' }}>
              Data Not Found
            </Text>
          </View>
        }
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
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  subject: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#000',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
    marginBottom: 8,
  },
  status: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  block: {
    marginTop: 8,
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
