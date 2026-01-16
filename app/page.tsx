'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement 
} from 'chart.js';
import { Ship, Wind, AlertOctagon, CheckCircle, Activity, Droplets, Zap, Globe, Shield, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Navbar from './components/Navbar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface PollutionData {
  nom_station: string;
  nom_polluant: string;
  valeur: number;
  unite: string;
}

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
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

  // Si on veut afficher le dashboard, sinon affiche la page d'accueil
  if (showDashboard) {
    return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0f172a] text-slate-100 font-sans">
      
      {/* NAVBAR */}
      <nav className="relative z-50 border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-lg shadow-lg">
              <Ship className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">SHIP AIR GUARD</h1>
              <p className="text-xs text-slate-400 font-medium">Tableau de Bord</p>
            </div>
          </div>
          <Link href="/" className="px-6 py-2 rounded-lg border border-slate-600 text-white font-semibold hover:border-blue-500 transition">
            Retour à l'accueil
          </Link>
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
    </>
    );
  }

  // PAGE D'ACCUEIL MODERNE
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white font-sans overflow-hidden">
      
      {/* Éléments de fond animés */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* NAVBAR */}
      <nav className="relative z-50 border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-lg shadow-lg">
              <Ship className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">SHIP AIR GUARD</h1>
              <p className="text-xs text-slate-400 font-medium">Surveillance Qualité de l'Air</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="px-6 py-2 rounded-lg border border-slate-600 text-white font-semibold hover:border-blue-500 transition">
              Tarification
            </Link>
            <button 
              onClick={() => setShowDashboard(true)}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Tableau de Bord
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Texte Hero */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Respirez en Toute Sécurité
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                Surveillance en temps réel de la qualité de l'air maritime. Protégez votre santé et celle de votre équipage avec nos capteurs intelligents et nos alertes instantanées.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setShowDashboard(true)}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Accéder au Tableau de Bord
              </button>
              <button className="px-8 py-4 rounded-lg border-2 border-slate-600 text-white font-bold text-lg hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                En Savoir Plus
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-700">
              <div>
                <p className="text-3xl font-bold text-blue-400">24/7</p>
                <p className="text-slate-400 text-sm">Surveillance Temps Réel</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-cyan-400">{data.length > 0 ? data.length : '∞'}</p>
                <p className="text-slate-400 text-sm">Points de Mesure</p>
              </div>
            </div>
          </div>

          {/* Animation visuelle */}
          <div className="relative h-96 flex items-center justify-center">
            <div className="absolute w-64 h-64 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative">
              <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20"></div>
                <div className="relative flex flex-col items-center justify-center space-y-4">
                  <Wind className="w-20 h-20 text-cyan-400 animate-bounce" />
                  <p className="text-3xl font-bold text-blue-400">
                    {data.length > 0 ? Math.max(...data.map(d => d.valeur)) : '--'} µg/m³
                  </p>
                  <p className="text-slate-400 text-sm">Pollution maximale détectée</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="relative z-10 bg-slate-900/50 backdrop-blur-sm py-20 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Fonctionnalités Clés</h3>
            <p className="text-slate-400 text-lg">Tout ce dont vous avez besoin pour protéger votre environnement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3">Alertes Instantanées</h4>
              <p className="text-slate-400 leading-relaxed">Recevez des notifications en temps réel lorsque la qualité de l'air dépasse les seuils critiques.</p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3">Couverture Globale</h4>
              <p className="text-slate-400 leading-relaxed">Surveillez plusieurs zones et stations avec un seul tableau de bord intuitif.</p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3">Données Sécurisées</h4>
              <p className="text-slate-400 leading-relaxed">Vos données sont chiffrées et stockées en toute sécurité dans nos serveurs certifiés.</p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-600 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3">Analyses Détaillées</h4>
              <p className="text-slate-400 leading-relaxed">Visualisez les tendances et les patterns de pollution avec nos graphiques avancés.</p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-yellow-600 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3">Santé en Priorité</h4>
              <p className="text-slate-400 leading-relaxed">Recommandations personnalisées basées sur votre profil de santé et l'air ambiant.</p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Droplets className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3">Données Précises</h4>
              <p className="text-slate-400 leading-relaxed">Capteurs de haute précision certifiés pour une mesure fiable et exacte.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-3xl p-12 text-center">
          <h3 className="text-4xl font-bold mb-6">Prêt à Protéger Votre Équipage ?</h3>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Rejoignez des milliers de navires qui font confiance à Ship Air Guard pour surveiller la qualité de l'air en temps réel.</p>
          <button 
            onClick={() => setShowDashboard(true)}
            className="px-10 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Commencer Maintenant
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-700/50 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Ship Air Guard</h4>
              <p className="text-slate-400 text-sm">Surveillance intelligente de la qualité de l'air en milieu maritime.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Tarifs</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition">À Propos</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition">Confidentialité</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Conditions</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <p>&copy; 2026 Ship Air Guard. Tous droits réservés.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-400 transition">Twitter</a>
              <a href="#" className="hover:text-blue-400 transition">LinkedIn</a>
              <a href="#" className="hover:text-blue-400 transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
    </>
  );
}