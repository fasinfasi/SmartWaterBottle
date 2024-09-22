import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // State for user details
  const [userDetails, setUserDetails] = useState({
    name: 'Alex',
    sex: 'Male',
    age: '31',
    weight: '40',
    activity: 'Moderate',
    healthCondition: 'Diabetes'
  });

  useEffect(() => {
    // Update user details from route params if they exist
    if (route.params?.userDetails) {
      setUserDetails(route.params.userDetails);
    }
  }, [route.params?.userDetails]);

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

      <View style={styles.contentContainer}>
        {/* Edit button */}
        <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen', { userDetails })} style={styles.edit}>
          <FontAwesome name="edit" size={26} color="#000" />
        </TouchableOpacity>

        {/* Profile information */}
        <View style={styles.profileInfo}>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Name :</Text>
            <Text style={styles.value}>{userDetails.name}</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Sex :</Text>
            <Text style={styles.value}>{userDetails.sex}</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Age :</Text>
            <Text style={styles.value}>{userDetails.age}</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Weight :</Text>
            <Text style={styles.value}>{userDetails.weight}</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Activity :</Text>
            <Text style={styles.value}>{userDetails.activity}</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Health Condition : </Text>
            <Text style={styles.value}>{userDetails.healthCondition}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    position: 'absolute',
    top: '15%',
    width: '100%',
    alignItems: 'center',
    paddingVertical: '25%',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 7,
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingVertical: 80,
  },
  edit: {
    position: 'absolute',
    top: '25%',
    right: '10%',
  },
  profileInfo: {
    width: '100%',
    marginTop: '45%',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 15,
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
