import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { FontAwesome5, Ionicons  } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SettingScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
          <FontAwesome5 name="smile" size={24} color="yellow" />
          <View style={styles.textContainer}>
            <Text style={styles.buttonText}>My Profile</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Notification')}>
          <FontAwesome5 name="bell" size={24} color="orange" />
          <View style={styles.textContainer}>
            <Text style={styles.buttonText}>Notification</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GeneralSetting')}>
          <FontAwesome5 name="cog" size={24} color="black" />
          <View style={styles.textContainer}>
            <Text style={styles.buttonText}>General Setting</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('QuestionScreen')}>
          <FontAwesome5 name="question" size={24} color="purple" />
          <View style={styles.textContainer}>
            <Text style={styles.buttonText}>FAQ</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Feedback')}>
          <FontAwesome5 name="comment" size={24} color="orange" />
          <View style={styles.textContainer}>
            <Text style={styles.buttonText}>Feedback</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomTabContainer}>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('HomeScreen')}>
          <Ionicons name="home-outline" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Bar')}>
          <FontAwesome5 name="chart-bar" size={27} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('SettingScreen')}>
          <FontAwesome5 name="user-alt" size={24} color="black" />
          <View style={styles.activeTabIndicator} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'space-evenly', // Distribute buttons evenly within available space
    paddingBottom: 80, // Adjusted to account for bottom tab bar height
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#007bff', 
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 15, 
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', // Center text inside the container
    flex: 1, 
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

export default SettingScreen;
