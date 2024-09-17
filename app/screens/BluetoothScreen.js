import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withDelay, interpolate } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const Ring = ({ delay }) => {
  const ring = useSharedValue(0);

  const ringStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.8 - ring.value,
      transform: [
        {
          scale: interpolate(ring.value, [0, 1], [0, 5]),
        },
      ],
    };
  });

  useEffect(() => {
    ring.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 4000,
        }),
        -1,
        false
      )
    );
  }, []);

  return <Animated.View style={[styles.ring, ringStyle]} />;
};

const BluetoothScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      {/* <Text style={styles.mainTitle}>Bluetooth</Text> */}
      <Text style={styles.title}>Bluetooth searching...</Text>
      <Text style={styles.subTitle}>Keep bottle close to your device</Text>
      <View style={styles.imageContainer}>
        {/* Multiple Rings for the animation */}
        <Ring delay={0} />
        <Ring delay={1000} />
        <Ring delay={2000} />
        <Ring delay={3000} />
        <Image
          source={require('../assets/BottleIconBluetooth.png')}
          style={styles.bottleImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 28, 
    left: 12,
    padding: 10,
  },
  backArrow: {
    fontSize: 30,
    color: '#000', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 45,
  },
  subTitle: {
    fontSize: 18,
    marginTop: 5,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.8,
    height: width * 0.8,
    marginTop: 85,
    transform: [{ rotate: '20deg' }],
  },
  bottleImage: {
    width: width * 0.6,
    height: width * 0.6,
  },
  ring: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: '#05239c', 
    borderWidth: 10,
  },
});

export default BluetoothScreen;