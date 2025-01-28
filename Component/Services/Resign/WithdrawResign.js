import {
    Image,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
  } from 'react-native';
  import React, {useContext, useState} from 'react';
  import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
  } from 'react-native-responsive-dimensions';
  import {NavigationContainer, useNavigation} from '@react-navigation/native';
  import {ThemeContext} from '../../../Store/ConetxtApi.jsx/ConextApi';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { ApplyResigns, WithdrawResigns } from '../../../APINetwork/ComponentApi';
import { showMessage } from 'react-native-flash-message';
import { BASE_URL } from '../../../utils';
  const WithdrawResign = ({route}) => {
    const navigate=useNavigation();
    const {id}=route?.params;
    const [loader,setLoader]=useState(false)
    const [expandedprofile, setExpandedProfile] = useState(false);
    const {currentTheme} = useContext(ThemeContext);
    const [remark,setRemark]=useState('');
    async function WithdrawApply() {
      try {
        setLoader(true)
        let token = await AsyncStorage.getItem('TOKEN');
        const url = `${BASE_URL}/resignation/${id}/withdraw`;
        const from=0;
        let data = JSON.stringify({
          remark:remark
        });
        const response = await WithdrawResigns(url,data,token,from);
        if (response?.data?.status === true) {
            setLoader(false)
            showMessage({
                message:response.data.message,
                type: "success",
              });
               navigate.goBack()
        } else {
            setLoader(false)
        }
        
      } catch (error) {
        setLoader(false)
        console.error('Error making POST request:', error);
      }
    }
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: currentTheme.background_v2}]}>
        <View
          style={{
            marginTop: 15,
          }}>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: currentTheme.background,
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  marginTop: 10,
                  alignSelf: 'center',
                  marginTop: responsiveHeight(1),
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: expandedprofile == true ? 0 : 10,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                }}>
                <View
                  style={{
                    borderRadius: 30,
                    marginBottom: 8,
                    padding: 5,
                    backgroundColor: currentTheme.inputText_color,
                    opacity: 1,
                    elevation: 10,
                    width: responsiveWidth(90),
                    height:Platform.OS=='ios'? responsiveHeight(20):null
                  }}>
                  <TextInput
                    placeholder="Type Resignation"
                    numberOfLines={6}
                    value={remark}
                    textAlignVertical={'top'}
                    placeholderTextColor={currentTheme.text}
                    onChangeText={(prev)=>setRemark(prev)}
                    color={currentTheme.text}
                    style={{padding:10}}
                  />
                </View>
              </View>
  
              <TouchableOpacity
                onPress={() => WithdrawApply()}
                style={{
                  marginBottom: 5,
                  backgroundColor: currentTheme.background_v2,
                  padding: 18,
                  width: '90%',
                  alignSelf: 'center',
                  borderRadius: 50,
                  marginVertical: 10,
                }}>
             {loader ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text
                    style={{
                      textAlign: 'center',
                      color: '#fff',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    Submit
                  </Text>
                )}
              
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  };
  export default WithdrawResign;
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
      marginBottom: responsiveHeight(3),
    },
  });
  