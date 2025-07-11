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
import Reload from '../../../Reload';
const UserLeave = ({route}) => {
  const {id} = route?.params;
  const navigation = useNavigation();
  const isFocuesd = useIsFocused();
  const [list, setList] = useState(null);
  const [lastPage, setLastPage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState('');
  const {currentTheme} = useContext(ThemeContext);
  const getRequestlist = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/get/team/details/${id}`;
    const response = await asignTask(url, token);
    setList(response?.data?.data?.leave?.data);
    setLastPage(response?.data?.data?.leave.last_page);
  };
  useEffect(() => {
    getRequestlist();
  }, [isFocuesd]);
  const handleRefresh = () => {
    getRequestlist();
  };
  if(list==null){
    return <Reload/>
  }
  const fetchMore = async () => {
    if (currentPage < lastPage) {
      const nextPage = currentPage + 1;
      const token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/get/team/details/${id}?page=${nextPage}`;
      const response = await courseeList(url, token);
      setLoader(response?.data?.data?.attendance?.data);
      setCurrentPage(nextPage);
      setList(prevData => [
        ...prevData,
        ...response?.data?.data?.attendance?.data,
      ]);
    } else {
      setLoader([]);
    }
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
            <Text style={styles.value}>
              {item?.from} - {item?.to}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Reason</Text>
            <Text style={styles.value}>{item?.reason}</Text>
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
          contentContainerStyle={{ paddingBottom: 80 }}
          onEndReached={() => fetchMore()}
          ListFooterComponent={() =>
            loader && loader?.length == 0 ? null : loader?.length <
              10 ? null : (
              <Reload />
            )
          }
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

export default UserLeave;

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
