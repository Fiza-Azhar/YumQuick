import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, useAppDispatch } from '../Store/store';
import { toggleFavorite, fetchRecipes, selectFilteredRecipes } from '../Services/recipeSlice';
import { useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/ParamList';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../config';

const logoPath = require('../Assets/logo2.png');
const cartIcon = require('../Assets/cw.png');
const homeIcon = require('../Assets/hw.png');
const heartIcon = require('../Assets/Heart.png');
const addIcon = require('../Assets/add.png');
const listIcon = require('../Assets/List.png');
const searchIcon = require('../Assets/search.png');
const deleteIcon = require('../Assets/delete.png');

const { width, height } = Dimensions.get('window');

type MyRecipesRouteProp = RouteProp<RootStackParamList, 'MyRecipesScreen'>;
type Props = {
  route: MyRecipesRouteProp;
};

const MyRecipesScreen: React.FC<Props> = ({route}) => {
  //const {username, email, profilePhoto} = route.params;
  const { username, email: emailObj, profilePhoto, uid } = route.params;

  // Extract email from the object if necessary
  const email = typeof emailObj === 'object' ? emailObj.email : emailObj;
  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const recipes = useSelector((state: RootState) => selectFilteredRecipes(state));
  const [searchText, setSearchText] = useState('');

  const [selectedFilter, setSelectedFilter] = useState<'myRecipes' | 'myPublic' | 'myPrivate' | 'PublicRecipes'>('myRecipes');

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);


  const filteredRecipes = recipes.filter(recipe => {
    if (selectedFilter === 'myRecipes') {
      return recipe.email === email;
    } 
    /*
    else if (selectedFilter === 'myPublic') {
      return recipe.email === email && recipe.public;
    } else if (selectedFilter === 'myPrivate') {
      return recipe.email === email && !recipe.public;
    } 
    */
   else if (selectedFilter === 'PublicRecipes') {
      return recipes && recipe.public;
    }
    return false;
  });


  const searchedRecipes = filteredRecipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCookToday = (recipeId: string) => {
  if (recipeId) {
    navigation.navigate('CookScreen', { id: recipeId ,username, email, profilePhoto, uid});
  } else {
    console.error('Invalid recipeId:', recipeId); // Handle invalid ID
  }
};

  
  const handleToggleFavorite = (id: string, event: React.BaseSyntheticEvent) => {
    event.stopPropagation();
    dispatch(toggleFavorite(id));
  };
  
  //const filteredRecipes = recipes.filter(recipe => recipe.email === email);
  const handleDeleteRecipe = async (id: string) => {
    //console.log(`Attempting to delete recipe with ID: ${id}`);
    try {
      const response = await fetch(`${config.recipes}/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseText = await response.text();
  
      if (response.ok) {
        dispatch(fetchRecipes());
      } else {
        console.error('Failed to delete recipe:', responseText);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };
  const renderItem = ({ item }: { item: any }) => (
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
        <TouchableOpacity 
          style={styles.makeDishButton} 
          onPress={() => handleCookToday(item._id)}
        >
          <Text style={styles.buttonText}>Make Dish</Text>
        </TouchableOpacity>
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={(event) => handleToggleFavorite(item._id, event)}>
            <Icon 
              name={item.favorites ? "heart" : "heart-outline"} 
              size={24} 
              color="#FF6F00" 
            />
          </TouchableOpacity>
          {selectedFilter === 'myRecipes' && item.email === email && (
            <TouchableOpacity onPress={() => handleDeleteRecipe(item._id)}>
              <Image source={deleteIcon} style={styles.delicon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
  
  
  /*
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.recipeContainer}>
      <Image 
      //source={{ uri: `http://192.168.16.148:5000${item.image}` }} 
      source={{ uri: item.image.startsWith('http') ? item.image : `${config.recipes}${item.image}` }} 
      style={styles.recipeImage} />
      <View style={styles.recipeDetails}>
        <Text style={styles.recipeTitle}>{item.name}</Text>
        <Text style={styles.cookCount}>
          Cooked: {item.cookCount} {item.cookCount === 1 ? 'time' : 'times'}
        </Text>
      </View>
      <View style={styles.recipeActions}>
        <TouchableOpacity style={styles.makeDishButton} onPress={() => {
       
            handleCookToday(item._id);
          }}>
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
    </View>
  );
  */

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Recipes</Text>
      </View>
      <View style={styles.filtersContainer}>
        {['myRecipes', 'PublicRecipes'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter as typeof selectedFilter)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.activeFilterButtonText,
              ]}
            >
              {filter.replace(/([A-Z])/g, ' $1').toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
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
        //data={filteredRecipes.filter(recipe => recipe.name.toLowerCase().includes(searchText.toLowerCase()))}
        data={searchedRecipes}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.recipeList}
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
    width: 70,
    height: 70,
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
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  delicon: {
    width: 24,
    height: 24,
    marginLeft: 15,
  },

  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF3E0',
    justifyContent: 'space-around',
  },
  filterButton: {
    padding: 8,
  },
  activeFilterButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6F00',
  },
  filterButtonText: {
    color: '#FFA726',
  },
  activeFilterButtonText: {
    color: '#FF6F00',
    fontWeight: 'bold',
  },
});

export default MyRecipesScreen;
