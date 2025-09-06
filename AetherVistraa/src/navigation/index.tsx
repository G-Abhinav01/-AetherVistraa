import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { darkTheme } from '../constants/theme';

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

export const Navigation = () => {
  return (
    <NavigationContainer theme={darkTheme as any}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: darkTheme.colors.surface,
          },
          headerTintColor: darkTheme.colors.text,
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
    </NavigationContainer>
  );
};