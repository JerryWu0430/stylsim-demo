import Anthropic from '@anthropic-ai/sdk';
import { ClothingAnalysis, ClothingItem, Persona, PersonaOpinion } from '@/types';
import { clothingAnalysisPrompt, generatePersonaPrompt } from './prompts';
import * as fs from 'fs';
import * as path from 'path';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function getMediaType(filePath: string): 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
}

export async function analyzeClothingImage(imagePath: string): Promise<ClothingAnalysis> {
  const fullPath = path.join(process.cwd(), 'public', imagePath);
  const imageData = fs.readFileSync(fullPath);
  const base64Image = imageData.toString('base64');
  const mediaType = getMediaType(fullPath);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: clothingAnalysisPrompt,
          },
        ],
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  try {
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    return JSON.parse(jsonMatch[0]) as ClothingAnalysis;
  } catch (e) {
    console.error('Failed to parse analysis:', textContent.text);
    throw new Error('Failed to parse clothing analysis');
  }
}

export async function runPersonaSimulation(
  persona: Persona,
  items: ClothingItem[]
): Promise<PersonaOpinion[]> {
  const prompt = generatePersonaPrompt(persona, items);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  try {
    const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found in response');
    const opinions = JSON.parse(jsonMatch[0]) as Array<{
      itemId: string;
      score: number;
      wouldBuy: boolean;
      priceWilling: string;
      opinion: string;
      reasoning: string;
    }>;

    return opinions.map((o) => ({
      ...o,
      personaId: persona.id,
    }));
  } catch (e) {
    console.error('Failed to parse opinions:', textContent.text);
    throw new Error('Failed to parse persona opinions');
  }
}
