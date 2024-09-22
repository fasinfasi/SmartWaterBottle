import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Dimensions, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const EditProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Initialize state with default values or values from params
  const [name, setName] = useState(route.params?.userDetails.name || '');
  const [sex, setSex] = useState(route.params?.userDetails.sex || 'Select');
  const [selectedAge, setSelectedAge] = useState(route.params?.userDetails.age || 'Select');
  const [selectedWeight, setSelectedWeight] = useState(route.params?.userDetails.weight || 'Select');
  const [activityLevel, setActivityLevel] = useState(route.params?.userDetails.activity || 'Select');
  const [healthCondition, setHealthCondition] = useState(route.params?.userDetails.healthCondition || 'Select');

  const handleSubmit = () => {
    if (name === '' || selectedAge === 'Select' || sex === 'Select' || activityLevel === 'Select' || healthCondition === 'Select') {
      Alert.alert('Validation Error', 'Please fill out all fields');
      return;
    }

    console.log('Updated Profile Details:');
    console.log('Name:', name);
    console.log('Sex:', sex);
    console.log('Age:', selectedAge);
    console.log('Weight:', selectedWeight);
    console.log('Activity Level:', activityLevel);
    console.log('Health Condition:', healthCondition);

    // Pass updated details back to ProfileScreen
    navigation.navigate('ProfileScreen', {
      userDetails: {
        name,
        sex,
        age: selectedAge,
        weight: selectedWeight,
        activity: activityLevel,
        healthCondition
      }
    });
  };

  const ageOptions = Array.from({ length: 120 - 7 + 1 }, (_, i) => i + 7);
  const weightOptions = Array.from({ length: 240 - 20 + 1 }, (_, i) => i + 20);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={['#2DAFD8', '#185D72']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrowContainer}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Edit Profile</Text>
          </View>

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

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Weight</Text>
              <Picker
                selectedValue={selectedWeight}
                style={styles.dropdown}
                onValueChange={(itemValue) => setSelectedWeight(itemValue)}
              >
                <Picker.Item label="Select" value="Select" />
                {weightOptions.map(weight => (
                  <Picker.Item key={weight} label={weight.toString()} value={weight} />
                ))}
              </Picker>
            </View>

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

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Health Condition</Text>
              <Picker
                selectedValue={healthCondition}
                style={styles.dropdown}
                onValueChange={(itemValue) => setHealthCondition(itemValue)}
              >
                <Picker.Item label="Select" value="Select" />
                <Picker.Item label="No Concerns" value="No Concerns" />
                <Picker.Item label="Kidney stone" value="Kidney stone" />
                <Picker.Item label="Liver disease" value="Liver Disease" />
                <Picker.Item label="Diabetes" value="Diabetes" />
                <Picker.Item label="Pregnancy" value="Pregnancy" />
                <Picker.Item label="Breastfeeding" value="Breastfeeding" />
              </Picker>
            </View>

            <Button title="Save" onPress={handleSubmit} />
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
    marginBottom: 5,
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
    marginTop: 0, 
    marginBottom: 10,
    
  },
});

export default EditProfileScreen;
