'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Ship, Wind, AlertTriangle } from 'lucide-react';

// Configuration des graphiques
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// On définit le format des données pour TypeScript
interface PollutionData {
  nom_station: string;
  nom_polluant: string;
  valeur: number;
  unite: string;
}

export default function Home() {
  const [data, setData] = useState<PollutionData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les données
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/pollution');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Préparation du graphique
  const chartData = {
    labels: data.map(d => `${d.nom_station} (${d.nom_polluant})`),
    datasets: [{
      label: 'Concentration (µg/m³)',
      data: data.map(d => d.valeur),
      backgroundColor: data.map(d => d.valeur > 50 ? '#ef4444' : '#22c55e'),
    }],
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <header className="flex items-center gap-3 mb-10 border-b border-slate-700 pb-4">
        <Ship size={40} className="text-blue-400" />
        <div>
          <h1 className="text-3xl font-bold">SHIP AIR GUARD</h1>
          <p className="text-slate-400">Monitoring Portuaire Temps Réel</p>
        </div>
      </header>

      {loading ? (
        <div className="text-center animate-pulse">Chargement des données...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Liste des alertes */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex gap-2"><AlertTriangle className="text-yellow-500"/> Valeurs Actuelles</h2>
            <div className="space-y-3 h-64 overflow-y-auto">
              {data.length === 0 ? <p>Aucune donnée disponible sur la zone.</p> : null}
              {data.map((m, i) => (
                <div key={i} className="flex justify-between bg-slate-700 p-3 rounded">
                  <span>{m.nom_station} - <b>{m.nom_polluant}</b></span>
                  <span className={m.valeur > 50 ? 'text-red-400 font-bold' : 'text-green-400'}>{m.valeur} {m.unite}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Graphique */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <h2 className="text-xl font-semibold mb-4 flex gap-2"><Wind className="text-blue-400"/> Graphique</h2>
             <div className="h-64">
              <Bar data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}