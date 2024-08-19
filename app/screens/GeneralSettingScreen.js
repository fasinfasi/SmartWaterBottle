import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const GeneralSetting = () => {
  const navigation = useNavigation();
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('start');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [timeFormat, setTimeFormat] = useState('12hr');

  const handleTimePicker = (event, selectedDate) => {
    const currentDate = selectedDate || (currentPicker === 'start' ? startTime : endTime);
    if (currentPicker === 'start') {
      setStartTime(currentDate);
    } else {
      setEndTime(currentDate);
    }
    setIsPickerVisible(false);
  };

  const handleDeleteAll = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete all data permanently?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => { /* Implement delete logic here */ } }
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      "Confirm Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", onPress: () => navigation.navigate('WelcomeScreen') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>General Setting</Text>
        </View>
      </View>

      <View style={styles.spacing} />

      <View style={styles.timeContainer}>
        <Text style={styles.sleepTimeLabel}>Sleep Time:</Text>
        <View style={styles.timeFields}>
          <View style={styles.timeField}>
            <Text>From:</Text>
            <TouchableOpacity onPress={() => { setCurrentPicker('start'); setIsPickerVisible(true); }}>
              <Text style={styles.timeValue}>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: timeFormat === '12hr' })}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timeField}>
            <Text>To:</Text>
            <TouchableOpacity onPress={() => { setCurrentPicker('end'); setIsPickerVisible(true); }}>
              <Text style={styles.timeValue}>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: timeFormat === '12hr' })}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {isPickerVisible && (
        <DateTimePicker
          value={currentPicker === 'start' ? startTime : endTime}
          mode="time"
          is24Hour={timeFormat === '24hr'}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimePicker}
        />
      )}

      <View style={styles.timeFormatContainer}>
        <Text style={styles.timeFormatLabel}>Time Format:</Text>
        <View style={styles.timeFormatButtons}>
          <TouchableOpacity 
            style={[styles.timeFormatButton, timeFormat === '12hr' && styles.selectedButton]} 
            onPress={() => setTimeFormat('12hr')}
          >
            <Text style={styles.buttonText}>12hr</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.timeFormatButton, timeFormat === '24hr' && styles.selectedButton]} 
            onPress={() => setTimeFormat('24hr')}
          >
            <Text style={styles.buttonText}>24hr</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('KnowMoreAboutScreen')}>
        <Text style={styles.buttonText}>Know More About</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAll}>
        <Text style={styles.buttonText}>Delete All Data</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: '0%',
    top: Platform.OS === 'ios' ? '5%' : '8%',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10, // Adjust based on the size of your back button
    marginTop: 60, // Adjust to move the title down
    marginBottom: 50,
  },
  title: {
    fontSize: width * 0.08, 
    color: '#0000ff',
    textAlign: 'center',
  },
  spacing: {
    marginBottom: 20,
  },
  timeContainer: {
    width: '100%',
    marginBottom: height * 0.1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sleepTimeLabel: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  timeFields: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeField: {
    flex: 1,
    alignItems: 'center',
  },
  timeValue: {
    fontWeight: 'bold',
  },
  timeFormatContainer: {
    marginBottom: height * 0.15,
  },
  timeFormatLabel: {
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
  },
  timeFormatButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeFormatButton: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#C133FF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginBottom: 80,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: 'red',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default GeneralSetting;
