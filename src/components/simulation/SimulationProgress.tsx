'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getRandomQuote } from '@/lib/prompts';
import { Persona } from '@/types';

interface SimulationProgressProps {
  personas: Persona[];
  currentPersonaIndex: number;
  totalItems: number;
}

export function SimulationProgress({
  personas,
  currentPersonaIndex,
  totalItems,
}: SimulationProgressProps) {
  const [quote, setQuote] = useState('');
  const currentPersona = personas[currentPersonaIndex];
  const progress = ((currentPersonaIndex + 1) / personas.length) * 100;

  useEffect(() => {
    if (currentPersona) {
      setQuote(getRandomQuote(currentPersona.id));
      const interval = setInterval(() => {
        setQuote(getRandomQuote(currentPersona.id));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentPersona]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="p-8 text-center">
        {/* Animated persona avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="text-7xl animate-bounce">{currentPersona?.avatar || '🤔'}</div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/10 rounded-full blur-sm" />
          </div>
        </div>

        {/* Persona info */}
        <h2 className="text-2xl font-bold mb-2">{currentPersona?.name || 'Loading...'}</h2>
        <p className="text-muted-foreground mb-4">
          {currentPersona?.style} • {currentPersona?.generation}
        </p>

        {/* Animated quote */}
        <div className="h-12 flex items-center justify-center">
          <p className="text-sm italic text-muted-foreground animate-pulse">{quote}</p>
        </div>

        {/* Progress bar */}
        <div className="mt-8 space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Evaluating {totalItems} items • Persona {currentPersonaIndex + 1} of{' '}
            {personas.length}
          </p>
        </div>
      </Card>

      {/* Persona queue */}
      <div className="flex justify-center gap-2 flex-wrap">
        {personas.map((persona, index) => (
          <div
            key={persona.id}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all
              ${index < currentPersonaIndex ? 'opacity-50 scale-75' : ''}
              ${index === currentPersonaIndex ? 'ring-2 ring-primary scale-110' : ''}
              ${index > currentPersonaIndex ? 'opacity-30' : ''}
            `}
          >
            {persona.avatar}
          </div>
        ))}
      </div>
    </div>
  );
}
