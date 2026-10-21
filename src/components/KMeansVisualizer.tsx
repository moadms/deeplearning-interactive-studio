'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, StepForward, Sparkles, Network, PieChart, Layers } from 'lucide-react';
import { runKMeans2D, Point2D, KMeansStep } from '@/lib/mlAlgorithms';
import { useExploration } from '@/context/ExplorationContext';

const CLUSTER_COLORS = ['#06b6d4', '#f43f5e', '#10b981', '#f59e0b', '#a855f7'];

export default function KMeansVisualizer() {
  const { mode, addXp, completeQuest } = useExploration();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState<number>(3);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  // Generate 3 synthetic clusters of points
  const [points, setPoints] = useState<Point2D[]>([
    // Cluster 1
    { x: 80, y: 70 }, { x: 100, y: 90 }, { x: 70, y: 110 }, { x: 110, y: 60 }, { x: 95, y: 85 },
    // Cluster 2
    { x: 260, y: 80 }, { x: 280, y: 100 }, { x: 300, y: 70 }, { x: 250, y: 110 }, { x: 290, y: 95 },
    // Cluster 3
    { x: 180, y: 220 }, { x: 200, y: 240 }, { x: 160, y: 210 }, { x: 220, y: 230 }, { x: 190, y: 250 },
    // Intermediate noise
    { x: 140, y: 150 }, { x: 230, y: 170 }, { x: 170, y: 120 },
  ]);

  const [steps, setSteps] = useState<KMeansStep[]>([]);

  // Compute all steps whenever k or points change
  useEffect(() => {
    const computed = runKMeans2D(points, k, 8);
    setSteps(computed);
    setCurrentStepIdx(0);
  }, [points, k]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || steps.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const activeStep = steps[currentStepIdx] || steps[0];

    // 1. Draw connecting lines from points to assigned centroids
    activeStep.assignments.forEach((clusterIdx, ptIdx) => {
      const p = points[ptIdx];
      const centroid = activeStep.centroids[clusterIdx];
      if (p && centroid) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(centroid.x, centroid.y);
        ctx.strokeStyle = `${CLUSTER_COLORS[clusterIdx % CLUSTER_COLORS.length]}44`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // 2. Draw data points
    points.forEach((p, idx) => {
      const clusterIdx = activeStep.assignments[idx] ?? 0;
      const color = CLUSTER_COLORS[clusterIdx % CLUSTER_COLORS.length];

      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    });

    // 3. Draw Centroids as glowing crosshairs / stars
    activeStep.centroids.forEach((c, idx) => {
      const color = CLUSTER_COLORS[idx % CLUSTER_COLORS.length];

      ctx.beginPath();
      ctx.arc(c.x, c.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#080c14';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.stroke();

      // Plus sign inside centroid
      ctx.beginPath();
      ctx.moveTo(c.x - 6, c.y);
      ctx.lineTo(c.x + 6, c.y);
      ctx.moveTo(c.x, c.y - 6);
      ctx.lineTo(c.x, c.y + 6);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [steps, currentStepIdx, points]);

  // Auto-play loop
  useEffect(() => {
    let timer: any;
    if (isAutoPlaying && steps.length > 0) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev + 1 >= steps.length) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, steps]);

  const handleNextStep = () => {
    if (currentStepIdx + 1 < steps.length) {
      setCurrentStepIdx(currentStepIdx + 1);
      addXp(5);
      completeQuest('step_kmeans');
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setIsAutoPlaying(false);
  };

  const currentInertia = steps[currentStepIdx]?.inertia ?? 0;

  return (
    <div className="w-full space-y-6 p-6 rounded-2xl bg-surface-card border border-border">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-cyan-400" />
            <span>Clustering K-Means Pas-à-Pas (Algorithme d'Apprentissage Non-Supervisé)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Aucune étiquette fournie au départ ! L'algorithme découvre de lui-même les structures naturelles et les groupes de données.
          </p>
        </div>

        {/* Hyperparameters k */}
        <div className="flex items-center space-x-3 bg-background px-4 py-2 rounded-xl border border-border text-xs">
          <span className="text-slate-300 font-medium">Nombre de clusters (k) :</span>
          {[2, 3, 4, 5].map((val) => (
            <button
              key={val}
              onClick={() => setK(val)}
              className={`w-7 h-7 rounded-lg font-bold font-mono transition-all ${
                k === val
                  ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                  : 'bg-surface text-slate-300 border border-border hover:text-white'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Canvas + Steps Controller & Elbow Method */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Canvas Visualizer */}
        <div className="lg:col-span-7 bg-background p-4 rounded-2xl border border-border space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-white">
                Itération : <strong className="text-cyan-400 font-mono">{currentStepIdx + 1} / {steps.length}</strong>
              </span>
              <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-border">
                Inertie WCSS : <strong className="text-amber-400 font-mono">{currentInertia}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 text-xs font-semibold hover:bg-cyan-500/25"
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAutoPlaying ? 'Pause' : 'Auto'}</span>
              </button>
              <button
                onClick={handleNextStep}
                disabled={currentStepIdx + 1 >= steps.length}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-white hover:border-cyan-400 disabled:opacity-40"
              >
                <StepForward className="w-3.5 h-3.5" />
                <span>Étape Suivante</span>
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-surface border border-border text-slate-400 hover:text-white"
                title="Recommencer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="w-full h-[320px] rounded-xl border border-border/80 bg-slate-950 block shadow-inner"
          />

          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Les cercles avec croix représentent les centroïdes mobiles (μₖ).</span>
            <span className="text-cyan-400">Convergence garantie vers un minimum local.</span>
          </div>
        </div>

        {/* Theoretical Explanation & The Elbow Method */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-surface border border-border space-y-4 text-xs">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
              Algorithme Expectation-Maximization (EM)
            </span>
            <h4 className="text-base font-bold text-white mt-0.5">Comment fonctionne K-Means ?</h4>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-background border border-border">
              <span className="font-bold text-cyan-400 block mb-0.5">Étape 1 : Assignation (Expectation)</span>
              <p className="text-slate-300 text-[11px]">
                Chaque point est attribué au centroïde le plus proche selon la distance euclidienne :
                <code className="block font-mono text-cyan-300 mt-1">cᵢ = argminₖ ||xᵢ - μₖ||²</code>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-background border border-border">
              <span className="font-bold text-violet-400 block mb-0.5">Étape 2 : Mise à jour (Maximization)</span>
              <p className="text-slate-300 text-[11px]">
                Chaque centroïde est recalculé comme le barycentre (moyenne arithmétique) de ses points assignés :
                <code className="block font-mono text-violet-300 mt-1">μₖ = (1/|Sₖ|) · ∑_{'{'}xᵢ ∈ Sₖ{'}'} xᵢ</code>
              </p>
            </div>

            {/* Elbow Method Card */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 text-xs">La Méthode du Coude (Elbow Method)</span>
                <span className="text-[10px] text-slate-400">Choisir le k optimal</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Quand on augmente k, l'inertie (WCSS) diminue mécaniquement. On cherche le "coude" de la courbe où la diminution ralentit brusquement (ici k=3 est le choix naturel).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
