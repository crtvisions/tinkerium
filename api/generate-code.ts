import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AI_STYLE_PRESETS, DEFAULT_AI_MODEL } from '../tools/code-to-mp4/src/constants';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface GenerateRequestBody {
  prompt: string;
  styleId: string;
  temperature?: number;
}

const getRequestBody = (body: unknown): Partial<GenerateRequestBody> => {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body as Record<string, unknown>;
};

const buildUserContent = (basePrompt: string, scaffold?: string) => {
  if (!scaffold) return basePrompt;
  return `${scaffold}\n\n${basePrompt}`;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('=== New Request ===');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Query:', req.query);
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  console.log('OpenRouter API Key:', apiKey ? '*** (exists)' : 'MISSING!');
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENROUTER_API_KEY environment variable' });
  }

  console.log('Raw request body:', req.body);
  const payload = getRequestBody(req.body);
  console.log('Parsed payload:', payload);
  
  const { prompt, styleId, temperature = 0.6 } = payload as GenerateRequestBody;
  console.log('Extracted values:', { prompt: prompt?.substring(0, 50) + '...', styleId, temperature });

  const referer = process.env.OPENROUTER_SITE_URL && /^https?:\/\//.test(process.env.OPENROUTER_SITE_URL)
    ? process.env.OPENROUTER_SITE_URL
    : 'https://tinkerium.vercel.app';

  const userAgent = process.env.OPENROUTER_USER_AGENT ?? 'tinkerium-code-to-mp4/1.0 (https://tinkerium.vercel.app/contact)';

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  if (!styleId || typeof styleId !== 'string') {
    return res.status(400).json({ error: 'Missing styleId' });
  }

  console.log('Looking for style:', styleId);
  const style = AI_STYLE_PRESETS.find((preset) => preset.id === styleId);
  console.log('Found style:', style ? style.id : 'NOT FOUND');
  if (!style) {
    return res.status(400).json({ error: 'Invalid styleId' });
  }

  try {
    const userContent = buildUserContent(prompt, style.promptScaffold);
    console.log('Sending request to OpenRouter...');
    console.log('Request URL:', OPENROUTER_URL);
    console.log('Request body:', JSON.stringify({
      model: DEFAULT_AI_MODEL,
      temperature,
      messages: [
        { role: 'system', content: style.systemPrompt.substring(0, 100) + '...' },
        { role: 'user', content: userContent.substring(0, 100) + '...' }
      ]
    }, null, 2));

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Referer: referer,
        'X-Title': 'Tinkerium Code-to-MP4 AI Assistant',
        'User-Agent': userAgent
      },
      body: JSON.stringify({
        model: DEFAULT_AI_MODEL,
        temperature,
        messages: [
          { role: 'system', content: style.systemPrompt },
          { role: 'user', content: userContent }
        ]
      })
    });

    console.log('OpenRouter response status:', response.status);
    const data = await response.json().catch(err => {
      console.error('Failed to parse JSON response:', err);
      throw new Error('Invalid JSON response from OpenRouter');
    });
    
    console.log('OpenRouter response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      const errorMessage = typeof data?.error === 'string' ? data.error : 'OpenRouter request failed';
      return res.status(response.status).json({ error: errorMessage });
    }

    // Extract the AI's response content
    const aiResponse = data.choices?.[0]?.message?.content;
    console.log('AI Response (first 200 chars):', aiResponse?.substring(0, 200) + '...');
    if (!aiResponse) {
      return res.status(500).json({ error: 'No content in AI response' });
    }

    try {
      // Remove markdown code block wrappers if present
      let jsonString = aiResponse.trim();
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.slice(jsonString.indexOf('{'), jsonString.lastIndexOf('}') + 1);
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.slice(jsonString.indexOf('\n') + 1, jsonString.lastIndexOf('```'));
      }

      // Parse the JSON response
      const parsedCode = JSON.parse(jsonString);

      // Validate the response structure
      if (!parsedCode.html || !parsedCode.css || !parsedCode.js) {
        throw new Error('AI response is missing required fields (html, css, or js)');
      }

      return res.status(200).json(parsedCode);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return res.status(500).json({ 
        error: 'Failed to parse AI response',
        details: error instanceof Error ? error.message : 'Unknown error',
        originalResponse: aiResponse
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(502).json({ error: message });
  }
}