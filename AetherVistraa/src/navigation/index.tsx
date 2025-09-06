import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';

// Import screens (to be created)
import LoginScreen from '../screens/auth/LoginScreen';
import LanguageSelectionScreen from '../screens/auth/LanguageSelectionScreen';
import DisclaimerScreen from '../screens/auth/DisclaimerScreen';
import HomeScreen from '../screens/main/HomeScreen';
import EditPhrasesScreen from '../screens/main/EditPhrasesScreen';
import SettingsScreen from '../screens/main/SettingsScreen';

// Define the stack navigator param list
export type RootStackParamList = {
  Login: undefined;
  LanguageSelection: undefined;
  Disclaimer: undefined;
  Home: undefined;
  EditPhrases: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const theme = useTheme();
  return (
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="LanguageSelection" 
          component={LanguageSelectionScreen} 
          options={{ title: 'Select Language' }}
        />
        <Stack.Screen 
          name="Disclaimer" 
          component={DisclaimerScreen} 
          options={{ title: 'Disclaimer' }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'AetherVistraa' }}
        />
        <Stack.Screen 
          name="EditPhrases" 
          component={EditPhrasesScreen} 
          options={{ title: 'Edit Phrases' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
  );
};

export default AppNavigator;