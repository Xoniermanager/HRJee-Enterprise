import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
  const handleRefresh=()=>{
    getRequestlist();
  }
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
  if(list==null){
    return <Reload/>
  }
  
  const deleteItem = async id => {
    console.log(id, 'id');
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
          console.log(error.response);
          showMessage({
            message: error.response.data.msg,
            type: 'danger',
          });
        }
      });
  };
  const renderItem = ({item, index}) => {
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
              {item?.status}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
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
  return (
    <View style={styles.container}>
       <PullToRefresh onRefresh={handleRefresh}>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No data found</Text>
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
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#f1f1f1',
  },
});
