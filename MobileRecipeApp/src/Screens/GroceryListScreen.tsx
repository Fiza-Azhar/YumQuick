//========================before Expense generator==================
// GroceryListScreen.tsx
/*
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/ParamList'; // Adjust path
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';
import { Recipe } from '../Services/recipeSlice'; // Adjust path if necessary
import { useNavigation, NavigationProp } from '@react-navigation/native';
import config from '../config';

const homeIcon = require('../Assets/hw.png');
const addIcon = require('../Assets/add.png');
const listIcon = require('../Assets/List.png');
const heartIcon = require('../Assets/Heart.png');
const cartIcon = require('../Assets/cw.png');
const searchIcon = require('../Assets/search.png');

type GroceryListScreenRouteProp = RouteProp<RootStackParamList, 'GroceryListScreen'>;
type Props = {
  route: GroceryListScreenRouteProp;
};
interface GroceryItem {
  name: string;
  quantity: number;
  unit: string;
}

const GroceryListScreen: React.FC<Props> = ({route}) => {
  const {username, email, profilePhoto, uid} = route.params;
const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { selectedRecipes, servings } = route.params;
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  
  const recipes = useSelector((state: RootState) => state.recipes.recipes);

  useEffect(() => {
    const generateGroceryList = (selectedRecipes: string[], servings: number): GroceryItem[] => {
      const ingredientsMap: { [key: string]: { quantity: number; unit: string } } = {};

      selectedRecipes.forEach(recipeId => {
        const recipe = recipes.find((r: Recipe) => r._id === recipeId);
        if (recipe) {
          recipe.ingredients.forEach(ingredient => {
            if (ingredientsMap[ingredient.item]) {
              ingredientsMap[ingredient.item].quantity += ingredient.quantity * servings;
            } else {
              ingredientsMap[ingredient.item] = {
                quantity: ingredient.quantity * servings,
                unit: ingredient.unit
              };
            }
          });
        }
      });

      return Object.keys(ingredientsMap).map(name => ({
        name,
        quantity: ingredientsMap[name].quantity,
        unit: ingredientsMap[name].unit
      }));
    };

    const list = generateGroceryList(selectedRecipes, servings);
    console.log('Generated Grocery List:', list); // Debugging
    setGroceryList(list);
  }, [selectedRecipes, servings, recipes]);

  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <Text style={styles.headerTitle}>Grocery</Text>
      </View>
      <FlatList
        data={groceryList}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>{item.quantity.toFixed(2)} {item.unit}</Text>
          </View>
        )}
        keyExtractor={(item) => item.name}
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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  itemName: {
    fontSize: 16,
    color: '#000',
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
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

export default GroceryListScreen;
*/


//==================tried=============
/*
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/ParamList';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';
import { Recipe } from '../Services/recipeSlice';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import config from '../config';

const homeIcon = require('../Assets/hw.png');
const addIcon = require('../Assets/add.png');
const listIcon = require('../Assets/List.png');
const heartIcon = require('../Assets/Heart.png');
const cartIcon = require('../Assets/cw.png');

type GroceryListScreenRouteProp = RouteProp<RootStackParamList, 'GroceryListScreen'>;

type Props = {
  route: GroceryListScreenRouteProp;
};

interface GroceryItem {
  name: string;
  quantity: number;
  unit: string;
}

const GroceryListScreen: React.FC<Props> = ({ route }) => {
  const { username, email, profilePhoto, uid } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { selectedRecipes, servings } = route.params;
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  const recipes = useSelector((state: RootState) => state.recipes.recipes);

  useEffect(() => {
    const generateGroceryList = (selectedRecipes: string[], servings: number): GroceryItem[] => {
      const ingredientsMap: { [key: string]: { quantity: number; unit: string } } = {};

      selectedRecipes.forEach(recipeId => {
        const recipe = recipes.find((r: Recipe) => r._id === recipeId);
        if (recipe) {
          recipe.ingredients.forEach(ingredient => {
            if (ingredientsMap[ingredient.item]) {
              ingredientsMap[ingredient.item].quantity += ingredient.quantity * servings;
            } else {
              ingredientsMap[ingredient.item] = {
                quantity: ingredient.quantity * servings,
                unit: ingredient.unit
              };
            }
          });
        }
      });

      return Object.keys(ingredientsMap).map(name => ({
        name,
        quantity: ingredientsMap[name].quantity,
        unit: ingredientsMap[name].unit
      }));
    };

    const list = generateGroceryList(selectedRecipes, servings);
    setGroceryList(list);

    fetchUserIdByEmail();
  }, [selectedRecipes, servings, recipes]);

  const calculateTotalPrice = () => {
    return selectedRecipes.reduce((total, id) => {
      const recipe = recipes.find((r) => r._id === id);
      return recipe ? total + recipe.price : total;
    }, 0);
  };

  const fetchUserIdByEmail = async () => {
    try {
      const response = await fetch(`${config.wallet}/api/user/getUserByEmail/${email}`);
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error fetching user details');
        Alert.alert('Error', errorData.message || 'Error fetching user details');
        return;
      }
      const data = await response.json();
      //setUserId(data.user._id);
      setUserId('66d02a87510a31ec67e242de');

      Alert.alert(`User ID fetched: ${data.user._id}`);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setErrorMessage('Failed to fetch user details. Please try again later.');
      Alert.alert('Error', 'Failed to fetch user details. Please try again later.');
    }
  };

  const createExpense = async () => {
    const totalPrice = calculateTotalPrice();
    const expenseData = {
      payer: userId,
      amount: totalPrice,
      description: "Grocery Expense",
      type: "individual",
      relatedUser: userId,
      pictures: ""
    };

    try {
      const response = await fetch(`${config.wallet}/api/expense/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error creating expense');
        Alert.alert('Error', errorData.message || 'Error creating expense');
        return;
      }

      const data = await response.json();
      Alert.alert('Success', 'Expense created successfully!');
      await updateWalletBalance(totalPrice);
      console.log('Expense created successfully:', data);
    } catch (error) {
      console.error('Error creating expense:', error);
      setErrorMessage('Failed to create expense. Please try again later.');
      Alert.alert('Error', 'Failed to create expense. Please try again later.');
    }
  };

  const handleBuy = async () => {
    try {
      const response = await fetch(`${config.wallet}/api/wallet/getWalletByUserId/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const amount = data.wallet.balance;
      const numericAmount = Number(amount);

      if (isNaN(numericAmount)) {
        Alert.alert('Invalid amount');
        return;
      }

      const totalPrice = calculateTotalPrice();
      if (numericAmount >= totalPrice) {
        await createExpense(); // Create expense when purchase is successful
        setWalletBalance(numericAmount - totalPrice);
        Alert.alert("Purchase successful!", `Amount deducted: ${totalPrice.toFixed(2)} PKR`);
      } else {
        Alert.alert('Insufficient balance');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('An error occurred while processing your request.');
    }
  };

  const handleWallet = async () => {
    try {
      const response = await fetch(`${config.wallet}/api/wallet/getWalletByUserId/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const amount = data.wallet.balance;
      const numericAmount = Number(amount);

      if (isNaN(numericAmount)) {
        Alert.alert('Invalid amount');
        return;
      }

      setWalletBalance(numericAmount);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('An error occurred while processing your request.');
    }
  };

  useEffect(() => {
    handleWallet(); // Call handleWallet on component mount
  }, [userId]);

  const updateWalletBalance = async (balance: number) => {
    try {
      const response = await fetch(`${config.wallet}/api/wallet/updateWallet`, {
        method: 'PUT', // Change to PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, balance }), // Include id and balance in the body
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Error updating wallet balance');
        return;
      }
  
      // Optionally refresh wallet balance in state here
      handleWallet(); // Refresh the wallet balance from the backend
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      Alert.alert('Error', 'Failed to update wallet balance. Please try again later.');
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Grocery</Text>
      </View>
      {walletBalance !== null && (
        <Text style={styles.itemQuantity}>Wallet Balance: {walletBalance.toFixed(2)} PKR</Text>
      )}
      <FlatList
        data={groceryList}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>{item.quantity.toFixed(2)} {item.unit}</Text>
          </View>
        )}
        keyExtractor={(item) => item.name}
      />
      <Text style={styles.totalPrice}>Total Price: {calculateTotalPrice().toFixed(2)} PKR</Text>
      <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
        <Text style={styles.buyButtonText}>Buy</Text>
      </TouchableOpacity>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('MenuScreen', { username, email, profilePhoto, uid })}>
          <Image source={homeIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AddRecipeScreen', { username, email, profilePhoto, uid })}>
          <Image source={addIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MyRecipesScreen', { username, email, profilePhoto, uid })}>
          <Image source={listIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('FavRecipesScreen', { username, email, profilePhoto, uid })}>
          <Image source={heartIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('GroceryRecipesScreen', { username, email, profilePhoto, uid })}>
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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    color: '#000',
    borderBottomColor: '#ccc',
  },
  itemName: {
    fontSize: 16,
    color: '#000',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#000',
  },
  totalPrice: {
    padding: 10,
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  buyButton: {
    backgroundColor: '#FFAB00',
    padding: 15,
    borderRadius: 5,
    margin: 10,
  },
  buyButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#FFAB00',
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default GroceryListScreen;
*/


import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/ParamList'; // Adjust path
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';
import { Recipe } from '../Services/recipeSlice'; // Adjust path if necessary
import { useNavigation, NavigationProp } from '@react-navigation/native';
import config from '../config';

const homeIcon = require('../Assets/hw.png');
const addIcon = require('../Assets/add.png');
const listIcon = require('../Assets/List.png');
const heartIcon = require('../Assets/Heart.png');
const cartIcon = require('../Assets/cw.png');
const searchIcon = require('../Assets/search.png');

type GroceryListScreenRouteProp = RouteProp<RootStackParamList, 'GroceryListScreen'>;
type Props = {
  route: GroceryListScreenRouteProp;
};
interface GroceryItem {
  name: string;
  quantity: number;
  unit: string;
}

const GroceryListScreen: React.FC<Props> = ({route}) => {

  const [err, setErr] = useState('');
  const [userId, setUserId] = useState<string | null>(null); // State to store user _id
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {username, email, profilePhoto, uid} = route.params;
const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { selectedRecipes, servings } = route.params;
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [walletBalance, setWalletBalance] = useState<number | null>(null); // State to store wallet balance
  const [walletCurrency, setWalletCurrency] = useState<string | null>(null);

  
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  useEffect(() => {
    const generateGroceryList = (selectedRecipes: string[], servings: number): GroceryItem[] => {
      const ingredientsMap: { [key: string]: { quantity: number; unit: string } } = {};

      selectedRecipes.forEach(recipeId => {
        const recipe = recipes.find((r: Recipe) => r._id === recipeId);
        if (recipe) {
          recipe.ingredients.forEach(ingredient => {
            if (ingredientsMap[ingredient.item]) {
              ingredientsMap[ingredient.item].quantity += ingredient.quantity * servings;
            } else {
              ingredientsMap[ingredient.item] = {
                quantity: ingredient.quantity * servings,
                unit: ingredient.unit
              };
            }
          });
        }
      });

      return Object.keys(ingredientsMap).map(name => ({
        name,
        quantity: ingredientsMap[name].quantity,
        unit: ingredientsMap[name].unit
      }));
    };

    const list = generateGroceryList(selectedRecipes, servings);
    console.log('Generated Grocery List:', list); // Debugging
    setGroceryList(list);
  }, [selectedRecipes, servings, recipes]);

  const fetchUserIdByEmail = async () => {
    try {
      setErr(email || '');
      if (!email) {
        Alert.alert('Error', 'No email found.');
        return;
      }

      //Alert.alert(email: ${email});
      const response = await fetch(`${config.wallet}/api/user/getUserByEmail/${email}`);
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error fetching user details');
        Alert.alert('Error', errorData.message || 'Error fetching user details');
        return;
      }

      const data = await response.json();
      //setUserId(data.user._id);
      setUserId('66d02a87510a31ec67e242de');
    } catch (error) {
      console.error('Error fetching user details:', error);
      setErrorMessage('Failed to fetch user details. Please try again later.');
      Alert.alert('Error', 'Failed to fetch user details. Please try again later.');
    }
  };

  const calculateTotalPrice = () => {
    return selectedRecipes.reduce((total, id) => {
      const recipe = recipes.find((r) => r._id === id);
      return recipe ? total + recipe.price : total;
    }, 0);
  };

  const fetchWalletByUserId = async (userId: string) => {
    try {
      const response = await fetch(`${config.wallet}/api/wallet/getWalletByUserId/${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error fetching wallet details');
        Alert.alert('Error', errorData.message || 'Error fetching wallet details');
        return;
      }

      const data = await response.json();
      setWalletBalance(data.wallet.balance);
      setWalletCurrency(data.wallet.currency);
    } catch (error) {
      console.error('Error fetching wallet details:', error);
      setErrorMessage('Failed to fetch wallet details. Please try again later.');
      Alert.alert('Error', 'Failed to fetch wallet details. Please try again later.');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWalletByUserId(userId); // Fetch wallet data when user ID is available
    }
  }, [userId]);

  const createExpense = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Cannot create expense.');
      return;
    }

    const expenseData = {
      payer: userId,
      amount: totalPrice,
      description: "Grocery Expense",
      type: "individual",
      relatedUser: userId,
      pictures: ""
    };

    try {
      const response = await fetch(`${config.wallet}/api/expense/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error creating expense');
        Alert.alert('Error', errorData.message || 'Error creating expense');
        return;
      }

      const data = await response.json();
      Alert.alert('Success', 'Expense created successfully!');
      console.log('Expense created successfully:', data);
    } catch (error) {
      console.error('Error creating expense:', error);
      setErrorMessage('Failed to create expense. Please try again later.');
      Alert.alert('Error', 'Failed to create expense. Please try again later.');
    }
  };

  const handleAddToWallet = async () => {
    await fetchUserIdByEmail(); // Fetch the user ID first
    if (userId) {
      createExpense(); // Only create the expense if the user ID is available
      fetchWalletByUserId(userId);
    }
  };

  const totalPrice = calculateTotalPrice();
  //const groceryList = getGroceryList();

  useEffect(() => {
    fetchUserIdByEmail(); // Fetch the user ID when the component mounts
  }, []);

  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <Text style={styles.headerTitle}>Grocery</Text>
      </View>
      {walletBalance !== null && (
        <Text style={styles.balance}>Wallet Balance: {walletBalance.toFixed(2)} PKR</Text>
      )}
      <FlatList
        data={groceryList}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>{item.quantity.toFixed(2)} {item.unit}</Text>
          </View>
        )}
        keyExtractor={(item) => item.name}
      />
       <Text style={styles.totalPrice}>Total Price: {totalPrice.toFixed(2)}</Text>
       <TouchableOpacity onPress={handleAddToWallet} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add to Wallet</Text>
        </TouchableOpacity>
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
      totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        marginVertical: 20,
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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  itemName: {
    fontSize: 16,
    color: '#000',
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
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
  addButton: {
    backgroundColor: '#FF6F00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  balance: {
    color: '#000',
    fontSize: 18,
    marginLeft: 50,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default GroceryListScreen;