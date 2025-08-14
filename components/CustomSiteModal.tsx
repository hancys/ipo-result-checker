import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Plus, Save, X } from 'lucide-react-native';

interface CustomSiteModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (site: { name: string; url: string; icon: string }) => void;
}

export function CustomSiteModal({ visible, onClose, onSave }: CustomSiteModalProps) {
  const [siteName, setSiteName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [siteIcon, setSiteIcon] = useState('');

  const handleSave = () => {
    if (!siteName.trim() || !siteUrl.trim()) {
      Alert.alert('Error', 'Please enter both site name and URL');
      return;
    }

    let formattedUrl = siteUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const icon = siteIcon.trim() || siteName.substring(0, 2).toUpperCase();

    onSave({
      name: siteName.trim(),
      url: formattedUrl,
      icon: icon,
    });

    // Reset form
    setSiteName('');
    setSiteUrl('');
    setSiteIcon('');
    onClose();
  };

  const handleClose = () => {
    setSiteName('');
    setSiteUrl('');
    setSiteIcon('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Custom Site</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Site Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., My IPO Site"
              value={siteName}
              onChangeText={setSiteName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website URL</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., example.com/ipo"
              value={siteUrl}
              onChangeText={setSiteUrl}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Icon (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., MS (max 3 characters)"
              value={siteIcon}
              onChangeText={setSiteIcon}
              maxLength={3}
            />
            <Text style={styles.helperText}>
              Leave empty to auto-generate from site name
            </Text>
          </View>

          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Save size={20} color="white" />
            <Text style={styles.saveButtonText}>Add Site</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});