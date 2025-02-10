//===========before offline adding and syncing=============
/*
import {
  View,Text,TextInput,Modal,Button,ScrollView,Alert,StyleSheet,ActivityIndicator,PermissionsAndroid,Platform,TouchableOpacity,Image,Switch,} from 'react-native';
import React, { useEffect, useState } from 'react';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import {useAppDispatch} from '../Store/store';
import {addRecipe} from '../Services/recipeSlice';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../Navigation/ParamList';
import config from '../config';
import {useToast} from 'react-native-toast-notifications';
import PushNotification from 'react-native-push-notification';
import {showMessage} from 'react-native-flash-message';
import RNPickerSelect from 'react-native-picker-select';
import { io } from 'socket.io-client';


const SOCKET_URL = 'http://192.168.16.123:5000'; // Update with your server URL
const socket = io(SOCKET_URL, {
  transports: ['websocket'],
});

const categoryOptions = [
  'Snacks',
  'Meal',
  'Vegans',
  'Dessert',
  'Drinks'
];
const commonIngredients = [
  { label: 'Salt', value: 'Salt' },
  { label: 'Egg', value: 'Egg' },
  { label: 'Flour', value: 'Flour' },
  { label: 'Chilli', value: 'Chilli' },
  { label: 'Tomato', value: 'Tomato' },
  { label: 'Onion', value: 'Onion' },
  { label: 'Oil', value: 'Oil' },
  { label: 'Water', value: 'Water' },
  { label: 'Rice', value: 'Rice' },
  { label: 'Chicken', value: 'Chicken' },
  { label: 'Meat', value: 'Meat' },
];

const units = [
  { label: 'Cup', value: 'Cup' },
  { label: 'Teaspoon', value: 'Teaspoon' },
  { label: 'Tablespoon', value: 'Tablespoon' },
  { label: 'KG', value: 'KG' },
  { label: 'Grams', value: 'Grams' },
];

const cartIcon = require('../Assets/cw.png');
const homeIcon = require('../Assets/hw.png');
const heartIcon = require('../Assets/Heart.png');
const addIcon = require('../Assets/add.png');
const listIcon = require('../Assets/List.png');

interface Ingredient {
  item: string;
  quantity: number;
  unit: string;
}

interface Step {
  step: string;
  des: string;
}
type AddRecipeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddRecipeScreen'
>;
type AddRecipeRouteProp = RouteProp<RootStackParamList, 'AddRecipeScreen'>;
type Props = {
  route: AddRecipeRouteProp;
};
const AddRecipeScreen: React.FC<Props> = ({route}) => {
  const toast = useToast();
  const { username, email: emailObj, profilePhoto,uid } = route.params;

  // Extract email from the object if necessary
  const email = typeof emailObj === 'object' ? emailObj.email : emailObj;
  //const {username, email, profilePhoto} = route.params;

  const [name, setName] = useState<string>('');
  const [size, setSize] = useState<number>(5);
  const [steps, setSteps] = useState<Step[]>([{step: '', des: ''}]);
  const [image, setImage] = useState<Asset | null>(null);
  const [imageUri, setImageUri] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {item: '', quantity: 1, unit: ''},
  ]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [isPublic, setIsPublic] = useState(true);

  const dispatch = useAppDispatch();
  const navigation = useNavigation<AddRecipeScreenNavigationProp>();

  useEffect(() => {
    // Set up the socket event listener
    socket.on('recipe-added', (recipe: any) => {
      console.log('Recipe added:', recipe);
      showMessage({
        message: `Recipe Successfully Added`,
        description: `Check your list for updates`,
        type: 'info',
        backgroundColor: '#006400', // Customize background color
        color: 'white', // Customize text color
      });
    });
  
    // Cleanup function to remove the event listener
    return () => {
      socket.off('recipe-added');
    };
  }, []);

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
    return true; // No need to request permission on iOS
  };
  const handleSizeChange = (value: string) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) setSize(parsed);
  };

  const handleCategoryChange = (text: string) => setCategory(text);
  const handleNameChange = (text: string) => setName(text);

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string | number,
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {...newIngredients[index], [field]: value};
    setIngredients(newIngredients);
  };

  const handleStepChange = (
    index: number,
    field: keyof Step,
    value: string,
  ) => {
    const newSteps = [...steps];
    newSteps[index] = {...newSteps[index], [field]: value};
    setSteps(newSteps);
  };

  const handleImagePick = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'You need to grant storage permissions to pick an image.',
      );
      return;
    }

    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setImage(selectedImage);
        setImageUri(selectedImage.uri || '');
      } else {
        Alert.alert('No image selected');
      }
    });
  };

  const uploadImage = async () => {
    if (!image) throw new Error('No image selected');

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image.uri ?? '',
        type: image.type ?? 'image/jpeg',
        name: image.fileName ?? 'image.jpg',
      } as any);

      //const response = await fetch('http://192.168.16.148:5000/upload', {
      const response = await fetch(config.upload, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Image upload failed');

      const data = await response.json();
      return data.filePath;
    } catch (error) {
      console.error('Image upload failed:', error);
      Alert.alert('Error', 'Failed to upload image');
      throw error;
    }
  };
  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a recipe name.');
      return;
    }

    if (steps.some(step => !step.step.trim() || !step.des.trim())) {
      Alert.alert(
        'Validation Error',
        'Please complete all steps with valid descriptions.',
      );
      return;
    }

    if (size <= 0) {
      Alert.alert(
        'Validation Error',
        'Enter a valid serving size greater than zero.',
      );
      return;
    }

    setLoading(true);

    try {
      let uploadedImageUrl = '';
      if (image) {
        uploadedImageUrl = await uploadImage();
      }
      const recipe = {
        email,
        name,
        size,
        ingredients,
        steps,
        category,
        image: uploadedImageUrl,
        public: isPublic,
      };

      dispatch(addRecipe(recipe));
      //Alert.alert('Success', 'Recipe added successfully!');
      socket.emit('recipe-added', recipe.name);
if(isPublic){
      PushNotification.configure({
        onRegister: function (token) {
          console.log('TOKEN:', token);
        },
        onNotification: function (notification) {
          console.log('NOTIFICATION:', notification);
        },
        requestPermissions: Platform.OS === 'ios',
      });

      PushNotification.checkPermissions((permissions) => {
        console.log('Notification permissions:', permissions);
        if (!permissions.alert) {
          PushNotification.requestPermissions();
        }
      });

      PushNotification.localNotification({
        channelId: 'recipe-channel6', // Ensure this matches the channel ID used in creation
        title: 'Public Recipe Added',
        message: 'Check your list for updates',
      });
    }
      setName('');
      setSize(5);
      setIngredients([{item: '', quantity: 1, unit: ''}]);
      setSteps([{step: '', des: ''}]);
      setCategory('');
      setImage(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to add recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const renderCategoryOptions = () => {
    return categoryOptions.map(option => (
      <TouchableOpacity
        key={option}
        style={styles.option}
        onPress={() => {
          setCategory(option);
          setModalVisible(false);
        }}
      >
        <Text style={styles.optionText}>{option}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {loading && <ActivityIndicator size="large" color="#FF6F00" />}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Recipe</Text>
        </View>
    

        <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.inputText}>{category || 'Select Category'}</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {renderCategoryOptions()}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



        <TextInput
          style={styles.input}
          placeholder="Recipe Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={handleNameChange}
        />
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() => setSize(prevSize => Math.max(prevSize - 5, 5))}
            style={styles.sizeButton}>
            <Text style={styles.sizeButtonText}>-5</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.servingInput}
            placeholder="Serving Size"
            placeholderTextColor="#aaa"
            value={size.toString()}
            onChangeText={handleSizeChange}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() => setSize(prevSize => prevSize + 5)}
            style={styles.sizeButton}>
            <Text style={styles.sizeButtonText}>+5</Text>
          </TouchableOpacity>
        </View>
        
        {ingredients.map((ing, index) => (
          <View key={index} style={styles.ingredientContainer}>
            <TextInput
              style={styles.ingredientInput}
              placeholder={`Ingredient ${index + 1}`}
              placeholderTextColor="#aaa"
              value={ing.item}
              onChangeText={text => handleIngredientChange(index, 'item', text)}
            />
            <TextInput
              style={styles.ingredientInput}
              placeholder={`Quantity ${index + 1}`}
              placeholderTextColor="#aaa"
              value={ing.quantity.toString()}
              onChangeText={text =>
                handleIngredientChange(index, 'quantity', parseInt(text, 10))
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.ingredientInput}
              placeholder={`Unit ${index + 1}`}
              placeholderTextColor="#aaa"
              value={ing.unit}
              onChangeText={text => handleIngredientChange(index, 'unit', text)}
            />
            <TouchableOpacity
              onPress={() => removeIngredient(index)}
              style={styles.removeButton}>
              <Text style={styles.removeText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          onPress={() =>
            setIngredients([...ingredients, {item: '', quantity: 1, unit: ''}])
          }
          style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Ingredient</Text>
        </TouchableOpacity>
        <View>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <TextInput
                style={[styles.stepInput, styles.stepRow]}
                placeholder={`Step ${index + 1}`}
                placeholderTextColor="#aaa"
                value={step.step}
                onChangeText={text => handleStepChange(index, 'step', text)}
              />
              <TextInput
                style={[styles.stepInput, styles.stepRow]}
                placeholder={`Details for Step ${index + 1}`}
                placeholderTextColor="#aaa"
                value={step.des}
                onChangeText={text => handleStepChange(index, 'des', text)}
              />
              <TouchableOpacity
                onPress={() => removeStep(index)}
                style={styles.removeButton}>
                <Text style={styles.removeText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            onPress={() => setSteps([...steps, {step: '', des: ''}])}
            style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Step</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>Pick an Image</Text>
        </TouchableOpacity>
        {imageUri ? (
          <Image source={{uri: imageUri}} style={styles.imagePreview} />
        ) : null}

 <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Public</Text>
          <Switch
            value={isPublic}
            onValueChange={(value) => setIsPublic(value)}
          />
        </View>
        <TouchableOpacity onPress={handleSubmit} style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>Add Recipe</Text>
        </TouchableOpacity>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepRow: {
    marginBottom: 10, // Adjust spacing between rows
  },
  scrollViewContent: {
    paddingBottom: 70, // Adjust bottom padding to prevent overlap with navbar
  },
  header: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#FF6F00",
    marginBottom: 20,
    borderRadius: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 3,
  },
  servingInput: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    textAlign: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sizeButton: {
    backgroundColor: "#FF6F00",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  sizeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  ingredientContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ingredientInput: {
 
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    fontSize: 14,
    color: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 3,

  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    color: "#000",
    flex: 1,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 3,
    marginRight: 5,
  },
  removeButton: {
    padding: 10,
    //backgroundColor: '#FF6F00',
    borderRadius: 4,
  },
  removeText: {
    color: '#fff',
    fontSize: 20,
  },
  addButton: {
    backgroundColor: "#FF6F00",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 15,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePicker: {
    backgroundColor: "#FF6F00",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 15,
  },
  imagePickerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreview: {
    width: "60%",
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
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
  icon: {
    width: 24,
    height: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  toggleLabel: {
    fontSize: 18,
    color: '#000',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FF6F00',
    borderRadius: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddRecipeScreen;
*/


import {
  View,Text,TextInput,Modal,Button,ScrollView,Alert,StyleSheet,ActivityIndicator,PermissionsAndroid,Platform,TouchableOpacity,Image,Switch,} from 'react-native';
import React, { useEffect, useState } from 'react';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import {useAppDispatch} from '../Store/store';
import {addRecipe} from '../Services/recipeSlice';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../Navigation/ParamList';
import config from '../config';
import {useToast} from 'react-native-toast-notifications';
import PushNotification from 'react-native-push-notification';
import {showMessage} from 'react-native-flash-message';
import RNPickerSelect from 'react-native-picker-select';
import { io } from 'socket.io-client';
import { useIsConnected } from 'react-native-offline'; // Use useIsConnected instead
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = 'http://192.168.16.123:5000'; // Update with your server URL
const socket = io(SOCKET_URL, {
  transports: ['websocket'],
});

const categoryOptions = [
  'Snacks',
  'Meal',
  'Vegans',
  'Dessert',
  'Drinks'
];
const commonIngredients = [
  { label: 'Salt', value: 'Salt' },
  { label: 'Egg', value: 'Egg' },
  { label: 'Flour', value: 'Flour' },
  { label: 'Chilli', value: 'Chilli' },
  { label: 'Tomato', value: 'Tomato' },
  { label: 'Onion', value: 'Onion' },
  { label: 'Oil', value: 'Oil' },
  { label: 'Water', value: 'Water' },
  { label: 'Rice', value: 'Rice' },
  { label: 'Chicken', value: 'Chicken' },
  { label: 'Meat', value: 'Meat' },
];

const units = [
  { label: 'Cup', value: 'Cup' },
  { label: 'Teaspoon', value: 'Teaspoon' },
  { label: 'Tablespoon', value: 'Tablespoon' },
  { label: 'KG', value: 'KG' },
  { label: 'Grams', value: 'Grams' },
];

const cartIcon = require('../Assets/cw.png');
const homeIcon = require('../Assets/hw.png');
const heartIcon = require('../Assets/Heart.png');
const addIcon = require('../Assets/add.png');
const listIcon = require('../Assets/List.png');

interface Ingredient {
  item: string;
  quantity: number;
  unit: string;
}

interface Step {
  step: string;
  des: string;
}
type AddRecipeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddRecipeScreen'
>;
type AddRecipeRouteProp = RouteProp<RootStackParamList, 'AddRecipeScreen'>;
type Props = {
  route: AddRecipeRouteProp;
};
const AddRecipeScreen: React.FC<Props> = ({route}) => {
  const toast = useToast();
  const { username, email: emailObj, profilePhoto,uid } = route.params;

  // Extract email from the object if necessary
  const email = typeof emailObj === 'object' ? emailObj.email : emailObj;
  //const {username, email, profilePhoto} = route.params;

  const [name, setName] = useState<string>('');
  const [size, setSize] = useState<number>(5);
  const [steps, setSteps] = useState<Step[]>([{step: '', des: ''}]);
  const [image, setImage] = useState<Asset | null>(null);
  const [imageUri, setImageUri] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [price, setPrice] = useState(0);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {item: '', quantity: 1, unit: ''},
  ]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [isPublic, setIsPublic] = useState(true);

  const dispatch = useAppDispatch();
  const navigation = useNavigation<AddRecipeScreenNavigationProp>();
  const isConnected = useIsConnected(); 

  // Sync function to upload offline recipes
  /*
  const syncOfflineRecipes = async () => {
    try {
      const offlineRecipes = await AsyncStorage.getItem('offlineRecipes');
      if (offlineRecipes) {
        const recipes = JSON.parse(offlineRecipes);
        await Promise.all(recipes.map(async (recipe: any) => {
       
          await dispatch(addRecipe(recipe)); // Dispatch each recipe to the store
          socket.emit('recipe-added', recipe.name); // Notify the server
        }));
        await AsyncStorage.removeItem('offlineRecipes'); // Clear offline recipes after sync
        showMessage({
          message: `Synced ${recipes.length} recipe(s) successfully`,
          type: 'success',
          backgroundColor: '#4CAF50',
          color: 'white',
        });
      }
    } catch (error) {
      console.error('Error syncing offline recipes:', error);
      Alert.alert('Error', 'Failed to sync offline recipes.');
    }
  };
*/
const syncOfflineRecipes = async () => {
  try {
    const offlineRecipes = await AsyncStorage.getItem('offlineRecipes');
    if (offlineRecipes) {
      const recipes = JSON.parse(offlineRecipes);
      
      // Iterate over each recipe and upload the image if it's a local URI
      await Promise.all(recipes.map(async (recipe: any) => {
        if (recipe.image && recipe.image.startsWith('file://')) {
          try {
            // Upload the image
            const uploadedImageUrl = await uploadImageFromURI(recipe.image);
            recipe.image = uploadedImageUrl; // Replace with the server URL
          } catch (error) {
            console.error('Failed to upload image for recipe:', recipe.name);
            return; // Skip this recipe if image upload fails
          }
        }
        
        // Now dispatch the updated recipe
        await dispatch(addRecipe(recipe));
        socket.emit('recipe-added', recipe.name); // Notify the server
      }));

      await AsyncStorage.removeItem('offlineRecipes'); // Clear offline recipes after sync
      showMessage({
        message: `Synced ${recipes.length} recipe(s) successfully`,
        type: 'success',
        backgroundColor: '#4CAF50',
        color: 'white',
      });
    }
  } catch (error) {
    console.error('Error syncing offline recipes:', error);
    Alert.alert('Error', 'Failed to sync offline recipes.');
  }
};

// Helper function to upload image from a local URI
const uploadImageFromURI = async (uri: string) => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: uri,
      type: 'image/jpeg',
      name: 'image.jpg',
    } as any);

    const response = await fetch(config.upload, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Image upload failed');
    const data = await response.json();
    return data.filePath; // Return the correct server URL
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};

  useEffect(() => {
    // Set up the socket event listener
    socket.on('recipe-added', (recipe: any) => {
      console.log('Recipe added:', recipe);
      showMessage({
        message: `Recipe Successfully Added`,
        description: `Check your list for updates`,
        type: 'info',
        backgroundColor: '#006400', // Customize background color
        color: 'white', // Customize text color
      });
    });
     // Sync recipes when coming back online
     if (isConnected) {
      syncOfflineRecipes();
    }
    // Cleanup function to remove the event listener
    return () => {
      socket.off('recipe-added');
    };
  }, [isConnected]);

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
    return true; // No need to request permission on iOS
  };
  const handleSizeChange = (value: string) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) setSize(parsed);
  };

  const handleCategoryChange = (text: string) => setCategory(text);
  const handleNameChange = (text: string) => setName(text);

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string | number,
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {...newIngredients[index], [field]: value};
    setIngredients(newIngredients);
  };

  const handleStepChange = (
    index: number,
    field: keyof Step,
    value: string,
  ) => {
    const newSteps = [...steps];
    newSteps[index] = {...newSteps[index], [field]: value};
    setSteps(newSteps);
  };

  const handleImagePick = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'You need to grant storage permissions to pick an image.',
      );
      return;
    }

    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setImage(selectedImage);
        setImageUri(selectedImage.uri || '');
      } else {
        Alert.alert('No image selected');
      }
    });
  };
  const handlePriceChange = (value: string) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) setPrice(parsed);
  };
  const uploadImage = async () => {
    if (!image) throw new Error('No image selected');

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image.uri ?? '',
        type: image.type ?? 'image/jpeg',
        name: image.fileName ?? 'image.jpg',
      } as any);

      //const response = await fetch('http://192.168.16.148:5000/upload', {
      const response = await fetch(config.upload, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Image upload failed');

      const data = await response.json();
      return data.filePath;
    } catch (error) {
      console.error('Image upload failed:', error);
      Alert.alert('Error', 'Failed to upload image');
      throw error;
    }
  };
  const resetForm = () => {
    setName('');
    setSize(5);
    setIngredients([{ item: '', quantity: 1, unit: '' }]);
    setSteps([{ step: '', des: '' }]);
    setCategory('');
    setImage(null);
  };
  const saveRecipeOffline = async (recipe: any) => {
    try {
      const offlineRecipes = await AsyncStorage.getItem('offlineRecipes');
      const recipes = offlineRecipes ? JSON.parse(offlineRecipes) : [];
      recipes.push(recipe);
      await AsyncStorage.setItem('offlineRecipes', JSON.stringify(recipes));
  
      Alert.alert('Offline Mode', 'Recipe has been saved locally until you are back online.');
    } catch (error) {
      console.error('Error saving recipe offline:', error);
      Alert.alert('Error', 'Failed to save recipe locally.');
    }
  };
  
  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a recipe name.');
      return;
    }

    if (steps.some(step => !step.step.trim() || !step.des.trim())) {
      Alert.alert(
        'Validation Error',
        'Please complete all steps with valid descriptions.',
      );
      return;
    }

    if (size <= 0) {
      Alert.alert(
        'Validation Error',
        'Enter a valid serving size greater than zero.',
      );
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl = '';
      // Only attempt to upload the image if online
      if (isConnected && image) {
          uploadedImageUrl = await uploadImage();
      } else if (!isConnected && image) {
          // Save the image URI for later upload
          uploadedImageUrl = image.uri || ''; // Store image URI for later upload
      }
   /* try {
      let uploadedImageUrl = '';
      if (image) {
        uploadedImageUrl = await uploadImage();
      }*/
      const recipe = {
        email,
        name,
        size,
        price,
        ingredients,
        steps,
        category,
        image: uploadedImageUrl,
        public: isPublic,
      };
  // If offline, save the recipe in local storage or a queue to sync later
  if (!isConnected) {
    // Implement offline storage logic here
    Alert.alert('Offline Mode', 'Recipe will be saved locally until you are online.');
    // Example: saveRecipeOffline(recipe); // Define saveRecipeOffline to handle local storage
    saveRecipeOffline(recipe);
    resetForm(); // Reset fields after saving offline
    return;
  }
      dispatch(addRecipe(recipe));
      //Alert.alert('Success', 'Recipe added successfully!');
      socket.emit('recipe-added', recipe.name);
if(isPublic){
      PushNotification.configure({
        onRegister: function (token) {
          console.log('TOKEN:', token);
        },
        onNotification: function (notification) {
          console.log('NOTIFICATION:', notification);
        },
        requestPermissions: Platform.OS === 'ios',
      });

      PushNotification.checkPermissions((permissions) => {
        console.log('Notification permissions:', permissions);
        if (!permissions.alert) {
          PushNotification.requestPermissions();
        }
      });

      PushNotification.localNotification({
        channelId: 'recipe-channel6', // Ensure this matches the channel ID used in creation
        title: 'Public Recipe Added',
        message: 'Check your list for updates',
      });
    }
      setName('');
      setSize(5);
      setPrice(0);
      setIngredients([{item: '', quantity: 1, unit: ''}]);
      setSteps([{step: '', des: ''}]);
      setCategory('');
      setImage(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to add recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const renderCategoryOptions = () => {
    return categoryOptions.map(option => (
      <TouchableOpacity
        key={option}
        style={styles.option}
        onPress={() => {
          setCategory(option);
          setModalVisible(false);
        }}
      >
        <Text style={styles.optionText}>{option}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {loading && <ActivityIndicator size="large" color="#FF6F00" />}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Recipe</Text>
        </View>
    

        <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.inputText}>{category || 'Select Category'}</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {renderCategoryOptions()}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



        <TextInput
          style={styles.input}
          placeholder="Recipe Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={handleNameChange}
        />
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() => setSize(prevSize => Math.max(prevSize - 5, 5))}
            style={styles.sizeButton}>
            <Text style={styles.sizeButtonText}>-5</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.servingInput}
            placeholder="Serving Size"
            placeholderTextColor="#aaa"
            value={size.toString()}
            onChangeText={handleSizeChange}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() => setSize(prevSize => prevSize + 5)}
            style={styles.sizeButton}>
            <Text style={styles.sizeButtonText}>+5</Text>
          </TouchableOpacity>
        </View>
        <View>
      <TextInput
          style={styles.input}
          placeholder="Recipe Price"
          value={price.toString()}
          onChangeText={handlePriceChange}
          keyboardType="numeric"
        />
      </View>
        {ingredients.map((ing, index) => (
          <View key={index} style={styles.ingredientContainer}>
            <TextInput
              style={styles.ingredientInput}
              placeholder={`Ingredient ${index + 1}`}
              placeholderTextColor="#aaa"
              value={ing.item}
              onChangeText={text => handleIngredientChange(index, 'item', text)}
            />
            <TextInput
              style={styles.ingredientInput}
              placeholder={`Quantity ${index + 1}`}
              placeholderTextColor="#aaa"
              value={ing.quantity.toString()}
              onChangeText={text =>
                handleIngredientChange(index, 'quantity', parseInt(text, 10))
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.ingredientInput}
              placeholder={`Unit ${index + 1}`}
              placeholderTextColor="#aaa"
              value={ing.unit}
              onChangeText={text => handleIngredientChange(index, 'unit', text)}
            />
            <TouchableOpacity
              onPress={() => removeIngredient(index)}
              style={styles.removeButton}>
              <Text style={styles.removeText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          onPress={() =>
            setIngredients([...ingredients, {item: '', quantity: 1, unit: ''}])
          }
          style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Ingredient</Text>
        </TouchableOpacity>
        <View>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <TextInput
                style={[styles.stepInput, styles.stepRow]}
                placeholder={`Step ${index + 1}`}
                placeholderTextColor="#aaa"
                value={step.step}
                onChangeText={text => handleStepChange(index, 'step', text)}
              />
              <TextInput
                style={[styles.stepInput, styles.stepRow]}
                placeholder={`Details for Step ${index + 1}`}
                placeholderTextColor="#aaa"
                value={step.des}
                onChangeText={text => handleStepChange(index, 'des', text)}
              />
              <TouchableOpacity
                onPress={() => removeStep(index)}
                style={styles.removeButton}>
                <Text style={styles.removeText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            onPress={() => setSteps([...steps, {step: '', des: ''}])}
            style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Step</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>Pick an Image</Text>
        </TouchableOpacity>
        {imageUri ? (
          <Image source={{uri: imageUri}} style={styles.imagePreview} />
        ) : null}

 <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Public</Text>
          <Switch
            value={isPublic}
            onValueChange={(value) => setIsPublic(value)}
          />
        </View>
        <TouchableOpacity onPress={handleSubmit} style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>Add Recipe</Text>
        </TouchableOpacity>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepRow: {
    marginBottom: 10, // Adjust spacing between rows
  },
  scrollViewContent: {
    paddingBottom: 70, // Adjust bottom padding to prevent overlap with navbar
  },
  header: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#FF6F00",
    marginBottom: 20,
    borderRadius: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 3,
  },
  servingInput: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    textAlign: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sizeButton: {
    backgroundColor: "#FF6F00",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  sizeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  ingredientContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ingredientInput: {
 
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    fontSize: 14,
    color: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 3,

  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    color: "#000",
    flex: 1,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 3,
    marginRight: 5,
  },
  removeButton: {
    padding: 10,
    //backgroundColor: '#FF6F00',
    borderRadius: 4,
  },
  removeText: {
    color: '#fff',
    fontSize: 20,
  },
  addButton: {
    backgroundColor: "#FF6F00",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 15,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePicker: {
    backgroundColor: "#FF6F00",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 15,
  },
  imagePickerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreview: {
    width: "60%",
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
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
  icon: {
    width: 24,
    height: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  toggleLabel: {
    fontSize: 18,
    color: '#000',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FF6F00',
    borderRadius: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddRecipeScreen;