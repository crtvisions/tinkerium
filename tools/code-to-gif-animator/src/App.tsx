import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { DEFAULT_CODE, GIF_SETTINGS, initialFilters } from './constants';
import type { Dimensions, Filters, EditorMode } from './types';
import { extractAnimationDuration, extractDimensions, injectStyleIntoCode, parseCombinedCode, buildCombinedCode } from './utils';
import { Header, Button, PlayIcon, MovieIcon } from './components/UILayout';
import { CodeEditor, SplitCodeEditor, PreviewPanel, SettingsPanel, EffectsPanel } from './components/Panels';

function App() {
    // Editor mode and code states
    const [editorMode, setEditorMode] = useState<EditorMode>('combined');
    const [code, setCode] = useState(DEFAULT_CODE);
    const [htmlCode, setHtmlCode] = useState('');
    const [cssCode, setCssCode] = useState('');
    const [jsCode, setJsCode] = useState('');
    
    // GIF generation states
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState('');
    const [gifUrl, setGifUrl] = useState<string | null>(null);
    const [workerUrl, setWorkerUrl] = useState<string | null>(null);
    const [isWorkerLoading, setIsWorkerLoading] = useState(true);
    
    // Settings and Effects states
    const [duration, setDuration] = useState(GIF_SETTINGS.DURATION_SECONDS);
    const [fps, setFps] = useState(GIF_SETTINGS.FPS);
    const [dimensions, setDimensions] = useState<Dimensions>({ width: GIF_SETTINGS.DEFAULT_WIDTH, height: GIF_SETTINGS.DEFAULT_HEIGHT });
    const [colorScheme, setColorScheme] = useState('none');
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [previewCode, setPreviewCode] = useState(DEFAULT_CODE);

    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Parse the default code to initialize the split editors on mount
    useEffect(() => {
        const { html, css, js } = parseCombinedCode(DEFAULT_CODE);
        setHtmlCode(html);
        setCssCode(css);
        setJsCode(js);
    }, []);
    
    const activeCode = useMemo(() => (editorMode === 'combined' ? code : buildCombinedCode(htmlCode, cssCode, jsCode)), [editorMode, code, htmlCode, cssCode, jsCode]);

    useEffect(() => {
        const detectedDuration = extractAnimationDuration(activeCode);
        if (detectedDuration !== null && detectedDuration > 0) {
            setDuration(detectedDuration);
        }
        const dims = extractDimensions(activeCode);
        if (dims) {
            setDimensions(dims);
        } else {
            setDimensions({ width: GIF_SETTINGS.DEFAULT_WIDTH, height: GIF_SETTINGS.DEFAULT_HEIGHT });
        }
    }, [activeCode]);

    useEffect(() => {
        const workerScriptPath = 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js';
        let objectUrl: string | null = null;
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

    const setFilterValue = useCallback((filter: keyof Omit<Filters, 'grayscale' | 'sepia' | 'invert'>, value: number) => {
        setFilters(prev => ({ ...prev, [filter]: value }));
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters(initialFilters);
        setColorScheme('none');
    }, []);

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
    
    const updatePreview = useCallback(() => {
        setPreviewCode(injectStyleIntoCode(activeCode, filterStyle));
    }, [activeCode, filterStyle]);

    useEffect(() => {
        updatePreview();
    }, [updatePreview]);


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
        const captureCode = injectStyleIntoCode(activeCode, filterStyle);

        iframeRef.current.srcdoc = ' ';
        await new Promise(resolve => setTimeout(resolve, 50));
        iframeRef.current.srcdoc = captureCode;
        await new Promise(resolve => { if (iframeRef.current) iframeRef.current.onload = resolve as () => void });
        await new Promise(resolve => setTimeout(resolve, 100));

        setProgress('Initializing GIF encoder...');
        const targetElement = iframeRef.current.contentWindow.document.querySelector<HTMLElement>('.scene');

        if (!targetElement) {
            alert('Could not find the ".scene" element to capture. Please make sure your HTML contains an element with class="scene".');
            setIsGenerating(false);
            return;
        }

        const gif = new window.GIF({
            workers: 2, quality: GIF_SETTINGS.QUALITY, workerScript: workerUrl,
            width: numericWidth, height: numericHeight,
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
             if (frameCount >= totalFrames || !isGenerating) {
                 if(isGenerating) gif.render();
                 return;
             }
            try {
                const canvas = await window.html2canvas(targetElement, {
                    width: numericWidth, 
                    height: numericHeight,
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
    }, [activeCode, filterStyle, workerUrl, duration, fps, dimensions, isGenerating]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2 flex flex-col gap-4">
                    <div className="flex-grow min-h-[50vh] lg:min-h-0 flex flex-col">
                        <div className="mb-2 flex items-center">
                           <label htmlFor="editor-mode" className="text-sm font-medium text-gray-400 mr-3">Editor Mode:</label>
                            <select 
                                id="editor-mode" 
                                value={editorMode} 
                                onChange={(e) => setEditorMode(e.target.value as EditorMode)}
                                className="bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                            >
                                <option value="combined">Combined</option>
                                <option value="split">Split (HTML/CSS/JS)</option>
                            </select>
                        </div>
                        <div className="flex-grow">
                            {editorMode === 'combined' ? (
                                <CodeEditor code={code} setCode={setCode} />
                            ) : (
                                <SplitCodeEditor 
                                    html={htmlCode} onHtmlChange={setHtmlCode}
                                    css={cssCode} onCssChange={setCssCode}
                                    js={jsCode} onJsChange={setJsCode}
                                />
                            )}
                        </div>
                    </div>
                    <SettingsPanel duration={duration} setDuration={setDuration} fps={fps} setFps={setFps} />
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button onClick={updatePreview} variant="secondary">
                            <PlayIcon className="w-5 h-5" />Update Preview
                        </Button>
                        <Button onClick={handleGenerateGif} disabled={isGenerating || isWorkerLoading}>
                            <MovieIcon className="w-5 h-5" />
                            {isGenerating ? progress : isWorkerLoading ? 'Loading Library...' : 'Generate GIF'}
                        </Button>
                    </div>
                    <div className="text-sm text-gray-400 p-2 bg-gray-800/50 rounded-md">
                        <strong>Tip:</strong> GIF dimensions are auto-detected from the <code className="text-pink-400">.scene</code> class in your CSS.
                    </div>
                </div>
                <div className="lg:w-1/2 flex flex-col gap-4">
                    <div className="flex-grow flex flex-col">
                        <h2 className="text-sm font-medium text-gray-400 mb-2 w-full text-left flex-shrink-0">Preview / Result</h2>
                        <PreviewPanel 
                            previewCode={previewCode} 
                            gifUrl={gifUrl} 
                            isGenerating={isGenerating} 
                            progress={progress} 
                            iframeRef={iframeRef} 
                            dimensions={dimensions} 
                            onDownload={handleDownload} 
                        />
                    </div>
                    <div className="flex-shrink-0">
                        <EffectsPanel 
                            colorScheme={colorScheme} 
                            setColorScheme={setColorScheme} 
                            filters={filters} 
                            setFilterValue={setFilterValue} 
                            onReset={handleResetFilters} 
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
