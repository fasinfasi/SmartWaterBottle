import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { ProgressBar } from 'react-native-paper'; // Import ProgressBar from react-native-paper
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const currentWaterConsumption = 1290;
  const targetWaterConsumption = 3600;
  const waterPurity = 'Good';
  const waterLevelPercentage = 48;
  const currentWeather = 'Rain';
  const currentTemperature = 18;
  const batteryLevel = 58;

  const renderProgressBar = () => {
    const progressValue = currentWaterConsumption / targetWaterConsumption;
    return (
      <View style={{ width: '100%' }}>
        <ProgressBar
          progress={progressValue} // Use 'progress' prop instead of 'value'
          color="#3b82f6"
          style={styles.progressBar}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.topIconsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Bluetooth')}>
          <Ionicons name="bluetooth" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.batteryContainer}>
          <Ionicons name="battery-half" size={24} color="black" />
          <Text style={styles.batteryText}>{batteryLevel}%</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.waterContainer}>
          <View style={styles.animatedWater}>
            <Text style={styles.waterText}>{currentWaterConsumption}ml</Text>
          </View>
        </View>
        <View style={styles.progressBarSection}>
          <Text style={styles.targetWaterText}>{targetWaterConsumption}ml</Text>
          <View style={styles.progressBarContainer}>
            {renderProgressBar()}
            <Text style={styles.dailyGoalText}>Daily goal</Text>
          </View>
        </View>
        <View style={styles.bannerContainer}>
          <View style={styles.bottleInfo}>
            <Image source={require('../assets/simplebottle.png')} style={styles.bottleIcon} />
            <Text>500ml</Text>
          </View>
          <View style={styles.purityLevel}>
            <Text>Purity</Text>
            <Text>{waterPurity}</Text>
          </View>
          <View style={styles.waterLevel}>
            <Text>Level</Text>
            <Text>{waterLevelPercentage}%</Text>
          </View>
        </View>
        <View style={[styles.weatherContainer, currentWeather === 'Rain' ? styles.rainyWeather : styles.sunnyWeather]}>
          <Text style={styles.temperatureText}>{currentTemperature}°</Text>
          <Text>{currentWeather}</Text>
        </View>
      </View>
      <View style={styles.bottomTabContainer}>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('HomeScreen')}>
          <FontAwesome5 name="home" size={30} color="black" />
          <View style={styles.activeTabIndicator} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Bar')}>
          <FontAwesome5 name="chart-bar" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('SettingScreen')}>
          <FontAwesome5 name="user" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },
  topIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  batteryText: {
    marginLeft: 4,
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  waterContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  animatedWater: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterText: {
    fontSize: 36,
    color: '#fff',
  },
  progressBarSection: {
    width: '100%',
    alignItems: 'flex-end',
    marginVertical: 10,
    position: 'absolute', 
    top: 220,
  },
  targetWaterText: {
    fontSize: 14,
    marginBottom: 2,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  dailyGoalText: {
    fontSize: 14,
    marginTop: 2,
  },
  bannerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    bottom: 25,
  },
  bottleInfo: {
    alignItems: 'center',
  },
  bottleIcon: {
    width: 45,
    height: 50,
  },
  purityLevel: {
    alignItems: 'center',
  },
  waterLevel: {
    alignItems: 'center',
  },
  weatherContainer: {
    padding: 40,
    borderRadius: 8,
    alignItems: 'center',
    bottom: 100,
  },
  rainyWeather: {
    backgroundColor: '#9e9e9e',
  },
  sunnyWeather: {
    backgroundColor: '#ffeb3b',
  },
  temperatureText: {
    fontSize: 36,
  },
  bottomTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  tabButton: {
    alignItems: 'center',
  },
  activeTabIndicator: {
    width: 30,
    height: 4,
    backgroundColor: 'black',
    marginTop: 4,
    borderRadius: 2,
  },
  progressBar: {
    height: 10,
  },
});

export default HomeScreen;
