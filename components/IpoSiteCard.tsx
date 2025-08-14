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
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  cardContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 18,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(37, 99, 235, 0.15)',
  },
  iconText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  siteName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  url: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
    flex: 1,
    fontWeight: '400',
  },
  arrowContainer: {
    marginLeft: 16,
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(37, 99, 235, 0.06)',
  },
});