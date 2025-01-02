import React from 'react'
import CardSkeleton from "./CardStyle/CardSkeleton"
import { View, Text } from "react-native"
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { ScrollView } from 'react-native-gesture-handler'

function AddressDetails() {
    return (
        <View style={{ flex: 1 }}>
            <View style={{margin:20}}>

                <View style={{  marginBottom:10 }}>
                    <CardSkeleton height={responsiveHeight(3)} width={responsiveWidth(50)} // Pass the borderRadius prop here
                    />
                </View>
                <View style={{  marginBottom: 12 }}>
                    <CardSkeleton height={responsiveHeight(4.5)} width={responsiveWidth(90)} // Pass the borderRadius prop here
                    />
                </View>
                <View style={{  marginBottom: 12 }}>
                    <CardSkeleton height={responsiveHeight(4.5)} width={responsiveWidth(90)} // Pass the borderRadius prop here
                    />
                </View>
                <View style={{  marginBottom: 12 }}>
                    <CardSkeleton height={responsiveHeight(4.5)} width={responsiveWidth(90)} // Pass the borderRadius prop here
                    />
                </View>
                <View style={{  marginBottom: 0 }}>
                    <CardSkeleton height={responsiveHeight(4.5)} width={responsiveWidth(90)} // Pass the borderRadius prop here
                    />
                </View>
                <View style={{ marginTop: 15, marginBottom:0 }}>
                    <CardSkeleton height={responsiveHeight(3)} width={responsiveWidth(50)} // Pass the borderRadius prop here
                    />
                </View>
                <View style={{ marginTop: 15, marginBottom:10 }}>
                    <CardSkeleton height={responsiveHeight(3)} width={responsiveWidth(70)} // Pass the borderRadius prop here
                    />
                </View>
                <View style={{  marginBottom: 12 }}>
                    <CardSkeleton height={responsiveHeight(4.5)} width={responsiveWidth(90)} // Pass the borderRadius prop here
                    />
                </View>
                <View style={{  marginBottom: 12 }}>
                    <CardSkeleton height={responsiveHeight(4.5)} width={responsiveWidth(90)} // Pass the borderRadius prop here
                    />
                </View>
                <View style={{  marginBottom: 12 }}>
                    <CardSkeleton height={responsiveHeight(4.5)} width={responsiveWidth(90)} // Pass the borderRadius prop here
                    />
                </View>
                <View style={{  marginBottom: 12 }}>
                    <CardSkeleton height={responsiveHeight(4.5)} width={responsiveWidth(90)} // Pass the borderRadius prop here
                    />
                </View>
                <View style={{  marginBottom: 12 }}>
                    <CardSkeleton height={responsiveHeight(4.5)} width={responsiveWidth(90)} // Pass the borderRadius prop here
                    />
                </View>
                <View style={{  marginBottom: 12, marginTop:20 }}>
                    <CardSkeleton height={responsiveHeight(4.5)} width={responsiveWidth(90)} // Pass the borderRadius prop here
                    />
                </View>
            </View>
        </View>

    )
}


export default AddressDetails