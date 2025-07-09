import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../utils';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {asignTask} from '../../../APINetwork/ComponentApi';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import PullToRefresh from '../../../PullToRefresh';
import Reload from '../../../Reload';

const RequestList = () => {
  const navigation = useNavigation();
  const isFocuesd = useIsFocused();
  const [list, setList] = useState(null);
  const {currentTheme} = useContext(ThemeContext);

  const getRequestlist = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/attendance/request/list`;
    const response = await asignTask(url, token);
    setList(response?.data?.data?.data);
  };

  useEffect(() => {
    getRequestlist();
  }, [isFocuesd]);

  const handleRefresh = () => {
    getRequestlist();
  };

  const handleDelete = id => {
    Alert.alert(
      'Delete Confirmation',
      'Are you sure you want to delete this item?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: () => deleteItem(id), style: 'destructive'},
      ],
    );
  };

  const deleteItem = async id => {
    const token = await AsyncStorage.getItem('TOKEN');
    const config = {
      method: 'get',
      url: `${BASE_URL}/attendance/request/delete/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    axios(config)
      .then(response => {
        showMessage({
          message: response.data.message,
          type: 'success',
        });
        getRequestlist();
      })
      .catch(error => {
        if (error.response.status == '401') {
          showMessage({
            message: error.response.data.msg,
            type: 'danger',
          });
        }
      });
  };

  const renderItem = ({item}) => {
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#E1FCEB', '#FCFFFD', '#fff']}
        style={styles.card}>
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{item?.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Punch In</Text>
            <Text style={styles.value}>
              {item.punch_in.split(' ')[1].slice(0, 5)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Punch Out</Text>
            <Text style={styles.value}>
              {item.punch_out.split(' ')[1].slice(0, 5)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Reason</Text>
            <Text style={styles.value}>{item?.reason}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Status</Text>
            <Text style={[styles.value, {color: 'orange', fontWeight: 'bold'}]}>
              {item?.status?.toUpperCase()}
            </Text>
          </View>
        </View>

        {item?.status == 'pending' ? (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('UpdateRequestattendance', {id: item.id})
              }
              style={styles.iconButton}>
              <Icon name="edit" size={22} color="#3498db" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.iconButton}>
              <Icon name="delete" size={22} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        ) : null}
      </LinearGradient>
    );
  };

  if (list == null) {
    return <Reload />;
  }

  return (
    <View style={styles.container}>
      <PullToRefresh onRefresh={handleRefresh}>
        <FlatList
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() => navigation.navigate('AddAttendance' , {id: 0})}>
                <Text style={styles.buttonText}>+ Request Attendance</Text>
              </TouchableOpacity>
            </View>
          }
          data={list}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{marginBottom:80}}
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
        />
      </PullToRefresh>
    </View>
  );
};
export default RequestList;
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  headerContainer: {
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  requestButton: {
    backgroundColor: '#0E0E64',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    marginBottom: 6,
  },
  detailRow: {
    justifyContent: 'space-between',
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#f1f1f1',
  },
});
