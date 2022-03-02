import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Easing,
  Animated,
  Platform,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
  Text,
} from 'react-native';
import {Rect} from './Rect';
import {Thumb} from './Thumb';

const TRACK_SIZE = 3;
const TRACK_STYLE = Platform.select({default: -1});

const DEFAULT_ANIMATION_CONFIGS = {
  spring: {friction: 7, tension: 100, useNativeDriver: true},
  timing: {
    duration: 150,
    easing: Easing.inOut(Easing.ease),
    delay: 0,
    useNativeDriver: true,
  },
};

const getBoundedValue = (value, maximumValue, minimumValue) =>
  Math.max(Math.min(value, maximumValue), minimumValue);

const handlePanResponderRequestEnd = () => false;
const handleMoveShouldSetPanResponder = () => !TRACK_STYLE;

const SizableVars = {
  thumbSize: 'thumbSize',
  trackSize: 'trackSize',
  containerSize: 'containerSize',
};
const EventTypes = {
  onValueChange: 'onValueChange',
  onSlidingStart: 'onSlidingStart',
  onSlidingComplete: 'onSlidingComplete',
};

export const InputRange = ({
  style,
  disabled,

  step = 0,
  maximumValue = 1,
  minimumValue = 0,
  value: _propValue = 0 /** start val */,
  onValueChange /** fn, принимает curVal: num */,
  onSlidingComplete /** fn,  принимает curVal: num */,
  onSlidingStart /** fn,в начале движения  принимает curVal: num */,

  animationType = 'timing',
  animationConfig /**  обьект настроек типа DEFAULT_ANIMATION_CONFIGS */,
  animateTransitions /**  boolean использовать ли  'spring' анимацию*/,
  allowTouchTrack = false /** смена позиции Thumb  нажатием на дорожку */,

  minimumTrackTintColor = '#32ADE6' /** 'слева' */,
  maximumTrackTintColor = '#C1C9D2' /** 'справа' */,
  containerStyle /** обьект стиля обертки компонента слайдера */,

  showLabel = false /** показывать curVal над Thumb */,
  stylesLabel /** обертка плашки Label (абсолютно спозиционирована, выравнивание относительно Thumb, по дефолту подобрано под 20 размер Thumb ) */,
  labelProps /** обьект настройки контента внутри плашки Label, через передачу children, например:
   labelProps={{
      children: ( <Text style={{textAlign: 'center', color: '#c51a1a'}}>{val}</Text>),
    }}
   в таком случае val в children нужно передать из родительского лок стэйта
   */,

  orientation = 'horizontal',
  showMinMax /** boolean показывать под сдайдером минамальное и максимально возможные значения */,
  minMaxTextStyle /** текста минамально и максимально возможных значений */,

  thumpSizeProp = 20,
  thumbProps /** ** смотри ниже */,
  thumbStyle /** ** смотри ниже */,
  thumbTintColor = '#FFFFFF',
  thumbTouchSize = {height: thumpSizeProp + 10, width: thumpSizeProp + 10},
  trackStyle /** обьект стиля для дорожки */,

  /**   thumbProps  обьект;  возможна установка кастомного компонента thumb, передав параметры:
  thumbProps={{
     children: (
       <View style={{ width: ВАШЕ ЗНАЧЕНИЕ , height: ВАШЕ ЗНАЧЕНИЕ и т.д. }}>
         <Text style={{textAlign: 'center', color: '#FFFFFF'}}>
           {val}
         </Text>
       </View>
     )
  }}
  !!!!!   при этом нужно "скрыть" дэфолтный thumb, указав  !!!!
  thumbStyle={{
  width: ВАШЕ ЗНАЧЕНИЕ,
  height: ВАШЕ ЗНАЧЕНИЕ,
  backgroundColor: 'transparent',
}}
*/

  ...other
}) => {
  const propValue = getBoundedValue(_propValue, maximumValue, minimumValue);

  const prevPropValue = useRef(propValue);
  const _previousLeft = useRef(0);
  const gestureStartPosition = useRef(0);
  const animatedValue = useRef(new Animated.Value(propValue));

  const isVertical = orientation === 'vertical';

  const [allMeasured, setAllMeasured] = useState(false);
  const [trackSize, setTrackSize] = useState({width: 0, height: 0});
  const [thumbSize, setThumbSize] = useState({width: 0, height: 0});
  const [containerSize, setContainerSize] = useState({width: 0, height: 0});

  const handleMeasure = useCallback(
    (name, event: LayoutChangeEvent) => {
      const varInfo = {
        thumbSize: {size: thumbSize, setSize: setThumbSize},
        trackSize: {size: trackSize, setSize: setTrackSize},
        containerSize: {size: containerSize, setSize: setContainerSize},
      };
      const {size, setSize} = varInfo[name];

      const rect = event.nativeEvent.layout;
      const rectWidth = rect?.width ?? size.width;
      const rectHeight = rect?.height ?? size.height;
      const newSize = {
        width: isVertical ? rectHeight : rectWidth,
        height: isVertical ? rectWidth : rectHeight,
      };
      setSize(newSize);
    },
    [containerSize, isVertical, thumbSize, trackSize],
  );

  useEffect(
    () =>
      setAllMeasured(
        !!(
          containerSize.height &&
          containerSize.width &&
          thumbSize.height &&
          thumbSize.width &&
          trackSize.height &&
          trackSize.width
        ),
      ),
    [
      containerSize.height,
      containerSize.width,
      thumbSize.height,
      thumbSize.width,
      trackSize.height,
      trackSize.width,
    ],
  );

  const measureContainer = useCallback(
    event => handleMeasure(SizableVars.containerSize, event),
    [handleMeasure],
  );
  const measureTrack = useCallback(
    event => handleMeasure(SizableVars.trackSize, event),
    [handleMeasure],
  );
  const measureThumb = useCallback(
    event => handleMeasure(SizableVars.thumbSize, event),
    [handleMeasure],
  );

  const setCurrentValue = useCallback(
    v => animatedValue.current.setValue(v),
    [animatedValue],
  );

  const setCurrentValueAnimated = useCallback(
    v =>
      Animated[animationType](animatedValue.current, {
        ...DEFAULT_ANIMATION_CONFIGS[animationType],
        ...animationConfig,
        toValue: v,
      }).start(),
    [animationConfig, animationType],
  );

  useEffect(() => {
    if (prevPropValue.current !== propValue) {
      prevPropValue.current = propValue;
      if (animateTransitions) {
        setCurrentValueAnimated(propValue);
      } else {
        setCurrentValue(propValue);
      }
    }
  }, [
    animateTransitions,
    maximumValue,
    minimumValue,
    setCurrentValue,
    setCurrentValueAnimated,
    propValue,
  ]);

  const getValueForTouch = useCallback(
    location => {
      const length = containerSize.width - thumbSize.width;
      const ratio = location / length;
      let newValue = ratio * (maximumValue - minimumValue);
      if (step) {
        newValue = Math.round(newValue / step) * step;
      }
      return getBoundedValue(
        newValue + minimumValue,
        maximumValue,
        minimumValue,
      );
    },
    [containerSize.width, maximumValue, minimumValue, step, thumbSize.width],
  );

  const getOnTouchValue = useCallback(
    ({nativeEvent}) => {
      const location = isVertical
        ? nativeEvent.locationY
        : nativeEvent.locationX;
      return getValueForTouch(location);
    },
    [getValueForTouch, isVertical],
  );

  const getThumbLeft = useCallback(
    v => {
      const ratio = (v - minimumValue) / (maximumValue - minimumValue);
      return ratio * (containerSize.width - thumbSize.width);
    },
    [containerSize.width, maximumValue, minimumValue, thumbSize.width],
  );

  const getTouchOverflowSize = useCallback(
    () =>
      allMeasured
        ? {
            width: Math.max(0, thumbTouchSize.width - thumbSize.width),
            height: Math.max(0, thumbTouchSize.height - containerSize.height),
          }
        : {height: 0, width: 0},
    [
      allMeasured,
      containerSize.height,
      thumbSize.width,
      thumbTouchSize.height,
      thumbTouchSize.width,
    ],
  );

  const getCurrentValue = useCallback(
    () => animatedValue.current.__getValue(),
    [],
  );

  const getThumbTouchRect = useCallback(() => {
    const touchOverflowSize = getTouchOverflowSize();
    const height =
      touchOverflowSize.height / 2 +
      (containerSize.height - thumbTouchSize.height) / 2;
    const width =
      touchOverflowSize.width / 2 +
      getThumbLeft(getCurrentValue()) +
      (thumbSize.width - thumbTouchSize.width) / 2;
    return isVertical
      ? new Rect(height, width, thumbTouchSize.width, thumbTouchSize.height)
      : new Rect(width, height, thumbTouchSize.width, thumbTouchSize.height);
  }, [
    isVertical,
    getThumbLeft,
    getCurrentValue,
    containerSize.height,
    getTouchOverflowSize,
    thumbSize.width,
    thumbTouchSize.height,
    thumbTouchSize.width,
  ]);

  const getValue = useCallback(
    gestureState => {
      const delta =
        (isVertical ? gestureState.moveY : gestureState.moveX) -
        gestureStartPosition.current;
      const location = _previousLeft.current + delta;
      return getValueForTouch(location);
    },
    [getValueForTouch, isVertical],
  );

  const fireChangeEvent = useCallback(
    event => {
      const v = Math.round(getCurrentValue());
      if (event === EventTypes.onSlidingStart) {
        onSlidingStart?.(v);
      } else if (event === EventTypes.onSlidingComplete) {
        onSlidingComplete?.(v);
      } else if (event === EventTypes.onValueChange) {
        onValueChange?.(v);
      }
    },
    [getCurrentValue, onSlidingComplete, onSlidingStart, onValueChange],
  );

  const handlePanResponderGrant = useCallback(
    (e, gestureState) => {
      _previousLeft.current = getThumbLeft(getCurrentValue());
      gestureStartPosition.current = isVertical
        ? gestureState.y0
        : gestureState.x0;
      fireChangeEvent(EventTypes.onSlidingStart);
    },
    [fireChangeEvent, getCurrentValue, getThumbLeft, isVertical],
  );

  const handlePanResponderMove = useCallback(
    (e, gestureState) => {
      if (!disabled) {
        setCurrentValue(getValue(gestureState));
        fireChangeEvent(EventTypes.onValueChange);
      }
    },
    [disabled, fireChangeEvent, getValue, setCurrentValue],
  );

  const handlePanResponderEnd = useCallback(() => {
    if (!disabled) {
      fireChangeEvent(EventTypes.onSlidingComplete);
    }
  }, [disabled, fireChangeEvent]);

  const thumbHitTest = useCallback(
    ({nativeEvent}) => {
      const thumbTouchRect = getThumbTouchRect();
      return thumbTouchRect.containsPoint(
        nativeEvent.locationX,
        nativeEvent.locationY,
      );
    },
    [getThumbTouchRect],
  );

  const handleStartShouldSetPanResponder = useCallback(
    e => {
      if (!allowTouchTrack) {
        return thumbHitTest(e);
      }
      setCurrentValue(getOnTouchValue(e));
      fireChangeEvent(EventTypes.onValueChange);
      return true;
    },
    [
      thumbHitTest,
      allowTouchTrack,
      fireChangeEvent,
      getOnTouchValue,
      setCurrentValue,
    ],
  );

  const getTouchOverflowStyle = useCallback(() => {
    const {width, height} = getTouchOverflowSize();
    const touchOverflowStyle = {};
    const verticalMargin = -height / 2;
    touchOverflowStyle.marginTop = verticalMargin;
    touchOverflowStyle.marginBottom = verticalMargin;
    const horizontalMargin = -width / 2;
    touchOverflowStyle.marginLeft = horizontalMargin;
    touchOverflowStyle.marginRight = horizontalMargin;
    return touchOverflowStyle;
  }, [getTouchOverflowSize]);

  const getMinimumTrackStyles = useCallback(
    thumbStart => {
      const minimumTrackStyle = {
        position: 'absolute',
      };
      if (!allMeasured) {
        minimumTrackStyle.height = 0;
        minimumTrackStyle.width = 0;
      } else if (isVertical) {
        minimumTrackStyle.height = Animated.add(
          thumbStart,
          thumbSize.height / 2,
        );
        minimumTrackStyle.marginLeft = trackSize.width * TRACK_STYLE;
      } else {
        minimumTrackStyle.width = Animated.add(thumbStart, thumbSize.width / 2);
        minimumTrackStyle.marginTop = trackSize.height * TRACK_STYLE;
      }
      return minimumTrackStyle;
    },
    [
      allMeasured,
      isVertical,
      thumbSize.width,
      trackSize.width,
      trackSize.height,
      thumbSize.height,
    ],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onPanResponderMove: handlePanResponderMove,
        onPanResponderGrant: handlePanResponderGrant,
        onPanResponderRelease: handlePanResponderEnd,
        onPanResponderTerminate: handlePanResponderEnd,
        onMoveShouldSetPanResponder: handleMoveShouldSetPanResponder,
        onStartShouldSetPanResponder: handleStartShouldSetPanResponder,
        onPanResponderTerminationRequest: handlePanResponderRequestEnd,
      }),
    [
      handlePanResponderEnd,
      handlePanResponderMove,
      handlePanResponderGrant,
      handleStartShouldSetPanResponder,
    ],
  );

  const mainStyles = containerStyle ?? styles;
  const appliedTrackStyle = StyleSheet.flatten([styles.track, trackStyle]);
  const thumbStart = animatedValue.current.interpolate({
    inputRange: [minimumValue, maximumValue],
    outputRange: [0, containerSize.width - thumbSize.width],
  });
  const minimumTrackStyle = {
    ...getMinimumTrackStyles(thumbStart),
    backgroundColor: minimumTrackTintColor,
  };
  const touchOverflowStyle = getTouchOverflowStyle();

  return (
    <View
      {...other}
      style={StyleSheet.flatten([
        isVertical
          ? mainStyles.containerVertical
          : mainStyles.containerHorizontal,
        style,
      ])}
      onLayout={measureContainer}
      accessibilityRole="adjustable"
      accessibilityValue={{
        min: minimumValue,
        max: maximumValue,
        now: getCurrentValue(),
      }}>
      <View
        style={StyleSheet.flatten([
          mainStyles.track,
          isVertical ? mainStyles.trackVertical : mainStyles.trackHorizontal,
          appliedTrackStyle,
          {backgroundColor: maximumTrackTintColor},
        ])}
        onLayout={measureTrack}
      />
      <Animated.View
        style={StyleSheet.flatten([
          mainStyles.track,
          isVertical ? mainStyles.trackVertical : mainStyles.trackHorizontal,
          appliedTrackStyle,
          minimumTrackStyle,
        ])}
      />
      <Thumb
        style={thumbStyle}
        start={thumbStart}
        vertical={isVertical}
        showLabel={showLabel}
        color={thumbTintColor}
        isVisible={allMeasured}
        onLayout={measureThumb}
        labelProps={labelProps}
        thumbSize={thumpSizeProp}
        stylesLabel={stylesLabel}
        val={Math.round(getCurrentValue())}
        {...thumbProps}
      />
      <View
        style={StyleSheet.flatten([styles.touchArea, touchOverflowStyle])}
        {...panResponder.panHandlers}
      />
      {/*здесь могут быть еще насечки прогресса */}

      {showMinMax && (
        <View style={{...styles.minMaxWrapper, top: thumbTouchSize.height + 10}}>
          <Text style={{...styles.minMaxText, ...minMaxTextStyle}}>
            {minimumValue ?? minimumValue}
          </Text>
          <Text style={{...styles.minMaxText, ...minMaxTextStyle}}>
            {maximumValue ?? maximumValue}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerHorizontal: {
    height: 40,
    justifyContent: 'center',
  },
  containerVertical: {
    width: 40,
    alignItems: 'center',
    flexDirection: 'column',
  },
  track: {
    borderRadius: TRACK_SIZE / 2,
  },
  trackHorizontal: {
    height: TRACK_SIZE,
  },
  trackVertical: {
    flex: 1,
    width: TRACK_SIZE,
  },
  touchArea: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  minMaxWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  minMaxText: {
    color: '#697386',
    fontWeight: '500',
    fontSize: 16,
  },
});

// насечки под слайдером, если понядобятся
// <View
//   style={{
//     position: 'absolute',
//     top: thumbTouchSize.height,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: thumpSizeProp / 2,
//   }}>
//   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((el, i) => {
//     const firstEl = el === 1;
//     const middleEl = el === 5;
//     const lastEl = el === 11;
//     const showDescr = firstEl ? minimumValue : lastEl ? maximumValue : '';
//     return (
//       <View
//         style={{
//           width: 2,
//           height: lastEl || firstEl ? 14 : 7,
//           backgroundColor: '#A3ACB9',
//         }}>
//         {!!showDescr && <Text>{firstEl}</Text>}
//       </View>
//     );
//   })}
// </View>
