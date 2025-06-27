import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {PieChart} from 'react-native-chart-kit';
import {Dropdown} from 'react-native-element-dropdown';
import {RFValue} from 'react-native-responsive-fontsize';
import {BASE_URL} from '../../../utils';
import {asignTask, reports} from '../../../APINetwork/ComponentApi';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const monthData = [
  {label: 'January', value: '01'},
  {label: 'February', value: '02'},
  {label: 'March', value: '03'},
  {label: 'April', value: '04'},
  {label: 'May', value: '05'},
  {label: 'June', value: '06'},
  {label: 'July', value: '07'},
  {label: 'August', value: '08'},
  {label: 'September', value: '09'},
  {label: 'October', value: '10'},
  {label: 'November', value: '11'},
  {label: 'December', value: '12'},
];

const getCurrentMonth = () => {
  const currentMonth = new Date().getMonth() + 1;
  return currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
};

const TaskReportScreen = () => {
  const [selected, setSelected] = useState(0);
  const [apiData, setApiData] = useState(null);
  const [list, setList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const getReports = async (month = null) => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      let url = `${BASE_URL}/assign/report`;
      if (month) url += `?month=${month}`;
      const response = await reports(url, token);
      if (response?.data?.status) {
        setApiData(response.data.data);
      }
    } catch (error) {
      console.error('Report fetch error:', error);
    }
  };

  const getTask = async (month = null) => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      let url = `${BASE_URL}/assign/task`;
      if (month) url += `?month=${month}`;
      const response = await asignTask(url, token);
      if (response?.data?.status) {
        setList(response.data.data?.data || []);
      }
    } catch (error) {
      console.error('Task fetch error:', error);
    }
  };

  useEffect(() => {
    getReports(selectedMonth);
    getTask(selectedMonth);
  }, [selectedMonth]);

  if (!apiData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  const STATUS_COLORS = {
    Pending: 'orange',
    'In Progress': 'dodgerblue',
    Complete: 'green',
    Rejected: 'red',
  };

  const pieChartData = [
    {
      name: 'Pending',
      population: apiData?.total_pending_tasks,
      color: STATUS_COLORS.Pending,
      legendFontColor: '#333',
      legendFontSize: RFValue(14, screenHeight),
    },
    {
      name: 'In Progress',
      population: apiData?.total_in_progress_tasks,
      color: STATUS_COLORS['In Progress'],
      legendFontColor: '#333',
      legendFontSize: RFValue(14, screenHeight),
    },
    {
      name: 'Complete',
      population: apiData?.total_completed_tasks,
      color: STATUS_COLORS.Complete,
      legendFontColor: '#333',
      legendFontSize: RFValue(14, screenHeight),
    },
    {
      name: 'Rejected',
      population: apiData?.total_rejected_tasks,
      color: STATUS_COLORS.Rejected,
      legendFontColor: '#333',
      legendFontSize: RFValue(14, screenHeight),
    },
  ];

  const TaskCardBasic = ({item}) => {
    const responseData = JSON.parse(item?.response_data || '{}');
    const status = item?.final_status?.toUpperCase() || 'UNKNOWN';

    const statusColorMap = {
      pending: '#FFD700',
      processing: '#ADD8E6',
      completed: '#90EE90',
    };

    const statusColor = statusColorMap[item?.final_status?.toLowerCase()] || '#D3D3D3';

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {backgroundColor: selected === item?.id ? '#D3E6F7' : '#F9F9F9'},
        ]}
        onPress={() => setSelected(item?.id)}>
        <View style={styles.cardHeader}>
          <Text style={styles.taskTitle}>{responseData?.name || 'Unknown'}</Text>
          <Text style={[styles.statusText, {backgroundColor: statusColor}]}>
            {status}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="clock-time-four-outline" size={18} color="#2C648C" />
          <Text style={styles.rowText}>{responseData?.name || 'Unknown'}</Text>
          <Icon name="view-dashboard-outline" size={18} color="#2C648C" style={{marginLeft: 20}} />
          <Text style={styles.rowText}>{item?.remark || 'No Remark'}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="map-marker" size={18} color="#2C648C" />
          <Text style={styles.address}>{item?.visit_address || 'No Address'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const allZero = pieChartData.every(item => item.population === 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Select Month</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={{color: '#999'}}
            selectedTextStyle={{color: '#000'}}
            itemTextStyle={{color: '#000'}}
            data={monthData}
            labelField="label"
            valueField="value"
            placeholder="Choose Month"
            value={selectedMonth}
            onChange={item => setSelectedMonth(item.value)}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Task Status Overview</Text>
          {allZero ? (
            <View style={styles.emptyChart}>
              <Text style={{color: '#666'}}>No task data available</Text>
            </View>
          ) : (
            <PieChart
              data={pieChartData}
              width={screenWidth * 0.9}
              height={screenHeight * 0.3}
              chartConfig={{color: () => '#000'}}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={{borderRadius: 16}}
            />
          )}
        </View>

        <Text style={styles.subTitle}>Task List</Text>
        <FlatList
          data={list}
          renderItem={({item}) => <TaskCardBasic item={item} />}
          keyExtractor={item => item?.id?.toString()}
          contentContainerStyle={{paddingBottom: 100}}
          ListEmptyComponent={
            <Text style={styles.noTasks}>No tasks found</Text>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: screenWidth * 0.04,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: RFValue(16, screenHeight),
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  dropdown: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: RFValue(16, screenHeight),
    fontWeight: '600',
    marginBottom: 6,
    color: '#000',
  },
  emptyChart: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.3,
    borderRadius: screenWidth * 0.45,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTitle: {
    fontSize: RFValue(18, screenHeight),
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  card: {
    padding: 15,
    borderRadius: 18,
    marginBottom: 20,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: RFValue(16, screenHeight),
    fontWeight: '700',
    color: '#2C3E50',
  },
  statusText: {
    color: '#2C648C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: RFValue(12, screenHeight),
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  rowText: {
    marginLeft: 6,
    fontSize: RFValue(14, screenHeight),
    color: '#2C3E50',
  },
  address: {
    marginLeft: 6,
    fontSize: RFValue(13, screenHeight),
    color: '#2C3E50',
    flexShrink: 1,
  },
  noTasks: {
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
    fontSize: RFValue(14, screenHeight),
  },
});
