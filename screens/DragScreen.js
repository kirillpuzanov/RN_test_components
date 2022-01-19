import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {OpacityDecorator} from 'react-native-draggable-flatlist/src/components/CellDecorators';
import DraggableFlatList from 'react-native-draggable-flatlist/src/components/DraggableFlatList';
import {createDataForDragList, DEVICE_HEIGHT} from '../constatnt/values';

const startData = createDataForDragList();

export const DragScreen = () => {
  const [localData, setLocalData] = useState(startData);

  const renderItem = ({item, drag, isActive}) => {
    return (
      <OpacityDecorator>
        <TouchableOpacity
          style={[
            styles.rowItem,
            {borderColor: isActive ? 'red' : '', borderWidth: isActive ? 2 : 0},
          ]}
          onLongPress={drag}
          disabled={isActive}>
          <Image
            style={{width: 50, height: 50, borderRadius: 25}}
            source={{uri: item.ava}}
          />
          <View style={{paddingHorizontal: 16, width: '90%'}}>
            <View style={{flexDirection: 'row'}}>
              <Text>{item.firstName}</Text>
              <Text>{item.lastName}</Text>
            </View>
            <Text>{item.email}</Text>
            <Text numberOfLines={1}>{item.job}</Text>
          </View>
        </TouchableOpacity>
      </OpacityDecorator>
    );
  };

  return (
    <View style={styles.screen}>
      <DraggableFlatList
        data={localData}
        onDragEnd={({data}) => setLocalData(data)}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    height: DEVICE_HEIGHT - 200,
    backgroundColor: '#ffd1d1',
  },
  rowItem: {
    marginTop: 8,
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#9f9d9d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
