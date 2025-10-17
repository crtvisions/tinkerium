import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// --- Constants ---
const DEFAULT_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Retro Lofi Welcome</title>
    <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-top: #1a113c;
            --bg-bottom: #3e2f75;
            --text-color: #ff7ac6;
            --robot-color: #76d1d5;
            --floor-color: #110c29;
        }

        body {
            margin: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(to bottom, var(--bg-top), var(--bg-bottom));
            overflow: hidden;
            font-family: 'VT323', monospace;
        }

        .scene {
            position: relative;
            width: 500px;
            height: 350px;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2), 0 6px 6px rgba(0,0,0,0.2);
            background: var(--bg-top);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        /* Lofi visual effects */
        .scene::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 4px);
            opacity: 0.7;
            pointer-events: none;
            animation: flicker 0.15s infinite;
        }

        .welcome-text {
            color: var(--text-color);
            font-size: 6rem;
            text-align: center;
            margin-bottom: 2rem;
            animation: glow 3s ease-in-out infinite alternate;
            z-index: 2;
        }

        .floor {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 40%;
            background: var(--floor-color);
            z-index: 0;
        }

        .robot-container {
            display: flex;
            position: absolute;
            bottom: 30px;
            z-index: 1;
        }
        
        .robot {
            width: 60px;
            height: 80px;
            margin: 0 20px;
            position: relative;
            animation: dance 2s ease-in-out infinite;
        }

        .robot .head {
            width: 50px;
            height: 40px;
            background: var(--robot-color);
            border-radius: 8px 8px 4px 4px;
            margin: 0 auto;
            position: relative;
        }

        .robot .head::after { /* Eye */
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background: var(--text-color);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--text-color);
        }

        .robot .body {
            width: 60px;
            height: 40px;
            background: var(--robot-color);
            border-radius: 4px;
            margin-top: 5px;
        }

        /* Stagger the animations */
        .robot:nth-child(2) {
            animation-delay: -0.5s;
        }

        .robot:nth-child(3) {
            animation-delay: -1s;
        }

        /* Animations */

        @keyframes flicker {
            0% { opacity: 0.7; }
            50% { opacity: 0.8; }
            100% { opacity: 0.7; }
        }

        @keyframes glow {
            from {
                text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px var(--text-color), 0 0 40px var(--text-color);
            }
            to {
                text-shadow: 0 0 20px #fff, 0 0 30px var(--text-color), 0 0 40px var(--text-color), 0 0 50px var(--text-color);
            }
        }

        @keyframes dance {
            0%, 100% {
                transform: translateY(0) rotate(0);
            }
            25% {
                transform: translateY(-15px) rotate(-5deg);
            }
            75% {
                transform: translateY(0px) rotate(5deg);
            }
        }

    </style>
</head>
<body>
    <div class="scene">
        <div class="welcome-text">WELCOME</div>
        <div class="floor"></div>
        <div class="robot-container">
            <div class="robot">
                <div class="head"></div>
                <div class="body"></div>
            </div>
            <div class="robot">
                <div class="head"></div>
                <div class="body"></div>
            </div>
            <div class="robot">
                <div class="head"></div>
                <div class="body"></div>
            </div>
        </div>
    </div>
</body>
</html>`;
const GIF_SETTINGS = {
    FPS: 24,
    DURATION_SECONDS: 3,
    DEFAULT_WIDTH: 500,
    DEFAULT_HEIGHT: 350,
    QUALITY: 10,
};

// --- Helper Functions ---
function extractAnimationDuration(code) {
    const durationRegex = /animation(?:-duration)?\s*:\s*[^;}]*?([0-9\.]+)(s|ms)/g;
    let match;
    const durations = [];
    while ((match = durationRegex.exec(code)) !== null) {
        let value = parseFloat(match[1]);
        if (match[2] === 'ms') value /= 1000;
        durations.push(value);
    }
    return durations.length > 0 ? Math.max(...durations) : null;
}

function extractDimensions(code) {
    const sceneRegex = /\.scene\s*\{[^\}]*?width:\s*(\d+)px;[^\}]*?height:\s*(\d+)px;/s;
    let match = code.match(sceneRegex);
    if (match && match[1] && match[2]) {
        return { width: parseInt(match[1], 10), height: parseInt(match[2], 10) };
    }
    return null;
}

function injectStyleIntoCode(htmlCode, style) {
    const styleTag = `<style>body { ${style} }</style>`;
    if (htmlCode.includes('</head>')) {
        return htmlCode.replace('</head>', `${styleTag}</head>`);
    }
    return `<html><head>${styleTag}</head><body>${htmlCode}</body></html>`;
}

// --- Icon Components ---
const BackArrowIcon = ({ className }) => React.createElement("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" }, React.createElement("path", { d: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" }));
const PlayIcon = ({ className }) => React.createElement("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" }, React.createElement("path", { d: "M8 5v14l11-7z" }));
const MovieIcon = ({ className }) => React.createElement("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" }, React.createElement("path", { d: "M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" }));
const DownloadIcon = ({ className }) => React.createElement("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" }, React.createElement("path", { d: "M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" }));
const RotateCcwIcon = ({ className }) => React.createElement("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M3 2v6h6" }), React.createElement("path", { d: "M3 13a9 9 0 1 0 3-7.7L3 8" }));

// --- UI Components ---
const Header = () => React.createElement("header", { className: "w-full p-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10" },
    React.createElement("div", { className: "container mx-auto flex items-center justify-center gap-3 relative" },
        React.createElement("a", { href: "/", "aria-label": "Go back to main site", className: "p-2 rounded-full hover:bg-gray-700 transition-colors absolute left-0 top-1/2 -translate-y-1/2" },
            React.createElement(BackArrowIcon, { className: "w-6 h-6 text-gray-300" })
        ),
        React.createElement("div", { className: "flex items-center gap-3" },
            React.createElement("div", { className: "p-2 bg-pink-500 rounded-lg" },
                React.createElement(MovieIcon, { className: "w-6 h-6 text-white" })
            ),
            React.createElement("h1", { className: "text-2xl font-bold tracking-tight text-white" }, "Code to GIF Animator")
        )
    )
);

const Button = ({ children, variant = 'primary', ...props }) => {
    const baseClasses = "px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
        primary: 'bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 text-white',
        secondary: 'bg-gray-700 hover:bg-gray-600 focus:ring-gray-500 text-gray-200'
    };
    return React.createElement("button", { className: `${baseClasses} ${variantClasses[variant]}`, ...props }, children);
};

const CodeEditor = ({ code, setCode }) => (React.createElement("div", { className: "h-full flex flex-col" }, React.createElement("label", { htmlFor: "code-editor", className: "text-sm font-medium text-gray-400 mb-2 px-1" }, "Animation Code (HTML, CSS, JS)"), React.createElement("textarea", { id: "code-editor", value: code, onChange: (e) => setCode(e.target.value), className: "w-full flex-grow bg-gray-800 text-gray-300 p-4 rounded-lg border border-gray-700 focus:ring-2 focus:ring-pink-500 focus:outline-none font-mono text-sm resize-none", spellCheck: false })));

const PreviewPanel = ({ previewCode, gifUrl, isGenerating, progress, iframeRef, onDownload, dimensions }) => {
    return React.createElement("div", { className: "relative w-full h-full bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex items-center justify-center", style: { aspectRatio: `${dimensions.width} / ${dimensions.height}` } },
        React.createElement("iframe", { ref: iframeRef, srcDoc: previewCode, title: "Animation Preview", className: `w-full h-full transition-opacity duration-300 ${gifUrl || isGenerating ? 'opacity-0' : 'opacity-100'}`, sandbox: "allow-scripts allow-same-origin", style: { width: `${dimensions.width}px`, height: `${dimensions.height}px`, transform: 'scale(1)', transformOrigin: 'top left' } }),
        (isGenerating || gifUrl) && (React.createElement("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-gray-800 p-4" },
            isGenerating && (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "w-16 h-16 border-4 border-dashed rounded-full animate-spin border-pink-500" }),
                React.createElement("p", { className: "mt-4 text-gray-300" }, progress)
            )),
            gifUrl && !isGenerating && (React.createElement("div", { className: "w-full h-full flex flex-col items-center justify-center gap-4" },
                React.createElement("img", { src: gifUrl, alt: "Generated GIF", className: "max-w-full max-h-[80%] object-contain rounded-lg" }),
// FIX: The children of the Button component are moved into the `children` prop to fix a TypeScript error.
                React.createElement(Button, { onClick: onDownload, children: [React.createElement(DownloadIcon, { className: "w-5 h-5" }), "Download GIF"] })
            ))
        ))
    );
};

const SettingsPanel = ({ duration, setDuration, fps, setFps }) => (React.createElement("div", { className: "grid grid-cols-2 gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700" },
    React.createElement("div", null,
        React.createElement("label", { htmlFor: "duration", className: "block text-sm font-medium text-gray-400 mb-2" }, "Duration (s)"),
// FIX: Explicitly convert numeric value to string to fix TypeScript overload resolution error.
        React.createElement("input", { type: "number", id: "duration", value: String(duration), onChange: (e) => setDuration(Math.max(0.1, parseFloat(e.target.value) || 1)), className: "w-full bg-gray-900 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:outline-none", min: "0.1", step: "0.1" })
    ),
    React.createElement("div", null,
        React.createElement("label", { htmlFor: "fps", className: "block text-sm font-medium text-gray-400 mb-2" }, "FPS: ", React.createElement("span", { className: "font-bold text-white" }, fps)),
// FIX: Explicitly convert numeric value to string to fix TypeScript overload resolution error.
        React.createElement("input", { type: "range", id: "fps", min: "10", max: "60", step: "1", value: String(fps), onChange: (e) => setFps(parseInt(e.target.value, 10)), className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-3" })
    )
));

const EffectsPanel = ({ colorScheme, setColorScheme, filters, setFilterValue, onReset }) => (React.createElement("div", { className: "p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-4" },
    React.createElement("div", { className: "flex justify-between items-center mb-2" },
        React.createElement("h3", { className: "text-md font-semibold text-white" }, "Effects"),
        React.createElement("button", { onClick: onReset, className: "px-3 py-1 text-xs font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200 flex items-center gap-1.5", "aria-label": "Reset effects" }, React.createElement(RotateCcwIcon, { className: "w-3 h-3" }), "Reset")
    ),
    React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" },
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "color-scheme", className: "block text-sm font-medium text-gray-400 mb-2" }, "Color Scheme"),
            React.createElement("select", { id: "color-scheme", value: colorScheme, onChange: e => setColorScheme(e.target.value), className: "w-full bg-gray-900 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:outline-none" },
                React.createElement("option", { value: "none" }, "None"),
                React.createElement("option", { value: "grayscale" }, "Grayscale"),
                React.createElement("option", { value: "sepia" }, "Sepia"),
                React.createElement("option", { value: "invert" }, "Invert")
            )
        ),
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "brightness", className: "block text-sm font-medium text-gray-400 mb-2" }, "Brightness: ", React.createElement("span", { className: "font-bold text-white" }, filters.brightness, "%")),
// FIX: Explicitly convert numeric value to string to fix TypeScript overload resolution error.
            React.createElement("input", { type: "range", id: "brightness", min: "0", max: "200", value: String(filters.brightness), onChange: e => setFilterValue('brightness', parseInt(e.target.value)), className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" })
        ),
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "contrast", className: "block text-sm font-medium text-gray-400 mb-2" }, "Contrast: ", React.createElement("span", { className: "font-bold text-white" }, filters.contrast, "%")),
// FIX: Explicitly convert numeric value to string to fix TypeScript overload resolution error.
            React.createElement("input", { type: "range", id: "contrast", min: "0", max: "200", value: String(filters.contrast), onChange: e => setFilterValue('contrast', parseInt(e.target.value)), className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" })
        ),
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "saturate", className: "block text-sm font-medium text-gray-400 mb-2" }, "Saturation: ", React.createElement("span", { className: "font-bold text-white" }, filters.saturate, "%")),
// FIX: Explicitly convert numeric value to string to fix TypeScript overload resolution error.
            React.createElement("input", { type: "range", id: "saturate", min: "0", max: "200", value: String(filters.saturate), onChange: e => setFilterValue('saturate', parseInt(e.target.value)), className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" })
        )
    )
));

// --- Main App Component ---
const initialFilters = { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, invert: 0 };

function App() {
    const [code, setCode] = useState(DEFAULT_CODE);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState('');
    const [gifUrl, setGifUrl] = useState(null);
    const [workerUrl, setWorkerUrl] = useState(null);
    const [isWorkerLoading, setIsWorkerLoading] = useState(true);
    const [duration, setDuration] = useState(GIF_SETTINGS.DURATION_SECONDS);
    const [fps, setFps] = useState(GIF_SETTINGS.FPS);
    const [dimensions, setDimensions] = useState({ width: GIF_SETTINGS.DEFAULT_WIDTH, height: GIF_SETTINGS.DEFAULT_HEIGHT });
    const [colorScheme, setColorScheme] = useState('none');
    const [filters, setFilters] = useState(initialFilters);
    const iframeRef = useRef(null);

    useEffect(() => {
        const detectedDuration = extractAnimationDuration(code);
        if (detectedDuration !== null && detectedDuration > 0) {
            setDuration(detectedDuration);
        }
        const dims = extractDimensions(code);
        if (dims) {
            setDimensions(dims);
        } else {
            setDimensions({ width: GIF_SETTINGS.DEFAULT_WIDTH, height: GIF_SETTINGS.DEFAULT_HEIGHT });
        }
    }, [code]);

    useEffect(() => {
        const workerScriptPath = 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js';
        let objectUrl;
        const loadWorker = async () => {
            setIsWorkerLoading(true);
            try {
                const response = await fetch(workerScriptPath);
                const scriptContent = await response.text();
                const blob = new Blob([scriptContent], { type: 'application/javascript' });
                objectUrl = URL.createObjectURL(blob);
                setWorkerUrl(objectUrl);
            } catch (error) {
                console.error("Failed to load GIF worker:", error);
                setProgress('Error: Could not load GIF library.');
            } finally {
                setIsWorkerLoading(false);
            }
        };
        loadWorker();
        return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
    }, []);

    const setFilterValue = (filter, value) => {
        setFilters(prev => ({ ...prev, [filter]: value }));
    };

    const handleResetFilters = () => {
        setFilters(initialFilters);
        setColorScheme('none');
    };

    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            grayscale: colorScheme === 'grayscale' ? 100 : 0,
            sepia: colorScheme === 'sepia' ? 100 : 0,
            invert: colorScheme === 'invert' ? 100 : 0,
        }));
    }, [colorScheme]);

    const filterStyle = useMemo(() => {
        return `filter: brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) invert(${filters.invert}%);`;
    }, [filters]);

    const [previewCode, setPreviewCode] = useState(() => injectStyleIntoCode(DEFAULT_CODE, filterStyle));
    useEffect(() => {
        setPreviewCode(injectStyleIntoCode(code, filterStyle));
    }, [code, filterStyle]);

    const handleDownload = () => {
        if (!gifUrl) return;
        const a = document.createElement('a');
        a.href = gifUrl;
        a.download = `animation-${Date.now()}.gif`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleGenerateGif = useCallback(async () => {
        if (!iframeRef.current?.contentWindow?.document.body || !workerUrl) {
            alert('Preview window is not ready or GIF library is still loading.');
            return;
        }
        setIsGenerating(true);
        setGifUrl(null);
        
        const { width: numericWidth, height: numericHeight } = dimensions;

        const captureCode = injectStyleIntoCode(code, filterStyle);
        
        iframeRef.current.srcdoc = ' ';
        await new Promise(resolve => setTimeout(resolve, 50));
        iframeRef.current.srcdoc = captureCode;
        await new Promise(resolve => iframeRef.current.onload = resolve);
        await new Promise(resolve => setTimeout(resolve, 100));

        setProgress('Initializing GIF encoder...');
        const targetElement = iframeRef.current.contentWindow.document.querySelector('.scene');

        if (!targetElement) {
            alert('Could not find the ".scene" element to capture. Please make sure your HTML contains an element with class="scene".');
            setIsGenerating(false);
            return;
        }

        const gif = new window.GIF({
            workers: 2, quality: GIF_SETTINGS.QUALITY, workerScript: workerUrl,
            width: numericWidth, height: numericHeight,
        });

        gif.on('finished', (blob) => {
            setGifUrl(URL.createObjectURL(blob));
            setIsGenerating(false);
            setProgress('Done!');
        });
        
        gif.on('progress', (p) => setProgress(`Rendering GIF: ${Math.round(p * 100)}%`));

        let frameCount = 0;
        const totalFrames = Math.floor(duration * fps);
        const captureInterval = 1000 / fps;

        const captureFrame = async () => {
             if (frameCount >= totalFrames) {
                 setProgress('Finalizing and rendering...');
                 gif.render();
                 return;
             }
            try {
                const canvas = await window.html2canvas(targetElement, {
                    width: numericWidth, 
                    height: numericHeight,
                    // FIX: Explicitly set scale to 1. This prevents html2canvas from using
                    // window.devicePixelRatio, ensuring the captured canvas has the exact
                    // dimensions required by gif.js, thus fixing the cropping issue on
                    // high-DPI (Retina) displays.
                    scale: 1,
                    useCORS: true, 
                    allowTaint: true, 
                    backgroundColor: null,
                    logging: false,
                });
                gif.addFrame(canvas, { copy: true, delay: captureInterval });
                setProgress(`Capturing frame ${frameCount + 1} of ${totalFrames}`);
                frameCount++;
                setTimeout(captureFrame, 0);
            } catch (error) {
                console.error('Error capturing frame:', error);
                setIsGenerating(false);
                alert('An error occurred during frame capture. Check console for details.');
            }
        };
        captureFrame();
    }, [code, filterStyle, workerUrl, duration, fps, dimensions]);

    return (React.createElement("div", { className: "min-h-screen bg-gray-900 text-gray-100 flex flex-col" },
        React.createElement(Header, null),
        React.createElement("main", { className: "flex-grow container mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8" },
            React.createElement("div", { className: "lg:w-1/2 flex flex-col gap-4" },
                React.createElement("div", { className: "flex-grow min-h-[50vh] lg:min-h-0" },
                    React.createElement(CodeEditor, { code: code, setCode: setCode })),
                React.createElement(SettingsPanel, { duration, setDuration, fps, setFps }),
                 React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
// FIX: The children of the Button component are moved into the `children` prop to fix a TypeScript error.
                    React.createElement(Button, { onClick: () => setPreviewCode(injectStyleIntoCode(code, filterStyle)), variant: "secondary", children: [
                        React.createElement(PlayIcon, { className: "w-5 h-5" }), "Update Preview"] }),
// FIX: The children of the Button component are moved into the `children` prop to fix a TypeScript error.
                    React.createElement(Button, { onClick: handleGenerateGif, disabled: isGenerating || isWorkerLoading, children: [
                        React.createElement(MovieIcon, { className: "w-5 h-5" }), isGenerating ? progress : isWorkerLoading ? 'Loading Library...' : 'Generate GIF'] })
                ),
                React.createElement("div", { className: "text-sm text-gray-400 p-2 bg-gray-800/50 rounded-md" },
                    React.createElement("strong", null, "Tip:"), " GIF dimensions are now read directly from the ", React.createElement("code", { className: "text-pink-400" }, ".scene"), " class in your code.")
            ),
            React.createElement("div", { className: "lg:w-1/2 flex flex-col gap-4" },
                 React.createElement("div", { className: "flex-grow flex flex-col" },
                    React.createElement("h2", { className: "text-sm font-medium text-gray-400 mb-2 w-full text-left flex-shrink-0" }, "Preview / Result"),
                    React.createElement(PreviewPanel, { previewCode, gifUrl, isGenerating, progress, iframeRef, dimensions, onDownload: handleDownload })
                ),
                 React.createElement("div", { className: "flex-shrink-0" },
                    React.createElement(EffectsPanel, { colorScheme, setColorScheme, filters, setFilterValue, onReset: handleResetFilters })
                )
            )
        )
    ));
}

// --- Mount the app ---
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(React.StrictMode, null, React.createElement(App, null)));