import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';
import {useNavigation} from '@react-navigation/native';

const Team = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {teamUser, currentTheme} = useContext(ThemeContext);
  const navigation = useNavigation();
  const handleMenuClick = user => {
    setSelectedUser(user);
    setUserId(user);
    setModalVisible(true);
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <Image
          source={{uri: item.user?.details?.profile_image}}
          style={styles.userImage}
        />
        <View>
          <Text style={styles.cardText}>{item?.user?.name}</Text>
          <Text style={styles.cardSubText}>{item.user?.details?.phone}</Text>
          <Text style={styles.cardSubText}>{item.user?.email}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleMenuClick(item)}>
        <Ionicons name="ellipsis-vertical" size={24} color="#4A5568" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[styles.container, {backgroundColor: currentTheme.background}]}>
      <Text style={[styles.header, {color: currentTheme.text}]}>
        Team Management
      </Text>
      <FlatList
        data={teamUser}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>
              Options for {selectedUser?.user?.name}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => [
                navigation.navigate('UserAttendance', {id: userId?.user_id}),
                setModalVisible(false),
              ]}>
              <Text style={styles.modalButtonText}>Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => [
                navigation.navigate('Maps', {id: userId?.user_id}),
                setModalVisible(false),
              ]}>
              <Text style={styles.modalButtonText}>Tracking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton]}
              onPress={() => [
                navigation.navigate('UserLeave', {id: userId?.user_id}),
                setModalVisible(false),
              ]}>
              <Text style={styles.modalButtonText}>Leave</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalClose]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    padding: 16,
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  cardSubText: {
    fontSize: 14,
    color: '#4A5568',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  modalButton: {
    backgroundColor: '#3182CE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#E53E3E',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalClose: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#A0AEC0',
    width: '100%',
    alignItems: 'center',
  },
  
});

export default Team;
