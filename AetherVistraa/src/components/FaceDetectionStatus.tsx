import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon, useTheme } from 'react-native-paper';
import { FaceDetectionResult } from '../types';

interface FaceDetectionStatusProps {
  faceDetectionResult: FaceDetectionResult | null;
  isSpeaking: boolean;
}

const FaceDetectionStatus: React.FC<FaceDetectionStatusProps> = ({
  faceDetectionResult,
  isSpeaking,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const getEyeStatusText = () => {
    if (!faceDetectionResult) return 'No face detected';
    return faceDetectionResult.eyesOpen ? 'Eyes Open' : 'Eyes Closed';
  };

  const getMouthStatusText = () => {
    if (!faceDetectionResult) return 'No face detected';
    return faceDetectionResult.mouthOpen ? 'Mouth Open' : 'Mouth Closed';
  };

  const getEyeIcon = () => {
    if (!faceDetectionResult) return 'eye-off-outline';
    return faceDetectionResult.eyesOpen ? 'eye-outline' : 'eye-off-outline';
  };

  const getMouthIcon = () => {
    if (!faceDetectionResult) return 'emoticon-neutral-outline';
    return faceDetectionResult.mouthOpen ? 'emoticon-outline' : 'emoticon-neutral-outline';
  };

  const getSpeakingIcon = () => {
    return isSpeaking ? 'volume-high' : 'volume-off';
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Icon source={getEyeIcon()} size={24} color={theme.colors.primary} />
        <Text style={styles.statusText}>{getEyeStatusText()}</Text>
      </View>
      
      <View style={styles.row}>
        <Icon source={getMouthIcon()} size={24} color={theme.colors.primary} />
        <Text style={styles.statusText}>{getMouthStatusText()}</Text>
      </View>
      
      <View style={styles.row}>
        <Icon source={getSpeakingIcon()} size={24} color={theme.colors.primary} />
        <Text style={styles.statusText}>{isSpeaking ? 'Speaking' : 'Silent'}</Text>
      </View>
    </View>
  );
};

// Define static styles outside the component
const makeStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.text,
  },
});

export default FaceDetectionStatus;