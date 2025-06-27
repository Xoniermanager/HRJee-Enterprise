import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ScrollView,
} from 'react-native';

const SupportPage = () => {
  const [subject, setSubject] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    alert('Submitted!');
  };

  const handleCall = () => {
    Linking.openURL('tel:+919044984373');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="Please enter subject"
          placeholderTextColor="#666"
          value={subject}
          onChangeText={setSubject}
        />

        <Text style={[styles.label, { marginTop: 20 }]}>Comment</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Put your comment here....."
          placeholderTextColor="#666"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={5}
        />

        <Text style={styles.note}>
          * You will get an email after submission
        </Text>

        <Text style={styles.supportText}>
          For urgent issues, contact support:
        </Text>
        <TouchableOpacity onPress={handleCall}>
          <Text style={styles.supportNumber}>+91-9044984373</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SupportPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#e6f0ff',
    // justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 8,
    color: '#000',
  },
  textArea: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'top',
  },
  note: {
    marginTop: 16,
    fontSize: 13,
    color: '#555',
  },
  supportText: {
    marginTop: 10,
    fontSize: 14,
    color: '#000',
  },
  supportNumber: {
    fontSize: 15,
    color: '#0E0E64',
    fontWeight: 'bold',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#0E0E64',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
