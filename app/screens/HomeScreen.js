import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ProgressViewIOS, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';  // Import axios if you are using it

const HomeScreen = () => {
  const navigation = useNavigation();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentWaterConsumption = 1750;
  const targetWaterConsumption = 3600;
  const waterPurity = 'Good';
  const waterLevelPercentage = 48;
  const batteryLevel = 58;

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=ad0708fea04d40c9b1c161449240109&q=London&aqi=no`);
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const renderProgressBar = () => {
    const progressValue = currentWaterConsumption / targetWaterConsumption;
    return (
      <View style={{ width: '100%' }}>
        <ProgressBar
          progress={progressValue} 
          color="#3b82f6"
          style={[styles.progressBar, { height: 12, borderRadius: 6 }]}
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
            <Text style={styles.bannerText}>500ml</Text>
          </View>
          <View style={styles.purityLevel}>
            <Text style={styles.bannerText}>Purity</Text>
            <Text style={styles.bannerText}>{waterPurity}</Text>
          </View>
          <View style={styles.waterLevel}>
            <Text style={styles.bannerText}>Level</Text>
            <Text style={styles.bannerText}>{waterLevelPercentage}%</Text>
          </View>
        </View>
        <View style={styles.weatherContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <Text style={styles.temperatureText}>{weatherData.current.temp_c}°C</Text>
              <Text>{weatherData.current.condition.text}</Text>
            </>
          )}
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
    marginTop: 10,
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
    marginVertical: 8,
  },
  animatedWater: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4aa3d4',
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
    top: 220
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
    backgroundColor: '#32855b',
    borderRadius: 8,
    bottom: 25
  },
  bannerText: {
    color: '#fff',
    fontSize: 18,
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
    color: '#fff'
  },
  waterLevel: {
    alignItems: 'center',
  },
  weatherContainer: {
    padding: 40,
    borderRadius: 8,
    alignItems: 'center',
    bottom: 100,
    backgroundColor: '#e0e0e0',
  },
  temperatureText: {
    fontSize: 36,
    fontWeight: 'bold',
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
