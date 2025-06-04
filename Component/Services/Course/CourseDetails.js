import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  FlatList,
} from 'react-native';
import {coourseDeatils} from '../../../APINetwork/ComponentApi';
import {BASE_URL} from '../../../utils';
import Reload from '../../../Reload';

const CourseDetails = ({route}) => {
  const {id} = route.params;
  const [list, setList] = useState(null);

  const getDetails = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const url = `${BASE_URL}/course/details/${id}`;
    const response = await coourseDeatils(url, token);
    if (response.data.status) {
      setList(response.data.data);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  if (list == null) {
    return <Reload />;
  }

  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Curriculum Details</Text>
          <View style={styles.moduleContainer}>
            <Text style={styles.moduleTitle}>Module 1: {item.title}</Text>
            <View style={styles.row}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Instructor</Text>
                <Text style={styles.label}>Description</Text>
                <Text style={styles.label}>Content Type</Text>
                <Text style={styles.label}>Link</Text>
              </View>
              <View>
                <Text style={styles.value}>{item.instructor}</Text>
                <Text style={styles.value}>{item.short_description}</Text>
                <Text style={styles.value}>{item.content_type}</Text>
                {item?.pdf_file != null ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => Linking.openURL(item?.pdf_file)}>
                    <Text style={styles.buttonText}>View Content</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={{color: '#000'}}>N/A</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {item.curriculam_assignment.map((val, i) => {
          return (
            <View key={i} style={styles.card}>
              <Text style={styles.sectionTitle}>Assignments</Text>
              <View style={styles.moduleContainer}>
                <Text style={styles.moduleTitle}>Assignment</Text>
                <View style={styles.row}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Question</Text>
                    <Text style={styles.label}>Option 1</Text>
                    <Text style={styles.label}>Option 2</Text>
                    <Text style={styles.label}>Option 3</Text>
                    <Text style={styles.label}>Option 4</Text>
                    <Text style={styles.label}>File</Text>
                  </View>
                  <View>
                    <Text style={styles.value}>{val.question}</Text>
                    <Text style={styles.value}>{val.option1}</Text>
                    <Text style={styles.value}>{val.option2}</Text>
                    <Text style={styles.value}>{val.option3}</Text>
                    <Text style={styles.value}>{val.option4}</Text>
                    {val?.file != null ? (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => Linking.openURL(val?.file)}>
                        <Text style={styles.buttonText}>Download</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={{color: '#000'}}>N/A</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Course Details</Text>
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.label}>Type</Text>
            <Text style={styles.label}>Link</Text>
          </View>
          <View>
            <Text style={styles.value}>{list?.title}</Text>
            <Text style={styles.value}>{list?.video_type}</Text>
            {list?.pdf_file != null ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => Linking.openURL(list?.pdf_file)}>
                <Text style={styles.buttonText}>View Resource</Text>
              </TouchableOpacity>
            ) : (
              <Text style={{color: '#000'}}>N/A</Text>
            )}
          </View>
        </View>
      </View>

      <View style={{marginBottom: 110}}>
        <FlatList
          data={list?.curriculums}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F8F9FA',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  moduleContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelContainer: {
    width: 120,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  value: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#0E0E64',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
    alignSelf: 'flex-start',
    minWidth: 120,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default CourseDetails;
