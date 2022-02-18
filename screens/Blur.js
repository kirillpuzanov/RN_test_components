import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
import {DEVICE_WIDTH} from '../constatnt/values';

export const BlurScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, {paddingBottom: insets.bottom / 2}]}>
      <ImageBackground
        source={require('../assets/img/night-new-york-10057.jpeg')}
        resizeMode="cover"
        // blurRadius={2} // размытие изображения экрана ( fastImage не поддерживает этот prop )
        style={styles.image}>
        <MyButton
          onPress={() => console.warn('Press First Button')}
          title="Регистрация"
        />
        <MyBlurButton
          onPress={() => console.warn('Press Second Button')}
          title="Войти"
        />
      </ImageBackground>
    </View>
  );
};
const MyBlurButton = ({onPress, title}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.btnWrapper}
      onPress={onPress}>
      <BlurView
        style={styles.absolute}
        blurType="light"
        blurAmount={20}
        // overlayColor={''}
        // reducedTransparencyFallbackColor="white"
      />
      <Text style={[styles.text]}>{title}</Text>
    </TouchableOpacity>
  );
};

const MyButton = ({onPress, title}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.btnWrapper,
        {backgroundColor: '#32ADE6', marginBottom: 20},
      ]}
      onPress={onPress}>
      <Text style={[styles.text, {color: '#FFFFFF'}]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(7,7,7, 1)',
  },
  image: {
    flex: 1,
    paddingHorizontal: 20,
    width: DEVICE_WIDTH,
    justifyContent: 'center',
  },
  btnWrapper: {
    overflow: 'hidden', // для родителя BlurView, иначе Андроид блюрит весь экран целиком, а Ios нет ...
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  absolute: {
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
