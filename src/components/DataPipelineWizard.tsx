'use client';

import React, { useState } from 'react';
import { SAMPLE_DATASETS, Dataset } from '@/lib/datasets';
import {
  analyzeDataset,
  removeDuplicateRows,
  imputeColumn,
  minMaxScale,
  zScoreStandardize,
  robustScale,
  movingAverageSmooth,
  balanceSMOTE,
  DatasetAnalysis,
} from '@/lib/dataProcessing';
import {
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Database,
  ArrowRight,
  Filter,
  Layers,
  BarChart3,
  RefreshCw,
  Download,
  Info,
  Check,
  Zap,
} from 'lucide-react';
import { useExploration } from '@/context/ExplorationContext';

export default function DataPipelineWizard() {
  const { mode, addXp, completeQuest } = useExploration();
  const [selectedDataset, setSelectedDataset] = useState<Dataset>(SAMPLE_DATASETS[0]);
  const [currentRows, setCurrentRows] = useState<Record<string, any>[]>(SAMPLE_DATASETS[0].rows);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [cleaningLog, setCleaningLog] = useState<string[]>([]);
  const [selectedColForScaling, setSelectedColForScaling] = useState<string>('Age');
  const [scalingType, setScalingType] = useState<'minmax' | 'zscore' | 'robust' | 'smooth'>('minmax');
  const [syntheticCount, setSyntheticCount] = useState<number>(0);

  // Compute live analysis
  const analysis: DatasetAnalysis = analyzeDataset(currentRows);

  const handleSelectDataset = (dataset: Dataset) => {
    setSelectedDataset(dataset);
    setCurrentRows(dataset.rows);
    setCleaningLog([`Chargement du dataset "${dataset.name}" (${dataset.rows.length} lignes)`]);
    setSyntheticCount(0);
    // Auto set numerical column for scaling
    const numCol = dataset.columns.find((c) => c.type === 'numeric' && c.name !== 'PassengerId');
    if (numCol) setSelectedColForScaling(numCol.name);
    setActiveStep(1);
  };

  // CSV File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length < 2) return;
        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        const parsedRows = lines.slice(1).map((line, idx) => {
          const vals = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
          const rowObj: Record<string, any> = {};
          headers.forEach((h, hIdx) => {
            const rawVal = vals[hIdx];
            if (rawVal === '' || rawVal === 'NaN' || rawVal === 'null') {
              rowObj[h] = null;
            } else if (!isNaN(Number(rawVal))) {
              rowObj[h] = Number(rawVal);
            } else {
              rowObj[h] = rawVal;
            }
          });
          return rowObj;
        });

        const customDataset: Dataset = {
          id: 'custom-' + Date.now(),
          name: file.name,
          category: 'Classification',
          description: `Dataset importé personnalisé : ${parsedRows.length} lignes, ${headers.length} colonnes.`,
          targetColumn: headers[headers.length - 1],
          taskType: 'classification',
          columns: headers.map((h) => ({
            name: h,
            type: typeof parsedRows[0]?.[h] === 'number' ? 'numeric' : 'categorical',
            description: 'Colonne importée',
          })),
          rows: parsedRows,
          hasMissingValues: true,
          hasDuplicates: true,
          hasOutliers: true,
        };

        handleSelectDataset(customDataset);
        addXp(25);
        completeQuest('upload_dataset');
      } catch (err) {
        alert('Erreur lors de la lecture du fichier CSV. Assurez-vous d’un format CSV standard séparé par des virgules.');
      }
    };
    reader.readAsText(file);
  };

  // Cleaning action: Remove duplicates
  const handleRemoveDuplicates = () => {
    if (analysis.duplicateIndices.length === 0) return;
    const cleaned = removeDuplicateRows(currentRows, analysis.duplicateIndices);
    setCurrentRows(cleaned);
    setCleaningLog((prev) => [
      `Suppression de ${analysis.duplicateCount} doublons exacts. Lignes restantes : ${cleaned.length}`,
      ...prev,
    ]);
    addXp(20);
    completeQuest('clean_duplicates');
  };

  // Cleaning action: Impute column
  const handleImpute = (col: string, method: 'mean' | 'median' | 'mode' | 'drop' | 'zero') => {
    const updated = imputeColumn(currentRows, col, method);
    setCurrentRows(updated);
    setCleaningLog((prev) => [
      `Imputation appliquée sur "${col}" via la méthode [${method.toUpperCase()}]. Valeurs manquantes résolues.`,
      ...prev,
    ]);
    addXp(25);
    completeQuest('impute_data');
  };

  // Balancing action: SMOTE
  const handleSMOTE = () => {
    const numCols = selectedDataset.columns.filter((c) => c.type === 'numeric').map((c) => c.name);
    const { balancedRows, syntheticCount: count } = balanceSMOTE(currentRows, selectedDataset.targetColumn, numCols);
    setCurrentRows(balancedRows);
    setSyntheticCount(count);
    setCleaningLog((prev) => [
      `Algorithme SMOTE appliqué ! ${count} échantillons synthétiques générés par interpolation k-NN.`,
      ...prev,
    ]);
    addXp(40);
    completeQuest('apply_smote');
  };

  // Prepare scaling values for visualizer
  const rawNumericValues = currentRows
    .map((r) => Number(r[selectedColForScaling]))
    .filter((v) => !isNaN(v) && v !== null && v !== undefined);

  let transformedValues: number[] = [];
  if (rawNumericValues.length > 0) {
    if (scalingType === 'minmax') {
      transformedValues = minMaxScale(rawNumericValues).scaled;
    } else if (scalingType === 'zscore') {
      transformedValues = zScoreStandardize(rawNumericValues).scaled;
    } else if (scalingType === 'robust') {
      transformedValues = robustScale(rawNumericValues).scaled;
    } else if (scalingType === 'smooth') {
      transformedValues = movingAverageSmooth(rawNumericValues, 3);
    }
  }

  // Export cleaned data to CSV
  const handleDownloadCSV = () => {
    if (currentRows.length === 0) return;
    const headers = Object.keys(currentRows[0]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(',')]
        .concat(
          currentRows.map((row) =>
            headers.map((h) => (row[h] === null || row[h] === undefined ? '' : JSON.stringify(row[h]))).join(',')
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dataset_nettoye_${selectedDataset.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-8">
      {/* Dataset Selection Bar */}
      <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <span>1. Choisir ou Importer un Dataset</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Sélectionnez un dataset pédagogique intégré ou téléversez votre propre fichier CSV pour le profiler en temps réel.
            </p>
          </div>

          {/* Upload CSV Button */}
          <label className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 text-xs font-semibold cursor-pointer hover:bg-cyan-500/25 transition-all">
            <Download className="w-4 h-4 rotate-180" />
            <span>Téléverser mon CSV</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Preset Datasets Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_DATASETS.map((ds) => (
            <button
              key={ds.id}
              onClick={() => handleSelectDataset(ds)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                selectedDataset.id === ds.id
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-glow-cyan'
                  : 'bg-surface border-border hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white">{ds.name.split(' :')[0]}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono">
                  {ds.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{ds.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step Navigation Ribbon */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-border text-xs font-semibold">
        {[
          { num: 1, label: 'Diagnostic & Profiling' },
          { num: 2, label: 'Nettoyage (Manquants & Doublons)' },
          { num: 3, label: 'Scaling & Prétraitement' },
          { num: 4, label: 'Équilibrage (SMOTE & Poids)' },
        ].map((step) => (
          <button
            key={step.num}
            onClick={() => setActiveStep(step.num)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeStep === step.num
                ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan font-bold'
                : 'bg-surface text-slate-300 border border-border hover:text-white'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                activeStep === step.num ? 'bg-slate-950 text-cyan-400' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {step.num}
            </span>
            <span>{step.label}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: Profiling & Health Check */}
      {activeStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Health Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-surface-card border border-border">
              <span className="text-xs text-slate-400 block mb-1">Nombre d'Échantillons</span>
              <span className="text-2xl font-mono font-extrabold text-white">{analysis.rowCount} lignes</span>
              <span className="text-[11px] text-slate-500 block mt-1">{analysis.columnCount} caractéristiques (features)</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-card border border-border">
              <span className="text-xs text-slate-400 block mb-1">Valeurs Manquantes (NaN)</span>
              <span
                className={`text-2xl font-mono font-extrabold ${
                  analysis.totalMissing > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {analysis.totalMissing} cellules
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                {analysis.totalMissing > 0 ? 'Action requise à l’étape 2' : 'Aucune valeur manquante'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-card border border-border">
              <span className="text-xs text-slate-400 block mb-1">Doublons Identifiés</span>
              <span
                className={`text-2xl font-mono font-extrabold ${
                  analysis.duplicateCount > 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {analysis.duplicateCount} lignes
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                {analysis.duplicateCount > 0 ? 'Peut fausser la validation' : 'Aucun doublon'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-card border border-border">
              <span className="text-xs text-slate-400 block mb-1">Target / Cible Supervisée</span>
              <span className="text-lg font-mono font-bold text-cyan-400 truncate block">
                {selectedDataset.targetColumn}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1 font-mono uppercase">
                {selectedDataset.taskType}
              </span>
            </div>
          </div>

          {/* Detailed Column Analysis Table */}
          <div className="p-6 rounded-2xl bg-surface-card border border-border overflow-x-auto">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
              <span>Profilage par Variable (Colonnes)</span>
              <span className="text-xs text-slate-400 font-normal">
                Détection automatique des types et statistiques descriptives
              </span>
            </h4>
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-border text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Variable</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Manquants</th>
                  <th className="py-2.5 px-3">Moyenne (μ)</th>
                  <th className="py-2.5 px-3">Médiane / Q2</th>
                  <th className="py-2.5 px-3">Écart-Type (σ)</th>
                  <th className="py-2.5 px-3">Outliers (IQR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {Object.values(analysis.columnStats).map((col) => (
                  <tr key={col.name} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-semibold text-white">{col.name}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          col.type === 'numeric'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : 'bg-violet-950 text-violet-300 border border-violet-800'
                        }`}
                      >
                        {col.type}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {col.missingCount > 0 ? (
                        <span className="text-rose-400 font-bold">
                          {col.missingCount} ({col.missingPercentage}%)
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium">0% (Complet)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono">{col.mean !== undefined ? col.mean : '—'}</td>
                    <td className="py-3 px-3 font-mono">{col.median !== undefined ? col.median : '—'}</td>
                    <td className="py-3 px-3 font-mono">{col.std !== undefined ? col.std : '—'}</td>
                    <td className="py-3 px-3">
                      {col.outlierIndices && col.outlierIndices.length > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                          {col.outlierIndices.length} valeurs
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveStep(2)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan hover:bg-cyan-400 transition-all"
            >
              <span>Passer au Nettoyage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Data Cleaning Interactive Studio */}
      {activeStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Action 1: Duplicate Handling */}
            <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-amber-400" />
                  <span>Traitement des Doublons</span>
                </h4>
                <span className="text-xs text-amber-400 font-mono">
                  {analysis.duplicateCount} doublons détectés
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Les lignes strictement identiques faussent la cross-validation car une même donnée peut se retrouver à la fois dans le train set et le test set (data leakage).
              </p>
              <button
                onClick={handleRemoveDuplicates}
                disabled={analysis.duplicateCount === 0}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                  analysis.duplicateCount > 0
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {analysis.duplicateCount > 0
                    ? `Dédoublonner (${analysis.duplicateCount} doublons)`
                    : 'Aucun doublon à traiter'}
                </span>
              </button>
            </div>

            {/* Action 2: Missing Values Imputation */}
            <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Imputation des Valeurs Manquantes</span>
                </h4>
                <span className="text-xs text-cyan-400 font-mono">
                  {analysis.totalMissing} valeurs manquantes
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choisissez la stratégie mathématique selon la nature de la distribution (médiane si outliers présents, mode pour variables catégorielles).
              </p>

              {/* Loop over columns with missing values */}
              {Object.values(analysis.columnStats).filter((c) => c.missingCount > 0).length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Toutes les valeurs manquantes sont résolues !</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.values(analysis.columnStats)
                    .filter((c) => c.missingCount > 0)
                    .map((col) => (
                      <div
                        key={col.name}
                        className="p-3.5 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <span className="font-mono font-bold text-white">{col.name}</span>
                          <span className="text-rose-400 ml-2 font-mono">({col.missingCount} vides)</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {col.type === 'numeric' ? (
                            <>
                              <button
                                onClick={() => handleImpute(col.name, 'median')}
                                className="px-2.5 py-1 rounded-lg bg-surface border border-border hover:border-cyan-400 text-cyan-300 font-medium"
                                title="Recommandé en présence d'outliers"
                              >
                                Médiane
                              </button>
                              <button
                                onClick={() => handleImpute(col.name, 'mean')}
                                className="px-2.5 py-1 rounded-lg bg-surface border border-border hover:border-cyan-400 text-slate-300 font-medium"
                              >
                                Moyenne
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleImpute(col.name, 'mode')}
                              className="px-2.5 py-1 rounded-lg bg-surface border border-border hover:border-violet-400 text-violet-300 font-medium"
                            >
                              Mode (Fréquent)
                            </button>
                          )}
                          <button
                            onClick={() => handleImpute(col.name, 'drop')}
                            className="px-2.5 py-1 rounded-lg bg-surface border border-border hover:border-rose-400 text-rose-300 font-medium"
                          >
                            Supprimer lignes
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Cleaning Activity Feed */}
          {cleaningLog.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-border text-xs space-y-1.5 font-mono">
              <span className="text-slate-400 font-bold block mb-1">Journal des Opérations :</span>
              {cleaningLog.slice(0, 4).map((entry, idx) => (
                <div key={idx} className="text-cyan-300 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{entry}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveStep(1)}
              className="px-4 py-2 rounded-xl bg-surface border border-border text-slate-300 text-xs hover:text-white"
            >
              Retour
            </button>
            <button
              onClick={() => setActiveStep(3)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan hover:bg-cyan-400 transition-all"
            >
              <span>Étape 3 : Normalisation & Scaling</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Feature Scaling & Smoothing */}
      {activeStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  <span>Transformation & Mise à l’Échelle (Feature Scaling)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Pourquoi est-ce capital ? Les algorithmes basés sur la distance (KNN, SVM, K-Means) et la descente de gradient (Réseaux de neurones, Régression) sont dominés par les variables à grande échelle si on ne les normalise pas.
                </p>
              </div>

              {/* Column selector for visualization */}
              <div className="flex items-center space-x-2 text-xs">
                <label className="text-slate-300 font-medium">Variable à tester :</label>
                <select
                  value={selectedColForScaling}
                  onChange={(e) => setSelectedColForScaling(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-border text-cyan-400 focus:outline-none"
                >
                  {selectedDataset.columns
                    .filter((c) => c.type === 'numeric')
                    .map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Scaling Methods Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
              {[
                { id: 'minmax', name: 'Min-Max Scaling', range: '[0, 1]' },
                { id: 'zscore', name: 'Z-Score Standardisation', range: 'μ=0, σ=1' },
                { id: 'robust', name: 'RobustScaler (IQR)', range: 'Insensible Outliers' },
                { id: 'smooth', name: 'Lissage (Smoothing)', range: 'Moving Average' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setScalingType(m.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    scalingType === m.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                      : 'bg-surface border-border text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold">{m.name}</div>
                  <div className={`text-[10px] mt-0.5 ${scalingType === m.id ? 'text-slate-900' : 'text-cyan-400 font-mono'}`}>
                    {m.range}
                  </div>
                </button>
              ))}
            </div>

            {/* Visualizer: Raw vs Scaled Values Comparison Bar Chart */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Distribution avant / après transformation (10 premiers échantillons)</span>
                <span className="font-mono text-cyan-300">
                  {scalingType === 'minmax' && 'Formule : x\' = (x - x_min) / (x_max - x_min)'}
                  {scalingType === 'zscore' && 'Formule : z = (x - μ) / σ'}
                  {scalingType === 'robust' && 'Formule : x\' = (x - Médiane) / IQR'}
                  {scalingType === 'smooth' && 'Formule : x\'[i] = ∑(x[i-k..i+k]) / (2k+1)'}
                </span>
              </div>

              <div className="p-5 rounded-xl bg-background border border-border space-y-3">
                {rawNumericValues.slice(0, 8).map((rawVal, idx) => {
                  const transformed = transformedValues[idx] ?? 0;
                  return (
                    <div key={idx} className="grid grid-cols-12 gap-3 items-center text-xs font-mono">
                      <span className="col-span-2 text-slate-400">Échantillon #{idx + 1}</span>
                      <div className="col-span-4 flex items-center space-x-2">
                        <div className="w-16 text-slate-300 text-right">{rawVal}</div>
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-500 rounded-full"
                            style={{
                              width: `${Math.min(100, Math.max(5, (rawVal / (Math.max(...rawNumericValues) || 1)) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-span-1 text-center text-cyan-400 font-bold">➔</div>
                      <div className="col-span-5 flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, Math.max(5, Math.abs(transformed) * 50))}%`,
                            }}
                          />
                        </div>
                        <div className="w-16 text-cyan-300 font-bold">{transformed}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveStep(2)}
              className="px-4 py-2 rounded-xl bg-surface border border-border text-slate-300 text-xs hover:text-white"
            >
              Retour
            </button>
            <button
              onClick={() => setActiveStep(4)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan hover:bg-cyan-400 transition-all"
            >
              <span>Étape 4 : Équilibrage des Classes (SMOTE)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Data Balancing (SMOTE & Resampling) */}
      {activeStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-violet-400" />
                  <span>Techniques d'Équilibrage des Classes (Imbalanced Data)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Comprenez l'algorithme SMOTE (Synthetic Minority Over-sampling Technique) qui synthétise de nouveaux points le long des segments entre voisins KNN, plutôt que de simplement dupliquer des lignes.
                </p>
              </div>

              <button
                onClick={handleSMOTE}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-glow-violet transition-all"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Générer Synthèse SMOTE</span>
              </button>
            </div>

            {/* SMOTE Status Card */}
            {syntheticCount > 0 && (
              <div className="p-4 rounded-xl bg-violet-950/60 border border-violet-500/40 text-xs text-violet-200 flex items-center justify-between">
                <div>
                  <strong className="text-white block text-sm">SMOTE a rééquilibré le dataset !</strong>
                  <span>{syntheticCount} points synthétiques ont été injectés par interpolation KNN. Les classes sont désormais équilibrées à 50% / 50%.</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-violet-800 text-violet-100 font-mono font-bold">
                  Total : {currentRows.length} lignes
                </span>
              </div>
            )}

            {/* Visualizer: 2D Synthetic Points Demonstration */}
            <div className="p-5 rounded-xl bg-background border border-border space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">Représentation Spatiale 2D des Échantillons</span>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Classe Majoritaire
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Classe Minoritaire
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-400 inline-block animate-pulse" /> Synthétiques SMOTE
                  </span>
                </div>
              </div>

              {/* 2D Canvas Points Map */}
              <div className="relative w-full h-56 bg-slate-950 rounded-xl border border-border/80 overflow-hidden flex items-center justify-center p-4">
                {currentRows.map((r, i) => {
                  const isSynth = r['__synthetic'];
                  const targetVal = String(r[selectedDataset.targetColumn]);
                  // Project to 2D
                  const posX = 10 + ((i * 19) % 80);
                  const posY = 15 + ((i * 31) % 70);

                  let color = '#06b6d4'; // Cyan majority
                  if (targetVal === '1' || targetVal === 'versicolor' || targetVal === 'virginica') {
                    color = isSynth ? '#f43f5e' : '#10b981';
                  }

                  return (
                    <div
                      key={i}
                      className="absolute rounded-full transition-transform hover:scale-150 cursor-pointer"
                      style={{
                        left: `${posX}%`,
                        top: `${posY}%`,
                        width: isSynth ? '10px' : '8px',
                        height: isSynth ? '10px' : '8px',
                        backgroundColor: color,
                        boxShadow: isSynth ? '0 0 10px #f43f5e' : 'none',
                      }}
                      title={`Point #${i + 1} - Cible: ${targetVal} ${isSynth ? '(SMOTE Synthétique)' : ''}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Export Ready Cleaned Dataset */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
              <span className="text-xs text-slate-400">
                Dataset prêt pour l'entraînement des modèles Machine Learning & Deep Learning.
              </span>
              <button
                onClick={handleDownloadCSV}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger le Dataset Nettoyé (CSV)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
