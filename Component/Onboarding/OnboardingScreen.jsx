import {StyleSheet, Text, StatusBar, View, Image} from 'react-native';
import React, {useRef} from 'react';
import Onboarding, {goNext} from 'react-native-onboarding-swiper';
import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const Stack = createNativeStackNavigator();

const OnboardingScreen = () => {
  const onboardingRef = useRef();

  const navigation = useNavigation();
  return (
    <>
      <View style={{flex: 1}}>
        <Onboarding
          onSkip={() => navigation.navigate('LandingPage')}
          onDone={() => navigation.navigate('LandingPage')}
          ref={onboardingRef}
          pages={[
            {
              backgroundColor: '#5A6A77',
              image: (
                <Image
                  source={require('../../assets/newLogo.jpg')}
                  style={{
                    alignSelf: 'center',
                    marginTop: 30,
                    height: 250,
                    width: 250,
                    resizeMode: 'contain',
                    borderRadius: 125,
                  }}
                />
              ),
              title: 'HR is hard, HRJEE is easy',
              subtitle:
                'Create a great place to work at every stage of growth with all-in-one software from HRJEE',
            },
            {
              backgroundColor: '#5A6A77',
              image: (
                <Image
                  source={require('../../assets/newLogo.jpg')}
                  style={{
                    alignSelf: 'center',
                    marginTop: 30,
                    height: 250,
                    width: 250,
                    resizeMode: 'contain',
                    borderRadius: 125,
                  }}
                />
              ),
              title: 'Why HRJEE?',
              subtitle:
                'Hrjee empowers employees to manage their own personal and employment information',
            },
            {
              backgroundColor: '#5A6A77',
              image: (
                <Image
                  source={require('../../assets/newLogo.jpg')}
                  style={{
                    alignSelf: 'center',
                    marginTop: 30,
                    height: 250,
                    width: 250,
                    resizeMode: 'contain',
                    borderRadius: 125,
                  }}
                />
              ),
              title:
                'Hrjee enhances the People-centric focus of HR operations.',
              subtitle:
                'Hrjee is an electronic platform that enables employees to manage their personal HR-related information and tasks without requiring assistance from HR personnel.',
            },
          ]}
        />
      </View>
    </>
  );
};

export default OnboardingScreen;
