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
import {responsiveWidth} from 'react-native-responsive-dimensions';
const ListOfficeAddress = () => {
  const navigation = useNavigation();
  const isFocuesd = useIsFocused();
  const [list, setList] = useState(null);
  const {currentTheme} = useContext(ThemeContext);
  const getRequestlist = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/address/request/list`;
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
    console.log(id, 'id');
    const token = await AsyncStorage.getItem('TOKEN');
    const config = {
      method: 'get',
      url: `${BASE_URL}/address/request/delete/${id}`,
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
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{item?.address}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Latitude</Text>
            <Text style={styles.value}>{item.latitude}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Longitude</Text>
            <Text style={styles.value}>{item.longitude}</Text>
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
                navigation.navigate('AddAddress', {id: item.id})
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            padding: 10,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddAddress')}
            style={{
              padding: 15,
              backgroundColor: currentTheme.background_v2,
              borderRadius: 5,
              alignItems: 'center',
              width: responsiveWidth(40),
              marginRight: 20,
            }}>
            <Text style={{color: 'white', fontWeight: '700'}}>ADD ADDRESS</Text>
          </TouchableOpacity>
        </View>
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

export default ListOfficeAddress;

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
    fontSize: 16,
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
