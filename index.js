import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import faker from '@faker-js/faker';
faker.locale = 'ru';
AppRegistry.registerComponent(appName, () => App);
