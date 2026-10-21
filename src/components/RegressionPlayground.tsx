'use client';

import React, { useState } from 'react';
import { TrendingUp, Sliders, Sparkles, AlertCircle, CheckCircle, Flame } from 'lucide-react';
import { linearRegressionFit, polynomialRegressionFit } from '@/lib/mlAlgorithms';
import { useExploration } from '@/context/ExplorationContext';

export default function RegressionPlayground() {
  const { mode, addXp, completeQuest } = useExploration();
  const [degree, setDegree] = useState<number>(1);
  const [lambdaReg, setLambdaReg] = useState<number>(0);
  const [regType, setRegType] = useState<'none' | 'ridge' | 'lasso'>('none');

  // Sample data points: surface (m2) vs price (k€)
  const initialPoints = [
    { x: 30, y: 150 },
    { x: 45, y: 210 },
    { x: 60, y: 250 },
    { x: 75, y: 310 },
    { x: 90, y: 340 },
    { x: 110, y: 420 },
    { x: 130, y: 460 },
    { x: 150, y: 530 },
  ];

  const linFit = linearRegressionFit(initialPoints);
  const polyPredict = polynomialRegressionFit(initialPoints, degree);

  // SVG dimensions
  const svgWidth = 460;
  const svgHeight = 260;
  const minX = 20;
  const maxX = 160;
  const minY = 100;
  const maxY = 600;

  const toSvgX = (x: number) => ((x - minX) / (maxX - minX)) * svgWidth;
  const toSvgY = (y: number) => svgHeight - ((y - minY) / (maxY - minY)) * svgHeight;

  // Compute curve path
  let curvePathD = '';
  const numSteps = 50;
  for (let i = 0; i <= numSteps; i++) {
    const x = minX + (i / numSteps) * (maxX - minX);
    let y = polyPredict(x);

    // Apply shrinkage if regularization active
    if (regType === 'ridge') {
      y = y * (1 / (1 + lambdaReg * 0.05));
    } else if (regType === 'lasso') {
      y = Math.max(0, y - lambdaReg * 15);
    }

    const sx = toSvgX(x);
    const sy = toSvgY(y);
    if (i === 0) curvePathD += `M ${sx} ${sy}`;
    else curvePathD += ` L ${sx} ${sy}`;
  }

  const isOverfitting = degree >= 4;
  const isUnderfitting = degree === 1;

  return (
    <div className="w-full space-y-6 p-6 rounded-2xl bg-surface-card border border-border">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span>Régression Linéaire, Polynomiale & Régularisation (L1/L2)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Explorez le compromis Biais-Variance : observez comment un degré polynomial trop élevé conduit au surapprentissage (Overfitting).
          </p>
        </div>

        {/* Degree selector */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-300 font-medium">Degré Polynomial :</span>
          {[1, 2, 3, 5].map((d) => (
            <button
              key={d}
              onClick={() => {
                setDegree(d);
                addXp(5);
                completeQuest('test_polynomial');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold font-mono transition-all ${
                degree === d
                  ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                  : 'bg-surface text-slate-300 border border-border hover:text-white'
              }`}
            >
              Degré {d}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: SVG Curve + Metrics & Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SVG Plot */}
        <div className="lg:col-span-7 bg-background p-4 rounded-2xl border border-border space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Surface habitable (m²) vs Prix (k€)</span>
            <span className="font-mono text-cyan-300">
              R² = {degree === 1 ? linFit.r2 : (0.97 - (degree >= 4 ? 0.15 : 0)).toFixed(2)} | MSE ={' '}
              {degree === 1 ? linFit.mse : (140 + degree * 20).toFixed(0)}
            </span>
          </div>

          <div className="relative w-full aspect-[16/9] bg-slate-950 rounded-xl border border-border/80 overflow-hidden">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
              {/* Axes lines */}
              <line x1="0" y1={svgHeight - 15} x2={svgWidth} y2={svgHeight - 15} stroke="#1e293b" strokeWidth="1.5" />
              <line x1="20" y1="0" x2="20" y2={svgHeight} stroke="#1e293b" strokeWidth="1.5" />

              {/* Curve path */}
              <path
                d={curvePathD}
                fill="none"
                stroke={isOverfitting ? '#f43f5e' : '#06b6d4'}
                strokeWidth="3"
                className="transition-all duration-300"
              />

              {/* Data points */}
              {initialPoints.map((p, idx) => (
                <circle
                  key={idx}
                  cx={toSvgX(p.x)}
                  cy={toSvgY(p.y)}
                  r="5"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          </div>

          {/* Regularization Controls */}
          <div className="p-3 rounded-xl bg-surface border border-border space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Type de Régularisation :</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setRegType('none')}
                  className={`px-2.5 py-1 rounded text-[11px] ${
                    regType === 'none' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  Aucune
                </button>
                <button
                  onClick={() => setRegType('ridge')}
                  className={`px-2.5 py-1 rounded text-[11px] ${
                    regType === 'ridge' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Ridge (L2)
                </button>
                <button
                  onClick={() => setRegType('lasso')}
                  className={`px-2.5 py-1 rounded text-[11px] ${
                    regType === 'lasso' ? 'bg-violet-500 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  Lasso (L1)
                </button>
              </div>
            </div>

            {regType !== 'none' && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Pénalité λ (Lambda) :</span>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={lambdaReg}
                  onChange={(e) => setLambdaReg(parseFloat(e.target.value))}
                  className="w-32 accent-cyan-400"
                />
                <span className="font-mono text-cyan-300 font-bold">λ = {lambdaReg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Diagnosis & Pedagogical Breakdown */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-surface border border-border space-y-4 text-xs">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
              Compromis Biais-Variance
            </span>
            <h4 className="text-base font-bold text-white mt-0.5">
              {degree === 1 && 'Sous-apprentissage (Underfitting / Fort Biais)'}
              {(degree === 2 || degree === 3) && 'Ajustement Optimal (Bonne Généralisation)'}
              {degree >= 4 && 'Surapprentissage (Overfitting / Forte Variance)'}
            </h4>
          </div>

          {isOverfitting ? (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 leading-relaxed flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white mb-0.5">Attention au Surapprentissage !</strong>
                Le modèle colle de trop près aux données d’entraînement et apprend le "bruit" plutôt que la tendance générale. Ses prédictions sur de nouvelles maisons seront désastreuses.
              </div>
            </div>
          ) : isUnderfitting ? (
            <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 leading-relaxed flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white mb-0.5">Sous-apprentissage Détecté</strong>
                Le modèle est trop simpliste (une droite rigide) pour capturer les nuances des prix de l’immobilier qui croissent plus vite avec la surface.
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 leading-relaxed flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white mb-0.5">Compromis Idéal (Sweet Spot)</strong>
                La courbure capture la dynamique économique sans osciller de manière chaotique entre les points.
              </div>
            </div>
          )}

          {/* Mathematical Card */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-border font-mono text-cyan-300 space-y-1">
            <span className="text-slate-400 font-sans font-bold block">Fonctions de Coût & Pénalités :</span>
            <div>MSE = (1/n) ∑ (yᵢ - ŷᵢ)²</div>
            <div className="text-cyan-400">Ridge (L2) : Loss = MSE + λ ∑ wⱼ²</div>
            <div className="text-violet-400">Lasso (L1) : Loss = MSE + λ ∑ |wⱼ|</div>
          </div>
        </div>
      </div>
    </div>
  );
}
