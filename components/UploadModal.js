import React, {useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isIphone, WINDOW_HEIGHT, WINDOW_WIDTH} from '../constatnt/values';
import DocumentPicker, {types} from 'react-native-document-picker';
import {launchImageLibrary} from 'react-native-image-picker';

export const UploadModal = props => {
  const {onCloseModal, setImage, visibleUploadModal, setFileResponse} = props;
  const insets = useSafeAreaInsets();

  const baseOption = {
    title: 'Выберите файл',
    mediaType: 'mixed',
    quality: 0.8,
    videoQuality: isIphone ? 'medium' : 'low',
    maxWidth: 1024,
    maxHeight: 768,
    saveToPhotos: false,
    selectionLimit: 4,
  };

  const libraryMode = async () => {
    console.log('libraryMode');
    launchImageLibrary(baseOption)
      .then(image => {
        console.log('library images ===>', image);
        image?.assets?.length > 0 &&
          setImage(prev => [...prev, ...image.assets]);
        onCloseModal();
      })
      .catch(() => onCloseModal());
    // onCloseModal();
    // setImage(prev => [...prev, ...result]);
  };

  // const cameraMode = () => {
  //   ImagePicker.launchCamera({...getProps(), multiple: false})
  //     .then(image => {
  //       console.log('camera images ===>', image);
  //       onCloseModal();
  //       choiceMode === 'chat'
  //         ? setImage(prev => [...prev, image])
  //         : setImage(image);
  //     })
  //     .catch(() => onCloseModal());
  // };

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [
          types.plainText,
          types.pdf,
          types.csv,
          types.doc,
          types.docx,
          types.xls,
          types.xlsx,
        ],
      });
      const newResponse = response.map(el => {
        const fileType = el.name.split('.').reverse()[0];
        return {...el, fileType};
      });
      setFileResponse(prev => [...prev, ...newResponse]);
      onCloseModal();
    } catch (err) {
      onCloseModal();
    }
  }, []);

  return (
    <Modal
      isVisible={visibleUploadModal}
      style={{margin: 0, padding: 0}}
      onRequestClose={onCloseModal}
      statusBarTranslucent
      deviceWidth={WINDOW_WIDTH}
      deviceHeight={WINDOW_HEIGHT}>
      <TouchableOpacity
        onPress={onCloseModal}
        style={{width: '100%', height: '100%', position: 'absolute'}}
      />
      <View style={[styles.container]}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[
              styles.buttonStyle,
              {borderBottomColor: '#8d8d8d', borderBottomWidth: 1},
            ]}
            onPress={libraryMode}>
            <Text style={[styles.textStyle]}>Фото или видео</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            style={[styles.buttonStyle, {}]}
            onPress={handleDocumentSelection}>
            <Text style={[styles.textStyle]}>Приложить документ</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          style={[
            styles.buttonStyle,
            {
              marginTop: 16,
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20 + insets.bottom / 4,
            },
          ]}
          onPress={() => {
            onCloseModal();
            // setImage({});
          }}>
          <Text style={[styles.textStyle, {color: '#32ADE6'}]}>Отмена</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    textAlign: 'center',
  },
  buttonStyle: {
    paddingVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
});
