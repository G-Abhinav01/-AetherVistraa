import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { Phrase } from '../types';

interface PhraseSelectorProps {
  phrases: Phrase[];
  selectedIndex: number;
  onPhraseSelected?: (phrase: Phrase) => void;
}

const PhraseSelector: React.FC<PhraseSelectorProps> = ({
  phrases,
  selectedIndex,
  onPhraseSelected,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  if (!phrases || phrases.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No phrases available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
      >
        {phrases.map((phrase, index) => {
          const isSelected = index === selectedIndex;
          return (
            <Card
              key={`${phrase.id}-${index}`}
              style={[
                styles.card,
                isSelected && styles.selectedCard,
              ]}
              onPress={() => onPhraseSelected && onPhraseSelected(phrase)}
            >
              <Card.Content style={styles.cardContent}>
                <Text style={[styles.phraseText, isSelected && styles.selectedText]}>
                  {phrase.text}
                </Text>
              </Card.Content>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
};

// Define static styles outside the component
const makeStyles = (theme) => StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 20,
  },
  scrollContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  card: {
    marginHorizontal: 8,
    minWidth: 150,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    elevation: 4,
  },
  selectedCard: {
    backgroundColor: theme.colors.primary,
    transform: [{ scale: 1.05 }],
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  cardContent: {
    padding: 16,
  },
  phraseText: {
    fontSize: 18,
    textAlign: 'center',
    color: theme.colors.text,
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: 16,
    marginTop: 20,
  },
});

export default PhraseSelector;