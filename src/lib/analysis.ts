import {
  ClothingItem,
  DemandForecast,
  Persona,
  PersonaOpinion,
  RankedItem,
  Recommendation,
  SimulationResult,
} from '@/types';
import { nanoid } from 'nanoid';

export function aggregateResults(
  items: ClothingItem[],
  personas: Persona[],
  opinions: PersonaOpinion[]
): SimulationResult {
  const forecasts = calculateForecasts(items, opinions, personas);
  const rankings = calculateRankings(items, opinions);
  const recommendations = generateRecommendations(rankings, forecasts, personas);

  return {
    id: nanoid(),
    timestamp: new Date(),
    items,
    personas,
    opinions,
    forecasts,
    rankings,
    recommendations,
  };
}

function calculateForecasts(
  items: ClothingItem[],
  opinions: PersonaOpinion[],
  personas: Persona[]
): DemandForecast[] {
  return items.map((item) => {
    const itemOpinions = opinions.filter((o) => o.itemId === item.id);
    const avgScore =
      itemOpinions.reduce((sum, o) => sum + o.score, 0) / itemOpinions.length || 0;
    const buyIntentPercent =
      (itemOpinions.filter((o) => o.wouldBuy).length / itemOpinions.length) * 100 || 0;

    // Find top personas (score >= 7)
    const topPersonaIds = itemOpinions
      .filter((o) => o.score >= 7)
      .map((o) => o.personaId);
    const topPersonas = personas
      .filter((p) => topPersonaIds.includes(p.id))
      .map((p) => p.name);

    // Calculate risk based on score variance and buy intent
    let riskLevel: 'low' | 'medium' | 'high';
    if (avgScore >= 7 && buyIntentPercent >= 60) {
      riskLevel = 'low';
    } else if (avgScore >= 5 && buyIntentPercent >= 40) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'high';
    }

    return {
      itemId: item.id,
      averageScore: Math.round(avgScore * 10) / 10,
      buyIntentPercent: Math.round(buyIntentPercent),
      topPersonas,
      riskLevel,
    };
  });
}

function calculateRankings(items: ClothingItem[], opinions: PersonaOpinion[]): RankedItem[] {
  const ranked = items.map((item) => {
    const itemOpinions = opinions.filter((o) => o.itemId === item.id);
    const avgScore =
      itemOpinions.reduce((sum, o) => sum + o.score, 0) / itemOpinions.length || 0;
    const buyIntent =
      (itemOpinions.filter((o) => o.wouldBuy).length / itemOpinions.length) * 100 || 0;

    return {
      item,
      rank: 0,
      avgScore: Math.round(avgScore * 10) / 10,
      buyIntent: Math.round(buyIntent),
      opinions: itemOpinions,
    };
  });

  // Sort by avgScore, then by buyIntent
  ranked.sort((a, b) => {
    if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
    return b.buyIntent - a.buyIntent;
  });

  // Assign ranks
  ranked.forEach((r, i) => (r.rank = i + 1));

  return ranked;
}

function generateRecommendations(
  rankings: RankedItem[],
  forecasts: DemandForecast[],
  personas: Persona[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Highlight top performers
  const topItems = rankings.filter((r) => r.avgScore >= 7);
  if (topItems.length > 0) {
    recommendations.push({
      type: 'highlight',
      title: 'Strong Performers',
      description: `${topItems.length} item(s) scored 7+ across personas. These have broad appeal and lower production risk.`,
      itemIds: topItems.map((r) => r.item.id),
    });
  }

  // Warning for low performers
  const lowItems = rankings.filter((r) => r.avgScore < 5);
  if (lowItems.length > 0) {
    recommendations.push({
      type: 'warning',
      title: 'Reconsider These',
      description: `${lowItems.length} item(s) scored below 5. Consider limited production runs or design revisions.`,
      itemIds: lowItems.map((r) => r.item.id),
    });
  }

  // Opportunity: items loved by specific generations
  const genZForecasts = forecasts.filter((f) => {
    const genZPersonaIds = personas
      .filter((p) => p.generation === 'Gen Z')
      .map((p) => p.id);
    return f.topPersonas.some((name) =>
      personas.find((p) => p.name === name && genZPersonaIds.includes(p.id))
    );
  });

  if (genZForecasts.length > 0) {
    recommendations.push({
      type: 'opportunity',
      title: 'Gen Z Favorites',
      description: `${genZForecasts.length} item(s) resonated strongly with Gen Z. Consider social media marketing focus.`,
      itemIds: genZForecasts.map((f) => f.itemId),
    });
  }

  // Polarizing items (high variance in scores)
  rankings.forEach((r) => {
    const scores = r.opinions.map((o) => o.score);
    if (scores.length > 1) {
      const variance =
        scores.reduce((sum, s) => sum + Math.pow(s - r.avgScore, 2), 0) / scores.length;
      if (variance > 6) {
        recommendations.push({
          type: 'opportunity',
          title: 'Polarizing Piece',
          description: `"${r.item.analysis?.description || 'This item'}" has divided opinions. Could be a niche hit or marketing challenge.`,
          itemIds: [r.item.id],
        });
      }
    }
  });

  return recommendations;
}

export function calculateOverviewStats(result: SimulationResult) {
  const topItem = result.rankings[0];
  const avgScore =
    result.rankings.reduce((sum, r) => sum + r.avgScore, 0) / result.rankings.length || 0;
  const avgBuyIntent =
    result.rankings.reduce((sum, r) => sum + r.buyIntent, 0) / result.rankings.length || 0;

  return {
    topItem,
    avgScore: Math.round(avgScore * 10) / 10,
    avgBuyIntent: Math.round(avgBuyIntent),
    totalItems: result.items.length,
    totalPersonas: result.personas.length,
    totalOpinions: result.opinions.length,
  };
}
