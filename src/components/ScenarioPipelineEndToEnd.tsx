'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  UploadCloud,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Target,
  BarChart2,
  Database,
  Layers,
  Brain,
  ShieldCheck,
  Check,
  TrendingUp,
  Download,
  Activity,
  Award,
} from 'lucide-react';
import { useExploration } from '@/context/ExplorationContext';

interface ScenarioCase {
  id: string;
  name: string;
  category: string;
  description: string;
  targetCol: string;
  features: string[];
  rawRows: Record<string, any>[];
}

const REAL_CASES: ScenarioCase[] = [
  {
    id: 'medical_heart',
    name: '❤️ Diagnostic Médical : Risque Cardiaque',
    category: 'Santé & Prévention',
    description: 'Prédire si un patient présente un risque d’accident cardiovasculaire selon ses constantes cliniques.',
    targetCol: 'Malade',
    features: ['Age', 'Tension', 'Cholesterol', 'RythmeMax'],
    rawRows: [
      { PatientID: 101, Age: 45, Tension: 125, Cholesterol: 210, RythmeMax: 165, Fumeur: 'Oui', Malade: 0 },
      { PatientID: 102, Age: 63, Tension: 165, Cholesterol: 290, RythmeMax: 120, Fumeur: 'Oui', Malade: 1 },
      { PatientID: 103, Age: 55, Tension: 140, Cholesterol: null, RythmeMax: 145, Fumeur: 'Non', Malade: 1 }, // NaN
      { PatientID: 104, Age: 38, Tension: 118, Cholesterol: 180, RythmeMax: 175, Fumeur: 'Non', Malade: 0 },
      { PatientID: 105, Age: 68, Tension: 175, Cholesterol: 320, RythmeMax: 110, Fumeur: 'Oui', Malade: 1 },
      { PatientID: 106, Age: 42, Tension: null, Cholesterol: 195, RythmeMax: 160, Fumeur: 'Non', Malade: 0 }, // NaN
      { PatientID: 107, Age: 59, Tension: 150, Cholesterol: 260, RythmeMax: 130, Fumeur: 'Oui', Malade: 1 },
      { PatientID: 108, Age: 50, Tension: 135, Cholesterol: 220, RythmeMax: 155, Fumeur: 'Non', Malade: 0 },
      { PatientID: 102, Age: 63, Tension: 165, Cholesterol: 290, RythmeMax: 120, Fumeur: 'Oui', Malade: 1 }, // Doublon
      { PatientID: 109, Age: 72, Tension: 180, Cholesterol: 540, RythmeMax: 95, Fumeur: 'Oui', Malade: 1 }, // Outlier cholesterol 540
      { PatientID: 110, Age: 36, Tension: 115, Cholesterol: 175, RythmeMax: 180, Fumeur: 'Non', Malade: 0 },
      { PatientID: 111, Age: 60, Tension: 158, Cholesterol: 280, RythmeMax: 125, Fumeur: 'Oui', Malade: 1 },
    ],
  },
  {
    id: 'telecom_churn',
    name: '📱 Télécom : Résiliation Client (Déséquilibré)',
    category: 'Marketing & Churn',
    description: 'Identifier les clients sur le point de résilier leur abonnement mobile.',
    targetCol: 'Resiliation',
    features: ['Anciennete_Mois', 'Facture_Mensuelle', 'Reclamations', 'Appels_Support'],
    rawRows: [
      { ClientID: 'C01', Anciennete_Mois: 3, Facture_Mensuelle: 75.5, Reclamations: 4, Appels_Support: 5, Resiliation: 1 },
      { ClientID: 'C02', Anciennete_Mois: 48, Facture_Mensuelle: 35.0, Reclamations: 0, Appels_Support: 1, Resiliation: 0 },
      { ClientID: 'C03', Anciennete_Mois: 36, Facture_Mensuelle: 42.0, Reclamations: 0, Appels_Support: 0, Resiliation: 0 },
      { ClientID: 'C04', Anciennete_Mois: 2, Facture_Mensuelle: 82.0, Reclamations: 3, Appels_Support: 4, Resiliation: 1 },
      { ClientID: 'C05', Anciennete_Mois: 60, Facture_Mensuelle: 29.0, Reclamations: null, Appels_Support: 0, Resiliation: 0 }, // NaN
      { ClientID: 'C06', Anciennete_Mois: 24, Facture_Mensuelle: 45.0, Reclamations: 1, Appels_Support: 1, Resiliation: 0 },
      { ClientID: 'C07', Anciennete_Mois: 18, Facture_Mensuelle: 50.0, Reclamations: 0, Appels_Support: 1, Resiliation: 0 },
      { ClientID: 'C08', Anciennete_Mois: 72, Facture_Mensuelle: 65.0, Reclamations: 0, Appels_Support: 0, Resiliation: 0 },
      { ClientID: 'C03', Anciennete_Mois: 36, Facture_Mensuelle: 42.0, Reclamations: 0, Appels_Support: 0, Resiliation: 0 }, // Doublon
      { ClientID: 'C09', Anciennete_Mois: 5, Facture_Mensuelle: 70.0, Reclamations: 2, Appels_Support: 3, Resiliation: 1 },
    ],
  },
];

export default function ScenarioPipelineEndToEnd() {
  const { mode, addXp, completeQuest } = useExploration();

  // Current Scenario Step (1 to 8)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeCase, setActiveCase] = useState<ScenarioCase>(REAL_CASES[0]);

  // Working data through stages
  const [currentRows, setCurrentRows] = useState<Record<string, any>[]>(REAL_CASES[0].rawRows);
  const [isCleaned, setIsCleaned] = useState<boolean>(false);
  const [scalingApplied, setScalingApplied] = useState<'none' | 'minmax' | 'zscore'>('minmax');
  const [smoteApplied, setSmoteApplied] = useState<boolean>(false);

  // Model & Training State
  const [selectedModel, setSelectedModel] = useState<'logistic' | 'random_forest' | 'neural_net'>('neural_net');
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [epochsCount, setEpochsCount] = useState<number>(0);
  const [lossProgression, setLossProgression] = useState<number[]>([]);
  const [isTrained, setIsTrained] = useState<boolean>(false);

  // Evaluation & Final Prediction State
  const [testAccuracy, setTestAccuracy] = useState<number>(92);
  const [simulatedInputs, setSimulatedInputs] = useState<Record<string, number>>({
    Age: 52,
    Tension: 142,
    Cholesterol: 235,
    RythmeMax: 148,
  });
  const [finalVerdict, setFinalVerdict] = useState<{ label: number; proba: number } | null>(null);

  // Calculate missing & duplicate counts
  const missingCount = currentRows.reduce((acc, row) => {
    return acc + Object.values(row).filter((v) => v === null || v === undefined || v === '').length;
  }, 0);

  const duplicateCount = currentRows.length - new Set(currentRows.map((r) => JSON.stringify(r))).size;

  // Step 3: Run Intelligent Automated Cleaning
  const handleAutoClean = () => {
    // 1. Remove duplicates
    const seen = new Set<string>();
    const deduped = currentRows.filter((r) => {
      const s = JSON.stringify(r);
      if (seen.has(s)) return false;
      seen.add(s);
      return true;
    });

    // 2. Impute missing values with column median
    const cleaned = deduped.map((row) => {
      const newRow = { ...row };
      Object.keys(newRow).forEach((col) => {
        if (newRow[col] === null || newRow[col] === undefined || newRow[col] === '') {
          const validNums = deduped
            .map((item) => item[col])
            .filter((v) => typeof v === 'number')
            .sort((a, b) => a - b);
          if (validNums.length > 0) {
            newRow[col] = validNums[Math.floor(validNums.length / 2)];
          } else {
            newRow[col] = 0;
          }
        }
      });
      return newRow;
    });

    setCurrentRows(cleaned);
    setIsCleaned(true);
    addXp(30);
    completeQuest('scenario_clean_done');
  };

  // Step 4: Apply SMOTE synthesis
  const handleApplySMOTE = () => {
    setSmoteApplied(true);
    // Add 4 synthetic minority rows
    const syntheticRows = [
      { PatientID: 'SYN-01', Age: 57, Tension: 155, Cholesterol: 275, RythmeMax: 128, Fumeur: 'Oui', Malade: 1, __synth: true },
      { PatientID: 'SYN-02', Age: 64, Tension: 168, Cholesterol: 305, RythmeMax: 115, Fumeur: 'Oui', Malade: 1, __synth: true },
    ];
    setCurrentRows([...currentRows, ...syntheticRows]);
    addXp(25);
  };

  // Step 6: Train Model with Real-time Animation
  const handleTrainScenario = () => {
    setIsTraining(true);
    setEpochsCount(0);
    setLossProgression([]);
    setIsTrained(false);

    let ep = 0;
    const maxEp = 20;
    const history: number[] = [];

    const interval = setInterval(() => {
      ep++;
      setEpochsCount(ep);
      const loss = Math.max(0.06, 0.85 * Math.exp(-ep * 0.15) + (Math.random() - 0.5) * 0.02);
      history.push(Number(loss.toFixed(3)));
      setLossProgression([...history]);

      if (ep >= maxEp) {
        clearInterval(interval);
        setIsTraining(false);
        setIsTrained(true);
        const finalAcc = selectedModel === 'neural_net' ? 95 : selectedModel === 'random_forest' ? 92 : 88;
        setTestAccuracy(finalAcc);
        addXp(40);
        completeQuest('scenario_trained');
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      }
    }, 70);
  };

  // Step 8: Calculate Live User Verdict
  const handleCalculateVerdict = () => {
    let riskScore = 0;
    if (activeCase.id === 'medical_heart') {
      const age = simulatedInputs['Age'] || 50;
      const tension = simulatedInputs['Tension'] || 130;
      const chol = simulatedInputs['Cholesterol'] || 220;
      const rythme = simulatedInputs['RythmeMax'] || 150;
      riskScore = (age - 40) * 0.04 + (tension - 120) * 0.05 + (chol - 200) * 0.03 - (rythme - 140) * 0.02;
    } else {
      const rec = simulatedInputs['Reclamations'] || 0;
      const anc = simulatedInputs['Anciennete_Mois'] || 24;
      riskScore = rec * 0.8 - anc * 0.03;
    }

    const proba = 1 / (1 + Math.exp(-riskScore));
    setFinalVerdict({
      label: proba >= 0.5 ? 1 : 0,
      proba: Number((proba * 100).toFixed(1)),
    });
    addXp(20);
  };

  const stepsList = [
    { num: 1, title: 'Upload & Données', short: 'Données' },
    { num: 2, title: 'Scanner de Santé', short: 'Audit' },
    { num: 3, title: 'Nettoyage Pratique', short: 'Nettoyage' },
    { num: 4, title: 'Scaling & SMOTE', short: 'Équilibrage' },
    { num: 5, title: 'Split Train / Test', short: 'Découpage' },
    { num: 6, title: 'Entraînement Modèle', short: 'Modèle' },
    { num: 7, title: 'Mesure & Matrice', short: 'Évaluation' },
    { num: 8, title: 'Prédiction Finale', short: 'Test Live' },
  ];

  return (
    <div className="w-full space-y-8 animate-fade-in-up">
      {/* Scenario Progress Ribbon */}
      <div className="p-4 rounded-2xl bg-surface-card border border-border shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Grand Scénario Interactif • Étape {currentStep} sur 8</span>
          </span>
          <span className="font-mono text-cyan-300 font-bold">
            {Math.round((currentStep / 8) * 100)}% complété
          </span>
        </div>

        {/* Horizontal Steps Bar */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-xs">
          {stepsList.map((s) => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`p-2 rounded-xl text-center transition-all ${
                currentStep === s.num
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-glow-cyan'
                  : currentStep > s.num
                  ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-semibold'
                  : 'bg-surface text-slate-400 border border-border hover:text-white'
              }`}
            >
              <div className="text-[10px] opacity-75">#{s.num}</div>
              <div className="truncate font-bold text-[11px]">{s.short}</div>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: Upload & Choice of Scenario */}
      {currentStep === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-card border border-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                Étape 1 • Importation & Sélection
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Sélectionnez votre Scénario de Données
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Choisissez un cas d'usage réel d'entreprise ou téléversez votre propre fichier CSV pour lancer le pipeline.
              </p>
            </div>

            <label className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan cursor-pointer transition-all">
              <UploadCloud className="w-4 h-4" />
              <span>Téléverser mon CSV</span>
              <input type="file" accept=".csv" className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REAL_CASES.map((cs) => (
              <button
                key={cs.id}
                onClick={() => {
                  setActiveCase(cs);
                  setCurrentRows(cs.rawRows);
                  setIsCleaned(false);
                  setIsTrained(false);
                  setFinalVerdict(null);
                }}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  activeCase.id === cs.id
                    ? 'bg-cyan-950/70 border-cyan-400 shadow-glow-cyan'
                    : 'bg-surface border-border hover:border-slate-500'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-white text-sm">{cs.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300 font-mono">
                    {cs.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{cs.description}</p>
                <div className="mt-3 text-[11px] font-mono text-slate-400">
                  Cible : <strong className="text-cyan-300">{cs.targetCol}</strong> • Variables : {cs.features.join(', ')}
                </div>
              </button>
            ))}
          </div>

          {/* Raw Data Preview Table */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 block">
              Aperçu des données brutes reçues ({currentRows.length} lignes) :
            </span>
            <div className="rounded-xl border border-border overflow-x-auto bg-slate-950 max-h-48">
              <table className="w-full text-left text-xs text-slate-300 font-mono">
                <thead className="bg-slate-900 border-b border-border text-[10px] uppercase text-slate-400">
                  <tr>
                    {Object.keys(currentRows[0]).map((h) => (
                      <th key={h} className="py-2.5 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {currentRows.slice(0, 6).map((r, i) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      {Object.keys(r).map((k) => (
                        <td key={k} className="py-2 px-3">
                          {r[k] === null ? (
                            <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 text-[10px] border border-rose-800">
                              NaN
                            </span>
                          ) : (
                            String(r[k])
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan hover:bg-cyan-400 transition-all"
            >
              <span>Étape 2 : Scanner la Santé des Données</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Data Health Scanner */}
      {currentStep === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-card border border-border space-y-6">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Étape 2 • Audit & Diagnostic
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Scanner de Santé Automatique (Data Health Scan)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Avant de toucher au moindre modèle, nous devons cartographier tous les défauts qui pourraient tromper l'algorithme.
            </p>
          </div>

          {/* Health Score Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-mono text-2xl font-black">
                {isCleaned ? '96%' : '58%'}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Score de Santé : {isCleaned ? 'Excellent (Prêt)' : 'Pollué (Attention)'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isCleaned
                    ? 'Toutes les anomalies sont traitées, aucune fuite ni NaN restant.'
                    : 'Des valeurs manquantes et doublons ont été identifiés dans ce jeu de données.'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-surface border border-border text-center">
                <span className="text-slate-500 block text-[10px]">Manquants</span>
                <strong className={missingCount > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                  {missingCount} cellules
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-border text-center">
                <span className="text-slate-500 block text-[10px]">Doublons</span>
                <strong className={duplicateCount > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                  {duplicateCount} lignes
                </strong>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-surface border border-border text-xs text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan hover:bg-cyan-400 transition-all"
            >
              <span>Étape 3 : Nettoyer les Données</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Interactive Cleaning Protocol */}
      {currentStep === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-card border border-border space-y-6">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Étape 3 • Le Protocole de Nettoyage
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Nettoyage des Données en Temps Réel
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Appliquez l'imputation médiane sur les variables numériques et supprimez les doublons pour assainir l'échantillon.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-surface via-slate-900 to-slate-950 border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-cyan-400" />
                  <span>Protocole Intelligent 1-Clic</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Supprime les doublons exacts et remplace les `NaN` par la médiane de chaque colonne.
                </p>
              </div>

              <button
                onClick={handleAutoClean}
                disabled={isCleaned}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isCleaned
                    ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-slate-950 shadow-glow-cyan'
                }`}
              >
                {isCleaned ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                <span>{isCleaned ? 'Données Nettoyées avec Succès ✓' : 'Lancer le Nettoyage Automatique'}</span>
              </button>
            </div>

            {isCleaned && (
              <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between">
                <div>
                  <strong className="block text-white mb-0.5">Résultat du Nettoyage :</strong>
                  <span>0 valeur manquante restante • Doublons épurés • Lignes valides : {currentRows.length}</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-900/60 px-3 py-1 rounded-lg">
                  Score Qualité : 96%
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-surface border border-border text-xs text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan hover:bg-cyan-400 transition-all"
            >
              <span>Étape 4 : Mise à l'Échelle & SMOTE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Scaling & SMOTE Balancing */}
      {currentStep === 4 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-card border border-border space-y-6">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Étape 4 • Préparation Mathématique
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Feature Scaling (Normalisation) & Équilibrage SMOTE
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Ramenons toutes les variables sur la même échelle de grandeur pour que le gradient converge vite et sans biais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scaling Selector */}
            <div className="p-5 rounded-2xl bg-surface border border-border space-y-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                1. Choix du Scaling
              </span>
              <div className="space-y-2 text-xs">
                {[
                  { id: 'minmax', name: 'Min-Max Scaling [0, 1]', desc: 'Ramène tout entre 0 et 1 (idéal pour réseaux de neurones).' },
                  { id: 'zscore', name: 'Z-Score Standardisation (μ=0, σ=1)', desc: 'Loi normale centrée réduite.' },
                ].map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setScalingApplied(sc.id as any)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      scalingApplied === sc.id
                        ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 font-bold shadow-sm'
                        : 'bg-background border-border text-slate-300'
                    }`}
                  >
                    <div>{sc.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{sc.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* SMOTE Action */}
            <div className="p-5 rounded-2xl bg-surface border border-border space-y-3">
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wider block">
                2. Équilibrage des Classes
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Si une classe est rare, l'algorithme risque d'apprendre à l'ignorer. SMOTE crée des échantillons synthétiques par interpolation k-NN.
              </p>
              <button
                onClick={handleApplySMOTE}
                disabled={smoteApplied}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                  smoteApplied
                    ? 'bg-violet-950 border border-violet-500 text-violet-300'
                    : 'bg-violet-600 hover:bg-violet-500 text-white shadow-glow-violet'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{smoteApplied ? 'SMOTE Appliqué (+2 synthétiques) ✓' : 'Appliquer SMOTE Synthétique'}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-surface border border-border text-xs text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan hover:bg-cyan-400 transition-all"
            >
              <span>Étape 5 : Séparation Train / Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Train / Test Split */}
      {currentStep === 5 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-card border border-border space-y-6">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Étape 5 • Découpage Étanche
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Séparation des Données : 80% Entraînement vs 20% Test
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Pour vérifier que le modèle ne triche pas (Data Leakage), il ne verra JAMAIS le jeu de test avant l'examen final.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-border space-y-4">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold">Jeu d'Entraînement (Train Set) : 80%</span>
              <span className="text-rose-400 font-bold">Jeu de Test (Test Set) : 20%</span>
            </div>

            <div className="h-6 w-full rounded-xl overflow-hidden flex border border-border">
              <div className="w-4/5 bg-cyan-500 flex items-center justify-center text-slate-950 font-black text-[11px]">
                80% TRAIN (Pour apprendre)
              </div>
              <div className="w-1/5 bg-rose-500 flex items-center justify-center text-white font-black text-[11px]">
                20% TEST
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border text-xs text-slate-300 leading-relaxed flex items-start space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Garantie Anti-Fuite (No Data Leakage) :</strong> Le modèle apprend ses paramètres exclusivement sur le bloc bleu (80%). Les métriques finales seront calculées uniquement sur le bloc rouge (20%).
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentStep(4)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-surface border border-border text-xs text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan hover:bg-cyan-400 transition-all"
            >
              <span>Étape 6 : Entraîner le Modèle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Model Selection & Animated Training */}
      {currentStep === 6 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-card border border-border space-y-6">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Étape 6 • Apprentissage en Direct
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Entraînement du Modèle avec Descente de Gradient
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Observez la fonction de perte (Loss) diminuer à chaque époque d'optimisation.
            </p>
          </div>

          {/* Model tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'logistic', name: 'Régression Logistique', desc: 'Linéaire rapide' },
              { id: 'random_forest', name: 'Forêt d’Arbres (Forest)', desc: 'Robuste aux non-linéarités' },
              { id: 'neural_net', name: 'Réseau de Neurones (MLP)', desc: 'Deep Learning Multi-Couches' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id as any)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedModel === m.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                    : 'bg-surface border-border text-slate-300'
                }`}
              >
                <div className="text-xs font-bold">{m.name}</div>
                <div className={`text-[10px] ${selectedModel === m.id ? 'text-slate-900' : 'text-slate-500'}`}>
                  {m.desc}
                </div>
              </button>
            ))}
          </div>

          {/* Training Control & Loss chart */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400">Progression :</span>
                <div className="font-mono text-white text-base font-bold">
                  {epochsCount > 0 ? `Époque ${epochsCount} / 20` : 'Prêt à démarrer'}
                </div>
              </div>

              <button
                onClick={handleTrainScenario}
                disabled={isTraining}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-400 hover:opacity-90 text-slate-950 font-black text-xs shadow-glow-cyan transition-all disabled:opacity-50"
              >
                {isTraining ? <Activity className="w-4 h-4 animate-spin text-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
                <span>{isTraining ? 'Optimisation en cours...' : 'Lancer l’Entraînement ⚡'}</span>
              </button>
            </div>

            {/* Dynamic Loss bars */}
            <div className="h-24 w-full bg-background rounded-xl border border-border p-2 flex items-end gap-1 overflow-hidden">
              {lossProgression.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                  Cliquez sur "Lancer l’Entraînement" pour démarrer l'apprentissage
                </div>
              ) : (
                lossProgression.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-cyan-500 to-violet-500 rounded-t transition-all"
                    style={{ height: `${Math.max(12, val * 100)}%` }}
                    title={`Époque ${idx + 1} : Loss = ${val}`}
                  />
                ))
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentStep(5)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-surface border border-border text-xs text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
            <button
              onClick={() => setCurrentStep(7)}
              disabled={!isTrained}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan hover:bg-cyan-400 transition-all disabled:opacity-50"
            >
              <span>Étape 7 : Évaluer la Performance</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: Evaluation & Confusion Matrix */}
      {currentStep === 7 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-card border border-border space-y-6">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Étape 7 • L'Examen Final
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Évaluation Complète sur les Données de Test
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Vérifions le taux de succès sans complaisance grâce à la matrice de confusion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Real Confusion Matrix 2x2 */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-border space-y-3">
              <span className="text-xs font-bold text-slate-300 block text-center">
                Matrice de Confusion sur le Test Set (20%)
              </span>
              <div className="grid grid-cols-2 gap-3 text-center font-mono">
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300">
                  <span className="text-[10px] text-slate-400 block">Vrais Positifs (TP)</span>
                  <strong className="text-2xl font-black text-white">8</strong>
                  <span className="text-[10px] block text-emerald-400">Cas bien détectés</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300">
                  <span className="text-[10px] text-slate-400 block">Faux Positifs (FP)</span>
                  <strong className="text-2xl font-black text-white">1</strong>
                  <span className="text-[10px] block text-amber-400">Fausse alerte</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300">
                  <span className="text-[10px] text-slate-400 block">Faux Négatifs (FN)</span>
                  <strong className="text-2xl font-black text-white">0</strong>
                  <span className="text-[10px] block text-rose-400">Aucun cas manqué !</span>
                </div>
                <div className="p-3 rounded-xl bg-cyan-950/70 border border-cyan-500/50 text-cyan-300">
                  <span className="text-[10px] text-slate-400 block">Vrais Négatifs (TN)</span>
                  <strong className="text-2xl font-black text-white">11</strong>
                  <span className="text-[10px] block text-cyan-400">Sains bien identifiés</span>
                </div>
              </div>
            </div>

            {/* Calculated Metrics */}
            <div className="p-5 rounded-2xl bg-surface border border-border space-y-3 text-xs">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                Scores Synthétiques
              </span>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded bg-background border border-border">
                  <span className="text-slate-300">Exactitude (Accuracy) :</span>
                  <strong className="text-cyan-400 font-mono text-sm">{testAccuracy}%</strong>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-background border border-border">
                  <span className="text-slate-300">Rappel / Sensibilité (Recall) :</span>
                  <strong className="text-emerald-400 font-mono text-sm">100%</strong>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-background border border-border">
                  <span className="text-slate-300">Précision :</span>
                  <strong className="text-violet-400 font-mono text-sm">88.9%</strong>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-background border border-border">
                  <span className="text-slate-300">F1-Score Harmonique :</span>
                  <strong className="text-pink-400 font-mono text-sm">94.1%</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentStep(6)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-surface border border-border text-xs text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
            <button
              onClick={() => setCurrentStep(8)}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan hover:bg-cyan-400 transition-all"
            >
              <span>Étape 8 : Déploiement & Prédiction Live</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: Deployment & Live Prediction Simulator */}
      {currentStep === 8 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-card border border-border space-y-6">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
              Étape 8 • Mise en Production
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Simulateur de Prédiction en Temps Réel
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Votre modèle est entraîné et prêt à l'emploi ! Saisissez les données d'un nouveau cas pour obtenir la décision instantanée.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Form */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-surface border border-border space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Paramètres du Nouveau Cas :</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {activeCase.features.map((feat) => (
                  <div key={feat}>
                    <label className="text-slate-300 font-mono font-medium block mb-1">{feat} :</label>
                    <input
                      type="number"
                      value={simulatedInputs[feat] ?? 50}
                      onChange={(e) =>
                        setSimulatedInputs({
                          ...simulatedInputs,
                          [feat]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-white font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleCalculateVerdict}
                className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all flex items-center justify-center space-x-2"
              >
                <Target className="w-4 h-4" />
                <span>Calculer la Décision du Modèle ⚡</span>
              </button>
            </div>

            {/* Live Verdict Output */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950 border border-cyan-500/40 text-center space-y-4 shadow-glow-cyan">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold block">
                Résultat Prédit par le Modèle
              </span>

              {finalVerdict !== null ? (
                <div className="space-y-3 animate-scale-in">
                  <div className="text-4xl font-black font-mono text-white">
                    {finalVerdict.label === 1 ? 'ALERTE POSITIVE' : 'SITUATION NORMALE'}
                  </div>
                  <div className="text-xs text-slate-300">
                    Niveau de certitude du modèle :{' '}
                    <strong className="text-emerald-400 text-sm font-mono">{finalVerdict.proba}%</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-border text-[11px] text-slate-400 leading-snug">
                    {finalVerdict.label === 1
                      ? 'Recommandation : Déclencher le protocole de suivi prioritaire.'
                      : 'Recommandation : Aucune anomalie détectée sur ce profil.'}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-xs text-slate-500">
                  Cliquez sur "Calculer la Décision" pour interroger le modèle
                </div>
              )}
            </div>
          </div>

          {/* Reset or Export */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-surface border border-border text-xs text-slate-300 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recommencer le Scénario avec un autre Jeu de Données</span>
            </button>

            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
              <Award className="w-4 h-4" />
              <span>Scénario Complet Validé avec Succès ! (+100 XP)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
