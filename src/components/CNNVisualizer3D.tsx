'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, SkipForward, RotateCcw, Info, Sparkles, Filter, Maximize2 } from 'lucide-react';
import { PRESET_KERNELS, applyConvolution2D, applyMaxPooling, applyReLU } from '@/lib/cnnEngine';

export default function CNNVisualizer3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeLayerIndex, setActiveLayerIndex] = useState(1);
  const [selectedKernel, setSelectedKernel] = useState(PRESET_KERNELS[0]);
  const [convStepX, setConvStepX] = useState(0);
  const [convStepY, setConvStepY] = useState(0);

  // Sample 6x6 grayscale input image (e.g. a simple cross or contour)
  const [sampleImage, setSampleImage] = useState<number[][]>([
    [0, 0, 80, 80, 0, 0],
    [0, 80, 255, 255, 80, 0],
    [80, 255, 255, 255, 255, 80],
    [80, 255, 255, 255, 255, 80],
    [0, 80, 255, 255, 80, 0],
    [0, 0, 80, 80, 0, 0],
  ]);

  // Compute live convolution
  const convResult = applyConvolution2D(sampleImage, selectedKernel.matrix, 1, 0);
  const reluResult = applyReLU(convResult.featureMap);
  const poolResult = applyMaxPooling(reluResult, 2);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 700;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080c14);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 4, 30);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(amb);
    const light1 = new THREE.DirectionalLight(0x38bdf8, 1.5);
    light1.position.set(10, 20, 20);
    scene.add(light1);
    const light2 = new THREE.DirectionalLight(0xa78bfa, 1.2);
    light2.position.set(-15, -10, 15);
    scene.add(light2);

    const stagesGroup = new THREE.Group();
    scene.add(stagesGroup);

    // Define 3D stages representation
    // Stage 0: Input Image Slice (6x6)
    // Stage 1: Conv 2D Kernel + Projection beam
    // Stage 2: Feature Map (4x4)
    // Stage 3: Max Pooling (2x2)
    // Stage 4: Flatten 1D array
    // Stage 5: Output Dense Softmax

    const createGridMesh = (rows: number, cols: number, color: number, xOffset: number, zSpacing = 0) => {
      const group = new THREE.Group();
      const cellSize = 0.9;
      const cellGeo = new THREE.BoxGeometry(cellSize, cellSize, 0.2);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const mat = new THREE.MeshStandardMaterial({
            color,
            metalness: 0.3,
            roughness: 0.4,
            transparent: true,
            opacity: 0.85,
          });
          const cube = new THREE.Mesh(cellGeo, mat);
          cube.position.set(
            (c - (cols - 1) / 2) * (cellSize + 0.1),
            ((rows - 1) / 2 - r) * (cellSize + 0.1),
            zSpacing
          );
          group.add(cube);
        }
      }
      group.position.x = xOffset;
      return group;
    };

    // Stage 1: Input (Greenish)
    const stage1 = createGridMesh(6, 6, 0x10b981, -12);
    stagesGroup.add(stage1);

    // Stage 2: Feature Map (Cyan)
    const stage2 = createGridMesh(4, 4, 0x06b6d4, -4);
    stagesGroup.add(stage2);

    // Stage 3: Pooled Map (Purple)
    const stage3 = createGridMesh(2, 2, 0x8b5cf6, 4);
    stagesGroup.add(stage3);

    // Stage 4: Dense Vector (Amber Spheres)
    const denseGroup = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const denseMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.4 });
    for (let i = 0; i < 4; i++) {
      const s = new THREE.Mesh(sphereGeo, denseMat);
      s.position.set(10, (i - 1.5) * 1.4, 0);
      denseGroup.add(s);
    }
    stagesGroup.add(denseGroup);

    // Stage 5: Output (Rose Bars)
    const outputGroup = new THREE.Group();
    const labels = [0.88, 0.09, 0.03];
    labels.forEach((prob, idx) => {
      const barGeo = new THREE.BoxGeometry(prob * 3, 0.4, 0.4);
      const barMat = new THREE.MeshStandardMaterial({ color: idx === 0 ? 0x10b981 : 0xf43f5e });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(15 + (prob * 3) / 2, (idx - 1) * 1.5, 0);
      outputGroup.add(bar);
    });
    stagesGroup.add(outputGroup);

    // Dynamic Scanning Kernel highlight on Stage 1
    const kernelHighlightGeo = new THREE.BoxGeometry(3 * 0.95, 3 * 0.95, 0.3);
    const kernelHighlightMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
    });
    const kernelWire = new THREE.Mesh(kernelHighlightGeo, kernelHighlightMat);
    stage1.add(kernelWire);

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

      if (isPlaying && elapsed - lastStepTime > 0.8) {
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

      // Position the kernel highlight box relative to convStepX and convStepY
      kernelWire.position.set(
        (convStepX - 1.5) * 1.0,
        (1.5 - convStepY) * 1.0,
        0.15
      );

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
      <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-border/80 glass-panel-glow">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* 3D Stage Labels */}
        <div className="absolute top-4 left-6 flex space-x-6 text-xs font-semibold z-10 pointer-events-none">
          <span className="text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800">
            1. Image 6x6
          </span>
          <span className="text-cyan-400 bg-cyan-950/80 px-2 py-1 rounded border border-cyan-800">
            2. Conv 2D (4x4)
          </span>
          <span className="text-violet-400 bg-violet-950/80 px-2 py-1 rounded border border-violet-800">
            3. MaxPool (2x2)
          </span>
          <span className="text-amber-400 bg-amber-950/80 px-2 py-1 rounded border border-amber-800">
            4. Flatten
          </span>
          <span className="text-rose-400 bg-rose-950/80 px-2 py-1 rounded border border-rose-800">
            5. Softmax (88%)
          </span>
        </div>

        {/* Play / Pause Controls */}
        <div className="absolute bottom-4 left-6 z-10 flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-medium backdrop-blur-md hover:bg-cyan-500/30"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Animation' : 'Lancer Convolution'}</span>
          </button>
          <span className="text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-border">
            Filtre actif : <strong className="text-amber-300">({convStepX}, {convStepY})</strong>
          </span>
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
