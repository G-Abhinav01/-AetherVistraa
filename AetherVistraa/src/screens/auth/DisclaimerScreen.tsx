import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Checkbox, Portal, Dialog } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { darkTheme } from '../../constants/theme';
import { useAppSettings } from '../../hooks/useAppSettings';

type DisclaimerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Disclaimer'>;

const DisclaimerScreen = () => {
  const navigation = useNavigation<DisclaimerScreenNavigationProp>();
  const { settings, setShowDisclaimer } = useAppSettings();
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(true);

  const handleContinue = () => {
    // Save the user's preference for showing the disclaimer
    if (dontShowAgain) {
      setShowDisclaimer(false);
    }
    
    // Close the dialog
    setDialogVisible(false);
    
    // Navigate to the main screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog
          visible={dialogVisible}
          dismissable={false}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.title}>Welcome to AetherVistraa</Dialog.Title>
          
          <Dialog.ScrollArea style={styles.scrollArea}>
            <ScrollView>
              <Text style={styles.disclaimerText}>
                AetherVistraa is an accessibility application designed to help differently abled individuals communicate through facial movements.
              </Text>
              
              <Text style={styles.disclaimerText}>
                <Text style={styles.bold}>How it works:</Text>{"\n"}
                • Use your mouth to cycle through phrases{"\n"}
                • Open your mouth to move to the next phrase{"\n"}
                • Close your mouth to stop at a phrase{"\n"}
                • Blink your eyes to select and speak the phrase
              </Text>
              
              <Text style={styles.disclaimerText}>
                <Text style={styles.bold}>Important Notes:</Text>{"\n"}
                • This app requires camera access to detect facial movements{"\n"}
                • Your privacy is important - no facial data is stored or transmitted{"\n"}
                • For best results, use in well-lit environments{"\n"}
                • The app works best when your face is clearly visible to the camera
              </Text>
              
              <Text style={styles.disclaimerText}>
                <Text style={styles.bold}>Customization:</Text>{"\n"}
                You can customize phrases, change language preferences, and adjust settings through the app's interface.
              </Text>
            </ScrollView>
          </Dialog.ScrollArea>
          
          <Dialog.Actions>
            <View style={styles.actionsContainer}>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={dontShowAgain ? 'checked' : 'unchecked'}
                  onPress={() => setDontShowAgain(!dontShowAgain)}
                  color={darkTheme.colors.primary}
                />
                <Text style={styles.checkboxLabel}>Don't show this again</Text>
              </View>
              
              <Button
                mode="contained"
                onPress={handleContinue}
                style={styles.continueButton}
              >
                Continue
              </Button>
            </View>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: 12,
    padding: 8,
  },
  title: {
    color: darkTheme.colors.text,
    fontSize: 22,
    textAlign: 'center',
  },
  scrollArea: {
    maxHeight: 400,
  },
  disclaimerText: {
    color: darkTheme.colors.text,
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
  actionsContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  checkboxLabel: {
    color: darkTheme.colors.text,
    marginLeft: 8,
  },
  continueButton: {
    width: '100%',
    borderRadius: 8,
  },
});

export default DisclaimerScreen;