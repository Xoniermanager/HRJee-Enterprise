import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image
} from 'react-native';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {DetailsResign, getResginList} from '../../../APINetwork/ComponentApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../utils';

const Resign = () => {
  const navigation = useNavigation();
  const IsFocused = useIsFocused();
  const {currentTheme} = useContext(ThemeContext);
  const [list, setList] = useState();
  const [selectedResign, setSelectedResign] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'withdrawn':
        return 'gray';
      default:
        return 'gray';
    }
  };

  async function check() {
    try {
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/resignation`;
      const response = await getResginList(url, token);
      if (response?.data?.status === true) {
        setList(response.data.data.resignations);
      } else {
      }
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  }
  useEffect(() => {
    check();
  }, [IsFocused]);

  const closeModal = () => {
    setSelectedResign(null);
    setModalVisible(false);
  };
  async function Details(id) {
    try {
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/resignation/${id}`;
      const response = await DetailsResign(url, token);
      if (response?.data?.status === true) {
        setSelectedResign(response.data.data);
        setModalVisible(true);
      } else {
      }
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  }

  return (
    <View
      style={[styles.container, {backgroundColor: currentTheme.background}]}>
      {/* Add Button */} 
      <TouchableOpacity
        style={[
          styles.addButton,
          {backgroundColor: currentTheme.background_v2},
        ]}
        onPress={() => navigation.navigate('ApplyResign')}>
        <Text style={styles.addButtonText}>Add Resignation</Text>
      </TouchableOpacity>

      {/* Resignation List */}
      <FlatList
        data={list?.data}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
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
        renderItem={({item}) => (
          <View
            style={[
              styles.card,
              {backgroundColor: currentTheme.background_v2},
            ]}>
            <View>
              <Text style={styles.date}>{item?.created_at.substring(0, 10)}</Text>
              <Text style={styles.reason}>Reason: {item.remark}</Text>
              <Text
                style={[styles.status, {color: getStatusColor(item.status)}]}>
                {item.status.toUpperCase()}
              </Text>
              {/* <Text style={styles.lastDay}>Last Day: {item.release_date}</Text> */}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {/* View Button */}
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {backgroundColor: currentTheme.background},
                ]}
                onPress={() => Details(item.id)}>
                <Text style={[styles.buttonText, {color: currentTheme.text}]}>
                  View
                </Text>
              </TouchableOpacity>

              {item.status === 'Pending' && (
                <TouchableOpacity
                  style={[styles.actionButton, {backgroundColor: '#FFA500'}]}
                  onPress={() =>
                    navigation.navigate('ApplyResign', {id: item.id})
                  }>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
              )}

              {/* Withdraw Button */}
              {item.status === 'Pending' && (
                <TouchableOpacity
                  style={[styles.actionButton, {backgroundColor: '#FF0000'}]}
                  onPress={() =>
                    navigation.navigate('WithdrawResign', {id: item.id})
                  }>
                  <Text style={styles.buttonText}>Withdraw</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
      {/* Modal for Details */}
      {selectedResign && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, {backgroundColor: '#fff'}]}>
              <ScrollView>
                <Text style={styles.modalTitle}>Resignation Details</Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Name:</Text>{' '}
                  {selectedResign?.user?.name}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Reason:</Text>{' '}
                  {selectedResign?.remark}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Status:</Text>{' '}
                  <Text style={{color: getStatusColor(selectedResign?.status)}}>
                    {selectedResign?.status.toUpperCase()}
                  </Text>
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Last Day:</Text>{' '}
                  {selectedResign.release_date || 'Not Specified'}
                </Text>
                {/* Add more details here */}
              </ScrollView>
              <TouchableOpacity
                style={[styles.closeButton, {backgroundColor: '#FF0000'}]}
                onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  date: {fontSize: 16, fontWeight: 'bold', color: '#fff'},
  reason: {fontSize: 14, marginTop: 5, color: '#fff'},
  status: {fontSize: 14, marginTop: 5},
  lastDay: {fontSize: 14, marginTop: 5, fontStyle: 'italic', color: '#fff'},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontSize: 14, fontWeight: 'bold'},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {width: '90%', padding: 20, borderRadius: 10},
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  modalText: {fontSize: 16, marginVertical: 5, color: '#000'},
  bold: {fontWeight: 'bold', color: '#000'},
  closeButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  
});

export default Resign;
