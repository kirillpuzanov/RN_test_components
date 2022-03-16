import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { flexCenter, flexRowCenterSp, WINDOW_WIDTH } from "../../constatnt/values";
import PagerView from "react-native-pager-view";
import { areEqualToday, getMonthData, TouchableInsideScroll } from "./utilsCalendar";

const WEEK_DAYS_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const MAX_MONTH_LIMIT = 13;
const TODAY_DATE = new Date();
const NUMBER_MONTHS_IN_YEAR_JS = 11;

/** possibleMonthLimitProps: кол-во месяцев для предоставления выбора даты ( ВКЛЮЧАЯ ТЕКУЩИЙ !! ) max - 13 */

export const MyCalendar = ({
  possibleMonthLimitProps = 13,
  multiSelect= true,
  onChange,
}) => {
  const possibleMonthLimit = possibleMonthLimitProps > MAX_MONTH_LIMIT ? MAX_MONTH_LIMIT : possibleMonthLimitProps;

  const pageViewRef = useRef();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [ rangeDate, setRangeDate ] = useState({startDay: null, endDay: null});

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
    let res = [];
    let currentMonthNextYear = 0;
    const currentMonth = TODAY_DATE.getMonth();
    const currentYear = TODAY_DATE.getFullYear();
    const nextYear = currentYear + 1;

    for (let i = 0; i < possibleMonthLimit; i++) {
      /** проверяем не выходит ли возможное кол-во месяцев для календаря за лимит оставшихся месяцев текущего года*/
      if (currentMonth + i <= NUMBER_MONTHS_IN_YEAR_JS) {
        const monthName = `${[MONTH_NAMES[currentMonth + i]]} ${currentYear}`;
        res = [ ...res, { title:monthName, monthData: getMonthData(currentYear, currentMonth + i) } ];
      } else {
        const monthName = `${[MONTH_NAMES[currentMonthNextYear]]} ${nextYear}`;
        res = [ ...res, { title: monthName, monthData: getMonthData(nextYear, currentMonthNextYear) } ];
        currentMonthNextYear = currentMonthNextYear + 1;
      }
    }
    return res;
  }, [possibleMonthLimit]);

  useEffect(() => {
    if (calendarDATA?.length && !data?.length) setData(calendarDATA);
  }, [calendarDATA]);

  useEffect(() => {

    const choiceOne = () => {
      const { startDay, endDay } = rangeDate;

      return calendarDATA.map((month, mIndex) => (
        (mIndex === startDay?.monthIndex ||  endDay?.monthIndex)
         ? { ...month, monthData: month.monthData.map((week, wIndex) => {
            if (!endDay) {
              return (
                wIndex === startDay.weekIndex
                  ? week.map((day, dIndex) => (dIndex === startDay.dayInWeekIndex
                    ? {...day, anchor: !startDay.anchor }
                    : day))
                  : week )
            } else {
              return (
                (wIndex >= startDay.weekIndex ||  wIndex <= endDay.weekIndex)
                ? week.map((day) => (day?.stamp === startDay.stamp || day?.stamp === endDay.stamp
                  ? {...day, anchor: true }
                  : (day?.stamp > startDay.stamp && day?.stamp < endDay.stamp && !day?.disabled)
                    ? {...day, inRange: true }
                    : day))
                : week)
            }
          })}
          : month
      ))
    }

    if (multiSelect) {
      /** не был выбран стартовый день */
      setData(choiceOne())
      // onChange(что отправить то в родитель)
    } else {
        // засетать в родитея
        // onChange(dayObj)
    }
  }, [rangeDate.startDay, rangeDate.endDay ])

  const isVisiblePrevArrow = currentPage > 0;
  const isVisibleNextArrow = currentPage < data?.length - 1;

  console.log('DATA---', data);

  return (
    <View>
      {!!data.length && (
        <ControlButtons
          isVisiblePrev={isVisiblePrevArrow}
          isVisibleNext={isVisibleNextArrow}
          handlePrev={() => changePage("decr")}
          handleNext={() => changePage("incr")}
        />
      )}

      <View style={[styles.calendarWrapper]}>
        {!data.length ? (
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
            {data.map((month, monthIndex) => (
              <Page
                key={monthIndex}
                monthIndex={monthIndex}
                month={month}
                rangeDate={rangeDate}
                setRangeDate={setRangeDate}
                multiSelect={multiSelect}/>
            ))}
          </PagerView>
        )}
      </View>
    </View>
  );
};

const ControlButtons = ({isVisiblePrev, isVisibleNext, handlePrev, handleNext}) => {

  return (
    <View style={{ ...flexRowCenterSp, position: 'absolute', zIndex: 10, width: '100%', top: 16 }}>
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
}

const Page = memo(({monthIndex, month, setRangeDate, rangeDate, multiSelect}) => {

  return(
    <View key={monthIndex} style={{elevation: 0}}>
      <View style={[flexCenter, {paddingBottom: 12}]}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>{month.title}</Text>
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
        {month.monthData.map((week, weekIndex, weekArr) => (
          <Week
            key={weekIndex}
            week={week}
            weekIndex={weekIndex}
            monthIndex={monthIndex}
            sixWeek={weekArr?.length === 6}
            setRangeDate={setRangeDate}
            rangeDate={rangeDate}
            multiSelect={multiSelect}
          />
        ))}
      </View>
    </View>
  )
})

const Week = memo(({week, monthIndex, sixWeek, weekIndex, setRangeDate, rangeDate, multiSelect}) => {
  const daySize = sixWeek ? 34 : 40;

  return (
    <View style={{ ...flexRowCenterSp, flexWrap: 'nowrap' }}>
      {week.map((day, dayInWeekIndex) =>
        day?.stamp
          ? <Day
            day={day}
            key={day.stamp}
            daySize={daySize}
            sixWeek={sixWeek}
            weekIndex={weekIndex}
            monthIndex={monthIndex}
            dayInWeekIndex={dayInWeekIndex}
            setRangeDate={setRangeDate}
            rangeDate={rangeDate}
            multiSelect={multiSelect}
          />
          : <View key={`${day}${dayInWeekIndex}`}
                  style={{ width: daySize, height: daySize, borderRadius: 20, ...flexCenter, marginVertical: 4, }} />
      )}
    </View>
  )
}
// , (prev, next) => prev.week === next.week
)

const Day = memo(({day, daySize, sixWeek, rangeDate, monthIndex, weekIndex, dayInWeekIndex, setRangeDate, multiSelect}) => {
  console.log('render Day +++++');

  const todayDate = new Date();
  const isTodayStyle =  areEqualToday(day.day, todayDate)

  const isInRangeStyle = day.inRange;
  const isRangeBorderStyle = day?.stamp === rangeDate.startDay?.stamp ||  day.anchor;

  return (
    <TouchableInsideScroll
      style={[
        { width: daySize, height: daySize, borderRadius: 20, ...flexCenter, marginVertical: sixWeek ? 4 : 5.5 },
        isTodayStyle && styles.today,
        isInRangeStyle && styles.inTheRange,
        isRangeBorderStyle  && styles.inRangeLimits,
      ]}
      disabled={day?.disabled}
      onPress={() => setRangeDate((prev) => changeRangeData({ prev, day, monthIndex, weekIndex, dayInWeekIndex, multiSelect }))}
    >
      <Text key={day.stamp} style={[{fontWeight: 'normal', fontSize: 16, color: '#000000'}, day?.disabled && styles.prevDay]}>{day.day.getDate()}</Text>
    </TouchableInsideScroll>
  )
}, (prev, next) => {
  if (!prev.multiSelect) {
    if(!prev.rangeDate.startDay) {
      /** нажимаем на уже выбранную дату (перерисовываем только ее) */
      return  next.day?.stamp !== next.rangeDate.startDay?.stamp
    } else {
      /** нажимаем на другую дату (перерисовываем 2 - prev and next) */
      return next.day?.stamp !== next.rangeDate.startDay?.stamp && next.day?.stamp !== prev.rangeDate.startDay?.stamp
    }
  } else {
    return prev.day.anchor ===  next.day.anchor && prev.day.inRange ===  next.day.inRange
  }
})

const changeRangeData = ({prev, day, monthIndex, weekIndex, dayInWeekIndex, multiSelect}) => {

  if (multiSelect) {

    if (!prev?.startDay) {
      /** нет стартового дня */
      return { ...prev, startDay: { ...day, monthIndex, weekIndex, dayInWeekIndex } }
    } else {
      /** есть стартовый день */
      if(!prev?.endDay) {
        /** нет конечного дня */

        if (prev.startDay?.stamp === day.stamp) {
          /** нажимаем еще раз на уже выбранную startDay */
          return {startDay: null, endDay: null}
        }
        if ( day.stamp > prev.startDay?.stamp) {
          return { ...prev, endDay: { ...day, monthIndex, weekIndex, dayInWeekIndex } }
        }
        if ( day.stamp < prev.startDay?.stamp) {
          return  { startDay: { ...day, monthIndex, weekIndex, dayInWeekIndex }, endDay: prev.startDay }
        }

      } else {
        /** есть конечный день */
        return  day?.stamp > prev?.startDay?.stamp
          ?  { ...prev, endDay: { ...day, monthIndex, weekIndex, dayInWeekIndex } }
          :  day?.stamp < prev?.startDay?.stamp
            ? { startDay: { ...day, monthIndex, weekIndex, dayInWeekIndex }, endDay: prev.startDay }
            : { ...prev, endDay: null }
      }
    }

  } else {
    /** пошел обычный режим */
    if (prev.startDay?.stamp === day.stamp) {
      return {...prev, startDay: null}
    } else {
      return {
        ...prev,
        startDay: { ...day, monthIndex, weekIndex, dayInWeekIndex }
      }
    }
  }
}

const styles = StyleSheet.create({
  calendarWrapper: {
    flex: 1,
    minHeight: 370,
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






