import { Platform, StyleSheet } from 'react-native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
  } from 'react-native-responsive-dimensions';
import Themes from '../Theme/Theme';
const LoginGuestStyle = StyleSheet.create({
    contanier: {
        flex: 1,
        backgroundColor:'#0E0E64'
      },
      Img_icon: {
        alignSelf: 'center',
        marginTop:30,
        height: responsiveHeight(25), width: responsiveWidth(45), resizeMode:"contain"
      },
      LoginGuest_Text: {
        textAlign: 'center',
        color: '#fff',
        fontSize:responsiveFontSize(3),
        fontWeight: '600',
        marginTop: 10,
      },
      Phone_number: {
        color: '#fff',
        fontSize: responsiveFontSize(1.8),
        fontWeight: '400',
        marginHorizontal: 50,
        marginTop: 10,
      },
      Input_Text: {
        width: responsiveWidth(79),
        borderRadius: 20,
        alignSelf: 'center',
        backgroundColor: '#fff',
        marginTop: 7,
        padding: 10,
        color: '#000',
      },
      submit_button: {
        width: responsiveWidth(79),
        borderRadius: 20,
        alignSelf: 'center',
        backgroundColor: '#0433DA',
        marginTop: responsiveHeight(3),
        height: responsiveHeight(5.25),
        justifyContent: 'center',
        alignItems: 'center',
      },
      submit_text: {
        color: '#fff',
        fontSize: responsiveFontSize(2),
        fontWeight: '400',
      },
      account_text:{
        flexDirection:'row',
        marginTop:7,
        justifyContent:'center'
      },
      account:{
        color:'#000',
        fontSize:responsiveFontSize(1.87),
    
      },
      register_Text:{
        color:'#000',
        fontSize:responsiveFontSize(2),
        fontWeight:'600',
        textDecorationLine:'underline'
      },
      GuestLogin:{
        color:'#BA3028',
        fontSize:responsiveFontSize(2),
        fontWeight:'600',
        textDecorationLine:'underline'
      },
      forget:{
        fontSize:responsiveFontSize(1.5),
        textAlign:'right',
        fontWeight:'400',
        marginTop:10,
        color:'#fff',
        marginRight:48,
        textDecorationLine:'underline',
        
    },
    profileAdd:{
      width:responsiveWidth(30),
      height:responsiveHeight(15),
      borderWidth:1,
      borderColor:'#37496E',
      borderRadius:100,
     alignSelf:'center',
     position:'relative'
    },
    imges:{
      width:responsiveWidth(30),
      height:responsiveHeight(15),
      borderRadius:100,
      alignSelf:'center'
    },
    gallery:{
      width:30,
      height:30,
     
    },
    gallery_box:{
      position:'absolute',
      alignSelf:"flex-end"
    },
    error: {
      color: 'red',
      marginBottom: 8,
      textAlign:'center'
    },
    passInput:{
      width: responsiveWidth(79),
      borderRadius: 20,
      alignSelf: 'center',
      backgroundColor: '#fff',
      marginTop: 7,
      padding:Platform.OS === 'ios' ? 12 : 2,
      color: '#000',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between'

    },
    InputPassword:{
      width: responsiveWidth(68),
      color: Themes == 'dark' ? '#000' : '#000',
      marginLeft:2
    
    },
    modalContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      width: '100%',
      flex:1
    },
    modalContent: {
      width: '80%',
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
      color: '#000',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      marginBottom: 10,
      color: '#000',
    },
  
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    saveButton: {
      backgroundColor: '#0043ae',
      padding: 10,
      borderRadius: 5,
      flex: 1,
      marginRight: 5,
    },
    closeButton: {
      backgroundColor: '#dc3545',
      padding: 10,
      borderRadius: 5,
      flex: 1,
      marginLeft: 5,
    },
    buttonText: {color: '#fff', textAlign: 'center', fontWeight: 'bold'},
  

});
export default LoginGuestStyle;