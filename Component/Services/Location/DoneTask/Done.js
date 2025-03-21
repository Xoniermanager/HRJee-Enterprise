import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ThemeContext} from '../../../../Store/ConetxtApi.jsx/ConextApi';
import {asignTask} from '../../../../APINetwork/ComponentApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../../utils';
import PullToRefresh from '../../../../PullToRefresh';
import { useIsFocused } from '@react-navigation/native';
const Done = () => {
  const isFocused = useIsFocused();
  const [list, setList] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const {currentTheme} = useContext(ThemeContext);
  const getasignTask = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/assign/task`;
    const response = await asignTask(url, token);
    setList(response.data.data);
  };
  useEffect(() => {
    getasignTask();
  }, [isFocused]);
  const handleRefresh = async () => {
    getasignTask();
  };
  const data =
    list &&
    list.data.filter((item, index) => {
      return item.user_end_status == 'completed';
    });
  const renderItem = ({item}) => {
    const isExpanded = expanded === item.id;
    const responseData = JSON.parse(item.response_data || '{}');
    const keys = Object.keys(responseData);
    const displayedKeys = isExpanded ? keys : keys.slice(0, 3);
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#E1FCEB', '#FCFFFD', '#fff']}
        style={styles.card}>
        <View style={styles.details}>
          {displayedKeys.map((key, index) => (
            <View key={index} style={styles.detailRow}>
              <Text style={styles.label}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </Text>
              <Text style={styles.value}>{responseData[key]}</Text>
            </View>
          ))}
          {isExpanded && (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Remark:</Text>
                <Text style={styles.value}>{item.remark || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Latitude:</Text>
                <Text style={styles.value}>{item.latitude || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Longitude:</Text>
                <Text style={styles.value}>{item.longitude || 'N/A'}</Text>
              </View>
            </>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Status:</Text>
            <Text
              style={[
                styles.value,
                {color: item.user_end_status === 'pending' ? 'red' : 'green'},
              ]}>
              {item.user_end_status.charAt(0).toUpperCase() +
                item.user_end_status.slice(1)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setExpanded(isExpanded ? null : item.id)}
          style={styles.moreLessButton}>
          {isExpanded ? (
            <AntDesign name="caretup" size={30} color="#000" />
          ) : (
            <AntDesign name="caretdown" size={30} color="#000" />
          )}
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  return (
    <View style={{backgroundColor: currentTheme.background, flex: 1}}>
            <PullToRefresh onRefresh={handleRefresh}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.container}
      />
      </PullToRefresh>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  textContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  container_imagebackground: {
    flex: 1,
    borderWidth: 1,
  },
  image: {
    flex: 1,
    height: responsiveHeight(65),
  },
  text: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    marginTop: responsiveHeight(50),
  },
  card: {
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    marginBottom:6
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  taskId: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  customerName: {
    color: '#333',
  },
  date: {
    color: '#FF6347',
  },
  button: {
    backgroundColor: '#0CD533',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginBottom: 5,
    marginTop: -10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detailRow: {
    justifyContent: 'space-between',
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    color: '#333',
  },
  moreLessButton: {
    alignSelf: 'flex-end',
  },
  moreLessText: {
    color: '#FF7F50',
    fontWeight: 'bold',
  },
});

export default Done;
