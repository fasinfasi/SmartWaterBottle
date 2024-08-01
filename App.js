import React from 'react';
import {Text, SafeAreaView} from 'react-native'
import WelcomeScreen from './app/screens/WelcomeScreen';
import InputScreen from './app/screens/InputNameScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const App = () => {
  <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="InputScreen" component={InputScreen} /> {/* Replace with your actual screen */}
      </Stack.Navigator>
    </NavigationContainer>
};

export default App;
