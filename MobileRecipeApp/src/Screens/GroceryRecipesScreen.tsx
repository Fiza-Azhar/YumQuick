import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Button } from 'react-native';
import { useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store/store';
import { RootStackParamList } from '../Navigation/ParamList';
import { fetchRecipes, Recipe, selectFilteredRecipes } from '../Services/recipeSlice';
import config from '../config';


const homeIcon = require('../Assets/hw.png');
const addIcon = require('../Assets/add.png');
const listIcon = require('../Assets/List.png');
const heartIcon = require('../Assets/Heart.png');
const cartIcon = require('../Assets/cw.png');
const searchIcon = require('../Assets/search.png');

type GroceryRecipeRouteProp = RouteProp<RootStackParamList, 'GroceryRecipesScreen'>;
type Props = {
  route: GroceryRecipeRouteProp;
};
/**
 * GroceryRecipesScreen Component
 * 
 * Displays a list of recipes, allows the user to select recipes, and navigate to a grocery list screen.
 * 
 * @param {object} route - Navigation route parameters.
 * @returns JSX.Element
 */
const GroceryRecipesScreen: React.FC<Props> = ({route}) => {
  const {username, email, profilePhoto, uid} = route.params;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<any>();

  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [servings, setServings] = useState('1');

  const recipes = useSelector((state: RootState) => selectFilteredRecipes(state));

  useEffect(() => {
    dispatch(fetchRecipes() as any);
  }, [dispatch]);

  const handleCheckboxChange = (recipeId: string) => {
    setSelectedRecipes(prevSelected =>
      prevSelected.includes(recipeId)
        ? prevSelected.filter(id => id !== recipeId)
        : [...prevSelected, recipeId]
    );
  };

  const handleGetGroceryList = () => {
    if (selectedRecipes.length === 0) {
      Alert.alert('No Recipes Selected', 'Please select at least one recipe.');
      return;
    }
    setModalVisible(true);
  };

  const handleConfirmServings = () => {
    setModalVisible(false);
    navigation.navigate('GroceryListScreen', { selectedRecipes, servings: Number(servings), username, email, profilePhoto, uid });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setServings('1');
  };
  const handleIncrement = () => {
    setServings(prev => String(Number(prev) + 1));
  };

  const handleDecrement = () => {
    setServings(prev => (Number(prev) > 1 ? String(Number(prev) - 1) : '1'));
  };
  const handleIncrementLongPress = () => {
    setServings(prev => String(Number(prev) + 5));
  };

  const handleDecrementLongPress = () => {
    setServings(prev => (Number(prev) > 5 ? String(Number(prev) - 5) : '1'));
  };

const renderRecipeItem = ({ item }: { item: Recipe }) => (
  <TouchableOpacity
    style={styles.recipeCard}
    onPress={() => handleCheckboxChange(item._id)}
  >
    <Image 
      source={{ uri: `${config.recipes}${item.image}` }} 
      style={styles.recipeImage} 
    />
    <View style={styles.recipeInfo}>
      <Text style={styles.recipeName}>{item.name}</Text>
      <Text style={styles.recipeDetails}>{item.ingredients.length} ingredients</Text>
      <View style={styles.checkboxContainer}>
        <Text style={styles.checkbox}>{selectedRecipes.includes(item._id) ? '☑' : '☐'}</Text>
      </View>
    </View>
  </TouchableOpacity>
);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Grocery</Text>
      </View>
      <View style={styles.container}>
        <FlatList
          data={recipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
        <TouchableOpacity style={styles.button} onPress={handleGetGroceryList}>
          <Text style={styles.buttonText}>Get Grocery List</Text>
        </TouchableOpacity>

        {/* Modal for servings */}
        <Modal
      transparent={true}
      animationType="fade"
      visible={modalVisible}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enter Number of Servings</Text>
          <View style={styles.servingsContainer}>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={handleDecrement}
              onLongPress={handleDecrementLongPress}
            >
              <Text style={styles.adjustButtonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={servings}
              onChangeText={setServings}
              placeholder="Enter"
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={handleIncrement}
              onLongPress={handleIncrementLongPress}
            >
              <Text style={styles.adjustButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleConfirmServings}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

      </View>
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
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  adjustButton: {
    backgroundColor: '#FFA726',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginHorizontal: 0, // Space between the buttons and input
  },
  adjustButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
  list: {
    paddingBottom: 80,
  },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  recipeImage: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  recipeDetails: {
    fontSize: 14,
    color: '#555',
  },
  checkboxContainer: {
    position: 'absolute',
    right: 16,
    top: 8,
    
  },
  checkbox: {
    fontSize: 24,
    color: '#FFA726',
    
  },
  button: {
    backgroundColor: '#FFA726',
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  modalInput: {
    width: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginHorizontal: 10, 
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#FFA726',
    padding: 5,
    borderRadius: 4,
    flex: 1,
    marginTop: 15,
    marginHorizontal: 30,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
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
});

export default GroceryRecipesScreen;
