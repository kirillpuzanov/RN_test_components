import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {HomeScreen} from '../screens/HomeScreens';
import {DragScreen} from '../screens/DragScreen';
import {DatePickerScreen} from '../screens/DatePicker';
import {BlurScreen} from '../screens/Blur';

const Drawer = createDrawerNavigator();

export function AppNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="DragList" component={DragScreen} />
      <Drawer.Screen name="DataPecker" component={DatePickerScreen} />
      <Drawer.Screen name="BlurScreen" component={BlurScreen} />
    </Drawer.Navigator>
  );
}
