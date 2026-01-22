'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Ship, Menu, X, LogOut, User, LogIn, Zap } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Monitoring', href: '/monitoring' },
    { name: 'Données Env.', href: '/environmental-data' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
  await signOut({ callbackUrl: '/login' });
};


  const getSubscriptionBadgeColor = (plan: string) => {
    const colors: Record<string, string> = {
      free: 'bg-slate-700 text-slate-200',
      starter: 'bg-blue-600 text-blue-100',
      pro: 'bg-purple-600 text-purple-100',
      enterprise: 'bg-amber-600 text-amber-100',
    };
    return colors[plan] || colors['free'];
  };

  const getSubscriptionLabel = (plan: string) => {
    const labels: Record<string, string> = {
      free: 'Gratuit',
      starter: 'Starter',
      pro: 'Pro',
      enterprise: 'Enterprise',
    };
    return labels[plan] || 'Plan';
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? 'bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 shadow-lg'
            : 'bg-slate-900/40 backdrop-blur-sm border-b border-slate-700/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300"
          >
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-shadow duration-300">
              <Ship className="text-white" size={28} />
            </div>
<div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Ship Air Guard
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {session && (
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 relative group ${
                    isActive(item.href)
                      ? 'text-blue-400'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ${
                      isActive(item.href) ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                    }`}
                  />
                </Link>
              ))}
            </div>
          )}

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                >
                  <User size={20} />
                  <span className="text-sm font-semibold">{session.user?.name || 'Profil'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300"
                >
                  <LogOut size={20} />
                  Déconnexion
                </button>
              </>
            ) : (
              <>

                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300 font-semibold"
                >
                  <LogIn size={20} />
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300"
                >
                  <User size={20} />
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            isOpen ? 'max-h-96 border-t border-slate-700/50' : 'max-h-0'
          }`}
        >
          <div className="px-6 py-4 space-y-2 bg-slate-900/60 backdrop-blur-sm">
            {session && navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  isActive(item.href)
                    ? 'bg-blue-600/30 text-blue-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-slate-700/50 space-y-2">
              {session ? (
                <>
                  {/* Subscription Plan Mobile */}
                  <Link
                    href="/pricing"
                    className={`block px-4 py-2 rounded-lg text-center text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${getSubscriptionBadgeColor(session.user?.subscriptionPlan || 'free')}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Zap size={16} />
                    {getSubscriptionLabel(session.user?.subscriptionPlan || 'free')}
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-center hover:bg-blue-700 transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <User size={20} />
                      Mon Profil
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <LogOut size={20} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>

                  <Link
                    href="/login"
                    className="block px-4 py-2 rounded-lg bg-slate-700 text-white font-semibold text-center hover:bg-slate-600 transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <LogIn size={20} />
                      Connexion
                    </div>
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-center hover:bg-blue-700 transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <User size={20} />
                      S'inscrire
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-20"></div>
    </>
  );
}
