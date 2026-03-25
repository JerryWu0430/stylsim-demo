'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PersonaSelector, getBalancedMix } from '@/components/simulation/PersonaSelector';
import { SimulationProgress } from '@/components/simulation/SimulationProgress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSimulation } from '@/context/SimulationContext';
import { personas, genZPersonas } from '@/lib/personas';
import Image from 'next/image';

export default function SimulationPage() {
  const router = useRouter();
  const {
    items,
    selectedPersonas,
    setSelectedPersonas,
    togglePersona,
    isSimulating,
    setSimulating,
    setResult,
    setStep,
    getSelectedPersonaObjects,
  } = useSimulation();

  const [currentPersonaIndex, setCurrentPersonaIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Redirect if no items
  useEffect(() => {
    if (items.length === 0) {
      router.push('/');
    }
  }, [items, router]);

  const handleSelectAll = () => setSelectedPersonas(personas.map((p) => p.id));
  const handleSelectGenZ = () => setSelectedPersonas(genZPersonas.map((p) => p.id));
  const handleSelectBalanced = () => setSelectedPersonas(getBalancedMix());
  const handleClear = () => setSelectedPersonas([]);

  const runSimulation = async () => {
    if (selectedPersonas.length < 3) {
      setError('Please select at least 3 personas');
      return;
    }

    setError(null);
    setSimulating(true);
    setStep('simulating');
    setCurrentPersonaIndex(0);

    try {
      // Simulate progress through personas
      const progressInterval = setInterval(() => {
        setCurrentPersonaIndex((prev) => {
          if (prev < selectedPersonas.length - 1) return prev + 1;
          return prev;
        });
      }, 2000);

      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          personaIds: selectedPersonas,
        }),
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Simulation failed');
      }

      const { result } = await res.json();
      setResult(result);
      setStep('results');
      router.push('/results');
    } catch (e) {
      console.error('Simulation error:', e);
      setError(e instanceof Error ? e.message : 'Simulation failed');
      setStep('configure');
    } finally {
      setSimulating(false);
    }
  };

  const estimatedTime = Math.ceil(selectedPersonas.length * items.length * 0.5);

  if (isSimulating) {
    return (
      <div className="container py-16">
        <SimulationProgress
          personas={getSelectedPersonaObjects()}
          currentPersonaIndex={currentPersonaIndex}
          totalItems={items.length}
        />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Configure Simulation</h1>
          <p className="text-muted-foreground">
            Select which customer personas should evaluate your collection
          </p>
        </div>

        {/* Items preview */}
        <Card className="p-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {items.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="w-10 h-10 rounded-lg border-2 border-background overflow-hidden relative"
                >
                  <Image src={item.url} alt="" fill className="object-cover" />
                </div>
              ))}
              {items.length > 5 && (
                <div className="w-10 h-10 rounded-lg border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                  +{items.length - 5}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{items.length} items to evaluate</p>
              <p className="text-sm text-muted-foreground">
                {items.filter((i) => i.analysis).length} analyzed
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push('/')} className="ml-auto">
              Edit Collection
            </Button>
          </div>
        </Card>

        {/* Persona selector */}
        <PersonaSelector
          selectedIds={selectedPersonas}
          onToggle={togglePersona}
          onSelectAll={handleSelectAll}
          onSelectGenZ={handleSelectGenZ}
          onSelectBalanced={handleSelectBalanced}
          onClear={handleClear}
        />

        {/* Error message */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-center">
            {error}
          </div>
        )}

        {/* Launch button */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <Button
            size="lg"
            onClick={runSimulation}
            disabled={selectedPersonas.length < 3 || isSimulating}
          >
            Launch Simulation
          </Button>
          {selectedPersonas.length >= 3 && (
            <p className="text-sm text-muted-foreground">
              Estimated time: ~{estimatedTime} seconds
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
