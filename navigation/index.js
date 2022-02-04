import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AppNavigator} from './appNavigator';

export const NavigationContainerComponent = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};
