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
  UploadCloud,
  Play,
} from 'lucide-react';
import NeuralBrain3D from '@/components/NeuralBrain3D';
import { useExploration } from '@/context/ExplorationContext';

export default function HomePage() {
  const { mode, xpPoints } = useExploration();

  const pipelineSteps = [
    {
      num: '01',
      title: 'Nettoyer les Données',
      desc: 'Détecter les trous (valeurs manquantes), effacer les doublons et corriger les valeurs aberrantes (outliers).',
      href: '/data-cleaning',
    },
    {
      num: '02',
      title: 'Mettre à l’Échelle (Scaling)',
      desc: 'Normaliser entre 0 et 1 ou standardiser en loi normale pour que les grandes variables n’écrasent pas les petites.',
      href: '/data-cleaning',
    },
    {
      num: '03',
      title: 'Équilibrer les Classes (SMOTE)',
      desc: 'Créer des points synthétiques intelligents quand une catégorie est très rare (ex: détection de fraudes).',
      href: '/data-cleaning',
    },
    {
      num: '04',
      title: 'Apprendre avec les Algorithmes',
      desc: 'Séparer des catégories avec la classification (SVM, Arbres, KNN) ou prédire un chiffre avec la régression.',
      href: '/machine-learning',
    },
    {
      num: '05',
      title: 'Réseaux de Neurones & Vision 3D',
      desc: 'Imiter le cerveau avec des couches de neurones, comprendre les fonctions d’activation et convoluer des images (CNN).',
      href: '/deep-learning',
    },
    {
      num: '06',
      title: 'Mesurer la Qualité',
      desc: 'Calculer la matrice de confusion, la précision, le rappel, et vérifier qu’il n’y a aucune triche (Data Leakage).',
      href: '/evaluation',
    },
  ];

  const modules = [
    {
      title: 'Mon Lab : Upload & Entraînement Direct',
      category: 'Nouveau Studio AutoML',
      desc: 'Importez votre propre fichier CSV ou un exemple. Filtrez les colonnes, nettoyez en 1 clic et entraînez un modèle avec prédiction en direct.',
      icon: UploadCloud,
      href: '/data-lab',
      color: 'text-cyan-400',
      badge: '⚡ Pratique 100% Interactif',
      highlight: true,
    },
    {
      title: 'Nettoyage & Studio de Données',
      category: 'Préparation',
      desc: 'Découvrez pourquoi 80% du succès dépend de données propres. Imputation par médiane, dédoublonnage et scaling Min-Max / Z-Score.',
      icon: Database,
      href: '/data-cleaning',
      color: 'text-blue-400',
      badge: '4 Datasets Prêts',
    },
    {
      title: 'Machine Learning 2D & 3D',
      category: 'Algorithmes',
      desc: 'Dessinez vos points sur un canvas 2D et regardez la frontière de décision s’adapter en temps réel (Logistique, KNN, Arbre, SVM).',
      icon: LineChart,
      href: '/machine-learning',
      color: 'text-violet-400',
      badge: 'Canvas 2D / 3D',
    },
    {
      title: 'Réseaux de Neurones Détaillés',
      category: 'Deep Learning',
      desc: 'Visualisez un neurone biologique et artificiel en 3D. Testez 8 fonctions d’activation et observez les neurones morts en direct.',
      icon: Brain,
      href: '/deep-learning',
      color: 'text-pink-400',
      badge: 'Simulation 3D & Gradients',
    },
    {
      title: 'Vision par Ordinateur (CNN) en 3D',
      category: 'Traitement d’Images',
      desc: 'Filtres de Sobel, Stride, Padding, Max-Pooling et Softmax expliqués pas-à-pas avec des animations 3D spatiales.',
      icon: Layers,
      href: '/cnn-from-scratch',
      color: 'text-amber-400',
      badge: 'From Scratch 3D',
    },
    {
      title: 'Tester & Mesurer la Précision',
      category: 'Validation',
      desc: 'Déplacez le curseur de seuil θ de la matrice de confusion et comprenez pourquoi l’exactitude peut être trompeuse.',
      icon: Target,
      href: '/evaluation',
      color: 'text-emerald-400',
      badge: 'Matrice Dynamique',
    },
  ];

  return (
    <div className="space-y-16 animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative pt-6 pb-10 flex flex-col items-center text-center space-y-6">
        {/* Glow ambient background effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-gradient-to-tr from-cyan-500/15 via-violet-600/15 to-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-inner animate-pulse-slow">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Module Universitaire • Deep Learning & Machine Learning</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight text-white">
          L'Intelligence Artificielle Expliquée avec des{' '}
          <span className="text-gradient-cyan">Mots Simples</span> et en{' '}
          <span className="text-gradient-purple">3D Interactive</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Explorez le fonctionnement réel des algorithmes sans jargon intimidant : nettoyez des données, pivotez des réseaux de neurones en 3D et entraînez vos propres modèles en quelques clics.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/data-lab"
            className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-sm shadow-glow-cyan transition-all transform hover:-translate-y-1"
          >
            <UploadCloud className="w-5 h-5 text-slate-950" />
            <span>Mon Lab : Upload & Entraînement ⚡</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/deep-learning"
            className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-surface-card hover:bg-surface-hover border border-border text-white font-semibold text-sm transition-all card-hover"
          >
            <Brain className="w-4 h-4 text-cyan-400" />
            <span>Comprendre les Neurones en 3D</span>
          </Link>
        </div>

        {/* Status Indicators */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Animations 3D Temps Réel</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>AutoML avec Upload de Données</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-violet-400" />
            <span>Mode Débutant (Mots Simples)</span>
          </span>
        </div>
      </section>

      {/* 3D Brain Showcase */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Animation 3D Fluide
            </span>
            <h2 className="text-2xl font-bold text-white">Le Cerveau Humain vs Le Réseau Artificiel</h2>
          </div>
          <Link
            href="/deep-learning"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>Voir le calcul détaillé d'un neurone</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <NeuralBrain3D mode="hybrid" />
      </section>

      {/* The 6-Step Pipeline */}
      <section className="space-y-6 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-wider font-semibold">
            Le Parcours Facile
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Les 6 Grandes Étapes d'un Projet IA
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            De la matière première (vos données) jusqu’à la prise de décision par l'algorithme.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelineSteps.map((step) => (
            <Link
              key={step.num}
              href={step.href}
              className="p-5 rounded-2xl bg-surface-card border border-border card-hover group block relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xl font-black bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  {step.num}
                </span>
                <span className="text-xs text-slate-500 group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <span>Découvrir</span>
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

      {/* Modules Cards Grid */}
      <section className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border pb-4">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              Espaces Dédiés
            </span>
            <h2 className="text-2xl font-bold text-white">Tous les Modules d'Apprentissage</h2>
          </div>
          <span className="text-xs text-slate-400">Cliquez sur une carte pour lancer l'expérience</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.title}
                href={m.href}
                className={`p-6 rounded-3xl border transition-all duration-300 card-hover group flex flex-col justify-between ${
                  m.highlight
                    ? 'bg-gradient-to-br from-cyan-950/70 via-surface to-slate-950 border-cyan-500/50 shadow-glow-cyan'
                    : 'bg-surface border-border'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className={`w-6 h-6 ${m.color}`} />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-border text-cyan-300">
                      {m.badge}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block mb-1">{m.category}</span>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {m.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
                </div>

                <div className="pt-6 mt-4 border-t border-border/60 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                  <span>Accéder à l'espace</span>
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
