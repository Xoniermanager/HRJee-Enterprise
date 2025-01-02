import React from 'react'
import CardSkeleton from "./CardStyle/CardSkeleton"
import { View, Text } from "react-native"
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { ScrollView } from 'react-native-gesture-handler'
import CardSkeletonBorder from './CardStyle/CardSkeletonBorder'
import CardSkeletonTextFieldBorderRadious from './CardStyle/CardSkeletonTextFieldBorderRadious'

function ProfileDetails() {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 10, borderRadius: 100, marginVertical: 5, alignSelf: "center" }}>
                <CardSkeletonBorder height={120} width={120}  // Pass the borderRadius prop here
                />
            </View>
            <View style={{ alignSelf: "center", marginBottom: 12 }}>
                <CardSkeleton height={responsiveHeight(2)} width={responsiveWidth(60)} // Pass the borderRadius prop here
                />
            </View>
            <View style={{ alignSelf: "center", marginBottom: 12 }}>
                <CardSkeleton height={responsiveHeight(3)} width={responsiveWidth(70)} // Pass the borderRadius prop here
                />
            </View>
            <View style={{ alignSelf: "center", marginBottom: 12 }}>
                <CardSkeleton height={responsiveHeight(5)} width={responsiveWidth(80)} // Pass the borderRadius prop here
                />
            </View>
            <View style={{ alignSelf: "center", marginBottom: 12 }}>
                <CardSkeleton height={responsiveHeight(5)} width={responsiveWidth(80)} // Pass the borderRadius prop here
                />
            </View>
            <View style={{ alignSelf: "center", marginBottom: 12 }}>
                <CardSkeleton height={responsiveHeight(5)} width={responsiveWidth(80)} // Pass the borderRadius prop here
                />
            </View>
            <View style={{ alignSelf: "center", marginBottom: 12 }}>
                <CardSkeleton height={responsiveHeight(5)} width={responsiveWidth(80)} // Pass the borderRadius prop here
                />
            </View>
            <View style={{ alignSelf: "center", marginBottom: 12 }}>
                <CardSkeleton height={responsiveHeight(5)} width={responsiveWidth(80)} // Pass the borderRadius prop here
                />
            </View>
            <View style={{ alignSelf: "center", marginBottom: 12 }}>
                <CardSkeleton height={responsiveHeight(5)} width={responsiveWidth(80)} // Pass the borderRadius prop here
                />
            </View>
            <View style={{ alignSelf: "center", marginBottom: 12 }}>
                <CardSkeleton height={responsiveHeight(5)} width={responsiveWidth(80)} // Pass the borderRadius prop here
                />
            </View>
            <View style={{ alignSelf: "center", marginTop:30}}>
                <CardSkeletonTextFieldBorderRadious height={responsiveHeight(5)} width={responsiveWidth(80)} // Pass the borderRadius prop here
                />
            </View>
            

        </View>

    )
}


export default ProfileDetails