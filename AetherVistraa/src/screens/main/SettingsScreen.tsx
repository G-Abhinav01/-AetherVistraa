import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Text, Switch, List, Divider, RadioButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { useAppSettings } from '../../hooks/useAppSettings';
import { Language } from '../../types';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface LanguageOption {
  value: Language;
  label: string;
}

const languages: LanguageOption[] = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'हिंदी (Hindi)' },
  { value: 'telugu', label: 'తెలుగు (Telugu)' },
  { value: 'tamil', label: 'தமிழ் (Tamil)' },
  { value: 'kannada', label: 'ಕನ್ನಡ (Kannada)' },
  { value: 'bengali', label: 'বাংলা (Bengali)' },
  { value: 'japanese', label: '日本語 (Japanese)' },
  { value: 'korean', label: '한국어 (Korean)' },
  { value: 'mandarin', label: '普通话 (Mandarin)' },
];

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { settings, toggleDarkMode, setLanguage, setShowDisclaimer } = useAppSettings();
  const theme = useTheme();
  const styles = makeStyles(theme);

  const openReadme = () => {
    Linking.openURL('https://github.com/yourusername/AetherVistraa/blob/main/README.md');
  };

  const openLegalNotices = () => {
    // This would typically open a screen with legal information
    // For now, we'll just show the disclaimer again
    setShowDisclaimer(true);
    navigation.navigate('Disclaimer');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <List.Item
            title="Dark Mode"
            description="Use dark theme throughout the app"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={props => (
              <Switch
                value={settings.darkMode}
                onValueChange={toggleDarkMode}
                color={theme.colors.primary}
              />
            )}
            titleStyle={styles.listItemTitle}
            descriptionStyle={styles.listItemDescription}
          />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <RadioButton.Group
            onValueChange={value => setLanguage(value as Language)}
            value={settings.language}
          >
            {languages.map((lang, index) => (
              <React.Fragment key={lang.value}>
                <List.Item
                  title={lang.label}
                  left={props => <List.Icon {...props} icon="translate" />}
                  right={props => (
                    <RadioButton
                      value={lang.value}
                      color={theme.colors.primary}
                    />
                  )}
                  onPress={() => setLanguage(lang.value)}
                  titleStyle={styles.listItemTitle}
                />
                {index < languages.length - 1 && <Divider style={styles.itemDivider} />}
              </React.Fragment>
            ))}
          </RadioButton.Group>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <List.Item
            title="Show Disclaimer"
            description="View the app's disclaimer information"
            left={props => <List.Icon {...props} icon="information" />}
            onPress={() => navigation.navigate('Disclaimer')}
            titleStyle={styles.listItemTitle}
            descriptionStyle={styles.listItemDescription}
          />
          <Divider style={styles.itemDivider} />
          <List.Item
            title="Legal Notices"
            description="View legal information and licenses"
            left={props => <List.Icon {...props} icon="file-document" />}
            onPress={openLegalNotices}
            titleStyle={styles.listItemTitle}
            descriptionStyle={styles.listItemDescription}
          />
          <Divider style={styles.itemDivider} />
          <List.Item
            title="README"
            description="View the project documentation"
            left={props => <List.Icon {...props} icon="github" />}
            onPress={openReadme}
            titleStyle={styles.listItemTitle}
            descriptionStyle={styles.listItemDescription}
          />
          <Divider style={styles.itemDivider} />
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="cellphone-information" />}
            titleStyle={styles.listItemTitle}
            descriptionStyle={styles.listItemDescription}
          />
        </View>
      </ScrollView>
    </View>
  );
};

// Define static styles outside the component
const makeStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: 16,
    marginBottom: 8,
  },
  divider: {
    backgroundColor: theme.colors.text,
    opacity: 0.1,
    height: 1,
  },
  itemDivider: {
    backgroundColor: theme.colors.text,
    opacity: 0.05,
    height: 1,
    marginLeft: 72,
  },
  listItemTitle: {
    color: theme.colors.text,
  },
  listItemDescription: {
    color: theme.colors.text,
    opacity: 0.7,
  },
});

export default SettingsScreen;