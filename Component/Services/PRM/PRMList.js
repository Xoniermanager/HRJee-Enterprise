import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  AllPRMList,
  DetailsResign,
  deletePRM,
  getResginList,
} from '../../../APINetwork/ComponentApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../utils';
import {Card, Text, Button} from 'react-native-paper';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {showMessage} from 'react-native-flash-message';
const PRMList = () => {
  const navigation = useNavigation();
  const IsFocused = useIsFocused();
  const {currentTheme} = useContext(ThemeContext);
  const [list, setList] = useState();
  const [deleteLoader, setDeleteLoader] = useState(null);
  const getAllPRMList = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/get/all/prm/request`;
    const response = await AllPRMList(url, token);
    if (response.data.status) {
      setList(response.data.data.data);
    }
  };
  useEffect(() => {
    getAllPRMList();
  }, [IsFocused]);

  const DataCard = ({title, value}) => (
    <View style={styles.dataRow}>
      <Text style={styles.label}>{title}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
  const PRMDelete = async (id, index) => {
    setDeleteLoader(index);
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/delete/prm/request/${id}`;
    const response = await deletePRM(url, token);
    setDeleteLoader(false);
    getAllPRMList();
    showMessage({
      message: response.data.message,
      type: 'success',
    });
  };

  return (
    <View
      style={[styles.container, {backgroundColor: currentTheme.background}]}>
      {/* Add Button */}
      <TouchableOpacity
        style={[
          styles.addButton,
          {backgroundColor: currentTheme.background_v2},
        ]}
        onPress={() => navigation.navigate('EditPRM')}>
        <Text style={styles.addButtonText}>Add PRM</Text>
      </TouchableOpacity>
      <View style={styles.card}>
        <FlatList
          data={list}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
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
          renderItem={({item, index}) => (
            <View style={styles.amountCard}>
              <DataCard
                title="Category"
                value={item?.category.name ? item?.category.name : 'N/A'}
              />
              <DataCard
                title="Date"
                value={item?.bill_date ? item?.bill_date : 'N/A'}
              />
              <DataCard
                title="Amount"
                value={item?.amount ? item?.amount : 'N/A'}
              />
              <DataCard
                title="Remark"
                value={item?.remark ? item?.remark : 'N/A'}
              />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {backgroundColor: currentTheme.background_v2},
                  ]}
                  onPress={() => navigation.navigate('EditPRM', {id: item.id})}>
                  <MaterialCommunityIcons
                    name="account-edit"
                    size={25}
                    color={'#fff'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    {backgroundColor: currentTheme.background_v2},
                  ]}
                  onPress={() => PRMDelete(item.id, index)}>
                  {deleteLoader === index ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <MaterialCommunityIcons
                      name="delete"
                      size={25}
                      color={'#fff'}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {backgroundColor: currentTheme.background_v2},
                  ]}
                  onPress={() => Linking.openURL(item.document)}>
                  <MaterialCommunityIcons
                    name="download"
                    size={25}
                    color={'#fff'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10, backgroundColor: '#f5f5f5'},
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  addButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  card: {backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 3},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#000',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  value: {fontSize: 16, color: '#555'},
  amountCard: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0043ae',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
    width: responsiveWidth(15),
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  
});

export default PRMList;
