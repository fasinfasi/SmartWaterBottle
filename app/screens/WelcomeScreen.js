import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient colors={['#2DAFD8', '#185D72']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image source={require('../assets/water_bottle_logo_welcome_page.png')} style={styles.image} />
      <Text style={styles.appName}>Aguasync</Text>
      <Text style={styles.description}>
        Welcome to Aguasync! This tracks your water intake effortlessly.
        Track your hydration progress and see how it impacts your overall health. 
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('InputScreen')}>
        <Text style={styles.buttonText}>Get Start</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  description: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    position: 'absolute',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 84,
    borderRadius: 25,
    marginTop: 300,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
