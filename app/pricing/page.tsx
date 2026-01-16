'use client';

import { Check, X, Ship, Zap, Crown } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      description: 'Parfait pour débuter',
      price: '29',
      period: 'mois',
      icon: Ship,
      features: [
        { name: 'Jusqu\'à 3 stations de surveillance', included: true },
        { name: 'Alertes basiques', included: true },
        { name: 'Données temps réel', included: true },
        { name: 'Tableau de bord simple', included: true },
        { name: 'Support par email', included: true },
        { name: 'API limitée', included: false },
        { name: 'Rapports personnalisés', included: false },
        { name: 'Support prioritaire 24/7', included: false },
      ],
      cta: 'Commencer Gratuitement',
      highlighted: false,
      color: 'blue',
    },
    {
      name: 'Professionnel',
      description: 'Pour les navires commerciaux',
      price: '99',
      period: 'mois',
      icon: Zap,
      features: [
        { name: 'Jusqu\'à 15 stations de surveillance', included: true },
        { name: 'Alertes avancées personnalisables', included: true },
        { name: 'Données temps réel haute résolution', included: true },
        { name: 'Tableau de bord avancé', included: true },
        { name: 'Support prioritaire', included: true },
        { name: 'API complète', included: true },
        { name: 'Rapports personnalisés mensuel', included: true },
        { name: 'Support par chat et téléphone', included: false },
      ],
      cta: 'Commencer l\'essai gratuit',
      highlighted: true,
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

      {/* NAVBAR */}
      <nav className="relative z-50 border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-lg shadow-lg">
              <Ship className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">SHIP AIR GUARD</h1>
              <p className="text-xs text-slate-400 font-medium">Tarification</p>
            </div>
          </Link>
          <Link href="/" className="px-6 py-2 rounded-lg border border-slate-600 text-white font-semibold hover:border-blue-500 transition">
            Retour
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Tarification Simple et Transparente
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Choisissez le plan qui correspond à votre flotte. Tous les plans incluent nos fonctionnalités de base essentielles.
          </p>

          {/* Toggle annuel/mensuel */}
          <div className="flex justify-center gap-4 mt-8">
            <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold">
              Facturation mensuelle
            </button>
            <button className="px-6 py-2 rounded-lg border border-slate-600 text-slate-400 hover:border-blue-500 transition">
              Facturation annuelle <span className="text-green-400 text-sm">-20%</span>
            </button>
          </div>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            const bgColor = plan.color === 'blue' ? 'from-blue-600 to-cyan-600' : 
                           plan.color === 'cyan' ? 'from-cyan-600 to-blue-600' : 
                           'from-purple-600 to-blue-600';
            
            return (
              <div
                key={idx}
                className={`relative group ${
                  plan.highlighted
                    ? 'md:scale-105 md:z-10'
                    : ''
                }`}
              >
                {/* Glow background */}
                {plan.highlighted && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                )}

                <div className={`relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border ${
                  plan.highlighted
                    ? 'border-cyan-500/50'
                    : 'border-slate-700/50'
                } rounded-3xl p-8 backdrop-blur-sm h-full flex flex-col`}>
                  
                  {/* Badge */}
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className={`bg-gradient-to-r ${bgColor} text-white px-4 py-1 rounded-full text-sm font-bold`}>
                        POPULAIRE
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${bgColor} flex items-center justify-center mb-4`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{plan.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      {plan.period && <span className="text-slate-400 text-lg">€/{plan.period}</span>}
                    </div>
                    {plan.price !== 'Sur devis' && (
                      <p className="text-sm text-slate-400 mt-2">Facturation mensuelle. Annulation gratuite.</p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button className={`w-full py-3 rounded-lg font-bold text-lg mb-8 transition-all duration-300 ${
                    plan.highlighted
                      ? `bg-gradient-to-r ${bgColor} text-white hover:shadow-lg hover:shadow-cyan-500/50`
                      : 'bg-slate-700/50 text-white border border-slate-600 hover:border-blue-500'
                  }`}>
                    {plan.cta}
                  </button>

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

        {/* Comparaison compléte */}
        <div className="mb-20 text-center">
          <p className="text-slate-400 mb-4">Vous cherchez une comparaison complète ?</p>
          <button className="px-6 py-2 rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-500/10 transition">
            Voir la matrice complète
          </button>
        </div>
      </div>

      {/* FAQ SECTION */}
      <section className="relative z-10 bg-slate-900/50 backdrop-blur-sm py-20 border-y border-slate-700/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Questions Fréquemment Posées</h3>
            <p className="text-slate-400">Trouvez les réponses à vos questions les plus courantes</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
              >
                <details className="group cursor-pointer">
                  <summary className="flex items-center justify-between font-bold text-lg text-white">
                    {faq.question}
                    <span className="text-slate-400 group-open:text-blue-400 transition">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-3xl p-12 text-center">
          <h3 className="text-4xl font-bold mb-6">Prêt à commencer ?</h3>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Rejoignez des centaines de navires qui font confiance à Ship Air Guard pour surveiller leur qualité de l'air.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
              Commencer l'essai gratuit
            </button>
            <Link href="/" className="px-8 py-4 rounded-lg border-2 border-slate-600 text-white font-bold text-lg hover:border-blue-500 transition-all duration-300">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-700/50 bg-slate-900/30 backdrop-blur-sm mt-20">
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
                <li><a href="/pricing" className="hover:text-blue-400 transition">Tarification</a></li>
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
    </main>
    </>
  );
}
