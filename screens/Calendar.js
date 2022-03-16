import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {MyCalendar} from '../utils/myCalendar';
// import { _MyCalendar } from "../utils/myCalendar/CalendarWithFlatlist";
// import { MyCalendar2 } from "../utils/myCalendar/2Calendar";


export const CalendarScreen = () => {
  const [selected, setSelected] = useState();

  // console.log('dateNow--', new Date());
  return (
    <View style={[styles.screen]}>
      <ScrollView contentContainerStyle={{flex: 1}}>
        <MyCalendar />
        {/*<MyCalendar2 />*/}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
