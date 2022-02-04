import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import faker from '@faker-js/faker';

LogBox.ignoreAllLogs();
faker.locale = 'ru';

AppRegistry.registerComponent(appName, () => App);
