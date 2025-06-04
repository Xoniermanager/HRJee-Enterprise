import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
const Reload = () => {
  const [loaderModal, setLoaderModal] = useState(true);
  return (
    <View style={styles.container}>
     <ActivityIndicator size="large" color="#0433DA"  />
    </View>
  )
}
export default Reload
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})