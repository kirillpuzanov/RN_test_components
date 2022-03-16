import {Dimensions, Platform} from 'react-native';
import ExtraDimensions from 'react-native-extra-dimensions-android';

export const isIphone = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const DEVICE_HEIGHT = Dimensions.get('screen').height;
export const DEVICE_WIDTH = Dimensions.get('screen').width;
export const WINDOW_WIDTH = isIphone
  ? Dimensions.get('window').width
  : ExtraDimensions.get('REAL_WINDOW_WIDTH');
export const WINDOW_HEIGHT = isIphone
  ? Dimensions.get('window').height
  : ExtraDimensions.get('REAL_WINDOW_HEIGHT');

export const flexCenter = {
  alignItems: 'center',
  justifyContent: 'center',
};
export const flexRowCenterSp = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};
