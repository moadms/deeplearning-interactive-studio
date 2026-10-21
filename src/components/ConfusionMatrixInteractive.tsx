'use client';

import React, { useState } from 'react';
import { Target, AlertCircle, CheckCircle, Sliders, TrendingUp, ShieldAlert, Award } from 'lucide-react';
import { useExploration } from '@/context/ExplorationContext';

export default function ConfusionMatrixInteractive() {
  const { mode, addXp, completeQuest } = useExploration();
  const [threshold, setThreshold] = useState<number>(0.5);

  // Simulated synthetic test probabilities for 50 samples
  // 25 truly positive (y=1), 25 truly negative (y=0)
  const totalPos = 25;
  const totalNeg = 25;

  // As threshold increases, fewer are predicted positive:
  // TP decreases, FP decreases, TN increases, FN increases
  const tp = Math.round(totalPos * Math.pow(1 - threshold, 0.6));
  const fn = totalPos - tp;
  const fp = Math.round(totalNeg * Math.pow(1 - threshold, 1.8));
  const tn = totalNeg - fp;

  const total = tp + tn + fp + fn || 1;
  const accuracy = ((tp + tn) / total) * 100;
  const precision = tp + fp > 0 ? (tp / (tp + fp)) * 100 : 0;
  const recall = tp + fn > 0 ? (tp / (tp + fn)) * 100 : 0;
  const specificity = tn + fp > 0 ? (tn / (tn + fp)) * 100 : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  // ROC curve coordinates
  const fpr = (100 - specificity) / 100; // False positive rate: FP / (FP + TN)
  const tpr = recall / 100; // True positive rate: TP / (TP + FN)

  const handleSliderChange = (newVal: number) => {
    setThreshold(newVal);
    addXp(2);
    completeQuest('adjust_threshold');
  };

  return (
    <div className="w-full space-y-8 p-6 rounded-2xl bg-surface-card border border-border">
      {/* Header & Threshold Slider */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span>Matrice de Confusion Dynamique & Arbitrage Précision / Rappel</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Déplacez le seuil de décision (Threshold θ) pour observer en temps réel la bascule entre Fausses Alertes (FP) et Cas Manqués (FN).
          </p>
        </div>

        {/* Threshold Slider */}
        <div className="flex items-center space-x-3 bg-background px-4 py-2 rounded-xl border border-border">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-300 font-medium">Seuil θ :</span>
          <input
            type="range"
            min="0.1"
            max="0.9"
            step="0.05"
            value={threshold}
            onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
            className="w-28 accent-cyan-400 cursor-pointer"
          />
          <span className="font-mono text-cyan-300 text-xs font-bold w-12 text-right">
            {(threshold * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Grid: 2x2 Matrix + Dynamic Metrics Gauges + ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* The 2x2 Confusion Matrix */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-center text-xs font-semibold text-slate-400 mb-1">
            Vérité Terrain (Ground Truth) vs Prédiction du Modèle
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* TP */}
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex flex-col items-center justify-center text-center shadow-glow-emerald">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold mb-1">
                Vrais Positifs (TP)
              </span>
              <span className="text-3xl font-mono font-extrabold text-white">{tp}</span>
              <span className="text-[11px] text-emerald-300/80 mt-1">Malades bien détectés</span>
            </div>

            {/* FP */}
            <div className="p-4 rounded-xl bg-amber-950/50 border border-amber-500/40 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-1">
                Faux Positifs (FP)
              </span>
              <span className="text-3xl font-mono font-extrabold text-white">{fp}</span>
              <span className="text-[11px] text-amber-300/80 mt-1">Fausse Alerte (Erreur Type I)</span>
            </div>

            {/* FN */}
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold mb-1">
                Faux Négatifs (FN)
              </span>
              <span className="text-3xl font-mono font-extrabold text-white">{fn}</span>
              <span className="text-[11px] text-rose-300/80 mt-1">Cas Manqué ! (Erreur Type II)</span>
            </div>

            {/* TN */}
            <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/50 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
                Vrais Négatifs (TN)
              </span>
              <span className="text-3xl font-mono font-extrabold text-white">{tn}</span>
              <span className="text-[11px] text-cyan-300/80 mt-1">Sains bien identifiés</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-background p-3 rounded-xl border border-border text-center">
            Total des 50 échantillons analysés (25 Positifs réels, 25 Négatifs réels)
          </div>
        </div>

        {/* Calculated Metrics */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-3.5 rounded-xl bg-surface border border-border space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">Exactitude (Accuracy)</span>
              <span className="font-mono text-cyan-300 font-bold">{accuracy.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${accuracy}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">(TP + TN) / Total</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-border space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">Précision (Precision)</span>
              <span className="font-mono text-emerald-300 font-bold">{precision.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${precision}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">TP / (TP + FP)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-border space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">Rappel / Sensibilité (Recall)</span>
              <span className="font-mono text-pink-300 font-bold">{recall.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-pink-400 rounded-full transition-all" style={{ width: `${recall}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">TP / (TP + FN)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-border space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">F1-Score (Harmonique)</span>
              <span className="font-mono text-violet-300 font-bold">{f1.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-violet-400 rounded-full transition-all" style={{ width: `${f1}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">2 × (P × R) / (P + R)</span>
          </div>
        </div>

        {/* Mini ROC Curve Visualizer */}
        <div className="lg:col-span-3 p-4 rounded-xl bg-background border border-border space-y-2">
          <div className="text-xs font-bold text-white flex items-center justify-between">
            <span>Courbe ROC (AUC ≈ 0.89)</span>
            <span className="text-[10px] font-mono text-cyan-400">θ = {(threshold * 100).toFixed(0)}%</span>
          </div>

          <div className="relative w-full aspect-square bg-slate-950 rounded-lg border border-border/80 p-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Diagonal (Random Classifier AUC = 0.5) */}
              <line x1="0" y1="100" x2="100" y2="0" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />

              {/* ROC Curve Path */}
              <path
                d="M 0 100 Q 15 15, 100 0"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />

              {/* Operating Point */}
              <circle
                cx={fpr * 100}
                cy={100 - tpr * 100}
                r="4.5"
                fill="#fbbf24"
                stroke="#080c14"
                strokeWidth="1.5"
                className="animate-pulse"
              />
            </svg>
          </div>
          <div className="text-[10px] text-slate-400 leading-tight">
            Axe X: Taux de Faux Positifs (FPR)<br />
            Axe Y: Taux de Vrais Positifs (TPR / Recall)
          </div>
        </div>
      </div>

      {/* Explanatory Box (Pedagogical Trade-off) */}
      <div className="p-4 rounded-xl bg-surface border border-border text-xs leading-relaxed">
        {mode === 'beginner' ? (
          <div>
            <strong className="text-emerald-400 block mb-1">💡 Quand privilégier la Précision ou le Rappel ?</strong>
            <ul className="list-disc pl-4 space-y-1 text-slate-300">
              <li>
                <strong>Privilégier le Rappel (Recall) :</strong> Diagnostic du cancer ou détection d'incendie. Mieux vaut déclencher une fausse alerte (FP) plutôt que de laisser mourir un patient (FN=0 visé) ! On baisse le seuil θ.
              </li>
              <li>
                <strong>Privilégier la Précision :</strong> Filtre anti-spam ou recommandation YouTube. Si un mail important de votre patron part dans les spams (FP), c'est une catastrophe. On préfère laisser passer un spam plutôt que de bloquer un vrai mail. On monte le seuil θ.
              </li>
            </ul>
          </div>
        ) : (
          <div className="font-mono text-cyan-300 space-y-1">
            <div className="text-slate-400 font-bold font-sans">Formalisation Mathématique :</div>
            <div>Matrice de Coût Asymétrique : Coût_Total = C_FP · FP + C_FN · FN</div>
            <div>Le seuil bayésien optimal : θ* = C_FP / (C_FP + C_FN)</div>
            <div>En cas de déséquilibre fort de classes, optimiser l'AUC-PR (Precision-Recall) plutôt que ROC.</div>
          </div>
        )}
      </div>
    </div>
  );
}
