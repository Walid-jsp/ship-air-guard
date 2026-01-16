'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement 
} from 'chart.js';
import { Ship, Wind, AlertOctagon, CheckCircle, Activity, Droplets } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface PollutionData {
  nom_station: string;
  nom_polluant: string;
  valeur: number;
  unite: string;
}

export default function Home() {
  const [data, setData] = useState<PollutionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertLevel, setAlertLevel] = useState("Normal");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/pollution');
        setData(response.data);
        
        // Calcul simple du niveau d'alerte global
        const maxVal = Math.max(...response.data.map((d: any) => d.valeur));
        if (maxVal > 300) setAlertLevel("CRITIQUE");
        else if (maxVal > 50) setAlertLevel("ATTENTION");
        else setAlertLevel("NORMAL");

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Configuration graphique Barres
  const barChartData = {
    labels: data.map(d => d.nom_station.replace("Marseille ", "")), // On raccourcit les noms
    datasets: [{
      label: 'Niveau de Pollution',
      data: data.map(d => d.valeur),
      backgroundColor: data.map(d => d.valeur > 100 ? '#ef4444' : (d.valeur > 50 ? '#f59e0b' : '#10b981')),
      borderRadius: 5,
    }],
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 font-sans">
      
      {/* NAVBAR */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Ship className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">SHIP AIR GUARD</h1>
              <p className="text-xs text-blue-400 font-medium">SYSTEME DE SURVEILLANCE VACAO+</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${alertLevel === "CRITIQUE" ? "bg-red-500/20 text-red-400 border border-red-500" : "bg-green-500/20 text-green-400 border border-green-500"}`}>
              <Activity size={16}/> STATUT: {alertLevel}
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENU PRINCIPAL */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {loading ? (
           <div className="flex flex-col items-center justify-center h-64 gap-4">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
             <p className="animate-pulse text-slate-400">Connexion aux capteurs...</p>
           </div>
        ) : (
          <>
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Carte 1 : Résumé */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Wind size={100} />
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">CAPTEURS ACTIFS</h3>
                <p className="text-4xl font-bold text-white">{data.length}</p>
                <div className="mt-4 text-sm text-slate-400 flex items-center gap-1">
                  <CheckCircle size={14} className="text-green-400"/> Données temps réel
                </div>
              </div>

              {/* Carte 2 : Pic de pollution */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
                <h3 className="text-slate-400 text-sm font-medium mb-1">PIC DÉTECTÉ (MAX)</h3>
                {data.length > 0 ? (
                  <>
                    <p className={`text-4xl font-bold ${alertLevel === "CRITIQUE" ? "text-red-500" : "text-green-400"}`}>
                      {Math.max(...data.map(d => d.valeur))} <span className="text-lg text-slate-500">µg/m³</span>
                    </p>
                    <p className="text-sm text-slate-400 mt-2">Station la plus exposée</p>
                  </>
                ) : <p>-</p>}
              </div>

              {/* Carte 3 : Action Requise */}
              <div className={`border rounded-2xl p-6 shadow-xl ${alertLevel === "CRITIQUE" ? "bg-red-900/20 border-red-500" : "bg-slate-800 border-slate-700"}`}>
                <h3 className={`${alertLevel === "CRITIQUE" ? "text-red-400" : "text-slate-400"} text-sm font-medium mb-1`}>ACTION REQUISE</h3>
                <div className="flex items-center gap-3 mt-2">
                  {alertLevel === "CRITIQUE" ? (
                    <>
                      <AlertOctagon size={40} className="text-red-500" />
                      <div>
                        <p className="font-bold text-white">Évacuation / Masque</p>
                        <p className="text-xs text-red-300">Seuil de danger dépassé</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={40} className="text-green-500" />
                      <div>
                        <p className="font-bold text-white">Aucune action</p>
                        <p className="text-xs text-slate-400">Qualité de l'air acceptable</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* GRAPHIQUE ET LISTE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
              
              {/* Colonne Gauche : Graphique principal */}
              <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Activity className="text-blue-500"/> Analyse des polluants
                </h2>
                <div className="flex-1 min-h-0">
                  <Bar 
                    data={barChartData} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                        x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                      }
                    }} 
                  />
                </div>
              </div>

              {/* Colonne Droite : Liste détaillée */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg overflow-hidden flex flex-col">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Droplets className="text-blue-500"/> Détails par Zone
                </h2>
                <div className="overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {data.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-700/50 rounded-lg flex justify-between items-center hover:bg-slate-700 transition-colors">
                      <div>
                        <p className="font-medium text-sm text-white">{item.nom_station}</p>
                        <p className="text-xs text-slate-400">{item.nom_polluant}</p>
                      </div>
                      <div className={`text-right ${item.valeur > 100 ? "text-red-400" : "text-blue-300"}`}>
                        <p className="font-bold font-mono text-lg">{item.valeur}</p>
                        <p className="text-[10px] text-slate-500">{item.unite}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </main>
  );
}