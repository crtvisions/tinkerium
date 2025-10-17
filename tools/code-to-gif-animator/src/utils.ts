import type { Dimensions } from './types';

export function extractAnimationDuration(code: string): number | null {
    const durationRegex = /animation(?:-duration)?\s*:\s*[^;}]*?([0-9\.]+)(s|ms)/g;
    let match;
    const durations: number[] = [];
    while ((match = durationRegex.exec(code)) !== null) {
        let value = parseFloat(match[1]);
        if (match[2] === 'ms') value /= 1000;
        durations.push(value);
    }
    return durations.length > 0 ? Math.max(...durations) : null;
}

export function extractDimensions(code: string): Dimensions | null {
    const sceneRegex = /\.scene\s*\{[^\}]*?width:\s*(\d+)px;[^\}]*?height:\s*(\d+)px;/s;
    let match = code.match(sceneRegex);
    if (match && match[1] && match[2]) {
        return { width: parseInt(match[1], 10), height: parseInt(match[2], 10) };
    }
    return null;
}

export function injectStyleIntoCode(htmlCode: string, style: string): string {
    const styleTag = `<style>.scene { ${style} }</style>`;
    if (htmlCode.includes('</head>')) {
        return htmlCode.replace('</head>', `${styleTag}</head>`);
    }
    return `<html><head>${styleTag}</head><body>${htmlCode}</body></html>`;
}

export function parseCombinedCode(combinedCode: string): { html: string; css: string; js: string } {
    const cssMatch = combinedCode.match(/<style>([\s\S]*?)<\/style>/);
    const bodyMatch = combinedCode.match(/<body>([\s\S]*?)<\/body>/);
    const jsMatch = combinedCode.match(/<script>([\s\S]*?)<\/script>/);

    const css = cssMatch ? cssMatch[1].trim() : '';
    const html = bodyMatch ? bodyMatch[1].trim() : '';
    const js = jsMatch ? jsMatch[1].trim() : '';

    return { html, css, js };
}

export function buildCombinedCode(html: string, css: string, js: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Animation Preview</title>
    <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            font-family: 'VT323', monospace;
            background: #1a113c; /* Fallback background */
        }
        ${css}
    </style>
</head>
<body>
    ${html}
    ${js ? `<script>${js}</script>` : ''}
</body>
</html>`;
}
