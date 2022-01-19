import React from 'react';
import {StyleSheet} from 'react-native';
import {DragScreen} from './screens/DragScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={styles.screen}>
      <DragScreen />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#ececec',
  },
});
export default App;
