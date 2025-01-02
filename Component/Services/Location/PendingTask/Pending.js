import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';


const data = [
  {
    id: '1',
    taskId: 'Task I\'d',
    customerName: 'Customer Name',
    date: '2024-06-11 08:55:06',
    details: [
      { label: 'Task Id', value: '1236543' },
      { label: 'Dept I\'d', value: 'Dept I\'d' },
      { label: 'Customer Name', value: 'Customer Name' },
      { label: 'Mobile Number', value: 'Mobile Number' },
      { label: 'Loan No', value: 'Loan No' },
      { label: 'Visit Address', value: 'Visit Address' },
      { label: 'Total Amount', value: 'Total Amount' },
      { label: 'Principal', value: 'Principal' },
      { label: 'EMI Amount', value: 'EMI Amount' },
      { label: 'Builder Name', value: 'Builder Name' },
      { label: 'Banker Name', value: 'Banker Name' },
      { label: 'Loan Center', value: 'Loan Center' },
      { label: 'Property Address', value: 'Property Address' },
      { label: 'Alternate No', value: 'Alternate No' },
      { label: 'Legal Status', value: 'Legal Status' },
      { label: 'Created Date', value: 'Created Date' },

    ]
  },
  // Add more data as needed
];
const image = { uri: 'https://i.postimg.cc/zf8d0r7t/nodata-1.png' };


const TaskScreen = () => {
  const [expanded, setExpanded] = useState(null);

  const renderItem = ({ item }) => {
    const isExpanded = expanded === item.id;

    if (data == "") {
      return <View style={[styles.container_imagebackground, { overflow: 'hidden', borderRadius: 20 }]}>
        <ImageBackground source={image} resizeMode="cover" style={[styles.image, { borderRadius: 20 }]}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>No Data Available</Text>
          </View>
          {/* <Text style={styles.text}>No Data Available</Text> */}
        </ImageBackground>
      </View>
    }

    return (
      <LinearGradient
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        colors={['#E1FCEB', '#FCFFFD', '#fff']}
        style={styles.card}
      >
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Select</Text>
        </TouchableOpacity>

        <View style={styles.details}>
          {(isExpanded ? item.details : item.details.slice(0, 3)).map((detail, index) => (
            <View key={index} style={styles.detailRow}>
              <Text style={styles.label}>{detail.label}:</Text>
              <Text style={styles.value}>{detail.value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setExpanded(isExpanded ? null : item.id)}
          style={styles.moreLessButton}
        >
          {
            isExpanded ?
              <AntDesign style={{}} name="caretup" size={30} color="#000" />
              :
              <AntDesign style={{}} name="caretdown" size={30} color="#000" />

          }

          {/* <Text style={styles.moreLessText}>{isExpanded ? 'Less' : 'More'}</Text> */}
        </TouchableOpacity>
      </LinearGradient>

    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  textContainer: {
    alignSelf:"center", alignItems:"center", justifyContent:"center", flex:1
  },
  container_imagebackground: {
    flex: 1, borderWidth: 1
  },
  image: {
    flex: 1,
    height: responsiveHeight(65),
  },
  text: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    marginTop:responsiveHeight(50)
  },
  card: {
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
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
    backgroundColor: '#FF7F50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "flex-end", marginBottom: 5, marginTop: -10
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: "center"
  },
  detailRow: {
    justifyContent: 'space-between', marginBottom: 5, flexDirection: "row", flexWrap: 'wrap',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    color: '#333',
  },
  moreLessButton: {
    alignSelf: "flex-end",
  },
  moreLessText: {
    color: '#FF7F50',
    fontWeight: 'bold',
  },
});

export default TaskScreen;
