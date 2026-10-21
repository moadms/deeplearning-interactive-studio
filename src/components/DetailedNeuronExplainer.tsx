'use client';

import React, { useState } from 'react';
import {
  Brain,
  Cpu,
  Zap,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Layers,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { useExploration } from '@/context/ExplorationContext';

export default function DetailedNeuronExplainer() {
  const { mode } = useExploration();

  // Interactive numeric simulator for 1 neuron
  const [x1, setX1] = useState<number>(6); // Heures de révision
  const [x2, setX2] = useState<number>(8); // Heures de sommeil
  const [w1, setW1] = useState<number>(0.6); // Poids 1
  const [w2, setW2] = useState<number>(0.4); // Poids 2
  const [bias, setBias] = useState<number>(-4.5); // Biais
  const [activationType, setActivationType] = useState<'sigmoid' | 'relu' | 'tanh'>('sigmoid');

  // Math steps
  const term1 = x1 * w1;
  const term2 = x2 * w2;
  const weightedSumZ = term1 + term2 + bias;

  let activatedOutputA = 0;
  if (activationType === 'sigmoid') {
    activatedOutputA = 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, weightedSumZ))));
  } else if (activationType === 'relu') {
    activatedOutputA = Math.max(0, weightedSumZ);
  } else if (activationType === 'tanh') {
    activatedOutputA = Math.tanh(weightedSumZ);
  }

  // Backprop simulation slider
  const [targetY, setTargetY] = useState<number>(1); // Vrai label (1 = A réussi)
  const [learningRate, setLearningRate] = useState<number>(0.1);
  const errorDiff = activatedOutputA - targetY;
  const lossMSE = 0.5 * Math.pow(errorDiff, 2);

  // Derivations
  const dLoss_da = errorDiff;
  const da_dz = activationType === 'sigmoid' ? activatedOutputA * (1 - activatedOutputA) : (weightedSumZ > 0 ? 1 : 0);
  const dz_dw1 = x1;
  const dLoss_dw1 = dLoss_da * da_dz * dz_dw1;
  const updatedW1 = w1 - learningRate * dLoss_dw1;

  return (
    <div className="w-full space-y-12">
      {/* SECTION 1: The Anatomy of a Single Neuron */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-card border border-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Le Bloc Élémentaire de l'IA
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Anatomie Complète d'un Neurone Artificiel (Perceptron)
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Fonction :</span>
            {(['sigmoid', 'relu', 'tanh'] as const).map((fn) => (
              <button
                key={fn}
                onClick={() => setActivationType(fn)}
                className={`px-3 py-1 rounded-lg font-mono font-bold uppercase text-[11px] transition-all ${
                  activationType === fn
                    ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                    : 'bg-surface text-slate-300 border border-border hover:text-white'
                }`}
              >
                {fn}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Diagram of the Neuron Dataflow */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-border space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-center">
            {/* Step 1: Inputs */}
            <div className="p-4 rounded-xl bg-surface/80 border border-cyan-500/30 space-y-2">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">1. Entrées (xᵢ)</span>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between bg-slate-900 p-2 rounded">
                  <span className="text-slate-400">x₁ (Révision) :</span>
                  <strong className="text-cyan-300">{x1} h</strong>
                </div>
                <div className="flex justify-between bg-slate-900 p-2 rounded">
                  <span className="text-slate-400">x₂ (Sommeil) :</span>
                  <strong className="text-cyan-300">{x2} h</strong>
                </div>
              </div>
            </div>

            {/* Step 2: Synaptic Weights */}
            <div className="p-4 rounded-xl bg-surface/80 border border-violet-500/30 space-y-2">
              <span className="text-[10px] font-mono uppercase text-violet-400 font-bold block">2. Poids (wᵢ) & Biais (b)</span>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between bg-slate-900 p-2 rounded">
                  <span className="text-slate-400">w₁ :</span>
                  <strong className="text-violet-300">{w1.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between bg-slate-900 p-2 rounded">
                  <span className="text-slate-400">w₂ :</span>
                  <strong className="text-violet-300">{w2.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between bg-slate-900 p-2 rounded">
                  <span className="text-slate-400">Biais b :</span>
                  <strong className="text-amber-300">{bias.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Step 3: Weighted Sum */}
            <div className="p-4 rounded-xl bg-surface/80 border border-amber-500/30 space-y-2">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">3. Somme z = ∑wᵢxᵢ + b</span>
              <div className="p-2.5 rounded bg-slate-900 font-mono text-xs text-center space-y-1">
                <div className="text-slate-400 text-[10px]">({x1}×{w1}) + ({x2}×{w2}) + ({bias})</div>
                <div className="text-2xl font-black text-amber-400">z = {weightedSumZ.toFixed(2)}</div>
              </div>
            </div>

            {/* Step 4: Activated Output */}
            <div className="p-4 rounded-xl bg-surface/80 border border-emerald-500/30 space-y-2">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">4. Activation a = f(z)</span>
              <div className="p-2.5 rounded bg-slate-900 font-mono text-xs text-center space-y-1">
                <div className="text-slate-400 text-[10px]">{activationType}({weightedSumZ.toFixed(2)})</div>
                <div className="text-2xl font-black text-emerald-400">
                  {activationType === 'sigmoid'
                    ? `${(activatedOutputA * 100).toFixed(1)}%`
                    : activatedOutputA.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Sliders to play with the neuron */}
          <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Révision x₁ :</span>
                <span className="font-mono text-cyan-300 font-bold">{x1} h</span>
              </div>
              <input
                type="range" min="0" max="15" step="1" value={x1}
                onChange={(e) => setX1(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Sommeil x₂ :</span>
                <span className="font-mono text-cyan-300 font-bold">{x2} h</span>
              </div>
              <input
                type="range" min="0" max="12" step="1" value={x2}
                onChange={(e) => setX2(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Poids w₁ :</span>
                <span className="font-mono text-violet-300 font-bold">{w1.toFixed(2)}</span>
              </div>
              <input
                type="range" min="-1" max="2" step="0.05" value={w1}
                onChange={(e) => setW1(parseFloat(e.target.value))}
                className="w-full accent-violet-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Poids w₂ :</span>
                <span className="font-mono text-violet-300 font-bold">{w2.toFixed(2)}</span>
              </div>
              <input
                type="range" min="-1" max="2" step="0.05" value={w2}
                onChange={(e) => setW2(parseFloat(e.target.value))}
                className="w-full accent-violet-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Biais b :</span>
                <span className="font-mono text-amber-300 font-bold">{bias.toFixed(2)}</span>
              </div>
              <input
                type="range" min="-10" max="5" step="0.5" value={bias}
                onChange={(e) => setBias(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 2 Critical Questions Answered with Simple Analogies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
            <span className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Pourquoi a-t-on absolument besoin du Biais (b) ?</span>
            </span>
            <p className="text-slate-300">
              {mode === 'beginner'
                ? 'Sans biais, si toutes vos entrées sont à zéro (zéro heure de révision, zéro sommeil), le résultat serait obligatoirement zéro ! Le biais permet de fixer le niveau de difficulté initial (le seuil d’exigence minimal avant qu’un neurone ne se réveille).'
                : 'Géométriquement, les poids w définissent l’orientation de l’hyperplan de décision. Sans biais, l’hyperplan wᵀx = 0 passerait obligatoirement par l’origine (0, 0). Le biais b permet de translater la frontière dans l’espace pour séparer des données situées n’importe où.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5 text-sm">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Pourquoi la Non-Linéarité est-elle obligatoire ?</span>
            </span>
            <p className="text-slate-300">
              {mode === 'beginner'
                ? 'Si vous empilez 100 opérations linéaires (multiplier puis additionner), le résultat final n’est rien d’autre qu’une seule grande multiplication ! Sans fonction non-linéaire (comme ReLU ou Sigmoïde), un réseau de 50 couches n’a pas plus de pouvoir qu’une simple droite.'
                : 'La composition de transformations affines est strictement affine : W₂ · (W₁ · x + b₁) + b₂ = (W₂W₁) · x + (W₂b₁ + b₂). Les fonctions d’activation brisent cette linéarité, permettant au réseau de devenir un approximateur universel de fonctions (Théorème de Cybenko).'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Backpropagation (La Rétropropagation Décomposée) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-card border border-border space-y-6">
        <div className="flex items-center space-x-2 text-violet-400 font-bold text-xs uppercase tracking-wider">
          <TrendingDown className="w-4 h-4 text-violet-400" />
          <span>Le Moteur d'Apprentissage : Descente de Gradient & Rétropropagation</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-white">
          Comment le Réseau Apprend de ses Erreurs (Backprop Pas-à-Pas)
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          L'apprentissage est une boucle en 3 temps : on calcule la sortie (Forward), on mesure l'erreur commise (Loss), puis on remonte le réseau à l'envers (Backprop) grâce à la <strong>règle de dérivation en chaîne (Chain Rule)</strong> pour ajuster chaque poids proportionnellement à sa responsabilité.
        </p>

        {/* Chain Rule Interactive Formula Step */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-violet-500/30 space-y-4">
          <div className="text-xs font-mono text-cyan-400 font-bold">
            Application de la Règle de Dérivation en Chaîne sur w₁ :
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
            <div className="p-3 rounded-xl bg-surface border border-border">
              <span className="text-[10px] text-slate-400 block mb-1">1. Erreur Sortie ∂L/∂a</span>
              <div className="text-rose-400 font-extrabold text-base">{dLoss_da.toFixed(3)}</div>
              <span className="text-[10px] text-slate-500">(a - y)</span>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-border">
              <span className="text-[10px] text-slate-400 block mb-1">2. Pente Activation ∂a/∂z</span>
              <div className="text-violet-400 font-extrabold text-base">{da_dz.toFixed(3)}</div>
              <span className="text-[10px] text-slate-500">σ'(z) = a(1-a)</span>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-border">
              <span className="text-[10px] text-slate-400 block mb-1">3. Entrée Associée ∂z/∂w₁</span>
              <div className="text-cyan-400 font-extrabold text-base">{dz_dw1}</div>
              <span className="text-[10px] text-slate-500">x₁ = {x1}</span>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-950 to-slate-900 border border-violet-500 text-white shadow-glow-violet">
              <span className="text-[10px] text-amber-300 block mb-1">Gradient Total ∂L/∂w₁</span>
              <div className="text-amber-400 font-black text-base">{dLoss_dw1.toFixed(4)}</div>
              <span className="text-[10px] text-slate-400">(1 × 2 × 3)</span>
            </div>
          </div>

          {/* Weight Update Rule */}
          <div className="p-4 rounded-xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block mb-0.5 font-sans">Mise à jour du Poids : w₁ ← w₁ - η · (∂L/∂w₁)</span>
              <div className="text-emerald-300 font-bold">
                w₁ nouveau = {w1.toFixed(2)} - ({learningRate} × {dLoss_dw1.toFixed(3)}) ={' '}
                <span className="text-emerald-400 font-black text-sm">{updatedW1.toFixed(3)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Taux d'Apprentissage η :</span>
              <input
                type="range" min="0.01" max="0.5" step="0.01" value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-24 accent-violet-400"
              />
              <span className="text-violet-300 font-bold w-10 text-right">{learningRate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
