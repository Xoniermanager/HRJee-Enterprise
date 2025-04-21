import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../utils';
import { SalarySlip } from '../../../APINetwork/ComponentApi';
import { showMessage } from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const Salary = ({navigation}) => {
  const arr = [1,];
  const [list,setList]=useState();
  const [expandedprofile, setExpandedProfile] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [openEndDate, setOpenEndDate] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const toggleExpandedProfile = () => {
    setExpandedProfile(!expandedprofile);
  };
  const handleDateChange = (event, selectedDate) => {
    setOpenStartDate(false);
    setStartDate(selectedDate);
  };
  const handleDateChangeEnd = (event, selectedDate) => {
    setOpenEndDate(false);
    setEndDate(selectedDate);
  };
    const SalarySliplist=async()=>{
      const token=await AsyncStorage.getItem('TOKEN');
      const url=`${BASE_URL}/generatePaySlip`
      const response=await SalarySlip(url,token);
      if(response.data.status){
        setList([response.data.file_url])
      }
      else {
        setList([])
        showMessage({
          message: response.data.message,
          type: 'danger',
          duration: 3000,
          
        });
      }
    }
    useEffect(()=>{
      SalarySliplist();
    },[])
  const renderSalrySlip = ({item,index}) => {
    return (
      <View style={{flexDirection: 'row'}} key={index}>
        <View style={{position: 'relative', justifyContent: 'center'}}>
          <View
            style={{
              borderWidth: 1.5,
              height: 50,
              width: 2,
              elevation: 7,
              backgroundColor: '#000',
              opacity: 0.3,
            }}></View>
          <Image
            style={{
              height: 15,
              width: 15,
              marginLeft: -7,
              resizeMode: 'contain',
              position: 'absolute',
            }}
            source={require('../../../assets/Attendence/point.png')}
          />
        </View>
        <View
          style={{
            marginLeft: 20,
            marginTop: 5,
            marginBottom: 5,
            flexDirection: 'row',
            backgroundColor: '#EDFBFE',
            padding: 10,
            elevation: 7,
            borderRadius: 10,
            width:responsiveWidth(80),
            justifyContent:'space-between'

          }}>
          <Text style={{color: '#0E0E64', fontSize: 18, textAlign: 'center'}}>
           Salary Slip
          </Text>
          <TouchableOpacity style={{marginRight:15}}>
            <MaterialCommunityIcons
                          name="download"
                          size={30}
                          color={'#000'}
                        />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          marginTop: 15,
        }}>
       

        <ScrollView
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            borderTopLeftRadius: 40,
            marginTop: responsiveHeight(3),
            borderTopRightRadius: 40,
          }}>
          <View style={{marginHorizontal: responsiveWidth(5)}}>
            {/* <Text
              style={{
                color: '#0E0E64',
                marginVertical: 10,
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              Select Date Range
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <View
                style={{
                  borderRadius: 15,
                  padding: 10,
                  backgroundColor: '#fff',
                  elevation: 7,
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    color: '#0E0E64',
                    fontWeight: 'bold',
                    fontSize: 18,
                    textAlign: 'center',
                  }}>
                  Start Month
                </Text>
                <View
                  style={{
                    marginTop: 5,
                    marginBottom: 5,
                    flexDirection: 'row',
                    backgroundColor: '#EDFBFE',
                    padding: 10,
                    elevation: 7,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      color: '#0E0E64',
                      fontSize: 18,
                      textAlign: 'center',
                    }}>
                    {startDate.toISOString().split('T')[0]}
                  </Text>
                  <TouchableOpacity onPress={() =>setOpenStartDate(true)}>
                    <Image
                      style={{
                        marginHorizontal: 10,
                        height: 30,
                        width: 30,
                        resizeMode: 'contain',
                        alignSelf: 'center',
                      }}
                      source={require('../../../assets/HomeScreen/calendar.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  borderRadius: 15,
                  padding: 10,
                  backgroundColor: '#fff',
                  elevation: 7,
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    color: '#0E0E64',
                    fontWeight: 'bold',
                    fontSize: 18,
                    textAlign: 'center',
                  }}>
                  End Month
                </Text>
                <View
                  style={{
                    marginTop: 5,
                    marginBottom: 5,
                    flexDirection: 'row',
                    backgroundColor: '#EDFBFE',
                    padding: 10,
                    elevation: 7,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      color: '#0E0E64',
                      fontSize: 18,
                      textAlign: 'center',
                    }}>
                   {endDate.toISOString().split('T')[0]}
                  </Text>
                  <TouchableOpacity onPress={() => setOpenEndDate(true)}>
                    <Image
                      style={{
                        marginHorizontal: 10,
                        height: 30,
                        width: 30,
                        resizeMode: 'contain',
                        alignSelf: 'center',
                      }}
                      source={require('../../../assets/HomeScreen/calendar.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View> */}
            <Text
              style={{
                color: '#0E0E64',
                fontWeight: 'bold',
                marginVertical: 10,
                fontSize: 20,
              }}>
              Salary Statement List
            </Text>

            <FlatList
              data={list}
              showsVerticalScrollIndicator={false}
              renderItem={renderSalrySlip}
              keyExtractor={item => item.id}
              ListEmptyComponent={()=>
              <View style={{}}>
                <Text style={{textAlign:'center',fontSize:responsiveFontSize(2),fontWeight:'500',color:'#000'}}>No Data Found</Text>
                </View>
              }
            />
          </View>
          {openStartDate && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
         {openEndDate && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={handleDateChangeEnd}
          />
        )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default Salary;
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
  checkbox: {
    alignSelf: 'center',
  },
});
