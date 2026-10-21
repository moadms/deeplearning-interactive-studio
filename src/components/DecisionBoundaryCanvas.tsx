'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Plus, Sparkles, Sliders, Shield, Network, GitFork } from 'lucide-react';
import { useExploration } from '@/context/ExplorationContext';

interface Point {
  x: number;
  y: number;
  label: 0 | 1;
}

export default function DecisionBoundaryCanvas() {
  const { mode, addXp, completeQuest } = useExploration();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedAlgo, setSelectedAlgo] = useState<'logistic' | 'knn' | 'tree' | 'svm'>('logistic');
  const [currentClass, setCurrentClass] = useState<0 | 1>(0);
  const [kParam, setKParam] = useState<number>(3);
  const [treeDepth, setTreeDepth] = useState<number>(3);

  // Initial balanced non-linear dataset
  const [points, setPoints] = useState<Point[]>([
    // Class 0 (Cyan - inner circle)
    { x: 180, y: 150, label: 0 },
    { x: 220, y: 140, label: 0 },
    { x: 200, y: 170, label: 0 },
    { x: 170, y: 170, label: 0 },
    { x: 230, y: 160, label: 0 },
    { x: 190, y: 130, label: 0 },
    // Class 1 (Rose - outer ring / boundary)
    { x: 100, y: 90, label: 1 },
    { x: 290, y: 90, label: 1 },
    { x: 310, y: 220, label: 1 },
    { x: 90, y: 230, label: 1 },
    { x: 200, y: 70, label: 1 },
    { x: 200, y: 250, label: 1 },
  ]);

  // Click on canvas to add points
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints((prev) => [...prev, { x, y, label: currentClass }]);
    addXp(5);
    completeQuest('add_ml_points');
  };

  const handleReset = () => {
    setPoints([]);
  };

  const loadPreset = (preset: 'linear' | 'circles' | 'moons') => {
    if (preset === 'linear') {
      setPoints([
        { x: 90, y: 80, label: 0 },
        { x: 140, y: 100, label: 0 },
        { x: 100, y: 160, label: 0 },
        { x: 160, y: 150, label: 0 },
        { x: 250, y: 180, label: 1 },
        { x: 280, y: 230, label: 1 },
        { x: 230, y: 240, label: 1 },
        { x: 320, y: 170, label: 1 },
      ]);
    } else if (preset === 'circles') {
      setPoints([
        { x: 200, y: 160, label: 0 },
        { x: 180, y: 150, label: 0 },
        { x: 220, y: 150, label: 0 },
        { x: 195, y: 180, label: 0 },
        { x: 110, y: 100, label: 1 },
        { x: 290, y: 100, label: 1 },
        { x: 300, y: 230, label: 1 },
        { x: 100, y: 230, label: 1 },
        { x: 200, y: 80, label: 1 },
        { x: 200, y: 250, label: 1 },
      ]);
    } else if (preset === 'moons') {
      setPoints([
        { x: 120, y: 120, label: 0 },
        { x: 160, y: 100, label: 0 },
        { x: 200, y: 110, label: 0 },
        { x: 240, y: 140, label: 0 },
        { x: 180, y: 170, label: 1 },
        { x: 220, y: 200, label: 1 },
        { x: 260, y: 190, label: 1 },
        { x: 300, y: 160, label: 1 },
      ]);
    }
  };

  // Render Decision Boundary on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    if (points.length < 2) {
      // Background grid
      ctx.fillStyle = '#080c14';
      ctx.fillRect(0, 0, width, height);
      return;
    }

    // Grid resolution for decision region
    const res = 10;
    const gridCols = Math.ceil(width / res);
    const gridRows = Math.ceil(height / res);

    // Compute decisions for each grid cell
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const x = c * res + res / 2;
        const y = r * res + res / 2;

        let pred = 0;

        if (selectedAlgo === 'knn') {
          // KNN decision
          const dists = points.map((p) => ({
            d: Math.hypot(p.x - x, p.y - y),
            label: p.label,
          }));
          dists.sort((a, b) => a.d - b.d);
          const topK = dists.slice(0, Math.min(kParam, dists.length));
          const count1 = topK.filter((p) => p.label === 1).length;
          pred = count1 >= topK.length / 2 ? 1 : 0;
        } else if (selectedAlgo === 'logistic' || selectedAlgo === 'svm') {
          // Linear hyperplane decision
          const mean0X = points.filter((p) => p.label === 0).reduce((a, b) => a + b.x, 0) / (points.filter((p) => p.label === 0).length || 1);
          const mean0Y = points.filter((p) => p.label === 0).reduce((a, b) => a + b.y, 0) / (points.filter((p) => p.label === 0).length || 1);
          const mean1X = points.filter((p) => p.label === 1).reduce((a, b) => a + b.x, 0) / (points.filter((p) => p.label === 1).length || 1);
          const mean1Y = points.filter((p) => p.label === 1).reduce((a, b) => a + b.y, 0) / (points.filter((p) => p.label === 1).length || 1);

          // Vector orthogonal to line connecting means
          const midX = (mean0X + mean1X) / 2;
          const midY = (mean0Y + mean1Y) / 2;
          const dirX = mean1X - mean0X;
          const dirY = mean1Y - mean0Y;
          const score = (x - midX) * dirX + (y - midY) * dirY;
          pred = score >= 0 ? 1 : 0;
        } else if (selectedAlgo === 'tree') {
          // Axis-aligned split
          const splitX = 200;
          const splitY = 160;
          pred = x > splitX && y > splitY ? 1 : (x <= splitX && y <= splitY ? 0 : (x > splitX ? 1 : 0));
        }

        ctx.fillStyle = pred === 1 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(6, 182, 212, 0.15)';
        ctx.fillRect(c * res, r * res, res, res);
      }
    }

    // Draw training points
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = p.label === 1 ? '#f43f5e' : '#06b6d4';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    });
  }, [points, selectedAlgo, kParam, treeDepth]);

  return (
    <div className="w-full space-y-6 p-6 rounded-2xl bg-surface-card border border-border">
      {/* Algorithm Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          {[
            { id: 'logistic', name: 'Régression Logistique', icon: Shield },
            { id: 'knn', name: 'K-Plus Proches Voisins (KNN)', icon: Network },
            { id: 'tree', name: 'Arbre de Décision (Decision Tree)', icon: GitFork },
            { id: 'svm', name: 'Support Vector Machine (SVM)', icon: Sparkles },
          ].map((algo) => {
            const Icon = algo.icon;
            return (
              <button
                key={algo.id}
                onClick={() => setSelectedAlgo(algo.id as any)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border transition-all ${
                  selectedAlgo === algo.id
                    ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                    : 'bg-surface text-slate-300 border-border hover:border-slate-500'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{algo.name}</span>
              </button>
            );
          })}
        </div>

        {/* Preset Shapes */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Presets :</span>
          <button
            onClick={() => loadPreset('linear')}
            className="px-2.5 py-1 rounded bg-surface border border-border text-slate-300 hover:text-white"
          >
            Linéaire
          </button>
          <button
            onClick={() => loadPreset('circles')}
            className="px-2.5 py-1 rounded bg-surface border border-border text-slate-300 hover:text-white"
          >
            Cercles
          </button>
          <button
            onClick={() => loadPreset('moons')}
            className="px-2.5 py-1 rounded bg-surface border border-border text-slate-300 hover:text-white"
          >
            Moons
          </button>
        </div>
      </div>

      {/* Main Grid: 2D Canvas + Controls & Explanations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Canvas Visualizer */}
        <div className="lg:col-span-7 bg-background p-4 rounded-2xl border border-border space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold">
              Cliquez dans le cadre pour ajouter des points de données :
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentClass(0)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  currentClass === 0
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-surface text-cyan-400 border border-cyan-800'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                <span>Classe 0</span>
              </button>
              <button
                onClick={() => setCurrentClass(1)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  currentClass === 1
                    ? 'bg-rose-500 text-white font-bold'
                    : 'bg-surface text-rose-400 border border-rose-800'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                <span>Classe 1</span>
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-surface border border-border text-slate-400 hover:text-white"
                title="Effacer les points"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            onClick={handleCanvasClick}
            className="w-full h-[320px] rounded-xl border border-border/80 cursor-crosshair bg-slate-950 block shadow-inner"
          />

          {/* Hyperparameters tuning */}
          {selectedAlgo === 'knn' && (
            <div className="flex items-center justify-between text-xs pt-2">
              <label className="text-slate-300 font-medium">Nombre de voisins (k) :</label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="1"
                  max="9"
                  step="2"
                  value={kParam}
                  onChange={(e) => setKParam(parseInt(e.target.value))}
                  className="accent-cyan-400"
                />
                <span className="font-mono text-cyan-300 font-bold">k = {kParam}</span>
              </div>
            </div>
          )}
        </div>

        {/* Algorithm Theory & Comparative Card */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-surface border border-border space-y-4 text-xs">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
              {selectedAlgo === 'logistic' && 'Modèle Linéaire Probabiliste'}
              {selectedAlgo === 'knn' && 'Apprentissage par Instance / Non-paramétrique'}
              {selectedAlgo === 'tree' && 'Découpage Récursif de l’Espace'}
              {selectedAlgo === 'svm' && 'Séparateur à Marge Maximale'}
            </span>
            <h4 className="text-base font-bold text-white mt-0.5">
              {selectedAlgo === 'logistic' && 'Régression Logistique'}
              {selectedAlgo === 'knn' && 'K-Nearest Neighbors (KNN)'}
              {selectedAlgo === 'tree' && 'Arbres de Décision'}
              {selectedAlgo === 'svm' && 'Support Vector Machines (SVM)'}
            </h4>
          </div>

          {mode === 'beginner' ? (
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 leading-relaxed">
              <span className="font-bold text-emerald-400 block mb-1">💡 Analogie Simple :</span>
              {selectedAlgo === 'logistic' &&
                'Comme tracer une ligne de démarcation droite au sol avec une craie pour séparer deux équipes. Si les points sont mélangés en cercle, une droite ne pourra jamais les isoler !'}
              {selectedAlgo === 'knn' &&
                'Comme demander l’avis de vos 3 ou 5 voisins les plus proches. Si la majorité porte un chapeau rose, vous porterez un chapeau rose ! Permet d’épouser n’importe quelle forme biscornue.'}
              {selectedAlgo === 'tree' &&
                'Comme jouer au jeu du "Qui est-ce ?" : "Est-ce que x > 150 ?" Si oui, "Est-ce que y > 200 ?". Découpe l’espace en rectangles successifs.'}
              {selectedAlgo === 'svm' &&
                'Comme tracer une autoroute la plus large possible entre les deux camps sans toucher aucun véhicule. Les voitures les plus proches de la route sont les "vecteurs de support".'}
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-border font-mono text-cyan-300 space-y-1.5">
              <span className="text-slate-400 font-bold block">Fondement Mathématique :</span>
              {selectedAlgo === 'logistic' && (
                <>
                  <div>Frontière : wᵀx + b = 0</div>
                  <div>Probabilité : P(y=1|x) = σ(wᵀx + b)</div>
                  <div>Loss : Binary Cross-Entropy -∑[y·log(p) + (1-y)·log(1-p)]</div>
                </>
              )}
              {selectedAlgo === 'knn' && (
                <>
                  <div>Distance Euclidienne : d(x, xᵢ) = √(∑(xⱼ - xᵢⱼ)²)</div>
                  <div>Vote majoritaire : ŷ = argmax_c ∑ I(yᵢ = c)</div>
                  <div>Pas d’entraînement explicite (Lazy Learner)</div>
                </>
              )}
              {selectedAlgo === 'tree' && (
                <>
                  <div>Critère de split : Impureté de Gini = 1 - ∑ pᵢ²</div>
                  <div>Gain d’information : ΔGini = Gini(Parent) - ∑ (N_j/N)·Gini(Child_j)</div>
                  <div>Découpage orthogonal le long des axes</div>
                </>
              )}
              {selectedAlgo === 'svm' && (
                <>
                  <div>Maximiser la marge : 2 / ||w||</div>
                  <div>Sous contrainte : yᵢ(wᵀxᵢ + b) ≥ 1</div>
                  <div>Astuce du noyau (Kernel Trick) : K(x, x') = exp(-γ||x - x'||²)</div>
                </>
              )}
            </div>
          )}

          <div className="space-y-2 pt-1 text-slate-300">
            <div>
              <strong className="text-white">Avantage majeur : </strong>
              {selectedAlgo === 'logistic' && 'Ultra rapide, donne des probabilités calibrées et des coefficients interprétables.'}
              {selectedAlgo === 'knn' && 'Capte des frontières très complexes sans hypothèse sur la distribution.'}
              {selectedAlgo === 'tree' && 'Totalement interprétable par l’humain sous forme de règles Si... Alors...'}
              {selectedAlgo === 'svm' && 'Très robuste en haute dimension, insensible aux points éloignés de la marge.'}
            </div>
            <div>
              <strong className="text-white">Point faible : </strong>
              {selectedAlgo === 'logistic' && 'Incapable de résoudre des problèmes non linéaires (ex: XOR) sans feature engineering.'}
              {selectedAlgo === 'knn' && 'Très lent en prédiction sur de gros datasets car il recalcule toutes les distances.'}
              {selectedAlgo === 'tree' && 'Forte tendance au surapprentissage (Overfitting) sans élagage (pruning).'}
              {selectedAlgo === 'svm' && 'Coûteux en calcul O(n³) sur les grands volumes de données.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
