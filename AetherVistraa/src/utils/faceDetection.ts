import { FaceDetectionResult } from '../types';
import * as FaceDetector from 'expo-face-detector';

// Constants for face detection thresholds
const EYE_OPEN_THRESHOLD = 0.85;
const MOUTH_OPEN_THRESHOLD = 0.3;

/**
 * Process face detection results to determine if eyes are closed and mouth is open
 * @param faces Array of detected faces from FaceDetector
 * @returns Object containing boolean values for eyesOpen and mouthOpen
 */
export const processFaceDetection = (faces: FaceDetector.FaceFeature[]): FaceDetectionResult => {
  // Default to eyes open (no blink) and mouth closed
  let result: FaceDetectionResult = {
    eyesOpen: true,
    mouthOpen: false,
  };

  // If no faces detected, return default values
  if (faces.length === 0) {
    return result;
  }

  // We'll use the first detected face
  const face = faces[0];

  // Check if eyes are closed (blinking)
  // The leftEyeOpenProbability and rightEyeOpenProbability are values between 0 and 1
  // where 0 means closed and 1 means open
  if (face.leftEyeOpenProbability && face.rightEyeOpenProbability) {
    const avgEyeOpenProbability = (face.leftEyeOpenProbability + face.rightEyeOpenProbability) / 2;
    result.eyesOpen = avgEyeOpenProbability > EYE_OPEN_THRESHOLD;
  }

  // Check if mouth is open
  // The mouthPosition property gives information about mouth openness
  if (face.mouthPosition) {
    // This is a simplified approach - in a real app, you'd need to calculate
    // the mouth openness based on the positions of upper and lower lips
    result.mouthOpen = face.mouthPosition.y > MOUTH_OPEN_THRESHOLD;
  }

  return result;
};

/**
 * Debounce function to prevent rapid triggering of face detection events
 * @param func The function to debounce
 * @param wait Wait time in milliseconds
 */
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return function(...args: Parameters<F>) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};