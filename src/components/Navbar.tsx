'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useExploration } from '@/context/ExplorationContext';
import {
  Brain,
  Database,
  LineChart,
  Target,
  Sparkles,
  Layers,
  Gamepad2,
  Menu,
  X,
  GraduationCap,
  Cpu,
  Trophy,
  UploadCloud,
  PlayCircle,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Accueil', shortDesc: 'Hub', icon: Sparkles },
  { href: '/scenario', label: 'Scénario A à Z', shortDesc: 'Upload ➔ Fin', icon: PlayCircle, highlight: true },
  { href: '/data-lab', label: 'Mon Lab Data', shortDesc: 'AutoML', icon: UploadCloud },
  { href: '/data-cleaning', label: 'Nettoyage', shortDesc: 'Préparation', icon: Database },
  { href: '/machine-learning', label: 'Machine Learning', shortDesc: 'Algorithmes', icon: LineChart },
  { href: '/deep-learning', label: 'Réseaux de Neurones', shortDesc: 'Cerveau 3D', icon: Brain },
  { href: '/cnn-from-scratch', label: 'Vision (CNN 3D)', shortDesc: 'Convolution', icon: Layers },
  { href: '/evaluation', label: 'Tester & Mesurer', shortDesc: 'Métriques', icon: Target },
  { href: '/playground', label: 'Jeux & Quiz', shortDesc: 'Défis', icon: Gamepad2 },
];

export default function Navbar() {
  const pathname = usePathname();
  const { mode, toggleMode, xpPoints } = useExploration();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-xl transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-emerald-400 p-[1.5px] shadow-glow-cyan transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors animate-pulse-slow" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-violet-400 bg-clip-text text-transparent">
                NeuroLearn
              </span>
              <span className="text-[10px] ml-1.5 px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-mono font-semibold">
                Studio IA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Simple, Clear Labels */}
          <nav className="hidden xl:flex items-center space-x-1" aria-label="Navigation principale">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : item.highlight
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : item.highlight ? 'text-cyan-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar (XP & Mode Toggle) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Gamification XP Badge */}
            <div
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-border text-amber-400 text-xs font-bold shadow-inner"
              title="Points d'expérience d'apprentissage"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{xpPoints} XP</span>
            </div>

            {/* Explanation Mode Toggle */}
            <button
              onClick={toggleMode}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 ${
                mode === 'engineer'
                  ? 'bg-violet-950/70 border-violet-500/50 text-violet-300 hover:bg-violet-900/60 shadow-glow-violet'
                  : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60 shadow-glow-emerald'
              }`}
              title="Basculer entre vulgarisation simple et formules mathématiques détaillées"
            >
              {mode === 'engineer' ? (
                <>
                  <Cpu className="w-3.5 h-3.5 text-violet-400" />
                  <span className="hidden sm:inline">Mode Math / Formules</span>
                  <span className="sm:hidden">Maths</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Mode Mots Simples</span>
                  <span className="sm:hidden">Simple</span>
                </>
              )}
            </button>

            {/* Mobile hamburger menu toggle */}
            <div className="flex xl:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-surface-card border border-border text-slate-300 hover:text-white"
                aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-border bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-2 text-xs text-slate-400">
            <span>Points XP : <strong className="text-amber-400">{xpPoints} XP</strong></span>
            <span className="text-cyan-400 font-medium">
              {mode === 'engineer' ? 'Mode Mathématique' : 'Mode Mots Simples'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : item.highlight
                      ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/30 text-cyan-300'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-white">{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.shortDesc}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
