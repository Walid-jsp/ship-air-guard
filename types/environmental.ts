// Types pour les données environnementales

export interface WeatherData {
  temperature: number;  // °C - Température à 2m
}

export interface AirQualityData {
  pm10: number;           // µg/m³ - Particules fines
  pm25: number;           // µg/m³ - Particules très fines
  carbon_dioxide: number; // µg/m³ - Dioxyde d'azote
  carbon_monoxide: number;
  ozone: number;          // µg/m³ - Ozone
  
}

export interface EnvironmentalData extends WeatherData, AirQualityData {
  timestamp: string;
  latitude: number;
  longitude: number;
}

// Seuils d'alerte selon l'OMS et réglementations maritimes
export const ENVIRONMENTAL_THRESHOLDS = {
  // Qualité de l'air (µg/m³)
  pm10: { 
    good: 20,      // Bonne qualité
    moderate: 50,  // Qualité modérée 
    poor: 100      // Mauvaise qualité
  },
  pm25: { 
    good: 10, 
    moderate: 25, 
    poor: 50 
  },
  carbon_dioxide: { 
    good: 40, 
    moderate: 100, 
    poor: 200 
  },
    carbon_monoxide: { 
    good: 40, 
    moderate: 100, 
    poor: 200 
  },
  ozone: { 
    good: 100, 
    moderate: 160, 
    poor: 240 
  },
  
  // Météo
  temperature: { 
    cold: 10,        // Froid
    comfortable: 25, // Confortable
    hot: 35          // Chaud
  },
} as const;

// Types pour les niveaux de qualité
export type QualityLevel = 'good' | 'moderate' | 'poor';
export type WeatherLevel = 'cold' | 'comfortable' | 'hot' | 'calm' | 'moderate' | 'strong';

// Interface pour les données sauvegardées en base
export interface EnvironmentalDataDB {
  id: string;
  timestamp: Date;
  latitude: number;
  longitude: number;
  temperature: number | null;
  pm10: number | null;
  pm25: number | null;
  carbon_dioxide: number | null;
  carbon_monoxide: number | null;
  ozone: number | null;
  dataSource: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les statistiques
export interface EnvironmentalStats {
  totalRecords: number;
  averageTemperature: number;
  averagePM10: number;
  averagePM25: number;
  averagecarbon_dioxide: number;
  maxcarbon_dioxide: number;
    averagecarbon_monoxide: number;
  maxcarbon_monoxide: number;
  lastUpdate: Date | null;
}

// Configuration pour les coordonnées du Vieux-Port de Marseille
export const MARSEILLE_OLD_PORT = {
  name: 'Vieux-Port de Marseille',
  latitude: 43.2951,
  longitude: 5.3744,
  timezone: 'Europe/Paris'
} as const;

// URLs des APIs Open-Meteo
export const OPEN_METEO_APIS = {
  weather: 'https://api.open-meteo.com/v1/forecast',
  airQuality: 'https://air-quality-api.open-meteo.com/v1/air-quality'
} as const;

// Paramètres pour les appels API
export const API_PARAMETERS = {
  weather: 'temperature_2m',
  airQuality: 'carbon_dioxide,carbon_monoxide'
} as const;