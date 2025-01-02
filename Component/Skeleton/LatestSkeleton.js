import React from 'react'
import CardSkeleton from './CardStyle/CardSkeleton'
import {View,ScrollView} from "react-native"

function LatestSkeleton() {
  return (
    <ScrollView style={{flex:1,backgroundColor:"#26262D",padding:10,}}>
    <View style={{marginVertical:10,alignItems:'center'}}>
    <CardSkeleton height={24} width={175} borderRadius={5} />
    </View>
    <View style={{alignItems:'center'}}>
    <CardSkeleton height={4} width={66} borderRadius={50} />
    </View>
    <View style={{marginVertical:20,alignItems:'center'}}>
    <CardSkeleton height={319} width={273} borderRadius={5} />
    </View>  
    <View style={{alignItems:'center'}}>
    <CardSkeleton height={42} width={273} borderRadius={5} />
    </View> 
    </ScrollView>
  )
}

export default LatestSkeleton