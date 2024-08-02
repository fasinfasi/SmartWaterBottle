import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';   

import ScrollPicker from "react-native-wheel-scrollview-picker";

const AgeInputScreen = () => {
  const navigation = useNavigation();
  const [selectedAge, setSelectedAge] = useState(1); // Initial age set to 1

  const ageOptions = Array.from({ length: 120 }, (_, index) => index + 1);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        {/* Add your back arrow icon here */}
      </TouchableOpacity>
      <Text style={styles.title}>What's your age?</Text>
      <ScrollPicker
        dataSource={ageOptions}
        selectedIndex={selectedAge - 1} // Adjust index to match array
        renderItem={(data, index) => (
          <Text style={styles.pickerItem}>{data}</Text>
        )}
        onValueChange={(data, index) => setSelectedAge(index + 1)}
        wrapperHeight={180}
        wrapperBackground="#FFFFFF"
        itemHeight={35}
        highlightColor="#000"
        highlightBorderWidth={2}
      />
      <TouchableOpacity style={styles.continueButton} onPress={() => {
        // Handle continue action, e.g., navigation to next screen
        if (selectedAge) {
          // Navigate to the next screen with the selected age
          navigation.navigate('NextScreen', { age: selectedAge });
        }
      }}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  pickerItem: {
    textAlign: 'center',
    alignItems:'center',
  },
  ageOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  selectedAgeOption: {
    backgroundColor: '#f0f0f0',
  },
  ageOptionText: {
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
  },
  continueButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default AgeInputScreen;
