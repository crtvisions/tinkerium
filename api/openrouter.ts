import type { VercelRequest, VercelResponse } from '@vercel/node';
import { 
  getOpenRouterConfig, 
  callOpenRouter, 
  parseRequestBody,
  type ChatMessage 
} from '../shared/api-utils';

interface ChatPayload {
  model: string;
  temperature?: number;
  messages: ChatMessage[];
  max_tokens?: number;
}

/**
 * Generic OpenRouter chat completion endpoint
 * Accepts a model, temperature, and messages array
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const config = getOpenRouterConfig();
    const payload = parseRequestBody<ChatPayload>(req.body);

    const {
      model = 'openai/gpt-4o-mini',
      temperature = 0.6,
      messages,
      max_tokens = 4096
    } = payload as ChatPayload;

    if (!model || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid request: model and messages array required' 
      });
    }

    const data = await callOpenRouter(
      { model, temperature, messages, max_tokens },
      config
    );

    return res.status(200).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const statusCode = message.includes('Missing OPENROUTER_API_KEY') ? 500 : 502;
    return res.status(statusCode).json({ error: message });
  }
}
