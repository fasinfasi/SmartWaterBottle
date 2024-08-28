import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Dimensions, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; 

// Get the device's screen width to adjust the title size dynamically
const { width } = Dimensions.get('window');

const EditProfileScreen = () => {
  // State variables with default values set to 'Select'
  const [name, setName] = useState('');
  const [selectedAge, setSelectedAge] = useState('Select');
  const [sex, setSex] = useState('Select');
  const [activityLevel, setActivityLevel] = useState('Select');
  const [healthCondition, setHealthCondition] = useState('Select');

  // Navigation hook to navigate between screens
  const navigation = useNavigation();

  // Handle form submission
  const handleSubmit = () => {
    if (name === '' || selectedAge === 'Select' || sex === 'Select' || activityLevel === 'Select' || healthCondition === 'Select') {
      Alert.alert('Validation Error', 'Please fill out all fields');
      return;
    }
    console.log('Form submitted:', { name, selectedAge, sex, activityLevel, healthCondition });
    navigation.navigate('ProfileScreen');
  };

  // Generate age options from 6 to 120 for the age picker
  const ageOptions = Array.from({ length: 120 - 6 + 1 }, (_, i) => i + 6);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#2DAFD8', '#185D72']} 
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Back arrow icon */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Container for the title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Edit Profile</Text>
          </View>
          
          {/* Container for the form fields */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Age picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Age</Text>
              <Picker
                selectedValue={selectedAge}
                style={styles.dropdown}
                onValueChange={(itemValue) => setSelectedAge(itemValue)}
              >
                <Picker.Item label="Select" value="Select" />
                {ageOptions.map(age => (
                  <Picker.Item key={age} label={age.toString()} value={age} />
                ))}
              </Picker>
            </View>

            {/* Sex picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Sex</Text>
              <Picker
                selectedValue={sex}
                style={styles.dropdown}
                onValueChange={(itemValue) => setSex(itemValue)}
              >
                <Picker.Item label="Select" value="Select" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>

            {/* Activity level picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Activity Level</Text>
              <Picker
                selectedValue={activityLevel}
                style={styles.dropdown}
                onValueChange={(itemValue) => setActivityLevel(itemValue)}
              >
                <Picker.Item label="Select" value="Select" />
                <Picker.Item label="Low" value="Low" />
                <Picker.Item label="Moderate" value="Moderate" />
                <Picker.Item label="High" value="High" />
              </Picker>
            </View>

            {/* Health condition picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Health Condition</Text>
              <Picker
                selectedValue={healthCondition}
                style={styles.dropdown}
                onValueChange={(itemValue) => setHealthCondition(itemValue)}
              >
                <Picker.Item label="Select" value="Select" />
                <Picker.Item label="No Specification" value="No Specification" />
                <Picker.Item label="Kidney Stone" value="Kidney Stone" />
                <Picker.Item label="Heart Diseases" value="Heart Diseases" />
                <Picker.Item label="Diabetes" value="Diabetes" />
                <Picker.Item label="Pregnancy" value="Pregnancy" />
                <Picker.Item label="Breastfeeding" value="Breastfeeding" />
              </Picker>
            </View>

            {/* Submit button */}
            <View style={styles.buttonContainer}>
              <Button title="Submit" onPress={handleSubmit} color="#2250e6" />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  backArrowContainer: {
    position: 'absolute',
    top: 30, // Adjust based on your header height
    left: 7,
    zIndex: 1, 
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: '20%',
    marginBottom: 16,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    color: '#fff',
  },
  pickerContainer: {
    marginBottom: 12,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    color: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 20, 
    marginBottom: 20,
  },
});

export default EditProfileScreen;