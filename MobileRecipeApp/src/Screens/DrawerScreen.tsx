// src/navigation/DrawerScreen.tsx
import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet } from 'react-native';
import MenuScreen from '../Screens/MenuScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: DrawerContentComponentProps & { username: string; email: string; profilePhoto: string; }) => {
  const { username, email, profilePhoto } = props;

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const DrawerScreen = ({ route }: { route: any }) => {
  const { username, profilePhoto, email } = route.params;

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right', // Set the drawer to open from the right
        drawerStyle: {
          width: '75%', // Cover 3/4 of the screen
        },
        headerShown: false,
      }}
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          username={username}
          profilePhoto={profilePhoto}
          email={email}
        />
      )}
    >
      <Drawer.Screen
        name="MenuScreen"
        component={MenuScreen}
        initialParams={{ username, profilePhoto, email }}
      />
     
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    padding: 20,
    alignItems: 'center',
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  username: {
    fontSize: 18,
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: 'gray',
  },
});

export default DrawerScreen;
