import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { flexCenter, flexRowCenterSp, WINDOW_WIDTH } from '../../constatnt/values';
import ArrowPrev from './assets/ArrowPrev.svg';
import ArrowNext from './assets/ArrowNext.svg';
import {
  areEqualToday,
  changeRangeData,
  getMonthData,
  TouchableInsideScroll,
  updateDataOnMultiMode,
} from './utilsCalendar';

const WEEK_DAYS_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const MAX_MONTH_LIMIT = 13;
const TODAY_DATE = new Date();
const NUMBER_MONTHS_IN_YEAR_JS = 11;

export const MyCalendar = ({
  onChange,
  multiSelect = false, /** выбор диапазона */
  possibleMonthLimitProps = 3, /** possibleMonthLimitProps: кол-во месяцев для предоставления выбора даты ( ВКЛЮЧАЯ ТЕКУЩИЙ !! ) min -1,  max - 13 */

  ladingColor = '#32ADE6',

  calendarWrapperStyle, /** кроме width, height, minHeight */

  showArrows = true,
  arrowColor = '#32ADE6',
  arrowsWrapperStyle, /** учитывать абсолютное позиционирование!!!! */
  arrowInnerStyle, /** обертка кнопки, чтобы обертка не выделялась, назначить такой же backgroundColor как в arrowsWrapperStyle  */

  monthTitleStyle, /**  стили для Text  ( МАРТ 2022 ) */
  weekDayStyles, /**  стили для Text  ( Пн, ВТ ...) */
  dayTextBaseStyle, /**  стили для Text, базовые стили дней */
  disabledDayStyle,
  dayBorderRangeStyle, /**  стили Text, для дней ограничивающих выбранный лимит */
  textTodayWrapper, /**  стили обертки текущего дня */
  textInTheRangeWrapper, /**  стили обертки дней внутри границ , но не равных границам */
  textInTheRangeBorderWrapper, /**  стили обертки дней границ диапазона */

}) => {
  const possibleMonthLimit = possibleMonthLimitProps === 0
    ? 3
    : possibleMonthLimitProps > MAX_MONTH_LIMIT
      ? MAX_MONTH_LIMIT
      : possibleMonthLimitProps;

  const pageViewRef = useRef();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [rangeDate, setRangeDate] = useState({ startDay: null, endDay: null });
  const { startDay, endDay } = rangeDate;

  const changePage = (type) => {
    if (type === 'incr' && currentPage < possibleMonthLimit - 1) {
      pageViewRef.current?.setPage(currentPage + 1);
      setCurrentPage((prev) => prev + 1);
    }
    if (type === 'decr' && currentPage > 0) {
      pageViewRef.current?.setPage(currentPage - 1);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const calendarDATA = useMemo(() => {
    let res = [];
    let currentMonthNextYear = 0;
    const currentMonth = TODAY_DATE.getMonth();
    const currentYear = TODAY_DATE.getFullYear();
    const nextYear = currentYear + 1;

    for (let i = 0; i < possibleMonthLimit; i++) {
      /** проверяем не выходит ли возможное кол-во месяцев для календаря за лимит оставшихся месяцев текущего года */
      if (currentMonth + i <= NUMBER_MONTHS_IN_YEAR_JS) {
        const monthName = `${[MONTH_NAMES[currentMonth + i]]} ${currentYear}`;
        res = [...res, { title: monthName, monthData: getMonthData(currentYear, currentMonth + i) }];
      } else {
        const monthName = `${[MONTH_NAMES[currentMonthNextYear]]} ${nextYear}`;
        res = [...res, { title: monthName, monthData: getMonthData(nextYear, currentMonthNextYear) }];
        currentMonthNextYear += 1;
      }
    }
    return res;
  }, [possibleMonthLimit]);

  useEffect(() => {
    if (calendarDATA?.length && !data?.length) setData(calendarDATA);
  }, [calendarDATA]);

  useEffect(() => {
    const normalizeStartDay = startDay?.day ? new Date(startDay.day).toLocaleDateString('ru') : null;
    const normalizeEndDay = endDay?.day ? new Date(endDay.day).toLocaleDateString('ru') : null;

    if (multiSelect) {
      /** не важно выбрано что-то или нет, updateDataOnMultiMode внутри все проверит */
      setData(updateDataOnMultiMode(calendarDATA, rangeDate));
      onChange({ startDay: normalizeStartDay, endDay: normalizeEndDay });
    } else {
      onChange({ startDay: normalizeStartDay, normalizeEndDay });
    }
  }, [startDay, endDay]);

  const isVisiblePrevArrow = currentPage > 0;
  const isVisibleNextArrow = currentPage < data?.length - 1;

  return (
    <View>
      {!!data.length && (
        <ControlButtons
          showArrows={showArrows}
          arrowColor={arrowColor}
          arrowInnerStyle={arrowInnerStyle}
          arrowsWrapperStyle={arrowsWrapperStyle}
          isVisiblePrev={isVisiblePrevArrow}
          isVisibleNext={isVisibleNextArrow}
          handlePrev={() => changePage('decr')}
          handleNext={() => changePage('incr')}
        />
      )}

      <View style={[styles.calendarWrapper, calendarWrapperStyle, { minHeight: 370, width: WINDOW_WIDTH - 40 }]}>
        {!data.length ? (
          <View style={{ flex: 1, ...flexCenter }}>
            <ActivityIndicator size="large" color={ladingColor} />
          </View>
        ) : (
          <PagerView
            scrollEnabled
            pageMargin={40}
            ref={pageViewRef}
            style={{ flex: 1 }}
            initialPage={currentPage}
            onPageSelected={({ nativeEvent }) => setCurrentPage(nativeEvent.position)}
          >
            {data.map((month, monthIndex) => (
              <Page
                month={month}
                key={monthIndex}
                rangeDate={rangeDate}
                monthIndex={monthIndex}
                multiSelect={multiSelect}
                setRangeDate={setRangeDate}
                weekDayStyles={weekDayStyles}
                monthTitleStyle={monthTitleStyle}

                dayTextBaseStyle={dayTextBaseStyle}
                disabledDayStyle={disabledDayStyle}
                textTodayWrapper={textTodayWrapper}
                dayBorderRangeStyle={dayBorderRangeStyle}
                textInTheRangeWrapper={textInTheRangeWrapper}
                textInTheRangeBorderWrapper={textInTheRangeBorderWrapper}
              />
            ))}
          </PagerView>
        )}
      </View>
    </View>
  );
};

const ControlButtons = ({
  isVisiblePrev, isVisibleNext, handlePrev, handleNext,
  showArrows, arrowsWrapperStyle, arrowInnerStyle, arrowColor
}) => (
  <>
    {!!showArrows
      && (
      <View style={[styles.arrowWrapper, arrowsWrapperStyle]}>
        {isVisiblePrev
          ? (
            <TouchableOpacity style={[{ paddingLeft: 20, paddingRight: 12 }, styles.arrowInner, arrowInnerStyle]} onPress={handlePrev}>
              <ArrowPrev fill={arrowColor} />
            </TouchableOpacity>
          )
          : <View />}
        {isVisibleNext
          ? (
            <TouchableOpacity style={[{ paddingRight: 20, paddingLeft: 12 }, styles.arrowInner, arrowInnerStyle]} onPress={handleNext}>
              <ArrowNext fill={arrowColor} />
            </TouchableOpacity>
          )
          : <View />}
      </View>
      )}
  </>
);

const Page = memo(({
  monthIndex, month, setRangeDate, rangeDate, multiSelect,
  monthTitleStyle, weekDayStyles,
  dayTextBaseStyle, disabledDayStyle, dayBorderRangeStyle, textTodayWrapper, textInTheRangeWrapper, textInTheRangeBorderWrapper
}) => (
  <View key={monthIndex} style={{ elevation: 0 }}>
    <View style={[flexCenter, { paddingBottom: 12 }]}>
      <Text style={[styles.monthTitle, monthTitleStyle]}>{month.title}</Text>
    </View>
    <View style={{ ...flexRowCenterSp, flexWrap: 'nowrap' }}>
      {WEEK_DAYS_NAMES.map((weekDay) => (
        <View key={weekDay} style={{ width: 40, height: 40, ...flexCenter }}>
          <Text key={weekDay} style={[styles.weekDay, weekDayStyles]}>
            {weekDay}
          </Text>
        </View>
      ))}
    </View>
    <View>
      {month.monthData.map((week, weekIndex, weekArr) => (
        <Week
          week={week}
          key={weekIndex}
          weekIndex={weekIndex}
          rangeDate={rangeDate}
          monthIndex={monthIndex}
          multiSelect={multiSelect}
          setRangeDate={setRangeDate}
          sixWeek={weekArr?.length === 6}

          dayTextBaseStyle={dayTextBaseStyle}
          disabledDayStyle={disabledDayStyle}
          textTodayWrapper={textTodayWrapper}
          dayBorderRangeStyle={dayBorderRangeStyle}
          textInTheRangeWrapper={textInTheRangeWrapper}
          textInTheRangeBorderWrapper={textInTheRangeBorderWrapper}
        />
      ))}
    </View>
  </View>
));

const Week = memo(({
  week, monthIndex, sixWeek, weekIndex, setRangeDate, rangeDate, multiSelect,
  dayTextBaseStyle, disabledDayStyle, dayBorderRangeStyle, textTodayWrapper, textInTheRangeWrapper, textInTheRangeBorderWrapper
}) => {
  const daySize = sixWeek ? 34 : 40;

  return (
    <View style={{ ...flexRowCenterSp, flexWrap: 'nowrap' }}>
      {week.map((day, dayInWeekIndex) => (day?.stamp
        ? (
          <Day
            day={day}
            key={day.stamp}
            daySize={daySize}
            sixWeek={sixWeek}
            weekIndex={weekIndex}
            rangeDate={rangeDate}
            monthIndex={monthIndex}
            multiSelect={multiSelect}
            setRangeDate={setRangeDate}
            dayInWeekIndex={dayInWeekIndex}

            dayTextBaseStyle={dayTextBaseStyle}
            disabledDayStyle={disabledDayStyle}
            textTodayWrapper={textTodayWrapper}
            dayBorderRangeStyle={dayBorderRangeStyle}
            textInTheRangeWrapper={textInTheRangeWrapper}
            textInTheRangeBorderWrapper={textInTheRangeBorderWrapper}
          />
        )
        : (
          <View
            key={`${day}${dayInWeekIndex}`}
            style={{ width: daySize, height: daySize, borderRadius: 20, ...flexCenter, marginVertical: 4, }}
          />
        )))}
    </View>
  );
});

const Day = memo(({
  day, daySize, sixWeek, rangeDate, monthIndex, weekIndex, dayInWeekIndex, setRangeDate, multiSelect,
  dayTextBaseStyle, disabledDayStyle, dayBorderRangeStyle, textTodayWrapper, textInTheRangeWrapper, textInTheRangeBorderWrapper
}) => {
  // console.log('render Day for check +++++');

  const todayDate = new Date();
  const isInRangeStyle = day.inRange;
  const isTodayStyle = areEqualToday(day.day, todayDate);
  const isRangeBorderStyle = day?.stamp === rangeDate.startDay?.stamp || day.anchor;

  return (
    <TouchableInsideScroll
      style={[
        { width: daySize, height: daySize, borderRadius: 20, ...flexCenter, marginVertical: sixWeek ? 4 : 5.5 },
        isTodayStyle && { ...styles.today, ...textTodayWrapper },
        isInRangeStyle && { ...styles.inTheRange, ...textInTheRangeWrapper },
        isRangeBorderStyle && { ...styles.inRangeBorder, ...textInTheRangeBorderWrapper },
      ]}
      disabled={day?.disabled}
      onPress={() => setRangeDate((prev) => changeRangeData({ prev, day, monthIndex, weekIndex, dayInWeekIndex, multiSelect }))}
    >
      <Text
        style={[
          styles.dayTextBase, dayTextBaseStyle,
          isRangeBorderStyle && { ...styles.borderRangeText, ...dayBorderRangeStyle },
          day?.disabled && { ...styles.prevDay, ...disabledDayStyle },
        ]}
        allowFontScaling={false}
      >
        {day.day.getDate()}
      </Text>
    </TouchableInsideScroll>
  );
}, (prev, next) => {
  if (!prev.multiSelect) {
    if (!prev.rangeDate.startDay) {
      /** нажимаем на уже выбранную дату (перерисовываем только ее) */
      return next.day?.stamp !== next.rangeDate.startDay?.stamp;
    }
    /** нажимаем на другую дату (перерисовываем 2 - prev and next) */
    return next.day?.stamp !== next.rangeDate.startDay?.stamp && next.day?.stamp !== prev.rangeDate.startDay?.stamp;
  }
  return prev.day.anchor === next.day.anchor && prev.day.inRange === next.day.inRange;
});

const styles = StyleSheet.create({
  calendarWrapper: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 20,
  },
  arrowWrapper: {
    ...flexRowCenterSp,
    position: 'absolute',
    width: '100%',
    zIndex: 10,
    top: 16
  },
  arrowInner: {
    paddingVertical: 8,
    backgroundColor: '#FFFFFF'
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  weekDay: {
    fontWeight: 'bold',
    fontSize: 16
  },
  dayTextBase: {
    fontWeight: 'normal',
    fontSize: 16,
    color: '#000000'
  },
  today: {
    borderWidth: 1,
    borderColor: '#32ADE6'
  },
  borderRangeText: {
    color: '#FFFFFF'
  },
  inRangeBorder: {
    backgroundColor: '#32ADE6',
  },
  inTheRange: {
    backgroundColor: 'rgba(50, 173, 230, 0.3)',
  },
  prevDay: {
    color: '#adadad'
  }
});
