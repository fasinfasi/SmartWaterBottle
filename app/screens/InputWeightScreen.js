import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollPicker from "react-native-wheel-scrollview-picker";

const WeightInputScreen = () => {
  const navigation = useNavigation();
  const [selectedWeight, setSelectedWeight] = useState(60); // Initial weight set to 60

  const weightOptions = Array.from({ length: 240 }, (_, index) => index + 1);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.arrow} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>What's your weight?</Text>
      </View>
      <View style={styles.scrollPickerContainer}>
        <ScrollPicker
            dataSource={weightOptions}
            selectedIndex={selectedWeight - 1} // Adjust index to match array
            renderItem={(data, index) => (
            <Text style={styles.pickerItem}>{data}</Text>
            )}
            onValueChange={(data, index) => setSelectedWeight(index + 1)}
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
  },
  arrow: {
    position: 'absolute',
    left: '8%',
    top: '8%',
  },
  titleContainer: {
    position: 'absolute',
    top: '20%', // Adjust this percentweight as needed to move the title up or down
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
  weightOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  selectedweightOption: {
    backgroundColor: '#f0f0f0',
  },
  weightOptionText: {
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

export default WeightInputScreen;
