'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';

interface TestResult {
  name: string;
  success: boolean;
  data?: any;
  error?: string;
  duration?: number;
}

export default function TestEnvironmentalPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setResults([]);
    
    const tests: Array<{ name: string; url: string }> = [
      {
        name: 'API Open-Meteo Direct',
        url: '/api/environmental/current'
      },
      {
        name: 'API Météo Open-Meteo Raw',
        url: 'https://api.open-meteo.com/v1/forecast?latitude=43.2951&longitude=5.3744&current=temperature_2m,wind_speed_10m,wind_direction_10m&timezone=Europe/Paris'
      },
      {
        name: 'API Qualité Air Open-Meteo Raw',
        url: 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=43.2951&longitude=5.3744&current=pm10,pm2_5,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=Europe/Paris'
      }
    ];

    for (const test of tests) {
      const startTime = Date.now();
      try {
        const response = await fetch(test.url);
        const data = await response.json();
        const duration = Date.now() - startTime;
        
        setResults(prev => [...prev, {
          name: test.name,
          success: response.ok,
          data,
          duration
        }]);
      } catch (error) {
        const duration = Date.now() - startTime;
        setResults(prev => [...prev, {
          name: test.name,
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
          duration
        }]);
      }
    }
    
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white pt-20 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Test des APIs Environnementales</h1>
            <p className="text-slate-400 mb-6">
              Test de connectivité avec les APIs Open-Meteo pour les données du Vieux-Port de Marseille
            </p>
            
            <button
              onClick={runTests}
              disabled={loading}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              {loading ? 'Tests en cours...' : 'Lancer les Tests'}
            </button>
          </div>

          {/* Résultats des tests */}
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`rounded-xl border p-6 ${
                  result.success
                    ? 'bg-emerald-900/20 border-emerald-500/30'
                    : 'bg-red-900/20 border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    )}
                    <h3 className="text-xl font-semibold">{result.name}</h3>
                  </div>
                  {result.duration && (
                    <span className="text-sm text-slate-400">
                      {result.duration}ms
                    </span>
                  )}
                </div>

                {result.error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-300 text-sm">{result.error}</p>
                  </div>
                )}

                {result.data && (
                  <div className="bg-slate-900/50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs text-slate-300">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {loading && results.length > 0 && (
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-2 text-cyan-400">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Test {results.length + 1} en cours...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}