import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {
  Provider as PaperProvider,
  Card,
  Text,
  Title,
  Divider,
} from 'react-native-paper';
import {BASE_URL} from '../../utils';
import {asignTask} from '../../APINetwork/ComponentApi';

const Shift = () => {
  const [list, setList] = useState([]);

  const getShift = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/shift`;
    const response = await asignTask(url, token);
    console.log(response);
    if (response.data.status) {
      setList(response.data.data);
    }
  };

  useEffect(() => {
    getShift();
  }, []);

  const renderShiftItem = ({item: shift}) => (
    <View>
      {/* Shift Details */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>📅 {shift.shift_name}</Title>
          <Text style={styles.date}>Date: {shift.date}</Text>
          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>🕘 Start Time:</Text>
            <Text style={styles.value}>{shift.start_time}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>🕔 End Time:</Text>
            <Text style={styles.value}>{shift.end_time}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>⏰ Half Day Login:</Text>
            <Text style={styles.value}>{shift.half_day_login}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Buffer & Automation */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Buffer & Automation</Title>
          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>➕ Check-in Buffer:</Text>
            <Text style={styles.value}>{shift.check_in_buffer} mins</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>➖ Check-out Buffer:</Text>
            <Text style={styles.value}>{shift.check_out_buffer} mins</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>🔁 Auto Punch-out:</Text>
            <Text style={styles.value}>{shift.auto_punch_out} mins</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Office Timing Rules */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Office Timing Rules</Title>
          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>✅ Shift Hours:</Text>
            <Text style={styles.value}>
              {shift.office_timing.shift_hours} hrs
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>🌓 Half Day Hours:</Text>
            <Text style={styles.value}>
              {shift.office_timing.half_day_hours} hrs
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>📉 Min Shift Hours:</Text>
            <Text style={styles.value}>
              {shift.office_timing.min_shift_hours} hrs
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>📉 Min Half Day Hours:</Text>
            <Text style={styles.value}>
              {shift.office_timing.min_half_day_hours} hrs
            </Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <PaperProvider>
      <FlatList
        contentContainerStyle={styles.container}
        data={list}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderShiftItem}
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
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#eef1f5',
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    padding: 8,
  },
  title: {
    fontSize: 20,
    marginBottom: 4,
    fontWeight: '600',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 6,
    fontWeight: '500',
    color: '#000',
  },
  date: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    flex: 1,
    textAlign: 'right',
  },
});

export default Shift;
