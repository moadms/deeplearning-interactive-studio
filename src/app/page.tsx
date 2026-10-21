'use client';

import React from 'react';
import Link from 'next/link';
import {
  Brain,
  Database,
  LineChart,
  Target,
  Sparkles,
  Layers,
  Gamepad2,
  ArrowRight,
  CheckCircle2,
  Activity,
  Cpu,
  Zap,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import NeuralBrain3D from '@/components/NeuralBrain3D';
import { useExploration } from '@/context/ExplorationContext';

export default function HomePage() {
  const { mode, xpPoints } = useExploration();

  const pipelineSteps = [
    {
      num: '01',
      title: 'Collecte & Diagnostic',
      desc: 'Détection instantanée des valeurs manquantes (NaN), types de données, doublons exacts et valeurs aberrantes (outliers IQR).',
      href: '/data-cleaning',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      num: '02',
      title: 'Nettoyage & Imputation',
      desc: 'Suppression des doublons, imputation intelligente (médiane, moyenne, mode) et encodage One-Hot des variables qualitatives.',
      href: '/data-cleaning',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      num: '03',
      title: 'Scaling & Prétraitement',
      desc: 'Normalisation Min-Max [0, 1], Standardisation Z-Score (μ=0, σ=1), RobustScaler et lissage temporel anti-bruit.',
      href: '/data-cleaning',
      color: 'from-indigo-500 to-violet-600',
    },
    {
      num: '04',
      title: 'Équilibrage des Données',
      desc: 'Résolution du déséquilibre de classe par synthèse SMOTE (k-NN) et pondération des fonctions de coût (class weights).',
      href: '/data-cleaning',
      color: 'from-violet-500 to-purple-600',
    },
    {
      num: '05',
      title: 'Modélisation ML & Deep Learning',
      desc: 'Entraînement de modèles supervisés (Régression, Arbres, SVM, MLP) et non-supervisés (Clustering K-Means 2D/3D).',
      href: '/machine-learning',
      color: 'from-purple-500 to-pink-600',
    },
    {
      num: '06',
      title: 'Évaluation & Validation Croisée',
      desc: 'Matrice de confusion, seuil θ dynamique, arbitrage Précision/Recall, courbes ROC/AUC et K-Fold Cross-Validation.',
      href: '/evaluation',
      color: 'from-pink-500 to-rose-600',
    },
  ];

  const modules = [
    {
      title: 'Data Studio & Nettoyage Automatique',
      category: 'Module Données',
      desc: 'Importez n’importe quel CSV ou explorez Titanic, Churn, Iris. Corrigez les doublons, imputez les valeurs manquantes et appliquez le scaling en temps réel.',
      icon: Database,
      href: '/data-cleaning',
      color: 'text-cyan-400',
      badge: 'Interactif 1-Clic',
    },
    {
      title: 'Algorithmes Machine Learning',
      category: 'Module Supervisé & Non-Supervisé',
      desc: 'Explorez la frontière de décision en 2D pour la Régression Logistique, KNN, Arbres et SVM. Manipulez K-Means et la méthode du coude pas-à-pas.',
      icon: LineChart,
      href: '/machine-learning',
      color: 'text-violet-400',
      badge: '2D / 3D Canvas',
    },
    {
      title: 'Métriques d’Évaluation & Validation',
      category: 'Module Diagnostic',
      desc: 'Manipulez le seuil θ de la matrice de confusion, comprenez l’erreur Type I vs Type II, et découvrez pourquoi l’accuracy ment sur les classes rares.',
      icon: Target,
      href: '/evaluation',
      color: 'text-emerald-400',
      badge: 'Seuil Dynamique',
    },
    {
      title: 'Deep Learning & Cerveau Humain',
      category: 'Module Réseaux de Neurones',
      desc: 'Synapses biologiques vs neurones artificiels en 3D. Simulateur interactif de 8 fonctions d’activation (ReLU, Sigmoid, GELU) avec analyse du gradient.',
      icon: Brain,
      href: '/deep-learning',
      color: 'text-pink-400',
      badge: 'Visualisation 3D',
    },
    {
      title: 'CNN Convolutif From Scratch 3D',
      category: 'Module Vision par Ordinateur',
      desc: 'Décomposez un réseau convolutif de A à Z : glissement du kernel 3x3, padding, stride, ReLU, Max-Pooling et classification finale Softmax.',
      icon: Layers,
      href: '/cnn-from-scratch',
      color: 'text-amber-400',
      badge: 'Animation Pas-à-Pas',
    },
    {
      title: 'L’Arène des Jeux & Quiz Certifiant',
      category: 'Module Gamification',
      desc: 'Testez vos compétences avec des mini-jeux interactifs (défi convolutionnel, duel de frontières) et le quiz d’évaluation avec pluie de confettis !',
      icon: Gamepad2,
      href: '/playground',
      color: 'text-sky-400',
      badge: '+XP & Récompenses',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 flex flex-col items-center text-center space-y-6">
        {/* Glow ambient background effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-violet-600/15 to-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Module Éducatif Universitaire • Deep Learning & Machine Learning</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Comprendre l'Intelligence Artificielle{' '}
          <span className="text-gradient-cyan">de A à Z</span> et{' '}
          <span className="text-gradient-purple">From Scratch</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Une plateforme immersive combinant visualisations 3D, manipulation de données réelles, simulations mathématiques interactives et explications vulgarisées sans jargon inutile.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/data-cleaning"
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
          >
            <Database className="w-4 h-4" />
            <span>Tester le Studio de Nettoyage</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/cnn-from-scratch"
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-surface-card hover:bg-surface-hover border border-border text-white font-semibold text-sm transition-all"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Explorer le CNN en 3D</span>
          </Link>
        </div>

        {/* Status Indicators */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>6 Datasets Réels Intégrés</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Moteurs 2D & 3D Three.js</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-violet-400" />
            <span>Double Mode : Vulgarisé & Ingénieur</span>
          </span>
        </div>
      </section>

      {/* 3D Brain & Neural Network Hero Showcase */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Visualisation Interactive 3D
            </span>
            <h2 className="text-2xl font-bold text-white">Le Cerveau Humain vs Le Réseau Artificiel</h2>
          </div>
          <Link
            href="/deep-learning"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>Voir l'anatomie complète</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <NeuralBrain3D mode="hybrid" />
      </section>

      {/* The 6-Step Data Science Pipeline Roadmap */}
      <section className="space-y-6 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-wider font-semibold">
            Le Parcours Pédagogique Idéal
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Le Cycle de Vie Complet d'un Projet IA
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Un bon modèle commence toujours par des données impeccables. Suivez chaque étape séquentielle pour comprendre la mécanique sous le capot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelineSteps.map((step) => (
            <Link
              key={step.num}
              href={step.href}
              className="p-5 rounded-2xl bg-surface-card border border-border hover:border-cyan-500/50 transition-all duration-300 group hover:-translate-y-1 block relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xl font-black bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  {step.num}
                </span>
                <span className="text-xs text-slate-500 group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <span>Explorer</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {step.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Modules Grid */}
      <section className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border pb-4">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              Laboratoires Dédiés
            </span>
            <h2 className="text-2xl font-bold text-white">Modules Interactifs Disponibles</h2>
          </div>
          <span className="text-xs text-slate-400">Cliquez sur un module pour y accéder directement</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.title}
                href={m.href}
                className="p-6 rounded-2xl bg-surface border border-border hover:border-slate-600 transition-all duration-300 hover:shadow-xl group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className={`w-5 h-5 ${m.color}`} />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 border border-border text-slate-300">
                      {m.badge}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 block mb-1">{m.category}</span>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {m.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
                </div>

                <div className="pt-6 mt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span>Accéder au laboratoire</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
