import { NextResponse } from 'next/server';

// Coordonnées du Vieux-Port de Marseille
const LATITUDE = 43.2951;
const LONGITUDE = 5.3744;

// URLs des APIs Open-Meteo
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_API_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export async function GET() {
  try {
    // Récupération des données météorologiques
    const weatherParams = new URLSearchParams({
      latitude: LATITUDE.toString(),
      longitude: LONGITUDE.toString(),
      current: 'temperature_2m',
      timezone: 'Europe/Paris'
    });

    // Récupération des données de qualité de l'air
    const airQualityParams = new URLSearchParams({
      latitude: LATITUDE.toString(),
      longitude: LONGITUDE.toString(),
      current: 'pm10,pm2_5,ozone',
      timezone: 'Europe/Paris'
    });

    // Appels parallèles aux deux APIs
    const [weatherResponse, airQualityResponse] = await Promise.all([
      fetch(`${WEATHER_API_URL}?${weatherParams}`),
      fetch(`${AIR_QUALITY_API_URL}?${airQualityParams}`)
    ]);

    if (!weatherResponse.ok) {
      throw new Error(`Erreur API météo: ${weatherResponse.status} ${weatherResponse.statusText}`);
    }

    if (!airQualityResponse.ok) {
      throw new Error(`Erreur API qualité de l'air: ${airQualityResponse.status} ${airQualityResponse.statusText}`);
    }

    const weatherData = await weatherResponse.json();
    const airQualityData = await airQualityResponse.json();

    // Formatage des données de réponse
    const formattedData = {
      location: {
        name: "Vieux-Port de Marseille",
        latitude: LATITUDE,
        longitude: LONGITUDE,
        timezone: weatherData.timezone || "Europe/Paris"
      },
      timestamp: new Date().toISOString(),
      weather: {
        temperature: weatherData.current?.temperature_2m || null,
        units: {
          temperature: "°C"
        }
      },
      airQuality: {
        pm10: airQualityData.current?.pm10 || null,
        pm25: airQualityData.current?.pm2_5 || null,
        ozone: airQualityData.current?.ozone || null,
        units: {
          all: "µg/m³"
        }
      },
      sources: {
        weather: "Open-Meteo Weather API",
        airQuality: "Open-Meteo Air Quality API"
      }
    };

    return NextResponse.json({
      success: true,
      data: formattedData,
      message: "Données environnementales récupérées avec succès"
    });

  } catch (error) {
    console.error('Erreur récupération données Open-Meteo:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des données environnementales',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        location: {
          name: "Vieux-Port de Marseille",
          latitude: LATITUDE,
          longitude: LONGITUDE
        }
      },
      { status: 500 }
    );
  }
}