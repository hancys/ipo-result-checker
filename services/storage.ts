import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedBoid, IpoSite } from '@/types/ipo';

const BOIDS_KEY = 'saved_boids';
const CUSTOM_SITES_KEY = 'custom_sites';

export const storageService = {
  // BOID Management
  async getSavedBoids(): Promise<SavedBoid[]> {
    try {
      const data = await AsyncStorage.getItem(BOIDS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading saved BOIDs:', error);
      return [];
    }
  },

  async saveBoid(boid: Omit<SavedBoid, 'id' | 'createdAt'>): Promise<void> {
    try {
      const existingBoids = await this.getSavedBoids();
      const newBoid: SavedBoid = {
        ...boid,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      const updatedBoids = [...existingBoids, newBoid];
      await AsyncStorage.setItem(BOIDS_KEY, JSON.stringify(updatedBoids));
    } catch (error) {
      console.error('Error saving BOID:', error);
      throw error;
    }
  },

  async deleteBoid(id: string): Promise<void> {
    try {
      const existingBoids = await this.getSavedBoids();
      const updatedBoids = existingBoids.filter(boid => boid.id !== id);
      await AsyncStorage.setItem(BOIDS_KEY, JSON.stringify(updatedBoids));
    } catch (error) {
      console.error('Error deleting BOID:', error);
      throw error;
    }
  },

  // Custom Sites Management
  async getCustomSites(): Promise<IpoSite[]> {
    try {
      const data = await AsyncStorage.getItem(CUSTOM_SITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading custom sites:', error);
      return [];
    }
  },

  async saveCustomSite(site: Omit<IpoSite, 'id'>): Promise<void> {
    try {
      const existingSites = await this.getCustomSites();
      const newSite: IpoSite = {
        ...site,
        id: `custom_${Date.now()}`
      };
      const updatedSites = [...existingSites, newSite];
      await AsyncStorage.setItem(CUSTOM_SITES_KEY, JSON.stringify(updatedSites));
    } catch (error) {
      console.error('Error saving custom site:', error);
      throw error;
    }
  }
};