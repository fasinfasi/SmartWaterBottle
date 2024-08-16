import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import WelcomeScreen from './app/screens/WelcomeScreen';
import InputScreen from './app/screens/InputNameScreen';
import AgeInputScreen from './app/screens/InputAgeScreen';
import WeightInputScreen from './app/screens/InputWeightScreen';
import HomeScreen from './app/screens/HomeScreen';
import SettingScreen from './app/screens/SettingScreen';
import QuestionScreen from './app/screens/QuestionScreen';




 
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="InputScreen" component={InputScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AgeInputScreen" component={AgeInputScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WeightInputScreen" component={WeightInputScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="QuestionScreen" component={QuestionScreen} options={{ headerShown: false }} />



      </Stack.Navigator> 
    </NavigationContainer>
  );
};

export default App;