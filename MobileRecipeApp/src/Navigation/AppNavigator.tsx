//src.Navigation/AppNavigator
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LaunchScreen from '../Screens/LaunchScreen';
import SignUpScreen from '../Screens/SignUpScreen';
import LoginScreen from '../Screens/LoginScreen';
import MenuScreen from '../Screens/MenuScreen';
import AddRecipeScreen from '../Screens/AddRecipeScreen';
import MyRecipesScreen from '../Screens/MyRecipesScreen';
import { RootStackParamList } from './ParamList';
import FavRecipesScreen from '../Screens/FavRecipesScreen';
import CookScreen from '../Screens/CookScreen';
import GroceryRecipesScreen from '../Screens/GroceryRecipesScreen';
import GroceryListScreen from '../Screens/GroceryListScreen';
import CategoryScreen from '../Screens/CategoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LaunchScreen">
        <Stack.Screen name="LaunchScreen" component={LaunchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MenuScreen" component={MenuScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddRecipeScreen" component={AddRecipeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyRecipesScreen" component={MyRecipesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FavRecipesScreen" component={FavRecipesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GroceryListScreen" component={GroceryListScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="CookScreen" component={CookScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} options={{ headerShown: false }} />
       
        
        <Stack.Screen name="GroceryRecipesScreen" component={GroceryRecipesScreen} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
