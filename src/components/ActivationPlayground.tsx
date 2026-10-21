'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Sparkles, TrendingUp, Cpu } from 'lucide-react';
import { useExploration } from '@/context/ExplorationContext';

interface ActivationInfo {
  name: string;
  formula: string;
  derivativeFormula: string;
  range: string;
  fn: (x: number) => number;
  derivative: (x: number) => number;
  bestUse: string;
  avoidUse: string;
  commonProblems: string;
  beginnerAnalogy: string;
}

export const ACTIVATIONS: Record<string, ActivationInfo> = {
  relu: {
    name: 'ReLU (Rectified Linear Unit)',
    formula: 'f(x) = max(0, x)',
    derivativeFormula: "f'(x) = 1 si x > 0 sinon 0",
    range: '[0, +∞[',
    fn: (x) => Math.max(0, x),
    derivative: (x) => (x > 0 ? 1 : 0),
    bestUse: 'Standard absolu pour les couches cachées (Hidden Layers) des CNN, MLP et Transformers.',
    avoidUse: 'Ne jamais utiliser dans la couche de sortie pour une régression avec cibles négatives ou probabilités.',
    commonProblems: 'Dying ReLU (neurone mort) : si un neurone reçoit constamment des entrées négatives, son gradient est nul et il n’apprend plus jamais.',
    beginnerAnalogy: 'Comme un interrupteur à clapet : si le courant est négatif, il bloque tout (zéro absolu). Dès que c’est positif, il laisse passer exactement le signal sans le freiner.',
  },
  sigmoid: {
    name: 'Sigmoïde (Logistic)',
    formula: 'σ(x) = 1 / (1 + e⁻ˣ)',
    derivativeFormula: "σ'(x) = σ(x) · (1 - σ(x)) ≤ 0.25",
    range: ']0, 1[',
    fn: (x) => 1 / (1 + Math.exp(-Math.max(-10, Math.min(10, x)))),
    derivative: (x) => {
      const s = 1 / (1 + Math.exp(-Math.max(-10, Math.min(10, x))));
      return s * (1 - s);
    },
    bestUse: 'Couche de sortie pour la classification binaire (prédiction d’une probabilité entre 0% et 100%).',
    avoidUse: 'À bannir absolument des couches cachées des réseaux profonds (> 2 couches).',
    commonProblems: 'Disparition du gradient (Vanishing Gradient) : aux extrêmes (x < -3 ou x > 3), la dérivée est quasi nulle, bloquant l’apprentissage.',
    beginnerAnalogy: 'Un variateur de lumière très progressif qui compresse n’importe quelle valeur infinie dans un intervalle rassurant entre 0% et 100%.',
  },
  tanh: {
    name: 'Tangente Hyperbolique (Tanh)',
    formula: 'tanh(x) = (eˣ - e⁻ˣ) / (eˣ + e⁻ˣ)',
    derivativeFormula: "tanh'(x) = 1 - tanh²(x)",
    range: ']-1, 1[',
    fn: (x) => Math.tanh(x),
    derivative: (x) => 1 - Math.pow(Math.tanh(x), 2),
    bestUse: 'Réseaux récurrents (RNN, LSTM, GRU) car elle est centrée en zéro (moyenne des sorties proche de 0).',
    avoidUse: 'Réseaux profonds feedforward sans normalisation par batch (Batch Normalization).',
    commonProblems: 'Souffre également du vanishing gradient aux extrêmes lorsque |x| devient grand.',
    beginnerAnalogy: 'Comme la sigmoïde, mais centrée à zéro : elle permet d’avoir des signaux négatifs clairs (freinage) et positifs (accélération).',
  },
  leaky_relu: {
    name: 'Leaky ReLU',
    formula: 'f(x) = x si x > 0 sinon 0.01x',
    derivativeFormula: "f'(x) = 1 si x > 0 sinon 0.01",
    range: ']-∞, +∞[',
    fn: (x) => (x > 0 ? x : 0.01 * x),
    derivative: (x) => (x > 0 ? 1 : 0.01),
    bestUse: 'Remplace ReLU lorsque vous observez des neurones morts (Dead Neurons) ou dans les GANs.',
    avoidUse: 'Lorsque la sparsité stricte (avoir de vrais zéros pour compresser le modèle) est requise.',
    commonProblems: 'Légèrement plus lent à calculer qu’une simple troncature ReLU, et le coefficient α=0.01 est un hyperparamètre fixe.',
    beginnerAnalogy: 'Une ReLU avec une petite fuite d’eau : même en cas de mauvaise passe (valeur négative), un petit filet d’information continue de couler pour que le neurone puisse se réveiller.',
  },
  gelu: {
    name: 'GELU (Gaussian Error Linear Unit)',
    formula: 'GELU(x) ≈ 0.5x · (1 + tanh(√(2/π)(x + 0.044715x³)))',
    derivativeFormula: 'Courbe dérivée lisse sans angle vif',
    range: ']≈ -0.17, +∞[',
    fn: (x) => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * Math.pow(x, 3)))),
    derivative: (x) => {
      const c = 0.044715;
      const inner = Math.sqrt(2 / Math.PI) * (x + c * Math.pow(x, 3));
      const t = Math.tanh(inner);
      return 0.5 * (1 + t) + 0.5 * x * (1 - t * t) * Math.sqrt(2 / Math.PI) * (1 + 3 * c * x * x);
    },
    bestUse: 'L’état de l’art pour les modèles Transformers modernes : BERT, GPT-3, GPT-4, LLaMA, Vision Transformers (ViT).',
    avoidUse: 'Petits microcontrôleurs embarqués très contraints en calcul flottant sans accélération matérielle.',
    commonProblems: 'Formule mathématique plus coûteuse que ReLU, nécessite souvent une approximation polynomiale.',
    beginnerAnalogy: 'Une ReLU intelligente et élégante : au lieu d’un coude brutal à zéro, elle s’incurve doucement selon une probabilité statistique gaussienne.',
  },
};

export default function ActivationPlayground() {
  const { mode } = useExploration();
  const [selectedKey, setSelectedKey] = useState<string>('relu');
  const [inputX, setInputX] = useState<number>(1.5);

  const current = ACTIVATIONS[selectedKey];
  const outputY = current.fn(inputX);
  const gradY = current.derivative(inputX);

  // Generate SVG curve points for x in [-5, 5]
  const svgWidth = 500;
  const svgHeight = 260;
  const minX = -5;
  const maxX = 5;
  const minY = -2;
  const maxY = 5;

  const toSvgX = (x: number) => ((x - minX) / (maxX - minX)) * svgWidth;
  const toSvgY = (y: number) => svgHeight - ((y - minY) / (maxY - minY)) * svgHeight;

  // Path data for f(x)
  let pathD = '';
  let derivPathD = '';
  const samples = 120;
  for (let i = 0; i <= samples; i++) {
    const x = minX + (i / samples) * (maxX - minX);
    const y = current.fn(x);
    const dy = current.derivative(x);
    const sx = toSvgX(x);
    const sy = toSvgY(y);
    const sdy = toSvgY(dy);

    if (i === 0) {
      pathD += `M ${sx} ${sy}`;
      derivPathD += `M ${sx} ${sdy}`;
    } else {
      pathD += ` L ${sx} ${sy}`;
      derivPathD += ` L ${sx} ${sdy}`;
    }
  }

  const isDyingNeuron = selectedKey === 'relu' && inputX <= 0;
  const isVanishingGradient = (selectedKey === 'sigmoid' || selectedKey === 'tanh') && Math.abs(inputX) >= 3;

  return (
    <div className="w-full space-y-8 p-6 rounded-2xl bg-surface-card border border-border">
      {/* Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-border">
        {Object.entries(ACTIVATIONS).map(([key, item]) => (
          <button
            key={key}
            onClick={() => setSelectedKey(key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedKey === key
                ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                : 'bg-surface hover:bg-slate-800 text-slate-300 border border-border'
            }`}
          >
            {item.name.split(' (')[0]}
          </button>
        ))}
      </div>

      {/* Main Grid: Interactive Curve & Real-Time Neuron Probe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-7 bg-background/90 p-5 rounded-2xl border border-border/80 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-cyan-400">
              <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" />
              Fonction f(x)
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-violet-400">
              <span className="w-3 h-3 rounded-full bg-violet-400 inline-block" />
              Dérivée f'(x) [Gradient]
            </span>
            <span>Domaine : [-5, +5]</span>
          </div>

          <div className="relative w-full overflow-hidden rounded-xl border border-border/60 bg-slate-950">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
              {/* Axes */}
              <line
                x1="0"
                y1={toSvgY(0)}
                x2={svgWidth}
                y2={toSvgY(0)}
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <line
                x1={toSvgX(0)}
                y1="0"
                x2={toSvgX(0)}
                y2={svgHeight}
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Curve: Derivative */}
              <path d={derivPathD} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeOpacity="0.8" />

              {/* Curve: Activation f(x) */}
              <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="3" />

              {/* Current Point Dot for f(x) */}
              <circle
                cx={toSvgX(inputX)}
                cy={toSvgY(outputY)}
                r="6"
                fill="#22d3ee"
                className="animate-pulse"
                stroke="#080c14"
                strokeWidth="2"
              />

              {/* Current Point Dot for f'(x) */}
              <circle
                cx={toSvgX(inputX)}
                cy={toSvgY(gradY)}
                r="5"
                fill="#a78bfa"
                stroke="#080c14"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Interactive Slider for Input x */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Injecter le potentiel d'action x (Entrée pondérée z = ∑wᵢxᵢ + b) :</span>
              </label>
              <span className="font-mono text-cyan-300 text-sm font-bold bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800">
                x = {inputX.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.05"
              value={inputX}
              onChange={(e) => setInputX(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* Real-time Diagnostic & Value Gauges */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
              <span className="text-[11px] font-semibold text-cyan-400 block mb-1">Sortie Activée a = f(x)</span>
              <span className="text-2xl font-mono font-extrabold text-white">
                {outputY.toFixed(4)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-500/30">
              <span className="text-[11px] font-semibold text-violet-400 block mb-1">Gradient Rétropropagé f'(x)</span>
              <span className="text-2xl font-mono font-extrabold text-white">
                {gradY.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Warning / Health Status Banner */}
          {isDyingNeuron && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-start space-x-2.5 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-300 block">Alerte : Dying ReLU Détecté !</strong>
                Puisque x ≤ 0, la sortie est 0 et le gradient est strictement 0. Ce neurone ne transmet aucun signal et ne mettra jamais ses poids à jour lors de la backpropagation.
              </div>
            </div>
          )}

          {isVanishingGradient && (
            <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-xs text-amber-200 flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block">Alerte : Vanishing Gradient (Disparition) !</strong>
                Dans les zones de saturation, la dérivée f'(x) tend vers 0 ({gradY.toFixed(4)}). Le signal de correction s'éteint avant d'atteindre les premières couches du réseau.
              </div>
            </div>
          )}

          {/* Educational Guidance */}
          <div className="p-4 rounded-xl bg-surface border border-border space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{current.name}</span>
              <span className="text-slate-400 font-mono text-[11px]">Plage : {current.range}</span>
            </div>

            {mode === 'beginner' ? (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 text-xs leading-relaxed">
                <span className="font-semibold block text-emerald-400 mb-1">💡 Analogie de la vie quotidienne :</span>
                {current.beginnerAnalogy}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-900 border border-border font-mono text-cyan-300 text-xs">
                <div>Formule : {current.formula}</div>
                <div className="text-violet-300 mt-1">Dérivée : {current.derivativeFormula}</div>
              </div>
            )}

            <div className="space-y-2 pt-1">
              <div className="flex items-start space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Où l'utiliser : </strong>
                  <span className="text-slate-300">{current.bestUse}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2 text-rose-400">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Où NE JAMAIS l'utiliser : </strong>
                  <span className="text-slate-300">{current.avoidUse}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
