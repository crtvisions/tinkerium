import React, { useEffect, useRef, useState } from 'react';
import type { Dimensions, Filters, AIStylePreset, AIGeneratedCode } from '../types';
import { Button, DownloadIcon, RotateCcwIcon } from './UILayout';

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
}
export const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode }) => (
    <div className="h-full flex flex-col">
        <textarea
            id="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full flex-grow bg-gray-900 text-gray-300 p-4 focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-sm resize-none border-0"
            spellCheck="false"
        />
    </div>
);

type ActiveTab = 'html' | 'css' | 'js';
interface SplitCodeEditorProps {
    html: string;
    onHtmlChange: (value: string) => void;
    css: string;
    onCssChange: (value: string) => void;
    js: string;
    onJsChange: (value: string) => void;
}
export const SplitCodeEditor: React.FC<SplitCodeEditorProps> = ({ html, onHtmlChange, css, onCssChange, js, onJsChange }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('html');

    const editors: { lang: ActiveTab, value: string, onChange: (v: string) => void }[] = [
        { lang: 'html', value: html, onChange: onHtmlChange },
        { lang: 'css', value: css, onChange: onCssChange },
        { lang: 'js', value: js, onChange: onJsChange },
    ];

    const activeEditor = editors.find(e => e.lang === activeTab);

    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0 border-b border-gray-700 bg-gray-800">
                {editors.map(({ lang }) => (
                    <button
                        key={lang}
                        onClick={() => setActiveTab(lang)}
                        className={`px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none ${activeTab === lang ? 'bg-gray-900 text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:bg-gray-700/50'}`}
                    >
                        {lang.toUpperCase()}
                    </button>
                ))}
            </div>
            <textarea
                value={activeEditor?.value}
                onChange={(e) => activeEditor?.onChange(e.target.value)}
                className="w-full flex-grow bg-gray-900 text-gray-300 p-4 focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-sm resize-none border-0"
                spellCheck="false"
                aria-label={`${activeTab} code editor`}
            />
        </div>
    );
};


interface PreviewPanelProps {
    previewCode: string;
    mp4Url: string | null;
    isGenerating: boolean;
    progress: string;
    iframeRef: React.RefObject<HTMLIFrameElement>;
    onDownload: () => void;
    dimensions: Dimensions;
    backgroundColor: string;
    cropTop?: number;
    cropBottom?: number;
    cropLeft?: number;
    cropRight?: number;
}
export const PreviewPanel: React.FC<PreviewPanelProps> = ({ previewCode, mp4Url, isGenerating, progress, iframeRef, onDownload, dimensions, backgroundColor, cropTop = 0, cropBottom = 0, cropLeft = 0, cropRight = 0 }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [container, setContainer] = useState({ w: 0, h: 0 });

    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver((entries) => {
            const cr = entries[0].contentRect;
            setContainer({ w: cr.width, h: cr.height });
        });
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    const targetW = dimensions.width;
    const targetH = dimensions.height;

    const displayScale = container.w > 0 && container.h > 0
        ? Math.min(container.w / targetW, container.h / targetH, 1)
        : 1;
    const showCropOutline = cropTop > 0 || cropBottom > 0 || cropLeft > 0 || cropRight > 0;

    const scaledContainerStyle: React.CSSProperties = {
        width: `${targetW * displayScale}px`,
        height: `${targetH * displayScale}px`,
        position: 'relative'
    };

    const viewportStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${targetW}px`,
        height: `${targetH}px`,
        overflow: 'hidden',
        backgroundColor,
        transform: `scale(${displayScale})`,
        transformOrigin: 'top left'
    };

    const iframeStyle: React.CSSProperties = {
        width: `${targetW}px`,
        height: `${targetH}px`,
        transform: `scale(1)`,
        transformOrigin: 'top left',
        border: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        clipPath: `inset(${cropTop}px ${cropRight}px ${cropBottom}px ${cropLeft}px)`
    };

    const cropOutlineStyle: React.CSSProperties | undefined = showCropOutline ? {
        position: 'absolute',
        top: `${cropTop}px`,
        left: `${cropLeft}px`,
        width: `${Math.max(0, targetW - cropLeft - cropRight)}px`,
        height: `${Math.max(0, targetH - cropTop - cropBottom)}px`,
        border: '2px dashed rgba(122, 162, 247, 0.5)',
        pointerEvents: 'none'
    } : undefined;

    return (
        <div ref={containerRef} className="relative w-full h-full bg-gray-900 overflow-hidden flex items-center justify-center">
            <div style={scaledContainerStyle}>
                <div style={viewportStyle}>
                    <iframe
                        ref={iframeRef}
                        srcDoc={previewCode}
                        title="Animation Preview"
                        className={`transition-opacity duration-300 ${mp4Url ? 'opacity-0' : 'opacity-100'}`}
                        sandbox="allow-scripts allow-same-origin"
                        style={iframeStyle}
                    />
                    {showCropOutline && <div style={cropOutlineStyle} />}
                </div>
            </div>
            {(isGenerating || mp4Url) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 p-4">
                    {isGenerating && (
                        <>
                            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
                            <p className="mt-4 text-gray-300">{progress}</p>
                        </>
                    )}
                    {mp4Url && !isGenerating && (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                            <video
                                src={mp4Url}
                                className="max-w-full max-h-[80%] object-contain rounded-lg shadow-lg"
                                controls
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                            <Button onClick={onDownload} className="rounded-full border-2 border-[#7aa2f7] bg-gradient-to-r from-[#7aa2f7] to-[#c0caf5] text-[#1a1b26] uppercase tracking-wide px-6 py-3 text-sm shadow-[0_12px_24px_rgba(122,162,247,0.35)] hover:shadow-[0_16px_32px_rgba(122,162,247,0.45)] hover:translate-y-[-2px] transition-all duration-200"><DownloadIcon className="w-5 h-5" />Download MP4</Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

interface SettingsPanelProps {
    cropTop: number;
    setCropTop: (v: number) => void;
    cropBottom: number;
    setCropBottom: (v: number) => void;
    cropLeft: number;
    setCropLeft: (v: number) => void;
    cropRight: number;
    setCropRight: (v: number) => void;
    loopCount: number;
    setLoopCount: (n: number) => void;
    playbackSpeed: number;
    setPlaybackSpeed: (n: number) => void;
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
}
export const SettingsPanel: React.FC<SettingsPanelProps> = ({ cropTop, setCropTop, cropBottom, setCropBottom, cropLeft, setCropLeft, cropRight, setCropRight, loopCount, setLoopCount, playbackSpeed, setPlaybackSpeed, backgroundColor, setBackgroundColor }) => {
    return (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-4 overflow-y-auto">
            <h3 className="text-md font-semibold text-white">Crop & Export Settings</h3>
            
            <div>
                <label htmlFor="crop-top" className="block text-sm font-medium text-gray-400 mb-2">Crop Top: <span className="font-bold text-white">{cropTop}px</span></label>
                <input type="range" id="crop-top" min="0" max="200" value={cropTop} onChange={(e) => setCropTop(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
            
            <div>
                <label htmlFor="crop-bottom" className="block text-sm font-medium text-gray-400 mb-2">Crop Bottom: <span className="font-bold text-white">{cropBottom}px</span></label>
                <input type="range" id="crop-bottom" min="0" max="200" value={cropBottom} onChange={(e) => setCropBottom(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
            
            <div>
                <label htmlFor="crop-left" className="block text-sm font-medium text-gray-400 mb-2">Crop Left: <span className="font-bold text-white">{cropLeft}px</span></label>
                <input type="range" id="crop-left" min="0" max="200" value={cropLeft} onChange={(e) => setCropLeft(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
            
            <div>
                <label htmlFor="crop-right" className="block text-sm font-medium text-gray-400 mb-2">Crop Right: <span className="font-bold text-white">{cropRight}px</span></label>
                <input type="range" id="crop-right" min="0" max="200" value={cropRight} onChange={(e) => setCropRight(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
            
            <div>
                <label htmlFor="loop" className="block text-sm font-medium text-gray-400 mb-2">Loop Count: <span className="font-bold text-white">{loopCount}</span></label>
                <input type="range" id="loop" min="1" max="10" value={loopCount} onChange={(e) => setLoopCount(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
            
            <div>
                <label htmlFor="speed" className="block text-sm font-medium text-gray-400 mb-2">Playback Speed: <span className="font-bold text-white">{playbackSpeed.toFixed(1)}x</span></label>
                <input type="range" id="speed" min="0.25" max="4" step="0.25" value={playbackSpeed} onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
            
            <div>
                <label htmlFor="background-color" className="block text-sm font-medium text-gray-400 mb-2">Background Color</label>
                <div className="flex items-center gap-3">
                    <input 
                        type="color" 
                        id="background-color" 
                        value={backgroundColor} 
                        onChange={(e) => setBackgroundColor(e.target.value)} 
                        className="w-12 h-10 rounded-md border border-gray-600 bg-gray-700 cursor-pointer"
                    />
                    <span className="text-white font-mono text-sm">{backgroundColor}</span>
                </div>
            </div>
            
            
        </div>
    );
};

interface EffectsPanelProps {
    colorScheme: string;
    setColorScheme: (scheme: string) => void;
    filters: Filters;
    setFilterValue: (filter: keyof Omit<Filters, 'grayscale' | 'sepia' | 'invert'>, value: number) => void;
    onReset: () => void;
}
export const EffectsPanel: React.FC<EffectsPanelProps> = ({ colorScheme, setColorScheme, filters, setFilterValue, onReset }) => (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-4">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-semibold text-white">Effects</h3>
            <button onClick={onReset} className="px-3 py-1 text-xs font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200 flex items-center gap-1.5" aria-label="Reset effects">
                <RotateCcwIcon className="w-3 h-3" />Reset
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
                    <option value="vhs">VHS Retro</option>
                </select>
            </div>
            <div>
                <label htmlFor="brightness" className="block text-sm font-medium text-gray-400 mb-2">Brightness: <span className="font-bold text-white">{filters.brightness}%</span></label>
                <input type="range" id="brightness" min="0" max="200" value={filters.brightness} onChange={e => setFilterValue('brightness', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
            <div>
                <label htmlFor="contrast" className="block text-sm font-medium text-gray-400 mb-2">Contrast: <span className="font-bold text-white">{filters.contrast}%</span></label>
                <input type="range" id="contrast" min="0" max="200" value={filters.contrast} onChange={e => setFilterValue('contrast', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
            <div>
                <label htmlFor="saturate" className="block text-sm font-medium text-gray-400 mb-2">Saturation: <span className="font-bold text-white">{filters.saturate}%</span></label>
                <input type="range" id="saturate" min="0" max="200" value={filters.saturate} onChange={e => setFilterValue('saturate', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
        </div>
    </div>
);

type SettingsTab = 'export' | 'effects' | 'ai';

interface TabbedSettingsPanelProps {
    cropTop: number;
    setCropTop: (v: number) => void;
    cropBottom: number;
    setCropBottom: (v: number) => void;
    cropLeft: number;
    setCropLeft: (v: number) => void;
    cropRight: number;
    setCropRight: (v: number) => void;
    loopCount: number;
    setLoopCount: (n: number) => void;
    playbackSpeed: number;
    setPlaybackSpeed: (n: number) => void;
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
    colorScheme: string;
    setColorScheme: (scheme: string) => void;
    filters: Filters;
    setFilterValue: (filter: keyof Omit<Filters, 'grayscale' | 'sepia' | 'invert'>, value: number) => void;
    onResetEffects: () => void;
    aiStyles: AIStylePreset[];
    selectedAIStyleId: string;
    onSelectAIStyle: (id: string) => void;
    aiPrompt: string;
    onPromptChange: (value: string) => void;
    aiTemperature: number;
    onTemperatureChange: (value: number) => void;
    onGenerateAI: () => void;
    aiIsGenerating: boolean;
    aiResult: AIGeneratedCode | null;
    aiError: string | null;
    onApplyAICode: () => void;
}

export const TabbedSettingsPanel: React.FC<TabbedSettingsPanelProps> = ({
    cropTop, setCropTop, cropBottom, setCropBottom, cropLeft, setCropLeft, cropRight, setCropRight,
    loopCount, setLoopCount, playbackSpeed, setPlaybackSpeed, backgroundColor, setBackgroundColor,
    colorScheme, setColorScheme, filters, setFilterValue, onResetEffects,
    aiStyles, selectedAIStyleId, onSelectAIStyle, aiPrompt, onPromptChange, aiTemperature,
    onTemperatureChange, onGenerateAI, aiIsGenerating, aiResult, aiError, onApplyAICode
}) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('export');
    const activeStyle = aiStyles.find(style => style.id === selectedAIStyleId) ?? aiStyles[0] ?? null;

    return (
        <div className="h-full flex flex-col bg-gray-900 relative">
            <div className="flex-shrink-0 border-b border-gray-700 flex">
                <button
                    onClick={() => setActiveTab('export')}
                    className={`relative flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 focus:outline-none ${
                        activeTab === 'export'
                            ? 'bg-gray-800 text-gray-200'
                            : 'text-gray-400 hover:bg-gray-800/50'
                    }`}
                >
                    Export
                    {activeTab === 'export' && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-200"></span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('effects')}
                    className={`relative flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 focus:outline-none ${
                        activeTab === 'effects'
                            ? 'bg-gray-800 text-gray-200'
                            : 'text-gray-400 hover:bg-gray-800/50'
                    }`}
                >
                    Effects
                    {activeTab === 'effects' && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-200"></span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('ai')}
                    className={`relative flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 focus:outline-none ${
                        activeTab === 'ai'
                            ? 'bg-gray-800 text-gray-200'
                            : 'text-gray-400 hover:bg-gray-800/50'
                    }`}
                >
                    AI Assistant
                    {activeTab === 'ai' && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-200"></span>
                    )}
                </button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {activeTab === 'export' && (
                    <>
                        <div>
                            <label htmlFor="crop-top" className="block text-xs font-medium text-gray-400 mb-2">TOP: <span className="font-bold text-white">{cropTop}px</span></label>
                            <input type="range" id="crop-top" min="0" max="200" value={cropTop} onChange={(e) => setCropTop(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                        </div>
                        <div>
                            <label htmlFor="crop-bottom" className="block text-xs font-medium text-gray-400 mb-2">BOTTOM: <span className="font-bold text-white">{cropBottom}px</span></label>
                            <input type="range" id="crop-bottom" min="0" max="200" value={cropBottom} onChange={(e) => setCropBottom(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                        </div>
                        <div>
                            <label htmlFor="crop-left" className="block text-xs font-medium text-gray-400 mb-2">LEFT: <span className="font-bold text-white">{cropLeft}px</span></label>
                            <input type="range" id="crop-left" min="0" max="200" value={cropLeft} onChange={(e) => setCropLeft(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                        </div>
                        <div>
                            <label htmlFor="crop-right" className="block text-xs font-medium text-gray-400 mb-2">RIGHT: <span className="font-bold text-white">{cropRight}px</span></label>
                            <input type="range" id="crop-right" min="0" max="200" value={cropRight} onChange={(e) => setCropRight(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                        </div>
                        <div>
                            <label htmlFor="loop" className="block text-xs font-medium text-gray-400 mb-2">LOOP COUNT: <span className="font-bold text-white">{loopCount}</span></label>
                            <input type="range" id="loop" min="1" max="10" value={loopCount} onChange={(e) => setLoopCount(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                        </div>
                        <div>
                            <label htmlFor="speed" className="block text-xs font-medium text-gray-400 mb-2">PLAYBACK SPEED: <span className="font-bold text-white">{playbackSpeed.toFixed(1)}x</span></label>
                            <input type="range" id="speed" min="0.25" max="4" step="0.25" value={playbackSpeed} onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                        </div>
                        <div>
                            <label htmlFor="background-color" className="block text-xs font-medium text-gray-400 mb-2">BACKGROUND COLOR</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color" 
                                    id="background-color" 
                                    value={backgroundColor} 
                                    onChange={(e) => setBackgroundColor(e.target.value)} 
                                    className="w-10 h-8 rounded border border-gray-600 bg-gray-700 cursor-pointer"
                                />
                                <span className="text-gray-300 font-mono text-xs">{backgroundColor}</span>
                            </div>
                        </div>
                    </>
                )}
                {activeTab === 'effects' && (
                    <>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-semibold text-gray-300">Effects</h4>
                            <button onClick={onResetEffects} className="px-2 py-1 text-xs font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 rounded transition-colors duration-200 flex items-center gap-1" aria-label="Reset effects">
                                <RotateCcwIcon className="w-3 h-3" />Reset
                            </button>
                        </div>
                        <div>
                            <label htmlFor="color-scheme" className="block text-xs font-medium text-gray-400 mb-2">Color Scheme</label>
                            <select id="color-scheme" value={colorScheme} onChange={e => setColorScheme(e.target.value)} className="w-full bg-gray-800 text-gray-300 p-2 rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none text-xs">
                                <option value="none">None</option>
                                <option value="grayscale">Grayscale</option>
                                <option value="sepia">Sepia</option>
                                <option value="invert">Invert</option>
                                <option value="vhs">VHS Retro</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="brightness" className="block text-xs font-medium text-gray-400 mb-2">Brightness: <span className="font-bold text-white">{filters.brightness}%</span></label>
                            <input type="range" id="brightness" min="0" max="200" value={filters.brightness} onChange={e => setFilterValue('brightness', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                        </div>
                        <div>
                            <label htmlFor="contrast" className="block text-xs font-medium text-gray-400 mb-2">Contrast: <span className="font-bold text-white">{filters.contrast}%</span></label>
                            <input type="range" id="contrast" min="0" max="200" value={filters.contrast} onChange={e => setFilterValue('contrast', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                        </div>
                        <div>
                            <label htmlFor="saturate" className="block text-xs font-medium text-gray-400 mb-2">Saturation: <span className="font-bold text-white">{filters.saturate}%</span></label>
                            <input type="range" id="saturate" min="0" max="200" value={filters.saturate} onChange={e => setFilterValue('saturate', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                        </div>
                    </>
                )}
                {activeTab === 'ai' && (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="ai-style" className="block text-xs font-medium text-gray-400 mb-2">Style Preset</label>
                            <select
                                id="ai-style"
                                value={selectedAIStyleId}
                                onChange={(e) => onSelectAIStyle(e.target.value)}
                                className="w-full bg-gray-800 text-gray-300 p-2 rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none text-xs"
                            >
                                {aiStyles.map(style => (
                                    <option key={style.id} value={style.id}>{style.label}</option>
                                ))}
                            </select>
                            {activeStyle && (
                                <p className="mt-2 text-[11px] text-gray-400 leading-relaxed">{activeStyle.description}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="ai-prompt" className="block text-xs font-medium text-gray-400 mb-2">Prompt</label>
                            <textarea
                                id="ai-prompt"
                                value={aiPrompt}
                                onChange={(e) => onPromptChange(e.target.value)}
                                className="w-full min-h-[96px] bg-gray-800 text-gray-200 p-3 rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm resize-y"
                                placeholder="Describe the animation or layout you want"
                            />
                        </div>
                        <div>
                            <label htmlFor="ai-temperature" className="block text-xs font-medium text-gray-400 mb-2">Temperature: <span className="font-bold text-white">{aiTemperature.toFixed(2)}</span></label>
                            <input
                                type="range"
                                id="ai-temperature"
                                min="0"
                                max="1"
                                step="0.05"
                                value={aiTemperature}
                                onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                        </div>
                        {aiError && (
                            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded px-3 py-2">
                                {aiError}
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={onGenerateAI}
                                disabled={aiIsGenerating || !aiPrompt.trim()}
                                className="px-4 py-2 text-xs font-semibold uppercase tracking-wide"
                            >
                                {aiIsGenerating ? 'Generating…' : 'Generate'}
                            </Button>
                            <Button
                                onClick={onApplyAICode}
                                disabled={!aiResult}
                                variant="secondary"
                                className="px-4 py-2 text-xs font-semibold uppercase tracking-wide"
                            >
                                Apply to Editor
                            </Button>
                        </div>
                        {aiResult && (
                            <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-gray-300">Preview</span>
                                    <span className="text-[11px] text-gray-500">{aiResult.combined ? 'Combined snippet' : 'Raw response'}</span>
                                </div>
                                <pre className="text-[11px] leading-relaxed text-gray-200 whitespace-pre-wrap break-words max-h-64 overflow-auto bg-gray-900/70 p-3 rounded">{aiResult.combined ?? aiResult.raw}</pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
