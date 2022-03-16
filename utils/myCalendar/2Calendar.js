import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { flexCenter, flexRowCenterSp, WINDOW_WIDTH } from "../../constatnt/values";
import PagerView from "react-native-pager-view";
import { areEqualToday, getMonthData, inTheRange, TouchableInsideScroll } from "./utilsCalendar";

const WEEK_DAYS_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const MAX_MONTH_LIMIT = 13;
const TODAY_DATE = new Date();
const NUMBER_MONTHS_IN_YEAR_JS = 11;

/** possibleMonthLimitProps: кол-во месяцев для предоставления выбора даты ( ВКЛЮЧАЯ ТЕКУЩИЙ !! ) max - 13 */

export const MyCalendar2 = ({
   possibleMonthLimitProps = 3,
   multiSelect= true,
   onChange,
 }) => {
  const possibleMonthLimit = possibleMonthLimitProps > MAX_MONTH_LIMIT ? MAX_MONTH_LIMIT : possibleMonthLimitProps;

  const pageViewRef = useRef();
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const [ startDay, setStartDay ] = useState(null);
  const [ endDay, setEndDay ] = useState(null);

 // const  startDay = useRef(null)
 // const  endDay = useRef(null)

  console.log('startDay---====', startDay);
  console.log('endDay---====++++', endDay);

  const dataKeys = Object.keys(data);

  const changePage = type => {
    if (type === 'incr' && currentPage < possibleMonthLimit - 1) {
      pageViewRef.current?.setPage(currentPage + 1);
      setCurrentPage(prev => prev + 1);
    }
    if (type === 'decr' && currentPage > 0) {
      pageViewRef.current?.setPage(currentPage - 1);
      setCurrentPage(prev => prev - 1);
    }
  };

  const calendarDATA = useMemo(() => {
    let res = {};
    let currentMonthNextYear = 0;
    const currentMonth = TODAY_DATE.getMonth();
    const currentYear = TODAY_DATE.getFullYear();
    const nextYear = currentYear + 1;

    for (let i = 0; i < possibleMonthLimit; i++) {
      /** проверяем не выходит ли возможное кол-во месяцев для календаря за лимит оставшихся месяцев текущего года*/
      if (currentMonth + i <= NUMBER_MONTHS_IN_YEAR_JS) {
        const monthName = `${[MONTH_NAMES[currentMonth + i]]} ${currentYear}`;
        res = { ...res, [monthName]: getMonthData(currentYear, currentMonth + i) };
      } else {
        const monthName = `${[MONTH_NAMES[currentMonthNextYear]]} ${nextYear}`;
        res = { ...res, [monthName]: getMonthData(nextYear, currentMonthNextYear) };
        currentMonthNextYear = currentMonthNextYear + 1;
      }
    }
    return res;
  }, [possibleMonthLimit]);

  useEffect(() => {
    if (Object.keys(calendarDATA)?.length) {
      setData(calendarDATA);
    }
  }, [calendarDATA]);

  const isVisiblePrevArrow = currentPage > 0;
  const isVisibleNextArrow = currentPage < dataKeys?.length - 1;

  // const handleDayPress = useCallback((dayObj, startDayObj, endDayObj ) => {
  const handleDayPress = useCallback((dayObj) => {
    // const handleDayPress = (dayObj, startDayObj, endDayObj ) => {
    // console.log('handleDayPress = useCallback startDayObj===', startDayObj, startDay);

    if (multiSelect) {
      /** не был выбран стартовый день */
      if(!startDay) {
        console.log('не был выбран стартовый день');
        setStartDay(dayObj)
        // const temp = choiceOne()
        // setData( ({ ...calendarDATA, [month]: temp }))
        // onChange(что отправить то в родитель)


      } else {
        /** был выбран стартовый день */
        if (startDay.stamp === dayObj.stamp) {
          /** повторно нажимаем на стартовый день, снимаем выделение и setStartDay(null) */
          console.log('повторно нажимаем на стартовый день');
          setStartDay(null)
          // setData(choiceOne())
          // onChange(что отправить то в для StartDay)
        } else {
          /** выбираем день, отличный от стартового (не важно раньше или позже) */
          console.log('выбираем день, отличный от стартового');
          setEndDay(dayObj)
        }

      }


    } else {
      // const temp = choiceOne()
      /** если значение выбирается в true */
      // if(!dayObj.anchor) {
      if(!startDay) {
        setStartDay(dayObj)
        // todo onChange(dayObj)  {} || [] ???
        // onChange(dayObj)
      }
      /** если значение выбирается в false (убираем выделение) */
      else {
        setStartDay(null)
        // setData(calendarDATA)
        // todo onChange(dayObj)  {} || [] ???
        // onChange(пустое что-то)
      }

    }
  }, [startDay, endDay])


  // console.log('calendarDATA---', calendarDATA);
  console.log('DATA---', data);
  // console.log('Object.keys(calendarDATA)---', Object.keys(calendarDATA));
  // console.log('currentPage---', currentPage);
  // console.log('dataKeys?.length---', dataKeys?.length);
  return (
    <View>
      {!!dataKeys?.length && (
        <ControlButtons
          isVisiblePrev={isVisiblePrevArrow}
          isVisibleNext={isVisibleNextArrow}
          handlePrev={() => changePage("decr")}
          handleNext={() => changePage("incr")}
        />
      )}

      <View style={[styles.calendarWrapper]}>
        {!dataKeys?.length ? (
          <View style={{flex: 1, ...flexCenter}}>
            <ActivityIndicator size={'large'} />
          </View>
        ) : (
          <PagerView
            scrollEnabled
            pageMargin={40}
            ref={pageViewRef}
            style={{flex: 1}}
            initialPage={currentPage}
            onPageSelected={({nativeEvent}) => setCurrentPage(nativeEvent.position)}
          >
            {dataKeys.map((month, index) => (
              <View key={index}>
                <View style={[flexCenter, {paddingBottom: 12}]}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>{month}</Text>
                </View>
                <View style={{...flexRowCenterSp, flexWrap: 'nowrap'}}>
                  {WEEK_DAYS_NAMES.map(weekDay => (
                    <View key={weekDay} style={{ width: 40, height: 40, ...flexCenter }}>
                      <Text key={weekDay} style={{ fontWeight: 'bold', fontSize: 16 }}>
                        {weekDay}
                      </Text>
                    </View>
                  ))}
                </View>
                <View>
                  {data[month].map((week, weekIndex) => (
                    <Month
                      key={`${month}${weekIndex}`}
                      week={week}
                      month={month}
                      startDay={startDay}
                      endDay={endDay}
                      weekIndex={weekIndex}
                      sixWeek={data[month]?.length === 6}
                      handleDayPress={handleDayPress}
                    />
                  ))}
                </View>
              </View>
            ))}
          </PagerView>
        )}
      </View>
    </View>
  );
};

const ControlButtons = memo(({isVisiblePrev, isVisibleNext, handlePrev, handleNext}) => {

  return (
    <View style={{ ...flexRowCenterSp, position: 'absolute', zIndex: 1, width: '100%', top: 16 }}>
      {isVisiblePrev
        ? <TouchableOpacity style={{ paddingLeft: 20, paddingRight: 12, paddingVertical: 8, backgroundColor: "#FFFFFF" }} onPress={handlePrev}>
          <Text>&lt;</Text>
        </TouchableOpacity>
        : <View />
      }
      {isVisibleNext
        ? <TouchableOpacity style={{ paddingRight: 20, paddingLeft: 12, paddingVertical: 8, backgroundColor: "#FFFFFF" }} onPress={handleNext}>
          <Text>&gt;</Text>
        </TouchableOpacity>
        : <View />
      }
    </View>
  )
})




// const Month = memo(({week, month, sixWeek, weekIndex, handleDayPress}) => {
const Month = memo(({week, sixWeek, weekIndex, handleDayPress, startDay, endDay }) => {
    // console.log('render Month -----');
    const daySize = sixWeek ? 34 : 40;

    return (
      <View key={weekIndex} style={{ ...flexRowCenterSp, flexWrap: 'nowrap' }}>
        {week.map((day, dayInWeekIndex) =>
          day?.stamp
            ? <Day
              day={day}
              // month={month}
              startDay={startDay}
              endDay={endDay}
              key={day.stamp}
              daySize={daySize}
              sixWeek={sixWeek}
              // weekIndex={weekIndex}
              // dayInWeekIndex={dayInWeekIndex}
              handleDayPress={handleDayPress}
            />
            : <View key={`${day}${dayInWeekIndex}`} style={{ width: daySize, height: daySize, borderRadius: 20, ...flexCenter, marginVertical: 4, }} />
        )}
      </View>
    )
  }
)

// const Day = memo(({day, daySize, sixWeek, handleDayPress, month, weekIndex, dayInWeekIndex}) => {
// const Day = memo(({day, daySize, sixWeek, handleDayPress, startDay, endDay }) => {
const Day = memo(({day, daySize, sixWeek, handleDayPress }) => {
  const todayDate = new Date();
  // console.log('render Day +++++ handleDayPress ===', handleDayPress );
  console.log('render Day +++++ ');
  const onPress = () => {
    handleDayPress(day)
  }
  return (
    <TouchableInsideScroll
      style={[{ width: daySize, height: daySize, borderRadius: 20,  ...flexCenter, marginVertical: sixWeek ? 4 : 5.5 },
        areEqualToday(day.day, todayDate) && styles.today,
        // day?.anchor && styles.inRangeLimits,
       // (day?.stamp === startDay?.current?.stamp ||  day?.stamp === endDay?.current?.stamp)  && styles.inRangeLimits,
       //  !!startDay?.current && !!endDay?.current && inTheRange(day?.stamp, startDay?.current.stamp, endDay?.current?.stamp) && styles.inTheRange,
      ]}
      disabled={day?.disabled}
      // onPress={() => handleDayPress({ month, weekIndex, dayInWeekIndex, dayObj: day })}
      onPress={onPress}
    >
      <Text key={day.stamp} style={[{fontWeight: 'normal', fontSize: 16, color: '#000000'}, day?.disabled && styles.prevDay]}>{day.day.getDate()}</Text>
    </TouchableInsideScroll>
  )
})
// && prev.startDay === next.startDay
// next.day?.stamp !== next.endDay?.stamp
  // || next.day?.stamp !== next.startDay?.stamp)
  // || (next.day?.stamp < next.startDay?.stamp || next.day?.stamp > next.endDay?.stamp)
// && next.endDay?.stamp < next.day?.stamp




// , (prev, next ) => {
//
//   if(next.startDay?.stamp && !next.endDay) {
//     return (
//       next.day?.stamp !== next.startDay?.stamp
//     )
//   }
//   if(next.endDay?.stamp) {
//     return (
//       next.day?.stamp > next.endDay?.stamp || next.day?.stamp < next.startDay?.stamp
//     )
//   }
//   if(next.startDay?.stamp && next.endDay?.stamp) {
//     return (
//       next.day?.stamp >= next.startDay?.stamp || next.day?.stamp <= next.endDay?.stamp
//     )
//   }
// }

const styles = StyleSheet.create({
  calendarWrapper: {
    flex: 1,
    minHeight: 370,
    height: 370,
    width: WINDOW_WIDTH - 40,
    paddingTop: 24,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 20,
  },
  today: {
    borderWidth: 1,
    borderColor: '#32ADE6'
  },

  inRangeLimits : {
    backgroundColor: '#32ADE6',
  },
  inTheRange: {
    backgroundColor: 'rgba(50, 173, 230, 0.3)',
  },
  prevDay: {
    color: '#adadad'
  }
});






