import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { 
  ArrowLeft, 
  RefreshCw, 
  Save, 
  List,
  TrendingUp
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { BoidManager } from '@/components/BoidManager';
import { storageService } from '@/services/storage';
import { SavedBoid } from '@/types/ipo';

const { height: screenHeight } = Dimensions.get('window');

export default function WebViewScreen() {
  const { id, name, url } = useLocalSearchParams<{
    id: string;
    name: string;
    url: string;
  }>();
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showBoidManager, setShowBoidManager] = useState(false);
  const [boidInput, setBoidInput] = useState('');
  const [savedBoids, setSavedBoids] = useState<SavedBoid[]>([]);

  useEffect(() => {
    loadSavedBoids();
  }, []);

  const loadSavedBoids = async () => {
    try {
      const boids = await storageService.getSavedBoids();
      setSavedBoids(boids);
    } catch (error) {
      console.error('Error loading BOIDs:', error);
    }
  };

  const handleBoidSelect = (boid: string) => {
    setBoidInput(boid);
    // Auto-paste when BOID is selected
    setTimeout(() => {
      handlePasteToPage();
    }, 100);
  };

  const handlePasteToPage = () => {
    if (!boidInput.trim()) {
      Alert.alert('Error', 'Please enter a BOID number first');
      return;
    }

    const jsCode = `
      (function() {
        try {
          // Try common input selectors for BOID fields
          const possibleSelectors = [
            'input[name*="boid" i]',
            'input[name*="BOID"]',
            'input[placeholder*="boid" i]',
            'input[placeholder*="BOID"]',
            'input[id*="boid" i]',
            'input[id*="BOID"]',
            'input[name*="demat" i]',
            'input[name*="client" i]',
            'input[type="text"]:not([readonly]):not([disabled])',
            'input[type="number"]:not([readonly]):not([disabled])',
            'input:not([type]):not([readonly]):not([disabled])'
          ];
          
          let filled = false;
          const boidValue = "${boidInput.replace(/"/g, '\\"')}";
          
          // Try specific selectors first
          for (let selector of possibleSelectors) {
            const inputs = document.querySelectorAll(selector);
            for (let input of inputs) {
              const rect = input.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0 && !input.value.trim()) {
                input.value = boidValue;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new Event('keyup', { bubbles: true }));
                input.focus();
                filled = true;
                break;
              }
            }
            if (filled) break;
          }
          
          // If no specific field found, try any visible empty input
          if (!filled) {
            const allInputs = document.querySelectorAll('input');
            for (let input of allInputs) {
              const rect = input.getBoundingClientRect();
              const isVisible = rect.width > 0 && rect.height > 0;
              const isEmpty = !input.value.trim();
              const isEditable = !input.readOnly && !input.disabled;
              
              if (isVisible && isEmpty && isEditable) {
                input.value = boidValue;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new Event('keyup', { bubbles: true }));
                input.focus();
                filled = true;
                break;
              }
            }
          }
          
          return filled;
        } catch (error) {
          console.error('Paste error:', error);
          return false;
        }
      })();
    `;

    webViewRef.current?.injectJavaScript(`
      ${jsCode}
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'pasteResult',
        success: ${jsCode}
      }));
    `);
  };

  const handleSaveBoid = async () => {
    if (!boidInput.trim()) {
      Alert.alert('Error', 'Please enter a BOID number to save');
      return;
    }

    // Check if BOID already exists
    const existingBoid = savedBoids.find(b => b.boid === boidInput.trim());
    if (existingBoid) {
      Alert.alert('Already Saved', 'This BOID is already in your saved list');
      return;
    }

    try {
      await storageService.saveBoid({
        name: `BOID ${savedBoids.length + 1}`,
        boid: boidInput.trim(),
      });
      await loadSavedBoids();
      Alert.alert('Saved', 'BOID has been saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save BOID');
    }
  };

  const handleRefresh = () => {
    webViewRef.current?.reload();
  };

  const handleGoToSites = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {name}
          </Text>
        </View>

        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <RefreshCw size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      {loading && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      )}

      {/* WebView */}
      <View style={styles.webviewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={styles.webview}
          onLoadStart={() => {
            setLoading(true);
            setProgress(0);
          }}
          onLoadProgress={({ nativeEvent }) => {
            setProgress(nativeEvent.progress);
          }}
          onLoadEnd={() => {
            setLoading(false);
            setProgress(1);
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            Alert.alert('Error', `Failed to load webpage: ${nativeEvent.description}`);
          }}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'pasteResult') {
                if (data.success) {
                  Alert.alert('Success', 'BOID has been pasted to the page');
                } else {
                  Alert.alert('Info', 'Could not find a suitable input field. Please paste manually.');
                }
              }
            } catch (error) {
              console.error('Message parsing error:', error);
            }
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        {/* BOID Input Section */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.boidInput}
            value={boidInput}
            onChangeText={setBoidInput}
            placeholder="Enter 16-digit BOID"
            keyboardType="numeric"
            maxLength={16}
          />
          <TouchableOpacity 
            style={styles.pasteButton}
            onPress={handlePasteToPage}
          >
            <Text style={styles.pasteButtonText}>Paste to page</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons Section */}
        <View style={styles.actionsSection}>
          <View style={styles.leftActions}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveBoid}
            >
              <Save size={18} color="white" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.savedButton}
              onPress={() => setShowBoidManager(true)}
            >
              <List size={18} color="white" />
              <Text style={styles.savedButtonText}>Saved</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.savedCount}>
            Saved BOIDs ({savedBoids.length})
          </Text>
        </View>

        {/* IPO Sites Button */}
        <TouchableOpacity 
          style={styles.ipoSitesButton}
          onPress={handleGoToSites}
        >
          <TrendingUp size={20} color="#6B7280" />
          <Text style={styles.ipoSitesText}>IPO Sites</Text>
        </TouchableOpacity>
      </View>

      <BoidManager
        visible={showBoidManager}
        onClose={() => setShowBoidManager(false)}
        onBoidSelect={handleBoidSelect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  refreshButton: {
    padding: 8,
  },
  progressContainer: {
    height: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563EB',
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  bottomPanel: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  inputSection: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  boidInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  pasteButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pasteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  savedButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  savedButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  savedCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  ipoSitesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  ipoSitesText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});