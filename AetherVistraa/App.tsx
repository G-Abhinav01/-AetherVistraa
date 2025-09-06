import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation';
import { useTheme } from './src/hooks/useTheme';
import { useAppSettings } from './src/hooks/useAppSettings';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [appTheme, setAppTheme] = useState(darkTheme);
  const { settings, isLoading } = useAppSettings();

  useEffect(() => {
    // Set ready state based on settings loading
    if (!isLoading) {
      setIsReady(true);
    }
  }, [isLoading]);

  useEffect(() => {
    // Update theme when settings change
    if (settings) {
      setAppTheme(settings.darkMode ? darkTheme : lightTheme);
    }
  }, [settings]);

  if (!isReady) {
    return (
      <View style={styles.container}>
        {/* You could add a splash screen or loading indicator here */}
      </View>
    );
  }

  // Configure navigation theme
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: appTheme?.colors?.background || DefaultTheme.colors.background,
      card: appTheme?.colors?.surface || DefaultTheme.colors.card,
      text: appTheme?.colors?.text || DefaultTheme.colors.text,
      primary: appTheme?.colors?.primary || DefaultTheme.colors.primary,
    },
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={appTheme}>
        <NavigationContainer theme={navigationTheme}>
          <AppNavigator />
          <StatusBar style={settings?.darkMode ? 'light' : 'dark'} />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme?.colors?.background || '#121212', // Fallback to dark color
    alignItems: 'center',
    justifyContent: 'center',
  },
});
