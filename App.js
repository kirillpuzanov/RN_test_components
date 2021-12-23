import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Button, SafeAreaView, Text, View} from 'react-native';

export const App = () => {
  const offset = useSharedValue(0);
  const rotation = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: offset.value * 255}],
    };
  });

  const customAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{rotateZ: `${rotation.value}deg`}],
    };
  });

  return (
    <>
      <SafeAreaView>
        <View style={{height: 400}}>
          <Animated.View
            style={[
              {
                width: 100,
                height: 80,
                backgroundColor: 'red',
                margin: 30,
                borderRadius: 5,
              },
              animatedStyles,
            ]}
          />
          <Animated.View
            style={[
              {
                width: 100,
                height: 80,
                backgroundColor: 'blue',
                margin: 30,
                borderRadius: 5,
              },
              customAnimatedStyles,
            ]}
          />
        </View>
        <Button
          onPress={() => {
            offset.value = Math.random();
            rotation.value = withRepeat(withTiming(10), 6, true);
          }}
          title="Move"
        />
      </SafeAreaView>
    </>
  );
};
