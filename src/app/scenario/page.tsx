'use client';

import React from 'react';
import ScenarioPipelineEndToEnd from '@/components/ScenarioPipelineEndToEnd';
import { Sparkles, ArrowRight, Play, Database } from 'lucide-react';

export default function ScenarioPage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Scénario Complet • De l'Upload au Déploiement</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Le Grand Scénario : De A à Z en 8 Étapes
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Suivez le cycle de vie complet d'un projet d'intelligence artificielle : téléversez ou sélectionnez des données, effectuez l'audit de santé, nettoyez les anomalies, appliquez la mise à l'échelle, entraînez un modèle et testez des prédictions en direct.
        </p>
      </div>

      {/* The Masterclass Scenario Pipeline */}
      <ScenarioPipelineEndToEnd />
    </div>
  );
}
