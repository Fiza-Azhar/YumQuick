/*import AsyncStorage from '@react-native-async-storage/async-storage';

export const isTokenExpired = async (): Promise<boolean> => {
  const tokenExpiry = await AsyncStorage.getItem('tokenExpiry');
  if (tokenExpiry) {
    return Date.now() > parseInt(tokenExpiry, 10);
  }
  return true; // Token is expired if no expiry time is found
};
*/