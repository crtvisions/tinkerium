import type { Filters, AIStylePreset } from './types';

export const DEFAULT_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TYPE YOUR CODE - VHS</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #000;
            overflow: hidden;
            font-family: 'Press Start 2P', cursive; /* A retro pixel font */
        }
        canvas {
            display: block;
            background-color: #050510; /* Very dark blue */
            max-width: 100%;
            border: 2px solid #202040;
            box-shadow: 0 0 30px rgba(0,255,0,0.2), inset 0 0 10px rgba(0,255,0,0.1);
        }
        /* Import a retro font for better effect if available */
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    </style>
</head>
<body>
    <canvas id="vhs-canvas"></canvas>

    <script>
        /**
         * A JavaScript and HTML Canvas animation displaying "TYPE YOUR CODE"
         * with a strong retro VHS aesthetic.
         *
         * Key Features:
         * - Text with a flickering, glitched appearance.
         * - Chromatic aberration (RGB splitting) effect on the text.
         * - Animated scan lines and static/noise overlay.
         * - Vertical screen jitter and horizontal displacement to simulate a worn tape.
         * - Pulsating glow around the text.
         */
        const canvas = document.getElementById('vhs-canvas');
        const ctx = canvas.getContext('2d');

        let width = 960;
        let height = 540; // 16:9 aspect ratio

        let frameCount = 0;
        const text = "TYPE YOUR CODE";
        const fontSize = 70; // Adjust based on canvas size
        const charWidth = fontSize * 0.6; // Approximate width of a character

        function resizeCanvas() {
            const aspectRatio = width / height;
            const newWidth = Math.min(window.innerWidth * 0.9, width);
            const newHeight = newWidth / aspectRatio;
            canvas.width = newWidth;
            canvas.height = newHeight;
        }

        function drawText(scale, frame) {
            ctx.save();
            // Text color base
            const baseColor = \`rgb(0, 255, 0)\`; // Green
            const shadowColor = \`rgba(0, 150, 0, 0.7)\`;

            const textX = canvas.width / 2;
            const textY = canvas.height / 2;

            ctx.font = \`\${fontSize * scale}px 'Press Start 2P', cursive\`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // --- Text Shadow/Glow ---
            const glowIntensity = (Math.sin(frame * 0.05) + 1.5) * 0.5; // Pulsating glow
            ctx.shadowBlur = 15 * scale * glowIntensity;
            ctx.shadowColor = \`rgba(0, 255, 0, \${0.4 * glowIntensity})\`;
            ctx.fillStyle = baseColor;
            ctx.fillText(text, textX, textY);
            ctx.shadowBlur = 0; // Reset shadow for main text

            // --- Glitch Effect (random character displacement/flicker) ---
            const glitchFactor = 0.5; // How often glitches occur
            if (Math.random() < glitchFactor) {
                const charIndex = Math.floor(Math.random() * text.length);
                const char = text[charIndex];
                const charOffset = (charIndex - text.length / 2 + 0.5) * charWidth * scale;
                const glitchShiftX = (Math.random() - 0.5) * 15 * scale;
                const glitchShiftY = (Math.random() - 0.5) * 10 * scale;

                ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
                ctx.fillText(char, textX + charOffset + glitchShiftX, textY + glitchShiftY);
            }

            // --- Chromatic Aberration (RGB split) ---
            ctx.globalCompositeOperation = 'lighter';
            
            const abFactor = (Math.sin(frame * 0.03) + 1) * 0.5; // Pulsating aberration
            const abOffset = 3 * scale * abFactor;

            // Red channel
            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.fillText(text, textX - abOffset, textY);
            
            // Blue channel
            ctx.fillStyle = 'rgba(0, 0, 255, 0.7)';
            ctx.fillText(text, textX + abOffset, textY);

            ctx.globalCompositeOperation = 'source-over'; // Reset blend mode
            ctx.restore();
        }

        function drawVhsEffects(scale, frame) {
            // Scan Lines
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Darker scan lines
            for (let i = 0; i < canvas.height; i += 3 * scale) {
                ctx.fillRect(0, i, canvas.width, 1 * scale);
            }

            // Static/Noise
            ctx.globalAlpha = 0.1;
            for (let i = 0; i < 300; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const size = (Math.random() * 2 + 0.5) * scale;
                ctx.fillStyle = \`rgba(255, 255, 255, \${Math.random() * 0.4})\`;
                ctx.fillRect(x, y, size, size);
            }
            ctx.globalAlpha = 1.0;

            // Horizontal color bands (faint)
            if (frame % 5 === 0) {
                ctx.globalAlpha = 0.05;
                ctx.fillStyle = \`rgb(\${Math.random() * 50}, \${Math.random() * 50}, \${Math.random() * 50})\`;
                ctx.fillRect(0, Math.random() * canvas.height, canvas.width, 5 * scale);
                ctx.globalAlpha = 1.0;
            }
        }

        function animate() {
            const scale = canvas.width / width;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#050510'; // Background color
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // --- Apply global VHS distortions ---
            ctx.save();
            const jitterY = (Math.sin(frameCount * 0.1) * 0.5 + Math.random() * 0.5 - 0.25) * 5 * scale; // Vertical jitter
            const shiftX = (Math.sin(frameCount * 0.05) * 0.5 + Math.random() * 0.5 - 0.25) * 3 * scale; // Horizontal shift
            
            ctx.translate(shiftX, jitterY);

            drawText(scale, frameCount);
            
            ctx.restore(); // Restore context before drawing overlays
            
            drawVhsEffects(scale, frameCount);

            frameCount++;
            requestAnimationFrame(animate);
        }

        // Initial setup and start animation
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    </script>
</body>
</html>`;

export const GIF_SETTINGS = {
    FPS: 24,
    DURATION_SECONDS: 3,
    DEFAULT_WIDTH: 500,
    DEFAULT_HEIGHT: 350,
    QUALITY: 10,
};

export const initialFilters: Filters = { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, invert: 0 };

export const AI_STYLE_PRESETS: AIStylePreset[] = [
    {
        id: 'tokyo-night',
        label: 'Tokyo Night Neon',
        description: 'High-contrast neon blues and pinks on a deep navy background with subtle grid glows.',
        systemPrompt: 'You are an expert front-end developer specializing in futuristic neon interfaces. Generate accessible HTML, CSS, and JavaScript without external dependencies. Your response MUST be a valid JSON object with exactly these three properties: "html" (string), "css" (string), and "js" (string). Do not include any markdown code blocks or additional text.',
        promptScaffold: 'Create a responsive layout with glowing borders, subtle animated gradients, and legible monospace typography. Use background colors around #0f172a, accents near #7aa2f7 and #f7768e. Ensure animations are performant and respect prefers-reduced-motion. Return ONLY a JSON object with html, css, and js properties - no other text or markdown.',
    },
    {
        id: 'retro-crt',
        label: 'Retro CRT',
        description: 'Classic 80s CRT display with scanlines, phosphor glow, and chunky pixels.',
        systemPrompt: 'You are an expert interface engineer creating authentic CRT-era aesthetics. Generate HTML, CSS, and JavaScript that feel like a vintage terminal or arcade cabinet. Your response MUST be a valid JSON object with exactly these three properties: "html" (string), "css" (string), and "js" (string). Do not include any markdown code blocks or additional text.',
        promptScaffold: 'Use deep blacks with lime green or amber text, add scanline overlays, and emulate chromatic aberration. Favor blocky pixel fonts, rounded CRT corners, and animations. Return ONLY a JSON object with html, css, and js properties - no other text or markdown.',
    },
    {
        id: 'minimal-elegance',
        label: 'Minimal Elegance',
        description: 'Calm, airy design with soft gradients, generous whitespace, and tasteful micro-interactions.',
        systemPrompt: 'You are a senior product designer crafting clean, minimal experiences. Generate HTML, CSS, and JavaScript that feel premium and modern. Your response MUST be a valid JSON object with exactly these three properties: "html" (string), "css" (string), and "js" (string). Do not include any markdown code blocks or additional text.',
        promptScaffold: 'Apply a neutral light background, subtle shadows, rounded corners, and calm motion. Use a warm accent color sparingly. Make the layout responsive with balanced spacing. Return ONLY a JSON object with html, css, and js properties - no other text or markdown.',
    },
];

export const DEFAULT_AI_MODEL = 'openai/gpt-4o-mini';
