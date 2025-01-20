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
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const Salary = ({navigation}) => {
  const arr = [1, 2, 3, 4, 5, 6, 7];
  const [expandedprofile, setExpandedProfile] = useState(false);
  const toggleExpandedProfile = () => {
    setExpandedProfile(!expandedprofile);
  };
  const renderSalrySlip = ({item}) => {
    return (
      <View style={{flexDirection: 'row'}}>
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
          }}>
          <Text style={{color: '#0E0E64', fontSize: 18, textAlign: 'center'}}>
            Nov 2023
          </Text>
          <TouchableOpacity
            style={{
              marginLeft: responsiveWidth(25),
              backgroundColor: '#0528a5',
              padding: 5,
              width: 80,
              borderRadius: 50,
            }}>
            <Text style={{color: '#fff', textAlign: 'center', fontSize: 16}}>
              Open
            </Text>
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
        <View style={{alignSelf: 'center'}}>
          <Text style={styles.name}>Salary Slip</Text>
        </View>

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
            <Text
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
                    2024-03-07
                  </Text>
                  <TouchableOpacity onPress={() => alert('Hello')}>
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
                    2024-03-07
                  </Text>
                  <TouchableOpacity onPress={() => alert('Hello')}>
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
            </View>
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
              data={arr}
              showsVerticalScrollIndicator={false}
              renderItem={renderSalrySlip}
              keyExtractor={item => item.id}
            />
          </View>
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
