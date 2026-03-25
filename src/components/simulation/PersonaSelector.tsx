'use client';

import { personas, genZPersonas, millennialPersonas } from '@/lib/personas';
import { PersonaCard } from './PersonaCard';
import { Button } from '@/components/ui/button';

interface PersonaSelectorProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onSelectGenZ: () => void;
  onSelectBalanced: () => void;
  onClear: () => void;
}

export function PersonaSelector({
  selectedIds,
  onToggle,
  onSelectAll,
  onSelectGenZ,
  onSelectBalanced,
  onClear,
}: PersonaSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Quick select buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onSelectAll}>
          Select All ({personas.length})
        </Button>
        <Button variant="outline" size="sm" onClick={onSelectGenZ}>
          All Gen Z ({genZPersonas.length})
        </Button>
        <Button variant="outline" size="sm" onClick={onSelectBalanced}>
          Balanced Mix
        </Button>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
      </div>

      {/* Persona grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {personas.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            selected={selectedIds.includes(persona.id)}
            onToggle={() => onToggle(persona.id)}
          />
        ))}
      </div>

      {/* Selection count */}
      <div className="text-center text-sm text-muted-foreground">
        {selectedIds.length} of {personas.length} personas selected
        {selectedIds.length < 3 && (
          <span className="text-orange-500 ml-2">(minimum 3 required)</span>
        )}
      </div>
    </div>
  );
}

// Helper function to get a balanced mix
export function getBalancedMix(): string[] {
  // 2 Gen Z, 2 Millennial, 1 Gen X
  return [
    genZPersonas[0].id,
    genZPersonas[1].id,
    millennialPersonas[0].id,
    millennialPersonas[1].id,
    personas.find((p) => p.generation === 'Gen X')!.id,
  ];
}
