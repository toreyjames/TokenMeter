// Pricing per 1 million tokens (in USD)
// Last updated: January 2026
export const PRICING: Record<string, Record<string, { input: number; output: number }>> = {
  openai: {
    // GPT-4o family
    'gpt-4o': { input: 2.50, output: 10.00 },
    'gpt-4o-2024-11-20': { input: 2.50, output: 10.00 },
    'gpt-4o-2024-08-06': { input: 2.50, output: 10.00 },
    'gpt-4o-mini': { input: 0.15, output: 0.60 },
    'gpt-4o-mini-2024-07-18': { input: 0.15, output: 0.60 },
    
    // GPT-4 Turbo
    'gpt-4-turbo': { input: 10.00, output: 30.00 },
    'gpt-4-turbo-preview': { input: 10.00, output: 30.00 },
    'gpt-4-turbo-2024-04-09': { input: 10.00, output: 30.00 },
    
    // GPT-4
    'gpt-4': { input: 30.00, output: 60.00 },
    'gpt-4-0613': { input: 30.00, output: 60.00 },
    
    // GPT-3.5 Turbo
    'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
    'gpt-3.5-turbo-0125': { input: 0.50, output: 1.50 },
    'gpt-3.5-turbo-instruct': { input: 1.50, output: 2.00 },
    
    // o1 reasoning models
    'o1': { input: 15.00, output: 60.00 },
    'o1-preview': { input: 15.00, output: 60.00 },
    'o1-mini': { input: 3.00, output: 12.00 },
    
    // Embeddings
    'text-embedding-3-small': { input: 0.02, output: 0 },
    'text-embedding-3-large': { input: 0.13, output: 0 },
    'text-embedding-ada-002': { input: 0.10, output: 0 },
  },
  
  anthropic: {
    // Claude 3.5 family
    'claude-3-5-sonnet-20241022': { input: 3.00, output: 15.00 },
    'claude-3-5-sonnet-latest': { input: 3.00, output: 15.00 },
    'claude-3-5-haiku-20241022': { input: 0.80, output: 4.00 },
    'claude-3-5-haiku-latest': { input: 0.80, output: 4.00 },
    
    // Claude 3 family
    'claude-3-opus-20240229': { input: 15.00, output: 75.00 },
    'claude-3-opus-latest': { input: 15.00, output: 75.00 },
    'claude-3-sonnet-20240229': { input: 3.00, output: 15.00 },
    'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
    
    // Claude 4
    'claude-sonnet-4-20250514': { input: 3.00, output: 15.00 },
    'claude-4-sonnet': { input: 3.00, output: 15.00 },
  },

  gemini: {
    // Gemini 2.0
    'gemini-2.0-flash': { input: 0.10, output: 0.40 },
    'gemini-2.0-flash-exp': { input: 0.10, output: 0.40 },
    'gemini-2.0-flash-thinking-exp': { input: 0.10, output: 0.40 },
    
    // Gemini 1.5
    'gemini-1.5-pro': { input: 1.25, output: 5.00 },
    'gemini-1.5-pro-latest': { input: 1.25, output: 5.00 },
    'gemini-1.5-flash': { input: 0.075, output: 0.30 },
    'gemini-1.5-flash-latest': { input: 0.075, output: 0.30 },
    'gemini-1.5-flash-8b': { input: 0.0375, output: 0.15 },
    
    // Gemini 1.0
    'gemini-1.0-pro': { input: 0.50, output: 1.50 },
    'gemini-pro': { input: 0.50, output: 1.50 },
    
    // Embeddings
    'text-embedding-004': { input: 0.00, output: 0 },
  },

  grok: {
    // Grok 2
    'grok-2': { input: 2.00, output: 10.00 },
    'grok-2-latest': { input: 2.00, output: 10.00 },
    'grok-2-1212': { input: 2.00, output: 10.00 },
    
    // Grok 2 Mini (vision capable)
    'grok-2-vision': { input: 2.00, output: 10.00 },
    'grok-2-vision-1212': { input: 2.00, output: 10.00 },
    
    // Grok Beta
    'grok-beta': { input: 5.00, output: 15.00 },
    'grok-vision-beta': { input: 5.00, output: 15.00 },
  },

  mistral: {
    // Premier models
    'mistral-large-latest': { input: 2.00, output: 6.00 },
    'mistral-large-2411': { input: 2.00, output: 6.00 },
    'pixtral-large-latest': { input: 2.00, output: 6.00 },
    
    // Coding
    'codestral-latest': { input: 0.20, output: 0.60 },
    'codestral-2405': { input: 0.20, output: 0.60 },
    
    // Free tier
    'mistral-small-latest': { input: 0.20, output: 0.60 },
    'mistral-small-2409': { input: 0.20, output: 0.60 },
    'pixtral-12b-2409': { input: 0.15, output: 0.15 },
    
    // Open source
    'open-mistral-7b': { input: 0.25, output: 0.25 },
    'open-mixtral-8x7b': { input: 0.70, output: 0.70 },
    'open-mixtral-8x22b': { input: 2.00, output: 6.00 },
    
    // Embeddings
    'mistral-embed': { input: 0.10, output: 0 },
  },

  groq: {
    // Llama 3.3
    'llama-3.3-70b-versatile': { input: 0.59, output: 0.79 },
    'llama-3.3-70b-specdec': { input: 0.59, output: 0.99 },
    
    // Llama 3.2 (vision)
    'llama-3.2-90b-vision-preview': { input: 0.90, output: 0.90 },
    'llama-3.2-11b-vision-preview': { input: 0.18, output: 0.18 },
    
    // Llama 3.1
    'llama-3.1-70b-versatile': { input: 0.59, output: 0.79 },
    'llama-3.1-8b-instant': { input: 0.05, output: 0.08 },
    
    // Llama 3
    'llama3-70b-8192': { input: 0.59, output: 0.79 },
    'llama3-8b-8192': { input: 0.05, output: 0.08 },
    
    // Mixtral
    'mixtral-8x7b-32768': { input: 0.24, output: 0.24 },
    
    // Gemma
    'gemma2-9b-it': { input: 0.20, output: 0.20 },
    'gemma-7b-it': { input: 0.07, output: 0.07 },
  },
};

// Model name normalization (handle aliases)
const MODEL_ALIASES: Record<string, string> = {
  'claude-3-5-sonnet': 'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku': 'claude-3-5-haiku-20241022',
  'claude-3-opus': 'claude-3-opus-20240229',
  'claude-3-sonnet': 'claude-3-sonnet-20240229',
  'claude-3-haiku': 'claude-3-haiku-20240307',
};

export function normalizeModelName(model: string): string {
  return MODEL_ALIASES[model] || model;
}

/**
 * Calculate cost in cents for a given request
 */
export function calculateCost(
  provider: string,
  model: string,
  tokens: { input: number; output: number }
): number {
  const normalizedModel = normalizeModelName(model);
  const providerPricing = PRICING[provider];
  
  if (!providerPricing) {
    console.warn(`Unknown provider: ${provider}`);
    return 0;
  }
  
  const prices = providerPricing[normalizedModel];
  
  if (!prices) {
    // Try to find a partial match
    const partialMatch = Object.keys(providerPricing).find(key => 
      normalizedModel.includes(key) || key.includes(normalizedModel)
    );
    
    if (partialMatch) {
      const matchedPrices = providerPricing[partialMatch];
      const inputCost = (tokens.input / 1_000_000) * matchedPrices.input;
      const outputCost = (tokens.output / 1_000_000) * matchedPrices.output;
      return Math.round((inputCost + outputCost) * 100);
    }
    
    console.warn(`Unknown model: ${provider}/${normalizedModel}`);
    return 0;
  }
  
  const inputCost = (tokens.input / 1_000_000) * prices.input;
  const outputCost = (tokens.output / 1_000_000) * prices.output;
  
  // Return cost in cents (rounded to nearest cent)
  return Math.round((inputCost + outputCost) * 100);
}

/**
 * Get human-readable cost string
 */
export function formatCost(cents: number): string {
  if (cents < 1) {
    return '<$0.01';
  }
  if (cents < 100) {
    return `$0.${cents.toString().padStart(2, '0')}`;
  }
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Suggest a cheaper alternative model
 */
export function suggestCheaperModel(
  provider: string,
  currentModel: string
): { model: string; savingsPercent: number } | null {
  const suggestions: Record<string, { alternative: string; savingsPercent: number }> = {
    // OpenAI suggestions
    'gpt-4o': { alternative: 'gpt-4o-mini', savingsPercent: 94 },
    'gpt-4-turbo': { alternative: 'gpt-4o-mini', savingsPercent: 98 },
    'gpt-4': { alternative: 'gpt-4o', savingsPercent: 83 },
    'o1': { alternative: 'o1-mini', savingsPercent: 80 },
    
    // Anthropic suggestions
    'claude-3-opus-20240229': { alternative: 'claude-3-5-sonnet-20241022', savingsPercent: 80 },
    'claude-3-5-sonnet-20241022': { alternative: 'claude-3-5-haiku-20241022', savingsPercent: 73 },
    'claude-3-sonnet-20240229': { alternative: 'claude-3-5-haiku-20241022', savingsPercent: 73 },
    
    // Gemini suggestions
    'gemini-1.5-pro': { alternative: 'gemini-1.5-flash', savingsPercent: 94 },
    'gemini-1.5-pro-latest': { alternative: 'gemini-1.5-flash', savingsPercent: 94 },
    'gemini-1.5-flash': { alternative: 'gemini-1.5-flash-8b', savingsPercent: 50 },
    
    // Grok suggestions
    'grok-2': { alternative: 'grok-beta', savingsPercent: 0 }, // grok-2 is actually cheaper
    'grok-beta': { alternative: 'grok-2', savingsPercent: 60 },
    
    // Mistral suggestions
    'mistral-large-latest': { alternative: 'mistral-small-latest', savingsPercent: 90 },
    'codestral-latest': { alternative: 'mistral-small-latest', savingsPercent: 0 },
    
    // Groq suggestions
    'llama-3.3-70b-versatile': { alternative: 'llama-3.1-8b-instant', savingsPercent: 91 },
    'llama-3.1-70b-versatile': { alternative: 'llama-3.1-8b-instant', savingsPercent: 91 },
    'llama3-70b-8192': { alternative: 'llama3-8b-8192', savingsPercent: 91 },
  };
  
  const normalizedModel = normalizeModelName(currentModel);
  const suggestion = suggestions[normalizedModel];
  
  if (suggestion) {
    return {
      model: suggestion.alternative,
      savingsPercent: suggestion.savingsPercent,
    };
  }
  
  return null;
}
