'use client';

import React from 'react';
import ConfusionMatrixInteractive from '@/components/ConfusionMatrixInteractive';
import { Target, ShieldAlert, Award, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useExploration } from '@/context/ExplorationContext';

export default function EvaluationPage() {
  const { mode } = useExploration();

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Target className="w-3.5 h-3.5 text-emerald-400" />
          <span>Module 3 • Métriques d'Évaluation & Stratégies de Validation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Comment Savoir si son Modèle est Réellement Performant ?
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Un modèle peut afficher 99% d’exactitude (accuracy) tout en étant totalement aveugle aux événements critiques. Découvrez comment évaluer sans biais et éviter le piège mortel de la fuite de données (Data Leakage).
        </p>
      </div>

      {/* SECTION 1: Interactive Confusion Matrix & Trade-offs */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border pb-3">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Classification Binaire & Multi-classes
            </span>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-cyan-400" />
              <span>Matrice de Confusion & Arbitrage Décisionnel</span>
            </h2>
          </div>
        </div>

        <ConfusionMatrixInteractive />
      </section>

      {/* SECTION 2: Regression Metrics Guide */}
      <section className="p-6 rounded-2xl bg-surface-card border border-border space-y-6">
        <h3 className="text-lg font-bold text-white">
          Les 4 Métriques Indispensables en Régression (Prédiction Continue)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-background border border-border space-y-2">
            <span className="font-mono text-xs text-cyan-400 font-bold block">MAE (Mean Absolute Error)</span>
            <div className="font-mono text-sm font-extrabold text-white">(1/n) ∑ |yᵢ - ŷᵢ|</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Erreur absolue moyenne. Facile à expliquer au métier : « Le modèle se trompe en moyenne de 12 000 € sur le prix ».
            </p>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border space-y-2">
            <span className="font-mono text-xs text-violet-400 font-bold block">MSE (Mean Squared Error)</span>
            <div className="font-mono text-sm font-extrabold text-white">(1/n) ∑ (yᵢ - ŷᵢ)²</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Erreur quadratique moyenne. Élève les erreurs au carré, pénalisant impitoyablement les erreurs grossières et aberrantes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border space-y-2">
            <span className="font-mono text-xs text-emerald-400 font-bold block">RMSE (Root MSE)</span>
            <div className="font-mono text-sm font-extrabold text-white">√MSE</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Racine carrée de la MSE. Possède la même unité physique que la cible originale (ex: kg, €, secondes).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border space-y-2">
            <span className="font-mono text-xs text-pink-400 font-bold block">R² (Score de Détermination)</span>
            <div className="font-mono text-sm font-extrabold text-white">1 - (SS_res / SS_tot)</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pourcentage de la variance expliquée par le modèle. R²=1 signifie une prédiction parfaite, R²=0 équivaut à prédire la moyenne.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: K-Fold Cross-Validation & Data Leakage */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* K-Fold Visual Diagram */}
        <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-4">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
            <RefreshCw className="w-5 h-5 text-cyan-400" />
            <span>Validation Croisée en K Plis (K-Fold Cross-Validation)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pour éviter d’avoir un score dépendant d'un découpage "coup de chance", on divise les données en K blocs égaux (ex: K=5). Le modèle s'entraîne 5 fois, chaque bloc servant de test set à son tour.
          </p>

          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4, 5].map((fold) => (
              <div key={fold} className="flex items-center space-x-2 text-xs font-mono">
                <span className="w-16 text-slate-400 text-right">Plis #{fold}</span>
                <div className="flex-1 grid grid-cols-5 gap-1.5 h-6">
                  {[1, 2, 3, 4, 5].map((part) => (
                    <div
                      key={part}
                      className={`rounded flex items-center justify-center font-bold text-[10px] ${
                        part === fold
                          ? 'bg-rose-500 text-slate-950 shadow-sm'
                          : 'bg-cyan-950 border border-cyan-800 text-cyan-300'
                      }`}
                    >
                      {part === fold ? 'TEST' : 'TRAIN'}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 pt-1">
            Score final = Moyenne des K scores de test ± Écart-type (stabilité).
          </div>
        </div>

        {/* Data Leakage Warning Box */}
        <div className="p-6 rounded-2xl bg-surface-card border border-rose-500/30 space-y-4">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Le Piège Absolu : La Fuite de Données (Data Leakage)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {mode === 'beginner'
              ? 'Imaginez qu’un professeur donne l’examen final aux étudiants la veille pour s’entraîner : ils auront tous 20/20, mais n’auront rien appris pour la vraie vie ! C’est exactement ce qui se passe quand on normalise les données avant de séparer le Train et le Test.'
              : 'La fuite de données survient lorsque des informations du futur ou du test set contaminent l’apprentissage. Exemple typique : calculer la moyenne μ et l’écart-type σ sur l’intégralité du dataset avant le train_test_split. Le scaler doit toujours être ajusté (fit) EXCLUSIVEMENT sur X_train, puis appliqué (transform) sur X_test.'}
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-border space-y-2 text-xs font-mono">
            <span className="text-emerald-400 font-bold block flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>La Bonne Pratique (Pipeline Étanche) :</span>
            </span>
            <div className="text-slate-300 pl-4 space-y-1">
              <div>1. Séparer X_train et X_test d'abord !</div>
              <div>2. scaler.fit(X_train) ➔ Apprend moyenne et écart-type</div>
              <div>3. X_train_scaled = scaler.transform(X_train)</div>
              <div>4. X_test_scaled = scaler.transform(X_test)</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
