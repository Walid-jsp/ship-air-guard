'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend 
} from 'chart.js';
import { Ship, Fan, Thermometer, Wind, AlertOctagon, CheckCircle, Activity } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SensorData {
  nom_station: string;
  nom_polluant: string;
  valeur: number;
  unite: string;
  seuil_danger: number;
}

export default function Home() {
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fanSpeed, setFanSpeed] = useState(0); // Vitesse du ventilateur en %

  // Fonction pour récupérer les données et calculer la ventilation
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/pollution');
      const sensorReadings = response.data;
      setData(sensorReadings);

      // LOGIQUE INTELLIGENTE DE VENTILATION
      // On cherche le polluant le plus critique par rapport à son seuil
      let maxStress = 0;
      
      sensorReadings.forEach((reading: SensorData) => {
        // On calcule un pourcentage de danger (ex: si CO2 est à 1200 pour un seuil de 1000, stress = 1.2)
        const stress = reading.valeur / reading.seuil_danger;
        if (stress > maxStress) maxStress = stress;
      });

      // Si le stress dépasse 0.5 (50% du seuil), on allume la ventilation
      // Formule : on mappe le stress vers un % de 0 à 100
      let calculatedFanSpeed = 0;
      if (maxStress > 0.5) {
        calculatedFanSpeed = Math.min((maxStress - 0.5) * 200, 100); // Facteur d'accélération
      }
      
      setFanSpeed(Math.floor(calculatedFanSpeed));
      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Rafraichir toutes les 5 secondes pour la démo
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  // Configuration graphique
  const chartData = {
    labels: data.map(d => d.nom_polluant),
    datasets: [{
      label: 'Valeur mesurée',
      data: data.map(d => d.valeur),
      backgroundColor: data.map(d => d.valeur > d.seuil_danger ? '#ef4444' : '#3b82f6'),
      borderRadius: 5,
    }],
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 font-sans p-6">
      
      {/* HEADER */}
      <header className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Ship className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">SHIP AIR GUARD</h1>
            <p className="text-blue-400">Monitoring Espace Confiné - Cale Moteur</p>
          </div>
        </div>
        <button onClick={fetchData} className="bg-slate-700 px-4 py-2 rounded hover:bg-slate-600 transition">
          Rafraîchir Données
        </button>
      </header>

      {loading ? (
         <div className="text-center animate-pulse mt-20">Communication avec le capteur...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* PANNEAU DE CONTRÔLE VENTILATION (C'est le cœur de ton use-case) */}
          <div className={`col-span-1 rounded-2xl p-8 shadow-xl border-2 flex flex-col items-center justify-center relative overflow-hidden ${fanSpeed > 80 ? 'bg-red-900/30 border-red-500' : 'bg-slate-800 border-slate-700'}`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Wind /> SYSTÈME VENTILATION
            </h2>
            
            {/* Icône Ventilateur qui tourne selon la vitesse */}
            <div className="relative mb-6">
               <Fan 
                 size={120} 
                 className={`text-white transition-all duration-1000`} 
                 style={{ 
                   animation: fanSpeed > 0 ? `spin ${100 / (fanSpeed || 1)}s linear infinite` : 'none',
                   color: fanSpeed > 80 ? '#ef4444' : (fanSpeed > 0 ? '#3b82f6' : '#64748b')
                 }} 
               />
               {/* Effet de vent si actif */}
               {fanSpeed > 0 && <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>}
            </div>

            <div className="w-full bg-slate-900 rounded-full h-6 mb-2 border border-slate-600">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${fanSpeed > 80 ? 'bg-red-500' : 'bg-blue-500'}`} 
                style={{ width: `${fanSpeed}%` }}
              ></div>
            </div>
            <p className="text-3xl font-mono font-bold">{fanSpeed}% <span className="text-sm font-sans text-slate-400">PUISSANCE</span></p>
            
            <p className="mt-4 text-center text-sm text-slate-300">
              {fanSpeed === 0 ? "Qualité de l'air optimale. Ventilation en veille." : 
               fanSpeed > 80 ? "⚠️ DANGER DÉTECTÉ : EXTRACTION MAXIMALE ACTIVÉE" : 
               "Pollution détectée : Régulation active."}
            </p>
          </div>

          {/* DONNÉES CAPTEURS & GRAPHIQUE */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Cartes de valeurs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.map((sensor, idx) => (
                <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-400 text-sm font-bold">{sensor.nom_polluant}</span>
                    {sensor.nom_polluant.includes("Temp") ? <Thermometer size={20} className="text-orange-400"/> : <Activity size={20} className="text-blue-400"/>}
                  </div>
                  <div className="flex items-end gap-2">
                    <span className={`text-3xl font-bold ${sensor.valeur > sensor.seuil_danger ? 'text-red-500' : 'text-white'}`}>
                      {sensor.valeur}
                    </span>
                    <span className="text-sm text-slate-500 mb-1">{sensor.unite}</span>
                  </div>
                  <div className="mt-2 text-xs">
                    Seuil alerte: {sensor.seuil_danger} {sensor.unite}
                  </div>
                </div>
              ))}
            </div>

            {/* Graphique */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-80">
              <Bar 
                data={chartData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { grid: { color: '#334155' } } }
                }} 
              />
            </div>
          </div>

        </div>
      )}

      <style jsx global>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}