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

    // Run simulations for each persona (with rate limiting)
    const allOpinions: PersonaOpinion[] = [];
    const DELAY_MS = 500; // Rate limit delay between API calls

    for (const persona of personas) {
      try {
        const opinions = await runPersonaSimulation(persona, items);
        allOpinions.push(...opinions);

        // Rate limit between calls
        if (personas.indexOf(persona) < personas.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
        }
      } catch (error) {
        console.error(`Simulation failed for ${persona.name}:`, error);
        // Continue with other personas even if one fails
      }
    }

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
