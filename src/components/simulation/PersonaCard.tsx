'use client';

import { Persona } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface PersonaCardProps {
  persona: Persona;
  selected: boolean;
  onToggle: () => void;
}

export function PersonaCard({ persona, selected, onToggle }: PersonaCardProps) {
  const genColor = {
    'Gen Z': 'bg-purple-500/10 text-purple-600',
    Millennial: 'bg-blue-500/10 text-blue-600',
    'Gen X': 'bg-green-500/10 text-green-600',
  }[persona.generation];

  return (
    <Card
      className={`
        relative p-4 cursor-pointer transition-all
        ${selected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}
      `}
      onClick={onToggle}
    >
      <div className="absolute top-3 right-3">
        <Checkbox checked={selected} onCheckedChange={onToggle} />
      </div>

      <div className="flex gap-3">
        <div className="text-4xl">{persona.avatar}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold">{persona.name}</h3>
          <div className="flex gap-2 mt-1 flex-wrap">
            <Badge variant="secondary" className={genColor}>
              {persona.generation}
            </Badge>
            <Badge variant="outline">{persona.style}</Badge>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-3 italic">&quot;{persona.hook}&quot;</p>

      <div className="mt-3 flex gap-1 flex-wrap">
        {persona.traits.slice(0, 3).map((trait) => (
          <Badge key={trait} variant="secondary" className="text-xs">
            {trait}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
