import React, { useRef } from "react";
import { TouchableOpacity } from "react-native";

const today = new Date();
const currentDay = today.getDate();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const WEEK_DAYS_FROM_MONDAY = [6, 0, 1, 2, 3, 4, 5];

const Month = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

export function areEqualToday(a, b) {
  if (!a || !b) {
    return false;
  }
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export const inTheRange = (day, rangeStartDay, rangeEndDay) => {
  // console.log('toISOString---', day.toISOString().substring(0,10));
  // console.log('rangeStartDay---', day.getTime());
  // console.log('day, rangeStartDay, rangeEndDay--', day, rangeStartDay, rangeEndDay);
  if (!day || !rangeStartDay || !rangeEndDay) {
    return false;
  }
  // const dayStamp = day.getTime()
  // const rangeStartDayStamp = rangeStartDay.getTime()
  // const rangeEndDayStamp = rangeEndDay.getTime()

  const moreThanStartDate = day > rangeStartDay;
  const lessThanEndDate = day < rangeEndDay;

  if (moreThanStartDate && lessThanEndDate) return true
}

// export const laterCurrentDate = (currDate, date) => {
//   if (!currDate || !date) {
//     return false;
//   }
//   return (
//     date.getFullYear() >= currDate.getFullYear() &&
//     date.getMonth() >= currDate.getMonth() &&
//     date.getDate() >= currDate.getDate()
//   )
// }

export function isLeapYear(year) {
  return !(year % 4 || (!(year % 100) && year % 400));
}

export function getDaysInMonth(date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  const daysInMonth = DAYS_IN_MONTH[month];

  if (isLeapYear(year) && month === Month.February) {
    return daysInMonth + 1;
  } else {
    return daysInMonth;
  }
}

export function getDayOfWeek(date) {
  const dayOfWeek = date.getDay();
  return WEEK_DAYS_FROM_MONDAY[dayOfWeek];
}

// export function getMonthData(year, month) {
//   const result = [];
//   const date = new Date(year, month);
//   const daysInMonth = getDaysInMonth(date);
//   const monthStartsOn = getDayOfWeek(date);
//   let day = 1;
//
//   for (let i = 0; i < (daysInMonth + monthStartsOn) / DAYS_IN_WEEK; i++) {
//     result[i] = [];
//
//     for (let j = 0; j < DAYS_IN_WEEK; j++) {
//       if ((i === 0 && j < monthStartsOn) || day > daysInMonth) {
//         result[i][j] = undefined;
//       } else {
//         result[i][j] = new Date(year, month, day++);
//       }
//     }
//   }
//
//   return result;
// }



export function getMonthData(year, month) {
  const result = [];

  const date = new Date(year, month);
  const daysInMonth = getDaysInMonth(date);
  const todayStamp = new Date(currentYear, currentMonth, currentDay);

  const monthStartsOn = getDayOfWeek(date);
  let dayCount = 1;

  for (let i = 0; i < (daysInMonth + monthStartsOn) / DAYS_IN_WEEK; i++) {
    result[i] = [];

    for (let j = 0; j < DAYS_IN_WEEK; j++) {
      if ((i === 0 && j < monthStartsOn) || dayCount > daysInMonth) {
        result[i][j] = undefined;
      } else {
        const _dayCount = dayCount++;
        const newDayDate = new Date(year, month, _dayCount);
        const newDayStamp = newDayDate.getTime();
        const newDay = {
          day: newDayDate,
          stamp: newDayStamp,
          anchor: null,
          inRange: null,
          disabled: newDayStamp < todayStamp
        }
        result[i][j] = newDay ;
      }
    }
  }

  return result;
}


export const TouchableInsideScroll = ({ onPress, onPressIn, onPressOut, ...props }) => {
  const _touchActivatePositionRef = useRef(null);

  function _onPressIn(e) {
    const { pageX, pageY } = e.nativeEvent;
    _touchActivatePositionRef.current = {
      pageX,
      pageY,
    };
    onPressIn?.(e);
  }

  function _onPress(e) {
    const { pageX, pageY } = e.nativeEvent;

    const absX = Math.abs(_touchActivatePositionRef.current.pageX - pageX);
    const absY = Math.abs(_touchActivatePositionRef.current.pageY - pageY);

    const dragged = absX > 2 || absY > 2;
    if (!dragged) {
      onPress?.(e);
    }
  }

  return (
    <TouchableOpacity onPressIn={_onPressIn} onPress={_onPress} onPressOut={onPressOut} {...props}>
      {props.children}
    </TouchableOpacity>
  );
};
