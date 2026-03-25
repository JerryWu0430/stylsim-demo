import { Persona } from '@/types';

export const personas: Persona[] = [
  {
    id: 'maya-chen',
    name: 'Maya Chen',
    avatar: '👩🏻‍💻',
    generation: 'Gen Z',
    style: 'Minimalist',
    hook: 'Sustainability-obsessed capsule wardrobe curator',
    traits: ['eco-conscious', 'quality-over-quantity', 'neutral-palette'],
    priorities: ['sustainable materials', 'versatility', 'timeless design', 'ethical production'],
    dislikes: ['fast fashion', 'synthetic fabrics', 'trendy pieces', 'excessive branding'],
  },
  {
    id: 'jordan-williams',
    name: 'Jordan Williams',
    avatar: '👨🏾‍🎤',
    generation: 'Millennial',
    style: 'Streetwear',
    hook: 'Knows the resale value before you do',
    traits: ['hype-aware', 'collector', 'brand-savvy'],
    priorities: ['limited editions', 'brand heritage', 'resale potential', 'street cred'],
    dislikes: ['basic pieces', 'mass market', 'poor craftsmanship', 'fake collabs'],
  },
  {
    id: 'chloe-dubois',
    name: 'Chloe Dubois',
    avatar: '👱🏻‍♀️',
    generation: 'Gen Z',
    style: 'Y2K Revival',
    hook: 'TikTok trendsetter with 500k followers',
    traits: ['trend-forward', 'bold', 'nostalgic', 'social-media-native'],
    priorities: ['viral potential', 'photo-worthy', 'bold colors', 'retro aesthetics'],
    dislikes: ['boring basics', 'corporate looks', 'anything too "millennial"', 'subtle pieces'],
  },
  {
    id: 'marcus-thompson',
    name: 'Marcus Thompson',
    avatar: '👨🏽‍💼',
    generation: 'Millennial',
    style: 'Smart Casual',
    hook: 'WFH comfort-first but Zoom-ready',
    traits: ['practical', 'comfort-focused', 'polished'],
    priorities: ['comfort', 'versatility', 'wrinkle-free', 'video-call appropriate'],
    dislikes: ['high maintenance', 'restrictive fits', 'dry-clean only', 'overly casual'],
  },
  {
    id: 'sofia-rodriguez',
    name: 'Sofia Rodriguez',
    avatar: '👩🏽‍🎨',
    generation: 'Gen X',
    style: 'Bohemian',
    hook: 'Absolutely hates synthetic materials',
    traits: ['natural-fiber-devotee', 'artisan-appreciator', 'free-spirited'],
    priorities: ['natural materials', 'handcrafted details', 'unique pieces', 'breathability'],
    dislikes: ['polyester', 'synthetic blends', 'mass-produced', 'structured silhouettes'],
  },
  {
    id: 'tyler-kim',
    name: 'Tyler Kim',
    avatar: '🧑🏻‍🔬',
    generation: 'Gen Z',
    style: 'Techwear',
    hook: 'Pockets everywhere or it\'s a no',
    traits: ['function-first', 'futuristic', 'utility-obsessed'],
    priorities: ['functionality', 'weather resistance', 'storage', 'innovative materials'],
    dislikes: ['non-functional design', 'delicate fabrics', 'impractical pieces', 'no pockets'],
  },
  {
    id: 'emma-johnson',
    name: 'Emma Johnson',
    avatar: '👩🏼‍⚖️',
    generation: 'Millennial',
    style: 'Classic',
    hook: 'Only buys investment pieces she\'ll wear for 10+ years',
    traits: ['quality-focused', 'timeless', 'sophisticated'],
    priorities: ['longevity', 'craftsmanship', 'classic silhouettes', 'neutral colors'],
    dislikes: ['trendy pieces', 'poor construction', 'flashy logos', 'seasonal items'],
  },
  {
    id: 'alex-rivera',
    name: 'Alex Rivera',
    avatar: '🧑🏽',
    generation: 'Gen Z',
    style: 'Gender Fluid',
    hook: 'Thrift champion who can style anything',
    traits: ['creative', 'inclusive', 'sustainable', 'experimental'],
    priorities: ['gender-neutral design', 'unique finds', 'mix-and-match potential', 'self-expression'],
    dislikes: ['gendered marketing', 'boring basics', 'rigid sizing', 'conventional styling'],
  },
];

export const getPersonaById = (id: string): Persona | undefined => {
  return personas.find((p) => p.id === id);
};

export const getPersonasByGeneration = (gen: Persona['generation']): Persona[] => {
  return personas.filter((p) => p.generation === gen);
};

export const genZPersonas = personas.filter((p) => p.generation === 'Gen Z');
export const millennialPersonas = personas.filter((p) => p.generation === 'Millennial');
export const genXPersonas = personas.filter((p) => p.generation === 'Gen X');
