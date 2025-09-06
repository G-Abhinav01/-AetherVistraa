import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text, IconButton, Card, BottomNavigation, useTheme } from 'react-native-paper';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { useFaceDetection } from '../../hooks/useFaceDetection';
import { usePhrases } from '../../hooks/usePhrases';
import { useAppSettings } from '../../hooks/useAppSettings';
import { speakPhrase } from '../../utils/speech';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// HomeScreen component definition moved to the bottom of the file

  // Handle mouth open event - start cycling through phrases
  const handleMouthOpen = () => {
    setIsCycling(true);
    // Clear any existing interval
    if (cycleInterval) {
      clearInterval(cycleInterval);
    }
    // Set up a new interval to cycle through phrases
    const interval = setInterval(() => {
      selectNextPhrase();
    }, 1500); // Adjust timing as needed for usability
    setCycleInterval(interval);
  };

  // Handle mouth close event - stop cycling through phrases
  const handleMouthClose = () => {
    setIsCycling(false);
    // Clear the cycling interval
    if (cycleInterval) {
      clearInterval(cycleInterval);
      setCycleInterval(null);
    }
  };

  // Handle blink event - speak the selected phrase
  const handleBlink = () => {
    const selectedPhrase = getSelectedPhrase();
    if (selectedPhrase) {
      speakPhrase(selectedPhrase.text, settings.language);
    }
  };

  // Set up face detection
  const { 
    hasPermission, 
    faceDetected, 
    cameraRef, 
    handleFacesDetected 
  } = useFaceDetection({
    onBlink: handleBlink,
    onMouthOpen: handleMouthOpen,
    onMouthClose: handleMouthClose,
    enabled: activeTab === 'home', // Only enable face detection on home tab
  });

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (cycleInterval) {
        clearInterval(cycleInterval);
      }
    };
  }, [cycleInterval]);

  // Handle bottom navigation
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Navigate to the appropriate screen based on the tab
    switch (tab) {
      case 'edit':
        navigation.navigate('EditPhrases');
        break;
      case 'settings':
        navigation.navigate('Settings');
        break;
      default:
        // Stay on home screen
        break;
    }
  };

  // Render camera permission message if needed
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera access denied. Please enable camera permissions to use this app.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={Camera.Constants.Type.front}
          onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
            minDetectionInterval: 100,
            tracking: true,
          }}
        />
        
        {!faceDetected && (
          <View style={styles.noFaceOverlay}>
            <Text style={styles.noFaceText}>No face detected</Text>
            <Text style={styles.noFaceSubtext}>Please position your face in the camera view</Text>
          </View>
        )}
      </View>

      <View style={styles.phrasesContainer}>
        <Text style={styles.instructionText}>
          {isCycling 
            ? 'Close your mouth to stop' 
            : 'Open your mouth to cycle through phrases'}
        </Text>
        
        <Card style={styles.phraseCard}>
          <Card.Content>
            <Text style={styles.phraseText}>
              {getSelectedPhrase()?.text || 'No phrases available'}
            </Text>
          </Card.Content>
        </Card>
        
        <Text style={styles.blinkInstruction}>
          Blink to speak this phrase
        </Text>
      </View>

      <BottomNavigation
        navigationState={{
          index: ['home', 'edit', 'settings'].indexOf(activeTab),
          routes: [
            { key: 'home', title: 'Home', icon: 'home' },
            { key: 'edit', title: 'Edit', icon: 'pencil' },
            { key: 'settings', title: 'Settings', icon: 'cog' },
          ],
        }}
        onIndexChange={(index) => handleTabChange(['home', 'edit', 'settings'][index])}
        renderScene={() => null}
        barStyle={styles.bottomNav}
      />
    </SafeAreaView>
  );
};

// Define static styles outside the component
const makeStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  cameraContainer: {
    height: '30%',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  camera: {
    flex: 1,
  },
  noFaceOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFaceText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noFaceSubtext: {
    color: '#fff',
    fontSize: 16,
  },
  phrasesContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    color: theme.colors.text,
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  phraseCard: {
    width: '100%',
    padding: 10,
    backgroundColor: theme.colors.surface,
    elevation: 4,
    borderRadius: 12,
  },
  phraseText: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  blinkInstruction: {
    color: theme.colors.text,
    fontSize: 16,
    marginTop: 20,
    opacity: 0.8,
  },
  bottomNav: {
    backgroundColor: theme.colors.surface,
  },
  permissionText: {
    color: theme.colors.text,
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
});

// Initialize styles with theme in the component
const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { settings } = useAppSettings();
  const { 
    phrases, 
    selectedPhraseIndex, 
    selectNextPhrase, 
    getSelectedPhrase 
  } = usePhrases(settings.language);
  const theme = useTheme();
  const styles = makeStyles(theme);
  
  const [isCycling, setIsCycling] = useState(false);
  const [cycleInterval, setCycleInterval] = useState<NodeJS.Timeout | null>(null);
  const [activeTab, setActiveTab] = useState('home');

export default HomeScreen;