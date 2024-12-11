import { AppRegistry } from 'react-native';
import App from './App';  // This imports your App.js
import { name as appName } from './app.json';  // This gets the app name from app.json

AppRegistry.registerComponent(appName, () => App);  // Registers your app with the name from app.json
