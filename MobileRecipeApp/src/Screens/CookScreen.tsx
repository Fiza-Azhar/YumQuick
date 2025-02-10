
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Image, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, useAppDispatch } from '../Store/store';
import { toggleRecipe, fetchRecipes } from '../Services/recipeSlice';
import { useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/ParamList';
import { useNavigation } from '@react-navigation/native';
import config from '../config';

const logoPath = require('../Assets/logo2.png');
const cartIcon = require('../Assets/cw.png');
const homeIcon = require('../Assets/hw.png');
const heartIcon = require('../Assets/Heart.png');
const addIcon = require('../Assets/add.png');
const listIcon = require('../Assets/List.png');
const upIcon = require('../Assets/up.png');
const downIcon = require('../Assets/down.png');

const { width } = Dimensions.get('window');

interface Step {
  step: string;
  des: string;
}

interface Ingredients {
  item: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  _id: string;
  id: number;
  email: string;
  name: string;
  size: number;
  ingredients: Ingredients[];
  steps: Step[];
  category: string;
  image: string | null;
  checked: boolean;
  cookCount: number;
  favorites: boolean;
}


type CookScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CookScreen'>;

type CookScreenRouteProp = RouteProp<RootStackParamList, 'CookScreen'>;
type Props = {
  route: CookScreenRouteProp;
};

const CookScreen: React.FC<Props> = ({route}) => {
  const {username, email, profilePhoto, uid} = route.params;

  const navigation = useNavigation<CookScreenNavigationProp>();

  const dispatch = useDispatch();
  const dispatch2 = useAppDispatch();
  const recipes = useSelector((state: RootState) => state.recipes.recipes);

  const recipeId = route.params?.id;
  const recipe = recipes.find((recipe) => recipe._id === recipeId);

  useEffect(() => {
    dispatch2(fetchRecipes());
  }, [dispatch2]);

  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(
    recipe ? new Array(recipe.steps.length).fill(false) : []
  );

  const [expandedStepIndex, setExpandedStepIndex] = useState<number | null>(null);

  const handleStepCheck = (index: number) => {
    const newCheckedSteps = [...checkedSteps];
    newCheckedSteps[index] = !newCheckedSteps[index];
    setCheckedSteps(newCheckedSteps);
  };

  const allStepsChecked = checkedSteps.every((checked) => checked);

  const handleCheckButton = () => {
    Alert.alert('Congrats!', 'You completed a recipe!');
    if (recipe) {
      dispatch2(toggleRecipe(recipe._id));
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const toggleStep = (index: number) => {
    setExpandedStepIndex(index === expandedStepIndex ? null : index);
  };

  const renderItem = ({ item, index }: { item: Step; index: number }) => (
    <View style={styles.stepContainer}>
      <TouchableOpacity 
        onPress={() => toggleStep(index)} 
        style={styles.stepHeader}
      >
        <TouchableOpacity 
          onPress={() => handleStepCheck(index)} 
          
        >
          <Text style={styles.checkbox}>
            {checkedSteps[index] ? '☑' : '☐'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.stepTitle}>{item.step}</Text>
        <TouchableOpacity 
          onPress={() => toggleStep(index)} 
          style={styles.dropdownContainer}
        >
            <Image 
            source={expandedStepIndex === index ? upIcon : downIcon}
            style={styles.dropdownImage}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      {expandedStepIndex === index && (
        <View style={styles.stepContent}>
          <Text style={styles.stepDescription}>{item.des}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {recipe?.image && (
        <Image 
        //source={{ uri: `http://192.168.16.148:5000${recipe.image}` }} 
        source={{ uri: `${config.recipes}${recipe.image}` }}
        style={styles.recipeImage} />
      )}
      <View style={styles.content}>
        <Text style={styles.recipeName}>{recipe?.name}</Text>
        <Text style={styles.servingSize}>Serving Size: {recipe?.size}</Text>

        <View style={styles.ingredientsContainer}>
          <Text style={styles.sectionTitle}>Ingredients:</Text>
          {recipe?.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              {ingredient.quantity} {ingredient.unit} <View style={styles.divider} />{ingredient.item}
            </Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Steps to follow:</Text>
        <FlatList
          data={recipe?.steps}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.step}-${index}`}
        />

        <TouchableOpacity
          style={[styles.completeButton, { backgroundColor: allStepsChecked ? '#FF6F00' : '#aaaaaa' }]}
          onPress={handleCheckButton}
          disabled={!allStepsChecked}
        >
          <Text style={styles.completeButtonText}>Complete Recipe</Text>
        </TouchableOpacity>
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
  recipeImage: {
    width: 150,
    height: 200,
marginLeft: 90,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderStyle: 'dotted',
    flex: 1,
    marginHorizontal: 10,
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: -10,
    marginBottom: 20, // Adjusted to make space for the navbar
  },
  recipeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  servingSize: {
    fontSize: 16,
    marginBottom: 20,
    color: '#000',
  },
  ingredientsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  ingredient: {
    fontSize: 16,
    color: '#000',
  },
  completeButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FF6F00',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  icon: {
    width: 24,
    height: 24,
  },
  stepContainer: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  checkbox: {
    fontSize: 30,
    color: '#FF6F00',
  },
  checkedCheckboxContainer: {
    backgroundColor: '#FF6F00',
  },
  stepTitle: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
  },
  stepContent: {
    marginTop: 10,
    paddingLeft: 40,
  },
  stepDescription: {
    fontSize: 14,
    color: '#555',
  },
  dropdownContainer: {
    padding: 10,
  },
  dropdownImage: {
    width: 20,
    height: 20,
  },
  dropdownText: {
    fontSize: 18,
    color: '#FF6F00',
  },
});

export default CookScreen;




/*
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Image, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, useAppDispatch } from '../Store/store';
import { toggleRecipe, fetchRecipes } from '../Services/recipeSlice';
import { useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/ParamList';
import { useNavigation } from '@react-navigation/native';

const homeIcon = require('../Assets/hw.png');
const addIcon = require('../Assets/add.png');
const listIcon = require('../Assets/List.png');
const heartIcon = require('../Assets/Heart.png');
const cartIcon = require('../Assets/cw.png');

const { width } = Dimensions.get('window');

interface Step {
  step: string;
  des: string;
}

interface Ingredients {
  item: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  _id: string;
  id: number;
  name: string;
  size: number;
  ingredients: Ingredients[];
  steps: Step[];
  category: string;
  image: string | null;
  checked: boolean;
  cookCount: number;
  favorites: boolean;
}

type CookScreenRouteProp = RouteProp<RootStackParamList, 'CookScreen'>;
type CookScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CookScreen'>;

const CookScreen = () => {
  const route = useRoute<CookScreenRouteProp>();
  const navigation = useNavigation<CookScreenNavigationProp>();

  const dispatch = useDispatch();
  const dispatch2 = useAppDispatch();
  const recipes = useSelector((state: RootState) => state.recipes.recipes);

  const recipeId = route.params?.id;
  const recipe = recipes.find((recipe) => recipe._id === recipeId);

  useEffect(() => {
    dispatch2(fetchRecipes());
  }, [dispatch2]);

  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(
    recipe ? new Array(recipe.steps.length).fill(false) : []
  );

  const [expandedStepIndex, setExpandedStepIndex] = useState<number | null>(null);

  const handleStepCheck = (index: number) => {
    const newCheckedSteps = [...checkedSteps];
    newCheckedSteps[index] = !newCheckedSteps[index];
    setCheckedSteps(newCheckedSteps);
  };

  const allStepsChecked = checkedSteps.every((checked) => checked);

  const handleCheckButton = () => {
    Alert.alert('Congrats!', 'You completed a recipe!');
    if (recipe) {
      dispatch2(toggleRecipe(recipe._id));
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const toggleStep = (index: number) => {
    setExpandedStepIndex(index === expandedStepIndex ? null : index);
  };

  const renderItem = ({ item, index }: { item: Step; index: number }) => (
    <View style={styles.stepContainer}>
      <TouchableOpacity 
        onPress={() => toggleStep(index)} 
        style={styles.stepHeader}
      >
        <TouchableOpacity 
          onPress={() => handleStepCheck(index)} 
          
        >
          <Text style={styles.checkbox}>
            {checkedSteps[index] ? '☑' : '☐'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.stepTitle}>{item.step}</Text>
        <TouchableOpacity 
          onPress={() => toggleStep(index)} 
          style={styles.dropdownContainer}
        >
          <Text style={styles.dropdownText}>
            {expandedStepIndex === index ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
      {expandedStepIndex === index && (
        <View style={styles.stepContent}>
          <Text style={styles.stepDescription}>{item.des}</Text>
        </View>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.imageContainer}>
        {recipe?.image && (
          <Image source={{ uri: `http://192.168.16.148:5000${recipe.image}` }} style={styles.recipeImage} />
        )}
        <View style={styles.recipeDetails}>
          <Text style={styles.recipeName}>{recipe?.name}</Text>
          <Text style={styles.servingSize}>Serving Size: {recipe?.size}</Text>
          <Text style={styles.cookCount}>Cook Count: {recipe?.cookCount}</Text>
          <Text style={styles.ingredientCount}>Ingredients: {recipe?.ingredients.length}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.heading}>Cook Recipe</Text>
        <View style={styles.ingredientsContainer}>
          <Text style={styles.sectionTitle}>Ingredients:</Text>
          {recipe?.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              {ingredient.quantity} {ingredient.unit} - {ingredient.item}
            </Text>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Steps to follow:</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={renderHeader}
      data={recipe?.steps}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.step}-${index}`}
      ListFooterComponent={
        <TouchableOpacity
          style={[styles.completeButton, { backgroundColor: allStepsChecked ? '#224e05' : '#aaaaaa' }]}
          onPress={handleCheckButton}
          disabled={!allStepsChecked}
        >
          <Text style={styles.completeButtonText}>Complete Recipe</Text>
        </TouchableOpacity>
      }
      contentContainerStyle={styles.scrollContainer}
    />
    

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFAB00',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80, 
  },
  recipeImage: {
    width: 150,
    height: 200,

  },
  content: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: '#FFF8E1',
    height: 100,
    padding: 20,
    marginTop: -10,
  },
  heading: {
    fontSize: 22, // Smaller font size for the heading
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF6F00',
  },
  servingSize: {
    fontSize: 14, // Reduced font size
    marginBottom: 20,
    color: '#000',
  },
  ingredientsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16, // Reduced font size
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  ingredient: {
    fontSize: 14, // Reduced font size
    color: '#000',
  },
  completeButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    color: '#000',
    fontSize: 16,
  },
  stepContainer: {
    marginBottom: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkbox: {
    fontSize: 18,
    marginRight: 10,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  dropdownContainer: {
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 16,
  },
  stepContent: {
    marginTop: 10,
  },
  stepDescription: {
    fontSize: 14,
    color: '#333',
  },
  cookCount: {
    fontSize: 14,
    marginBottom: 10,
    color: '#000',
  },
  ingredientCount: {
    fontSize: 14,
    marginBottom: 20,
    color: '#000',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FF6F00',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  icon: {
    width: 24,
    height: 24,
  },
  headerContainer: {
    paddingBottom: 80, // Space for navbar
  },
  imageContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'flex-start',
  },
  recipeDetails: {
    marginLeft: 20,
    flex: 1,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
});

export default CookScreen;

*/