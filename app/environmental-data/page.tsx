'use client';

import { useState, useEffect } from 'react';
import { Database, Calendar, MapPin, Thermometer, Wind, AlertTriangle, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';

interface EnvironmentalRecord {
  id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  temperature: number | null;
  pm10: number | null;
  pm25: number | null;
  carbon_dioxide: number | null;
  carbon_monoxide: number | null;
  ozone: number | null;
  dataSource: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: EnvironmentalRecord[];
  period: string;
  from: string;
  to: string;
}

export default function EnvironmentalDataPage() {
  const [data, setData] = useState<EnvironmentalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('24');
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/environmental/history?hours=${period}&limit=200`);
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        setData(result.data);
        setLastUpdate(new Date().toLocaleTimeString('fr-FR'));
      } else {
        setError('Erreur lors de la récupération des données');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const formatValue = (value: number | null, unit = '') => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(1)}${unit}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const getQualityLevel = (type: string, value: number | null) => {
    if (value === null) return { level: 'unknown', color: 'text-gray-500' };
    
    switch (type) {
      case 'pm10':
        if (value <= 40) return { level: 'bon', color: 'text-green-500' };
        if (value <= 80) return { level: 'moyen', color: 'text-orange-500' };
        return { level: 'mauvais', color: 'text-red-500' };

      default:
        return { level: 'ok', color: 'text-blue-500' };
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-cyan-400" size={32} />
              <h1 className="text-3xl font-bold text-white">Données Environnementales Stockées</h1>
            </div>
            <p className="text-slate-400">
              Historique des données de qualité de l'air et météorologiques du Vieux-Port de Marseille
            </p>
          </div>

          {/* Contrôles */}
          <div className="bg-slate-900/50 rounded-2xl p-6 mb-6 border border-slate-800">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-300">Période:</label>
                <select 
                  value={period} 
                  onChange={(e) => setPeriod(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="1">Dernière heure</option>
                  <option value="6">6 dernières heures</option>
                  <option value="24">24 dernières heures</option>
                  <option value="72">3 derniers jours</option>
                  <option value="168">7 derniers jours</option>
                </select>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400">
                  {data.length} enregistrements • Dernière MAJ: {lastUpdate}
                </span>
                <button
                  onClick={fetchData}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  Actualiser
                </button>
              </div>
            </div>
          </div>


          {/* États de chargement */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
              <span className="ml-3 text-slate-400">Chargement des données...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle size={20} />
                <span className="font-medium">Erreur</span>
              </div>
              <p className="mt-2 text-red-300">{error}</p>
            </div>
          )}

          {/* Tableau des données */}
          {!loading && !error && (
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          Horodatage
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Thermometer size={16} />
                          Temp. (°C)
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        CO₂ (ppm)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        COV (ppb)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                          Aucune donnée disponible pour la période sélectionnée
                        </td>
                      </tr>
                    ) : (
                      data.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 text-sm text-slate-300">
                            <div className="font-medium">{formatDate(record.timestamp)}</div>
                            <div className="text-xs text-slate-500">{record.dataSource}</div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="font-medium text-orange-400">
                              {formatValue(record.temperature, '°C')}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`font-medium ${getQualityLevel('pm10', record.pm10).color}`}>
                              {formatValue(record.carbon_dioxide)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`font-medium ${getQualityLevel('pm10', record.pm25).color}`}>
                              {formatValue(record.carbon_monoxide)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer info */}
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>Données en temps réel récupérées depuis l'API Open-Meteo • Coordonnées: 43.2951°N, 5.3744°E</p>
          </div>
        </div>
      </main>
    </>
  );
}