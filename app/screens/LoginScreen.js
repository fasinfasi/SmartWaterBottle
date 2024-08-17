import React, { useState } from 'react';
import CheckBox from '@react-native-community/checkbox';
import {  SafeAreaView, View, Image, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Icons for Google, Facebook, Apple

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>AquaSync</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Login</Text>

                <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                />

                <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                    <Ionicons
                    name={isPasswordVisible ? 'eye-off' : 'eye'}
                    size={20}
                    color="#999"
                    />
                </TouchableOpacity>
                </View>

                <TouchableOpacity 
                style={styles.checkboxContainer} 
                onPress={() => setRememberMe(!rememberMe)}
                >
                <View style={styles.checkbox}>
                    <Ionicons
                    name={rememberMe ? 'checkmark-outline' : null}
                    size={20}
                    color={rememberMe ? '#0080FF' : '#999'}
                    />
                </View>
                <Text style={styles.label}>Forget Password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('HomeScreen')} >
                <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                <View style={styles.orContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>or Login with</Text>
                <View style={styles.line} />
                </View>

                <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color="#3b9999" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={24} color="#3b5998" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-apple" size={24} color="black" />
                </TouchableOpacity>
                </View>

                <View style={styles.signupContainer}>
                <Text>Not registered yet?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signupText}> Create Account</Text>
                </TouchableOpacity>
                </View>
            </View>
            </View>
        </TouchableWithoutFeedback>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  headerContainer: {
    backgroundColor: '#0080FF',
    height: 200,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    marginTop: -50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  input: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    marginTop: 17
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  loginButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  line: {
    height: 1,
    width: 40,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#555',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  socialButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#0080FF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
