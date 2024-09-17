import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollPicker from "react-native-wheel-scrollview-picker";

const WeightInputScreen = () => {
  const navigation = useNavigation();
  const [selectedWeight, setSelectedWeight] = useState(40); // Initial weight set to 31
  
  // Adjusted weightOptions to start from 20 and go up to 240
  const weightOptions = Array.from({ length: 240 - 20 + 1 }, (_, index) => index + 20);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.arrow} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>What's your weight(kg)?</Text>
      </View>
      <View style={styles.scrollPickerContainer}>
        <ScrollPicker
          dataSource={weightOptions}
          selectedIndex={selectedWeight - 20} // Adjust index to match the new range starting at 20
          renderItem={(data, index) => (
            <Text style={styles.pickerItem}>{data}</Text>
          )}
          onValueChange={(data, index) => setSelectedWeight(data)} // Use the actual selected weight
          wrapperHeight={180}
          wrapperBackground="#FFFFFF"
          itemHeight={35}
          highlightColor="#000"
          highlightBorderWidth={2}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => {
        // Handle continue action, e.g., navigation to next screen
        if (selectedWeight) {
          console.log('Weight of the user: ', selectedWeight)
          // Navigate to the next screen with the selected weight
          navigation.navigate('StatusPage', { weight: selectedWeight });
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
    top: '20%', 
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#0000ff',
  },
  scrollPickerContainer: {
    position: 'absolute',
    top: '40%',
    height: 180,
  },
  pickerItem: {
    textAlign: 'center',
    alignItems: 'center',
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

export default WeightInputScreen;
