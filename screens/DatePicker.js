import React, {useState} from 'react';
import {Button, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';

export const DatePickerScreen = () => {
  const insets = useSafeAreaInsets();

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button title="Open" onPress={() => setOpen(true)} />
      <DatePicker
        modal
        open={open}
        date={date}
        mode={'time'}
        locale={'ru'}
        androidVariant="iosClone"
        title={'Установите время'}
        is24hourSource={'locale'}
        // textColor={'red'}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
