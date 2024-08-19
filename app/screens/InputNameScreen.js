import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, StatusBar, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const NameInputScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [sex, setSex] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef(null);

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    setPickerOpen(false);
  };

  const handleContinuePress = () => {
    if (name === '' || sex === '') {
      Alert.alert('Validation Error', 'Please fill in all fields.');
    } else {
      navigation.navigate('AgeInputScreen');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.titleContainer}>
            <Text style={styles.title}>Who are you?</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#ccc"
          onChangeText={setName}
          value={name}
        />
        <RNPickerSelect
          ref={pickerRef}
          onValueChange={(value) => setSex(value)}
          items={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' }
          ]}
          style={pickerSelectStyles}
          placeholder={{
            label: 'Sex',
            value: null,
            color: '#000',
          }}
          onOpen={() => setPickerOpen(true)}
          onClose={() => setPickerOpen(false)}
          useNativeAndroidPickerStyle={false}
        />
        <TouchableOpacity style={styles.button} onPress={handleContinuePress}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  titleContainer: {
    position: 'absolute',
    top: '20%',
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.08,
    color: '#0000ff',
  },
  input: {
    width: width * 0.8,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 20,
    fontSize: 18,
    color: '#000',
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: width * 0.8,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    color: '#000',
    justifyContent: 'center',
  },
  inputAndroid: {
    width: width * 0.8,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    color: '#000',
    justifyContent: 'center',
  },
});

export default NameInputScreen;
