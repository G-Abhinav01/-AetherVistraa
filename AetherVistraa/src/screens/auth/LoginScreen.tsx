import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { signIn } from '../../utils/auth';
import { AuthProvider } from '../../types';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const styles = makeStyles(theme);

  const handleLogin = async (provider: AuthProvider) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const user = await signIn(provider);
      
      if (user) {
        // Navigate to language selection screen on successful login
        navigation.navigate('LanguageSelection');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.appName}>AetherVistraa</Text>
        <Text style={styles.tagline}>Communicate with your eyes and mouth</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          icon="google"
          onPress={() => handleLogin('google')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          disabled={isLoading}
        >
          Sign in with Google
        </Button>

        <Button
          mode="contained"
          icon="whatsapp"
          onPress={() => handleLogin('whatsapp')}
          style={[styles.button, styles.whatsappButton]}
          labelStyle={styles.buttonLabel}
          disabled={isLoading}
        >
          Sign in with WhatsApp
        </Button>

        {isLoading && (
          <ActivityIndicator 
            size="large" 
            color={theme.colors.primary} 
            style={styles.loader} 
          />
        )}

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          An accessibility app for differently abled individuals
        </Text>
      </View>
    </View>
  );
};

// Define static styles outside the component
const makeStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    marginVertical: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: theme.colors.error,
    marginTop: 20,
    textAlign: 'center',
  },
  footer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.text,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LoginScreen;