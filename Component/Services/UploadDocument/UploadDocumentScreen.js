import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,    
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Root, Popup} from 'popup-ui';
import {useNavigation} from '@react-navigation/native';
import {BASE_URL} from '../../../utils';
import {listdocument} from '../../../APINetwork/ComponentApi';

const UploadDocumentScreen = () => {
  const [loader, setLoader] = useState(false);
  const [documents, setDocuments] = useState([]);
  const navigation = useNavigation();

  const getListDocument = async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/config/required-documents`;
      const response = await listdocument(url, token);
      const apiDocs = response?.data?.data?.map(item => ({
        id: item.id,
        title: item.name,
        is_mandatory: item.is_mandatory,
        file: null,
      }));
      setDocuments(apiDocs || []);
    } catch (error) {
      console.log('Error fetching documents:', error);
      Alert.alert('Error', 'Failed to load document list.');
    }
  };

  useEffect(() => {
    getListDocument();
  }, []);

  const pickDocument = async index => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.allFiles,
      });
      const updated = [...documents];
      updated[index].file = result;
      setDocuments(updated);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to pick document');
      }
    }
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('TOKEN');

    for (let doc of documents) {
      if (doc.is_mandatory === 1 && !doc.file) {
        return Alert.alert(
          'Validation Error',
          `Please upload the required document: "${doc.title}"`,
        );
      }
    }

    setLoader(true);
    const formData = new FormData();
    console.log(documents, 'documents');
    documents.forEach(doc => {
      if (doc.file) {
        formData.append(`documents[${doc.id}]`, {
          uri: doc.file.uri,
          name: doc.file.name,
          type: doc.file.type,
        });
      }
    });
    console.log(formData);
    try {
      const response = await axios.post(
        `${BASE_URL}/update/documents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      Popup.show({
        type: 'Success',
        title: 'Upload Successful',
        textBody: response.data.message,
        buttonText: 'OK',
        callback: () => {
          Popup.hide();
          navigation.goBack();
        },
      });
    } catch (error) {
      console.log('Upload error:', error?.response || error.message);
      if (error.response && error.response.status === 401) {
        console.log(error.response.data);
        Popup.show({
          type: 'Warning',
          title: 'Session Expired',
          textBody: error.response.data.message,
          buttonText: 'Login',
          callback: () => {
            Popup.hide();
          },
        });
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoader(false);
    }
  };

  return (
    <Root>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.pageTitle}>Upload Documents</Text>

        {documents?.map((doc, index) => (
          <View key={doc.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.fixedTitle}>{doc.title}</Text>
              {doc.is_mandatory === 1 && (
                <Text style={styles.mandatoryLabel}>*Required</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickDocument(index)}>
              <AntDesign name="pluscircle" size={20} color="#0E0E64" />
              <Text style={styles.uploadText}>
                {doc.file ? doc.file.name : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loader}>
          {loader ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </Root>
  );
};

export default UploadDocumentScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fixedTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    paddingBottom: 4,
    marginRight: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  mandatoryLabel: {
    color: 'red',
    fontWeight: 'bold',
  },
  uploadButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadText: {
    marginLeft: 10,
    color: '#0E0E64',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#0E0E64',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 60,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
