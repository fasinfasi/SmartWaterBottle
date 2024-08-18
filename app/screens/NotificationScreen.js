import React, { useState } from 'react';
import {View,Text,Switch,StyleSheet,Platform,SafeAreaView,} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

const NotificationSettings = () => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [timeToDrinkRingtone, setTimeToDrinkRingtone] = useState('Ringtone 1');
  const [drinkRemindRingtone, setDrinkRemindRingtone] = useState('Ringtone 4');
  const [timeToRefillRingtone, setTimeToRefillRingtone] = useState('Ringtone 7');

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  // Define different ringtone options for each notification type
  const timeToDrinkOptions = ['Ringtone 1', 'Ringtone 2', 'Ringtone 3'];
  const drinkRemindOptions = ['Ringtone 4', 'Ringtone 5', 'Ringtone 6'];
  const timeToRefillOptions = ['Ringtone 7', 'Ringtone 8', 'Ringtone 9'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
        />
      </View>
      <View style={styles.settingsHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Notification</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#2eff1d' }}
            thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={styles.switch}
          />
        </View>
      </View>
      {isEnabled && (
        <View style={styles.settingsContainer}>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Time to Drink</Text>
            <Picker
              selectedValue={timeToDrinkRingtone}
              onValueChange={(itemValue) => setTimeToDrinkRingtone(itemValue)}
              style={styles.picker}
            >
              {timeToDrinkOptions.map((ringtone) => (
                <Picker.Item key={ringtone} label={ringtone} value={ringtone} />
              ))}
            </Picker>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Drink Remind</Text>
            <Picker
              selectedValue={drinkRemindRingtone}
              onValueChange={(itemValue) => setDrinkRemindRingtone(itemValue)}
              style={styles.picker}
            >
              {drinkRemindOptions.map((ringtone) => (
                <Picker.Item key={ringtone} label={ringtone} value={ringtone} />
              ))}
            </Picker>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Time to Refill</Text>
            <Picker
              selectedValue={timeToRefillRingtone}
              onValueChange={(itemValue) => setTimeToRefillRingtone(itemValue)}
              style={styles.picker}
            >
              {timeToRefillOptions.map((ringtone) => (
                <Picker.Item key={ringtone} label={ringtone} value={ringtone} />
              ))}
            </Picker>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    left: 0,
    top: 15,
  },
  settingsHeader: {
    marginBottom: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    top: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  switch: {
    marginLeft: 10,
    ...Platform.select({
      ios: {
        marginTop: 10,
      },
      android: {
        marginTop: 0,
      },
    }),
  },
  settingsContainer: {
    marginTop: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
  },
  picker: {
    height: 50,
    width: 150,
  },
});

export default NotificationSettings;