import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#2DAFD8', '#185D72']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>My Profile</Text>
        </View>
      </View>
      <View style={styles.profileInfo}>
        <View style={styles.profileItem}>
          <Text style={styles.label}>Name :</Text>
          <Text style={styles.value}>Alex</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.label}>Age :</Text>
          <Text style={styles.value}>31</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.label}>Weight :</Text>
          <Text style={styles.value}>40</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.label}>Activity :</Text>
          <Text style={styles.value}>Moderate</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.label}>Health Condition :</Text>
          <Text style={styles.value}>Diabetes</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen')} style={styles.edit}>
      <FontAwesome name="edit" size={26} color="#000" />
      </TouchableOpacity>
      </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#3366FF', // Solid background color
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    position: 'absolute',
    top: '10%', // Adjust this percentage as needed to move the title up or down
    width: '100%',
    alignItems: 'center',
    paddingVertical: '20%'
  },
  title: {
    fontSize: width * 0.08, // 8% of screen width
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 7,  // Adjust this value as needed to control vertical position
    left: 0, // This places the back button in the top left corner
    padding: 10,
  },
  edit: {
    position: 'absolute',
    top: '22%', // Adjust this value to position the icon below the title
    right: '10%', // Adjust the distance from the right edge
  },
  profileInfo: {
    flex: 1,
    paddingHorizontal: '10%',
    paddingVertical: '50%'
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '30%',
    textAlignVertical:'center',


  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,

  },
  value: {
    color: '#fff',
    fontSize: 16,

  },
});

export default ProfileScreen;