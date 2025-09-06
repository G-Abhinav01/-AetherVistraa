import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, IconButton, Divider, Dialog, Portal, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { usePhrases } from '../../hooks/usePhrases';
import { useAppSettings } from '../../hooks/useAppSettings';

type EditPhrasesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditPhrases'>;

const EditPhrasesScreen = () => {
  const navigation = useNavigation<EditPhrasesScreenNavigationProp>();
  const { settings } = useAppSettings();
  const { phrases, addPhrase, updatePhrase, deletePhrase } = usePhrases(settings.language);
  const theme = useTheme();
  const styles = makeStyles(theme);
  
  const [newPhraseText, setNewPhraseText] = useState('');
  const [editingPhrase, setEditingPhrase] = useState<{ id: string; text: string } | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [phraseToDelete, setPhraseToDelete] = useState<string | null>(null);

  // Handle adding a new phrase
  const handleAddPhrase = () => {
    if (newPhraseText.trim()) {
      addPhrase(newPhraseText.trim());
      setNewPhraseText('');
    }
  };

  // Handle updating a phrase
  const handleUpdatePhrase = () => {
    if (editingPhrase && editingPhrase.text.trim()) {
      updatePhrase(editingPhrase.id, editingPhrase.text.trim());
      setEditingPhrase(null);
    }
  };

  // Handle deleting a phrase
  const handleDeletePhrase = () => {
    if (phraseToDelete) {
      deletePhrase(phraseToDelete);
      setPhraseToDelete(null);
      setDeleteDialogVisible(false);
    }
  };

  // Show delete confirmation dialog
  const showDeleteDialog = (id: string) => {
    setPhraseToDelete(id);
    setDeleteDialogVisible(true);
  };

  // Hide delete confirmation dialog
  const hideDeleteDialog = () => {
    setDeleteDialogVisible(false);
    setPhraseToDelete(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Phrases</Text>
        <Text style={styles.subtitle}>
          Customize the phrases available for communication
        </Text>
      </View>

      <View style={styles.addPhraseContainer}>
        <TextInput
          label="New Phrase"
          value={newPhraseText}
          onChangeText={setNewPhraseText}
          style={styles.input}
          mode="outlined"
          outlineColor={theme.colors.primary}
          theme={{ colors: { text: theme.colors.text } }}
        />
        <Button
          mode="contained"
          onPress={handleAddPhrase}
          style={styles.addButton}
          disabled={!newPhraseText.trim()}
        >
          Add
        </Button>
      </View>

      <ScrollView style={styles.phrasesList}>
        {phrases.length === 0 ? (
          <Text style={styles.emptyText}>No phrases added yet</Text>
        ) : (
          phrases.map((phrase, index) => (
            <React.Fragment key={phrase.id}>
              {editingPhrase && editingPhrase.id === phrase.id ? (
                <View style={styles.editContainer}>
                  <TextInput
                    value={editingPhrase.text}
                    onChangeText={(text) => setEditingPhrase({ ...editingPhrase, text })}
                    style={styles.editInput}
                    mode="outlined"
                    outlineColor={theme.colors.primary}
                    theme={{ colors: { text: theme.colors.text } }}
                    autoFocus
                  />
                  <View style={styles.editActions}>
                    <Button
                      mode="contained"
                      onPress={handleUpdatePhrase}
                      style={styles.saveButton}
                      disabled={!editingPhrase.text.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => setEditingPhrase(null)}
                      style={styles.cancelButton}
                    >
                      Cancel
                    </Button>
                  </View>
                </View>
              ) : (
                <View style={styles.phraseItem}>
                  <Text style={styles.phraseText}>{phrase.text}</Text>
                  <View style={styles.actionButtons}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => setEditingPhrase({ id: phrase.id, text: phrase.text })}
                      color={theme.colors.primary}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => showDeleteDialog(phrase.id)}
                      color={theme.colors.error}
                    />
                  </View>
                </View>
              )}
              {index < phrases.length - 1 && <Divider style={styles.divider} />}
            </React.Fragment>
          ))
        )}
      </ScrollView>

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={hideDeleteDialog}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>Delete Phrase</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogContent}>
              Are you sure you want to delete this phrase?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDeleteDialog} color={theme.colors.text}>
              Cancel
            </Button>
            <Button onPress={handleDeletePhrase} color={theme.colors.error}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

// Define static styles outside the component
const makeStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    opacity: 0.8,
  },
  addPhraseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  addButton: {
    marginLeft: 12,
    height: 50,
    justifyContent: 'center',
  },
  phrasesList: {
    flex: 1,
  },
  phraseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  phraseText: {
    fontSize: 18,
    color: theme.colors.text,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    backgroundColor: theme.colors.text,
    opacity: 0.1,
  },
  editContainer: {
    marginVertical: 8,
  },
  editInput: {
    backgroundColor: theme.colors.surface,
    marginBottom: 8,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  saveButton: {
    marginRight: 8,
  },
  cancelButton: {
    borderColor: theme.colors.text,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 40,
  },
  dialog: {
    backgroundColor: theme.colors.surface,
  },
  dialogTitle: {
    color: theme.colors.text,
  },
  dialogContent: {
    color: theme.colors.text,
  },
});

export default EditPhrasesScreen;