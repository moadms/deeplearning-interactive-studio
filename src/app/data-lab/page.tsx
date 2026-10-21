'use client';

import React from 'react';
import AutoDataLab from '@/components/AutoDataLab';
import { UploadCloud, Sparkles, Filter, Cpu, Target, ShieldCheck } from 'lucide-react';

export default function DataLabPage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
          <span>Atelier Pratique Automatisé • Mon Lab</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Téléversez Vos Données & Entraînez Vos Modèles
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Le studio tout-en-un où vous pouvez importer n'importe quel jeu de données CSV, examiner son contenu, filtrer les colonnes, corriger les anomalies et lancer l'apprentissage d'un algorithme de Machine Learning ou Deep Learning en temps réel.
        </p>
      </div>

      {/* Main AutoML Wizard */}
      <AutoDataLab />
    </div>
  );
}
