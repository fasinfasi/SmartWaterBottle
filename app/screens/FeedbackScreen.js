import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RadioButton, TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

const { width, height } = Dimensions.get('window');

const FeedbackScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    navigationEase: '',
    reminderHelpfulness: '',
    bluetoothPerformance: '',
    waterLevelAccuracy: '',
    hydrationUsefulness: '',
    recommendationFit: '',
    overallExperience: '',
    encountegreyBugs: '',
    additionalSuggestions: '',
  });

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    const emptyFields = Object.values(formData).some(field => field === '');
    if (emptyFields) {
      Alert.alert('Incomplete Form', 'Please fill out all fields before submitting.');
      return;
    }

    console.log('Feedback saved successfully')
    Alert.alert('Feedback Submitted', 'Thank you for your feedback : )');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#164a9e', '#0c3a85']} // Blue to white gradient
        style={styles.linearGradient}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>Feedback</Text>

          <Text style={styles.questionText}>1. Was the app easy to navigate and use?</Text>
          <RadioButton.Group
            onValueChange={(value) => handleInputChange('navigationEase', value)}
            value={formData.navigationEase}
          >
            <RadioButton.Item label="Very Easy" value="Very Easy" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel} />
            <RadioButton.Item label="Easy" value="Easy" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel} />
            <RadioButton.Item label="Neutral" value="Neutral" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel} />
            <RadioButton.Item label="Difficult" value="Difficult" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel} />
            <RadioButton.Item label="Very Difficult" value="Very Difficult" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel} />
          </RadioButton.Group>

          <Text style={styles.questionText}>2. How helpful do you find the drink water reminders?</Text>
          <RadioButton.Group
            onValueChange={(value) => handleInputChange('reminderHelpfulness', value)}
            value={formData.reminderHelpfulness}
          >
            <RadioButton.Item label="Very Helpful" value="Very Helpful" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel} />
            <RadioButton.Item label="Helpful" value="Helpful" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel} />
            <RadioButton.Item label="Neutral" value="Neutral" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel} />
            <RadioButton.Item label="Unhelpful" value="Unhelpful" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel} />
            <RadioButton.Item label="Very Unhelpful" value="Very Unhelpful" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel} />
          </RadioButton.Group>

          <Text style={styles.questionText}>3. How well does the Bluetooth connectivity work?</Text>
        <RadioButton.Group
          onValueChange={(value) => handleInputChange('bluetoothPerformance', value)}
          value={formData.bluetoothPerformance}
        >
          <RadioButton.Item label="Excellent" value="Excellent" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Good" value="Good" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel} />
          <RadioButton.Item label="Average" value="Average" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Poor" value="Poor" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Very Poor" value="Very Poor" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
        </RadioButton.Group>

        <Text style={styles.questionText}>4. How accurate do you find the water level sensing feature?</Text>
        <RadioButton.Group
          onValueChange={(value) => handleInputChange('waterLevelAccuracy', value)}
          value={formData.waterLevelAccuracy}
        >
          <RadioButton.Item label="Very Accurate" value="Very Accurate" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Accurate" value="Accurate" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Neutral" value="Neutral" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Inaccurate" value="Inaccurate" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Very Inaccurate" value="Very Inaccurate" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
        </RadioButton.Group>

        <Text style={styles.questionText}>5. How useful is the hydration analysis feature for you?</Text>
        <RadioButton.Group
          onValueChange={(value) => handleInputChange('hydrationUsefulness', value)}
          value={formData.hydrationUsefulness}
        >
          <RadioButton.Item label="Very Useful" value="Very Useful" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Useful" value="Useful" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Neutral" value="Neutral" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Not Very Useful" value="Not Very Useful" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Not Useful at All" value="Not Useful at All" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
        </RadioButton.Group>

        <Text style={styles.questionText}>6. How well do the hydration recommendations fit your needs?</Text>
        <RadioButton.Group
          onValueChange={(value) => handleInputChange('recommendationFit', value)}
          value={formData.recommendationFit}
        >
          <RadioButton.Item label="Perfectly" value="Perfectly" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Well" value="Well" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Neutral" value="Neutral" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Poorly" value="Poorly" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Not at All" value="Not at All" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
        </RadioButton.Group>

        <Text style={styles.questionText}>7. Did you encounter any bugs or crashes while using the app?</Text>
        <TextInput
          mode="outlined"
          multiline
          numberOfLines={4}
          placeholder="Describe any bugs or crashes..."
          value={formData.encountegreyBugs}
          onChangeText={(value) => handleInputChange('encountegreyBugs', value)}
          style={styles.textInput}
        />

        <Text style={styles.questionText}>8. How would you rate your overall experience with the app?</Text>
        <RadioButton.Group
          onValueChange={(value) => handleInputChange('overallExperience', value)}
          value={formData.overallExperience}
        >
          <RadioButton.Item label="Excellent" value="Excellent" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Good" value="Good" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Average" value="Average" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Poor" value="Poor" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
          <RadioButton.Item label="Very Poor" value="Very Poor" uncheckedColor="grey" color="yellow" labelStyle={styles.radioLabel}/>
        </RadioButton.Group>

        <Text style={styles.questionText}>9. Any Additional Suggestions for this app?</Text>
        <TextInput
          mode="outlined"
          multiline
          numberOfLines={4}
          placeholder="Share your suggestions..."
          value={formData.additionalSuggestions}
          onChangeText={(value) => handleInputChange('additionalSuggestions', value)}
          style={styles.textInput}
        />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    padding: width * 0.04,
  },
  backButton: {
    position: 'absolute',
    left: width * 0.04,
    top: height * 0.02,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: height * 0.05,
    color: '#fff', // Title color
  },
  scrollViewContent: {
    paddingBottom: height * 0.05,
  },
  questionText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#fff', // White question text
    marginVertical: height * 0.015,
  },
  radioLabel: {
    color: '#fff', // White radio button labels
  },
  textInput: {
    marginBottom: height * 0.02,
    backgroundColor: '#cacfce',
  },
  submitButton: {
    backgroundColor: 'green',
    paddingVertical: height * 0.015,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default FeedbackScreen;
