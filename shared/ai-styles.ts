/**
 * @file Canvas 2D Animation Generator
 * @description Generate highly detailed, production-quality canvas animations from text prompts.
 */

export interface AIStylePreset {
  id: string;
  label: string;
  description: string;
  systemPrompt: string;
  promptScaffold?: string;
}

export const AI_STYLE_PRESETS: AIStylePreset[] = [
  {
    id: 'animation-pro',
    label: 'Canvas 2D Animation',
    description: 'Highly detailed, production-quality animations',
    systemPrompt: `Generate a highly detailed, production-quality Canvas 2D animation based on the user's prompt.

Return ONLY valid JSON. No markdown, no explanations, no tags, no extra text.

Format:
{
  "html": "<canvas id='c'></canvas>",
  "css": "detailed CSS with animations, effects, and styling",
  "js": "single-line JavaScript string with animation logic"
}

QUALITY REQUIREMENTS (CRITICAL):
- Create HIGHLY DETAILED, visually polished animations
- Use extensive CSS: gradients, shadows, transforms, animations, keyframes
- Add visual effects: glows, blur, opacity changes, color shifts
- Implement smooth JavaScript animations using requestAnimationFrame
- Include multiple animated elements and layers
- Add depth with perspective, 3D transforms, parallax
- Use realistic colors, lighting, and shadows
- Create complex shapes and detailed compositions

TECHNICAL REQUIREMENTS:
- The "js" field must be a single-line string
- Use SINGLE QUOTES in JavaScript code (e.g., getElementById('c'), fillStyle='#000')
- Code must be syntactically correct with no errors
- Canvas size: 960x540
- Animate multiple properties: position, rotation, scale, opacity, color
- Use Math.sin/cos for smooth motion
- Include interactive elements where appropriate

CSS REQUIREMENTS:
- Use modern CSS: flexbox, grid, transforms, transitions
- Add animations with @keyframes
- Include visual effects: box-shadow, filter, backdrop-filter
- Use gradients: linear-gradient, radial-gradient
- Add depth: perspective, transform-style: preserve-3d

Draw only what the prompt describes, but make it EXTREMELY detailed and visually impressive.`,
    promptScaffold: `Create a HIGHLY DETAILED, visually impressive animation: "{{USER_PROMPT}}"

Requirements:
- Extensive CSS with gradients, shadows, transforms, animations
- Smooth JavaScript animations with multiple animated properties
- Complex visual effects and depth
- Multiple layers and elements
- Visually polished and production-quality

Output ONLY JSON:
{"html":"<canvas id='c'></canvas>","css":"...detailed CSS...","js":"...detailed animation code..."}`
  }
];

export const DEFAULT_AI_MODEL = 'openai/gpt-oss-20b';