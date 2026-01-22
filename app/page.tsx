'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';

import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement 
} from 'chart.js';
import { Ship, Wind, AlertOctagon, CheckCircle, Activity, Droplets, Zap, Globe, Shield, TrendingUp, Thermometer, X } from 'lucide-react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // État pour la pop-up
  const [modal, setModal] = useState<{ title: string; content: string } | null>(null);

  // Configuration des textes pour les pop-ups
  const popupTexts = {
    about: {
      title: "À Propos",
      content: "Ship Air Guard est une entreprise innovante spécialisée dans la sécurité maritime. Nous développons des solutions IoT avancées pour surveiller l'air dans les cales et espaces confinés des navires, garantissant ainsi la sécurité de l'équipage."
    },
    contact: {
      title: "Contactez-nous",
      content: "Email : support@shipairguard.com\nTéléphone : +33 (0)4 91 12 34 56\nAdresse : 3 Pl. Victor Hugo, 13331 Marseille"
    },
    privacy: {
      title: "Confidentialité",
      content: "Vos données maritimes sont précieuses. Ship Air Guard utilise un chiffrement de bout en bout pour toutes les transmissions de capteurs. Aucune donnée n'est partagée avec des tiers sans votre consentement explicite."
    },
    cookies: {
      title: "Politique des Cookies",
      content: "Nous utilisons des cookies uniquement pour assurer le bon fonctionnement de votre session sur le dashboard et analyser anonymement le trafic afin d'améliorer nos services."
    },
    linkedin: {
      title: "LinkedIn",
      content: "Suivez nos dernières innovations et nos actualités de recrutement sur notre page officielle LinkedIn : linkedin.com/company/ship-air-guard"
    },
    github: {
      title: "GitHub",
      content: "Ship Air Guard soutient l'open-source. Retrouvez nos bibliothèques de traitement de données environnementales sur github.com/ship-air-guard"
    }
  };

  const indicators = [
    { label: "CO2", valeur: "1000", unite: "ppm", icon: Wind, color: "text-cyan-400", bgGradient: "from-blue-600/20 to-cyan-600/20" },
    { label: "COV", valeur: "450", unite: "ppb", icon: Droplets, color: "text-purple-400", bgGradient: "from-purple-600/20 to-pink-600/20" },
    { label: "Température", valeur: "24.5", unite: "°C", icon: Thermometer, color: "text-orange-400", bgGradient: "from-orange-600/20 to-red-600/20" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % indicators.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentIndicator = indicators[currentIndex];

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8"> 
              <div className="space-y-4">
                <h2 className="text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Respirez en toute sécurité
                </h2>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Surveillez la qualité de l'air en mer en temps réel. Protégez votre santé et celle de votre équipage grâce à nos capteurs intelligents et nos alertes immédiates.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/simulation" className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 text-center">
                  Accéder à une simulation
                </Link>
                <Link href="/pricing" className="px-8 py-4 rounded-lg border-2 border-slate-600 text-white font-bold text-lg hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-center">
                  Voir nos offres
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-700">
                <div>
                  <p className="text-3xl font-bold text-blue-400">24/7</p>
                  <p className="text-slate-400 text-sm">Surveillance active</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-cyan-400">3 Indicateurs</p>
                  <p className="text-slate-400 text-sm">CO2, COV et Température</p>
                </div>
              </div>
            </div>

            <div className="relative h-96 flex items-center justify-center">
              <div className="absolute w-64 h-64 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative">
                <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center shadow-2xl overflow-hidden transition-all duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${currentIndicator.bgGradient} transition-colors duration-1000`}></div>
                  <div className="relative flex flex-col items-center justify-center space-y-4 text-center">
                    <currentIndicator.icon className={`w-20 h-20 ${currentIndicator.color} animate-bounce transition-colors duration-500`} />
                    <div>
                      <p className={`text-3xl font-bold ${currentIndicator.color} transition-colors duration-500`}>
                        {currentIndicator.valeur} {currentIndicator.unite}
                      </p>
                      <p className="text-slate-300 font-semibold mt-1">{currentIndicator.label}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES SECTION (Ajout de l'ID pour le scroll) */}
        <section id="features" className="relative z-10 bg-slate-900/50 backdrop-blur-sm py-20 border-y border-slate-700/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold mb-4">Fonctionnalités clés</h3>
              <p className="text-slate-400 text-lg">Tout ce dont vous avez besoin pour protéger votre équipage en cale</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Alertes instantanées", desc: "Soyez notifié immédiatement si un de nos capteurs détectent une anomalie.", color: "blue" },
                { icon: Globe, title: "Zones du navire", desc: "Surveillez plusieurs zones (cales, passerelle, ateliers) depuis un tableau de bord unique.", color: "cyan" },
                { icon: Shield, title: "Données sécurisées", desc: "Vos données sont chiffrées et accessibles uniquement par l'équipe autorisée.", color: "purple" },
                { icon: TrendingUp, title: "Analyses détaillées", desc: "Visualisez l'évolution des gaz pour anticiper les problèmes de ventilation.", color: "green" },
                { icon: Activity, title: "Santé prioritaire", desc: "Garantissez des conditions de travail saines dans les espaces confinés.", color: "yellow" },
                { icon: Droplets, title: "Précision maritime", desc: "Des capteurs conçus pour résister aux conditions du milieu maritime.", color: "indigo" }
              ].map((feature, i) => (
                <div key={i} className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br from-${feature.color}-600 to-blue-600 flex items-center justify-center mb-6`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER INTERACTIF */}
        <footer className="relative z-10 border-t border-slate-700/50 bg-slate-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-bold mb-4">Ship Air Guard</h4>
                <p className="text-slate-400 text-sm">Surveillance intelligente de la qualité de l'air en milieu maritime.</p>
              </div>
              <div>
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest">Produit</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>
                    <button 
                      onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} 
                      className="hover:text-blue-400 transition"
                    >
                      Fonctionnalités
                    </button>
                  </li>
                  <li><Link href="/pricing" className="hover:text-blue-400 transition">Tarifs</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest">Entreprise</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><button onClick={() => setModal(popupTexts.about)} className="hover:text-blue-400 transition">À Propos</button></li>
                  <li><button onClick={() => setModal(popupTexts.contact)} className="hover:text-blue-400 transition">Contact</button></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest">Légal</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><button onClick={() => setModal(popupTexts.privacy)} className="hover:text-blue-400 transition">Confidentialité</button></li>
                  <li><button onClick={() => setModal(popupTexts.cookies)} className="hover:text-blue-400 transition">Cookies</button></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-700/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
              <p>&copy; 2026 Ship Air Guard. Tous droits réservés.</p>
              <div className="flex gap-6 mt-4 md:mt-0 font-bold uppercase text-xs tracking-widest">
                <button onClick={() => setModal(popupTexts.linkedin)} className="hover:text-blue-400 transition">LinkedIn</button>
                <button onClick={() => setModal(popupTexts.github)} className="hover:text-blue-400 transition">GitHub</button>
              </div>
            </div>
          </div>
        </footer>

        {/* MODALE (POP-UP) */}
        {modal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-4">{modal.title}</h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{modal.content}</p>
              <button 
                onClick={() => setModal(null)}
                className="mt-8 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg"
              >
                Compris
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(20px, -50px) scale(1.1); }
            50% { transform: translate(-20px, 20px) scale(0.9); }
            75% { transform: translate(50px, 50px) scale(1.05); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}</style>
      </main>
    </>
  );
}