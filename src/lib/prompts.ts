import { ClothingItem, Persona } from '@/types';

export const clothingAnalysisPrompt = `You are a fashion analyst. Analyze this clothing item image and provide a detailed assessment.

Return your analysis as a JSON object with these exact fields:
{
  "category": "string (e.g., 'Top', 'Bottom', 'Dress', 'Outerwear', 'Accessory')",
  "style": ["array of style descriptors (e.g., 'minimalist', 'streetwear', 'bohemian')"],
  "colors": ["array of primary colors"],
  "priceRange": "string (e.g., '$50-100', '$100-200', '$200+')",
  "description": "brief description of the item",
  "material": "estimated material (e.g., 'cotton', 'polyester blend', 'wool')",
  "occasion": ["array of suitable occasions (e.g., 'casual', 'work', 'evening')"]
}

Be specific and accurate. Only return valid JSON, no other text.`;

export const generatePersonaPrompt = (persona: Persona, items: ClothingItem[]): string => {
  const itemDescriptions = items
    .map((item, i) => {
      const analysis = item.analysis;
      if (!analysis) return `Item ${i + 1}: [No analysis available]`;
      return `Item ${i + 1} (ID: ${item.id}):
  - Category: ${analysis.category}
  - Style: ${analysis.style.join(', ')}
  - Colors: ${analysis.colors.join(', ')}
  - Price Range: ${analysis.priceRange}
  - Description: ${analysis.description}
  - Material: ${analysis.material || 'Unknown'}
  - Occasion: ${analysis.occasion?.join(', ') || 'Various'}`;
    })
    .join('\n\n');

  return `You are ${persona.name}, a ${persona.generation} consumer with a ${persona.style} fashion sense.

YOUR PROFILE:
- Style Identity: ${persona.style}
- Key Hook: ${persona.hook}
- Traits: ${persona.traits.join(', ')}
- Shopping Priorities: ${persona.priorities.join(', ')}
- Things You Dislike: ${persona.dislikes.join(', ')}

CLOTHING COLLECTION TO EVALUATE:
${itemDescriptions}

For EACH item, provide your honest opinion as ${persona.name} would give it. Be authentic to your character - if you love something, be enthusiastic. If you hate it, be real about why.

Return a JSON array with one object per item:
[
  {
    "itemId": "the item's ID",
    "score": number 1-10,
    "wouldBuy": true/false,
    "priceWilling": "the max price you'd pay (e.g., '$45', '$0 - wouldn't buy')",
    "opinion": "your gut reaction in 1-2 sentences - be spicy and in-character",
    "reasoning": "2-3 sentences explaining your score based on your priorities"
  }
]

Stay in character! Your opinions should clearly reflect your ${persona.style} style preferences and ${persona.generation} perspective.

Only return valid JSON array, no other text.`;
};

export const loadingQuotes: Record<string, string[]> = {
  'maya-chen': [
    'Maya is checking the sustainability certifications...',
    'Maya is imagining this in her capsule wardrobe...',
    'Maya is mentally calculating the cost-per-wear...',
  ],
  'jordan-williams': [
    'Jordan is checking StockX prices...',
    'Jordan is evaluating the hype potential...',
    'Jordan is analyzing the brand heritage...',
  ],
  'chloe-dubois': [
    'Chloe is imagining the TikTok outfit video...',
    'Chloe is checking if this is giving Y2K...',
    'Chloe is calculating viral potential...',
  ],
  'marcus-thompson': [
    'Marcus is testing if this works on Zoom...',
    'Marcus is checking the wrinkle resistance...',
    'Marcus is evaluating couch-to-meeting versatility...',
  ],
  'sofia-rodriguez': [
    'Sofia is feeling the fabric in her mind...',
    'Sofia is checking for synthetic materials...',
    'Sofia is sensing the artisan craftsmanship...',
  ],
  'tyler-kim': [
    'Tyler is counting the pockets...',
    'Tyler is evaluating weather resistance...',
    'Tyler is checking functionality specs...',
  ],
  'emma-johnson': [
    'Emma is calculating 10-year wearability...',
    'Emma is inspecting the construction quality...',
    'Emma is evaluating investment potential...',
  ],
  'alex-rivera': [
    'Alex is planning unexpected styling combos...',
    'Alex is checking the thrift-ability factor...',
    'Alex is imagining gender-neutral outfits...',
  ],
};

export const getRandomQuote = (personaId: string): string => {
  const quotes = loadingQuotes[personaId] || ['Analyzing...'];
  return quotes[Math.floor(Math.random() * quotes.length)];
};
