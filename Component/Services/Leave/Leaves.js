import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';
import {BASE_URL} from '../../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getLeaveType} from '../../../APINetwork/ComponentApi';
import HomeSkeleton from '../../Skeleton/HomeSkeleton';
import {useIsFocused} from '@react-navigation/native';
const Leaves = ({navigation}) => {
  const {currentTheme, theme} = useContext(ThemeContext);
  const isFocused = useIsFocused();
  const [list, setList] = useState(null);
  const showData = [
    {
      id: 1,
      uri: require('../../../assets/HomeScreen/calendar.png'),
      name: 'View',
      num: 'Calendar',
      backgroundcolor: theme == 'light' ? '#44D5FB' : '#242B3A',
    },
    {
      id: 2,
      uri: require('../../../assets/HomeScreen/holiday.png'),
      name: 'View',
      num: 'Holiday',
      backgroundcolor: theme == 'light' ? '#F9B7D5' : '#242B3A',
    },
    {
      id: 3,
      uri: require('../../../assets/HomeScreen/leave.png'),
      name: 'Leave',
      num: 'Balance',
      backgroundcolor: theme == 'light' ? '#BAAEFC' : '#242B3A',
    },
  ];
  async function check() {
    try {
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/leaves`;
      const response = await getLeaveType(url, token);
      if (response?.data?.status == true) {
        setList(response?.data?.data.data);
      } else {
      }
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  }
  useEffect(() => {
    check();
  }, [isFocused]);
  if (list == null) {
    return <HomeSkeleton />;
  }
  function getLeaveDays(from, to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const timeDifference = toDate.getTime() - fromDate.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24) + 1;
    return dayDifference;
  }
  const renderServicesList = ({item}) => (
    <View
      style={{
        justifyContent: 'center',
        backgroundColor: item.backgroundcolor,
        width: responsiveWidth(28),
        height: responsiveHeight(18),
        marginHorizontal: 5,
        borderRadius: 20,
      }}>
      <View style={{padding: 10, alignItems: 'center'}}>
        <Image
          style={{height: 60, width: 60, marginBottom: 10}}
          source={item.uri}
        />
        <Text style={{marginBottom: 2, fontSize: 16, color: currentTheme.text}}>
          {item.name}
        </Text>
        <Text style={{fontSize: 16, color: currentTheme.text}}>{item.num}</Text>
      </View>
    </View>
  );
  const getColor = status => {
    switch (status) {
      case 'Approved':
        return '#0CD533';
      case 'PENDING':
        return '#0000ff';
      case 'Rejected':
        return 'red';
      default:
        return 'grey';
    }
  };
  const formatHalfDay = halfDay => {
    if (halfDay === 'first_half') return 'First Half';
    if (halfDay === 'second_half') return 'Second Half';
    return halfDay;
  };
  const renderLeaveList = ({item}) => {
    return (
      <View style={[styles.leaveStatus]}>
        <View
          style={[
            styles.leaveItem,
            styles.approved,
            {
              borderLeftColor: getColor(item.leave_status.name),
              backgroundColor: currentTheme.background,
              borderWidth: 0.5,
              borderColor: getColor(item.leave_status.name),
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <AntDesign
              style={{
                backgroundColor: getColor(item.leave_status.name),
                padding: 12,
                borderRadius: 30,
              }}
              name="calendar"
              size={30}
              color="#fff"
            />
            <View style={{marginHorizontal: 8}}>
              <Text style={[styles.leaveText, {color: currentTheme.text}]}>
                {item?.from} - {item?.to}
              </Text>
              {item.from_half_day != null ? (
                <Text
                  style={[
                    {
                      color: currentTheme.text,
                      fontSize: 14,
                      color: '#000',
                      textAlign: 'center',
                    },
                  ]}>
                  {`${formatHalfDay(item.from_half_day)} to ${formatHalfDay(
                    item.to_half_day,
                  )}`}
                </Text>
              ) : null}
              <Text
                style={[
                  {
                    color: currentTheme.text,
                    fontSize: 14,
                    color: '#000',
                    textAlign: 'center',
                  },
                ]}>
                {getLeaveDays(item?.from, item?.to)} Day - {item?.reason}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: getColor(item.leave_status.name),
                borderRadius: 10,
              }}>
              <Text style={styles.statusText}>{item?.leave_status.name}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: currentTheme.background,
          borderTopLeftRadius: 40,
          marginTop: responsiveHeight(3),
          borderTopRightRadius: 40,
        }}>
        <View style={{margin: 18}}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ApplyLeave')}
              style={[
                styles.applyButton,
                {backgroundColor: currentTheme.background_v2, marginRight: 20},
              ]}>
              <Text style={styles.applyButtonText}>Apply Leave</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('CompOff')}
              style={[
                styles.applyButton,
                {backgroundColor: currentTheme.background_v2},
              ]}>
              <Text style={styles.applyButtonText}>Comp Off</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menu}>
            <FlatList
              style={{alignSelf: 'center'}}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={showData}
              renderItem={renderServicesList}
              keyExtractor={item => item.id}
            />
          </View>
          <View style={styles.menu}>
            <FlatList
              style={{alignSelf: 'center'}}
              data={list}
              renderItem={renderLeaveList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Data not found</Text>
                </View>
              }
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E64',
  },
  name: {
    color: '#fff',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: responsiveHeight(0),
  },
  container1: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
    marginBottom: 25,
  },
  menuItem: {
    flex: 1,
    margin: 5,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#add8e6', // Default background color
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaveStatus: {
    marginBottom: 20,
  },
  leaveItem: {
    marginBottom: responsiveHeight(2),
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff', // Default background color
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 7,
  },
  leaveText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginVertical: 8,
    color: '#fff',
  },
  approved: {
    borderLeftWidth: 5,
    borderLeftColor: '#0CD533',
  },
  applied: {
    borderLeftWidth: 5,
    borderLeftColor: 'blue',
  },
  rejected: {
    borderLeftWidth: 5,
    borderLeftColor: 'red',
  },
  applyButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#0000ff',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    // fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    fontWeight: 'bold',
  },
});
export default Leaves;
