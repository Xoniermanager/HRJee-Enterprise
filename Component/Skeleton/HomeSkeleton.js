import React from 'react'
import CardSkeleton from "./CardStyle/CardSkeleton"
import { View, Text } from "react-native"
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { ScrollView } from 'react-native-gesture-handler'
import CardBottomRadius from './CardStyle/CardBottomRadius'
import CardSkeletonTextFieldBorderRadious from './CardStyle/CardSkeletonTextFieldBorderRadious'

function HomeSkeleton() {
    return (
        <View style={{ flex: 1, backgroundColor: "#26262D" }}>
            <View>
                <View style={{ padding: 10, borderRadius: 100 }}>
                    <CardBottomRadius height={responsiveHeight(20)} width={responsiveWidth(95)} />
                </View>
                <View >
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
                    <View style={{ alignSelf: "center", marginBottom: 8 }}>
                        <CardSkeletonTextFieldBorderRadious height={responsiveHeight(12)} width={responsiveWidth(92)} />
                    </View>
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

        </View>

    )
}

export default HomeSkeleton