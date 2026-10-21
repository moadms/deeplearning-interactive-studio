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
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Accueil', icon: Sparkles },
  { href: '/data-cleaning', label: 'Nettoyage & Studio', icon: Database },
  { href: '/machine-learning', label: 'Machine Learning', icon: LineChart },
  { href: '/evaluation', label: 'Métriques & Validation', icon: Target },
  { href: '/deep-learning', label: 'Deep Learning', icon: Brain },
  { href: '/cnn-from-scratch', label: 'CNN 3D Scratch', icon: Layers },
  { href: '/playground', label: 'Jeux & Défis', icon: Gamepad2 },
];

export default function Navbar() {
  const pathname = usePathname();
  const { mode, toggleMode, xpPoints } = useExploration();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-violet-600 to-emerald-400 p-[1px] shadow-glow-cyan transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-background rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors animate-pulse-slow" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-violet-400 bg-clip-text text-transparent">
                NeuroLearn
              </span>
              <span className="text-xs ml-1.5 px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-mono font-medium">
                DeepLab
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Navigation principale">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar (XP & Mode Toggle) */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Gamification XP Badge */}
            <div
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-border text-amber-400 text-xs font-semibold shadow-inner"
              title="Points d'expérience d'apprentissage"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{xpPoints} XP</span>
            </div>

            {/* Explanation Mode Toggle */}
            <button
              onClick={toggleMode}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 ${
                mode === 'engineer'
                  ? 'bg-violet-950/70 border-violet-500/50 text-violet-300 hover:bg-violet-900/60 shadow-glow-violet'
                  : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60 shadow-glow-emerald'
              }`}
              title="Basculer entre vulgarisation accessible et formules mathématiques avancées"
            >
              {mode === 'engineer' ? (
                <>
                  <Cpu className="w-3.5 h-3.5 text-violet-400" />
                  <span>Mode Ingénieur (Scratch)</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mode Vulgarisé (Débutant)</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={toggleMode}
              className="p-2 rounded-lg bg-surface-card border border-border text-xs text-cyan-400"
              aria-label="Changer le mode d'explication"
            >
              {mode === 'engineer' ? <Cpu className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-surface-card border border-border text-slate-300 hover:text-white"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-background/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-2 text-xs text-slate-400">
            <span>Points XP : <strong className="text-amber-400">{xpPoints} XP</strong></span>
            <span className="text-cyan-400 font-medium">
              {mode === 'engineer' ? 'Mode Ingénieur' : 'Mode Débutant'}
            </span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 text-cyan-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
