'use client';

import React from 'react';
import DataPipelineWizard from '@/components/DataPipelineWizard';
import { Database, Sparkles, Filter, Layers, BarChart3, ShieldAlert, ArrowDown } from 'lucide-react';
import { useExploration } from '@/context/ExplorationContext';

export default function DataCleaningPage() {
  const { mode } = useExploration();

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>Module 1 • Fondations de la Data</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Data Studio : Diagnostic, Nettoyage & Feature Scaling
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          En Data Science et Deep Learning, 80% du travail consiste à préparer les données. Un algorithme de pointe entraîné sur des données bruitées, asymétriques ou incomplètes ne produira que des erreurs (principe <em>« Garbage In, Garbage Out »</em>).
        </p>
      </div>

      {/* Pedagogical Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-surface-card border border-border space-y-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center">
            <Filter className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">1. Valeurs Manquantes & Doublons</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {mode === 'beginner'
              ? 'Des trous dans un tableau de bord faussent la vision d’ensemble. On ne peut pas simplement tout supprimer : si on efface chaque ligne contenant un trou, on risque de perdre 70% du jeu de données !'
              : 'Imputation paramétrique (moyenne μ, médiane, mode) vs non-paramétrique (KNN imputation, MICE). Attention à l’effet d’atténuation de la variance si on impute aveuglément par la constante.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-border space-y-3">
          <div className="w-9 h-9 rounded-xl bg-violet-950 border border-violet-800 text-violet-400 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">2. Feature Scaling & Normalisation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {mode === 'beginner'
              ? 'Si vous comparez un salaire de 45 000 € avec un âge de 30 ans, le salaire va écraser l’âge rien que par son ordre de grandeur ! Le scaling ramène tout le monde sur un pied d’égalité.'
              : 'Min-Max projette sur [0, 1]. Z-score Standardisation produit une loi normale centrée réduite N(0, 1). Indispensable pour la convergence de la descente de gradient et la régularisation L1/L2.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-border space-y-3">
          <div className="w-9 h-9 rounded-xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">3. Équilibrage des Données (SMOTE)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {mode === 'beginner'
              ? 'Si 99% des clients restent et 1% partent, un modèle paresseux qui prédit "personne ne part" a 99% d’accuracy mais ne sert à rien. SMOTE invente des clients virtuels réalistes pour rééquilibrer le match.'
              : 'Synthetic Minority Over-sampling Technique (SMOTE) calcule les k plus proches voisins de la classe minoritaire et génère des points par convexité linéaire : x_synth = x_i + λ(x_nn - x_i).'}
          </p>
        </div>
      </div>

      {/* Main Interactive Studio Wizard Component */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-xs text-cyan-400 font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Atelier Interactif Pratique</span>
        </div>
        <DataPipelineWizard />
      </section>
    </div>
  );
}
