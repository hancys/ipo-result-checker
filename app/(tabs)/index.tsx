import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, RefreshCw } from 'lucide-react-native';
import { IpoSiteCard } from '@/components/IpoSiteCard';
import { BoidManager } from '@/components/BoidManager';
import { CustomSiteModal } from '@/components/CustomSiteModal';
import { IPO_SITES } from '@/constants/ipoSites';
import { IpoSite } from '@/types/ipo';
import { storageService } from '@/services/storage';

export default function HomeScreen() {
  const router = useRouter();
  const [allSites, setAllSites] = useState<IpoSite[]>(IPO_SITES);
  const [showBoidManager, setShowBoidManager] = useState(false);
  const [showCustomSiteModal, setShowCustomSiteModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAllSites();
  }, []);

  const loadAllSites = async () => {
    try {
      const customSites = await storageService.getCustomSites();
      setAllSites([...IPO_SITES, ...customSites]);
    } catch (error) {
      console.error('Error loading sites:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllSites();
    setRefreshing(false);
  };

  const handleSitePress = (site: IpoSite) => {
    router.push({
      pathname: '/webview/[id]',
      params: { 
        id: site.id, 
        name: site.name, 
        url: site.url 
      },
    });
  };

  const handleBoidSelect = (boid: string) => {
    Alert.alert('BOID Selected', `Selected BOID: ${boid}`);
  };

  const handleAddCustomSite = async (siteData: { name: string; url: string; icon: string }) => {
    try {
      await storageService.saveCustomSite(siteData);
      await loadAllSites();
      Alert.alert('Success', 'Custom site added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add custom site');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>IPO Result Hub</Text>
          <Text style={styles.subtitle}>Check your IPO allotment status</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setShowBoidManager(true)}
          style={styles.boidButton}
        >
          <Text style={styles.boidButtonText}>Manage BOIDs</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.sitesGrid}>
          {allSites.map((site) => (
            <IpoSiteCard
              key={site.id}
              site={site}
              onPress={() => handleSitePress(site)}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={styles.addSiteButton} 
          onPress={() => setShowCustomSiteModal(true)}
        >
          <Plus size={20} color="#2563EB" />
          <Text style={styles.addSiteButtonText}>Add Custom Site</Text>
        </TouchableOpacity>
      </ScrollView>

      <BoidManager
        visible={showBoidManager}
        onClose={() => setShowBoidManager(false)}
        onBoidSelect={handleBoidSelect}
      />

      <CustomSiteModal
        visible={showCustomSiteModal}
        onClose={() => setShowCustomSiteModal(false)}
        onSave={handleAddCustomSite}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  boidButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  boidButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sitesGrid: {
    gap: 12,
  },
  addSiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    gap: 8,
  },
  addSiteButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2563EB',
  },
});