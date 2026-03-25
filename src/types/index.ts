export interface ClothingItem {
  id: string;
  url: string;
  filename: string;
  analysis?: ClothingAnalysis;
}

export interface ClothingAnalysis {
  category: string;
  style: string[];
  colors: string[];
  priceRange: string;
  description: string;
  material?: string;
  occasion?: string[];
}

export interface Persona {
  id: string;
  name: string;
  avatar: string;
  generation: 'Gen Z' | 'Millennial' | 'Gen X';
  style: string;
  hook: string;
  traits: string[];
  priorities: string[];
  dislikes: string[];
}

export interface PersonaOpinion {
  personaId: string;
  itemId: string;
  score: number; // 1-10
  wouldBuy: boolean;
  priceWilling: string;
  opinion: string;
  reasoning: string;
}

export interface DemandForecast {
  itemId: string;
  averageScore: number;
  buyIntentPercent: number;
  topPersonas: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface RankedItem {
  item: ClothingItem;
  rank: number;
  avgScore: number;
  buyIntent: number;
  opinions: PersonaOpinion[];
}

export interface Recommendation {
  type: 'highlight' | 'warning' | 'opportunity';
  title: string;
  description: string;
  itemIds?: string[];
}

export interface SimulationResult {
  id: string;
  timestamp: Date;
  items: ClothingItem[];
  personas: Persona[];
  opinions: PersonaOpinion[];
  forecasts: DemandForecast[];
  rankings: RankedItem[];
  recommendations: Recommendation[];
}

export interface SimulationState {
  items: ClothingItem[];
  selectedPersonas: string[];
  isAnalyzing: boolean;
  isSimulating: boolean;
  currentStep: 'upload' | 'configure' | 'simulating' | 'results';
  result: SimulationResult | null;
  progress: {
    current: number;
    total: number;
    message: string;
  };
}
