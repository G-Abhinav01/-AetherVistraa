import { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { processFaceDetection, debounce } from '../utils/faceDetection';
import { FaceDetectionResult } from '../types';

interface UseFaceDetectionProps {
  onBlink?: () => void;
  onMouthOpen?: () => void;
  onMouthClose?: () => void;
  enabled?: boolean;
}

export const useFaceDetection = ({
  onBlink,
  onMouthOpen,
  onMouthClose,
  enabled = true,
}: UseFaceDetectionProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceDetectionResult, setFaceDetectionResult] = useState<FaceDetectionResult>({
    eyesOpen: true,
    mouthOpen: false,
  });
  
  const cameraRef = useRef<Camera>(null);
  const prevMouthOpenRef = useRef(false);
  const prevEyesOpenRef = useRef(true);

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Handle face detection events
  const handleFacesDetected = ({ faces }: { faces: FaceDetector.FaceFeature[] }) => {
    if (!enabled) return;
    
    setFaceDetected(faces.length > 0);
    
    if (faces.length > 0) {
      const result = processFaceDetection(faces);
      setFaceDetectionResult(result);
      
      // Check for blink (eyes were open and now closed)
      if (prevEyesOpenRef.current && !result.eyesOpen && onBlink) {
        onBlink();
      }
      
      // Check for mouth open/close events
      if (!prevMouthOpenRef.current && result.mouthOpen && onMouthOpen) {
        onMouthOpen();
      } else if (prevMouthOpenRef.current && !result.mouthOpen && onMouthClose) {
        onMouthClose();
      }
      
      // Update previous state references
      prevEyesOpenRef.current = result.eyesOpen;
      prevMouthOpenRef.current = result.mouthOpen;
    }
  };
  
  // Debounce the face detection handler to improve performance
  const debouncedHandleFacesDetected = debounce(handleFacesDetected, 100);

  return {
    hasPermission,
    faceDetected,
    faceDetectionResult,
    cameraRef,
    handleFacesDetected: debouncedHandleFacesDetected,
  };
};