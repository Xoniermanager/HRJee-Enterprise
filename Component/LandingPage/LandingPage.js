import {
  StyleSheet,
  Text,
  ImageBackground,
  StatusBar,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme
} from 'react-native';
import React from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';


const LandingPage = ({ navigation }) => {
  const theme = useColorScheme();
  console.log(theme)
  return (
    <>
      <View style={styles.container}>
        <Image
          style={{
           resizeMode:'contain',
            alignSelf: 'center',
            height: responsiveHeight(35),
            width: responsiveWidth(55),
            marginTop: responsiveHeight(5)
            
          }}
          source={require('../../assets/logo.png')}
        />
        <Text
          style={{
            color: '#fff',
            fontWeight: '900',
            fontSize: responsiveHeight(3.57375),
            textAlign: 'center',
            marginTop: responsiveHeight(5)
          }}>
          Welcome to HRJee
        </Text>
        {/* <Text
          style={[{
            color: '#fff',
            fontSize: responsiveHeight(2.085),
            textAlign: 'center',
            marginVertical: 15,
          }]}>
          We help you make your health better
        </Text> */}
        <TouchableOpacity
          onPress={() => navigation.navigate('LoginScreen')}
          activeOpacity={0.8}
          style={styles.btn_style}>
          <Text
            style={{
              fontSize: responsiveHeight(2),
              textAlign: 'center',
              color: '#fff',
              fontWeight: 'bold',
            }}>
            Login
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
          style={{
            height:responsiveHeight(8),
            borderRadius: responsiveWidth(6),
            justifyContent:"center",
            marginHorizontal:responsiveWidth(13),
            marginTop: responsiveHeight(2),
            borderWidth:1,
            borderColor:"#fff"
          }}>
          <Text
           style={{
            fontSize: responsiveHeight(2),
            textAlign: 'center',
            color: '#fff',
            fontWeight: 'bold',
          }}>
            Login
          </Text>
        </TouchableOpacity> */}
      </View>
    </>
  );
};

export default LandingPage;

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"#0E0E64"
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  linearGradient: {
    flex: 1,
    justifyContent: 'center',
  },
  btn_style: {
    width: '90%',
    marginTop: 30,
    backgroundColor: "#0433DA",
    padding: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:"center"
  },
});
