'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClothingItem, Persona, PersonaOpinion } from '@/types';
import Image from 'next/image';

interface PersonaOpinionsProps {
  items: ClothingItem[];
  personas: Persona[];
  opinions: PersonaOpinion[];
}

export function PersonaOpinions({ items, personas, opinions }: PersonaOpinionsProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(
    items[0]?.id || null
  );
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);

  const itemOpinions = opinions.filter((o) => o.itemId === selectedItem);
  const currentItem = items.find((i) => i.id === selectedItem);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-500/10';
    if (score >= 6) return 'text-blue-600 bg-blue-500/10';
    if (score >= 4) return 'text-yellow-600 bg-yellow-500/10';
    return 'text-red-600 bg-red-500/10';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Persona Opinions</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Item selector */}
        <div className="flex gap-3 mb-6 overflow-x-auto py-2 px-1 -mx-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item.id)}
              className={`
                relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 transition-all bg-zinc-100
                ${selectedItem === item.id ? 'ring-2 ring-zinc-900 ring-offset-2' : 'opacity-70 hover:opacity-100'}
              `}
            >
              <Image
                src={item.url}
                alt={item.analysis?.category || 'Item'}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Current item info */}
        {currentItem && (
          <div className="flex items-center gap-3 mb-6 p-3 bg-muted/50 rounded-lg">
            <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
              <Image
                src={currentItem.url}
                alt={currentItem.analysis?.category || 'Item'}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold">{currentItem.analysis?.category}</p>
              <p className="text-sm text-muted-foreground">
                {currentItem.analysis?.style?.join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Opinion cards */}
        <div className="space-y-3">
          {itemOpinions.map((opinion) => {
            const persona = personas.find((p) => p.id === opinion.personaId);
            if (!persona) return null;

            const isExpanded = expandedPersona === opinion.personaId;

            return (
              <Card
                key={opinion.personaId}
                className={`transition-all ${isExpanded ? 'bg-muted/30' : ''}`}
              >
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{persona.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{persona.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {persona.generation}
                        </Badge>
                        <Badge className={`${getScoreColor(opinion.score)} ml-auto`}>
                          {opinion.score}/10
                        </Badge>
                      </div>

                      {/* The spicy opinion */}
                      <p className="mt-2 text-sm">&quot;{opinion.opinion}&quot;</p>

                      {/* Quick stats */}
                      <div className="flex gap-3 mt-2 text-xs">
                        <span
                          className={opinion.wouldBuy ? 'text-green-600' : 'text-red-600'}
                        >
                          {opinion.wouldBuy ? '✓ Would buy' : '✗ Would not buy'}
                        </span>
                        <span className="text-muted-foreground">
                          Max: {opinion.priceWilling}
                        </span>
                      </div>

                      {/* Expanded reasoning */}
                      {isExpanded && (
                        <div className="mt-3 p-3 bg-muted/50 rounded text-sm">
                          <p className="font-medium mb-1">Full reasoning:</p>
                          <p className="text-muted-foreground">{opinion.reasoning}</p>
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-auto p-0 text-xs text-muted-foreground"
                        onClick={() =>
                          setExpandedPersona(isExpanded ? null : opinion.personaId)
                        }
                      >
                        {isExpanded ? 'Show less' : 'Show reasoning'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
