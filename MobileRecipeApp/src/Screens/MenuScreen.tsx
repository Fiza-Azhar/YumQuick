//===================before session expire
/*
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList,Modal, ScrollView, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, useAppDispatch } from '../Store/store';
import { RouteProp, useRoute } from '@react-navigation/native';
import { fetchRecipes, selectFilteredRecipes, toggleFavorite } from '../Services/recipeSlice';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/ParamList';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import axios from 'axios';
import SessionCheck from './SessionCheck'; 


const cartIcon = require('../Assets/cw.png');
const homeIcon = require('../Assets/hw.png');
const heartIcon = require('../Assets/Heart.png');
const addIcon = require('../Assets/add.png');
const listIcon = require('../Assets/List.png');
const searchIcon = require('../Assets/search.png');
const userIcon = require('../Assets/User.png');
const bellIcon = require('../Assets/bell.png');

const categoryImages: Record<string, any> = {
  Snacks: require('../Assets/1.png'),
  Meal: require('../Assets/2.png'),
  Vegans: require('../Assets/3.png'),
  Dessert: require('../Assets/4.png'),
  Drinks: require('../Assets/5.png'),
};

const { width, height } = Dimensions.get('window');
type MenuScreenRouteProp = RouteProp<RootStackParamList, 'MenuScreen'>;
const MenuScreen = () => {
  const route = useRoute<MenuScreenRouteProp>();
  const { username, email, profilePhoto , uid} = route.params;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const recipes = useSelector((state: RootState) => selectFilteredRecipes(state));
  const [searchText, setSearchText] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
      console.log("id:", id);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      
      dispatch(fetchRecipes());
    }
  }, [dispatch, userId]);

  const publicRecipes = recipes.filter(recipe => recipe.public);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (publicRecipes.length > 0) {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % publicRecipes.length);
      }
    }, 1000); // Change image every 1 second

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [publicRecipes]);

  // Filter public recipes

  // Sort and filter recipes
  const recentRecipes = publicRecipes.slice(0, 5);
  const mostCookedRecipes = [...publicRecipes].sort((a, b) => b.cookCount - a.cookCount).slice(0, 5);
 
  const handleLogout = async () => {
    try {
      // Retrieve the user ID from AsyncStorage
      //const userId =  AsyncStorage.getItem('userId');
      console.log('Retrieved User ID:', uid);
      
      if (userId) {
        // Construct the correct URL
        const url = `${config.recipes}/auth/users/${userId}`;
        console.log('Logout URL:', url);  // This should log the correct URL
  
        // Make the API request to delete the user
        await axios.delete(url);
        
        // Clear user data from AsyncStorage
        await AsyncStorage.removeItem('userId');
  
        // Navigate to the SignUp page and reset the navigation stack
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignUpScreen' }],
        });
      } else {
        console.warn('User ID not found.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  

  const handleCookToday = (recipeId: string) => {
    if (recipeId) {
      navigation.navigate('CookScreen', { id: recipeId ,username, email, profilePhoto, uid});
    } else {
      console.error('Invalid recipeId:', recipeId); // Handle invalid ID
    }
  };

  const handleToggleFavorite = (id: string, event: React.BaseSyntheticEvent) => {
    event.stopPropagation();
    if (userId) {
      dispatch(toggleFavorite(id));
    } else {
      console.warn("User ID is not available.");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.recipeCard}>
      <Image 
        source={{ uri: item.image.startsWith('http') ? item.image : `${config.recipes}${item.image}` }} 
        style={styles.recipeImage} 
      />
      <Text style={styles.recipeText}>{item.name}</Text>
      <Text style={styles.recipeText}>Cooked: {item.cookCount} {item.cookCount === 1 ? 'time' : 'times'}</Text>
      <TouchableOpacity style={styles.makeDishButton} onPress={() => handleCookToday(item.id)}>
        <Text style={styles.buttonText}>Make Dish</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={(event) => handleToggleFavorite(item._id, event)}>
        <Icon 
          name={item.favorites ? "heart" : "heart-outline"} 
          size={24} 
          color="#FF6F00" 
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#FF6F00"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Image source={searchIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image 
                source={{ uri: profilePhoto }} 
                style={styles.profileImage} 
              />
            </TouchableOpacity>
           
          </View>
        </View>

        <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Do you want to log out?</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
              <Text style={styles.modalButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>Welcome, {username}!</Text>
        </View>

        <View style={styles.categoriesContainer}>
      {['Snacks', 'Meal', 'Vegans', 'Dessert', 'Drinks'].map(category => (
        <TouchableOpacity
          key={category}
          style={styles.categoryContainer}
          onPress={() => navigation.navigate('CategoryScreen', { name: category,username,email,profilePhoto, uid})}
        >
          <Image
            source={categoryImages[category]}
            style={styles.categoryImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ))}
    </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mostly Cooked</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Swipe</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal>
          {mostCookedRecipes.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={styles.recipeCard}
          onPress={() => handleCookToday(item._id)}
        >
          <Image
            source={{ uri: `${config.recipes}${item.image}` }}
            style={styles.recipeImage}
          />
          <Text style={styles.recipeText}>{item.cookCount} times</Text>
        </TouchableOpacity>
      ))}
          </ScrollView>
        </View>

        <View style={styles.featuredContainer}>
          {publicRecipes.length > 0 && (
            <Image 
              source={{ uri:`${config.recipes}${publicRecipes[currentImageIndex].image}` }}
              style={styles.featuredImage} 
            />
          )}
          <View style={styles.featuredTextContainer}>
            <Text style={styles.featuredText}>Experience our delicious new dishes</Text>
            <Text style={styles.featuredTitle}>
              {publicRecipes.length > 0 ? publicRecipes[currentImageIndex].name : 'No Recipe Available'}
            </Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          <ScrollView horizontal>
          {recentRecipes.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={styles.recipeCard}
          onPress={() => handleCookToday(item._id)}
        >
          <Image 
            source={{ uri: `${config.recipes}${item.image}` }} 
            style={styles.recipeImage} 
          />
          <Text style={styles.recipeText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.navbar}>
      <TouchableOpacity
          onPress={() =>navigation.navigate('MenuScreen', {username, email, profilePhoto, uid})}>
          <Image source={homeIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddRecipeScreen', {username,email,profilePhoto, uid}) }>
          <Image source={addIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MyRecipesScreen', {username, email, profilePhoto, uid})}>
          <Image source={listIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('FavRecipesScreen', {username, email, profilePhoto, uid})}>
          <Image source={heartIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('GroceryRecipesScreen', {username, email, profilePhoto,uid})}>
          <Image source={cartIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginBottom: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFAB00',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    flex: 1,
    marginRight: 8,
    height: 40, 
  },
  
  searchInput: {
    flex: 1,
    color: '#FF6F00',
    marginLeft: 10,
  },
  searchButton: {
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
    margin:3,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingContainer: {
    padding: 16,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  greetingSubtitle: {
    fontSize: 16,
    color: '#FF6F00',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 16,
  },
  categoryContainer: {
    padding: 2,
  },
  categoryImage: {
    width: 60,
    height: 60,
  },
  sectionContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  viewAllText: {
    color: '#FF6F00',
  },
  recipeCard: {
    backgroundColor: '#FFE082',
    padding: 8,
    borderRadius: 8,
    marginRight: 16,
  },
  recipeImage: {
    width: 100,
    height: 100,
  },
  recipeText: {
    padding: 8,
    color: '#FF7548',
    fontWeight: 'bold',
  },
  makeDishButton: {
    backgroundColor: '#FF6F00',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  featuredContainer: {
    backgroundColor: '#FF7548',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',  // Align items horizontally
    alignItems: 'center',
    margin: 16,
  },
  featuredImage: {
    width: 100,  // Adjust the width of the image
    height: 100,  // Adjust the height of the image
    borderRadius: 8,  // Optional: add rounded corners to the image
  },
  featuredTextContainer: {
    marginLeft: 16,  // Space between the image and the text
    flex: 1,  // Allow text to take up the remaining space
  },
  featuredText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,// Adjust the font size
  },
  featuredTitle: {
    color: '#FFC935',
    fontWeight: 'bold',
    fontSize: 20,
  },

  featuredTimeText: {
    color: '#FFF',
    marginTop: 4,  // Adjust the margin for better spacing
    fontSize: 16,  // Adjust the font size
  },
  
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#FF6F00',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    color: '#FF6F00',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#FF6F00',
    marginVertical: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: semi-transparent background
  },
});

export default MenuScreen;
*/

//==================================JWT token and Before Logout modal design update=================
/*
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList,Modal, ScrollView, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, useAppDispatch } from '../Store/store';
import { RouteProp, useRoute } from '@react-navigation/native';
import { fetchRecipes, selectFilteredRecipes, toggleFavorite } from '../Services/recipeSlice';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/ParamList';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import axios from 'axios';
import { logout } from '../Services/recipeSlice';
import SessionCheck from './SessionCheck'; 


const cartIcon = require('../Assets/cw.png');
const homeIcon = require('../Assets/hw.png');
const heartIcon = require('../Assets/Heart.png');
const addIcon = require('../Assets/add.png');
const listIcon = require('../Assets/List.png');
const searchIcon = require('../Assets/search.png');
const userIcon = require('../Assets/User.png');
const bellIcon = require('../Assets/bell.png');

const categoryImages: Record<string, any> = {
  Snacks: require('../Assets/1.png'),
  Meal: require('../Assets/2.png'),
  Vegans: require('../Assets/3.png'),
  Dessert: require('../Assets/4.png'),
  Drinks: require('../Assets/5.png'),
};

const { width, height } = Dimensions.get('window');
type MenuScreenRouteProp = RouteProp<RootStackParamList, 'MenuScreen'>;
const MenuScreen = () => {
  const route = useRoute<MenuScreenRouteProp>();
  const { username, email, profilePhoto , uid} = route.params;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const recipes = useSelector((state: RootState) => selectFilteredRecipes(state));
  const [searchText, setSearchText] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
      console.log("id:", id);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      
      dispatch(fetchRecipes());
    }
  }, [dispatch, userId]);

  const publicRecipes = recipes.filter(recipe => recipe.public);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (publicRecipes.length > 0) {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % publicRecipes.length);
      }
    }, 1000); // Change image every 1 second

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [publicRecipes]);

  // Filter public recipes

  // Sort and filter recipes
  const recentRecipes = publicRecipes.slice(0, 5);
  const mostCookedRecipes = [...publicRecipes].sort((a, b) => b.cookCount - a.cookCount).slice(0, 5);
 
  const handleLogout = async () => {
    dispatch(logout());
     navigation.navigate('LaunchScreen');
  };
  

  const handleCookToday = (recipeId: string) => {
    if (recipeId) {
      navigation.navigate('CookScreen', { id: recipeId ,username, email, profilePhoto, uid});
    } else {
      console.error('Invalid recipeId:', recipeId); // Handle invalid ID
    }
  };

  const handleToggleFavorite = (id: string, event: React.BaseSyntheticEvent) => {
    event.stopPropagation();
    if (userId) {
      dispatch(toggleFavorite(id));
    } else {
      console.warn("User ID is not available.");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.recipeCard}>
      <Image 
        source={{ uri: item.image.startsWith('http') ? item.image : `${config.recipes}${item.image}` }} 
        style={styles.recipeImage} 
      />
      <Text style={styles.recipeText}>{item.name}</Text>
      <Text style={styles.recipeText}>Cooked: {item.cookCount} {item.cookCount === 1 ? 'time' : 'times'}</Text>
      <TouchableOpacity style={styles.makeDishButton} onPress={() => handleCookToday(item.id)}>
        <Text style={styles.buttonText}>Make Dish</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={(event) => handleToggleFavorite(item._id, event)}>
        <Icon 
          name={item.favorites ? "heart" : "heart-outline"} 
          size={24} 
          color="#FF6F00" 
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#FF6F00"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Image source={searchIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image 
                source={{ uri: profilePhoto }} 
                style={styles.profileImage} 
              />
            </TouchableOpacity>
           
          </View>
        </View>

        <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Do you want to log out?</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
              <Text style={styles.modalButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>Welcome, {username}!</Text>
        </View>

        <View style={styles.categoriesContainer}>
      {['Snacks', 'Meal', 'Vegans', 'Dessert', 'Drinks'].map(category => (
        <TouchableOpacity
          key={category}
          style={styles.categoryContainer}
          onPress={() => navigation.navigate('CategoryScreen', { name: category,username,email,profilePhoto, uid})}
        >
          <Image
            source={categoryImages[category]}
            style={styles.categoryImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ))}
    </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mostly Cooked</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Swipe</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal>
          {mostCookedRecipes.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={styles.recipeCard}
          onPress={() => handleCookToday(item._id)}
        >
          <Image
            source={{ uri: `${config.recipes}${item.image}` }}
            style={styles.recipeImage}
          />
          <Text style={styles.recipeText}>{item.cookCount} times</Text>
        </TouchableOpacity>
      ))}
          </ScrollView>
        </View>

        <View style={styles.featuredContainer}>
          {publicRecipes.length > 0 && (
            <Image 
              source={{ uri:`${config.recipes}${publicRecipes[currentImageIndex].image}` }}
              style={styles.featuredImage} 
            />
          )}
          <View style={styles.featuredTextContainer}>
            <Text style={styles.featuredText}>Experience our delicious new dishes</Text>
            <Text style={styles.featuredTitle}>
              {publicRecipes.length > 0 ? publicRecipes[currentImageIndex].name : 'No Recipe Available'}
            </Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          <ScrollView horizontal>
          {recentRecipes.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={styles.recipeCard}
          onPress={() => handleCookToday(item._id)}
        >
          <Image 
            source={{ uri: `${config.recipes}${item.image}` }} 
            style={styles.recipeImage} 
          />
          <Text style={styles.recipeText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.navbar}>
      <TouchableOpacity
          onPress={() =>navigation.navigate('MenuScreen', {username, email, profilePhoto, uid})}>
          <Image source={homeIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddRecipeScreen', {username,email,profilePhoto, uid}) }>
          <Image source={addIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MyRecipesScreen', {username, email, profilePhoto, uid})}>
          <Image source={listIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('FavRecipesScreen', {username, email, profilePhoto, uid})}>
          <Image source={heartIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('GroceryRecipesScreen', {username, email, profilePhoto,uid})}>
          <Image source={cartIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginBottom: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFAB00',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    flex: 1,
    marginRight: 8,
    height: 40, 
  },
  
  searchInput: {
    flex: 1,
    color: '#FF6F00',
    marginLeft: 10,
  },
  searchButton: {
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
    margin:3,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingContainer: {
    padding: 16,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  greetingSubtitle: {
    fontSize: 16,
    color: '#FF6F00',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 16,
  },
  categoryContainer: {
    padding: 2,
  },
  categoryImage: {
    width: 60,
    height: 60,
  },
  sectionContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  viewAllText: {
    color: '#FF6F00',
  },
  recipeCard: {
    backgroundColor: '#FFE082',
    padding: 8,
    borderRadius: 8,
    marginRight: 16,
  },
  recipeImage: {
    width: 100,
    height: 100,
  },
  recipeText: {
    padding: 8,
    color: '#FF7548',
    fontWeight: 'bold',
  },
  makeDishButton: {
    backgroundColor: '#FF6F00',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  featuredContainer: {
    backgroundColor: '#FF7548',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',  // Align items horizontally
    alignItems: 'center',
    margin: 16,
  },
  featuredImage: {
    width: 100,  // Adjust the width of the image
    height: 100,  // Adjust the height of the image
    borderRadius: 8,  // Optional: add rounded corners to the image
  },
  featuredTextContainer: {
    marginLeft: 16,  // Space between the image and the text
    flex: 1,  // Allow text to take up the remaining space
  },
  featuredText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,// Adjust the font size
  },
  featuredTitle: {
    color: '#FFC935',
    fontWeight: 'bold',
    fontSize: 20,
  },

  featuredTimeText: {
    color: '#FFF',
    marginTop: 4,  // Adjust the margin for better spacing
    fontSize: 16,  // Adjust the font size
  },
  
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#FF6F00',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    color: '#FF6F00',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#FF6F00',
    marginVertical: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: semi-transparent background
  },
});

export default MenuScreen;
*/


import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList,Modal, ScrollView, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, useAppDispatch } from '../Store/store';
import { RouteProp, useRoute } from '@react-navigation/native';
import { fetchRecipes, selectFilteredRecipes, toggleFavorite } from '../Services/recipeSlice';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/ParamList';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import axios from 'axios';
import { logout } from '../Services/recipeSlice';
import SessionCheck from './SessionCheck'; 


const cartIcon = require('../Assets/cw.png');
const homeIcon = require('../Assets/hw.png');
const heartIcon = require('../Assets/Heart.png');
const addIcon = require('../Assets/add.png');
const listIcon = require('../Assets/List.png');
const searchIcon = require('../Assets/search.png');
const userIcon = require('../Assets/User.png');
const bellIcon = require('../Assets/bell.png');

const categoryImages: Record<string, any> = {
  Snacks: require('../Assets/1.png'),
  Meal: require('../Assets/2.png'),
  Vegans: require('../Assets/3.png'),
  Dessert: require('../Assets/4.png'),
  Drinks: require('../Assets/5.png'),
};

const { width, height } = Dimensions.get('window');
type MenuScreenRouteProp = RouteProp<RootStackParamList, 'MenuScreen'>;
const MenuScreen = () => {
  const route = useRoute<MenuScreenRouteProp>();
  const { username, email, profilePhoto , uid} = route.params;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const recipes = useSelector((state: RootState) => selectFilteredRecipes(state));
  const [searchText, setSearchText] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
      console.log("id:", id);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      
      dispatch(fetchRecipes());
    }
  }, [dispatch, userId]);

  const publicRecipes = recipes.filter(recipe => recipe.public);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (publicRecipes.length > 0) {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % publicRecipes.length);
      }
    }, 1000); // Change image every 1 second

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [publicRecipes]);

  // Filter public recipes

  // Sort and filter recipes
  const recentRecipes = publicRecipes.slice(0, 5);
  const mostCookedRecipes = [...publicRecipes].sort((a, b) => b.cookCount - a.cookCount).slice(0, 5);
 
  const handleLogout = async () => {
    dispatch(logout());
     navigation.navigate('LaunchScreen');
  };
  

  const handleCookToday = (recipeId: string) => {
    if (recipeId) {
      navigation.navigate('CookScreen', { id: recipeId ,username, email, profilePhoto, uid});
    } else {
      console.error('Invalid recipeId:', recipeId); // Handle invalid ID
    }
  };

  const handleToggleFavorite = (id: string, event: React.BaseSyntheticEvent) => {
    event.stopPropagation();
    if (userId) {
      dispatch(toggleFavorite(id));
    } else {
      console.warn("User ID is not available.");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.recipeCard}>
      <Image 
        source={{ uri: item.image.startsWith('http') ? item.image : `${config.recipes}${item.image}` }} 
        style={styles.recipeImage} 
      />
      <Text style={styles.recipeText}>{item.name}</Text>
      <Text style={styles.recipeText}>Cooked: {item.cookCount} {item.cookCount === 1 ? 'time' : 'times'}</Text>
      <TouchableOpacity style={styles.makeDishButton} onPress={() => handleCookToday(item.id)}>
        <Text style={styles.buttonText}>Make Dish</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={(event) => handleToggleFavorite(item._id, event)}>
        <Icon 
          name={item.favorites ? "heart" : "heart-outline"} 
          size={24} 
          color="#FF6F00" 
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#FF6F00"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Image source={searchIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image 
                source={{ uri: profilePhoto }} 
                style={styles.profileImage} 
              />
            </TouchableOpacity>
           
          </View>
        </View>

  {/* Modal for showing user information */}
  <Modal visible={isModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Image source={{ uri: profilePhoto }} style={styles.pfp} />
              <Text style={styles.username}>{username}</Text>
              <Text style={styles.email}>{email}</Text>
              <Text style={styles.modalText}>Do you want to log out?</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
                <Text style={styles.modalButtonText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>



        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>Welcome, {username}!</Text>
        </View>

        <View style={styles.categoriesContainer}>
      {['Snacks', 'Meal', 'Vegans', 'Dessert', 'Drinks'].map(category => (
        <TouchableOpacity
          key={category}
          style={styles.categoryContainer}
          onPress={() => navigation.navigate('CategoryScreen', { name: category,username,email,profilePhoto, uid})}
        >
          <Image
            source={categoryImages[category]}
            style={styles.categoryImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ))}
    </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mostly Cooked</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Swipe</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal>
          {mostCookedRecipes.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={styles.recipeCard}
          onPress={() => handleCookToday(item._id)}
        >
          <Image
            source={{ uri: `${config.recipes}${item.image}` }}
            style={styles.recipeImage}
          />
          <Text style={styles.recipeText}>{item.cookCount} times</Text>
        </TouchableOpacity>
      ))}
          </ScrollView>
        </View>

        <View style={styles.featuredContainer}>
          {publicRecipes.length > 0 && (
            <Image 
              source={{ uri:`${config.recipes}${publicRecipes[currentImageIndex].image}` }}
              style={styles.featuredImage} 
            />
          )}
          <View style={styles.featuredTextContainer}>
            <Text style={styles.featuredText}>Experience our delicious new dishes</Text>
            <Text style={styles.featuredTitle}>
              {publicRecipes.length > 0 ? publicRecipes[currentImageIndex].name : 'No Recipe Available'}
            </Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          <ScrollView horizontal>
          {recentRecipes.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={styles.recipeCard}
          onPress={() => handleCookToday(item._id)}
        >
          <Image 
            source={{ uri: `${config.recipes}${item.image}` }} 
            style={styles.recipeImage} 
          />
          <Text style={styles.recipeText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.navbar}>
      <TouchableOpacity
          onPress={() =>navigation.navigate('MenuScreen', {username, email, profilePhoto, uid})}>
          <Image source={homeIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddRecipeScreen', {username,email,profilePhoto, uid}) }>
          <Image source={addIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MyRecipesScreen', {username, email, profilePhoto, uid})}>
          <Image source={listIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('FavRecipesScreen', {username, email, profilePhoto, uid})}>
          <Image source={heartIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('GroceryRecipesScreen', {username, email, profilePhoto,uid})}>
          <Image source={cartIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginBottom: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFAB00',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    flex: 1,
    marginRight: 8,
    height: 40, 
  },
  
  searchInput: {
    flex: 1,
    color: '#FF6F00',
    marginLeft: 10,
  },
  searchButton: {
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
    margin:3,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingContainer: {
    padding: 16,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  greetingSubtitle: {
    fontSize: 16,
    color: '#FF6F00',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 16,
  },
  categoryContainer: {
    padding: 2,
  },
  categoryImage: {
    width: 60,
    height: 60,
  },
  sectionContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  viewAllText: {
    color: '#FF6F00',
  },
  recipeCard: {
    backgroundColor: '#FFE082',
    padding: 8,
    borderRadius: 8,
    marginRight: 16,
  },
  recipeImage: {
    width: 100,
    height: 100,
  },
  recipeText: {
    padding: 8,
    color: '#FF7548',
    fontWeight: 'bold',
  },
  makeDishButton: {
    backgroundColor: '#FF6F00',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  featuredContainer: {
    backgroundColor: '#FF7548',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',  // Align items horizontally
    alignItems: 'center',
    margin: 16,
  },
  featuredImage: {
    width: 100,  // Adjust the width of the image
    height: 100,  // Adjust the height of the image
    borderRadius: 8,  // Optional: add rounded corners to the image
  },
  featuredTextContainer: {
    marginLeft: 16,  // Space between the image and the text
    flex: 1,  // Allow text to take up the remaining space
  },
  featuredText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,// Adjust the font size
  },
  featuredTitle: {
    color: '#FFC935',
    fontWeight: 'bold',
    fontSize: 20,
  },

  featuredTimeText: {
    color: '#FFF',
    marginTop: 4,  // Adjust the margin for better spacing
    fontSize: 16,  // Adjust the font size
  },
  
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#FF6F00',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    color: '#FF6F00',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#FF6F00',
    marginVertical: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  pfp: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginVertical: 5,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
});

export default MenuScreen;
