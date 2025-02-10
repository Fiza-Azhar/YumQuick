//================before Integration with wallet====================
/*
import React, { useState, useEffect } from 'react';
import {View,StyleSheet,Text,TextInput,TouchableOpacity,Alert,PermissionsAndroid,Platform,Image,Modal,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/ParamList';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import config from '../config';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MenuScreen'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [imageUri, setImageUri] = useState<string>('');
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  //const [userId, setUserId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [image, setImage] = useState<Asset | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to upload images',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (showOtpDialog && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowOtpDialog(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showOtpDialog, timeLeft]);

  const handleImagePick = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'You need to grant storage permissions to pick an image.');
      return;
    }

    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];

        if (selectedImage) {
          setImage(selectedImage);
          setProfilePicture(selectedImage.uri || '');
          console.log("image signup:", selectedImage.uri)
          setImageUri(selectedImage.uri || '');
        } else {
          Alert.alert('No image selected');
        }
      }
    });
  };

  const uploadImage = async () => {
    if (!image) throw new Error('No image selected');

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || 'image.jpg',
      } as any);

      const response = await fetch(config.upload, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Image upload failed');
      const data = await response.json();
      return `${config.recipes}${data.filePath}`; 
      
      // Construct the full URL path
    } catch (error) {
      console.error('Image upload failed:', error);
      Alert.alert('Error', 'Failed to upload image');
      throw error;
    }
  };

  const handleSignUp = async () => {
    try {
      setShowOtpDialog(true);
      setTimeLeft(60);
      let uploadedImageUrl = '';
      if (image) {
        uploadedImageUrl = await uploadImage();
      }

      const response = await axios.post(
        config.auth.signUp,
        {
          username,
          email,
          password,
          profilePhoto: uploadedImageUrl,
        },
      );
      if (response.data.success) {
        setUserId(response.data.userId);
        // Update profilePicture with the uploaded URL
        setProfilePicture(uploadedImageUrl);
        console.log("image:", uploadedImageUrl)
      } else {
        Alert.alert('Sign Up Error', response.data.message);
      }
    } catch (error) {
      console.error('Signup error', error);
      Alert.alert('Sign Up Error', 'An error occurred during sign-up');
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post(
        config.auth.verify,
        {
          userId,
          otp,
        },
      );

      if (response.data.success) {
        // Use the profilePicture URL stored earlier
        navigation.navigate('MenuScreen', {
          username,
          profilePhoto: profilePicture,
          email,
          uid: userId || '',  
        });
        setShowOtpDialog(false);
      } else {
        Alert.alert('OTP Failed', response.data.message);
      }
    } catch (error) {
      console.error('OTP verification error', error);
      Alert.alert('OTP Verification Error', 'An error occurred during OTP verification');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Account</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#fff"
          value={username}
          onChangeText={setName}
        />
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

<TouchableOpacity
        onPress={handleImagePick}
        style={styles.profilePictureContainer}>
        {profilePicture ? (
          <Image source={{uri: profilePicture}} style={styles.profilePicture} />
        ) : (
          <Image
            source={require('../Assets/pfp.png')}
            style={styles.profilePicture}
          />
        )}
        <Text style={styles.cameraIcon}>📷</Text>
      </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.loginText}>Already have an account? <Text style={styles.loginBold}>Log in</Text></Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showOtpDialog} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="OTP"
              placeholderTextColor="#fff"
              value={otp}
              onChangeText={setOtp}
            />
            <Text style={styles.timerText}>
              {timeLeft > 0 ? `${timeLeft} seconds left` : 'OTP expired'}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleOtpSubmit}
              disabled={timeLeft <= 0}
            >
              <Text style={styles.buttonText}>Submit OTP</Text>
              
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E46721',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  title: {
    marginTop: 50,
    color: '#FFBB00',
    fontSize: 22,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
  imagePicker: {
    width: '100%',
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePickerText: {
    color: '#fff',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#575151',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  resendButton: {
    backgroundColor: '#FFBB00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#E46721',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    color: '#FFBB00',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  profilePictureContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    borderRadius: 12,
    padding: 2,
    fontSize: 16, // Smaller size for the camera icon
    color: 'grey',
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 50, // Circular shape
    borderWidth: 1,
    borderColor: '#ddd',
  },
  defaultAvatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50, // Circular shape
    backgroundColor: '#e0f2f1', // Light green background for placeholder
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  defaultAvatarText: {
    color: '#004d40',
    fontSize: 16,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  loginBold: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFBB00'
  },
});

export default SignUpScreen;
*/





import React, { useState, useEffect } from 'react';
import {View,StyleSheet,Text,TextInput,TouchableOpacity,Alert,PermissionsAndroid,Platform,Image,Modal,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/ParamList';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';


type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MenuScreen'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [imageUri, setImageUri] = useState<string>('');
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  //const [userId, setUserId] = useState<string | null>(null); 
  const [otp2, setOtp2] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [image, setImage] = useState<Asset | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to upload images',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (showOtpDialog && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowOtpDialog(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showOtpDialog, timeLeft]);

  const handleImagePick = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'You need to grant storage permissions to pick an image.');
      return;
    }

    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];

        if (selectedImage) {
          setImage(selectedImage);
          setProfilePicture(selectedImage.uri || '');
          console.log("image signup:", selectedImage.uri)
          setImageUri(selectedImage.uri || '');
        } else {
          Alert.alert('No image selected');
        }
      }
    });
  };

  const uploadImage = async () => {
    if (!image) throw new Error('No image selected');

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || 'image.jpg',
      } as any);

      const response = await fetch(config.upload, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Image upload failed');
      const data = await response.json();
      return `${config.recipes}${data.filePath}`; 
      //return data.filePath;
      
      // Construct the full URL path
    } catch (error) {
      console.error('Image upload failed:', error);
      Alert.alert('Error', 'Failed to upload image');
      throw error;
    }
  };

  const handleSignUp = async () => {
    try {
      // Show OTP dialog and start timer
      setShowOtpDialog(true);
      setTimeLeft(60);
      let uploadedImageUrl = '';
  
      // Upload the image if available
      if (image) {
        uploadedImageUrl = await uploadImage();
      }
  
      // Prepare the user data for the first API
      const userData = {
        username,
        email,
        password,
        profilePhoto: uploadedImageUrl,
      };
  
      // First API call to sign up the user
      const response = await axios.post(config.auth.signUp, userData);
  
      if (response.data.success) {
        const userId = response.data.userId;
        setUserId(userId);
        setProfilePicture(uploadedImageUrl);
        console.log("Profile picture URL:", uploadedImageUrl);
  
        // Prepare data for the second API call
        const walletData = {
          username,
          email,
          password,
        };
  
        // Second API call to send data to the wallet service
        const response2 = await fetch(`${config.wallet}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(walletData),
        });
  
        if (response2.ok) {
          console.log("OTP sent successfully");
        } else {
          console.error("Failed to send OTP");
          Alert.alert('OTP Error', 'Failed to send OTP');
        }
      } else {
        Alert.alert('Sign Up Error', response.data.message);
      }
    } catch (error) {
      console.error('Signup error', error);
      Alert.alert('Sign Up Error', 'An error occurred during sign-up');
    }
  };
  

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post(
        config.auth.verify,
        {
          userId,
          otp,
        },
      );

      const response2 = await  fetch(`${config.wallet}/api/auth/verify-email`, { // Corrected endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp2 }),
      });

      if(response2.ok){
        console.log("OTP SUCCESSS")
      }

      if (response.data.success) {
        // Store user information in AsyncStorage
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('profilePicture', profilePicture || '');
      await AsyncStorage.setItem('userId', userId || '');
        // Use the profilePicture URL stored earlier
        navigation.navigate('MenuScreen', {
          username,
          profilePhoto: profilePicture,
          email,
          uid: userId || '',  
        });
        setShowOtpDialog(false);
      } else {
        Alert.alert('OTP Failed', response.data.message);
      }
    } catch (error) {
      console.error('OTP verification error', error);
      Alert.alert('OTP Verification Error', 'An error occurred during OTP verification');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Account</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#fff"
          value={username}
          onChangeText={setName}
        />
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

<TouchableOpacity
        onPress={handleImagePick}
        style={styles.profilePictureContainer}>
        {profilePicture ? (
          <Image source={{uri: profilePicture}} style={styles.profilePicture} />
        ) : (
          <Image
            source={require('../Assets/pfp.png')}
            style={styles.profilePicture}
          />
        )}
        <Text style={styles.cameraIcon}>📷</Text>
      </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.loginText}>Already have an account? <Text style={styles.loginBold}>Log in</Text></Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showOtpDialog} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="OTP"
              placeholderTextColor="#fff"
              value={otp}
              onChangeText={setOtp}
            />
           <Text style={styles.modalTitle}>Enter OTP 2: </Text>
          <TextInput
            style={styles.input}
            placeholder="OTP"
            keyboardType="default"
             placeholderTextColor="#fff"
            returnKeyType="done"
            value={otp2}
            onChangeText={setOtp2}
          />
            <Text style={styles.timerText}>
              {timeLeft > 0 ? `${timeLeft} seconds left` : 'OTP expired'}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleOtpSubmit}
              disabled={timeLeft <= 0}
            >
              <Text style={styles.buttonText}>Submit OTP</Text>
              
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E46721',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  title: {
    marginTop: 50,
    color: '#FFBB00',
    fontSize: 22,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
  imagePicker: {
    width: '100%',
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePickerText: {
    color: '#fff',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#575151',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  resendButton: {
    backgroundColor: '#FFBB00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#E46721',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    color: '#FFBB00',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  profilePictureContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    borderRadius: 12,
    padding: 2,
    fontSize: 16, // Smaller size for the camera icon
    color: 'grey',
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 50, // Circular shape
    borderWidth: 1,
    borderColor: '#ddd',
  },
  defaultAvatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50, // Circular shape
    backgroundColor: '#e0f2f1', // Light green background for placeholder
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  defaultAvatarText: {
    color: '#004d40',
    fontSize: 16,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  loginBold: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFBB00'
  },
});

export default SignUpScreen;
