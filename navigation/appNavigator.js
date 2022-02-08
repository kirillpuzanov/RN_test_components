import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {HomeScreen} from '../screens/HomeScreens';
import {DragScreen} from '../screens/DragScreen';
import { DatePickerScreen } from "../screens/DatePicker";

const Drawer = createDrawerNavigator();

export function AppNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Drag List" component={DragScreen} />
      <Drawer.Screen name="Data Pecker" component={DatePickerScreen} />
    </Drawer.Navigator>
  );
}
