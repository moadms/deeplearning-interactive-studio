// Complete Data Processing & Cleaning Engine from Scratch

export interface ColumnStats {
  name: string;
  type: 'numeric' | 'categorical';
  count: number;
  missingCount: number;
  missingPercentage: number;
  uniqueCount: number;
  // Numeric stats
  mean?: number;
  median?: number;
  std?: number;
  min?: number;
  max?: number;
  q1?: number;
  q3?: number;
  iqr?: number;
  outlierIndices?: number[];
  // Categorical stats
  frequencies?: Record<string, number>;
}

export interface DatasetAnalysis {
  rowCount: number;
  columnCount: number;
  duplicateCount: number;
  duplicateIndices: number[];
  totalMissing: number;
  columnStats: Record<string, ColumnStats>;
}

export function analyzeDataset(rows: Record<string, any>[]): DatasetAnalysis {
  const rowCount = rows.length;
  if (rowCount === 0) {
    return { rowCount: 0, columnCount: 0, duplicateCount: 0, duplicateIndices: [], totalMissing: 0, columnStats: {} };
  }

  const columns = Object.keys(rows[0]);
  const columnCount = columns.length;

  // 1. Identify duplicates
  const rowStrings = new Map<string, number>();
  const duplicateIndices: number[] = [];

  rows.forEach((row, idx) => {
    // Stringify row excluding unique ID if present
    const keysToExclude = ['PassengerId', 'id', 'ID'];
    const filteredRow = Object.entries(row).reduce((acc, [k, v]) => {
      if (!keysToExclude.includes(k)) acc[k] = v;
      return acc;
    }, {} as Record<string, any>);

    const str = JSON.stringify(filteredRow);
    if (rowStrings.has(str)) {
      duplicateIndices.push(idx);
    } else {
      rowStrings.set(str, idx);
    }
  });

  // 2. Profile each column
  let totalMissing = 0;
  const columnStats: Record<string, ColumnStats> = {};

  for (const col of columns) {
    const rawValues = rows.map((r) => r[col]);
    const validValues = rawValues.filter((v) => v !== null && v !== undefined && v !== '');
    const missingCount = rawValues.length - validValues.length;
    totalMissing += missingCount;

    const isNumeric = validValues.length > 0 && validValues.every((v) => typeof v === 'number' || (!isNaN(Number(v)) && typeof v !== 'boolean'));

    if (isNumeric) {
      const numbers = validValues.map((v) => Number(v)).sort((a, b) => a - b);
      const count = numbers.length;
      const sum = numbers.reduce((a, b) => a + b, 0);
      const mean = count > 0 ? sum / count : 0;
      
      const variance = count > 1 ? numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count : 0;
      const std = Math.sqrt(variance);

      // Median & Quartiles
      const median = count > 0 ? (count % 2 === 0 ? (numbers[count / 2 - 1] + numbers[count / 2]) / 2 : numbers[Math.floor(count / 2)]) : 0;
      const q1Index = Math.floor(count * 0.25);
      const q3Index = Math.floor(count * 0.75);
      const q1 = numbers[q1Index] ?? 0;
      const q3 = numbers[q3Index] ?? 0;
      const iqr = q3 - q1;

      // Outlier detection: < Q1 - 1.5*IQR or > Q3 + 1.5*IQR
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;
      const outlierIndices: number[] = [];
      rows.forEach((r, idx) => {
        const val = Number(r[col]);
        if (r[col] !== null && r[col] !== undefined && (val < lowerBound || val > upperBound)) {
          outlierIndices.push(idx);
        }
      });

      columnStats[col] = {
        name: col,
        type: 'numeric',
        count,
        missingCount,
        missingPercentage: Math.round((missingCount / rowCount) * 100),
        uniqueCount: new Set(numbers).size,
        mean: Number(mean.toFixed(2)),
        median: Number(median.toFixed(2)),
        std: Number(std.toFixed(2)),
        min: numbers[0],
        max: numbers[count - 1],
        q1: Number(q1.toFixed(2)),
        q3: Number(q3.toFixed(2)),
        iqr: Number(iqr.toFixed(2)),
        outlierIndices,
      };
    } else {
      // Categorical column
      const freq: Record<string, number> = {};
      validValues.forEach((v) => {
        const key = String(v);
        freq[key] = (freq[key] || 0) + 1;
      });

      columnStats[col] = {
        name: col,
        type: 'categorical',
        count: validValues.length,
        missingCount,
        missingPercentage: Math.round((missingCount / rowCount) * 100),
        uniqueCount: Object.keys(freq).length,
        frequencies: freq,
      };
    }
  }

  return {
    rowCount,
    columnCount,
    duplicateCount: duplicateIndices.length,
    duplicateIndices,
    totalMissing,
    columnStats,
  };
}

// ----------------- Data Cleaning Operations -----------------

export function removeDuplicateRows(rows: Record<string, any>[], duplicateIndices: number[]): Record<string, any>[] {
  const dupSet = new Set(duplicateIndices);
  return rows.filter((_, idx) => !dupSet.has(idx));
}

export function imputeColumn(
  rows: Record<string, any>[],
  column: string,
  method: 'mean' | 'median' | 'mode' | 'zero' | 'drop'
): Record<string, any>[] {
  if (method === 'drop') {
    return rows.filter((r) => r[column] !== null && r[column] !== undefined && r[column] !== '');
  }

  const validValues = rows
    .map((r) => r[column])
    .filter((v) => v !== null && v !== undefined && v !== '');

  if (validValues.length === 0) return rows;

  let replacementVal: any = 0;

  const isNumeric = validValues.every((v) => typeof v === 'number' || (!isNaN(Number(v)) && typeof v !== 'boolean'));

  if (isNumeric) {
    const nums = validValues.map(Number).sort((a, b) => a - b);
    if (method === 'mean') {
      const sum = nums.reduce((a, b) => a + b, 0);
      replacementVal = Number((sum / nums.length).toFixed(1));
    } else if (method === 'median') {
      const mid = Math.floor(nums.length / 2);
      replacementVal = nums.length % 2 === 0 ? (nums[mid - 1] + nums[mid]) / 2 : nums[mid];
    } else if (method === 'zero') {
      replacementVal = 0;
    } else if (method === 'mode') {
      const counts: Record<string, number> = {};
      nums.forEach((n) => counts[n] = (counts[n] || 0) + 1);
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      replacementVal = Number(top[0]);
    }
  } else {
    // Categorical mode
    const counts: Record<string, number> = {};
    validValues.forEach((v) => {
      const k = String(v);
      counts[k] = (counts[k] || 0) + 1;
    });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    replacementVal = top ? top[0] : 'Inconnu';
  }

  return rows.map((r) => {
    if (r[column] === null || r[column] === undefined || r[column] === '') {
      return { ...r, [column]: replacementVal };
    }
    return { ...r };
  });
}

// ----------------- Transformations & Scalers -----------------

export function minMaxScale(values: number[]): { scaled: number[]; min: number; max: number } {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const diff = max - min === 0 ? 1 : max - min;
  const scaled = values.map((v) => Number(((v - min) / diff).toFixed(4)));
  return { scaled, min, max };
}

export function zScoreStandardize(values: number[]): { scaled: number[]; mean: number; std: number } {
  const n = values.length;
  if (n === 0) return { scaled: [], mean: 0, std: 1 };
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n > 1 ? n - 1 : 1);
  const std = Math.sqrt(variance) || 1;
  const scaled = values.map((v) => Number(((v - mean) / std).toFixed(4)));
  return { scaled, mean, std };
}

export function robustScale(values: number[]): { scaled: number[]; median: number; iqr: number } {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1 || 1;
  const scaled = values.map((v) => Number(((v - median) / iqr).toFixed(4)));
  return { scaled, median, iqr };
}

export function movingAverageSmooth(values: number[], windowSize = 3): number[] {
  const result: number[] = [];
  const half = Math.floor(windowSize / 2);
  for (let i = 0; i < values.length; i++) {
    let sum = 0;
    let count = 0;
    for (let w = -half; w <= half; w++) {
      const idx = i + w;
      if (idx >= 0 && idx < values.length) {
        sum += values[idx];
        count++;
      }
    }
    result.push(Number((sum / count).toFixed(3)));
  }
  return result;
}

export function exponentialSmooth(values: number[], alpha = 0.3): number[] {
  if (values.length === 0) return [];
  const result: number[] = [values[0]];
  for (let i = 1; i < values.length; i++) {
    const smoothed = alpha * values[i] + (1 - alpha) * result[i - 1];
    result.push(Number(smoothed.toFixed(3)));
  }
  return result;
}

// ----------------- Data Balancing (SMOTE & Resampling) -----------------

export function balanceSMOTE(
  rows: Record<string, any>[],
  targetCol: string,
  featureCols: string[]
): { balancedRows: Record<string, any>[]; syntheticCount: number } {
  // Separate into classes
  const classes: Record<string, Record<string, any>[]> = {};
  rows.forEach((r) => {
    const c = String(r[targetCol]);
    if (!classes[c]) classes[c] = [];
    classes[c].push(r);
  });

  const classCounts = Object.entries(classes).map(([label, list]) => ({ label, count: list.length }));
  classCounts.sort((a, b) => b.count - a.count);

  if (classCounts.length < 2) {
    return { balancedRows: [...rows], syntheticCount: 0 };
  }

  const majorityClass = classCounts[0];
  const minorityClass = classCounts[classCounts.length - 1];
  const diffNeeded = majorityClass.count - minorityClass.count;

  if (diffNeeded <= 0) {
    return { balancedRows: [...rows], syntheticCount: 0 };
  }

  const minorityRows = classes[minorityClass.label];
  const syntheticRows: Record<string, any>[] = [];

  // Generate synthetic points along segments between minority samples
  for (let i = 0; i < diffNeeded; i++) {
    const idx1 = Math.floor(Math.random() * minorityRows.length);
    let idx2 = Math.floor(Math.random() * minorityRows.length);
    if (minorityRows.length > 1 && idx1 === idx2) {
      idx2 = (idx1 + 1) % minorityRows.length;
    }

    const p1 = minorityRows[idx1];
    const p2 = minorityRows[idx2];
    const lambda = 0.2 + Math.random() * 0.6; // random factor between 0.2 and 0.8

    const newSample: Record<string, any> = { ...p1 };
    featureCols.forEach((col) => {
      const val1 = Number(p1[col]);
      const val2 = Number(p2[col]);
      if (!isNaN(val1) && !isNaN(val2)) {
        newSample[col] = Number((val1 + lambda * (val2 - val1)).toFixed(2));
      }
    });

    newSample[targetCol] = minorityClass.label === '1' ? 1 : (minorityClass.label === '0' ? 0 : minorityClass.label);
    newSample['__synthetic'] = true;
    syntheticRows.push(newSample);
  }

  return {
    balancedRows: [...rows, ...syntheticRows],
    syntheticCount: syntheticRows.length,
  };
}
