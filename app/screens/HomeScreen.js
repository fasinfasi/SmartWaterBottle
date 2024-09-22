import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';


const HomeScreen = () => {
  const navigation = useNavigation();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const waterAnimation = useRef(new Animated.Value(0)).current;

  const currentWaterConsumption = 2450;
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

  useEffect(() => {
    Animated.timing(waterAnimation, {
      toValue: currentWaterConsumption,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [currentWaterConsumption]);

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

  const waterHeight = waterAnimation.interpolate({
    inputRange: [0, targetWaterConsumption],
    outputRange: ['0%', '100%'],
  });

  const getWeatherTheme = (condition) => {
    switch (condition) {
      case 'Sunny':
      case 'Clear':
        return { icon: <FontAwesome5 name="sun" size={50} color="#c97214" solid />, style: styles.sunnyWeather };
      case 'Cloudy':
      case 'Partly cloudy':
      case 'Overcast':
        return { icon: <FontAwesome5 name="cloud" size={50} color="gray" />, style: styles.cloudyWeather };
      case 'Light rain':
      case 'Moderate rain':
      case 'Heavy rain':
      case 'Patchy rain possible':
        return { icon: <FontAwesome5 name="cloud-showers-heavy" size={50} color="blue" />, style: styles.rainyWeather };
      case 'Mist':
      case 'Fog':
        return { icon: <FontAwesome5 name="smog" size={50} color="gray" />, style: styles.mistyWeather };
      case 'Thundery outbreaks possible':
        return { icon: <FontAwesome5 name="cloud-bolt" size={50} color="blue" />, style: styles.thunderWeather };
      default:
        return { icon: <FontAwesome5 name="cloud-sun" size={50} color="white" />, style: styles.defaultWeather };
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.topIconsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('BluetoothScreen')}>
          <Ionicons name="bluetooth" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.batteryContainer}>
          <Ionicons name="battery-half" size={24} color="black" />
          <Text style={styles.batteryText}>{batteryLevel}%</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.waterContainer}>
          <Text style={styles.waterText}>{currentWaterConsumption}ml</Text>
          <Animated.View style={[styles.animatedWater, { height: waterHeight }]} />
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
          <View style={[styles.weatherContainer, weatherData ? getWeatherTheme(weatherData.current.condition.text).style : styles.defaultWeather]}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <Text style={styles.temperatureText}>{weatherData.current.temp_c}°C</Text>
              <Text>{weatherData.current.condition.text}</Text>
              <View style={styles.iconContainer}>
                {getWeatherTheme(weatherData.current.condition.text).icon}
              </View>
            </>
          )}
        </View>
      </View>
      <View style={styles.bottomTabContainer}>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('HomeScreen')}>
          <Ionicons name="home" size={30} color="black" />
          <View style={styles.activeTabIndicator} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('GraphScreen')}>
          <FontAwesome5 name="chart-bar" size={27} color="black" />
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
    borderWidth: 1,
    borderColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    position: 'relative',
  },
  animatedWater: {
    width: '100%',
    backgroundColor: '#4aa3d4',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  waterText: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#082759',
    position: 'absolute',
    zIndex: 1,
    top: '43%',
    transform: [{ translateY: -18 }],
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
    backgroundColor: '#32855b',
    borderRadius: 8,
    bottom: 25,
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
    color: '#fff',
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
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    height: 60,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabIndicator: {
    width: 30,
    height: 4,
    backgroundColor: 'black',
    marginTop: 4,
    borderRadius: 2,
  },
  iconContainer: {
    position: 'absolute',
    top: 10, // Adjust the position as needed
    right: 10, // Adjust the position as needed
    alignItems: 'center',
  },
  // Themes based on weather conditions
  rainyWeather: {
    backgroundColor: '#99afcc', // Light steel blue for rain
  },
  heavyRainWeather: {
    backgroundColor: '#4682b4', // Steel blue for heavy rain
  },
  cloudyWeather: {
    backgroundColor: '#d3d3d3', // Light gray for cloudy conditions
  },
  sunnyWeather: {
    backgroundColor: '#ffe680', // Light yellow for sunny weather
  },
  mistyWeather: {
    backgroundColor: '#f0e68c', // Light khaki for mist/fog
  },
  thunderWeather: {
    backgroundColor: '#111345', // Firebrick red for thunderstorms
  },
  defaultWeather: {
    backgroundColor: '#b9eddc', // Default neutral theme
  },
});

export default HomeScreen;
