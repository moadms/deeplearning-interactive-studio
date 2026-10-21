'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle, XCircle, Sparkles, HelpCircle, ArrowRight, RotateCcw, Award, Star } from 'lucide-react';
import { ML_DL_QUIZ, QuizQuestion } from '@/lib/quizData';
import { useExploration } from '@/context/ExplorationContext';

export default function PlaygroundArena() {
  const { mode, xpPoints, addXp, completeQuest } = useExploration();

  // Quiz state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Mini-game 1: CNN Filter Matcher State
  const [filterAnswer, setFilterAnswer] = useState<string | null>(null);
  const [filterSuccess, setFilterSuccess] = useState<boolean | null>(null);

  const q: QuizQuestion = ML_DL_QUIZ[currentQuestionIdx];

  const handleSelectOption = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);

    if (index === q.correctIndex) {
      setQuizScore((prev) => prev + 1);
      addXp(20);
      completeQuest('quiz_question_' + q.id);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);

    if (currentQuestionIdx + 1 < ML_DL_QUIZ.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setIsQuizCompleted(true);
      completeQuest('completed_quiz');
      if (quizScore >= 3) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizScore(0);
    setIsQuizCompleted(false);
  };

  // Mini-game: Test CNN kernel answer
  const handleCheckFilter = (choice: string) => {
    setFilterAnswer(choice);
    if (choice === 'vertical') {
      setFilterSuccess(true);
      addXp(30);
      completeQuest('minigame_filter');
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    } else {
      setFilterSuccess(false);
    }
  };

  return (
    <div className="w-full space-y-12">
      {/* Mini-Game 1: CNN Kernel Detective */}
      <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 mb-1">
              <Star className="w-4 h-4 fill-cyan-400 text-cyan-400" />
              <span>Mini-Jeu #1 : L'Œil de la Convolution</span>
            </div>
            <h3 className="text-lg font-bold text-white">Quel Filtre Sobel Choisir pour Révéler le Poteau ?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Une caméra autonome de voiture détecte un poteau vertical blanc sur fond sombre. Quel kernel 3x3 va maximiser l'activation de convolution ?
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-amber-400 font-mono font-bold">
            +30 XP à gagner
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleCheckFilter('horizontal')}
            className={`p-4 rounded-xl border text-left transition-all ${
              filterAnswer === 'horizontal'
                ? 'bg-rose-950/60 border-rose-500'
                : 'bg-surface border-border hover:border-slate-500'
            }`}
          >
            <div className="font-mono text-xs font-bold text-amber-400 mb-2">Filtre A : Sobel Horizontal</div>
            <pre className="font-mono text-[11px] text-slate-300 bg-background p-2 rounded">
              [-1, -2, -1]{'\n'}[ 0,  0,  0]{'\n'}[ 1,  2,  1]
            </pre>
            <span className="text-[11px] text-slate-400 block mt-2">Mesure la variation sur l'axe Y</span>
          </button>

          <button
            onClick={() => handleCheckFilter('vertical')}
            className={`p-4 rounded-xl border text-left transition-all ${
              filterAnswer === 'vertical'
                ? 'bg-emerald-950/60 border-emerald-500 shadow-glow-emerald'
                : 'bg-surface border-border hover:border-slate-500'
            }`}
          >
            <div className="font-mono text-xs font-bold text-cyan-400 mb-2">Filtre B : Sobel Vertical</div>
            <pre className="font-mono text-[11px] text-slate-300 bg-background p-2 rounded">
              [-1, 0, 1]{'\n'}[-2, 0, 2]{'\n'}[-1, 0, 1]
            </pre>
            <span className="text-[11px] text-slate-400 block mt-2">Mesure la variation sur l'axe X</span>
          </button>

          <button
            onClick={() => handleCheckFilter('blur')}
            className={`p-4 rounded-xl border text-left transition-all ${
              filterAnswer === 'blur'
                ? 'bg-rose-950/60 border-rose-500'
                : 'bg-surface border-border hover:border-slate-500'
            }`}
          >
            <div className="font-mono text-xs font-bold text-slate-300 mb-2">Filtre C : Flou Moyenneur</div>
            <pre className="font-mono text-[11px] text-slate-300 bg-background p-2 rounded">
              [1/9, 1/9, 1/9]{'\n'}[1/9, 1/9, 1/9]{'\n'}[1/9, 1/9, 1/9]
            </pre>
            <span className="text-[11px] text-slate-400 block mt-2">Lisse et estompe les contrastes</span>
          </button>
        </div>

        {filterSuccess !== null && (
          <div
            className={`p-4 rounded-xl text-xs flex items-start space-x-3 ${
              filterSuccess
                ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/60 border border-rose-500/50 text-rose-200'
            }`}
          >
            {filterSuccess ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div>
              <strong className="block text-white mb-0.5">
                {filterSuccess ? 'Bravo ! C’est exactement le filtre Sobel Vertical.' : 'Pas tout à fait !'}
              </strong>
              <span>
                {filterSuccess
                  ? 'La colonne de gauche négative et la colonne de droite positive calculent la dérivée spatiale horizontale ∂I/∂x : le poteau vertical produit ainsi un pic d’activation maximal !'
                  : 'Pour un poteau vertical, le contraste brutal se produit de gauche à droite (horizontalement). Il faut donc une matrice dont les colonnes de gauche et de droite s’opposent (Filtre B).'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Certification Quiz */}
      <div id="quiz" className="p-6 rounded-2xl bg-surface-card border border-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Évaluation des Connaissances</span>
            </div>
            <h3 className="text-lg font-bold text-white">Quiz Certifiant : Machine Learning & Deep Learning</h3>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Progression :</span>
            <span className="font-mono text-cyan-400 font-bold">
              {currentQuestionIdx + 1} / {ML_DL_QUIZ.length}
            </span>
          </div>
        </div>

        {!isQuizCompleted ? (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                Catégorie : {q.category}
              </span>
              <h4 className="text-base font-bold text-white leading-snug">{q.question}</h4>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {q.options.map((option, idx) => {
                let btnStyle = 'bg-surface border-border hover:border-slate-500 text-slate-200';
                if (showExplanation) {
                  if (idx === q.correctIndex) {
                    btnStyle = 'bg-emerald-950/70 border-emerald-500 text-white shadow-glow-emerald';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'opacity-40 bg-surface border-border text-slate-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={showExplanation}
                    className={`w-full p-4 rounded-xl border text-left text-xs font-medium transition-all flex items-start space-x-3 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-background flex items-center justify-center font-mono font-bold text-slate-400 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Detailed Explanation Panel */}
            {showExplanation && (
              <div className="p-4 rounded-xl bg-background border border-border space-y-3 text-xs animate-in fade-in duration-200">
                <div className="flex items-center space-x-2 font-bold">
                  {selectedOption === q.correctIndex ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>Excellente réponse ! (+20 XP)</span>
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      <span>Réponse incorrecte</span>
                    </span>
                  )}
                </div>

                {mode === 'beginner' ? (
                  <div className="text-slate-300 leading-relaxed">
                    <strong className="text-emerald-400 block mb-1">💡 Explication intuitive :</strong>
                    {q.explanationBeginner}
                  </div>
                ) : (
                  <div className="text-slate-300 leading-relaxed font-mono">
                    <strong className="text-cyan-400 block mb-1">🔬 Rigueur théorique :</strong>
                    {q.explanationAdvanced}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan hover:bg-cyan-400 transition-all"
                  >
                    <span>
                      {currentQuestionIdx + 1 < ML_DL_QUIZ.length ? 'Question Suivante' : 'Voir les Résultats'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results Card */
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-glow-emerald">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white">Quiz Terminé !</h4>
              <p className="text-xs text-slate-400 mt-1">
                Score Final : <strong className="text-cyan-400 font-mono text-base">{quizScore} / {ML_DL_QUIZ.length}</strong> ({Math.round((quizScore / ML_DL_QUIZ.length) * 100)}%)
              </p>
            </div>

            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              {quizScore >= 4
                ? 'Félicitations ! Vous maîtrisez les concepts fondamentaux du pipeline Data Science, de la régularisation et des architectures de Deep Learning.'
                : 'Bon travail ! Prenez le temps de revoir les modules sur les fonctions d’activation et le compromis biais-variance pour consolider vos acquis.'}
            </p>

            <button
              onClick={handleRestartQuiz}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-surface border border-border text-white text-xs font-semibold hover:border-cyan-400 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recommencer le Quiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
