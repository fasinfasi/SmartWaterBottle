import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ProgressBarAndroid, ProgressViewIOS, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const currentWaterConsumption = 1750;
  const targetWaterConsumption = 3600;
  const waterPurity = 'Good';
  const waterLevelPercentage = 48;
  const currentWeather = 'Rain';
  const currentTemperature = 18;
  const batteryLevel = 58;

  const renderProgressBar = () => {
    if (Platform.OS === 'android') {
      return (
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={currentWaterConsumption / targetWaterConsumption}
          color="#3b82f6"
          style={{ width: '100%', height: 10 }}
        />
      );
    } else {
      return (
        <ProgressViewIOS
          progress={currentWaterConsumption / targetWaterConsumption}
          trackTintColor="#d3d3d3"
          progressTintColor="#3b82f6"
          style={{ width: '100%', height: 10 }}
        />
      );
    }
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
      <View style={styles.bottomTabContainer}>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={30} color="black" />
          <View style={styles.activeTabIndicator} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Bar')}>
          <FontAwesome5 name="chart-bar" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Profile')}>
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
    // marginTop: Platform.OS === 'android' ? 0 : 0,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    left: 10
  },
  batteryText: {
    marginLeft: 4,
    fontSize: 16,
  },
  waterContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
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
    alignItems: 'center',
    marginVertical: 10,
  },
  targetWaterText: {
    fontSize: 14,
    marginBottom: 4,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  dailyGoalText: {
    fontSize: 14,
    marginTop: 4,
  },
  bannerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  bottleInfo: {
    alignItems: 'center',
  },
  bottleIcon: {
    width: 40,
    height: 40,
  },
  purityLevel: {
    alignItems: 'center',
  },
  waterLevel: {
    alignItems: 'center',
  },
  weatherContainer: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    
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
});

export default HomeScreen;
