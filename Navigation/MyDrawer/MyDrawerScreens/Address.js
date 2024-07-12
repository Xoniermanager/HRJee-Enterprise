import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, FlatList } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Dropdown } from 'react-native-element-dropdown';
import { BASE_URL } from '../../../utils';
import { getAddress, updateAddress } from '../../../APINetwork/ComponentApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import {
  responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';

const Address = () => {
  const [presentCountry, setPresentCountry] = useState();
  const [presentState, setPresentState] = useState();
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])

  const [isBothAddressSame, setIsBothAddressSame] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [localAddress, setLocalAddress] = useState({});

  const handleAddressChange = (id, itemAttributes) => {
    const index = addresses.findIndex(x => x.id == id);

    if (index === -1) {
      console.error(`Item with id ${id} not found`);
      return;
    }

    const updatedAddress = [
      ...addresses.slice(0, index),
      { ...addresses[index], ...itemAttributes },
      ...addresses.slice(index + 1)
    ];

    setAddresses(updatedAddress);
  }

  const handleAddressCheckboxChange = () => {
    setIsBothAddressSame((prev) => !prev);
  }

  /* Api intigration starting */

  useEffect(() => {
    if (isBothAddressSame) {
      setAddresses([addresses[0], { ...addresses[0], address_type: "local" }])
    } else {
      setAddresses([addresses[0], localAddress])
    }
  }, [isBothAddressSame])

  useEffect(() => {
    async function GetAddress() {
      try {

        let token = await AsyncStorage.getItem('TOKEN');
        const url = `${BASE_URL}/user/details`;
        const response = await getAddress(url, token);
        if (response?.data?.status === true) {
          showMessage({
            message: `${response?.data?.message}`,
            type: "success",
          });

          setAddresses(response?.data?.data?.address_details)
          setCountries(response?.data?.data?.countries)
          setStates(response?.data?.data?.states)
          
          response?.data?.data?.address_details?.forEach(element => {
            if (element.address_type == "both_same") {
              setIsBothAddressSame(true);
              setAddresses(response?.data?.data?.address_details[0], response?.data?.data?.address_details[0])
            } else if (element.address_type == "local") {
              setLocalAddress(element)
            }
          });
        }
      } catch (error) {
        console.error('Error making POST request:', error);

      }
    }
    GetAddress();

  }, []);

  const AddressUpdate = async () => {
    try {
      let token = await AsyncStorage.getItem('TOKEN');
      const url = `${BASE_URL}/update/address`; // Your update API endpoint

      let payload = {
        both_same: isBothAddressSame,
      }

      const finalAddresses = addresses.map((element) => {
        return {
          "addressId": element.id,
          "user_id": element.user_id,
          "address_type": element.address_type,
          "country_id": element.country_id,
          "state_id": element.state_id,
          "address": element.address,
          "city": element.city,
          "pin_code": element.pin_code
        }
      });

      payload['address'] = finalAddresses;

      const response = await updateAddress(url, payload, token); // Implement updateAddress function

      console.log("res++++++++++++", payload)

      if (response?.data?.status === true) {
        showMessage({
          message: response?.data?.message,
          type: "success",
        });
        // Handle success case
      } else {
        // Handle error case
        showMessage({
          message: response?.data?.message,
          type: "danger",
        });
        console.log("------", response)
      }
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  };

  /* Api intigration ending */

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignSelf: "center", marginTop: 15, }}>
        <Text style={styles.name}>Address</Text>
      </View>
      <ScrollView style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 40,
        marginTop: responsiveHeight(3),
        borderTopRightRadius: 40
      }}>
        <View style={{ margin: 20 }}>
        <FlatList
          data={addresses}
          renderItem={({ item, index }) => {
            return (
              <View>
                {
                  item?.address_type == "local" ?
                    <>
                      <Text style={{ color: "#0E0E64", marginVertical: 10, fontWeight: "bold", fontSize: 16 }}>Permanent Address</Text>                      
                      <View style={styles.checkboxContainer}>
                        <CheckBox
                          value={isBothAddressSame}
                          onValueChange={() => handleAddressCheckboxChange()}
                        />
                        <Text style={styles.sameAddressText}>Same as present address</Text>                      
                      </View>
                    </>

                    :
                    <Text style={{ color: "#0E0E64", marginVertical: 10, fontWeight: "bold", fontSize: 16 }}>Present Address</Text>}

                <Dropdown
                  data={countries && countries}
                  labelField="name"
                  valueField="id"
                  value={presentCountry ? presentCountry : item?.country_id}
                  onChange={value => handleAddressChange(item.id, { country_id: value.id })}
                  style={styles.input}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextProps={{
                    style: {
                      color: '#000',
                    },
                  }}
                  placeholder="Select Country"
                />
                <Dropdown
                  data={states}
                  labelField="name"
                  valueField="id"
                  value={presentState ? presentState : item?.state_id}
                  onChange={value => handleAddressChange(item.id, { state_id: value.id })}
                  style={styles.input}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextProps={{
                    style: {
                      color: '#000',
                    },
                  }}
                  placeholder="Select State"
                />
                <TextInput
                  value={item?.city}
                  onChangeText={value => handleAddressChange(item.id, { city: value })}
                  placeholder="City"
                  style={styles.input} />
                <TextInput
                  value={item?.address}
                  onChangeText={value => handleAddressChange(item.id, { address: value })}
                  placeholder="Address"
                  style={styles.input}
                />
              </View>

            )
          }}
        />
        <TouchableOpacity onPress={() => AddressUpdate()} style={styles.updateButton} >
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#2E248B',
    padding: 16,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E248B',
    marginTop: 16,
  },
  dropdown: {
    height: 50,
    backgroundColor: '#E1F6F4',
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  input: {
    height: 50,
    borderColor: '#E1F6F4',
    borderWidth: 1,
    backgroundColor: '#E1F6F4',
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0A58ED',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: '#0052cc',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 2
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#0E0E64',
  },

  name: {
    color: '#fff',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom: responsiveHeight(0)
  },
  checkbox: {
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    textColor: "#000"
  },
  updateButton: {
    backgroundColor: '#0052cc',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 2
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sameAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sameAddressText: {
    fontSize: 16,
  },
});
export default Address;

