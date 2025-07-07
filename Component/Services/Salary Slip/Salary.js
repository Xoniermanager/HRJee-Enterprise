import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../utils';
import {SalarySlip} from '../../../APINetwork/ComponentApi';
import {showMessage} from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Salary = ({navigation}) => {
  const [list, setList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSalarySlip = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('TOKEN');

      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();

      const url = `${BASE_URL}/generatePaySlip?month=${month}&year=${year}`;
      console.log('API URL:', url);

      const response = await SalarySlip(url, token);

      if (response.data.status) {
        setList([response.data.file_url]);
      } else {
        setList([]);
        // showMessage({
        //   message: response.data.message || 'No data found.',
        //   type: 'danger',
        //   duration: 3000,
        // });
      }
    } catch (error) {
      console.error(error);
      showMessage({
        message: 'Error fetching salary slip',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSalarySlip = ({item}) => (
    <View style={styles.timelineRow}>
      <View style={styles.timelineMarkerContainer}>
        <View style={styles.timelineLine} />
        <Image
          source={require('../../../assets/Attendence/point.png')}
          style={styles.timelineDot}
        />
      </View>

      <View style={styles.slipCard}>
        <Text style={styles.slipTitle}>Salary Slip</Text>
        <TouchableOpacity
          style={styles.downloadIcon}
          onPress={() => Linking.openURL(item)}>
          <MaterialCommunityIcons name="download" size={28} color={'#0E0E64'} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.innerContainer}
        contentContainerStyle={{paddingBottom: 30}}>
        <View style={styles.contentWrapper}>
          {/* Header */}
          <Text style={styles.label}>Select Month & Year</Text>

          {/* Date Display */}
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={styles.dateSelector}>
            <Text style={styles.dateText}>
              {selectedDate.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </TouchableOpacity>

          {/* Date Picker Modal */}
          <DatePicker
            modal
            open={open}
            date={selectedDate}
            mode="date"
            maximumDate={new Date()}
            onConfirm={date => {
              setOpen(false);
              setSelectedDate(date);
            }}
            onCancel={() => setOpen(false)}
          />

          {/* Fetch Button */}
          <TouchableOpacity
            onPress={fetchSalarySlip}
            style={styles.fetchButton}>
            <Text style={styles.fetchButtonText}>Fetch Salary Slip</Text>
          </TouchableOpacity>

          {/* List Header */}
          <Text style={styles.label}>Salary Statement List</Text>

          {/* Data List */}
          {loading ? (
            <ActivityIndicator size="large" color="#0E0E64" />
          ) : (
            <FlatList
              data={list}
              renderItem={renderSalarySlip}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No Data Found</Text>
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Salary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E64',
  },
  innerContainer: {
    backgroundColor: '#fff',
    marginTop: responsiveHeight(3),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  contentWrapper: {
    marginHorizontal: responsiveWidth(5),
  },
  label: {
    color: '#0E0E64',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  dateSelector: {
    backgroundColor: '#EDFBFE',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
  },
  dateText: {
    color: '#0E0E64',
    fontSize: 16,
  },
  fetchButton: {
    backgroundColor: '#0E0E64',
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  fetchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  timelineMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    height: 60,
    width: 2,
    backgroundColor: '#000',
    opacity: 0.2,
  },
  timelineDot: {
    height: 15,
    width: 15,
    position: 'absolute',
    top: 20,
    left: -6,
    resizeMode: 'contain',
  },
  slipCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EDFBFE',
    padding: 12,
    borderRadius: 10,
    width: responsiveWidth(80),
    marginLeft: 20,
    alignItems: 'center',
    elevation: 5,
  },
  slipTitle: {
    color: '#0E0E64',
    fontSize: 17,
    fontWeight: '600',
  },
  downloadIcon: {
    padding: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
});
