import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {HomeScreen} from '../screens/HomeScreens';
import {DragScreen} from '../screens/DragScreen';

const Drawer = createDrawerNavigator();

export function AppNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Drag List" component={DragScreen} />
    </Drawer.Navigator>
  );
}
