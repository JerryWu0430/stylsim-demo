'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ClothingItem, Persona, SimulationResult, SimulationState } from '@/types';
import { personas as allPersonas } from '@/lib/personas';

interface SimulationContextType extends SimulationState {
  addItems: (items: ClothingItem[]) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<ClothingItem>) => void;
  setSelectedPersonas: (ids: string[]) => void;
  togglePersona: (id: string) => void;
  setStep: (step: SimulationState['currentStep']) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setSimulating: (simulating: boolean) => void;
  setProgress: (progress: SimulationState['progress']) => void;
  setResult: (result: SimulationResult | null) => void;
  resetSimulation: () => void;
  getSelectedPersonaObjects: () => Persona[];
}

const initialState: SimulationState = {
  items: [],
  selectedPersonas: [],
  isAnalyzing: false,
  isSimulating: false,
  currentStep: 'upload',
  result: null,
  progress: {
    current: 0,
    total: 0,
    message: '',
  },
};

const STORAGE_KEY = 'stylesim-state';

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SimulationState>(initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState({
          ...initialState,
          items: parsed.items || [],
          selectedPersonas: parsed.selectedPersonas || [],
          currentStep: parsed.currentStep || 'upload',
          result: parsed.result || null,
        });
      } catch (e) {
        console.error('Failed to load saved state:', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        items: state.items,
        selectedPersonas: state.selectedPersonas,
        currentStep: state.currentStep,
        result: state.result,
      })
    );
  }, [state.items, state.selectedPersonas, state.currentStep, state.result]);

  const addItems = (items: ClothingItem[]) => {
    setState((prev) => ({
      ...prev,
      items: [...prev.items, ...items],
    }));
  };

  const removeItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const updateItem = (id: string, updates: Partial<ClothingItem>) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));
  };

  const setSelectedPersonas = (ids: string[]) => {
    setState((prev) => ({ ...prev, selectedPersonas: ids }));
  };

  const togglePersona = (id: string) => {
    setState((prev) => ({
      ...prev,
      selectedPersonas: prev.selectedPersonas.includes(id)
        ? prev.selectedPersonas.filter((p) => p !== id)
        : [...prev.selectedPersonas, id],
    }));
  };

  const setStep = (step: SimulationState['currentStep']) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  };

  const setAnalyzing = (analyzing: boolean) => {
    setState((prev) => ({ ...prev, isAnalyzing: analyzing }));
  };

  const setSimulating = (simulating: boolean) => {
    setState((prev) => ({ ...prev, isSimulating: simulating }));
  };

  const setProgress = (progress: SimulationState['progress']) => {
    setState((prev) => ({ ...prev, progress }));
  };

  const setResult = (result: SimulationResult | null) => {
    setState((prev) => ({ ...prev, result }));
  };

  const resetSimulation = () => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getSelectedPersonaObjects = (): Persona[] => {
    return allPersonas.filter((p) => state.selectedPersonas.includes(p.id));
  };

  return (
    <SimulationContext.Provider
      value={{
        ...state,
        addItems,
        removeItem,
        updateItem,
        setSelectedPersonas,
        togglePersona,
        setStep,
        setAnalyzing,
        setSimulating,
        setProgress,
        setResult,
        resetSimulation,
        getSelectedPersonaObjects,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
