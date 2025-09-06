import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, RadioButton, Divider, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { Language } from '../../types';
import { useAppSettings } from '../../hooks/useAppSettings';

type LanguageSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LanguageSelection'>;

interface LanguageOption {
  value: Language;
  label: string;
  region: string;
}

const languages: LanguageOption[] = [
  { value: 'english', label: 'English', region: 'India & International' },
  { value: 'hindi', label: 'हिंदी (Hindi)', region: 'India' },
  { value: 'telugu', label: 'తెలుగు (Telugu)', region: 'India' },
  { value: 'tamil', label: 'தமிழ் (Tamil)', region: 'India' },
  { value: 'kannada', label: 'ಕನ್ನಡ (Kannada)', region: 'India' },
  { value: 'bengali', label: 'বাংলা (Bengali)', region: 'India' },
  { value: 'japanese', label: '日本語 (Japanese)', region: 'Japan' },
  { value: 'korean', label: '한국어 (Korean)', region: 'Korea' },
  { value: 'mandarin', label: '普通话 (Mandarin)', region: 'China' },
];

const LanguageSelectionScreen = () => {
  const navigation = useNavigation<LanguageSelectionScreenNavigationProp>();
  const { settings, setLanguage } = useAppSettings();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(settings.language);
  const theme = useTheme();
  const styles = makeStyles(theme);

  const handleContinue = () => {
    // Save the selected language
    setLanguage(selectedLanguage);
    
    // Navigate to disclaimer screen
    navigation.navigate('Disclaimer');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Preferred Language</Text>
      <Text style={styles.subtitle}>Choose the language for phrases and app interface</Text>
      
      <ScrollView style={styles.languageList}>
        <RadioButton.Group
          onValueChange={(value) => setSelectedLanguage(value as Language)}
          value={selectedLanguage}
        >
          {languages.map((lang, index) => (
            <React.Fragment key={lang.value}>
              <View style={styles.languageOption}>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageLabel}>{lang.label}</Text>
                  <Text style={styles.regionLabel}>{lang.region}</Text>
                </View>
                <RadioButton 
                  value={lang.value} 
                  color={theme.colors.primary}
                />
              </View>
              {index < languages.length - 1 && <Divider style={styles.divider} />}
            </React.Fragment>
          ))}
        </RadioButton.Group>
      </ScrollView>
      
      <Button
        mode="contained"
        onPress={handleContinue}
        style={styles.continueButton}
        labelStyle={styles.buttonLabel}
      >
        Continue
      </Button>
    </View>
  );
};

// Define static styles outside the component
const makeStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 24,
    opacity: 0.8,
  },
  languageList: {
    flex: 1,
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  languageInfo: {
    flex: 1,
  },
  languageLabel: {
    fontSize: 18,
    color: theme.colors.text,
  },
  regionLabel: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.6,
    marginTop: 4,
  },
  divider: {
    backgroundColor: theme.colors.text,
    opacity: 0.1,
  },
  continueButton: {
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
});

export default LanguageSelectionScreen;