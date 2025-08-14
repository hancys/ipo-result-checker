import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { Plus, Save, Trash2, X, Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { SavedBoid } from '@/types/ipo';
import { storageService } from '@/services/storage';

interface BoidManagerProps {
  visible: boolean;
  onClose: () => void;
  onBoidSelect: (boid: string) => void;
}

export function BoidManager({ visible, onClose, onBoidSelect }: BoidManagerProps) {
  const [savedBoids, setSavedBoids] = useState<SavedBoid[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBoidName, setNewBoidName] = useState('');
  const [newBoidValue, setNewBoidValue] = useState('');

  useEffect(() => {
    if (visible) {
      loadSavedBoids();
    }
  }, [visible]);

  const loadSavedBoids = async () => {
    try {
      const boids = await storageService.getSavedBoids();
      setSavedBoids(boids);
    } catch (error) {
      console.error('Error loading BOIDs:', error);
    }
  };

  const handleSaveBoid = async () => {
    if (!newBoidName.trim() || !newBoidValue.trim()) {
      Alert.alert('Error', 'Please enter both name and BOID number');
      return;
    }

    try {
      await storageService.saveBoid({
        name: newBoidName.trim(),
        boid: newBoidValue.trim(),
      });
      setNewBoidName('');
      setNewBoidValue('');
      setShowAddForm(false);
      loadSavedBoids();
    } catch (error) {
      Alert.alert('Error', 'Failed to save BOID');
    }
  };

  const handleDeleteBoid = async (id: string) => {
    Alert.alert(
      'Delete BOID',
      'Are you sure you want to delete this BOID?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.deleteBoid(id);
              loadSavedBoids();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete BOID');
            }
          },
        },
      ]
    );
  };

  const handleCopyBoid = async (boid: string) => {
    await Clipboard.setStringAsync(boid);
    Alert.alert('Copied', 'BOID copied to clipboard');
  };

  const handleSelectBoid = (boid: string) => {
    onBoidSelect(boid);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>BOID Manager</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {savedBoids.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No saved BOIDs yet</Text>
              <Text style={styles.emptySubText}>Add your first BOID to get started</Text>
            </View>
          ) : (
            savedBoids.map((savedBoid) => (
              <View key={savedBoid.id} style={styles.boidItem}>
                <TouchableOpacity
                  style={styles.boidContent}
                  onPress={() => {
                    handleSelectBoid(savedBoid.boid);
                    onClose();
                  }}
                >
                  <Text style={styles.boidName}>{savedBoid.name}</Text>
                  <Text style={styles.boidNumber}>{savedBoid.boid}</Text>
                </TouchableOpacity>
                <View style={styles.boidActions}>
                  <TouchableOpacity
                    onPress={() => handleCopyBoid(savedBoid.boid)}
                    style={styles.actionButton}
                  >
                    <Copy size={18} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteBoid(savedBoid.id)}
                    style={styles.actionButton}
                  >
                    <Trash2 size={18} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {showAddForm ? (
            <View style={styles.addForm}>
              <Text style={styles.formTitle}>Add New BOID</Text>
              <TextInput
                style={styles.input}
                placeholder="BOID Name (e.g., Personal BOID)"
                value={newBoidName}
                onChangeText={setNewBoidName}
              />
              <TextInput
                style={styles.input}
                placeholder="BOID Number"
                value={newBoidValue}
                onChangeText={setNewBoidValue}
                keyboardType="numeric"
              />
              <View style={styles.formButtons}>
                <TouchableOpacity
                  onPress={() => setShowAddForm(false)}
                  style={[styles.button, styles.cancelButton]}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveBoid}
                  style={[styles.button, styles.saveButton]}
                >
                  <Save size={18} color="white" />
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setShowAddForm(true)}
              style={styles.addButton}
            >
              <Plus size={24} color="#2563EB" />
              <Text style={styles.addButtonText}>Add New BOID</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  boidItem: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  boidContent: {
    flex: 1,
  },
  boidName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  boidNumber: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  boidActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  addForm: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#2563EB',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2563EB',
  },
});