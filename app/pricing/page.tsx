'use client';

import { Check, X, Ship, Zap, Crown } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

import { useEffect, useState } from 'react';

export default function PricingPage() {
const plans = [
{
      name: 'Installation',
      description: 'Mise en place initiale',
      price: '1000€ + 500€ par capteur', // Tout sur la même ligne
      period: '', // On laisse vide pour ne pas avoir de décalage
      icon: Ship,
      features: [
        { name: 'Autant de capteurs que souhaité', included: true },
        { name: 'Installation physique à bord', included: true },
        { name: 'Création de compte administrateur', included: true },
        { name: 'Configuration du tableau de bord', included: true },
        { name: 'Formation sur notre outil', included: true },
        { name: 'Maintenance matériel 2 ans', included: true },
        { name: 'Support prioritaire démarrage', included: true },
      ],
      cta: null, // "null" signifie qu'on n'affichera pas de bouton ici
      highlighted: false,
      color: 'blue',
    },
{
      name: 'Maintenance',
      description: 'Pour une sérénité totale',
      price: '100',
      period: 'mois',
      icon: Zap,
      features: [
        { name: 'Surveillance des capteurs 24/7', included: true },
        { name: 'Remplacement matériel express', included: true },
        { name: 'Support technique dédié', included: true },
        { name: 'Stockage des données illimité', included: true },
        { name: 'Alertes prédictives IA', included: true },
      ],
      cta: null,
      highlighted: false, // IMPORTANT : false enlève le fluo et la taille
      color: 'cyan',
    },
    {
      name: 'Entreprise',
      description: 'Pour les flottes complètes',
      price: 'Sur devis',
      period: '',
      icon: Crown,
      features: [
        { name: 'Stations illimitées', included: true },
        { name: 'Alertes ultra-avancées IA', included: true },
        { name: 'Données temps réel + prédictions', included: true },
        { name: 'Tableau de bord entièrement personnalisé', included: true },
        { name: 'Support prioritaire 24/7', included: true },
        { name: 'API sans limites', included: true },
        { name: 'Rapports et analyses quotidiens', included: true },
        { name: 'Gestionnaire de compte dédié', included: true },
      ],
      cta: 'Demander une démo',
      highlighted: false,
      color: 'purple',
    },
  ];

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

  const faqs = [
    {
      question: 'Puis-je changer de plan à tout moment ?',
      answer: 'Oui, vous pouvez mettre à niveau ou rétrograder votre plan à tout moment. Les changements prendront effet au prochain cycle de facturation.',
    },
    {
      question: 'Y a-t-il un essai gratuit ?',
      answer: 'Oui ! Tous les plans professionnels bénéficient d\'un essai gratuit de 14 jours sans carte de crédit requise.',
    },
    {
      question: 'Que se passe-t-il après mon essai gratuit ?',
      answer: 'Vous serez invité à saisir une méthode de paiement pour continuer. Vous pouvez annuler à tout moment avant la fin de l\'essai.',
    },
    {
      question: 'Offrez-vous des remises annuelles ?',
      answer: 'Oui ! Bénéficiez de 20% de réduction sur les plans annuels. Contactez notre équipe pour plus de détails.',
    },
    {
      question: 'Quel est votre SLA de disponibilité ?',
      answer: '99.9% de disponibilité garantie pour tous les plans avec notre infrastructure redondante et nos sauvegardes quotidiennes.',
    },
    {
      question: 'Comment gérez-vous la sécurité des données ?',
      answer: 'Toutes les données sont chiffrées en transit et au repos. Nous sommes conformes à la RGPD et aux normes ISO 27001.',
    },
  ];

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
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Tarification Simple et Transparente
          </h2>



        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
{plans.map((plan, idx) => {
            const Icon = plan.icon;
            const bgColor = plan.color === 'blue' ? 'from-blue-600 to-cyan-600' : 
                           plan.color === 'cyan' ? 'from-cyan-600 to-blue-600' : 
                           'from-purple-600 to-blue-600';
            
// On garde 2xl pour l'installation (texte long) et on réduit les autres à 4xl (au lieu de 5xl)
            const priceSize = plan.name === 'Installation' ? 'text-2xl' : 'text-4xl';

            return (
              <div
                key={idx}
                className={`relative group ${
                  plan.highlighted ? 'md:scale-105 md:z-10' : ''
                }`}
              >
                {/* Fond lumineux */}
                {plan.highlighted && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                )}

                <div className={`relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border ${
                  plan.highlighted ? 'border-cyan-500/50' : 'border-slate-700/50'
                } rounded-3xl p-8 backdrop-blur-sm h-full flex flex-col`}>
                  



  {/* En-tête */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${bgColor} flex items-center justify-center mb-4`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{plan.description}</p>
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className={`${priceSize} font-bold text-white leading-tight`}>{plan.price}</span>
                      {plan.period && <span className="text-slate-400 text-lg">€/{plan.period}</span>}
                    </div>

                  </div>
                  

{/* Bouton (caché si null) */}
                  {plan.cta && (
                    <button className={`w-full py-3 rounded-lg font-bold text-lg mb-8 transition-all duration-300 ${
                      plan.highlighted
                        ? `bg-gradient-to-r ${bgColor} text-white hover:shadow-lg hover:shadow-cyan-500/50`
                        : 'bg-slate-700/50 text-white border border-slate-600 hover:border-blue-500'
                    }`}>
                      {plan.cta}
                    </button>
                  )}

                  {/* Features List */}
                  <div className="space-y-4 flex-1">
                    {plan.features.map((feature, fidx) => (
                      <div key={fidx} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
                        ) : (
                          <X className="text-slate-600 flex-shrink-0 mt-0.5" size={20} />
                        )}
                        <span className={feature.included ? 'text-slate-200' : 'text-slate-500'}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>




{/* BOUTON GLOBAL CONTACT */}
        <div className="mt-16 text-center">
           <button 
             onClick={() => setModal(popupTexts.contact)}
             className="px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xl font-bold text-white shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all transform hover:scale-105"
           >
             Nous contacter
           </button>
           <p className="mt-4 text-slate-400 text-sm">Nous vous répondrons sous 24h.</p>
        </div>

      </div>
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
  {/* On renvoie vers l'accueil à la section features */}
  <Link href="/#features" className="hover:text-blue-400 transition">
    Fonctionnalités
  </Link>
</li>
<li>
  <button 
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
    className="hover:text-blue-400 transition"
  >
    Tarifs
  </button>
</li>
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