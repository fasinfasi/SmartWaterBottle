import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 360;

const StatusPage = () => {
  const navigation = useNavigation();
  const [activityLevel, setActivityLevel] = useState('');
  const [healthCondition, setHealthCondition] = useState('');

  const handleContinue = () => {
    if (activityLevel === '' || healthCondition === '') {
      Alert.alert(
        'Incomplete Information',
        'Please select both Activity Level and Health Condition.',
        [{ text: 'OK' }]
      );
      return;
    }

    console.log('Activity Level:', activityLevel);
    console.log('Health Condition:', healthCondition);
    navigation.navigate('HomeScreen'); // Replace 'HomeScreen' with your next screen's name
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={isSmallDevice ? 20 : 24} color="#000" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>What is your current status?</Text>
      </View>
      <View style={styles.pickerWrapper}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={activityLevel}
            style={styles.picker}
            onValueChange={(itemValue) => setActivityLevel(itemValue)}
          >
            <Picker.Item label="Activity Level" value="" />
            <Picker.Item label="Low" value="low" />
            <Picker.Item label="Moderate" value="moderate" />
            <Picker.Item label="High" value="high" />
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={healthCondition}
            style={styles.picker}
            onValueChange={(itemValue) => setHealthCondition(itemValue)}
          >
            <Picker.Item label="Health Condition" value="" />
            <Picker.Item label="No Specification" value="no_specification" />
            <Picker.Item label="Kidney Stone" value="kidney_stone" />
            <Picker.Item label="Heart Diseases" value="heart_diseases" />
            <Picker.Item label="Diabetes" value="diabetes" />
            <Picker.Item label="Pregnancy" value="pregnancy" />
            <Picker.Item label="Breastfeeding" value="breastfeeding" />
          </Picker>
        </View>
      </View>
      <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '5%',
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    left: '8%',
    top: Platform.OS === 'ios' ? '5%' : '8%',
  },
  titleContainer: {
    position: 'absolute',
    top: '20%', // Adjust this percent weight as needed to move the title up or down
    width: '100%',
    alignItems: 'center',
    marginHorizontal:'6%',
  },
  
  title: {
    fontSize: isSmallDevice ? width * 0.06 : width * 0.09, 
    color: '#0000ff',
    textAlign: 'center',
  },
  pickerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: '80%',
    marginBottom: '3%',
    marginTop: '12%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10, 
  },
  picker: {
    height: Platform.OS === 'ios' ? 200 : 50,
    width: '100%',
  },
  continueButton: {
    backgroundColor: '#0000ff',
    paddingVertical: isSmallDevice ? 12 : 17,
    paddingHorizontal: 85,
    borderRadius: 25,
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StatusPage;
