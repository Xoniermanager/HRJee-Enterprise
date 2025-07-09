import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Modal,
  Pressable,
  TextInput,
  Image
} from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { useIsFocused } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { ThemeContext } from '../../../Store/ConetxtApi.jsx/ConextApi';
import { BASE_URL } from '../../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLeaveType } from '../../../APINetwork/ComponentApi';

import HomeSkeleton from '../../Skeleton/HomeSkeleton';
import PullToRefresh from '../../../PullToRefresh';

const Leaves = ({ navigation }) => {
  const { currentTheme } = useContext(ThemeContext);
  const isFocused = useIsFocused();
  const [leaveList, setLeaveList] = useState(null);
  const [availableLeaves, setAvailableLeaves] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [comment, setComment] = useState('');

  const fetchLeaves = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const res = await getLeaveType(`${BASE_URL}/leaves`, token);
      if (res?.data?.status) setLeaveList(res.data.data.data);
    } catch (err) {
      console.error('Error fetching leaves:', err);
    }
  }, []);

  const fetchAvailableLeaves = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const res = await getLeaveType(`${BASE_URL}/available-leaves`, token);
      if (res?.data?.status) setAvailableLeaves(res.data.data);
    } catch (err) {
      console.error('Error fetching available leaves:', err);
    }
  }, []);

  const handleRefresh = async () => {
    await Promise.all([fetchLeaves(), fetchAvailableLeaves()]);
  };

  useEffect(() => {
    if (isFocused) handleRefresh();
  }, [isFocused]);

  if (!leaveList) return <HomeSkeleton />;

  const getLeaveDays = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);
    return (end - start) / (1000 * 60 * 60 * 24) + 1;
  };

  const getColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return '#0CD533';
      case 'PENDING':
        return '#0000ff';
      case 'REJECTED':
        return 'red';
      default:
        return 'gray';
    }
  };

  const formatHalfDay = (value) => {
    if (value === 'first_half') return 'First Half';
    if (value === 'second_half') return 'Second Half';
    return value;
  };

  const renderAvailableLeave = ({ item }) => (
    <View style={[styles.card, { backgroundColor: '#BAAEFC' }]}>
      <Text style={[styles.cardTitle, { color: currentTheme.text }]}>{item.leave_name}</Text>
      <Text style={styles.cardText}>Available: {item.avaialble}</Text>
      <Text style={styles.cardText}>Used: {item.used}</Text>
      <Text style={styles.cardText}>Total: {item.totalLeaves}</Text>
    </View>
  );

  const renderLeaveItem = ({ item }) => {
    const statusColor = getColor(item.leave_status.name);
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedLeave(item);
          setModalVisible(true);
        }}
        style={[styles.leaveItem, { borderColor: statusColor, backgroundColor: currentTheme.background }]}
      >
        <AntDesign name="calendar" size={30} color="#fff" style={[styles.icon, { backgroundColor: statusColor }]} />
        <View style={styles.leaveDetails}>
          <Text style={[styles.leaveText, { color: currentTheme.text }]}>
            {item.from} - {item.to}
          </Text>
          {item.from_half_day && (
            <Text style={styles.halfDayText}>
              {formatHalfDay(item.from_half_day)} to {formatHalfDay(item.to_half_day)}
            </Text>
          )}
          <Text style={styles.reasonText}>
            {getLeaveDays(item.from, item.to)} Day - {item.leave_type.name}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{item.leave_status.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <PullToRefresh onRefresh={handleRefresh}>
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ApplyLeave')}
              style={[styles.applyButton, { backgroundColor: currentTheme.background_v2 }]}
            >
              <Text style={styles.applyButtonText}>Apply Leave</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('CompOff')}
              style={[styles.applyButton, { backgroundColor: currentTheme.background_v2 }]}
            >
              <Text style={styles.applyButtonText}>Comp Off</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Available Leave</Text>
          <FlatList
            data={availableLeaves}
            horizontal
            renderItem={renderAvailableLeave}
            keyExtractor={(item) => item.id?.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />

          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Leave History</Text>
          <FlatList
            data={leaveList}
            renderItem={renderLeaveItem}
            keyExtractor={(item) => item.id?.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No leave history found.</Text>}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
        </ScrollView>
      </PullToRefresh>

      {/* MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Leave Details</Text>

            {selectedLeave && (
              <>
                <View style={styles.row}>
                  <Text style={styles.label}>Leave Type:</Text>
                  <Text style={styles.value}>{selectedLeave.leave_type.name}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>From:</Text>
                  <Text style={styles.value}>{selectedLeave.from}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>To:</Text>
                  <Text style={styles.value}>{selectedLeave.to}</Text>
                </View>

                {selectedLeave.from_half_day && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Half Day:</Text>
                    <Text style={styles.value}>
                      {formatHalfDay(selectedLeave.from_half_day)} to {formatHalfDay(selectedLeave.to_half_day)}
                    </Text>
                  </View>
                )}

                <View style={styles.row}>
                  <Text style={styles.label}>Reason:</Text>
                  <Text style={styles.value}>{selectedLeave.reason}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Status:</Text>
                  <Text style={[styles.value, { color: getColor(selectedLeave.leave_status.name) }]}>
                    {selectedLeave.leave_status.name}
                  </Text>
                </View>

                {/* <Text style={styles.label}>Comment:</Text>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Write a comment"
                  placeholderTextColor="#aaa"
                  style={styles.input}
                /> */}
              </>
            )}

            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: 'gray' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </Pressable>

              {/* {selectedLeave?.leave_status.name === 'PENDING' && (
                <>
                  <Pressable
                    style={[styles.modalButton, { backgroundColor: '#f39c12' }]}
                    onPress={() => {
                      // handleWithdraw(selectedLeave.id);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Withdraw</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.modalButton, { backgroundColor: '#27ae60' }]}
                    onPress={() => {
                      // handleSubmitComment(comment);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Submit</Text>
                  </Pressable>
                </>
              )} */}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginHorizontal: 10,
  },
  applyButton: {
    padding: 10,
    marginLeft: 10,
    borderRadius: 10,
  },
  applyButtonText: { color: '#fff', fontSize: 14 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 10,
  },
  card: {
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    elevation: 3,
    width: responsiveWidth(28),
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardText: { fontSize: 14, color: '#000' },
  leaveItem: {
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: { padding: 12, borderRadius: 30 },
  leaveDetails: { flex: 1, marginHorizontal: 10 },
  leaveText: { fontSize: 14, fontWeight: 'bold' },
  halfDayText: { fontSize: 14, color: '#000' },
  reasonText: { fontSize: 14, color: '#000' },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000099',
  },
  modalCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color:'#000'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
  },
  value: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 10,
    flexWrap: 'wrap',
  },
  modalButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Leaves;
