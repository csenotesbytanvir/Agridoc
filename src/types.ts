export type Language = 'en' | 'bn' | 'th';

export interface AppState {
  language: Language;
  isOnline: boolean;
  apiKey: string;
  hasStarted: boolean;
  currentPage: PageId;
  points: number;
  level: number;
  unplantedTrees: number;
  isDemoMode: boolean;
}

export type PageId = 'home' | 'farmgram' | 'agridoc-ai' | 'profile' | 'offline-toolkit' | 'market-insights' | 'experts' | 'pest-map' | 'sustainability' | 'iot-dashboard' | 'yield-predictor' | 'gamification' | 'crop-registry';

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  season: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  type: 'vegetable' | 'fruit' | 'herb' | 'grain';
  watering: string;
  sunlight: string;
  soilPh: string;
  diseases: string[];
  companionPlants: string[];
  image: string;
  description: string;
}

export interface DiseaseReport {
  id: string;
  date: string;
  cropName: string;
  diseaseName: string;
  confidence: number;
  treatment: {
    organic: string[];
    chemical: string[];
  };
  reApply: string;
  prevention: string[];
  severity: number; // 1-100
}

export interface CalendarEvent {
  id: string;
  month: number; // 0-11
  type: 'sow' | 'transplant' | 'irrigate' | 'fertilize' | 'prune' | 'harvest' | 'pest-alert';
  crop: string;
  task: string;
  completed: boolean;
}

export interface MarketListing {
  id: string;
  type: 'buy' | 'sell';
  title: string;
  description: string;
  price: number;
  quantity: string;
  location: string;
  images: string[];
  sellerId: string;
  createdAt: string;
  blockchainHash?: string;
  harvestDate?: string;
  origin?: string;
}

export interface PestReport {
  id: string;
  lat: number;
  lng: number;
  crop: string;
  pest: string;
  severity: 'low' | 'medium' | 'high';
  reportedAt: string;
  reporterName: string;
}

export interface IoTData {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  lastUpdated: string;
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  images: string[];
  likes: number;
  comments: SocialComment[];
  cropType?: string;
  createdAt: string;
}

export interface SocialComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
}

export interface Expert {
  id: string;
  name: string;
  gender: 'male' | 'female';
  degree: string;
  specialization: string;
  location: string;
  phone: string;
  email: string;
  avatar: string;
}
