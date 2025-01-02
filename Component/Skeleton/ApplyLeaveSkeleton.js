import React from 'react'
import CardSkeleton from "./CardStyle/CardSkeleton"
import { View, Text } from "react-native"
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { ScrollView } from 'react-native-gesture-handler'
import CardSkeletonBorder from './CardStyle/CardSkeletonBorder'
import CardSkeletonTextFieldBorderRadious from './CardStyle/CardSkeletonTextFieldBorderRadious'
import CardCalendar from './CardStyle/CardCalendar'
import Card4BoxBorder from './CardStyle/Card4BoxBorder'

function ApplyLeaveSkeleton() {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ margin: 5 }}>
                <View style={{ flexDirection: "row", marginTop: responsiveHeight(3) }}>
                    <View style={{}}>
                        <Text></Text>
                        <CardSkeletonBorder height={100} width={100} // Pass the borderRadius prop here
                        />
                        <Text></Text>
                        <CardSkeletonBorder height={100} width={100}  // Pass the borderRadius prop here
                        />
                    </View>
                    <View style={{ marginLeft: 78, alignSelf: "center", }}>
                        <CardCalendar height={responsiveHeight(33)} width={responsiveWidth(33)} // Pass the borderRadius prop here
                        />
                    </View>
                </View>
                <View style={{marginLeft:15, marginTop:8 }}>
                    <CardSkeleton height={responsiveHeight(3)} width={responsiveWidth(60)} // Pass the borderRadius prop here
                    />
                </View>
                <View style={{ alignSelf:"center", marginTop:8 }}>
                    <CardSkeleton height={responsiveHeight(4)} width={responsiveWidth(90)} // Pass the borderRadius prop here
                    />
                </View>
                <View style={{ alignSelf:"center", marginTop:8 }}>
                    <CardSkeletonTextFieldBorderRadious height={responsiveHeight(15)} width={responsiveWidth(92)} // Pass the borderRadius prop here
                    />
                </View>
                <View style={{ alignSelf:"center", marginTop:8 }}>
                    <CardSkeletonTextFieldBorderRadious height={responsiveHeight(7)} width={responsiveWidth(90)} // Pass the borderRadius prop here
                    />
                </View>
            </View>
        </View>

    )
}


export default ApplyLeaveSkeleton