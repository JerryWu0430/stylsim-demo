'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { OverviewCards } from '@/components/results/OverviewCards';
import { DemandChart } from '@/components/results/DemandChart';
import { RankingTable } from '@/components/results/RankingTable';
import { PersonaOpinions } from '@/components/results/PersonaOpinions';
import { Recommendations } from '@/components/results/Recommendations';
import { ExportButton } from '@/components/results/ExportButton';
import { useSimulation } from '@/context/SimulationContext';

export default function ResultsPage() {
  const router = useRouter();
  const { result, resetSimulation } = useSimulation();

  // Redirect if no results
  useEffect(() => {
    if (!result) {
      router.push('/');
    }
  }, [result, router]);

  if (!result) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Loading results...</p>
      </div>
    );
  }

  const handleNewSimulation = () => {
    resetSimulation();
    router.push('/');
  };

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Simulation Results</h1>
            <p className="text-muted-foreground">
              Analysis of {result.items.length} items by {result.personas.length} personas
            </p>
          </div>
          <div className="flex gap-2">
            <ExportButton result={result} />
            <Button variant="outline" onClick={handleNewSimulation}>
              New Simulation
            </Button>
          </div>
        </div>

        {/* Overview cards */}
        <OverviewCards result={result} />

        {/* Tabbed content */}
        <Tabs defaultValue="rankings" className="mt-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
            <TabsTrigger value="demand">Demand Chart</TabsTrigger>
            <TabsTrigger value="opinions">Opinions</TabsTrigger>
            <TabsTrigger value="recommendations">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="rankings" className="mt-6">
            <RankingTable rankings={result.rankings} />
          </TabsContent>

          <TabsContent value="demand" className="mt-6">
            <DemandChart rankings={result.rankings} />
          </TabsContent>

          <TabsContent value="opinions" className="mt-6">
            <PersonaOpinions
              items={result.items}
              personas={result.personas}
              opinions={result.opinions}
            />
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <Recommendations recommendations={result.recommendations} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
