'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, CheckCircle, Ship, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';

// Types de métriques disponibles
type MetricType = 'temperature' | 'co2' | 'voc';

interface MetricConfig {
  label: string;
  unit: string;
  threshold: {
    warning: number;
    danger: number;
  };
}

const METRICS: Record<MetricType, MetricConfig> = {
  temperature: {
    label: 'Température',
    unit: '°C',
    threshold: { warning: 35, danger: 38 }
  },
  co2: {
    label: 'CO₂',
    unit: 'ppm',
    threshold: { warning: 800, danger: 1000 }
  },
  voc: {
    label: 'COV',
    unit: 'ppb',
    threshold: { warning: 150, danger: 250 }
  }
};

export default function MonitoringPage() {
  const [currentMetric, setCurrentMetric] = useState<MetricType>('temperature');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Récupération des vraies données environnementales
  const { data: environmentalData, loading, error } = useEnvironmentalData();

  // Fonction pour obtenir la valeur actuelle selon la métrique sélectionnée
  const getCurrentValue = (): number => {
    if (!environmentalData) return 0;
    
    switch (currentMetric) {
      case 'temperature':
        return environmentalData.temperature || 0;
      case 'co2':
        return environmentalData.carbon_dioxide || 0;
      case 'voc':
        return environmentalData.carbon_monoxide || 0;
      default:
        return 0;
    }
  };

  // Fonction utilitaire pour déterminer le style Tailwind en fonction du seuil
  const getStatusColor = (valeur: number, config: MetricConfig) => {
    if (valeur >= config.threshold.danger) {
      return 'border-red-500 bg-red-950/90 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse z-20';
    }
    if (valeur >= config.threshold.warning) {
      return 'border-orange-500 bg-orange-950/80 shadow-[0_0_20px_rgba(251,146,60,0.4)] z-15';
    }
    return 'border-cyan-800/50 bg-slate-900/80 hover:border-cyan-400/80 hover:bg-slate-800/90 z-10';
  };

  const currentValue = getCurrentValue();
  const metricConfig = METRICS[currentMetric];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black text-white font-sans p-4 md:p-8 overflow-hidden">
        
        {/* Elements de fond d'ambiance */}
        <div className="fixed inset-0 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl mix-blend-overlay"></div>
           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl mix-blend-overlay"></div>
        </div>

        {/* En-tête du Dashboard */}
        <header className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4 pt-20">
          <div className="flex items-center gap-4 self-start flex-wrap">
            <Link href="/dashboard" className="group p-3 rounded-full bg-slate-800/50 border border-slate-700 hover:bg-slate-700 hover:border-cyan-500 transition-all">
              <ArrowLeft className="w-5 h-5 text-slate-300 group-hover:text-cyan-400 transition" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <Ship className="w-8 h-8 text-cyan-400" />
                <span className="bg-gradient-to-r from-blue-100 to-cyan-100 bg-clip-text text-transparent">
                  Plan Général du Navire
                </span>
              </h1>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Système de surveillance actif • Flux temps réel
              </p>
            </div>

            {/* Bouton de sélection de métrique */}
            <div className="relative ml-0 md:ml-6">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/70 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-cyan-500 transition-all"
              >
                <span className="text-sm font-semibold text-cyan-400">{metricConfig.label}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Menu déroulant */}
              {isDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 md:right-0 md:left-auto w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  {Object.entries(METRICS).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setCurrentMetric(key as MetricType);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-slate-800 transition-colors ${
                        currentMetric === key ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Légende */}
          <div className="flex gap-6 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 backdrop-blur-sm flex-wrap">
              <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Normal
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-300 font-medium">
                  <AlertTriangle className="w-4 h-4 text-orange-500" /> Vigilance
              </div>
              <div className="flex items-center gap-2 text-sm text-red-300 font-medium">
                  <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" /> Critique
              </div>
          </div>
        </header>

        {/* Zone du Plan Bateau */}
        <main className="max-w-[1400px] mx-auto relative flex justify-center items-center py-6 md:py-10">
          
          {/* Conteneur principal du plan */}
          {/* Utilisation d'un aspect-ratio pour garder la forme du bateau responsive */}
          <div className="relative w-full aspect-[2.8/1] bg-slate-900/30 rounded-[3rem] border border-slate-800/50 shadow-2xl shadow-blue-900/10 backdrop-blur-sm overflow-hidden">
              
              {/* --- NOUVEAU SVG DU BATEAU (Plus réaliste style plan d'architecte) --- */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none select-none p-4 md:p-8" viewBox="0 0 1200 400" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                      {/* Motif de grille pour le fond "plan technique" */}
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1"/>
                      </pattern>
                  </defs>

                  {/* Grille de fond */}
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Groupe principal du dessin du navire */}
                  <g stroke="currentColor" fill="none" className="text-slate-600/60">
                      {/* 1. Contour de la coque (Vue de dessus - Ligne de flottaison) */}
                      {/* Forme plus travaillée : Arrière carré arrondi, longue section centrale, avant effilé */}
                      <path d="M 100,80 
                               L 800,80 
                               C 1000,80 1080,150 1150,200 
                               C 1080,250 1000,320 800,320 
                               L 100,320 
                               C 50,320 30,270 30,200 
                               C 30,130 50,80 100,80 Z" 
                            strokeWidth="3" className="text-slate-500/80 drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]" />

                      {/* 2. Ligne centrale (axe du navire) */}
                      <line x1="30" y1="200" x2="1150" y2="200" strokeWidth="1" strokeDasharray="10,5" className="text-slate-700" />

                      {/* 3. Cloisons transversales (Séparation des zones) */}
                      {/* Cloison séparant Cuisine/Cabine de la zone centrale */}
                      <line x1="350" y1="80" x2="350" y2="320" strokeWidth="2" strokeDasharray="4,2" />
                      {/* Cloison centrale */}
                      <line x1="600" y1="80" x2="600" y2="320" strokeWidth="2" strokeDasharray="4,2" />
                      {/* Cloison séparant la zone machine de l'avant */}
                      <line x1="850" y1="80" x2="850" y2="320" strokeWidth="2" strokeDasharray="4,2" />

                      {/* 4. Détails techniques (Hélices, etc.) pour le look "plan" */}
                      <circle cx="70" cy="200" r="15" strokeWidth="1" className="text-slate-700" /> {/* Mèche de gouvernail */}
                      <path d="M 1120,200 L 1140,200 M 1130,190 L 1130,210" strokeWidth="2" className="text-cyan-800/60" /> {/* Marque de proue */}
                      
                  </g>

                  {/* Textes d'indication sur le plan */}
                  <text x="60" y="205" className="text-[10px] fill-slate-500 font-mono uppercase tracking-widest" transform="rotate(-90 60,205)">Poupe</text>
                  <text x="1120" y="205" className="text-[10px] fill-slate-500 font-mono uppercase tracking-widest" transform="rotate(90 1120,205)">Proue</text>
                  
                  {/* Zones grisées pour suggérer les espaces techniques */}
                  <rect x="600" y="90" width="250" height="220" fill="rgba(15, 23, 42, 0.3)" stroke="none" /> {/* Zone machine */}
              </svg>

              {/* --- MODULE UNIQUE : SALLE COMMUNE (Centre - Zone Technique) --- */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] min-w-[200px] p-4 md:p-6 rounded-2xl border-2 backdrop-blur-lg transition-all duration-500 group cursor-pointer ${getStatusColor(currentValue, metricConfig)}`}>
                  <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors flex items-center gap-2">
                          Salle Commune
                          {currentValue >= metricConfig.threshold.danger && <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />}
                      </h3>
                  </div>
                  
                  {loading ? (
                    <div className="flex items-center justify-center h-20">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                    </div>
                  ) : error ? (
                    <div className="text-red-400 text-sm">Erreur de chargement</div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2">
                          <span className={`text-4xl md:text-5xl font-black font-mono tracking-tighter ${
                            currentValue >= metricConfig.threshold.danger ? 'text-red-100' : 
                            currentValue >= metricConfig.threshold.warning ? 'text-orange-100' : 
                            'text-white'
                          }`}>
                              {Math.round(currentValue)}
                          </span>
                          <span className="text-sm font-bold text-slate-400">{metricConfig.unit}</span>
                      </div>
                      
                      {/* Barre de progression visuelle */}
                      <div className="mt-4 h-2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                          <div 
                              className={`h-full transition-all duration-1000 ease-out ${
                                currentValue >= metricConfig.threshold.danger ? 'bg-gradient-to-r from-red-600 to-orange-600' : 
                                currentValue >= metricConfig.threshold.warning ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                                'bg-gradient-to-r from-cyan-600 to-blue-600'
                              }`}
                              style={{ 
                                width: `${Math.min(100, (currentValue / metricConfig.threshold.danger) * 100)}%` 
                              }}
                          ></div>
                      </div>

                      {/* Indicateurs de seuils */}
                      <div className="mt-4 flex justify-between text-xs text-slate-400">
                        <span>Normal: &lt;{metricConfig.threshold.warning}</span>
                        <span className="text-orange-400">Vigilance: {metricConfig.threshold.warning}</span>
                        <span className="text-red-400">Critique: {metricConfig.threshold.danger}</span>
                      </div>
                    </>
                  )}
              </div>
              
          </div>
        </main>
      </div>
    </>
  );
}