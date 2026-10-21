'use client';

import React from 'react';
import CNNVisualizer3D from '@/components/CNNVisualizer3D';
import { Layers, Eye, Sparkles, Filter, Grid, Cpu, ArrowRight, ShieldCheck } from 'lucide-react';
import { useExploration } from '@/context/ExplorationContext';

export default function CNNFromScratchPage() {
  const { mode } = useExploration();

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-950/70 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Module 5 • Vision par Ordinateur & Tenseurs 3D</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Réseaux Convolutifs (CNN) : De A à Z From Scratch en 3D
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Pourquoi les réseaux de neurones classiques échouent-ils sur les images ? Découvrez comment la convolution 2D, le stride, le padding et le max-pooling permettent à l'IA d'analyser l'espace avec invariance par translation.
        </p>
      </div>

      {/* SECTION 1: Why MLPs Fail on Vision */}
      <div className="p-6 rounded-2xl bg-surface-card border border-border grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-3">
          <span className="text-xs font-mono text-rose-400 uppercase tracking-wider font-semibold">
            Le Problème des Réseaux Classiques (MLP)
          </span>
          <h3 className="text-lg font-bold text-white">
            L'Explosion des Paramètres & La Perte Spatiale
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {mode === 'beginner'
              ? 'Si vous donnez une photo à un réseau classique, il aplatit tous les pixels en une seule longue ligne. Le pixel du haut perd tout lien avec le pixel du bas ! De plus, une simple photo de smartphone contiendrait des millions de paramètres, saturant instantanément la mémoire.'
              : 'Une image couleur 1000×1000×3 aplatie en vecteur représente 3 millions d’entrées. Une première couche cachée de 1000 neurones nécessiterait 3 milliards de poids wᵢ ! De plus, les MLP ne possèdent pas d’équivariance par translation : un chat situé en haut à gauche nécessite d’apprendre des poids complètement différents d’un chat en bas à droite.'}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-background border border-border space-y-2 text-xs font-mono text-cyan-300">
          <span className="text-slate-400 font-sans font-bold block mb-2">La Solution Révolutionnaire : Le CNN</span>
          <div className="text-emerald-400">✓ Partage des poids (Weight Sharing) : le même petit filtre 3x3 glisse partout.</div>
          <div className="text-cyan-400">✓ Connectivité locale : un neurone ne regarde qu'un voisinage de 9 pixels.</div>
          <div className="text-violet-400">✓ Invariance par translation : un contour reste détecté où qu’il soit.</div>
        </div>
      </div>

      {/* SECTION 2: 3D Animated Architecture & Real-Time Convolution Inspector */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border pb-3">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Visualisation Tensorielle 3D & 2D Pas-à-Pas
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Eye className="w-6 h-6 text-cyan-400" />
              <span>L'Architecture CNN en Action Déterministe</span>
            </h2>
          </div>
          <span className="text-xs text-slate-400">Animation temps réel du filtre et du produit scalaire</span>
        </div>

        <CNNVisualizer3D />
      </section>

      {/* SECTION 3: Step-by-Step Breakdown from Scratch */}
      <section className="p-6 rounded-2xl bg-surface-card border border-border space-y-6">
        <h3 className="text-lg font-bold text-white">
          Les 5 Échelons d'un Pipeline CNN Complet
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-background border border-border space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold flex items-center justify-center font-mono">
              1
            </span>
            <h4 className="font-bold text-white text-xs">Convolution 2D</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Un kernel 3x3 (ou 5x5) glisse sur l'image pour calculer la somme des produits pixel par poids : extraction de features élémentaires (bords, coins).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border space-y-2">
            <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold flex items-center justify-center font-mono">
              2
            </span>
            <h4 className="font-bold text-white text-xs">Activation ReLU</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              f(x) = max(0, x) élimine toutes les valeurs négatives pour ne conserver que les signaux visuels stimulés positivement.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border space-y-2">
            <span className="w-6 h-6 rounded-full bg-violet-950 border border-violet-800 text-violet-400 font-bold flex items-center justify-center font-mono">
              3
            </span>
            <h4 className="font-bold text-white text-xs">Max-Pooling (2x2)</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Conserve le maximum dans chaque fenêtre 2x2. Réduit la dimension de 75% et apporte une tolérance aux petits décalages de l’objet.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border space-y-2">
            <span className="w-6 h-6 rounded-full bg-amber-950 border border-amber-800 text-amber-400 font-bold flex items-center justify-center font-mono">
              4
            </span>
            <h4 className="font-bold text-white text-xs">Flattening (Aplatissement)</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Convertit les feature maps 2D/3D finales en un unique vecteur 1D pour alimenter le classificateur dense.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border space-y-2">
            <span className="w-6 h-6 rounded-full bg-rose-950 border border-rose-800 text-rose-400 font-bold flex items-center justify-center font-mono">
              5
            </span>
            <h4 className="font-bold text-white text-xs">Dense & Softmax</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Les couches denses combinent toutes les caractéristiques de haut niveau, et Softmax convertit les scores en probabilités sommant à 100%.
            </p>
          </div>
        </div>

        {/* Dimension Formula Banner */}
        <div className="p-4 rounded-xl bg-slate-900 border border-border font-mono text-cyan-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <strong className="text-white block font-sans">Formule Universelle de Dimension de Sortie :</strong>
            <span>Taille_Sortie = ⌊(Taille_Entrée - Taille_Kernel + 2 × Padding) / Stride⌋ + 1</span>
          </div>
          <span className="text-xs font-sans text-slate-400 bg-surface px-3 py-1.5 rounded-lg border border-border">
            Exemple : (6 - 3 + 0) / 1 + 1 = 4 (Feature Map 4x4)
          </span>
        </div>
      </section>
    </div>
  );
}
