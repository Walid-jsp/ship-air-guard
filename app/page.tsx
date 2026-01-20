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
  seuil_danger?: number;
}

export default function Home() {
  const [data, setData] = useState<PollutionData[]>([]);
  const [loading, setLoading] = useState(true);

  const co2Threshold = (() => {
    const co2 = data.find(d => d?.nom_polluant?.toLowerCase().includes('co2'));
    return Number.isFinite(co2?.seuil_danger) ? (co2?.seuil_danger as number) : 1000;
  })();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/pollution');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Configuration graphique Barres (inutilisé maintenant mais gardé pour compatibilité)
  const barChartData = {
    labels: data.map(d => d.nom_station.replace("Marseille ", "")),
    datasets: [{
      label: 'Niveau de Pollution',
      data: data.map(d => d.valeur),
      backgroundColor: data.map(d => d.valeur > 100 ? '#ef4444' : (d.valeur > 50 ? '#f59e0b' : '#10b981')),
      borderRadius: 5,
    }],
  };

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
              <Link href="/dashboard" className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 text-center">
                Accéder au Tableau de Bord
              </Link>
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
                <p className="text-3xl font-bold text-cyan-400">3</p>
                <p className="text-slate-400 text-sm">Paramètres Analysés (CO2, VOC, Température)</p>
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
                    {co2Threshold} ppm
                  </p>
                  <p className="text-slate-400 text-sm">Seuil d'Alerte Configurable</p>
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
            <p className="text-slate-400 text-lg">Tout ce dont vous avez besoin pour protéger votre équipage en cale</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3">Alertes Instantanées</h4>
              <p className="text-slate-400 leading-relaxed">Recevez des notifications en temps réel lorsque l'air en zones confinées (cale moteur, locaux techniques) dépasse les seuils critiques.</p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3">Zones du Navire</h4>
              <p className="text-slate-400 leading-relaxed">Surveillez plusieurs zones du navire (cales, passerelle, ateliers) avec un seul tableau de bord clair et opérationnel.</p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3">Données Sécurisées</h4>
              <p className="text-slate-400 leading-relaxed">Vos données capteurs sont protégées et accessibles uniquement à l'équipe autorisée (traçabilité et contrôle d'accès).</p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-600 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3">Analyses Détaillées</h4>
              <p className="text-slate-400 leading-relaxed">Visualisez l'évolution du CO2, des VOC et de la température pour anticiper les dérives et améliorer la ventilation.</p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-yellow-600 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3">Santé en Priorité</h4>
              <p className="text-slate-400 leading-relaxed">Aidez l'équipage à travailler en sécurité dans les espaces confinés grâce à des seuils clairs et des alertes actionnables.</p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Droplets className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3">Données Précises</h4>
              <p className="text-slate-400 leading-relaxed">Capteurs adaptés au terrain (milieu maritime) pour une mesure fiable des paramètres critiques à bord.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-3xl p-12 text-center">
          <h3 className="text-4xl font-bold mb-6">Prêt à Protéger Votre Équipage ?</h3>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Rejoignez des milliers de navires qui font confiance à Ship Air Guard pour surveiller la qualité de l'air en temps réel.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="px-10 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 text-center">
              Commencer Maintenant
            </Link>
            <Link href="/" className="px-10 py-4 rounded-lg border-2 border-slate-600 text-white font-bold text-lg hover:border-blue-500 transition-all duration-300 text-center">
              Retour à l'accueil
            </Link>
          </div>
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