import React, {memo, useMemo, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import DraggableFlatList from 'react-native-draggable-flatlist';
import faker from '@faker-js/faker';

export const DragScreen = memo(() => {
  const createDataForDragList = useMemo(() => {
    const data = [];
    for (let i = 0; i < 15; i++) {
      const item = {
        id: i,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        job: faker.name.jobTitle(),
        email: faker.internet.email(),
        ava: faker.image.avatar(),
      };
      data.push(item);
    }
    return data;
  }, []);

  const startData = createDataForDragList;
  const startData2 = createDataForDragList;

  const [localData, setLocalData] = useState(startData);

  /**
   *     1 вариант - 1 DList с возможностью автоскролла при перемещении,
   * 2 вариант - несколько листов внутри экрана ScrollView ( из gesture-handler !!!! )
   * возможности автоскролла внутри листа нет, перемещение только в видимой области,
   * для работы основного скролла экрана менять флаг scrollEnable на ScrollView и связать все листы рефом
   * передав его как simultaneousHandlers в DraggableFlatList и в ScrollView;
   */

  const scrollViewRef = useRef();
  const [localData2, setLocalData2] = useState(startData2);
  const [scrollEnable, setScrollEnable] = useState(true);

  const renderItem = ({item, drag, isActive}) => {
    return (
      <TouchableOpacity
        style={[
          styles.rowItem,
          {
            opacity: isActive ? 0.4 : 1,
            borderWidth: isActive ? 2 : 0,
            borderColor: isActive ? '#ff9e4e' : 'transparent',
          },
        ]}
        activeOpacity={0.9}
        onLongPress={drag}
        disabled={isActive}>
        <Image style={styles.avaStyles} source={{uri: item.ava}} />
        <View style={{paddingHorizontal: 16, width: '90%'}}>
          <View style={{flexDirection: 'row'}}>
            <Text>{item.firstName} </Text>
            <Text>{item.lastName}</Text>
          </View>
          <Text>{item.email}</Text>
          <Text numberOfLines={1}>{item.job}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={styles.screen}>
      {/*1 вар*/}
      <Text style={styles.screenTitle}>Drag List`s</Text>
      <View style={styles.dragZone}>
        <Text style={styles.subTitle}>People</Text>
        <DraggableFlatList
          data={localData}
          onDragBegin={() => setScrollEnable(false)}
          onDragEnd={({data}) => {
            setLocalData(data);
            setScrollEnable(true);
          }}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          // simultaneousHandlers={scrollViewRef}
          // activationDistance={10}
          // autoscrollThreshold={90}
          // autoscrollSpeed={5}
        />
      </View>

      {/*2 вар*/}

      {/*<ScrollView*/}
      {/*  style={styles.screen}*/}
      {/*  ref={scrollViewRef}*/}
      {/*  showsVerticalScrollIndicator={false}*/}
      {/*  scrollEnabled={scrollEnable}>*/}
      {/*  <Text style={styles.screenTitle}>Drag List`s</Text>*/}
      {/*  <View style={styles.dragZone}>*/}
      {/*    <Text style={styles.subTitle}>People</Text>*/}
      {/*    <DraggableFlatList*/}
      {/*      data={localData}*/}
      {/*      onDragBegin={() => setScrollEnable(false)}*/}
      {/*      onDragEnd={({data}) => {*/}
      {/*        setLocalData(data);*/}
      {/*        setScrollEnable(true);*/}
      {/*      }}*/}
      {/*      keyExtractor={item => item.id}*/}
      {/*      renderItem={renderItem}*/}
      {/*      showsVerticalScrollIndicator={false}*/}
      {/*      simultaneousHandlers={scrollViewRef}*/}
      {/*      activationDistance={10}*/}
      {/*      // autoscrollThreshold={90}*/}
      {/*      // autoscrollSpeed={5}*/}
      {/*    />*/}
      {/*  </View>*/}
      {/*  <View style={styles.dragZone}>*/}
      {/*    <Text style={styles.subTitle}>People 2 </Text>*/}
      {/*    <DraggableFlatList*/}
      {/*      bounces={false}*/}
      {/*      data={localData2}*/}
      {/*      onDragBegin={() => setScrollEnable(false)}*/}
      {/*      onDragEnd={({data}) => {*/}
      {/*        setLocalData2(data);*/}
      {/*        setScrollEnable(true);*/}
      {/*      }}*/}
      {/*      keyExtractor={item => item.id}*/}
      {/*      renderItem={renderItem}*/}
      {/*      showsVerticalScrollIndicator={false}*/}
      {/*      simultaneousHandlers={scrollViewRef}*/}
      {/*      activationDistance={10}*/}
      {/*      // autoscrollThreshold={90}*/}
      {/*      // autoscrollSpeed={5}*/}
      {/*    />*/}
      {/*  </View>*/}
      {/*</ScrollView>*/}
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
  },
  screenTitle: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '700',
    height: 60,
  },
  dragZone: {
    flex: 0.93,
  },
  rowItem: {
    marginVertical: 4,
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#9f9d9d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avaStyles: {
    width: 50,
    height: 50,
  },
  subTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '500',
    height: 40,
  },
});
