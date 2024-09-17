import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollPicker from "react-native-wheel-scrollview-picker";

const AgeInputScreen = () => {
  const navigation = useNavigation();
  const [selectedAge, setSelectedAge] = useState(18); // Initial age set to 12

  const ageOptions = Array.from({ length: 120 - 7 + 1 }, (_, index) => index + 7);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.arrow} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Who old are you?</Text>
      </View>
      <View style={styles.scrollPickerContainer}>
        <ScrollPicker
            dataSource={ageOptions}
            selectedIndex={selectedAge - 7} // Adjust index to match array
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
      </View>
      <TouchableOpacity style={styles.button} onPress={() => {
        // Handle continue action, e.g., navigation to next screen
        if (selectedAge) {
          console.log('Age of the user: ', selectedAge)
          // Navigate to the next screen with the selected age
          navigation.navigate('WeightInputScreen', { age: selectedAge });
        }
      }}>
        <Text style={styles.buttonText}>Continue</Text>
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
    backgroundColor: '#fff'
  },
  arrow: {
    position: 'absolute',
    left: '8%',
    top: '8%',
  },
  titleContainer: {
    position: 'absolute',
    top: '20%', // Adjust this percentage as needed to move the title up or down
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#0000ff',
  },
  scrollPickerContainer: {
    position: 'absolute',
    top: '40%',
    height: '150'
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
  button: {
    backgroundColor: '#0000ff',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 25,
    position: 'absolute',
    bottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AgeInputScreen;
