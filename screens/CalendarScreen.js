import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MyCalendar } from '../utils/myCalendar';

export const CalendarScreen = () => {
  const [rangeDate, setRangeDate] = useState({ startDay: null, endDay: null });
  const { startDay, endDay } = rangeDate;

  return (
    <View style={[styles.screen]}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>

        <Text style={{ textAlign: 'center', marginVertical: 16, paddingHorizontal: 20, fontSize: 16, fontWeight: 'bold' }}>
          {`Дата начала - ${startDay || '^-^'}`}
        </Text>
        <Text style={{ textAlign: 'center', marginBottom: 16, paddingHorizontal: 20, fontSize: 16, fontWeight: 'bold' }}>
          {`Дата окончания - ${endDay || '^-^'}`}
        </Text>

        <MyCalendar
          multiSelect
          onChange={setRangeDate}
          possibleMonthLimitProps={12}
          // arrowColor={'#ff0000'}
          // calendarWrapperStyle={{ backgroundColor: '#ffffff' }}
          // ladingColor="#32ADE6"
          // arrowInnerStyle={{ backgroundColor: '#ff1212' }}
          // monthTitleStyle={{ color: '#ff1212' }}
          // weekDayStyles={{ color: '#ff1212' }}
          // dayTextBaseStyle={{ fontSize: 16, color: 'red' }}
          // disabledDayStyle={{ color: 'red' }}
          // dayBorderRangeStyle={{ color: 'yellow' }}
          // textTodayWrapper={{ borderColor: 'yellow' }}
          // textInTheRangeWrapper={{backgroundColor: '#ff1212'}}
          // textInTheRangeBorderWrapper={{backgroundColor: '#0015ff'}}
        />
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
