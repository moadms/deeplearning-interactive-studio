'use client';

import React from 'react';
import PlaygroundArena from '@/components/PlaygroundArena';
import { Gamepad2, Trophy, Star, Sparkles, Award, Zap } from 'lucide-react';
import { useExploration } from '@/context/ExplorationContext';

export default function PlaygroundPage() {
  const { xpPoints, completedQuests } = useExploration();

  const achievements = [
    { id: 'clean_duplicates', title: 'Chasseur de Doublons', desc: 'Nettoyer les doublons dans le Data Studio', xp: 20 },
    { id: 'impute_data', title: 'Maître de l’Imputation', desc: 'Imputer les valeurs manquantes par la médiane ou le mode', xp: 25 },
    { id: 'apply_smote', title: 'Alchimiste SMOTE', desc: 'Générer des données synthétiques par interpolation k-NN', xp: 40 },
    { id: 'add_ml_points', title: 'Architecte de Données', desc: 'Placer des points personnalisés sur le canvas 2D', xp: 5 },
    { id: 'minigame_filter', title: 'Détective Sobel', desc: 'Résoudre le mini-jeu du filtre de convolution vertical', xp: 30 },
    { id: 'completed_quiz', title: 'Certifié Deep Learning', desc: 'Terminer le quiz complet avec succès', xp: 50 },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-sky-950/70 border border-sky-500/30 text-sky-300 text-xs font-semibold">
          <Gamepad2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Module 6 • Gamification & Mini-Jeux Interactifs</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          L'Arène des Défis & Quiz Certifiant
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Mettez vos connaissances à l'épreuve à travers des énigmes pratiques et des défis d'ingénierie. Gagnez de l'XP en débloquant les hauts-faits du pipeline de Deep Learning !
        </p>
      </div>

      {/* Gamification Dashboard */}
      <div className="p-6 rounded-2xl bg-surface-card border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-glow-amber">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Niveau d'Expertise</span>
            <span className="text-2xl font-mono font-extrabold text-white">
              {xpPoints >= 200 ? 'Architecte IA Senior' : xpPoints >= 100 ? 'Praticien Deep Learning' : 'Apprenti Data Scientist'}
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs font-mono font-bold text-amber-400">{xpPoints} XP accumulés</span>
              <span className="text-[11px] text-slate-500">• {completedQuests.length} / {achievements.length} quêtes</span>
            </div>
          </div>
        </div>

        {/* Quests Badges */}
        <div className="flex flex-wrap gap-2">
          {achievements.map((ach) => {
            const isDone = completedQuests.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`px-3 py-1.5 rounded-xl border text-xs flex items-center space-x-1.5 transition-all ${
                  isDone
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-sm'
                    : 'bg-surface border-border text-slate-500 opacity-60'
                }`}
                title={ach.desc}
              >
                <Award className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span className="font-semibold">{ach.title}</span>
                <span className="text-[10px] font-mono text-amber-400">+{ach.xp}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini-Games & Quiz Interactive Component */}
      <PlaygroundArena />
    </div>
  );
}
