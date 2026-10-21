'use client';

import React from 'react';
import NeuralBrain3D from '@/components/NeuralBrain3D';
import ActivationPlayground from '@/components/ActivationPlayground';
import DetailedNeuronExplainer from '@/components/DetailedNeuronExplainer';
import { Brain, Sparkles, Cpu, Zap, AlertTriangle, Layers, ArrowRight, Lightbulb, TrendingDown } from 'lucide-react';
import { useExploration } from '@/context/ExplorationContext';

export default function DeepLearningPage() {
  const { mode } = useExploration();

  return (
    <div className="space-y-16 pb-16 animate-fade-in-up">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-pink-950/70 border border-pink-500/30 text-pink-300 text-xs font-semibold">
          <Brain className="w-3.5 h-3.5 text-pink-400" />
          <span>Module 4 • Réseaux de Neurones Profonds & Théorie</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Comprendre les Réseaux de Neurones en Détail
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Des synapses du cerveau humain aux matrices de poids artificielles. Découvrez étape par étape comment un neurone effectue ses calculs, pourquoi le biais et la non-linéarité sont indispensables, et comment la rétropropagation du gradient ajuste des millions de paramètres.
        </p>
      </div>

      {/* SECTION 1: Detailed Neuron Anatomy & Interactive Simulator */}
      <DetailedNeuronExplainer />

      {/* SECTION 2: 3D Brain & Biological Analogy */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border pb-3">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Anatomie Synaptique 3D
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-400" />
              <span>Synapse Biologique vs Neurone Artificiel en 3D</span>
            </h2>
          </div>
          <span className="text-xs text-slate-400">Pivotez à 360° avec la souris</span>
        </div>

        <NeuralBrain3D mode="hybrid" />

        {/* Detailed Analogy Table */}
        <div className="p-6 rounded-2xl bg-surface-card border border-border overflow-x-auto">
          <h3 className="text-sm font-bold text-white mb-4">
            Dictionnaire des Équivalences Biologique ⟷ Artificiel
          </h3>
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-border text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Composant Biologique</th>
                <th className="py-2.5 px-3">Équivalent Artificiel (Deep Learning)</th>
                <th className="py-2.5 px-3">Rôle Mathématique & Fonctionnel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-semibold text-emerald-400">Dendrites</td>
                <td className="py-3 px-3 font-mono font-bold text-cyan-300">Vecteur d'entrée (x₁, x₂, ..., xₙ)</td>
                <td className="py-3 px-3 text-slate-400">Réception des signaux des capteurs ou des neurones précédents</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-semibold text-emerald-400">Efficacité Synaptique</td>
                <td className="py-3 px-3 font-mono font-bold text-cyan-300">Poids d'interconnexion (wᵢ)</td>
                <td className="py-3 px-3 text-slate-400">Amplifie ou atténue l'importance de chaque signal reçu (Plasticité)</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-semibold text-emerald-400">Corps Cellulaire (Soma)</td>
                <td className="py-3 px-3 font-mono font-bold text-cyan-300">Sommateur pondéré ∑(wᵢxᵢ) + b</td>
                <td className="py-3 px-3 text-slate-400">Intégration spatio-temporelle de toutes les impulsions reçues</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-semibold text-emerald-400">Seuil d'excitation membranaire</td>
                <td className="py-3 px-3 font-mono font-bold text-cyan-300">Biais (b)</td>
                <td className="py-3 px-3 text-slate-400">Niveau de base nécessaire pour déclencher un potentiel d'action</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-semibold text-emerald-400">Potentiel d'Action (Décharge)</td>
                <td className="py-3 px-3 font-mono font-bold text-cyan-300">Fonction d'Activation a = f(z)</td>
                <td className="py-3 px-3 text-slate-400">Introduit la non-linéarité obligatoire pour résoudre des problèmes complexes</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-semibold text-emerald-400">Plasticité Hebbienne</td>
                <td className="py-3 px-3 font-mono font-bold text-cyan-300">Backpropagation & Gradient Descent</td>
                <td className="py-3 px-3 text-slate-400">« Neurons that fire together wire together » : ajustement des poids w ← w - η·∇L</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 3: Activation Functions Interactive Laboratory */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border pb-3">
          <div>
            <span className="text-xs font-mono text-violet-400 uppercase tracking-wider font-semibold">
              Laboratoire Interactif des Fonctions d'Activation
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-6 h-6 text-violet-400" />
              <span>Courbes, Dérivées & Analyse du Gradient (From Scratch)</span>
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Simulez les gradients et détectez les neurones morts en direct
          </span>
        </div>

        <ActivationPlayground />
      </section>
    </div>
  );
}
