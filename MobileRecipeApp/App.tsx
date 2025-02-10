//========before offline ===============
/*
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/Navigation/AppNavigator';
import PushNotification from 'react-native-push-notification';
import { ToastProvider } from 'react-native-toast-notifications';
import FlashMessage from 'react-native-flash-message';
import { store, persistor } from './src/Store/store'; 


const App: React.FC = () => {
  PushNotification.createChannel(
    {
      channelId: 'recipe-channel6', // Unique channel ID
      channelName: 'Recipe Notifications', // Visible channel name
      channelDescription: 'A channel to categorize recipe notifications',
      playSound: true,
      soundName: 'default', // Default sound
      importance: 4, // High importance level
      vibrate: true,
    },
    created => console.log(`CreateChannel returned '${created}'`) 
  );
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
        <ToastProvider>
        <FlashMessage position="bottom" />
          <AppNavigator />
          </ToastProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

*/


import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/Navigation/AppNavigator';
import PushNotification from 'react-native-push-notification';
import { ToastProvider } from 'react-native-toast-notifications';
import FlashMessage from 'react-native-flash-message';
import { store, persistor } from './src/Store/store'; 
import { NetworkProvider  } from 'react-native-offline';

const App: React.FC = () => {
  PushNotification.createChannel(
    {
      channelId: 'recipe-channel6',
      channelName: 'Recipe Notifications',
      channelDescription: 'A channel to categorize recipe notifications',
      playSound: true,
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    created => console.log(`CreateChannel returned '${created}'`) 
  );

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NetworkProvider>
            <ToastProvider>
              <FlashMessage position="bottom" />
              <AppNavigator />
            </ToastProvider>
          </NetworkProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;


