//=============before session==========
/*
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/ParamList';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LaunchScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const logoPath = require('../Assets/logo2.png');

  return (
    <LinearGradient colors={['#FF6F00', '#FFAB00']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={logoPath}
          style={styles.logo}
          onError={(error) => console.error('Image loading error:', error.nativeEvent.error)}
        />
        <Text style={styles.title}>
          <Text style={styles.yum}>YUM</Text>
          <Text style={styles.quick}>QUICK</Text>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log('Navigating to SignUpScreen');
            navigation.navigate('SignUpScreen');
          }}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.signInButton]} // Add specific style for Sign In button
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  logo: {
    width: '70%',
    height: 180,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 10,
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  yum: {
    color: '#FFEB3B',
  },
  quick: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: 120,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    padding: 15,

    backgroundColor: '#FF6F00', // Background color for buttons
    borderRadius: 50,
    width: '50%',
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: '#F5CB58',
    
  },
  buttonText: {
    color: '#FFFFFF', // Text color for buttons
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LaunchScreen;
*/


import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/ParamList';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LaunchScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const logoPath = require('../Assets/logo2.png');
  const handleSignUp = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const username = await AsyncStorage.getItem('username');
      const profilePicture = await AsyncStorage.getItem('profilePicture');
      const userId = await AsyncStorage.getItem('userId');
      const email = await AsyncStorage.getItem('email');
      navigation.navigate('MenuScreen', {
        username: username || '',
        profilePhoto: profilePicture || '',
        email: email || '',
        uid: userId || '', // Directly pass userId from response
      }); // Redirect to MenuPage if token exists
    } else {
      navigation.navigate('SignUpScreen'); // Redirect to LoginPage if no token
    }
  };
  const handleLogIn = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const username = await AsyncStorage.getItem('username');
      const profilePicture = await AsyncStorage.getItem('profilePicture');
      const userId = await AsyncStorage.getItem('userId');
      const email = await AsyncStorage.getItem('email');
      navigation.navigate('MenuScreen', {
        username: username || '',
        profilePhoto: profilePicture || '',
        email: email || '',
        uid: userId || '', // Directly pass userId from response
      });// Redirect to MenuPage if token exists
    } else {
      navigation.navigate('LoginScreen'); // Redirect to LoginPage if no token
    }
  };

  return (
    <LinearGradient colors={['#FF6F00', '#FFAB00']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={logoPath}
          style={styles.logo}
          onError={(error) => console.error('Image loading error:', error.nativeEvent.error)}
        />
        <Text style={styles.title}>
          <Text style={styles.yum}>YUM</Text>
          <Text style={styles.quick}>QUICK</Text>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
          //onPress={() => {navigation.navigate('SignUpScreen');}}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.signInButton]} // Add specific style for Sign In button
          onPress={handleLogIn}
          //onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  logo: {
    width: '70%',
    height: 180,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 10,
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  yum: {
    color: '#FFEB3B',
  },
  quick: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: 120,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    padding: 15,

    backgroundColor: '#FF6F00', // Background color for buttons
    borderRadius: 50,
    width: '50%',
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: '#F5CB58',
    
  },
  buttonText: {
    color: '#FFFFFF', // Text color for buttons
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LaunchScreen;
