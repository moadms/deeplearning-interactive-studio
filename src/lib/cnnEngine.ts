// CNN Engine from Scratch (Convolution, Padding, Stride, Pooling, Softmax)

export interface KernelFilter {
  id: string;
  name: string;
  matrix: number[][];
  description: string;
}

export const PRESET_KERNELS: KernelFilter[] = [
  {
    id: 'sobel_horizontal',
    name: 'Sobel Horizontal (Détecteur de bords horizontaux)',
    description: 'Détecte les transitions brutales de contraste horizontal (bords de fenêtres, toits, lignes).',
    matrix: [
      [-1, -2, -1],
      [ 0,  0,  0],
      [ 1,  2,  1],
    ],
  },
  {
    id: 'sobel_vertical',
    name: 'Sobel Vertical (Détecteur de bords verticaux)',
    description: 'Détecte les piliers, contours verticaux de visages ou silhouettes.',
    matrix: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ],
  },
  {
    id: 'sharpen',
    name: 'Netteté (Sharpen)',
    description: 'Amplifie les hautes fréquences spatiales et rehausse les détails fins.',
    matrix: [
      [ 0, -1,  0],
      [-1,  5, -1],
      [ 0, -1,  0],
    ],
  },
  {
    id: 'ridge_detection',
    name: 'Laplacien (Détection complète de contours)',
    description: 'Détecte tous les contours omnidirectionnels par dérivée seconde spatiale.',
    matrix: [
      [-1, -1, -1],
      [-1,  8, -1],
      [-1, -1, -1],
    ],
  },
  {
    id: 'gaussian_blur',
    name: 'Flou Gaussien (Réduction de bruit)',
    description: 'Lisse l’image pour éliminer le bruit haute fréquence avant la détection d’objets.',
    matrix: [
      [1 / 16, 2 / 16, 1 / 16],
      [2 / 16, 4 / 16, 2 / 16],
      [1 / 16, 2 / 16, 1 / 16],
    ],
  },
];

export function applyConvolution2D(
  image: number[][],
  kernel: number[][],
  stride = 1,
  padding = 0
): {
  featureMap: number[][];
  outputHeight: number;
  outputWidth: number;
  paddedImage: number[][];
} {
  const inH = image.length;
  const inW = image[0].length;
  const kH = kernel.length;
  const kW = kernel[0].length;

  // 1. Pad image if padding > 0
  const padH = inH + 2 * padding;
  const padW = inW + 2 * padding;
  const paddedImage: number[][] = Array.from({ length: padH }, () => new Array(padW).fill(0));

  for (let r = 0; r < inH; r++) {
    for (let c = 0; c < inW; c++) {
      paddedImage[r + padding][c + padding] = image[r][c];
    }
  }

  // Formula: Output Size = floor((W - K + 2P)/S) + 1
  const outH = Math.floor((padH - kH) / stride) + 1;
  const outW = Math.floor((padW - kW) / stride) + 1;
  const featureMap: number[][] = Array.from({ length: outH }, () => new Array(outW).fill(0));

  for (let outR = 0; outR < outH; outR++) {
    for (let outC = 0; outC < outW; outC++) {
      let sum = 0;
      const startR = outR * stride;
      const startC = outC * stride;

      for (let kr = 0; kr < kH; kr++) {
        for (let kc = 0; kc < kW; kc++) {
          sum += paddedImage[startR + kr][startC + kc] * kernel[kr][kc];
        }
      }
      featureMap[outR][outC] = Number(sum.toFixed(2));
    }
  }

  return { featureMap, outputHeight: outH, outputWidth: outW, paddedImage };
}

export function applyReLU(matrix: number[][]): number[][] {
  return matrix.map((row) => row.map((v) => Math.max(0, v)));
}

export function applyMaxPooling(matrix: number[][], poolSize = 2): number[][] {
  const h = matrix.length;
  const w = matrix[0].length;
  const outH = Math.floor(h / poolSize);
  const outW = Math.floor(w / poolSize);

  const pooled: number[][] = Array.from({ length: outH }, () => new Array(outW).fill(0));

  for (let r = 0; r < outH; r++) {
    for (let c = 0; c < outW; c++) {
      let maxVal = -Infinity;
      for (let pr = 0; pr < poolSize; pr++) {
        for (let pc = 0; pc < poolSize; pc++) {
          const val = matrix[r * poolSize + pr]?.[c * poolSize + pc] ?? -Infinity;
          if (val > maxVal) maxVal = val;
        }
      }
      pooled[r][c] = maxVal === -Infinity ? 0 : maxVal;
    }
  }

  return pooled;
}

export function applySoftmax(logits: number[]): number[] {
  const maxLogit = Math.max(...logits);
  const expValues = logits.map((v) => Math.exp(v - maxLogit));
  const sumExp = expValues.reduce((a, b) => a + b, 0);
  return expValues.map((v) => Number((v / sumExp).toFixed(4)));
}
