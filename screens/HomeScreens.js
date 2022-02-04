import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

export const HomeScreen = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>] Start [</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '700',
  },
});
