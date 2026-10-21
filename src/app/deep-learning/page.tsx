'use client';

import React from 'react';
import NeuralBrain3D from '@/components/NeuralBrain3D';
import ActivationPlayground from '@/components/ActivationPlayground';
import { Brain, Sparkles, Cpu, Zap, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import { useExploration } from '@/context/ExplorationContext';

export default function DeepLearningPage() {
  const { mode } = useExploration();

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-pink-950/70 border border-pink-500/30 text-pink-300 text-xs font-semibold">
          <Brain className="w-3.5 h-3.5 text-pink-400" />
          <span>Module 4 • Réseaux de Neurones Profonds</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Deep Learning : Du Cerveau Humain au Perceptron Multicouche
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Comment 86 milliards de neurones biologiques ont inspiré les architectures d'intelligence artificielle modernes, de la rétropropagation du gradient jusqu'aux fonctions d'activation non-linéaires.
        </p>
      </div>

      {/* SECTION 1: 3D Brain & Biological Analogy */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border pb-3">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Anatomie Synaptique 3D
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-400" />
              <span>Synapse Biologique vs Neurone Artificiel</span>
            </h2>
          </div>
          <span className="text-xs text-slate-400">Pivotez en 3D avec la souris</span>
        </div>

        <NeuralBrain3D mode="hybrid" />

        {/* Analogy Table */}
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

      {/* SECTION 2: Activation Functions Interactive Laboratory */}
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

      {/* SECTION 3: Deep Neural Network Architecture & Backprop */}
      <section className="p-6 rounded-2xl bg-surface-card border border-border space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Comment Fonctionne l'Apprentissage d'un Réseau Profond ?</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
          <div className="p-5 rounded-xl bg-background border border-border space-y-3">
            <span className="text-cyan-400 font-bold text-sm block">1. La Passe Avant (Forward Pass)</span>
            <p>
              L'information se propage de couche en couche, de l'entrée vers la sortie :
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-border font-mono text-cyan-300 text-[11px] space-y-1">
              <div>z^[l] = W^[l] · a^[l-1] + b^[l]</div>
              <div>a^[l] = f(z^[l])</div>
            </div>
            <p>
              À la fin, le réseau calcule une fonction de perte <em>Loss</em> (ex: Cross-Entropy ou MSE) mesurant l'écart entre la prédiction et la réalité.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-background border border-border space-y-3">
            <span className="text-violet-400 font-bold text-sm block">2. La Rétropropagation (Backward Pass)</span>
            <p>
              Grâce à la <strong>règle de dérivation des fonctions composées (Chain Rule)</strong>, l'erreur est renvoyée en sens inverse pour calculer le gradient de chaque poids :
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-border font-mono text-violet-300 text-[11px] space-y-1">
              <div>∂L/∂W = (∂L/∂a) · (∂a/∂z) · (∂z/∂W)</div>
              <div>W ← W - η · (∂L/∂W)</div>
            </div>
            <p>
              L'optimiseur (SGD, Adam, RMSprop) fait un petit pas dans le sens opposé au gradient pour minimiser la perte.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
