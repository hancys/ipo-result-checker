import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable, Animated } from 'react-native';
import { ExternalLink, Globe } from 'lucide-react-native';
import { IpoSite } from '@/types/ipo';

interface IpoSiteCardProps {
  site: IpoSite;
  onPress: () => void;
}

export function IpoSiteCard({ site, onPress }: IpoSiteCardProps) {
  const animatedValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.timing(animatedValue, {
      toValue: 0.8,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable 
      style={styles.card} 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.cardContent, { opacity: animatedValue }]}>
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
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardContent: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
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
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  url: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  arrowContainer: {
    marginLeft: 12,
    padding: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
});