import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import WelcomeScreen from './app/screens/WelcomeScreen';
import LoginScreen from './app/screens/LoginScreen';
import PasswordResetScreen from './app/screens/PasswordResetScreen';
import SignupScreen from './app/screens/SignupScreen';
import NameInputScreen from './app/screens/InputNameScreen';
import AgeInputScreen from './app/screens/InputAgeScreen';
import WeightInputScreen from './app/screens/InputWeightScreen';
import HomeScreen from './app/screens/HomeScreen';
import SettingScreen from './app/screens/SettingScreen';
import QuestionScreen from './app/screens/QuestionScreen';
import NotificationScreen from './app/screens/NotificationScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import EditProfileScreen from './app/screens/EditProfileScreen';
import GeneralSetting from './app/screens/GeneralSettingScreen';
import KnowMoreAbout from './app/screens/KnowMoreAboutScreen';
import FeedbackScreen from './app/screens/FeedbackScreen';
 
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PasswordResetScreen" component={PasswordResetScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NameInputScreen" component={NameInputScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AgeInputScreen" component={AgeInputScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WeightInputScreen" component={WeightInputScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="QuestionScreen" component={QuestionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GeneralSetting" component={GeneralSetting} options={{ headerShown: false }} />
        <Stack.Screen name="KnowMoreAbout" component={KnowMoreAbout} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} options={{ headerShown: false }} />
        
      </Stack.Navigator> 
    </NavigationContainer>
  );
};

export default App;