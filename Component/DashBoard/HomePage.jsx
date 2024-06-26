import { Dimensions, StyleSheet, Text, View, Image, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native'
import React, { useState } from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import LinearGradient from 'react-native-linear-gradient';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { ScrollView } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';



const HomePage = () => {
  const services = [
    {
      id: "1",
      name: "Policies",
      uri: require('../../assets/HomeScreen/h1.png')
    },
    {
      id: "2",
      name: "News",
      uri: require('../../assets/HomeScreen/h2.png')
    },
    {
      id: "3",
      name: "Payslip",
      uri: require('../../assets/HomeScreen/h3.png')
    }]

  {/* This is Services card List */ }

  const renderServicesList = ({ item }) => (
    <View>
      <Image style={{ height: responsiveHeight(18), width: responsiveWidth(35), resizeMode: "contain", overflow: 'hidden' }} source={item.uri} />
      <Text style={{ position: 'absolute', bottom: 5, alignSelf: 'center', fontSize: responsiveFontSize(2.5), color: '#fff', fontWeight: '500' }}>{item.name}</Text>
    </View>
  );

  {/* THis code is less more */ }

  const [expandedholiday, setExpandedHoliday] = useState(false);
  const toggleExpandedHoliday = () => {
    setExpandedHoliday(!expandedholiday);
  };

  const [expandedapplyleave, setExpandedApplyLeave] = useState(false);
  const toggleExpandedApplyLeave = () => {
    setExpandedApplyLeave(!expandedapplyleave);
  };

  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };


  const [selected, setSelected] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false)

  {/* THis code is less more */ }

  const [expandedprofile, setExpandedProfile] = useState(false);


  const toggleExpandedProfile = () => {
    setExpandedProfile(!expandedprofile);
  };

  return (
    <>
      <View style={{flex:1, backgroundColor:"#fff"}}>
        <View style={styles.parent}>
          <View style={styles.child}>
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 15 }}>
              <View style={{ backgroundColor: "#00f0ff", height: 120, width: 120, borderRadius: 150, justifyContent: "center", alignItems: "center" }}>
                <Image style={{ height: 60, width: 60, resizeMode: "contain", alignSelf: "center" }} source={require('../../assets/HomeScreen/user.png')} />
              </View>
              <View style={{ marginHorizontal: 15 }}>
                <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>Hello, xyz</Text>
                <Text style={{ color: "#fff", fontSize: 18, }}>Friday, 5 Aprill 2024</Text>
              </View>
            </View>
          </View>
        </View>

        {/* This is map function using */}

        {/* {
          services?.map((elements, index) => {
            return (
              <View style={{  }}>
                <View key={index}>
                  <View><Image style={{ height: 100, width: 100 }} source={elements.uri} /></View>
                </View>
              </View>
            )
          })

        } */}

        {/* This is Services list */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginBottom: 100, width: responsiveWidth(95), alignSelf: "center", marginTop: responsiveHeight(2) }}>
            <FlatList horizontal showsHorizontalScrollIndicator={false}
              data={services}
              renderItem={renderServicesList}
              keyExtractor={item => item.id}
            />

            {/* This is Punch in & Punch out */}
            <View style={{ marginBottom: responsiveHeight(1), padding: 20, backgroundColor: "#0E0E64", borderColor: "#0433DA", borderRadius: 20, borderWidth: 5, flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
              <View>
                <Text style={{ color: "#00f0ff", fontSize: 18, marginBottom: 5 }}>Friday</Text>
                <Text style={{ color: "#00f0ff", fontSize: 18, marginTop: 5 }}>05-04-2024</Text>
              </View>
              <View style={{ borderColor: "#00f0ff", borderWidth: 1, }}></View>
              <View>
                <Text style={{ color: "#00f0ff", fontSize: 18, marginBottom: 5, width: responsiveWidth(35), textAlign: "center" }}>09:30:00</Text>
                <TouchableOpacity style={{ backgroundColor: "#00f0ff", borderRadius: 20, }}>
                  <Text style={{ textAlign: "center", color: "#000", padding: 8, fontSize: 18, }}>Punch in</Text>
                </TouchableOpacity>
              </View>

            </View>

            {/* This is apply leave  */}
            <View>
              <View style={{ backgroundColor: "#AA9AFD", marginTop: responsiveHeight(1), borderTopLeftRadius: 10, borderBottomLeftRadius: expandedapplyleave == true ? 0 : 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                <View style={{ width: "98%", marginLeft: "2%", backgroundColor: "#fff", opacity: 1, elevation: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: expandedapplyleave == true ? 0 : 10, borderTopRightRadius: 10, borderBottomRightRadius: expandedapplyleave == true ? 0 : 10, padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <LinearGradient style={{ padding: 10, borderRadius: 10 }} colors={['#AA9AFD', '#8370ED',]}>
                    <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/h5.png')} />
                  </LinearGradient>
                  <Text style={{ color: "#000", fontSize: responsiveFontSize(2.3) }}>Apply Leave</Text>
                  <TouchableOpacity onPress={toggleExpandedApplyLeave}>
                    {
                      expandedapplyleave ?
                        <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/up.png')} />
                        :
                        <>
                          <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/down.png')} />

                        </>
                    }
                  </TouchableOpacity>
                </View>
              </View>
              {
                expandedapplyleave ?
                  <View style={{ backgroundColor: "#AA9AFD", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                    <View style={{ width: "98%", marginLeft: "2%", backgroundColor: "#fff", borderTopLeftRadius: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                      <View style={{ width: "80%", flexDirection: "row", marginTop: responsiveHeight(3), }}>
                        <View style={{ alignItems: "center", marginHorizontal: responsiveWidth(2) }}>
                          <View style={{ backgroundColor: "#0E0E64", borderRadius: 100, height: 60, width: 60, justifyContent: "center" }}>
                            <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>8</Text>
                            <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>JAN</Text>
                          </View>
                          <Image style={{ height: 50, width: 50, }} source={require('../../assets/ApplyLeave/arrow-down.png')} />
                          <View style={{ backgroundColor: "#0E0E64", borderRadius: 100, height: 60, width: 60, justifyContent: "center" }}>
                            <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>10</Text>
                            <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>JAN</Text>
                          </View>
                          <Text style={{ color: "#0E0E64", fontSize: 18, marginTop: responsiveHeight(1) }}>3 Days</Text>
                        </View>
                        <View style={{ marginHorizontal: responsiveWidth(2) }}>
                          <Calendar style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: "#fff", elevation: 7, width: responsiveWidth(70) }}
                            onDayPress={day => {
                              setSelected(day.dateString);
                            }}
                            markedDates={{
                              [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                            }}
                          />
                        </View>
                      </View>
                      {/* This is profile details */}
                      <View style={{ alignSelf: "center", marginTop: responsiveHeight(1), borderTopLeftRadius: 10, borderBottomLeftRadius: expandedprofile == true ? 0 : 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                        <View style={{ marginBottom: expandedprofile == true ? 0 : 8, width: "95%", backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, borderTopLeftRadius: 50, borderBottomLeftRadius: expandedprofile == true ? 0 : 50, borderTopRightRadius: 50, borderBottomRightRadius: expandedprofile == true ? 0 : 50, padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                          <Text style={{ color: "#000", fontSize: responsiveFontSize(2.3) }}>Select Leave Type</Text>
                          <TouchableOpacity onPress={toggleExpandedProfile}>
                            {
                              expandedprofile ?
                                <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/up.png')} />
                                :
                                <>
                                  <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/down.png')} />

                                </>
                            }
                          </TouchableOpacity>
                        </View>
                        {
                          expandedprofile ?
                            <View style={{ marginBottom: expandedprofile == true ? 8 : 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                              <View style={{ borderTopWidth: expandedprofile == true ? 0 : 2, backgroundColor: "#EDFBFE", borderTopLeftRadius: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10, marginVertical: 8 }}>
                                  <View style={{}}>
                                    <Text style={{ color: "#000", fontSize: 20, fontWeight: "500" }}>Monday</Text>
                                    <Text style={{ color: "#000", fontSize: 18 }}>08-04-2024</Text>
                                  </View>
                                  <View style={{}}>
                                    <Image style={{ color: "#000", fontSize: 20, fontWeight: "500", height: 30, width: 30, alignSelf: "center" }} source={require('../../assets/HomeScreen/clock.png')} />
                                    <Text style={{ color: "#000", fontSize: 18, textAlign: "center" }}>08:20</Text>
                                  </View>
                                </View>
                              </View>
                            </View> :
                            null
                        }

                        <View style={{ borderRadius: 30, marginBottom: 8, padding: 5, backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, }}>
                          <TextInput
                            placeholder='Emergency Contact Number'
                          />
                        </View>
                        <View style={{ borderRadius: 30, marginBottom: 8, padding: 5, backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, }}>
                          <TextInput
                            placeholder='Notes'
                            numberOfLines={6}
                            textAlignVertical={'top'}
                          />
                        </View>
                        <View style={{ flexDirection: "row" }}>
                          <CheckBox
                            disabled={false}
                            value={toggleCheckBox}
                            onValueChange={(newValue) => setToggleCheckBox(newValue)}
                          />
                          <Text style={{ alignSelf: "center", fontSize: 16, color: "#000" }}>I accept leave policy</Text>
                        </View>
                      </View>

                      <TouchableOpacity style={{ marginBottom: 5, backgroundColor: "#0433DA", padding: 18, width: "90%", alignSelf: "center", borderRadius: 50 }}>
                        <Text style={{ textAlign: "center", color: "#fff", fontSize: 18, fontWeight: "bold" }}>Submit</Text>
                      </TouchableOpacity>


                    </View>
                  </View> :
                  null
              }
            </View>

            {/* This is Holiday management */}
            <View>
              <View style={{ backgroundColor: "#8AEBC3", marginTop: responsiveHeight(1), borderTopLeftRadius: 10, borderBottomLeftRadius: expandedholiday == true ? 0 : 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                <View style={{ width: "98%", marginLeft: "2%", backgroundColor: "#fff", opacity: 1, elevation: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: expandedholiday == true ? 0 : 10, borderTopRightRadius: 10, borderBottomRightRadius: expandedholiday == true ? 0 : 10, padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <LinearGradient style={{ padding: 10, borderRadius: 10 }} colors={['#8AEBC3', '#39CB8E',]}>
                    <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/calendar.png')} />
                  </LinearGradient>
                  <Text style={{ color: "#000", fontSize: responsiveFontSize(2.3) }}>Holiday Management</Text>
                  <TouchableOpacity onPress={toggleExpandedHoliday}>
                    {
                      expandedholiday ?
                        <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/up.png')} />
                        :
                        <>
                          <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/down.png')} />

                        </>
                    }
                  </TouchableOpacity>
                </View>
              </View>
              {
                expandedholiday ?
                  <View style={{ backgroundColor: "#8AEBC3", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                    <View style={{ width: "98%", marginLeft: "2%", backgroundColor: "#fff", borderTopLeftRadius: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                      {/* <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10, marginVertical: 8 }}>
                      <View style={{}}>
                        <Text style={{ color: "#000", fontSize: 20, fontWeight: "500" }}>Monday</Text>
                        <Text style={{ color: "#000", fontSize: 18 }}>08-04-2024</Text>
                      </View>
                      <View style={{}}>
                        <Image style={{ color: "#000", fontSize: 20, fontWeight: "500", height: 30, width: 30, alignSelf: "center" }} source={require('../../assets/HomeScreen/clock.png')} />
                        <Text style={{ color: "#000", fontSize: 18, textAlign: "center" }}>08:20</Text>
                      </View>
                    </View> */}


                      <Calendar style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: "#fff", }}
                        onDayPress={day => {
                          setSelected(day.dateString);
                        }}
                        markedDates={{
                          [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                        }}
                      />
                      <View style={{ marginHorizontal: responsiveWidth(5) }}>
                        <Text style={{ color: "#000", marginVertical: 10, fontSize: 18 }}>Holiday of the month</Text>
                        <View style={{ height: responsiveHeight(10), borderRadius: 15, flexDirection: "row", backgroundColor: "#fff", elevation: 2, marginBottom: 5 }}>
                          <View style={{ marginLeft: 20, backgroundColor: "#0E0E64", height: 70, width: 50, justifyContent: "center", borderBottomRightRadius: 30, borderBottomLeftRadius: 30 }}>
                            <Image style={{ height: 30, width: 30, resizeMode: "contain", alignSelf: "center" }} source={require('../../assets/HomeScreen/calendar.png')} />
                          </View>
                          <View style={{ marginLeft: 20, justifyContent: "center" }}>
                            <Text style={{ color: "#000", fontSize: 18 }}>Weekend</Text>
                            <Text style={{ color: "#000", fontSize: 18 }}>2024-03-07</Text>
                          </View>
                        </View>
                      </View>


                    </View>
                  </View> :
                  null
              }
            </View>

            {/* This is recent attendence */}
            <View>
              <View style={{ backgroundColor: "#FABED7", marginTop: responsiveHeight(1), borderTopLeftRadius: 10, borderBottomLeftRadius: expanded == true ? 0 : 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                <View style={{ width: "98%", marginLeft: "2%", backgroundColor: "#fff", opacity: 1, elevation: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: expanded == true ? 0 : 10, borderTopRightRadius: 10, borderBottomRightRadius: expanded == true ? 0 : 10, padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <LinearGradient style={{ padding: 10, borderRadius: 10 }} colors={['#FABED7', '#FF94C3',]}>
                    <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/recentattendance.png')} />
                  </LinearGradient>
                  <Text style={{ color: "#000", fontSize: responsiveFontSize(2.3) }}>Recent Attendance</Text>
                  <TouchableOpacity onPress={toggleExpanded}>
                    {
                      expanded ?
                        <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/up.png')} />
                        :
                        <>
                          <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../assets/HomeScreen/down.png')} />

                        </>
                    }
                  </TouchableOpacity>
                </View>
              </View>
              {
                expanded ?
                  <View style={{ backgroundColor: "#FABED7", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                    <View style={{ width: "98%", marginLeft: "2%", backgroundColor: "#fff", borderTopLeftRadius: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                      <View style={{ flex: 1, borderColor: '#4148fe', borderTopWidth: 0.8, }}></View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10, marginVertical: 8 }}>
                        <View style={{}}>
                          <Text style={{ color: "#000", fontSize: 20, fontWeight: "500" }}>Monday</Text>
                          <Text style={{ color: "#000", fontSize: 18 }}>08-04-2024</Text>
                        </View>
                        <View style={{}}>
                          <Image style={{ color: "#000", fontSize: 20, fontWeight: "500", height: 30, width: 30, alignSelf: "center" }} source={require('../../assets/HomeScreen/clock.png')} />
                          <Text style={{ color: "#000", fontSize: 18, textAlign: "center" }}>08:20</Text>
                        </View>
                      </View>
                    </View>
                  </View> :
                  null
              }
            </View>
          </View>
        </ScrollView>
      </View>
    </>


  )
}

export default HomePage

const styles = StyleSheet.create({
  parent: {
    height: '25%',
    width: '100%',
    transform: [{ scaleX: 2 }],
    borderBottomStartRadius: 200,
    borderBottomEndRadius: 200,
    overflow: 'hidden'
  },
  child: {
    flex: 1,
    transform: [{ scaleX: 0.5 }],
    backgroundColor: '#0E0E64',
    justifyContent: 'center',
  }
})