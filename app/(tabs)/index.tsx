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
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.8,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '400',
  },
  boidButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  boidButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sitesGrid: {
    gap: 14,
  },
  addSiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    marginBottom: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  addSiteButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2563EB',
  },
});