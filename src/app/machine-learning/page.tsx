'use client';

import React from 'react';
import DecisionBoundaryCanvas from '@/components/DecisionBoundaryCanvas';
import RegressionPlayground from '@/components/RegressionPlayground';
import KMeansVisualizer from '@/components/KMeansVisualizer';
import { LineChart, Shield, Network, PieChart, Sparkles, Brain, Cpu, TrendingUp } from 'lucide-react';
import { useExploration } from '@/context/ExplorationContext';

export default function MachineLearningPage() {
  const { mode } = useExploration();

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-violet-950/70 border border-violet-500/30 text-violet-300 text-xs font-semibold">
          <LineChart className="w-3.5 h-3.5 text-violet-400" />
          <span>Module 2 • Algorithmes Supervisés & Non-Supervisés</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Machine Learning : Classification, Régression & Clustering
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Le Machine Learning consiste à concevoir des algorithmes capables d’apprendre des règles mathématiques à partir d’exemples, sans être explicitement programmés avec des règles fixes (if/else).
        </p>
      </div>

      {/* SECTION 1: Classification Interactive */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border pb-3">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Partie 1 • Apprentissage Supervisé
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              <span>La Classification & Les Frontières de Décision</span>
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Objectif : Séparer des catégories discrètes (ex: Fraude vs Normal, Chat vs Chien)
          </span>
        </div>

        <DecisionBoundaryCanvas />
      </section>

      {/* SECTION 2: Régression Interactive */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border pb-3">
          <div>
            <span className="text-xs font-mono text-violet-400 uppercase tracking-wider font-semibold">
              Partie 2 • Apprentissage Supervisé
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-violet-400" />
              <span>La Régression & La Régularisation (Ridge vs Lasso)</span>
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Objectif : Prédire une valeur numérique continue (ex: Prix immobilier, Température, Chiffre d’affaires)
          </span>
        </div>

        <RegressionPlayground />
      </section>

      {/* SECTION 3: Clustering Non-Supervisé */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border pb-3">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              Partie 3 • Apprentissage Non-Supervisé
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <PieChart className="w-6 h-6 text-emerald-400" />
              <span>Le Clustering : K-Means, DBSCAN & Découverte de Groupes</span>
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Objectif : Aucun label pré-défini ! Regroupement par similarité géométrique intrinsèque.
          </span>
        </div>

        <KMeansVisualizer />
      </section>

      {/* Comprehensive Algorithm Summary Matrix */}
      <section className="p-6 rounded-2xl bg-surface-card border border-border space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>Tableau Récapitulatif : Quel Algorithme Choisir selon le Problème ?</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-border text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3">Algorithme</th>
                <th className="py-3 px-3">Famille</th>
                <th className="py-3 px-3">Linéaire ?</th>
                <th className="py-3 px-3">Forces Principales</th>
                <th className="py-3 px-3">Faiblesses / Pièges</th>
                <th className="py-3 px-3">Quand l'utiliser</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-bold text-cyan-400">Régression Logistique</td>
                <td className="py-3 px-3">Classification</td>
                <td className="py-3 px-3 text-emerald-400">Oui</td>
                <td className="py-3 px-3">Interprétable, probabilités calibrées, rapide</td>
                <td className="py-3 px-3">Incapable de séparer des classes non-linéaires</td>
                <td className="py-3 px-3">Scoring bancaire, médecine, baseline rapide</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-bold text-violet-400">K-Nearest Neighbors (KNN)</td>
                <td className="py-3 px-3">Classif / Régression</td>
                <td className="py-3 px-3 text-rose-400">Non</td>
                <td className="py-3 px-3">Aucune hypothèse, capte des frontières très libres</td>
                <td className="py-3 px-3">Très lent en prédiction, sensible au fléau de la dimension</td>
                <td className="py-3 px-3">Recommandation de proximité, petits jeux de données</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-bold text-emerald-400">Arbres & Forêts Aléatoires</td>
                <td className="py-3 px-3">Ensemble / Arbres</td>
                <td className="py-3 px-3 text-rose-400">Non</td>
                <td className="py-3 px-3">Gère données mixtes, insensible aux échelles et outliers</td>
                <td className="py-3 px-3">Surapprentissage (arbre seul), effet boîte noire (forêt)</td>
                <td className="py-3 px-3">Données tabulaires par excellence (Kaggle gold standard)</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-bold text-amber-400">Support Vector Machines (SVM)</td>
                <td className="py-3 px-3">Classif / Marge</td>
                <td className="py-3 px-3">Oui / Non (Kernels)</td>
                <td className="py-3 px-3">Marge maximale, robuste au surapprentissage en haute dimension</td>
                <td className="py-3 px-3">Coût d'entraînement O(n³), réglage délicat de C et γ</td>
                <td className="py-3 px-3">Bio-informatique (génomique), analyse textuelle</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-bold text-pink-400">K-Means Clustering</td>
                <td className="py-3 px-3">Non-Supervisé</td>
                <td className="py-3 px-3">Sphérique</td>
                <td className="py-3 px-3">Simple, rapide, partitionne efficacement l’espace</td>
                <td className="py-3 px-3">Suppose des clusters sphériques de même taille, k fixé</td>
                <td className="py-3 px-3">Segmentation client, compression d'images, prétraitement</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
