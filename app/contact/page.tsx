'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle, MessageSquare, Linkedin, Github, Twitter } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation simple
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Veuillez remplir tous les champs obligatoires.');
      setLoading(false);
      return;
    }

    // Simulation d'envoi
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      setFormData({ name: '', email: '', company: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contact@shipairguard.fr',
      desc: 'Réponse en 24h',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+33 (0)4 91 XX XX XX',
      desc: 'Lun-Ven: 9h-18h',
      color: 'from-cyan-600 to-blue-600',
    },
    {
      icon: MapPin,
      title: 'Bureau',
      value: 'Marseille, France',
      desc: 'Siège social',
      color: 'from-purple-600 to-blue-600',
    },
  ];

  const faqs = [
    {
      q: 'Quel est le délai de réponse aux demandes?',
      a: 'Nous répondons généralement en 24h ouvrables. Pour les demandes urgentes, appelez directement notre support.'
    },
    {
      q: 'Offrez-vous une période d\'essai gratuit?',
      a: 'Oui, tous nos plans incluent un essai gratuit de 14 jours sans engagement.'
    },
    {
      q: 'Comment puis-je mettre à niveau mon plan?',
      a: 'Vous pouvez changer votre plan à tout moment depuis votre espace client ou en contactant notre équipe.'
    },
    {
      q: 'Supportez-vous les intégrations API?',
      a: 'Oui, nos plans Professionnel et Entreprise incluent l\'accès à notre API complète avec documentation détaillée.'
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white font-sans">
        {/* Éléments de fond animés */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* HERO SECTION */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16">
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Nous Sommes Là Pour Vous
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Avez-vous des questions? Notre équipe est prête à vous aider. Contactez-nous par email, téléphone ou via le formulaire ci-dessous.
            </p>
          </div>

          {/* CONTACT METHODS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {contactMethods.map((method, idx) => {
              const Icon = method.icon;
              return (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group"
                >
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                  <p className="text-lg text-blue-400 font-semibold mb-2">{method.value}</p>
                  <p className="text-slate-400 text-sm">{method.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FORM AND INFO SECTION */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* FORM */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <MessageSquare className="text-blue-400" size={28} />
                Envoyez-nous un Message
              </h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <div>
                    <p className="font-semibold text-green-400">Message envoyé avec succès!</p>
                    <p className="text-sm text-green-300">Nous vous répondrons dès que possible.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-3">
                  <AlertCircle className="text-red-400" size={20} />
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Nom Complet *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Entreprise / Navire</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Nom de votre navire ou entreprise"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Sujet *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="support">Support Technique</option>
                    <option value="sales">Demande de Devis</option>
                    <option value="partnership">Partenariat</option>
                    <option value="feedback">Retour / Suggestion</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Détaillez votre demande..."
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {loading ? 'Envoi en cours...' : 'Envoyer le Message'}
                </button>

                <p className="text-xs text-slate-400 text-center">
                  Nous respectons votre vie privée. Voir notre <a href="#" className="text-blue-400 hover:underline">politique de confidentialité</a>.
                </p>
              </form>
            </div>

            {/* INFO SECTION */}
            <div className="space-y-8">
              
              {/* Hours */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Clock className="text-blue-400" size={24} />
                  Horaires d'Ouverture
                </h3>
                <div className="space-y-3 text-slate-300">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span className="font-semibold text-blue-400">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span className="font-semibold text-blue-400">10h00 - 14h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="font-semibold">Fermé</span>
                  </div>
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-sm text-slate-400">Support d'urgence 24/7 disponible pour les clients entreprise.</p>
                  </div>
                </div>
              </div>

              {/* Quick FAQ */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Questions Rapides</h3>
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <details key={idx} className="group cursor-pointer">
                      <summary className="font-semibold text-slate-200 group-open:text-blue-400 flex items-center justify-between py-2 hover:text-blue-400 transition">
                        {faq.q}
                        <span className="text-slate-400 group-open:text-blue-400 transition">▼</span>
                      </summary>
                      <p className="text-slate-400 pt-2 pb-3 text-sm border-t border-slate-700 mt-2">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Suivez-nous</h3>
                <div className="grid grid-cols-3 gap-4">
                  <a href="#" className="p-4 bg-slate-700/50 rounded-lg hover:bg-blue-600/30 transition flex items-center justify-center group">
                    <Twitter className="text-slate-400 group-hover:text-blue-400 transition" size={24} />
                  </a>
                  <a href="#" className="p-4 bg-slate-700/50 rounded-lg hover:bg-blue-600/30 transition flex items-center justify-center group">
                    <Linkedin className="text-slate-400 group-hover:text-blue-400 transition" size={24} />
                  </a>
                  <a href="#" className="p-4 bg-slate-700/50 rounded-lg hover:bg-blue-600/30 transition flex items-center justify-center group">
                    <Github className="text-slate-400 group-hover:text-blue-400 transition" size={24} />
                  </a>
                </div>
                <p className="text-slate-400 text-sm mt-4">Restez connecté pour les dernières mises à jour et actualités.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-3xl p-12 text-center">
            <h3 className="text-4xl font-bold mb-6">Prêt à Démarrer?</h3>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Découvrez comment Ship Air Guard peut transformer la surveillance de la qualité de l'air sur votre navire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/pricing" className="px-10 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 text-center">
                Voir les Plans
              </a>
              <a href="/dashboard" className="px-10 py-4 rounded-lg border-2 border-blue-500 text-blue-400 font-bold text-lg hover:bg-blue-500/10 transition-all duration-300 text-center">
                Essai Gratuit
              </a>
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
                  <li><a href="/" className="hover:text-blue-400 transition">Accueil</a></li>
                  <li><a href="/dashboard" className="hover:text-blue-400 transition">Tableau de Bord</a></li>
                  <li><a href="/pricing" className="hover:text-blue-400 transition">Tarification</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Entreprise</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-blue-400 transition">À Propos</a></li>
                  <li><a href="/contact" className="hover:text-blue-400 transition">Contact</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
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
