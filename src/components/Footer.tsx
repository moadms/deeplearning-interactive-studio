import React from 'react';
import Link from 'next/link';
import { Brain, Sparkles, BookOpen, GitBranch, ShieldCheck, UploadCloud } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface/50 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-cyan-400" />
            <span className="font-bold text-white text-base">NeuroLearn Studio</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Plateforme interactive et immersive conçue pour le module universitaire Deep Learning : du nettoyage de données aux modèles 3D et à l'auto-entraînement en ligne.
          </p>
          <div className="flex items-center space-x-2 text-xs text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span>Moteur 3D Three.js & Algorithmes From Scratch</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Parcours Pédagogique</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/data-cleaning" className="hover:text-cyan-400 transition-colors">Nettoyage & Data Studio</Link>
            </li>
            <li>
              <Link href="/machine-learning" className="hover:text-cyan-400 transition-colors">Machine Learning 2D & 3D</Link>
            </li>
            <li>
              <Link href="/deep-learning" className="hover:text-cyan-400 transition-colors">Réseaux de Neurones Détaillés</Link>
            </li>
            <li>
              <Link href="/cnn-from-scratch" className="hover:text-cyan-400 transition-colors">Vision & Images (CNN 3D)</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Pratique & AutoML</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/data-lab" className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Mon Lab : Upload & Modèles</span>
              </Link>
            </li>
            <li>
              <Link href="/evaluation" className="hover:text-cyan-400 transition-colors">Matrice de Confusion & Validation</Link>
            </li>
            <li>
              <Link href="/playground" className="hover:text-cyan-400 transition-colors">L'Arène des Jeux & Quiz</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Code & Open-Source</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="https://github.com/moadms/deeplearning-interactive-studio"
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Dépôt GitHub (moadms)</span>
              </a>
            </li>
            <li className="pt-2 text-[11px] text-slate-500 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Conforme aux exigences académiques</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-border/60 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 NeuroLearn Studio — Module Pédagogique Avancé Machine Learning & Deep Learning.</p>
        <p className="mt-2 sm:mt-0 flex items-center space-x-2">
          <span>Construit avec Next.js, Tailwind CSS & Three.js</span>
        </p>
      </div>
    </footer>
  );
}
