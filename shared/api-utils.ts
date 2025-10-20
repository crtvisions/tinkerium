/**
 * Shared utilities for API handlers
 */

export interface OpenRouterConfig {
  apiKey: string;
  siteUrl?: string;
  userAgent?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  temperature?: number;
  messages: ChatMessage[];
  max_tokens?: number;
}

export interface ChatCompletionResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Get OpenRouter configuration from environment variables
 */
export function getOpenRouterConfig(): OpenRouterConfig {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENROUTER_API_KEY environment variable');
  }

  const siteUrl = process.env.OPENROUTER_SITE_URL && /^https?:\/\//.test(process.env.OPENROUTER_SITE_URL)
    ? process.env.OPENROUTER_SITE_URL
    : 'https://tinkerium.vercel.app';

  const userAgent = process.env.OPENROUTER_USER_AGENT ?? 
    'tinkerium/1.0 (https://tinkerium.vercel.app)';

  return { apiKey, siteUrl, userAgent };
}

/**
 * Call OpenRouter chat completion API
 */
export async function callOpenRouter(
  request: ChatCompletionRequest,
  config: OpenRouterConfig
): Promise<ChatCompletionResponse> {
  const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'Referer': config.siteUrl ?? 'https://tinkerium.vercel.app',
      'X-Title': 'Tinkerium AI Assistant',
      'User-Agent': config.userAgent ?? 'tinkerium/1.0'
    },
    body: JSON.stringify(request)
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = typeof data?.error === 'string' 
      ? data.error 
      : data?.error?.message ?? 'OpenRouter request failed';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Parse request body handling both string and object formats
 */
export function parseRequestBody<T>(body: unknown): Partial<T> {
  if (!body) return {} as Partial<T>;
  
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as Partial<T>;
    } catch {
      return {} as Partial<T>;
    }
  }
  
  return body as Partial<T>;
}

/**
 * Strip markdown code block wrappers from AI responses
 */
export function stripMarkdownCodeBlocks(text: string): string {
  let cleaned = text.trim();
  
  // Remove ```json ... ``` blocks
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(cleaned.indexOf('{'), cleaned.lastIndexOf('}') + 1);
  } 
  // Remove generic ``` ... ``` blocks
  else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(cleaned.indexOf('\n') + 1, cleaned.lastIndexOf('```'));
  }
  
  return cleaned.trim();
}
