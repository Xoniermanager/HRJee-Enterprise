import React from 'react'
import CardSkeleton from "./CardStyle/CardSkeleton"
import { View, Text } from "react-native"
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { ScrollView } from 'react-native-gesture-handler'
import CardCommonBottomAllScreen from './CardStyle/CardCommonBottomAllScreen'
import CardSkeletonTextFieldBorderRadious from './CardStyle/CardSkeletonTextFieldBorderRadious'
function AccountSkeleton() {
    return (
        <View style={{ flex: 1, backgroundColor: "#26262D" }}>
            <View style={{ padding: 10, borderRadius: 100, marginVertical: 10, alignSelf: "center" }}>
                <CardCommonBottomAllScreen height={200} width={responsiveWidth(50)}  // Pass the borderRadius prop here
                />
            </View>
            <View style={{ alignSelf: "center", marginBottom: 10 }}>
                <CardSkeleton height={responsiveHeight(3)} width={responsiveWidth(80)} // Pass the borderRadius prop here
                />
            </View>
            <View>
                <ScrollView
                    horizontal
                    style={{ padding: 10, marginHorizontal: 20 }}
                >


                    <View style={{}}>
                        <CardSkeleton height={responsiveHeight(15)} width={responsiveWidth(25)} />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <CardSkeleton height={responsiveHeight(15)} width={responsiveWidth(25)} />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <CardSkeleton height={responsiveHeight(15)} width={responsiveWidth(25)} />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <CardSkeleton height={responsiveHeight(15)} width={responsiveWidth(25)} />
                    </View>

                </ScrollView>

                <View style={{ alignSelf: "center", marginVertical: 8 }}>
                    <CardSkeletonTextFieldBorderRadious height={responsiveHeight(8)} width={responsiveWidth(92)} />
                </View>
                <View style={{ alignSelf: "center", marginVertical: 8 }}>
                    <CardSkeletonTextFieldBorderRadious height={responsiveHeight(8)} width={responsiveWidth(92)} />
                </View>
                <View style={{ alignSelf: "center", marginVertical: 8 }}>
                    <CardSkeletonTextFieldBorderRadious height={responsiveHeight(8)} width={responsiveWidth(92)} />
                </View>
            </View>

        </View>

    )
}


export default AccountSkeleton