'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCcw, Zap, Sparkles } from 'lucide-react';

interface Props {
  mode?: 'biological' | 'artificial' | 'hybrid';
}

export default function NeuralBrain3D({ mode = 'hybrid' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentMode, setCurrentMode] = useState<'biological' | 'artificial' | 'hybrid'>(mode);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080c14);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 28);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x06b6d4, 2, 100);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 2, 100);
    pointLight2.position.set(-20, -20, -10);
    scene.add(pointLight2);

    // 3. Neural Network / Brain Nodes & Connections
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // Generate layers of neurons
    const layers = [4, 6, 8, 6, 3];
    const layerSpacing = 7;
    const nodeSpheres: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];

    const neuronGeometry = new THREE.SphereGeometry(0.55, 16, 16);

    layers.forEach((count, layerIdx) => {
      const x = (layerIdx - (layers.length - 1) / 2) * layerSpacing;
      const verticalSpacing = 2.4;

      for (let i = 0; i < count; i++) {
        const y = (i - (count - 1) / 2) * verticalSpacing;
        const z = (Math.sin(layerIdx * 1.5 + i) * 3);

        const pos = new THREE.Vector3(x, y, z);
        nodePositions.push(pos);

        // Color based on layer and mode
        let color = 0x06b6d4; // Cyan for input/hidden
        if (layerIdx === 0) color = 0x10b981; // Green for input
        else if (layerIdx === layers.length - 1) color = 0xf43f5e; // Rose for output
        else if (layerIdx % 2 === 1) color = 0x8b5cf6; // Purple for intermediate

        const material = new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.6,
          roughness: 0.2,
          metalness: 0.8,
        });

        const sphere = new THREE.Mesh(neuronGeometry, material);
        sphere.position.copy(pos);
        networkGroup.add(sphere);
        nodeSpheres.push(sphere);
      }
    });

    // Generate synaptic connection lines between adjacent layers
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });

    let prevLayerStart = 0;
    for (let l = 0; l < layers.length - 1; l++) {
      const currentCount = layers[l];
      const nextCount = layers[l + 1];
      const nextLayerStart = prevLayerStart + currentCount;

      for (let i = 0; i < currentCount; i++) {
        const fromIdx = prevLayerStart + i;
        for (let j = 0; j < nextCount; j++) {
          const toIdx = nextLayerStart + j;

          const points = [nodePositions[fromIdx], nodePositions[toIdx]];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeo, lineMaterial);
          networkGroup.add(line);
        }
      }
      prevLayerStart = nextLayerStart;
    }

    // Add pulses (action potentials moving along axons)
    const pulsesCount = 20;
    const pulseSpheres: { mesh: THREE.Mesh; from: THREE.Vector3; to: THREE.Vector3; progress: number; speed: number }[] = [];
    const pulseGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });

    for (let p = 0; p < pulsesCount; p++) {
      const pMesh = new THREE.Mesh(pulseGeo, pulseMat);
      networkGroup.add(pMesh);

      // Pick a random connection
      const randomFromIdx = Math.floor(Math.random() * (nodePositions.length - layers[layers.length - 1]));
      const randomToIdx = Math.min(nodePositions.length - 1, randomFromIdx + Math.floor(Math.random() * 6) + 1);

      pulseSpheres.push({
        mesh: pMesh,
        from: nodePositions[randomFromIdx],
        to: nodePositions[randomToIdx],
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.015,
      });
    }

    // Interactive mouse rotation drag
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
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      networkGroup.rotation.y += deltaX * 0.008;
      networkGroup.rotation.x += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 4. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isRotating && !isMouseDown) {
        networkGroup.rotation.y = elapsedTime * 0.15;
        networkGroup.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;
      }

      // Animate node breathing pulse
      nodeSpheres.forEach((sphere, i) => {
        const scale = 1 + Math.sin(elapsedTime * 2 + i * 0.5) * 0.15;
        sphere.scale.set(scale, scale, scale);
      });

      // Animate action potential pulses
      pulseSpheres.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;
        p.mesh.position.lerpVectors(p.from, p.to, p.progress);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [currentMode, isRotating]);

  return (
    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-border/80 glass-panel-glow">
      {/* 3D Canvas mount point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Interactive Controls */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
        <button
          onClick={() => setCurrentMode('biological')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md border transition-all ${
            currentMode === 'biological'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              : 'bg-surface/60 text-slate-400 border-border hover:text-white'
          }`}
        >
          🧬 Cerveau Biologique
        </button>
        <button
          onClick={() => setCurrentMode('artificial')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md border transition-all ${
            currentMode === 'artificial'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
              : 'bg-surface/60 text-slate-400 border-border hover:text-white'
          }`}
        >
          ⚡ Réseau de Neurones (MLP)
        </button>
        <button
          onClick={() => setCurrentMode('hybrid')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md border transition-all ${
            currentMode === 'hybrid'
              ? 'bg-violet-500/20 text-violet-300 border-violet-500/50'
              : 'bg-surface/60 text-slate-400 border-border hover:text-white'
          }`}
        >
          🔮 Comparaison Synaptique
        </button>
      </div>

      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-2 rounded-lg text-xs backdrop-blur-md border ${
            isRotating ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'bg-surface/60 text-slate-400 border-border'
          }`}
          title="Activer/Désactiver la rotation automatique"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Dynamic Overlay Info Panel */}
      <div className="absolute bottom-4 left-4 right-4 z-10 p-3.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-border/80 flex flex-col md:flex-row items-start md:items-center justify-between text-xs gap-3">
        {currentMode === 'biological' ? (
          <div>
            <span className="font-bold text-emerald-400">Le Neurone Biologique : </span>
            <span className="text-slate-300">
              Les <strong>dendrites</strong> reçoivent les neurotransmetteurs. Le <strong>soma</strong> intègre les potentiels d’action. Si le seuil est dépassé, l'<strong>axone</strong> décharge un signal électrique via la <strong>synapse</strong>.
            </span>
          </div>
        ) : currentMode === 'artificial' ? (
          <div>
            <span className="font-bold text-cyan-400">Le Neurone Artificiel (Perceptron) : </span>
            <span className="text-slate-300">
              Entrées pondérées : <code className="text-cyan-300">z = ∑(wᵢ·xᵢ) + b</code>, suivies d'une fonction d'activation non linéaire <code className="text-violet-300">a = f(z)</code> pour briser la linéarité.
            </span>
          </div>
        ) : (
          <div>
            <span className="font-bold text-violet-400">Analogie Vivant vs Algorithme : </span>
            <span className="text-slate-300">
              Synapse = Poids <code className="text-cyan-300">w</code> • Seuil biologique = Biais <code className="text-amber-300">b</code> • Décharge tout-ou-rien = Fonction d'Activation <code className="text-pink-300">f</code>.
            </span>
          </div>
        )}
        <div className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Glissez avec la souris pour pivoter en 3D</span>
        </div>
      </div>
    </div>
  );
}
