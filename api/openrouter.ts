interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatPayload {
  model: string;
  temperature?: number;
  messages: ChatMessage[];
}

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENROUTER_API_KEY environment variable' });
  }

  let payload: Partial<ChatPayload> = {};
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
  } catch (error) {
    return res.status(400).json({ error: 'Request body must be valid JSON.' });
  }

  const {
    model = 'openai/gpt-4o-mini',
    temperature = 0.6,
    messages
  } = payload as ChatPayload;

  if (!model || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid request payload' });
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Referer': process.env.OPENROUTER_SITE_URL ?? 'https://tinkerium.vercel.app',
        'X-Title': 'Tinkerium Code-to-MP4 AI Assistant',
        'User-Agent': 'tinkerium-code-to-mp4-ai-assistant'
      },
      body: JSON.stringify({
        model,
        temperature,
        messages,
        max_tokens: 4096
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = typeof data?.error === 'string' ? data.error : 'OpenRouter request failed';
      return res.status(response.status).json({ error: errorMessage });
    }

    return res.status(200).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(502).json({ error: message });
  }
}
