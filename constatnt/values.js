import {Dimensions} from 'react-native';
import faker from '@faker-js/faker';

export const DEVICE_HEIGHT = Dimensions.get('screen').height;
export const DEVICE_WIDTH = Dimensions.get('screen').width;
// export const WINDOW_WIDTH = isIphone ? Dimensions.get('window').width : ExtraDimensions.get('REAL_WINDOW_WIDTH');
// export const WINDOW_HEIGHT = isIphone ? Dimensions.get('window').height : ExtraDimensions.get('REAL_WINDOW_HEIGHT');

export const createDataForDragList = () => {
  const data = [];
  for (let i = 0; i < 20; i++) {
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
};
