import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { DEFAULT_CODE, GIF_SETTINGS } from './constants';
import type {} from './types';

// --- Helper Functions ---

/**
 * Extracts the longest animation duration from a string of HTML/CSS code.
 */
function extractAnimationDuration(code: string): number | null {
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

/**
 * Injects CSS styles into the <head> of an HTML string.
 */
function injectStyleIntoCode(htmlCode: string, style: string): string {
    const styleTag = `<style>body { ${style} }</style>`;
    if (htmlCode.includes('</head>')) {
        return htmlCode.replace('</head>', `${styleTag}</head>`);
    }
    return `<html><head>${styleTag}</head><body>${htmlCode}</body></html>`;
}

// --- Helper Components ---

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
);

const MovieIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" /></svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" /></svg>
);

const RotateCcwIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v6h6"/><path d="M3 13a9 9 0 1 0 3-7.7L3 8"/></svg>
);


const Header: React.FC = () => (
    <header className="w-full p-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-3">
            <div className="p-2 bg-pink-500 rounded-lg">
                <MovieIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Code to GIF Animator</h1>
        </div>
    </header>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
    const baseClasses = "px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
        primary: 'bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 text-white',
        secondary: 'bg-gray-700 hover:bg-gray-600 focus:ring-gray-500 text-gray-200'
    };
    return (
        <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
            {children}
        </button>
    );
};

const CodeEditor: React.FC<{ code: string; setCode: (c: string) => void; }> = ({ code, setCode }) => (
    <div className="h-full flex flex-col">
        <label htmlFor="code-editor" className="text-sm font-medium text-gray-400 mb-2 px-1">Animation Code (HTML, CSS, JS)</label>
        <textarea
            id="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full flex-grow bg-gray-800 text-gray-300 p-4 rounded-lg border border-gray-700 focus:ring-2 focus:ring-pink-500 focus:outline-none font-mono text-sm resize-none"
            spellCheck="false"
        />
    </div>
);

const PreviewPanel: React.FC<{ 
    previewCode: string; 
    gifUrl: string | null; 
    isGenerating: boolean; 
    progress: string; 
    iframeRef: React.RefObject<HTMLIFrameElement>; 
    onDownload: () => void; 
    width: number; 
    height: number;
}> = ({ previewCode, gifUrl, isGenerating, progress, iframeRef, onDownload, width, height }) => (    <div className="relative w-full bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex items-center justify-center mx-auto" style={{ aspectRatio: `${width} / ${height}` }}>
        <iframe
            ref={iframeRef}
            srcDoc={previewCode}
            title="Animation Preview"
            className={`w-full h-full transition-opacity duration-300 ${gifUrl || isGenerating ? 'opacity-0' : 'opacity-100'}`}
            sandbox="allow-scripts allow-same-origin"
            width={width}
            height={height}
        />
        {(isGenerating || gifUrl) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 p-4">
                {isGenerating && (
                    <>
                        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-pink-500"></div>
                        <p className="mt-4 text-gray-300">{progress}</p>
                    </>
                )}
                {gifUrl && !isGenerating && (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                        <img src={gifUrl} alt="Generated GIF" className="max-w-full max-h-[80%] object-contain rounded-lg" />
                        <Button onClick={onDownload}>
                            <DownloadIcon className="w-5 h-5" />
                            Download GIF
                        </Button>
                    </div>
                )}
            </div>
        )}
    </div>
);

const SettingsPanel: React.FC<{
    duration: number; setDuration: (d: number) => void;
    fps: number; setFps: (f: number) => void;
    width: number; setWidth: (w: number) => void;
    height: number; setHeight: (h: number) => void;
}> = ({ duration, setDuration, fps, setFps, width, setWidth, height, setHeight }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-400 mb-2">Duration (s)</label>
            <input type="number" id="duration" value={duration} onChange={(e) => setDuration(Math.max(0.1, parseFloat(e.target.value) || 1))} className="w-full bg-gray-900 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:outline-none" min="0.1" step="0.1"/>
        </div>
        <div>
            <label htmlFor="width" className="block text-sm font-medium text-gray-400 mb-2">Width (px)</label>
            <input type="number" id="width" value={width} onChange={(e) => setWidth(Math.max(10, parseInt(e.target.value, 10) || 10))} className="w-full bg-gray-900 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:outline-none" min="10" step="10"/>
        </div>
        <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-400 mb-2">Height (px)</label>
            <input type="number" id="height" value={height} onChange={(e) => setHeight(Math.max(10, parseInt(e.target.value, 10) || 10))} className="w-full bg-gray-900 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:outline-none" min="10" step="10"/>
        </div>
        <div>
            <label htmlFor="fps" className="block text-sm font-medium text-gray-400 mb-2">FPS: <span className="font-bold text-white">{fps}</span></label>
            <input type="range" id="fps" min="10" max="60" step="1" value={fps} onChange={(e) => setFps(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-3"/>
        </div>
    </div>
);

const EffectsPanel: React.FC<{
    colorScheme: string; setColorScheme: (s: string) => void;
    filters: Record<string, number>; setFilterValue: (filter: string, value: number) => void;
    onReset: () => void;
}> = ({ colorScheme, setColorScheme, filters, setFilterValue, onReset }) => (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-4">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-semibold text-white">Effects</h3>
            <button 
                onClick={onReset}
                className="px-3 py-1 text-xs font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200 flex items-center gap-1.5"
                aria-label="Reset effects"
            >
                <RotateCcwIcon className="w-3 h-3" />
                Reset
            </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                <label htmlFor="color-scheme" className="block text-sm font-medium text-gray-400 mb-2">Color Scheme</label>
                <select id="color-scheme" value={colorScheme} onChange={e => setColorScheme(e.target.value)} className="w-full bg-gray-900 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:outline-none">
                    <option value="none">None</option>
                    <option value="grayscale">Grayscale</option>
                    <option value="sepia">Sepia</option>
                    <option value="invert">Invert</option>
                </select>
            </div>
            <div>
                <label htmlFor="brightness" className="block text-sm font-medium text-gray-400 mb-2">Brightness: <span className="font-bold text-white">{filters.brightness}%</span></label>
                <input type="range" id="brightness" min="0" max="200" value={filters.brightness} onChange={e => setFilterValue('brightness', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"/>
            </div>
            <div>
                <label htmlFor="contrast" className="block text-sm font-medium text-gray-400 mb-2">Contrast: <span className="font-bold text-white">{filters.contrast}%</span></label>
                <input type="range" id="contrast" min="0" max="200" value={filters.contrast} onChange={e => setFilterValue('contrast', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"/>
            </div>
            <div>
                <label htmlFor="saturate" className="block text-sm font-medium text-gray-400 mb-2">Saturation: <span className="font-bold text-white">{filters.saturate}%</span></label>
                <input type="range" id="saturate" min="0" max="200" value={filters.saturate} onChange={e => setFilterValue('saturate', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"/>
            </div>
        </div>
    </div>
);


// --- Main App Component ---

const initialFilters = {
    brightness: 100, contrast: 100, saturate: 100,
    grayscale: 0, sepia: 0, invert: 0,
};

export default function App() {
    const [code, setCode] = useState<string>(DEFAULT_CODE);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [progress, setProgress] = useState<string>('');
    const [gifUrl, setGifUrl] = useState<string | null>(null);
    const [workerUrl, setWorkerUrl] = useState<string | null>(null);
    const [isWorkerLoading, setIsWorkerLoading] = useState<boolean>(true);

    // Settings State
    const [duration, setDuration] = useState<number>(GIF_SETTINGS.DURATION_SECONDS);
    const [fps, setFps] = useState<number>(GIF_SETTINGS.FPS);
    const [width, setWidth] = useState<number>(GIF_SETTINGS.DEFAULT_WIDTH);
    const [height, setHeight] = useState<number>(GIF_SETTINGS.DEFAULT_HEIGHT);

    // Effects State
    const [colorScheme, setColorScheme] = useState('none');
    const [filters, setFilters] = useState(initialFilters);
    
    const iframeRef = useRef<HTMLIFrameElement>(null);
    
    // --- Effects & Memoization ---

    useEffect(() => {
        const detectedDuration = extractAnimationDuration(code);
        if (detectedDuration !== null && detectedDuration > 0) {
            setDuration(detectedDuration);
        }
    }, [code]);

    useEffect(() => {
        const workerScriptPath = 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js';
        let objectUrl: string;
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

    const setFilterValue = (filter: string, value: number) => {
        setFilters(prev => ({...prev, [filter]: value}));
        setColorScheme('none');
    };

    const handleResetFilters = () => {
        setFilters(initialFilters);
        setColorScheme('none');
    };

    useEffect(() => {
        setFilters(prev => ({
            ...initialFilters, // Reset sliders when a scheme is chosen
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


    // --- Handlers ---
    
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

        // Force iframe to re-render from a clean state to reset animations
        iframeRef.current.srcdoc = ' ';
        await new Promise(resolve => setTimeout(resolve, 50));
        iframeRef.current.srcdoc = previewCode;
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for render
        
        setProgress('Initializing GIF encoder...');
        const targetElement = iframeRef.current.contentWindow.document.body;

        const gif = new window.GIF({
            workers: 2, quality: GIF_SETTINGS.QUALITY, workerScript: workerUrl,
            width: width, height: height,
        });

        gif.on('finished', (blob: Blob) => {
            setGifUrl(URL.createObjectURL(blob));
            setIsGenerating(false);
            setProgress('Done!');
        });
        
        gif.on('progress', (p: number) => setProgress(`Rendering GIF: ${Math.round(p * 100)}%`));

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
                setTimeout(captureFrame, 0); // Use setTimeout to avoid blocking UI thread
            } catch (error) {
                console.error('Error capturing frame:', error);
                setIsGenerating(false);
                alert('An error occurred during frame capture. Check console for details.');
            }
        };
        
        captureFrame();

    }, [previewCode, workerUrl, duration, fps, width, height]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2 flex flex-col gap-4">
                    <div className="flex-grow h-[50vh] lg:h-auto">
                      <CodeEditor code={code} setCode={setCode} />
                    </div>
                    <Button onClick={() => setPreviewCode(injectStyleIntoCode(code, filterStyle))} variant="secondary">
                        <PlayIcon className="w-5 h-5" /> Update Preview
                    </Button>
                    <SettingsPanel {...{ duration, setDuration, fps, setFps, width, setWidth, height, setHeight }}/>
                    <EffectsPanel {...{ colorScheme, setColorScheme, filters, setFilterValue, onReset: handleResetFilters }}/>
                    <Button onClick={handleGenerateGif} disabled={isGenerating || isWorkerLoading}>
                        <MovieIcon className="w-5 h-5" />
                        {isGenerating ? progress : isWorkerLoading ? 'Loading Library...' : 'Generate GIF'}
                    </Button>
                     <div className="text-sm text-gray-400 p-2 bg-gray-800/50 rounded-md">
                        <strong>Tip:</strong> For a perfect loop, ensure your animation's duration in code matches the GIF duration ({duration.toFixed(1)}s).
                    </div>
                </div>
                <div className="lg:w-1/2 flex flex-col items-center justify-start">
                    <h2 className="text-sm font-medium text-gray-400 mb-2 w-full text-left">Preview / Result</h2>
                     <PreviewPanel
                        {...{previewCode, gifUrl, isGenerating, progress, iframeRef, width, height}}
                        onDownload={handleDownload}
                    />
                </div>
            </main>
        </div>
    );
}
