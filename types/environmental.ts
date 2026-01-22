// Types pour les données environnementales

export interface WeatherData {
  temperature: number;  // °C - Température à 2m
  windSpeed: number;    // km/h - Vitesse du vent à 10m
  windDirection: number; // ° - Direction du vent à 10m
}

export interface AirQualityData {
  pm10: number;           // µg/m³ - Particules fines
  pm25: number;           // µg/m³ - Particules très fines
  nitrogenDioxide: number; // µg/m³ - Dioxyde d'azote
  sulphurDioxide: number;  // µg/m³ - Dioxyde de soufre (critique pour les navires)
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
  nitrogenDioxide: { 
    good: 40, 
    moderate: 100, 
    poor: 200 
  },
  sulphurDioxide: { 
    good: 20,      // Critique pour surveiller les navires
    moderate: 100, 
    poor: 350 
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
  windSpeed: { 
    calm: 10,     // Calme
    moderate: 25, // Modéré
    strong: 50    // Fort
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
  windSpeed: number | null;
  windDirection: number | null;
  pm10: number | null;
  pm25: number | null;
  nitrogenDioxide: number | null;
  sulphurDioxide: number | null;
  ozone: number | null;
  dataSource: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les statistiques
export interface EnvironmentalStats {
  totalRecords: number;
  averageTemperature: number;
  averageWindSpeed: number;
  averagePM10: number;
  averagePM25: number;
  averageSulphurDioxide: number;
  maxSulphurDioxide: number;
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
  weather: 'temperature_2m,wind_speed_10m,wind_direction_10m',
  airQuality: 'pm10,pm2_5,nitrogen_dioxide,sulphur_dioxide,ozone'
} as const;