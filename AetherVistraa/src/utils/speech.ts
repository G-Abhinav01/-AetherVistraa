import * as Speech from 'expo-speech';
import { Language } from '../types';

// Map our app languages to Speech API language codes
const languageMap: Record<Language, string> = {
  english: 'en-US',
  hindi: 'hi-IN',
  telugu: 'te-IN',
  tamil: 'ta-IN',
  kannada: 'kn-IN',
  bengali: 'bn-IN',
  japanese: 'ja-JP',
  korean: 'ko-KR',
  mandarin: 'zh-CN',
};

/**
 * Speak the given text in the specified language
 * @param text Text to be spoken
 * @param language Language to speak in
 */
export const speakPhrase = async (text: string, language: Language): Promise<void> => {
  try {
    // Stop any ongoing speech
    await Speech.stop();
    
    // Speak the new phrase
    await Speech.speak(text, {
      language: languageMap[language],
      pitch: 1.0,
      rate: 0.9, // Slightly slower for better clarity
    });
  } catch (error) {
    console.error('Error speaking phrase:', error);
  }
};

/**
 * Check if text-to-speech is currently speaking
 * @returns Promise that resolves to boolean indicating if speaking
 */
export const isSpeaking = async (): Promise<boolean> => {
  try {
    return await Speech.isSpeakingAsync();
  } catch (error) {
    console.error('Error checking if speaking:', error);
    return false;
  }
};