import { NextRequest, NextResponse } from 'next/server';
import { runPersonaSimulation } from '@/lib/claude';
import { aggregateResults } from '@/lib/analysis';
import { getPersonaById } from '@/lib/personas';
import { ClothingItem, PersonaOpinion, Persona } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { items, personaIds } = (await request.json()) as {
      items: ClothingItem[];
      personaIds: string[];
    };

    if (!items?.length || !personaIds?.length) {
      return NextResponse.json(
        { error: 'Items and persona IDs required' },
        { status: 400 }
      );
    }

    const personas = personaIds
      .map((id) => getPersonaById(id))
      .filter((p): p is Persona => p !== undefined);

    if (personas.length === 0) {
      return NextResponse.json({ error: 'No valid personas found' }, { status: 400 });
    }

    // Run simulations for all personas in parallel
    const results = await Promise.allSettled(
      personas.map((persona) => runPersonaSimulation(persona, items))
    );

    const allOpinions: PersonaOpinion[] = [];
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        allOpinions.push(...result.value);
      } else {
        console.error(`Simulation failed for ${personas[i].name}:`, result.reason);
      }
    });

    if (allOpinions.length === 0) {
      return NextResponse.json(
        { error: 'All persona simulations failed' },
        { status: 500 }
      );
    }

    // Aggregate results
    const result = aggregateResults(items, personas, allOpinions);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Simulation failed' },
      { status: 500 }
    );
  }
}
