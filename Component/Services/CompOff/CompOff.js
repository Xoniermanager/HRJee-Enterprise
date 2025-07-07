import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import React, {useState, useContext} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {showMessage} from 'react-native-flash-message';
import PullToRefresh from '../../../PullToRefresh';
import GlobalStyle from '../../../GlobalStyle';
import Themes from '../../Theme/Theme';
import {BASE_URL} from '../../../utils';
import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
const CompOff = ({navigation}) => {
  const {currentTheme,} = useContext(ThemeContext);
  const isfouced = useIsFocused();
  const [leaveList, setleaveList] = useState(null);
  const get_leaves = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const config = {
      method: 'get',
      url: `${BASE_URL}/comp-offs`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    console.log(config);
    axios(config)
      .then(response => {
        console.log(response.data, 'response.data.data');
        setleaveList(response.data.data);
      })
      .catch(error => {
        if (error.response.status == '401') {
         
          showMessage({
            message: error.response.data.msg,
            type: 'danger',
          });
        }
      });
  };
  useFocusEffect(
    React.useCallback(() => {
      get_leaves();
    }, [isfouced]),
  );
  const handleRefresh = async () => {
    get_leaves();
  };
  const handleDelete = id => {
    Alert.alert(
      'Delete Confirmation',
      'Are you sure you want to delete this item?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: () => deleteItem(id), style: 'destructive'},
      ],
    );
  };

  const deleteItem = async id => {
    const token = await AsyncStorage.getItem('TOKEN');
    const config = {
      method: 'delete',
      url: `${BASE_URL}/comp-offs/delete/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    console.log(config);
    axios(config)
      .then(response => {
        showMessage({
          message: response.data.message,
          type: 'success',
        });
        get_leaves();
      })
      .catch(error => {
        if (error.response.status == '401') {
         
          showMessage({
            message: error.response.data.msg,
            type: 'danger',
          });
        }
      });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: '#e3eefb'}}>
        <PullToRefresh onRefresh={handleRefresh}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              padding: 10,
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddCompoff')}
              style={{
                padding: 15,
                backgroundColor: currentTheme.background_v2,
                borderRadius: 5,
                alignItems: 'center',
                width: responsiveWidth(40),
                marginRight: 20,
              }}>
              <Text style={{color: 'white', fontWeight: '700'}}>
                Apply Comp Off
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, padding: 15}}>
            <FlatList
              data={leaveList?.appliedCompOff}
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
              renderItem={({item, index}) => (
                <View
                  key={index}
                  style={[
                    {
                      padding: 18,
                      borderRadius: 5,
                      backgroundColor: 'white',
                      marginTop: 15,
                      marginBottom: index == leaveList?.length - 1 ? 100 : 0,
                    },
                    GlobalStyle.card,
                  ]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View>
                      <Text
                        style={[
                          {fontWeight: '600', fontSize: 18},
                          {color: Themes == 'dark' ? '#000' : '#000'},
                        ]}>
                        {item.user_remark}
                      </Text>
                      <Text
                        style={[
                          {fontSize: 13},
                          {color: Themes == 'dark' ? '#000' : '#000'},
                        ]}>
                        { item.used_date}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View style={styles.status_tag}>
                        <Text style={styles.status_txt}>
                          {item.status === 'pending'
                            ? 'Pending'
                            : item.status === 'approved'
                            ? 'Approved'
                            : item.status === 'rejected'
                            ? 'Rejected'
                            : item.status}
                        </Text>
                      </View>
                      <Ionicons
                        name="trash-outline"
                        size={22}
                        color="red"
                        style={{marginLeft: 10}}
                        onPress={() => handleDelete(item.id)}
                      />
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        </PullToRefresh>
      </View>
    </SafeAreaView>
  );
};
export default CompOff;
const styles = StyleSheet.create({
  tinyLogo: {
    width: 200,
    //   height: 500,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  tag: {
    padding: 6,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag_text: {color: 'white', fontWeight: '600'},
  tag_separator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status_tag: {
    padding: 5,
    backgroundColor: '#fcbc0320',
    borderColor: '#fcbc03',
    borderWidth: 1,
    borderRadius: 15,
  },
  status_txt: {
    color: '#fcbc03',
    fontWeight: '600',
  },
 
});
