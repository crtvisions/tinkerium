import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AI_STYLE_PRESETS, DEFAULT_AI_MODEL } from '../shared/ai-styles';
import { 
  getOpenRouterConfig, 
  callOpenRouter, 
  parseRequestBody,
  stripMarkdownCodeBlocks 
} from '../shared/api-utils';

interface GenerateRequestBody {
  prompt: string;
  temperature?: number;
}

/**
 * AI code generation endpoint
 * Generates HTML/CSS/JS animations from simple prompts
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const config = getOpenRouterConfig();
    const payload = parseRequestBody<GenerateRequestBody>(req.body);
    const { prompt, temperature = 0.8 } = payload as GenerateRequestBody;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Missing or invalid prompt' });
    }

    // Always use the single animation-pro style
    const style = AI_STYLE_PRESETS[0];
    if (!style) {
      return res.status(500).json({ error: 'AI style configuration not found' });
    }

    // Build the user prompt by replacing placeholder
    const userContent = style.promptScaffold 
      ? style.promptScaffold.replace('{{USER_PROMPT}}', prompt.trim())
      : prompt.trim();

    console.log('Generating animation for prompt:', prompt);
    console.log('Using model:', DEFAULT_AI_MODEL);

    // Call OpenRouter API
    const data = await callOpenRouter(
      {
        model: DEFAULT_AI_MODEL,
        temperature,
        max_tokens: 8192,
        messages: [
          { role: 'system', content: style.systemPrompt },
          { role: 'user', content: userContent }
        ]
      },
      config
    );

    // Extract and parse AI response
    const aiResponse = data.choices?.[0]?.message?.content;
    if (!aiResponse) {
      return res.status(500).json({ error: 'No content in AI response' });
    }

    console.log('Received AI response, parsing...');

    // Strip markdown wrappers and parse JSON
    const jsonString = stripMarkdownCodeBlocks(aiResponse);
    const parsedCode = JSON.parse(jsonString);

    // Validate the response structure
    if (!parsedCode.html || !parsedCode.css || !parsedCode.js) {
      console.error('Invalid response structure:', parsedCode);
      throw new Error('AI response is missing required fields (html, css, or js)');
    }

    console.log('Successfully generated animation code');
    return res.status(200).json(parsedCode);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Generation error:', message);
    
    const statusCode = message.includes('Missing OPENROUTER_API_KEY') ? 500 : 502;
    
    return res.status(statusCode).json({ 
      error: message,
      details: error instanceof Error ? error.stack : undefined
    });
  }
}