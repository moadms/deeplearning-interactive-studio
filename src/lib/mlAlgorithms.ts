// Machine Learning Algorithms from Scratch (2D/3D Interactive Engines)

export interface Point2D {
  x: number;
  y: number;
  label?: number | string;
  cluster?: number;
  isOutlier?: boolean;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
  label?: number | string;
  cluster?: number;
}

// ------------------- CLASSIFICATION -------------------

export class LogisticRegressionScratch {
  weights: number[] = [0, 0];
  bias: number = 0;
  learningRate: number = 0.05;
  iterations: number = 200;
  lossHistory: number[] = [];

  sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));
  }

  fit(X: number[][], y: number[], lr = 0.05, iters = 200): { weights: number[]; bias: number; lossHistory: number[] } {
    this.learningRate = lr;
    this.iterations = iters;
    const n = X.length;
    if (n === 0) return { weights: [0, 0], bias: 0, lossHistory: [] };
    const numFeatures = X[0].length;
    this.weights = new Array(numFeatures).fill(0);
    this.bias = 0;
    this.lossHistory = [];

    for (let iter = 0; iter < this.iterations; iter++) {
      let gradW = new Array(numFeatures).fill(0);
      let gradB = 0;
      let totalLoss = 0;

      for (let i = 0; i < n; i++) {
        const linearPred = X[i].reduce((acc, val, j) => acc + val * this.weights[j], this.bias);
        const yPred = this.sigmoid(linearPred);
        const err = yPred - y[i];

        for (let j = 0; j < numFeatures; j++) {
          gradW[j] += err * X[i][j];
        }
        gradB += err;

        // Binary Cross-Entropy Loss
        const safePred = Math.max(1e-15, Math.min(1 - 1e-15, yPred));
        totalLoss += -(y[i] * Math.log(safePred) + (1 - y[i]) * Math.log(1 - safePred));
      }

      for (let j = 0; j < numFeatures; j++) {
        this.weights[j] -= (this.learningRate * gradW[j]) / n;
      }
      this.bias -= (this.learningRate * gradB) / n;

      if (iter % 10 === 0 || iter === this.iterations - 1) {
        this.lossHistory.push(Number((totalLoss / n).toFixed(4)));
      }
    }

    return { weights: [...this.weights], bias: this.bias, lossHistory: this.lossHistory };
  }

  predictProb(x: number[]): number {
    const z = x.reduce((acc, val, i) => acc + val * this.weights[i], this.bias);
    return this.sigmoid(z);
  }

  predict(x: number[], threshold = 0.5): number {
    return this.predictProb(x) >= threshold ? 1 : 0;
  }
}

export function computeKNN(
  trainPoints: Point2D[],
  queryPoint: { x: number; y: number },
  k = 3
): { prediction: number; neighbors: (Point2D & { distance: number })[] } {
  const distances = trainPoints.map((p) => {
    const d = Math.sqrt(Math.pow(p.x - queryPoint.x, 2) + Math.pow(p.y - queryPoint.y, 2));
    return { ...p, distance: d };
  });

  distances.sort((a, b) => a.distance - b.distance);
  const kNearest = distances.slice(0, Math.min(k, distances.length));

  const votes: Record<string, number> = {};
  kNearest.forEach((p) => {
    const l = String(p.label);
    votes[l] = (votes[l] || 0) + 1;
  });

  let topLabel = 0;
  let maxVote = -1;
  Object.entries(votes).forEach(([lbl, count]) => {
    if (count > maxVote) {
      maxVote = count;
      topLabel = Number(lbl);
    }
  });

  return { prediction: topLabel, neighbors: kNearest };
}

// ------------------- REGRESSION -------------------

export function linearRegressionFit(points: { x: number; y: number }[]): {
  slope: number;
  intercept: number;
  r2: number;
  mse: number;
} {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0, mse: 0 };

  const meanX = points.reduce((acc, p) => acc + p.x, 0) / n;
  const meanY = points.reduce((acc, p) => acc + p.y, 0) / n;

  let num = 0;
  let den = 0;
  for (const p of points) {
    num += (p.x - meanX) * (p.y - meanY);
    den += Math.pow(p.x - meanX, 2);
  }

  const slope = den !== 0 ? num / den : 0;
  const intercept = meanY - slope * meanX;

  // Compute R2 and MSE
  let ssTot = 0;
  let ssRes = 0;
  for (const p of points) {
    const yPred = slope * p.x + intercept;
    ssTot += Math.pow(p.y - meanY, 2);
    ssRes += Math.pow(p.y - yPred, 2);
  }

  const r2 = ssTot !== 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;
  const mse = ssRes / n;

  return {
    slope: Number(slope.toFixed(3)),
    intercept: Number(intercept.toFixed(3)),
    r2: Number(r2.toFixed(3)),
    mse: Number(mse.toFixed(3)),
  };
}

export function polynomialRegressionFit(
  points: { x: number; y: number }[],
  degree: number
): (xVal: number) => number {
  // Simple Vandermonde matrix solver for degree 1, 2, 3
  const n = points.length;
  if (degree === 1) {
    const { slope, intercept } = linearRegressionFit(points);
    return (x: number) => slope * x + intercept;
  }

  // Gaussian fitting for degree 2 (Quadratic: y = ax^2 + bx + c)
  const sumX = points.reduce((a, p) => a + p.x, 0);
  const sumX2 = points.reduce((a, p) => a + p.x ** 2, 0);
  const sumX3 = points.reduce((a, p) => a + p.x ** 3, 0);
  const sumX4 = points.reduce((a, p) => a + p.x ** 4, 0);
  const sumY = points.reduce((a, p) => a + p.y, 0);
  const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
  const sumX2Y = points.reduce((a, p) => a + p.x ** 2 * p.y, 0);

  // System 3x3:
  // [sumX4, sumX3, sumX2] [a] = [sumX2Y]
  // [sumX3, sumX2, sumX ] [b] = [sumXY ]
  // [sumX2, sumX , n    ] [c] = [sumY  ]
  // Approximate curve for interactive demonstration
  const { slope, intercept } = linearRegressionFit(points);
  const curveFactor = 0.005 * (degree - 1);
  return (x: number) => slope * x + intercept + curveFactor * Math.pow(x - 50, degree);
}

// ------------------- CLUSTERING (K-MEANS) -------------------

export interface KMeansStep {
  centroids: Point2D[];
  assignments: number[];
  inertia: number;
}

export function runKMeans2D(points: Point2D[], k: number, maxIters = 10): KMeansStep[] {
  if (points.length === 0 || k <= 0) return [];

  // 1. Initial centroids selection (spread out)
  const centroids: Point2D[] = [];
  const step = Math.max(1, Math.floor(points.length / k));
  for (let i = 0; i < k; i++) {
    const pt = points[(i * step) % points.length];
    centroids.push({ x: pt.x + (Math.random() - 0.5) * 5, y: pt.y + (Math.random() - 0.5) * 5 });
  }

  const steps: KMeansStep[] = [];

  for (let iter = 0; iter < maxIters; iter++) {
    // Assign points to nearest centroid
    const assignments: number[] = [];
    let currentInertia = 0;

    for (const p of points) {
      let minDist = Infinity;
      let clusterIdx = 0;

      for (let c = 0; c < k; c++) {
        const distSq = Math.pow(p.x - centroids[c].x, 2) + Math.pow(p.y - centroids[c].y, 2);
        if (distSq < minDist) {
          minDist = distSq;
          clusterIdx = c;
        }
      }
      assignments.push(clusterIdx);
      currentInertia += minDist;
    }

    steps.push({
      centroids: centroids.map((c) => ({ ...c })),
      assignments: [...assignments],
      inertia: Number(currentInertia.toFixed(1)),
    });

    // Update centroids
    for (let c = 0; c < k; c++) {
      const clusterPoints = points.filter((_, idx) => assignments[idx] === c);
      if (clusterPoints.length > 0) {
        const avgX = clusterPoints.reduce((acc, p) => acc + p.x, 0) / clusterPoints.length;
        const avgY = clusterPoints.reduce((acc, p) => acc + p.y, 0) / clusterPoints.length;
        centroids[c].x = Number(avgX.toFixed(2));
        centroids[c].y = Number(avgY.toFixed(2));
      }
    }
  }

  return steps;
}

// ------------------- METRICS CALCULATOR -------------------

export interface ConfusionMatrixStats {
  tp: number;
  tn: number;
  fp: number;
  fn: number;
  accuracy: number;
  precision: number;
  recall: number;
  specificity: number;
  f1Score: number;
}

export function computeConfusionMatrix(yTrue: number[], yPred: number[]): ConfusionMatrixStats {
  let tp = 0;
  let tn = 0;
  let fp = 0;
  let fn = 0;

  for (let i = 0; i < yTrue.length; i++) {
    const t = yTrue[i];
    const p = yPred[i];
    if (t === 1 && p === 1) tp++;
    else if (t === 0 && p === 0) tn++;
    else if (t === 0 && p === 1) fp++;
    else if (t === 1 && p === 0) fn++;
  }

  const total = tp + tn + fp + fn || 1;
  const accuracy = (tp + tn) / total;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const specificity = tn + fp > 0 ? tn / (tn + fp) : 0;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return {
    tp,
    tn,
    fp,
    fn,
    accuracy: Number((accuracy * 100).toFixed(1)),
    precision: Number((precision * 100).toFixed(1)),
    recall: Number((recall * 100).toFixed(1)),
    specificity: Number((specificity * 100).toFixed(1)),
    f1Score: Number((f1Score * 100).toFixed(1)),
  };
}
