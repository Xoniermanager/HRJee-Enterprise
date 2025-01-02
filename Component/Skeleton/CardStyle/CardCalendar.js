import { View, Text, Animated, StyleSheet, Easing } from 'react-native'
import React, { useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient)

const CardCalendar = ({ height, width }) => {
    const animatedValue = new Animated.Value(0)

    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear.inOut,
                useNativeDriver: true
            })).start()
    }, [])

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width]
    })

    return (
        <View style={{
            backgroundColor: "#a0a0a0", height: height, width: width, transform: [{ scaleX: 2 }],
            borderTopLeftRadius: 50, borderTopRightRadius:50,
            overflow: 'hidden'
        }}>
            <AnimatedLG colors={["#a0a0a0", "#b0b0b0", "#b0b0b0", "#a0a0a0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ ...StyleSheet.absoluteFill, transform: [{ translateX: translateX }] }}
            />
        </View>
    )
}

export default CardCalendar
