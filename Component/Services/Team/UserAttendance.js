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
const UserAttendance = ({route}) => {
  const {id} = route?.params;
  const navigation = useNavigation();
  const isFocuesd = useIsFocused();
  const [list, setList] = useState(null);
  const {currentTheme} = useContext(ThemeContext);
  const getRequestlist = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/get/team/details/${id}`;
    const response = await asignTask(url, token);
    setList(response?.data?.data?.attendance?.data);
  };
  useEffect(() => {
    getRequestlist();
  }, [isFocuesd]);
  const handleRefresh = () => {
    getRequestlist();
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
            <Text style={styles.label}>Punch In</Text>
            <Text style={styles.value}>{item?.punch_in}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Punch Out</Text>
            <Text style={styles.value}>
              {item.punch_out ? item.punch_out : 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Work From</Text>
            <Text style={styles.value}>
              {item.work_from ? item.work_from : 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Punch In Address</Text>
            <Text style={styles.value}>
              {item?.punch_in_address ? item?.punch_in_address : 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Punch Out Address</Text>
            <Text style={[styles.value]}>
              {item?.punch_out_address ? item?.punch_out_address : 'N/A'}
            </Text>
          </View>
        </View>
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

export default UserAttendance;

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
