import React from 'react';
import {StyleSheet, Animated, View, Text} from 'react-native';

export const Thumb = ({
  val,
  style,
  start,
  color,
  thumbSize,
  Component,
  isVisible,
  onLayout,
  vertical,
  showLabel,
  stylesLabel,
  labelProps,
  ...props
}) => {
  const ThumbComponent = Component || Animated.View;
  const axis = vertical ? 'translateY' : 'translateX';
  const thumbPosition = [{[axis]: start}];
  const styleTransform = (style && style.transform) || [];
  const visibleStyle = isVisible ? {} : {height: 0, width: 0};

  return (
    <ThumbComponent
      onLayout={onLayout}
      style={StyleSheet.flatten([
        {
          width: thumbSize,
          height: thumbSize,
          backgroundColor: color,
          borderRadius: thumbSize / 2,
          transform: [...thumbPosition, ...styleTransform],
          ...visibleStyle,
        },
        styles.thumb,
        style,
      ])}
      {...props}>
      {showLabel && (
        <View
          style={{
            ...styles.label,
            minWidth: thumbSize + 10,
            top: -thumbSize - 15,
            left: -thumbSize / 3,
            ...stylesLabel,
          }}
          {...labelProps}>
          {labelProps?.children || <Text style={styles.labelText}>{val}</Text>}
        </View>
      )}
    </ThumbComponent>
  );
};

const styles = StyleSheet.create({
  thumb: {
    borderWidth: 2,
    borderColor: '#C1C9D2',
    position: 'absolute',
  },
  label: {
    borderRadius: 6,
    paddingVertical: 4,
    position: 'absolute',
    backgroundColor: '#3C4257',
  },
  labelText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
