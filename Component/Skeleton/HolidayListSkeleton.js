import React from 'react'
import CardSkeleton from "./CardStyle/CardSkeleton"
import { View, Text } from "react-native"
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { ScrollView } from 'react-native-gesture-handler'
import CardSkeletonBorder from './CardStyle/CardSkeletonBorder'
import CardSkeletonTextFieldBorderRadious from './CardStyle/CardSkeletonTextFieldBorderRadious'

function HolidayListSkeleton() {
    return (

        <View style={{ alignSelf: "center", marginHorizontal: responsiveWidth(5), marginTop: responsiveHeight(1) }}>
            {[...Array(5)].map((_, index) => (
                <View style={{ marginBottom: 5, }} key={index}>
                    <CardSkeletonTextFieldBorderRadious height={responsiveHeight(10)} width={responsiveWidth(80)} // Pass the borderRadius prop here
                    />
                </View>
            ))}

        </View>


    )
}


export default HolidayListSkeleton