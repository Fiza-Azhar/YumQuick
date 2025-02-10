import React, { useEffect } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../Navigation/ParamList'; // Adjust the import path accordingly

const SessionCheck = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
      const checkSession = async () => {
        const expirationTime = await AsyncStorage.getItem('sessionExpirationTime');
        
        if (expirationTime) {
          const now = Date.now();
          if (now > parseInt(expirationTime, 10)) {
            // Session expired
            await AsyncStorage.removeItem('sessionExpirationTime');
            await AsyncStorage.removeItem('userId');
            navigation.navigate('LoginScreen');
          } else {
            // Session still valid
            setIsLoading(false);
          }
        } else {
          // No session expiration time found, redirect to login screen
          navigation.navigate('LoginScreen');
        }
      };

      checkSession();
    }, [navigation]);

    if (isLoading) {
      return <View><ActivityIndicator size="large" color="#0000ff" /></View>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default SessionCheck;
