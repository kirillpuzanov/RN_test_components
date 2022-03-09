import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {HomeScreen} from '../screens/HomeScreens';
import {DragScreen} from '../screens/DragScreen';
import {DatePickerScreen} from '../screens/DatePicker';
import {BlurScreen} from '../screens/Blur';
import {SliderInputRange} from '../screens/Slider_InputRange';
import { UploadFileScreen } from "../screens/UploadFileScreen";

const Drawer = createDrawerNavigator();

export function AppNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="DragList" component={DragScreen} />
      <Drawer.Screen name="DataPecker" component={DatePickerScreen} />
      <Drawer.Screen name="BlurScreen" component={BlurScreen} />
      <Drawer.Screen name="SliderInputRange" component={SliderInputRange} />
      <Drawer.Screen name="UploadFileImg" component={UploadFileScreen} />
    </Drawer.Navigator>
  );
}
