//=============before API integration===========================
/*
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/ParamList';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, setTokenWithExpiration } from '../Services/recipeSlice'


const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [profilePhoto,setProfilePhoto] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(config.auth.login, {
        email,
        password,
      });
      console.log('API Response:', response.data);
      if (response.data.success) {
        const { accessToken, expiresIn, username, image, userId } = response.data;
        //const imageUrl = `${config.recipes}${response.data.profilePhoto}`;
        const imageUrl = `${response.data.profilePhoto}`;
        await setTokenWithExpiration(accessToken, expiresIn);

        // Store user details
        await AsyncStorage.setItem('token', accessToken);
       
        setProfilePhoto(imageUrl);
        setName(response.data.username);
        setId(response.data.userId);  // Assuming you want to set the user ID here
        setEmail(response.data.email);
        console.log("Profile Photo URL:", imageUrl);
        console.log("Username:", response.data.username);
        console.log("email:", response.data.email);
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('profilePicture', imageUrl);
        //await AsyncStorage.setItem('userId', userId.toString());
        await AsyncStorage.setItem('email',email);
           // Store user ID in AsyncStorage
      await AsyncStorage.setItem('userId', response.data.userId.toString());
  console.log("login uid", userId);

        // Navigate to the MenuScreen or any other screen after successful login
        navigation.navigate('MenuScreen', {
          username: response.data.username,
          profilePhoto: imageUrl,
          email: response.data,
          uid: response.data.userId,  // Make sure this is correctly set
        });
      } else {
        // Display an error message if login fails
        Alert.alert('Login Failed', response.data.message || 'Please check your credentials and try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to log in. Please try again later.');
    }
  };
  

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        
        </TouchableOpacity>
        <Text style={styles.title}>Welcome Back!</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#fff"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#fff"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={styles.loginText}>
            Don't Have an Account? <Text style={styles.signupBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E46721',
    padding: 16, // Add some padding to ensure components are not cut off
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 50,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#575151',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  signupBold: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFBB00',
  },
});

export default LoginScreen;
*/



import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/ParamList';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, setTokenWithExpiration } from '../Services/recipeSlice'


const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [profilePhoto,setProfilePhoto] = useState('');
  const handleLogIn2 = async () => {
    try {
      const response2 = await fetch(`${config.wallet}/api/auth/login`, { // Corrected endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response2.json();
      if (data.success) {
        Alert.alert("Wallet Login successful");
      } else {
        Alert.alert('Login Failed', data.message || 'Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Wallet Login error:', error);
      Alert.alert('Error', 'An error occurred during wallet login. Please try again.');
    }
  };


  const handleLogin = async () => {
    try {
      const response = await axios.post(config.auth.login, {
        email,
        password,
      });
      console.log('API Response:', response.data);
      if (response.data.success) {
        
        const { accessToken, expiresIn, username, image, userId } = response.data;
        //const imageUrl = `${config.recipes}${response.data.profilePhoto}`;
        const imageUrl = `${response.data.profilePhoto}`;
        await setTokenWithExpiration(accessToken, expiresIn);

        // Store user details
        await AsyncStorage.setItem('token', accessToken);
       
        setProfilePhoto(imageUrl);
        setName(response.data.username);
        setId(response.data.userId);  // Assuming you want to set the user ID here
        setEmail(response.data.email);
        console.log("Profile Photo URL:", imageUrl);
        console.log("Username:", response.data.username);
        console.log("email:", response.data.email);
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('profilePicture', imageUrl);
        //await AsyncStorage.setItem('userId', userId.toString());
        await AsyncStorage.setItem('email',email);
           // Store user ID in AsyncStorage
      await AsyncStorage.setItem('userId', response.data.userId.toString());
  console.log("login uid", userId);
  await handleLogIn2();
        // Navigate to the MenuScreen or any other screen after successful login
        navigation.navigate('MenuScreen', {
          username: response.data.username,
          profilePhoto: imageUrl,
          email: response.data,
          uid: response.data.userId,  // Make sure this is correctly set
        });
      } else {
        // Display an error message if login fails
        Alert.alert('Login Failed', response.data.message || 'Please check your credentials and try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to log in. Please try again later.');
    }
  };
  

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        
        </TouchableOpacity>
        <Text style={styles.title}>Welcome Back!</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#fff"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#fff"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={styles.loginText}>
            Don't Have an Account? <Text style={styles.signupBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E46721',
    padding: 16, // Add some padding to ensure components are not cut off
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 50,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#575151',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  signupBold: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFBB00',
  },
});

export default LoginScreen;
