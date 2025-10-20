import type { Dimensions } from './types';

export function extractAnimationDuration(code: string): number | null {
    // First, look for explicit animation-duration properties
    const durationRegex = /animation(?:-duration)?\s*:\s*[^;}]*?([0-9\.]+)(s|ms)/g;
    let match;
    const durations: number[] = [];
    while ((match = durationRegex.exec(code)) !== null) {
        let value = parseFloat(match[1]);
        if (match[2] === 'ms') value /= 1000;
        durations.push(value);
    }

    // Also look for shorthand animation properties that include duration
    const shorthandRegex = /animation\s*:\s*[^0-9]*([0-9\.]+)(s|ms)/g;
    while ((match = shorthandRegex.exec(code)) !== null) {
        let value = parseFloat(match[1]);
        if (match[2] === 'ms') value /= 1000;
        durations.push(value);
    }

    return durations.length > 0 ? Math.max(...durations) : null;
}

export function extractDimensions(code: string): Dimensions | null {
    // First, try to extract from CSS .scene class
    const sceneRegex = /\.scene\s*\{[^\}]*?width:\s*(\d+)px;[^\}]*?height:\s*(\d+)px;/s;
    let match = code.match(sceneRegex);
    if (match && match[1] && match[2]) {
        return { width: parseInt(match[1], 10), height: parseInt(match[2], 10) };
    }

    // If not found, try to extract from JavaScript canvas dimensions
    // Look for patterns like: let width = 800; let height = 600;
    // or: const width = 800; const height = 600;
    // or: var width = 800; var height = 600;
    const jsWidthRegex = /(?:let|const|var)\s+width\s*=\s*(\d+)/;
    const jsHeightRegex = /(?:let|const|var)\s+height\s*=\s*(\d+)/;
    
    const widthMatch = code.match(jsWidthRegex);
    const heightMatch = code.match(jsHeightRegex);
    
    if (widthMatch && heightMatch) {
        return { width: parseInt(widthMatch[1], 10), height: parseInt(heightMatch[1], 10) };
    }

    // Detect explicit renderer size in Three.js scenes e.g. renderer.setSize(800, 600)
    const rendererSizeRegex = /setSize\(\s*(\d+)\s*,\s*(\d+)\s*\)/;
    match = code.match(rendererSizeRegex);
    if (match && match[1] && match[2]) {
        return { width: parseInt(match[1], 10), height: parseInt(match[2], 10) };
    }

    // Detect canvas width/height attributes set via HTML (e.g. <canvas width="800" height="600">)
    const canvasAttrRegex = /<canvas[^>]*?width\s*=\s*"(\d+)"[^>]*?height\s*=\s*"(\d+)"/i;
    match = code.match(canvasAttrRegex);
    if (match && match[1] && match[2]) {
        return { width: parseInt(match[1], 10), height: parseInt(match[2], 10) };
    }

    return null;
}

export function injectStyleIntoCode(htmlCode: string, style: string, includeAnimationRestart: boolean = false): string {
    const animationRestartScript = includeAnimationRestart ? `
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Force restart all animations
            const animatedElements = document.querySelectorAll('*');
            animatedElements.forEach(el => {
                const computedStyle = window.getComputedStyle(el);
                if (computedStyle.animationName !== 'none' || el.style.animationName) {
                    el.style.animation = 'none';
                    el.offsetHeight; // Force reflow
                    el.style.animation = '';
                }
            });
        });
    </script>` : '';
    
    // Create a unique ID for the style element to enable dynamic updates
    const styleId = 'dynamic-filter-styles';
    
    // Check if style contains full CSS (like VHS effect) or just filter properties
    const styleTag = style.includes('@keyframes') || style.includes('body {')
        ? `<style id="${styleId}">${style}</style>`  // Full CSS block
        : `<style id="${styleId}">body { ${style} }</style>`;  // Simple filter properties
    
    // Add a script to dynamically update styles without reloading the page
    const dynamicStyleScript = `
    <script>
        // Function to update styles without restarting animations
        window.updateFilterStyles = function(styleContent) {
            const styleElement = document.getElementById('${styleId}');
            if (styleElement) {
                const isFullCss = styleContent.includes('@keyframes') || styleContent.includes('body {');
                styleElement.textContent = isFullCss ? styleContent : 'body { ' + styleContent + ' }';
            }
        };
    </script>`;
        
    if (htmlCode.includes('</head>')) {
        return htmlCode.replace('</head>', `${styleTag}${dynamicStyleScript}${animationRestartScript}</head>`);
    }
    return `<html><head>${styleTag}${dynamicStyleScript}${animationRestartScript}</head><body>${htmlCode}</body></html>`;
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
