import { 
  QualityLevel, 
  WeatherLevel, 
  ENVIRONMENTAL_THRESHOLDS,
  EnvironmentalData 
} from '@/types/environmental';

/**
 * Détermine le niveau de qualité pour un polluant donné
 */
export const getQualityLevel = (
  value: number, 
  thresholds: { good: number, moderate: number, poor: number }
): QualityLevel => {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.moderate) return 'moderate';
  return 'poor';
};

/**
 * Détermine le niveau météorologique
 */
export const getWeatherLevel = (
  value: number,
  type: 'temperature'
): WeatherLevel => {
  if (type === 'temperature') {
    if (value <= ENVIRONMENTAL_THRESHOLDS.temperature.cold) return 'cold';
    if (value <= ENVIRONMENTAL_THRESHOLDS.temperature.comfortable) return 'comfortable';
    return 'hot';
  }
  return 'comfortable';
};

/**
 * Retourne les classes CSS selon le niveau de qualité
 */
export const getQualityColorClass = (level: QualityLevel): string => {
  switch (level) {
    case 'good':
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    case 'moderate':
      return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    case 'poor':
      return 'text-red-400 bg-red-500/10 border-red-500/30';
    default:
      return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
  }
};

/**
 * Retourne les classes CSS selon le niveau météo
 */
export const getWeatherColorClass = (level: WeatherLevel): string => {
  switch (level) {
    case 'cold':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    case 'comfortable':
    case 'calm':
    case 'moderate':
      return 'text-green-400 bg-green-500/10 border-green-500/30';
    case 'hot':
    case 'strong':
      return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    default:
      return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
  }
};

/**
 * Évalue la qualité globale de l'air
 */
export const getOverallAirQuality = (data: EnvironmentalData): QualityLevel => {
  const levels: QualityLevel[] = [
    getQualityLevel(data.pm10, ENVIRONMENTAL_THRESHOLDS.pm10),
    getQualityLevel(data.pm25, ENVIRONMENTAL_THRESHOLDS.pm25),
    getQualityLevel(data.ozone, ENVIRONMENTAL_THRESHOLDS.ozone),
  ];

  // Si au moins un niveau est "poor", la qualité globale est "poor"
  if (levels.includes('poor')) return 'poor';
  // Si au moins un niveau est "moderate", la qualité globale est "moderate"  
  if (levels.includes('moderate')) return 'moderate';
  // Sinon, la qualité est "good"
  return 'good';
};

/**
 * Retourne un message descriptif selon le niveau de qualité
 */
export const getQualityMessage = (level: QualityLevel): string => {
  switch (level) {
    case 'good':
      return 'Conditions favorables pour les activités maritimes';
    case 'moderate':
      return 'Surveillance recommandée pour les personnes sensibles';
    case 'poor':
      return 'Attention particulière requise - Limiter l\'exposition';
    default:
      return 'Données insuffisantes pour évaluer la qualité';
  }
};

/**
 * Formate un timestamp en heure locale française
 */
export const formatTimeStamp = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Formate une date en format français complet
 */
export const formatDate = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Vérifie si une valeur de polluant dépasse le seuil critique
 */
export const isAboveCriticalThreshold = (
  value: number,
  pollutant: 'pm10' | 'pm25' | 'ozone'
): boolean => {
  return getQualityLevel(value, ENVIRONMENTAL_THRESHOLDS[pollutant]) === 'poor';
};

/**
 * Retourne un conseil selon la qualité de l'air pour les activités maritimes
 */
export const getMaritimeAdvice = (overallLevel: QualityLevel): string => {
  switch (overallLevel) {
    case 'good':
      return '✅ Conditions optimales pour toutes les activités sur le port';
    case 'moderate':
      return '⚠️ Activités normales possibles, surveillance des équipes sensibles';
    case 'poor':
      return '🚨 Conditions défavorables - Équipements de protection recommandés';
    default:
      return 'ℹ️ Évaluation en cours';
  }
};

/**
 * Calcule la tendance entre deux mesures (pour affichage flèche ↗️↘️)
 */
export const getTrend = (currentValue: number, previousValue: number): 'up' | 'down' | 'stable' => {
  const difference = currentValue - previousValue;
  const threshold = previousValue * 0.05; // 5% de variation considérée comme stable
  
  if (Math.abs(difference) <= threshold) return 'stable';
  return difference > 0 ? 'up' : 'down';
};

/**
 * Retourne une icône selon la tendance
 */
export const getTrendIcon = (trend: 'up' | 'down' | 'stable'): string => {
  switch (trend) {
    case 'up': return '↗️';
    case 'down': return '↘️';
    case 'stable': return '➡️';
  }
};