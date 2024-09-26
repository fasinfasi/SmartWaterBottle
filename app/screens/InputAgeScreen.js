import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollPicker from 'react-native-wheel-scrollview-picker';

const AgeInputScreen = () => {
  const navigation = useNavigation();

  // State for day, month, and year
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(0); // Index of the month (0 = Jan)
  const [selectedYear, setSelectedYear] = useState(2000);

  // Data arrays for days, months (as text), and years
  const dayOptions = Array.from({ length: 31 }, (_, index) => index + 1);
  const monthOptions = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const yearOptions = Array.from({ length: 120 }, (_, index) => new Date().getFullYear() - index);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.arrow} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>When were you born?</Text>
      </View>

      {/* Date of Birth Picker: Day, Month (as text), Year */}
      <View style={styles.scrollPickerContainer}>
        <View style={styles.pickerColumn}>
          <ScrollPicker
            dataSource={dayOptions}
            selectedIndex={selectedDay - 1}
            renderItem={(data, index) => (
              <Text style={styles.pickerItem}>{data}</Text>
            )}
            onValueChange={(data, index) => setSelectedDay(index + 1)}
            wrapperHeight={225} // Increased height for better visibility
            wrapperBackground="#FFFFFF"
            itemHeight={45}  // Increased item height to fully show the items
            highlightColor="#000"
            highlightBorderWidth={2}
          />
        </View>

        <View style={styles.pickerColumn}>
          <ScrollPicker
            dataSource={monthOptions}
            selectedIndex={selectedMonth}
            renderItem={(data, index) => (
              <Text style={styles.pickerItem}>{data}</Text>
            )}
            onValueChange={(data, index) => setSelectedMonth(index)}
            wrapperHeight={225}  // Increased height for better visibility
            wrapperBackground="#FFFFFF"
            itemHeight={45}  // Increased item height to fully show the items
            highlightColor="#000"
            highlightBorderWidth={2}
          />
        </View>

        <View style={styles.pickerColumn}>
          <ScrollPicker
            dataSource={yearOptions}
            selectedIndex={yearOptions.indexOf(selectedYear)}
            renderItem={(data, index) => (
              <Text style={styles.pickerItem}>{data}</Text>
            )}
            onValueChange={(data, index) => setSelectedYear(data)}
            wrapperHeight={225}  // Increased height for better visibility
            wrapperBackground="#FFFFFF"
            itemHeight={45}  // Increased item height to fully show the items
            highlightColor="#000"
            highlightBorderWidth={2}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log('Date of Birth: ', `${selectedDay}/${monthOptions[selectedMonth]}/${selectedYear}`);
          // Navigate to the next screen with the selected date of birth
          navigation.navigate('WeightInputScreen', {
            day: selectedDay,
            month: monthOptions[selectedMonth],
            year: selectedYear,
          });
        }}
      >
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
    backgroundColor: '#fff',
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
    fontSize: 30,
    color: '#0000ff',
  },
  scrollPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    top: '40%',
    height: 220,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerItem: {
    textAlign: 'center',
    fontSize: 20,
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

export default AgeInputScreen;
