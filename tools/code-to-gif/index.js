import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// --- Constants (from constants.ts) ---
const DEFAULT_CODE = `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    margin: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1a1a2e;
    overflow: hidden;
    font-family: sans-serif;
  }
  .container {
    display: flex;
    gap: 20px;
  }
  .orb {
    width: 50px;
    height: 50px;
    background: #e94560;
    border-radius: 50%;
    animation: bounce 2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    box-shadow: 0 0 20px #e94560, 0 0 40px #e94560;
  }
  .orb:nth-child(2) {
    animation-delay: 0.2s;
    background: #16213e;
    box-shadow: 0 0 20px #0f3460, 0 0 40px #0f3460;
  }
  .orb:nth-child(3) {
    animation-delay: 0.4s;
    background: #533483;
    box-shadow: 0 0 20px #533483, 0 0 40px #533483;
  }
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-50px);
    }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="orb"></div>
    <div class="orb"></div>
    <div class="orb"></div>
  </div>
</body>
</html>`;
const GIF_SETTINGS = {
    FPS: 24,
    DURATION_SECONDS: 2,
    DEFAULT_WIDTH: 500,
    DEFAULT_HEIGHT: 500,
    QUALITY: 10,
};

// --- App Logic (from App.tsx, transpiled to JS) ---
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
function injectStyleIntoCode(htmlCode, style) {
    const styleTag = `<style>body { ${style} }</style>`;
    if (htmlCode.includes('</head>')) {
        return htmlCode.replace('</head>', `${styleTag}</head>`);
    }
    return `<html><head>${styleTag}</head><body>${htmlCode}</body></html>`;
}
const PlayIcon = ({ className }) => React.createElement("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" }, React.createElement("path", { d: "M8 5v14l11-7z" }));
const MovieIcon = ({ className }) => React.createElement("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" }, React.createElement("path", { d: "M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" }));
const DownloadIcon = ({ className }) => React.createElement("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" }, React.createElement("path", { d: "M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" }));
const RotateCcwIcon = ({ className }) => React.createElement("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M3 2v6h6" }), React.createElement("path", { d: "M3 13a9 9 0 1 0 3-7.7L3 8" }));
const Header = () => React.createElement("header", { className: "w-full p-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10" }, React.createElement("div", { className: "container mx-auto flex items-center gap-3" }, React.createElement("div", { className: "p-2 bg-pink-500 rounded-lg" }, React.createElement(MovieIcon, { className: "w-6 h-6 text-white" })), React.createElement("h1", { className: "text-2xl font-bold tracking-tight text-white" }, "Code to GIF Animator")));
const Button = ({ children, variant = 'primary', ...props }) => {
    const baseClasses = "px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
        primary: 'bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 text-white',
        secondary: 'bg-gray-700 hover:bg-gray-600 focus:ring-gray-500 text-gray-200'
    };
    return React.createElement("button", { className: `${baseClasses} ${variantClasses[variant]}`, ...props }, children);
};
const CodeEditor = ({ code, setCode }) => (React.createElement("div", { className: "h-full flex flex-col" }, React.createElement("label", { htmlFor: "code-editor", className: "text-sm font-medium text-gray-400 mb-2 px-1" }, "Animation Code (HTML, CSS, JS)"), React.createElement("textarea", { id: "code-editor", value: code, onChange: (e) => setCode(e.target.value), className: "w-full flex-grow bg-gray-800 text-gray-300 p-4 rounded-lg border border-gray-700 focus:ring-2 focus:ring-pink-500 focus:outline-none font-mono text-sm resize-none", spellCheck: "false" })));
const PreviewPanel = ({ previewCode, gifUrl, isGenerating, progress, iframeRef, onDownload, width, height }) => (React.createElement("div", { className: "relative w-full bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex items-center justify-center mx-auto", style: { aspectRatio: `${width} / ${height}` } }, React.createElement("iframe", { ref: iframeRef, srcDoc: previewCode, title: "Animation Preview", className: `w-full h-full transition-opacity duration-300 ${gifUrl || isGenerating ? 'opacity-0' : 'opacity-100'}`, sandbox: "allow-scripts allow-same-origin", width: width, height: height }), (isGenerating || gifUrl) && (React.createElement("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-gray-800 p-4" }, isGenerating && (React.createElement(React.Fragment, null, React.createElement("div", { className: "w-16 h-16 border-4 border-dashed rounded-full animate-spin border-pink-500" }), React.createElement("p", { className: "mt-4 text-gray-300" }, progress))), gifUrl && !isGenerating && (React.createElement("div", { className: "w-full h-full flex flex-col items-center justify-center gap-4" }, React.createElement("img", { src: gifUrl, alt: "Generated GIF", className: "max-w-full max-h-[80%] object-contain rounded-lg" }), React.createElement(Button, { onClick: onDownload }, React.createElement(DownloadIcon, { className: "w-5 h-5" }), "Download GIF")))))));
const SettingsPanel = ({ duration, setDuration, fps, setFps, width, setWidth, height, setHeight }) => (React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700" }, React.createElement("div", null, React.createElement("label", { htmlFor: "duration", className: "block text-sm font-medium text-gray-400 mb-2" }, "Duration (s)"), React.createElement("input", { type: "number", id: "duration", value: duration, onChange: (e) => setDuration(Math.max(0.1, parseFloat(e.target.value) || 1)), className: "w-full bg-gray-900 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:outline-none", min: "0.1", step: "0.1" })), React.createElement("div", null, React.createElement("label", { htmlFor: "width", className: "block text-sm font-medium text-gray-400 mb-2" }, "Width (px)"), React.createElement("input", { type: "number", id: "width", value: width, onChange: (e) => setWidth(Math.max(10, parseInt(e.target.value, 10) || 10)), className: "w-full bg-gray-900 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:outline-none", min: "10", step: "10" })), React.createElement("div", null, React.createElement("label", { htmlFor: "height", className: "block text-sm font-medium text-gray-400 mb-2" }, "Height (px)"), React.createElement("input", { type: "number", id: "height", value: height, onChange: (e) => setHeight(Math.max(10, parseInt(e.target.value, 10) || 10)), className: "w-full bg-gray-900 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:outline-none", min: "10", step: "10" })), React.createElement("div", null, React.createElement("label", { htmlFor: "fps", className: "block text-sm font-medium text-gray-400 mb-2" }, "FPS: ", React.createElement("span", { className: "font-bold text-white" }, fps)), React.createElement("input", { type: "range", id: "fps", min: "10", max: "60", step: "1", value: fps, onChange: (e) => setFps(parseInt(e.target.value, 10)), className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-3" }))));
const EffectsPanel = ({ colorScheme, setColorScheme, filters, setFilterValue, onReset }) => (React.createElement("div", { className: "p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-4" }, React.createElement("div", { className: "flex justify-between items-center mb-2" }, React.createElement("h3", { className: "text-md font-semibold text-white" }, "Effects"), React.createElement("button", { onClick: onReset, className: "px-3 py-1 text-xs font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200 flex items-center gap-1.5", "aria-label": "Reset effects" }, React.createElement(RotateCcwIcon, { className: "w-3 h-3" }), "Reset")), React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" }, React.createElement("div", null, React.createElement("label", { htmlFor: "color-scheme", className: "block text-sm font-medium text-gray-400 mb-2" }, "Color Scheme"), React.createElement("select", { id: "color-scheme", value: colorScheme, onChange: e => setColorScheme(e.target.value), className: "w-function bg-gray-900 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:outline-none" }, React.createElement("option", { value: "none" }, "None"), React.createElement("option", { value: "grayscale" }, "Grayscale"), React.createElement("option", { value: "sepia" }, "Sepia"), React.createElement("option", { value: "invert" }, "Invert"))), React.createElement("div", null, React.createElement("label", { htmlFor: "brightness", className: "block text-sm font-medium text-gray-400 mb-2" }, "Brightness: ", React.createElement("span", { className: "font-bold text-white" }, filters.brightness, "%")), React.createElement("input", { type: "range", id: "brightness", min: "0", max: "200", value: filters.brightness, onChange: e => setFilterValue('brightness', parseInt(e.target.value)), className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" })), React.createElement("div", null, React.createElement("label", { htmlFor: "contrast", className: "block text-sm font-medium text-gray-400 mb-2" }, "Contrast: ", React.createElement("span", { className: "font-bold text-white" }, filters.contrast, "%")), React.createElement("input", { type: "range", id: "contrast", min: "0", max: "200", value: filters.contrast, onChange: e => setFilterValue('contrast', parseInt(e.target.value)), className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" })), React.createElement("div", null, React.createElement("label", { htmlFor: "saturate", className: "block text-sm font-medium text-gray-400 mb-2" }, "Saturation: ", React.createElement("span", { className: "font-bold text-white" }, filters.saturate, "%")), React.createElement("input", { type: "range", id: "saturate", min: "0", max: "200", value: filters.saturate, onChange: e => setFilterValue('saturate', parseInt(e.target.value)), className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" })))));
const initialFilters = {
    brightness: 100, contrast: 100, saturate: 100,
    grayscale: 0, sepia: 0, invert: 0,
};
function App() {
    const [code, setCode] = useState(DEFAULT_CODE);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState('');
    const [gifUrl, setGifUrl] = useState(null);
    const [workerUrl, setWorkerUrl] = useState(null);
    const [isWorkerLoading, setIsWorkerLoading] = useState(true);
    const [duration, setDuration] = useState(GIF_SETTINGS.DURATION_SECONDS);
    const [fps, setFps] = useState(GIF_SETTINGS.FPS);
    const [width, setWidth] = useState(GIF_SETTINGS.DEFAULT_WIDTH);
    const [height, setHeight] = useState(GIF_SETTINGS.DEFAULT_HEIGHT);
    const [colorScheme, setColorScheme] = useState('none');
    const [filters, setFilters] = useState(initialFilters);
    const iframeRef = useRef(null);
    useEffect(() => {
        const detectedDuration = extractAnimationDuration(code);
        if (detectedDuration !== null && detectedDuration > 0) {
            setDuration(detectedDuration);
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
            }
            catch (error) {
                console.error("Failed to load GIF worker:", error);
                setProgress('Error: Could not load GIF library.');
            }
            finally {
                setIsWorkerLoading(false);
            }
        };
        loadWorker();
        return () => { if (objectUrl)
            URL.revokeObjectURL(objectUrl); };
    }, []);
    const setFilterValue = (filter, value) => {
        setFilters(prev => ({ ...prev, [filter]: value }));
        setColorScheme('none');
    };
    const handleResetFilters = () => {
        setFilters(initialFilters);
        setColorScheme('none');
    };
    useEffect(() => {
        setFilters(prev => ({
            ...initialFilters,
            brightness: 100, contrast: 100, saturate: 100,
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
        if (!gifUrl)
            return;
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
        iframeRef.current.srcdoc = ' ';
        await new Promise(resolve => setTimeout(resolve, 50));
        iframeRef.current.srcdoc = previewCode;
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress('Initializing GIF encoder...');
        const targetElement = iframeRef.current.contentWindow.document.body;
        const gif = new window.GIF({
            workers: 2, quality: GIF_SETTINGS.QUALITY, workerScript: workerUrl,
            width: width, height: height,
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
                    width: width, height: height,
                    useCORS: true, allowTaint: true, backgroundColor: null,
                });
                gif.addFrame(canvas, { copy: true, delay: captureInterval });
                setProgress(`Capturing frame ${frameCount + 1} of ${totalFrames}`);
                frameCount++;
                setTimeout(captureFrame, 0);
            }
            catch (error) {
                console.error('Error capturing frame:', error);
                setIsGenerating(false);
                alert('An error occurred during frame capture. Check console for details.');
            }
        };
        captureFrame();
    }, [previewCode, workerUrl, duration, fps, width, height]);
    return (React.createElement("div", { className: "min-h-screen bg-gray-900 text-gray-100 flex flex-col" },
        React.createElement(Header, null),
        React.createElement("main", { className: "flex-grow container mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8" },
            React.createElement("div", { className: "lg:w-1/2 flex flex-col gap-4" },
                React.createElement("div", { className: "flex-grow h-[50vh] lg:h-auto" },
                    React.createElement(CodeEditor, { code: code, setCode: setCode })),
                React.createElement(Button, { onClick: () => setPreviewCode(injectStyleIntoCode(code, filterStyle)), variant: "secondary" },
                    React.createElement(PlayIcon, { className: "w-5 h-5" }),
                    " Update Preview"),
                React.createElement(SettingsPanel, { duration, setDuration, fps, setFps, width, setWidth, height, setHeight }),
                React.createElement(EffectsPanel, { colorScheme, setColorScheme, filters, setFilterValue, onReset: handleResetFilters }),
                React.createElement(Button, { onClick: handleGenerateGif, disabled: isGenerating || isWorkerLoading },
                    React.createElement(MovieIcon, { className: "w-5 h-5" }),
                    isGenerating ? progress : isWorkerLoading ? 'Loading Library...' : 'Generate GIF'),
                React.createElement("div", { className: "text-sm text-gray-400 p-2 bg-gray-800/50 rounded-md" },
                    React.createElement("strong", null, "Tip:"),
                    " For a perfect loop, ensure your animation's duration in code matches the GIF duration (",
                    duration.toFixed(1),
                    "s).")),
            React.createElement("div", { className: "lg:w-1/2 flex flex-col items-center justify-start" },
                React.createElement("h2", { className: "text-sm font-medium text-gray-400 mb-2 w-full text-left" }, "Preview / Result"),
                React.createElement(PreviewPanel, { previewCode, gifUrl, isGenerating, progress, iframeRef, width, height, onDownload: handleDownload })))));
}

// --- Mount the app (from index.tsx) ---
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(React.StrictMode, null, React.createElement(App, null)));
