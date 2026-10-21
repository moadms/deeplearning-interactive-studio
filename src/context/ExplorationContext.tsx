'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ExplanationMode = 'beginner' | 'engineer';

interface ExplorationContextType {
  mode: ExplanationMode;
  toggleMode: () => void;
  setMode: (mode: ExplanationMode) => void;
  xpPoints: number;
  addXp: (amount: number) => void;
  completedQuests: string[];
  completeQuest: (questId: string) => void;
}

const ExplorationContext = createContext<ExplorationContextType | undefined>(undefined);

export function ExplorationProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ExplanationMode>('beginner');
  const [xpPoints, setXpPoints] = useState<number>(100);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);

  useEffect(() => {
    const savedMode = localStorage.getItem('neurolearn_mode') as ExplanationMode;
    if (savedMode) setModeState(savedMode);

    const savedXp = localStorage.getItem('neurolearn_xp');
    if (savedXp) setXpPoints(Number(savedXp));

    const savedQuests = localStorage.getItem('neurolearn_quests');
    if (savedQuests) {
      try {
        setCompletedQuests(JSON.parse(savedQuests));
      } catch (e) {}
    }
  }, []);

  const toggleMode = () => {
    setModeState((prev) => {
      const next = prev === 'beginner' ? 'engineer' : 'beginner';
      localStorage.setItem('neurolearn_mode', next);
      return next;
    });
  };

  const setMode = (newMode: ExplanationMode) => {
    setModeState(newMode);
    localStorage.setItem('neurolearn_mode', newMode);
  };

  const addXp = (amount: number) => {
    setXpPoints((prev) => {
      const updated = prev + amount;
      localStorage.setItem('neurolearn_xp', String(updated));
      return updated;
    });
  };

  const completeQuest = (questId: string) => {
    setCompletedQuests((prev) => {
      if (prev.includes(questId)) return prev;
      const updated = [...prev, questId];
      localStorage.setItem('neurolearn_quests', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ExplorationContext.Provider
      value={{
        mode,
        toggleMode,
        setMode,
        xpPoints,
        addXp,
        completedQuests,
        completeQuest,
      }}
    >
      {children}
    </ExplorationContext.Provider>
  );
}

export function useExploration() {
  const ctx = useContext(ExplorationContext);
  if (!ctx) {
    throw new Error('useExploration must be used within an ExplorationProvider');
  }
  return ctx;
}
