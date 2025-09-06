import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Phrase, Language } from '../types';

const PHRASES_STORAGE_KEY = 'app_phrases';

// Default phrases in English
const defaultPhrases: Phrase[] = [
  { id: '1', text: 'Yes', language: 'english' },
  { id: '2', text: 'No', language: 'english' },
  { id: '3', text: 'Help', language: 'english' },
  { id: '4', text: 'Thank you', language: 'english' },
  { id: '5', text: 'I need water', language: 'english' },
  { id: '6', text: 'I need food', language: 'english' },
  { id: '7', text: 'I need rest', language: 'english' },
  { id: '8', text: 'I need medicine', language: 'english' },
  { id: '9', text: 'Call doctor', language: 'english' },
  { id: '10', text: 'Call family', language: 'english' },
];

// Default phrases in other languages
const defaultPhrasesByLanguage: Record<Language, { [key: string]: string }> = {
  english: {
    '1': 'Yes',
    '2': 'No',
    '3': 'Help',
    '4': 'Thank you',
    '5': 'I need water',
    '6': 'I need food',
    '7': 'I need rest',
    '8': 'I need medicine',
    '9': 'Call doctor',
    '10': 'Call family',
  },
  hindi: {
    '1': 'हां',
    '2': 'नहीं',
    '3': 'मदद',
    '4': 'धन्यवाद',
    '5': 'मुझे पानी चाहिए',
    '6': 'मुझे भोजन चाहिए',
    '7': 'मुझे आराम चाहिए',
    '8': 'मुझे दवा चाहिए',
    '9': 'डॉक्टर को बुलाओ',
    '10': 'परिवार को बुलाओ',
  },
  telugu: {
    '1': 'అవును',
    '2': 'కాదు',
    '3': 'సహాయం',
    '4': 'ధన్యవాదాలు',
    '5': 'నాకు నీరు కావాలి',
    '6': 'నాకు ఆహారం కావాలి',
    '7': 'నాకు విశ్రాంతి కావాలి',
    '8': 'నాకు మందు కావాలి',
    '9': 'డాక్టర్‌ని పిలవండి',
    '10': 'కుటుంబాన్ని పిలవండి',
  },
  tamil: {
    '1': 'ஆம்',
    '2': 'இல்லை',
    '3': 'உதவி',
    '4': 'நன்றி',
    '5': 'எனக்கு தண்ணீர் வேண்டும்',
    '6': 'எனக்கு உணவு வேண்டும்',
    '7': 'எனக்கு ஓய்வு வேண்டும்',
    '8': 'எனக்கு மருந்து வேண்டும்',
    '9': 'மருத்துவரை அழைக்கவும்',
    '10': 'குடும்பத்தை அழைக்கவும்',
  },
  kannada: {
    '1': 'ಹೌದು',
    '2': 'ಇಲ್ಲ',
    '3': 'ಸಹಾಯ',
    '4': 'ಧನ್ಯವಾದಗಳು',
    '5': 'ನನಗೆ ನೀರು ಬೇಕು',
    '6': 'ನನಗೆ ಆಹಾರ ಬೇಕು',
    '7': 'ನನಗೆ ವಿಶ್ರಾಂತಿ ಬೇಕು',
    '8': 'ನನಗೆ ಔಷಧಿ ಬೇಕು',
    '9': 'ವೈದ್ಯರನ್ನು ಕರೆಯಿರಿ',
    '10': 'ಕುಟುಂಬವನ್ನು ಕರೆಯಿರಿ',
  },
  bengali: {
    '1': 'হ্যাঁ',
    '2': 'না',
    '3': 'সাহায্য',
    '4': 'ধন্যবাদ',
    '5': 'আমার জল দরকার',
    '6': 'আমার খাবার দরকার',
    '7': 'আমার বিশ্রাম দরকার',
    '8': 'আমার ওষুধ দরকার',
    '9': 'ডাক্তারকে ডাকুন',
    '10': 'পরিবারকে ডাকুন',
  },
  japanese: {
    '1': 'はい',
    '2': 'いいえ',
    '3': '助けて',
    '4': 'ありがとう',
    '5': '水が必要です',
    '6': '食べ物が必要です',
    '7': '休息が必要です',
    '8': '薬が必要です',
    '9': '医者を呼んでください',
    '10': '家族を呼んでください',
  },
  korean: {
    '1': '네',
    '2': '아니오',
    '3': '도움',
    '4': '감사합니다',
    '5': '물이 필요합니다',
    '6': '음식이 필요합니다',
    '7': '휴식이 필요합니다',
    '8': '약이 필요합니다',
    '9': '의사를 불러주세요',
    '10': '가족을 불러주세요',
  },
  mandarin: {
    '1': '是',
    '2': '否',
    '3': '帮助',
    '4': '谢谢',
    '5': '我需要水',
    '6': '我需要食物',
    '7': '我需要休息',
    '8': '我需要药',
    '9': '叫医生',
    '10': '叫家人',
  },
};

export const usePhrases = (language: Language) => {
  const [phrases, setPhrases] = useState<Phrase[]>(defaultPhrases);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhraseIndex, setSelectedPhraseIndex] = useState(0);

  // Load phrases from storage on component mount and when language changes
  useEffect(() => {
    const loadPhrases = async () => {
      try {
        setIsLoading(true);
        const storedPhrases = await AsyncStorage.getItem(PHRASES_STORAGE_KEY);
        
        if (storedPhrases) {
          const parsedPhrases: Phrase[] = JSON.parse(storedPhrases);
          // Filter phrases by the selected language
          const filteredPhrases = parsedPhrases.filter(phrase => phrase.language === language);
          
          if (filteredPhrases.length > 0) {
            setPhrases(filteredPhrases);
          } else {
            // If no phrases found for this language, create them from defaults
            const newPhrases = Object.entries(defaultPhrasesByLanguage[language]).map(
              ([id, text]) => ({
                id,
                text,
                language,
              })
            );
            setPhrases(newPhrases);
            await AsyncStorage.setItem(PHRASES_STORAGE_KEY, JSON.stringify([...parsedPhrases, ...newPhrases]));
          }
        } else {
          // If no stored phrases at all, initialize with defaults for current language
          const newPhrases = Object.entries(defaultPhrasesByLanguage[language]).map(
            ([id, text]) => ({
              id,
              text,
              language,
            })
          );
          setPhrases(newPhrases);
          await AsyncStorage.setItem(PHRASES_STORAGE_KEY, JSON.stringify(newPhrases));
        }
      } catch (error) {
        console.error('Error loading phrases:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhrases();
  }, [language]);

  // Add a new phrase
  const addPhrase = async (text: string) => {
    try {
      const newPhrase: Phrase = {
        id: Date.now().toString(),
        text,
        language,
      };

      const updatedPhrases = [...phrases, newPhrase];
      setPhrases(updatedPhrases);

      // Update storage
      const storedPhrases = await AsyncStorage.getItem(PHRASES_STORAGE_KEY);
      if (storedPhrases) {
        const parsedPhrases: Phrase[] = JSON.parse(storedPhrases);
        await AsyncStorage.setItem(
          PHRASES_STORAGE_KEY,
          JSON.stringify([...parsedPhrases.filter(p => p.id !== newPhrase.id), newPhrase])
        );
      } else {
        await AsyncStorage.setItem(PHRASES_STORAGE_KEY, JSON.stringify(updatedPhrases));
      }
    } catch (error) {
      console.error('Error adding phrase:', error);
    }
  };

  // Update an existing phrase
  const updatePhrase = async (id: string, text: string) => {
    try {
      const updatedPhrases = phrases.map(phrase =>
        phrase.id === id ? { ...phrase, text } : phrase
      );
      setPhrases(updatedPhrases);

      // Update storage
      const storedPhrases = await AsyncStorage.getItem(PHRASES_STORAGE_KEY);
      if (storedPhrases) {
        const parsedPhrases: Phrase[] = JSON.parse(storedPhrases);
        const updatedStoredPhrases = parsedPhrases.map(phrase =>
          phrase.id === id ? { ...phrase, text } : phrase
        );
        await AsyncStorage.setItem(PHRASES_STORAGE_KEY, JSON.stringify(updatedStoredPhrases));
      }
    } catch (error) {
      console.error('Error updating phrase:', error);
    }
  };

  // Delete a phrase
  const deletePhrase = async (id: string) => {
    try {
      const updatedPhrases = phrases.filter(phrase => phrase.id !== id);
      setPhrases(updatedPhrases);

      // Update storage
      const storedPhrases = await AsyncStorage.getItem(PHRASES_STORAGE_KEY);
      if (storedPhrases) {
        const parsedPhrases: Phrase[] = JSON.parse(storedPhrases);
        const updatedStoredPhrases = parsedPhrases.filter(phrase => phrase.id !== id);
        await AsyncStorage.setItem(PHRASES_STORAGE_KEY, JSON.stringify(updatedStoredPhrases));
      }
    } catch (error) {
      console.error('Error deleting phrase:', error);
    }
  };

  // Move to the next phrase in the list
  const selectNextPhrase = () => {
    setSelectedPhraseIndex(prevIndex => (prevIndex + 1) % phrases.length);
  };

  // Get the currently selected phrase
  const getSelectedPhrase = (): Phrase | null => {
    return phrases.length > 0 ? phrases[selectedPhraseIndex] : null;
  };

  return {
    phrases,
    isLoading,
    selectedPhraseIndex,
    addPhrase,
    updatePhrase,
    deletePhrase,
    selectNextPhrase,
    getSelectedPhrase,
  };
};