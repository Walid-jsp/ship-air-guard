'use client';

import React from 'react';
import { 
  Thermometer, 
  Wind, 
  Gauge, 
  AlertTriangle, 
  CheckCircle, 
  Ship, 
  Waves,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';
import { 
  ENVIRONMENTAL_THRESHOLDS,
  QualityLevel,
  MARSEILLE_OLD_PORT 
} from '@/types/environmental';
import {
  getQualityLevel,
  getWeatherLevel,
  getQualityColorClass,
  getWeatherColorClass,
  getOverallAirQuality,
  getQualityMessage,
  getMaritimeAdvice,
  formatTimeStamp
} from '@/utils/environmental';

// Composant carte de données
interface DataCardProps {
  title: string;
  value: number | null;
  unit: string;
  icon: React.ReactNode;
  level?: QualityLevel;
  description?: string;
}

const DataCard: React.FC<DataCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon, 
  level, 
  description
}) => {
  const colorClass = level ? getQualityColorClass(level) : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
  const displayValue = value !== null ? value.toFixed(1) : '--';
  return (
    <div className={`rounded-xl border p-4 backdrop-blur-sm transition-all hover:scale-105 ${colorClass}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold opacity-80">{title}</h3>
        {icon}
      </div>
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">
            {displayValue}
          </span>
          <span className="text-xs opacity-70">{unit}</span>
        </div>
        {description && (
          <p className="text-xs opacity-60">{description}</p>
        )}
      </div>
    </div>
  );
};

const EnvironmentalMonitor: React.FC = () => {
  const { data, loading, error, lastUpdate, refetch } = useEnvironmentalData();

  if (loading && !data) {
    return (
      <div className="bg-slate-900/50 rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-center gap-3 text-cyan-400">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg font-semibold">Récupération des données environnementales...</span>
        </div>
        <p className="text-center text-slate-400 text-sm mt-2">
          Connexion aux APIs Open-Meteo pour le {MARSEILLE_OLD_PORT.name}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 rounded-2xl border border-red-500/30 p-6">
        <div className="flex items-center gap-3 text-red-400 mb-4">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Erreur de récupération des données</h3>
        </div>
        <p className="text-red-300 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-slate-900/50 rounded-2xl border border-slate-700/50 p-6 text-center text-slate-400">
        Aucune donnée disponible
      </div>
    );
  }

  // Calcul des niveaux de qualité en utilisant nos utilitaires
  const pm10Level = getQualityLevel(data.pm10, ENVIRONMENTAL_THRESHOLDS.pm10);
  const pm25Level = getQualityLevel(data.pm25, ENVIRONMENTAL_THRESHOLDS.pm25);
  const ozoneLevel = getQualityLevel(data.ozone, ENVIRONMENTAL_THRESHOLDS.ozone);

  // Évaluation globale de la qualité de l'air
  const overallAirQuality = getOverallAirQuality(data);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-cyan-500/20 border border-cyan-500/30">
            <Ship className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Surveillance Environnementale Maritime
            </h2>
            <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
              <Waves className="w-4 h-4" />
              {MARSEILLE_OLD_PORT.name} ({MARSEILLE_OLD_PORT.latitude}°N, {MARSEILLE_OLD_PORT.longitude}°E)
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock className="w-4 h-4" />
            <span>Dernière mise à jour: {lastUpdate || '--:--:--'}</span>
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="mt-1 px-3 py-1 text-xs bg-cyan-500/20 border border-cyan-500/30 rounded-md text-cyan-300 hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Actualiser'}
          </button>
        </div>
      </div>

      {/* Statut global */}
      <div className={`rounded-xl border p-4 ${getQualityColorClass(overallAirQuality)}`}>
        <div className="flex items-center gap-3">
          {overallAirQuality === 'good' ? (
            <CheckCircle className="w-8 h-8" />
          ) : (
            <AlertTriangle className="w-8 h-8" />
          )}
          <div>
            <h3 className="text-lg font-bold">
              Qualité de l'Air: {
                overallAirQuality === 'good' ? 'Bonne' :
                overallAirQuality === 'moderate' ? 'Modérée' : 'Mauvaise'
              }
            </h3>
            <p className="text-sm opacity-80">
              {getQualityMessage(overallAirQuality)}
            </p>
            <p className="text-xs opacity-70 mt-1">
              {getMaritimeAdvice(overallAirQuality)}
            </p>
          </div>
        </div>
      </div>

      {/* Données météorologiques */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-cyan-400" />
          Conditions Météorologiques
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DataCard
            title="Température"
            value={data.temperature}
            unit="°C"
            icon={<Thermometer className="w-5 h-5" />}
            description="Température à 2m"
          />
        </div>
      </div>

      {/* Données de qualité de l'air */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Gauge className="w-5 h-5 text-orange-400" />
          Qualité de l'Air
          <span className="text-sm text-slate-400 font-normal">(Focus pollution maritime)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DataCard
            title="PM10"
            value={data.pm10}
            unit="µg/m³"
            icon={<Gauge className="w-5 h-5" />}
            level={pm10Level}
            description="Particules fines"
          />
          <DataCard
            title="PM2.5"
            value={data.pm25}
            unit="µg/m³"
            icon={<Gauge className="w-5 h-5" />}
            level={pm25Level}
            description="Particules très fines"
          />
          <DataCard
            title="O₃"
            value={data.ozone}
            unit="µg/m³"
            icon={<Gauge className="w-5 h-5" />}
            level={ozoneLevel}
            description="Ozone"
          />
        </div>
      </div>

      {/* Légende */}
      <div className="bg-slate-900/30 rounded-xl border border-slate-700/50 p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Légende des Seuils</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-emerald-300">Bonne qualité</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-orange-300">Qualité modérée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-red-300">Mauvaise qualité</span>
          </div>
        </div>
        <p className="text-slate-400 text-xs mt-3">
          * Le dioxyde de soufre (SO₂) est particulièrement surveillé car il est émis par les navires utilisant du fuel lourd.
        </p>
        <p className="text-slate-400 text-xs mt-1">
          * Données mises à jour automatiquement toutes les minutes via les APIs Open-Meteo.
        </p>
      </div>

      {/* Mode de développement - Affichage des APIs utilisées */}
      <div className="bg-blue-900/20 rounded-xl border border-blue-500/30 p-4">
        <h4 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Informations Techniques
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-blue-200 font-medium">Source Météo:</span>
            <br />
            <span className="text-slate-300">api.open-meteo.com/v1/forecast</span>
          </div>
          <div>
            <span className="text-blue-200 font-medium">Source Qualité Air:</span>
            <br />
            <span className="text-slate-300">air-quality-api.open-meteo.com</span>
          </div>
          <div>
            <span className="text-blue-200 font-medium">Fréquence:</span>
            <br />
            <span className="text-slate-300">Toutes les 60 secondes</span>
          </div>
          <div>
            <span className="text-blue-200 font-medium">Sauvegarde:</span>
            <br />
            <span className="text-slate-300">PostgreSQL + Prisma</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalMonitor;