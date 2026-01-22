'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  EnvironmentalData, 
  MARSEILLE_OLD_PORT, 
  OPEN_METEO_APIS, 
  API_PARAMETERS 
} from '@/types/environmental';

interface UseEnvironmentalDataReturn {
  data: EnvironmentalData | null;
  loading: boolean;
  error: string | null;
  lastUpdate: string | null;
  refetch: () => Promise<void>;
}

// Intervalle de mise à jour (1 minute = 60000ms)
const UPDATE_INTERVAL = 60000;

export const useEnvironmentalData = (): UseEnvironmentalDataReturn => {
  const [data, setData] = useState<EnvironmentalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  // Fonction pour récupérer les données météo
  const fetchWeatherData = async () => {
    const params = new URLSearchParams({
      latitude: MARSEILLE_OLD_PORT.latitude.toString(),
      longitude: MARSEILLE_OLD_PORT.longitude.toString(),
      current: API_PARAMETERS.weather,
      timezone: MARSEILLE_OLD_PORT.timezone
    });

    const response = await fetch(`${OPEN_METEO_APIS.weather}?${params}`);
    if (!response.ok) {
      throw new Error(`Erreur météo: ${response.status}`);
    }

    const result = await response.json();
    const current = result.current;

    return {
      temperature: current.temperature_2m || 0,
      windSpeed: current.wind_speed_10m || 0,
      windDirection: current.wind_direction_10m || 0,
    };
  };

  // Fonction pour récupérer les données de qualité de l'air
  const fetchAirQualityData = async () => {
    const params = new URLSearchParams({
      latitude: MARSEILLE_OLD_PORT.latitude.toString(),
      longitude: MARSEILLE_OLD_PORT.longitude.toString(),
      current: API_PARAMETERS.airQuality,
      timezone: MARSEILLE_OLD_PORT.timezone
    });

    const response = await fetch(`${OPEN_METEO_APIS.airQuality}?${params}`);
    if (!response.ok) {
      throw new Error(`Erreur qualité de l'air: ${response.status}`);
    }

    const result = await response.json();
    const current = result.current;

    return {
      pm10: current.pm10 || 0,
      pm25: current.pm2_5 || 0,
      carbon_dioxide: current.carbon_dioxide || 0,
      carbon_monoxide: current.carbon_monoxide || 0,
      ozone: current.ozone || 0,
    };
  };

  // Fonction pour sauvegarder les données en base (optionnelle en dev)
  const saveToDatabase = async (environmentalData: EnvironmentalData): Promise<void> => {
    try {
      const response = await fetch('/api/environmental/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(environmentalData),
      });

      if (!response.ok) {
        console.warn('⚠️ Sauvegarde BDD échouée:', response.status, '(Mode développement - données récupérées quand même)');
      } else {
        console.log('✅ Données environnementales sauvegardées en BDD');
      }
    } catch (err) {
      console.warn('⚠️ Erreur sauvegarde BDD:', err, '(Mode développement - données récupérées quand même)');
    }
  };

  // Fonction principale pour récupérer toutes les données
  const fetchEnvironmentalData = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      
      // Récupération en parallèle des données météo et qualité de l'air
      const [weatherData, airQualityData] = await Promise.all([
        fetchWeatherData(),
        fetchAirQualityData(),
      ]);

      // Combinaison des données
      const combinedData: EnvironmentalData = {
        ...weatherData,
        ...airQualityData,
        timestamp: new Date().toISOString(),
        latitude: MARSEILLE_OLD_PORT.latitude,
        longitude: MARSEILLE_OLD_PORT.longitude,
      };

      setData(combinedData);
      setLastUpdate(new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }));

      // Sauvegarde en base de données (en arrière-plan)
      saveToDatabase(combinedData);

    } catch (err) {
      console.error('Erreur récupération données environnementales:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  // Effet pour la récupération initiale et l'intervalle
  useEffect(() => {
    // Récupération initiale
    fetchEnvironmentalData();

    // Mise à jour toutes les minutes
    const interval = setInterval(fetchEnvironmentalData, UPDATE_INTERVAL);

    // Nettoyage
    return () => clearInterval(interval);
  }, [fetchEnvironmentalData]);

  return {
    data,
    loading,
    error,
    lastUpdate,
    refetch: fetchEnvironmentalData,
  };
};