import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {UploadModal} from '../components/UploadModal';

export const UploadFileScreen = () => {
  console.log();
  const [fileResponse, setFileResponse] = useState([]);
  const [imgData, setImgData] = useState([]);
  const [visibleUploadModal, setVisibleUploadModal] = useState(false);
  console.log('fileResponse ----', fileResponse);

  const showStartChoiceArea = !fileResponse?.length && !imgData?.length;
  const showMiniChoiceArea = fileResponse?.length + imgData?.length < 10;
  console.log('showStartChoiceArea--', showStartChoiceArea);
  const deleteIntermediateImage = img => {
    setImgData(prev => prev.filter(el => el.fileName !== img.fileName));
  };
  const deleteIntermediateFile = name => {
    setFileResponse(prev => prev.filter(el => el.name !== name));
  };
  return (
    <View style={[styles.screen]}>
      {showStartChoiceArea ? (
        <TouchableOpacity
          style={styles.startChoiceArea}
          onPress={() => setVisibleUploadModal(true)}>
          <Text style={{fontSize: 16, color: '#5C5C5C'}}>
            Загрузить изображение или файл
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          {!!imgData?.length && (
            <View style={styles.intermediateImagesBlock}>
              <Text>Изображения</Text>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                bounces={false}
                contentContainerStyle={{alignItems: 'flex-end'}}>
                {showMiniChoiceArea && (
                  <TouchableOpacity
                    style={styles.choiceArea}
                    onPress={() => setVisibleUploadModal(true)}>
                    <Text style={{fontSize: 32, color: '#5C5C5C'}}>+</Text>
                  </TouchableOpacity>
                )}
                {imgData.map(el => (
                  <View key={el.fileName}>
                    <Image
                      source={{uri: el.uri}}
                      style={styles.intermediateImage}
                    />
                    <TouchableOpacity
                      style={styles.deleteImgBtn}
                      onPress={() => deleteIntermediateImage(el)}>
                      <Text style={{fontSize: 14}}>X</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
          {!!fileResponse?.length && (
            <View style={styles.intermediateImagesBlock}>
              <Text>Документ</Text>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                bounces={false}
                contentContainerStyle={{alignItems: 'flex-end'}}>
                {!imgData?.length && (
                  <TouchableOpacity
                    style={styles.choiceArea}
                    onPress={() => setVisibleUploadModal(true)}>
                    <Text style={{fontSize: 32, color: '#5C5C5C'}}>+</Text>
                  </TouchableOpacity>
                )}
                {fileResponse.map(el => (
                  <View key={el.fileName}>
                    <View
                      style={{
                        width: 98,
                        height: 98,
                        borderRadius: 16,
                        padding: 10,
                        margin: 8,
                        backgroundColor: '#b4b4b4',
                      }}>
                      <Text
                        numberOfLines={2}
                        style={{flex: 1}}
                        allowFontScaling={false}
                        ellipsizeMode={'middle'}>
                        {el.name}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteImgBtn}
                      onPress={() => deleteIntermediateFile(el.name)}>
                      <Text style={{fontSize: 14}}>X</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </>
      )}

      <UploadModal
        onCloseModal={() => setVisibleUploadModal(false)}
        visibleUploadModal={visibleUploadModal}
        setImage={setImgData}
        setFileResponse={setFileResponse}
        // imageUrl={user.image_url}
        // deleteImg={deleteAvatarRequest}
        // choiceMode="avatar"
      />
    </View>
  );
};


const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  startChoiceArea: {
    marginTop: 24,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: '#5C5C5C',
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceArea: {
    width: 98,
    height: 98,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: '#5C5C5C',
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  intermediateImage: {
    width: 98,
    height: 98,
    borderRadius: 16,
    margin: 8,
  },
  intermediateImagesBlock: {
    marginTop: 4,
    paddingLeft: 20,
    minHeight: 110,
  },
  deleteImgBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    right: 14,
    top: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
