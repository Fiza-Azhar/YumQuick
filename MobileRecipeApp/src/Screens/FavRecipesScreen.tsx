//=================before user id============
/*
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, useAppDispatch } from '../Store/store';
import { fetchRecipes, toggleFavorite } from '../Services/recipeSlice';
import { useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/ParamList';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../config';

const homeIcon = require('../Assets/hw.png');
const addIcon = require('../Assets/add.png');
const listIcon = require('../Assets/List.png');
const heartIcon = require('../Assets/Heart.png');
const cartIcon = require('../Assets/cw.png');
const searchIcon = require('../Assets/search.png');


const { width, height } = Dimensions.get('window');

interface Recipe {
  _id: string;
  name: string;
  image: string;
  cookCount: number;
  favorites: boolean;
}
type FavRecipeRouteProp = RouteProp<RootStackParamList, 'FavRecipesScreen'>;
type Props = {
  route: FavRecipeRouteProp;
};
const FaveRecipesScreen: React.FC<Props> = ({route}) => {
  const {username, email, profilePhoto} = route.params;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const favoriteIds = useSelector((state: RootState) => state.recipes.favorites);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

    const favoriteRecipes = recipes.filter(recipe => recipe.favorites === true);
  

  const handleToggleFavorite = (id: string, event: React.BaseSyntheticEvent) => {
    event.stopPropagation();
    dispatch(toggleFavorite(id));
  };

  const renderItem = ({ item }: { item: Recipe }) => (
    <View style={styles.recipeContainer}>
      <Image 
       // source={{ uri: item.image.startsWith('http') ? item.image : `http://192.168.16.148:5000${item.image}` }} 
       source={{ uri: item.image.startsWith('http') ? item.image : `${config.recipes}${item.image}` }}
        style={styles.recipeImage} 
      />
      <View style={styles.recipeDetails}>
        <Text style={styles.recipeTitle}>{item.name}</Text>
        <Text style={styles.cookCount}>
          Cooked: {item.cookCount} {item.cookCount === 1 ? 'time' : 'times'}
        </Text>
      </View>
      <View style={styles.recipeActions}>
        <TouchableOpacity onPress={(event) => handleToggleFavorite(item._id, event)}>
          <Icon 
            name={item.favorites ? "heart" : "heart-outline"} 
            size={24} 
            color="#FF6F00" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorite Recipes</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#FFA726"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Image source={searchIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={favoriteRecipes as Recipe[]} // Type cast if necessary
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.recipeList}
        ListEmptyComponent={<Text style={styles.emptyText}>No favorite recipes found.</Text>}
      />
      <View style={styles.navbar}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MenuScreen', {username, email, profilePhoto})
          }>
          <Image source={homeIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddRecipeScreen', {
              username,
              email,
              profilePhoto,
            })
          }>
          <Image source={addIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MyRecipesScreen')}>
          <Image source={listIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('FavRecipesScreen', {username, email, profilePhoto})}>
          <Image source={heartIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('GroceryRecipesScreen')}>
          <Image source={cartIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFAB00',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FFA726',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#FFA726',
    height: 40,
  },
  searchButton: {
    marginLeft: 8,
  },
  recipeList: {
    padding: 16,
  },
  recipeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  recipeDetails: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  cookCount: {
    color: '#757575',
  },
  recipeActions: {
    justifyContent: 'space-between',
   
  },
  makeDishButton: {
    backgroundColor: '#FF6F00',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FF6F00',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  icon: {
    width: 24,
    height: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#757575',
    marginTop: 20,
  },
});

export default FaveRecipesScreen;
*/


import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../Store/store';
import { fetchRecipes, toggleFavorite } from '../Services/recipeSlice';
import { useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/ParamList';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../config';

const homeIcon = require('../Assets/hw.png');
const addIcon = require('../Assets/add.png');
const listIcon = require('../Assets/List.png');
const heartIcon = require('../Assets/Heart.png');
const cartIcon = require('../Assets/cw.png');
const searchIcon = require('../Assets/search.png');

const { width, height } = Dimensions.get('window');

interface Recipe {
  _id: string;
  email: string;
  name: string;
  image: string;
  cookCount: number;
  favorites: boolean;
}

type FavRecipeRouteProp = RouteProp<RootStackParamList, 'FavRecipesScreen'>;
type Props = {
  route: FavRecipeRouteProp;
};

const FaveRecipesScreen: React.FC<Props> = ({ route }) => {
  const { username, email: emailObj, profilePhoto, uid } = route.params;
  // Extract email from the object if necessary
  const email = typeof emailObj === 'object' ? emailObj.email : emailObj;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const favoriteIds = useSelector((state: RootState) => state.recipes.favorites);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  const favoriteRecipes = recipes.filter(
    recipe => recipe.favorites && recipe.email === email
  );

  const searchedRecipes = favoriteRecipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCookToday = (recipeId: string) => {
    if (recipeId) {
      navigation.navigate('CookScreen', { id: recipeId, username, email, profilePhoto,uid });
    } else {
      console.error('Invalid recipeId:', recipeId); // Handle invalid ID
    }
  };

  const handleToggleFavorite = (id: string, event: React.BaseSyntheticEvent) => {
    event.stopPropagation();
    dispatch(toggleFavorite(id));
  };

  const renderItem = ({ item }: { item: Recipe }) => (
    <View style={styles.recipeContainer}>
      <Image
        source={{ uri: item.image.startsWith('http') ? item.image : `${config.recipes}${item.image}` }}
        style={styles.recipeImage}
      />
      <View style={styles.recipeDetails}>
        <Text style={styles.recipeTitle}>{item.name}</Text>
        <Text style={styles.cookCount}>
          Cooked: {item.cookCount} {item.cookCount === 1 ? 'time' : 'times'}
        </Text>
      </View>
      <View style={styles.recipeActions}>
        <TouchableOpacity onPress={(event) => handleToggleFavorite(item._id, event)}>
          <Icon
            name={item.favorites ? "heart" : "heart-outline"}
            size={24}
            color="#FF6F00"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorite Recipes</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#FFA726"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Image source={searchIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={favoriteRecipes as Recipe[]}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.recipeList}
        ListEmptyComponent={<Text style={styles.emptyText}>No favorite recipes found.</Text>}
      />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFAB00',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FFA726',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#FFA726',
    height: 40,
  },
  searchButton: {
    marginLeft: 8,
  },
  recipeList: {
    padding: 16,
  },
  recipeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  recipeDetails: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  cookCount: {
    color: '#757575',
  },
  recipeActions: {
    justifyContent: 'space-between',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FF6F00',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  icon: {
    width: 24,
    height: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#757575',
    marginTop: 20,
  },
});

export default FaveRecipesScreen;
