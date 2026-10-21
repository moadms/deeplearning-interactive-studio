'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, SkipForward, RotateCcw, Filter, Sparkles, Eye, Layers } from 'lucide-react';
import { PRESET_KERNELS, applyConvolution2D, applyMaxPooling, applyReLU } from '@/lib/cnnEngine';

export default function CNNVisualizer3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeLayer, setActiveLayer] = useState<number>(1);
  const [selectedKernel, setSelectedKernel] = useState(PRESET_KERNELS[0]);
  const [convStepX, setConvStepX] = useState(0);
  const [convStepY, setConvStepY] = useState(0);

  // Sample 6x6 grayscale input image (high contrast digit or contour)
  const [sampleImage, setSampleImage] = useState<number[][]>([
    [0,   0,  90,  90,   0,   0],
    [0,  90, 255, 255,  90,   0],
    [90, 255, 255, 255, 255,  90],
    [90, 255, 255, 255, 255,  90],
    [0,  90, 255, 255,  90,   0],
    [0,   0,  90,  90,   0,   0],
  ]);

  // Compute live convolution
  const convResult = applyConvolution2D(sampleImage, selectedKernel.matrix, 1, 0);
  const reluResult = applyReLU(convResult.featureMap);
  const poolResult = applyMaxPooling(reluResult, 2);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060911);

    // Camera placed much closer to fill the screen beautifully
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 17);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Atmospheric lights
    const amb = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(amb);
    const lightCyan = new THREE.DirectionalLight(0x06b6d4, 2.0);
    lightCyan.position.set(15, 25, 20);
    scene.add(lightCyan);
    const lightPurple = new THREE.DirectionalLight(0x8b5cf6, 1.8);
    lightPurple.position.set(-20, -15, 15);
    scene.add(lightPurple);

    const stagesGroup = new THREE.Group();
    scene.add(stagesGroup);

    // Helpers to create volumetric glowing grids
    const createGridMesh = (rows: number, cols: number, baseColor: number, xOffset: number) => {
      const group = new THREE.Group();
      const cellSize = 0.85;
      const cellGeo = new THREE.BoxGeometry(cellSize, cellSize, 0.25);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const mat = new THREE.MeshStandardMaterial({
            color: baseColor,
            metalness: 0.4,
            roughness: 0.3,
            transparent: true,
            opacity: 0.9,
          });
          const cube = new THREE.Mesh(cellGeo, mat);
          cube.position.set(
            (c - (cols - 1) / 2) * (cellSize + 0.08),
            ((rows - 1) / 2 - r) * (cellSize + 0.08),
            0
          );
          group.add(cube);
        }
      }
      group.position.x = xOffset;
      return group;
    };

    // Stage 1: Input Image Matrix (6x6) - Emerald
    const stage1 = createGridMesh(6, 6, 0x10b981, -7.5);
    stagesGroup.add(stage1);

    // Stage 2: Feature Map Conv2D (4x4) - Cyan
    const stage2 = createGridMesh(4, 4, 0x06b6d4, -2.5);
    stagesGroup.add(stage2);

    // Stage 3: Pooled Map MaxPool (2x2) - Purple
    const stage3 = createGridMesh(2, 2, 0x8b5cf6, 2.2);
    stagesGroup.add(stage3);

    // Stage 4: Flatten Vector (1D Column of 4 neurons) - Amber
    const stage4 = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.5,
    });
    for (let i = 0; i < 4; i++) {
      const s = new THREE.Mesh(sphereGeo, sphereMat);
      s.position.set(5.5, (i - 1.5) * 1.1, 0);
      stage4.add(s);
    }
    stagesGroup.add(stage4);

    // Stage 5: Softmax Output Bars (3 Classes) - Rose & Emerald
    const stage5 = new THREE.Group();
    const probs = [0.88, 0.09, 0.03];
    probs.forEach((prob, idx) => {
      const barGeo = new THREE.BoxGeometry(prob * 2.5, 0.45, 0.45);
      const barMat = new THREE.MeshStandardMaterial({
        color: idx === 0 ? 0x10b981 : 0xf43f5e,
        emissive: idx === 0 ? 0x10b981 : 0xf43f5e,
        emissiveIntensity: 0.4,
      });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(8.5 + (prob * 2.5) / 2, (idx - 1) * 1.2, 0);
      stage5.add(bar);
    });
    stagesGroup.add(stage5);

    // Glowing Kernel Box (3x3 wireframe) moving over Stage 1
    const kernelHighlightGeo = new THREE.BoxGeometry(3 * 0.93, 3 * 0.93, 0.35);
    const kernelHighlightMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
    });
    const kernelWire = new THREE.Mesh(kernelHighlightGeo, kernelHighlightMat);
    stage1.add(kernelWire);

    // Laser lines connecting the kernel center to the feature map output pixel
    const laserMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const laserGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ]);
    const laserLine = new THREE.Line(laserGeo, laserMat);
    stagesGroup.add(laserLine);

    // Connecting streams between layers
    const addDottedLine = (x1: number, y1: number, x2: number, y2: number, color: number) => {
      const pts = [new THREE.Vector3(x1, y1, 0), new THREE.Vector3(x2, y2, 0)];
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const m = new THREE.LineDashedMaterial({
        color,
        dashSize: 0.3,
        gapSize: 0.2,
        transparent: true,
        opacity: 0.35,
      });
      const l = new THREE.Line(g, m);
      l.computeLineDistances();
      stagesGroup.add(l);
    };

    // Connections between Pooling and Flatten
    for (let r = -1; r <= 1; r += 2) {
      for (let i = 0; i < 4; i++) {
        addDottedLine(2.8, r * 0.6, 5.5, (i - 1.5) * 1.1, 0x8b5cf6);
      }
    }
    // Connections between Flatten and Softmax
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        addDottedLine(5.5, (i - 1.5) * 1.1, 8.5, (j - 1) * 1.2, 0xf59e0b);
      }
    }

    // Mouse drag interaction
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      stagesGroup.rotation.y += (e.clientX - prevMouseX) * 0.007;
      stagesGroup.rotation.x += (e.clientY - prevMouseY) * 0.007;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseUp = () => (isMouseDown = false);

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animId: number;
    let clock = new THREE.Clock();
    let lastStepTime = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle floating animation
      if (!isMouseDown) {
        stagesGroup.rotation.y = Math.sin(elapsed * 0.25) * 0.12;
        stagesGroup.position.y = Math.sin(elapsed * 0.8) * 0.15;
      }

      // Step scanning animation
      if (isPlaying && elapsed - lastStepTime > 0.85) {
        lastStepTime = elapsed;
        setConvStepX((prevX) => {
          let nextX = prevX + 1;
          if (nextX >= 4) {
            nextX = 0;
            setConvStepY((prevY) => (prevY + 1 >= 4 ? 0 : prevY + 1));
          }
          return nextX;
        });
      }

      // Position kernel box
      const kX = (convStepX - 1.5) * 0.93;
      const kY = (1.5 - convStepY) * 0.93;
      kernelWire.position.set(kX, kY, 0.2);

      // Update laser projection beam connecting stage 1 kernel center to stage 2 output pixel
      const startWorld = new THREE.Vector3(-7.5 + kX, kY, 0.2);
      const targetWorld = new THREE.Vector3(
        -2.5 + (convStepX - 1.5) * 0.93,
        (1.5 - convStepY) * 0.93,
        0
      );
      laserGeo.setFromPoints([startWorld, targetWorld]);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [isPlaying, convStepX, convStepY, selectedKernel]);

  return (
    <div className="w-full space-y-6">
      {/* 3D Stage Canvas */}
      <div className="relative w-full h-[480px] rounded-3xl overflow-hidden border border-cyan-500/30 glass-panel-glow shadow-2xl">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* 3D Stage Labels Header */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/50 backdrop-blur-md">
              1. Image d'Entrée (6x6)
            </span>
            <span className="text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/50 backdrop-blur-md">
              2. Carte de Features (4x4)
            </span>
            <span className="text-violet-300 bg-violet-950/80 px-2.5 py-1 rounded-lg border border-violet-500/50 backdrop-blur-md">
              3. MaxPool (2x2)
            </span>
            <span className="text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/50 backdrop-blur-md">
              4. Aplatissement (1D)
            </span>
            <span className="text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-500/50 backdrop-blur-md">
              5. Softmax (Chat 88%)
            </span>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/80 px-3 py-1 rounded-full border border-border flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pivotez à 360° avec la souris</span>
          </div>
        </div>

        {/* Interactive Play/Pause & Step Indicators */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold shadow-glow-cyan hover:bg-cyan-400 transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Animation' : 'Reprendre Animation'}</span>
            </button>
            <span className="text-xs text-slate-300 bg-slate-950/90 px-3 py-2 rounded-xl border border-border font-mono">
              Position du Filtre : <strong className="text-amber-400">Ligne {convStepY + 1}, Col {convStepX + 1}</strong>
            </span>
          </div>

          <div className="text-xs text-slate-300 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-border">
            Faisceau laser : <span className="text-cyan-400 font-mono font-bold">Produit scalaire 3x3 ➔ Pixel de sortie</span>
          </div>
        </div>
      </div>

      {/* Interactive 2D Scratch Math Inspector (Calcul Pas-à-Pas) */}
      <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-cyan-400" />
              <span>Inspection Déterministe du Produit Matriciel (From Scratch)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Observez comment le Kernel glisse sur la région 3x3 de l’image pour calculer chaque valeur de la Feature Map.
            </p>
          </div>

          {/* Kernel Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-300 font-medium">Changer le Filtre :</label>
            <select
              value={selectedKernel.id}
              onChange={(e) => {
                const found = PRESET_KERNELS.find((k) => k.id === e.target.value);
                if (found) setSelectedKernel(found);
              }}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-cyan-400 focus:outline-none focus:border-cyan-400"
            >
              {PRESET_KERNELS.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2D Grid Visualizer (Image Region vs Kernel Matrix vs Output Pixel) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Sub-region 3x3 of Image */}
          <div className="p-4 rounded-xl bg-background border border-emerald-500/30">
            <div className="text-xs font-semibold text-emerald-400 mb-2 flex justify-between">
              <span>Sous-matrice Image (3x3)</span>
              <span>Pos : [{convStepY}:{convStepY + 3}, {convStepX}:{convStepX + 3}]</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[0, 1, 2].map((r) =>
                [0, 1, 2].map((c) => {
                  const val = sampleImage[convStepY + r]?.[convStepX + c] ?? 0;
                  return (
                    <div
                      key={`img-${r}-${c}`}
                      className="h-10 rounded flex items-center justify-center font-mono text-xs font-bold transition-colors"
                      style={{
                        backgroundColor: `rgba(16, 185, 129, ${Math.max(0.15, val / 255)})`,
                        color: val > 120 ? '#ffffff' : '#a7f3d0',
                      }}
                    >
                      {val}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Kernel Matrix 3x3 */}
          <div className="p-4 rounded-xl bg-background border border-amber-500/30">
            <div className="text-xs font-semibold text-amber-400 mb-2 flex justify-between">
              <span>Matrice Kernel (wᵢⱼ)</span>
              <span>Filtre 3x3</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {selectedKernel.matrix.map((row, r) =>
                row.map((val, c) => (
                  <div
                    key={`k-${r}-${c}`}
                    className="h-10 rounded bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-mono text-xs font-bold text-amber-300"
                  >
                    {val}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Formula & Resulting Value */}
          <div className="p-4 rounded-xl bg-background border border-cyan-500/30 space-y-2">
            <div className="text-xs font-semibold text-cyan-400 mb-1">
              Pixel Sortie = ∑(Pixel × Poids)
            </div>
            <div className="p-3 rounded-lg bg-surface border border-border text-center">
              <span className="text-xs text-slate-400 block mb-1">Feature Map ({convStepY}, {convStepX})</span>
              <span className="text-2xl font-mono font-extrabold text-cyan-300">
                {convResult.featureMap[convStepY]?.[convStepX] ?? 0}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 leading-snug">
              Après fonction d'activation ReLU :{' '}
              <strong className="text-emerald-300">
                {reluResult[convStepY]?.[convStepX] ?? 0}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
