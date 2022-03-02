import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DEVICE_WIDTH, isIphone} from '../constatnt/values';
import {ScrollView} from 'react-native-gesture-handler';
import {InputRange} from '../utils/MyInputRange';

export const SliderInputRange = () => {
  const insets = useSafeAreaInsets();
  const [val, setVal] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (val !== 100) {
  //       setVal(val + 10);
  //     } else {
  //       setVal(0);
  //     }
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, [val]);

  return (
    <View style={[styles.screen, {paddingBottom: insets.bottom / 2}]}>
      <ScrollView
        style={{flex: 1, paddingTop: 50}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.screen, {width: DEVICE_WIDTH}]}>
        <View style={styles.titleWrapper}>
          <Text style={{fontSize: 20}}>Curr Value</Text>
          <Text style={{fontSize: 18}}>{val}</Text>
        </View>

        <View style={[styles.contentView]}>
          <InputRange
            value={val}
            minimumValue={0}
            maximumValue={100}
            step={10}
            showLabel
            showMinMax
            allowTouchTrack
            // allowTouchTrack={isIphone}
            onValueChange={v => setVal(Math.round(v))}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  titleWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  contentView: {
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    // backgroundColor: 'red',
  },
});
