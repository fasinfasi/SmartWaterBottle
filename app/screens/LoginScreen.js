import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Image, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Configure Google authentication
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '1031087968757-no3ghddurivnndts762qfpn3j0fj3h1o.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@fasin/SmartWaterBottle', 
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      console.log('Google ID Token:', id_token);
      handleGoogleSignIn(id_token);
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken) => {
    try {
      // Send the ID token to your backend or handle it locally
      console.log('Successfully signed in with Google!');
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient colors={['#238cad', '#134757']} style={styles.container}>
          <Text style={styles.title}>AquaSync</Text>

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
              <Text style={styles.label}>Forget Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('HomeScreen')}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>or Login with</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
              <Image source={require('../assets/google_logo.png')} style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text>Not registered yet?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
                <Text style={styles.signupText}> Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
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
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
  },
  formContainer: {
    backgroundColor: '#e8e7e6',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
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
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
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
  googleButton: {
    backgroundColor: '#f7f7f7',
    flexDirection: 'row',
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  googleIcon: {
    width: 30,
    height: 38,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#5e5f61',
    fontSize: 16,
    fontWeight: 'bold',
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
