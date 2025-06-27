import { useContext, useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHoliday } from '../../../APINetwork/ComponentApi';
import { BASE_URL } from '../../../utils';
import { ThemeContext } from '../../../Store/ConetxtApi.jsx/ConextApi';

const Holiday = ({ navigation }) => {
  const { currentTheme } = useContext(ThemeContext);
  const [selected, setSelected] = useState('');
  const [holidays, setHolidays] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const currentDateString = new Date().toISOString().split('T')[0];

  const fetchHolidays = async (month) => {
    setLoader(true);
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/holidays?month=${month.toString().padStart(2, '0')}`;
      const response = await getHoliday(url, token);
      setHolidays(response?.data?.data || []);
    } catch (error) {
      console.log('Error fetching holiday data:', error?.response?.data);
    }
    setLoader(false);
  };

  useEffect(() => {
    setSelected(currentDateString);
    fetchHolidays(currentMonth);
  }, []);

  const renderHolidayItem = ({ item }) => (
    <View style={[styles.holidayCard, { backgroundColor: currentTheme.background_v2 }]}>
      <View style={styles.iconContainer}>
        <Image
          style={styles.icon}
          source={require('../../../assets/HomeScreen/calendar.png')}
        />
      </View>
      <View style={styles.holidayInfo}>
        <Text style={styles.holidayTitle}>{item.name}</Text>
        <Text style={styles.holidayDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background_v2 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Holiday</Text>
      </View>

      <ScrollView style={styles.contentContainer(currentTheme.background)}>
        <Calendar
          style={styles.calendar(currentTheme.background)}
          current={currentDateString}
          onDayPress={day => setSelected(day.dateString)}
          onMonthChange={month => {
            setCurrentMonth(month.month);
            fetchHolidays(month.month);
          }}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: 'orange',
            },
          }}
        />

        <View style={styles.listContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.headerText, { color: currentTheme.text }]}>
              Holiday of the Month
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('HolidayList')}>
              <Text style={[styles.viewAll, { color: currentTheme.text }]}>View all</Text>
            </TouchableOpacity>
          </View>

          {loader ? (
            <ActivityIndicator size="large" color="#0E0E64" style={{ marginTop: 20 }} />
          ) : holidays.length > 0 ? (
            <FlatList
              data={holidays}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderHolidayItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 70 }}
            />
          ) : (
            <Text style={styles.noHolidayText(currentTheme.text)}>
              No holidays available this month.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Holiday;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 15,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
  },
  contentContainer: (bg) => ({
    flex: 1,
    backgroundColor: bg,
    marginTop: responsiveHeight(2),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: responsiveWidth(5),
  }),
  calendar: (bg) => ({
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: bg,
    marginTop: responsiveHeight(2),
  }),
  listContainer: {
    marginTop: responsiveHeight(2),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAll: {
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  holidayCard: {
    flexDirection: 'row',
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: '#0E0E64',
    elevation: 2,
    marginBottom: 12,
    padding: 12,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#fff',
    height: 60,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  icon: {
    height: 28,
    width: 28,
    resizeMode: 'contain',
  },
  holidayInfo: {
    marginLeft: 15,
    flex: 1,
  },
  holidayTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  holidayDate: {
    color: '#ccc',
    fontSize: 15,
    marginTop: 4,
  },
  noHolidayText: (color) => ({
    color: color,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  }),
});
