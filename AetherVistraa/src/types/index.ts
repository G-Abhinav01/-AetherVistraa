export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

export interface Phrase {
  id: string;
  text: string;
  language: string;
}

export type AuthProvider = 'google' | 'whatsapp';

export type Language = 
  | 'english'
  | 'hindi'
  | 'telugu'
  | 'tamil'
  | 'kannada'
  | 'bengali'
  | 'japanese'
  | 'korean'
  | 'mandarin';

export interface AppSettings {
  language: Language;
  darkMode: boolean;
  showDisclaimer: boolean;
}

export interface FaceDetectionResult {
  eyesOpen: boolean;
  mouthOpen: boolean;
}