import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, Language } from '../types';

const SETTINGS_STORAGE_KEY = 'app_settings';

// Default settings
const defaultSettings: AppSettings = {
  language: 'english',
  darkMode: true, // Dark theme by default as per requirements
  showDisclaimer: true,
};

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from storage
  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error loading settings:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Load settings from storage on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Save settings to storage whenever they change
  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Update language setting
  const setLanguage = (language: Language) => {
    saveSettings({ ...settings, language });
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    saveSettings({ ...settings, darkMode: !settings.darkMode });
  };

  // Toggle disclaimer visibility
  const setShowDisclaimer = (show: boolean) => {
    saveSettings({ ...settings, showDisclaimer: show });
  };

  return {
    settings,
    isLoading,
    loadSettings,
    setLanguage,
    toggleDarkMode,
    setShowDisclaimer,
  };
};