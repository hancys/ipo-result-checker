import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import { ExternalLink, Globe } from 'lucide-react-native';
import { IpoSite } from '@/types/ipo';

interface IpoSiteCardProps {
  site: IpoSite;
  onPress: () => void;
}

export function IpoSiteCard({ site, onPress }: IpoSiteCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>{site.icon}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.siteName} numberOfLines={2}>
          {site.name}
        </Text>
        <View style={styles.urlContainer}>
          <Globe size={14} color="#6B7280" />
          <Text style={styles.url} numberOfLines={1}>
            {site.url.replace('https://', '').replace('www.', '')}
          </Text>
        </View>
      </View>
      
      <View style={styles.arrowContainer}>
        <ExternalLink size={20} color="#2563EB" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  content: {
    flex: 1,
  },
  siteName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  url: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  arrowContainer: {
    marginLeft: 8,
  },
});