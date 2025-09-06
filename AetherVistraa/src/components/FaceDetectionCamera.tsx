import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Camera, CameraType, FaceDetectionResult } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { useTheme } from 'react-native-paper';
import { FaceDetectionResult as AppFaceDetectionResult } from '../types';
import { processFaceDetectionResult } from '../utils/faceDetection';

interface FaceDetectionCameraProps {
  onFaceDetected: (result: AppFaceDetectionResult) => void;
  isActive: boolean;
}

const FaceDetectionCamera: React.FC<FaceDetectionCameraProps> = ({ 
  onFaceDetected, 
  isActive 
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        if (status !== 'granted') {
          setError('Camera permission is required for face detection');
        }
      } catch (err) {
        setError('Failed to request camera permission');
        console.error('Camera permission error:', err);
      }
    })();
  }, []);

  const handleFacesDetected = ({ faces }: FaceDetectionResult) => {
    if (!isActive || faces.length === 0) return;
    
    const face = faces[0]; // We only process the first face detected
    const result = processFaceDetectionResult(face);
    onFaceDetected(result);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{error || 'No access to camera'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={CameraType.front}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 100,
          tracking: true,
        }}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');
const CAMERA_SIZE = width * 0.3; // Camera takes 30% of screen width

// Define static styles outside the component
const makeStyles = (theme) => StyleSheet.create({
  container: {
    width: CAMERA_SIZE,
    height: CAMERA_SIZE,
    borderRadius: CAMERA_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  text: {
    color: theme.colors.text,
    textAlign: 'center',
    padding: 10,
    fontSize: 12,
  },
});

export default FaceDetectionCamera;