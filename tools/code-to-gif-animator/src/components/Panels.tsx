import React, { useState } from 'react';
import type { Dimensions, Filters } from '../types';
import { Button, DownloadIcon, RotateCcwIcon } from './UILayout';

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
}
export const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode }) => (
    <div className="h-full flex flex-col">
        <label htmlFor="code-editor" className="text-sm font-medium text-gray-400 mb-2 px-1">Animation Code (HTML, CSS)</label>
        <textarea
            id="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full flex-grow bg-gray-800 text-gray-300 p-4 rounded-lg border border-gray-700 focus:ring-2 focus:ring-pink-500 focus:outline-none font-mono text-sm resize-none"
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
            <div className="flex-shrink-0 border-b border-gray-700">
                {editors.map(({ lang }) => (
                    <button
                        key={lang}
                        onClick={() => setActiveTab(lang)}
                        className={`px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none ${activeTab === lang ? 'bg-gray-800 text-pink-400 border-b-2 border-pink-400' : 'text-gray-400 hover:bg-gray-700/50'}`}
                    >
                        {lang.toUpperCase()}
                    </button>
                ))}
            </div>
            <textarea
                value={activeEditor?.value}
                onChange={(e) => activeEditor?.onChange(e.target.value)}
                className="w-full flex-grow bg-gray-800 text-gray-300 p-4 rounded-b-lg border-x border-b border-gray-700 focus:ring-2 focus:ring-pink-500 focus:outline-none font-mono text-sm resize-none"
                spellCheck="false"
                aria-label={`${activeTab} code editor`}
            />
        </div>
    );
};


interface PreviewPanelProps {
    previewCode: string;
    gifUrl: string | null;
    isGenerating: boolean;
    progress: string;
    iframeRef: React.RefObject<HTMLIFrameElement>;
    onDownload: () => void;
    dimensions: Dimensions;
}
export const PreviewPanel: React.FC<PreviewPanelProps> = ({ previewCode, gifUrl, isGenerating, progress, iframeRef, onDownload, dimensions }) => {
    return (
        <div className="relative w-full h-full bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex items-center justify-center" style={{ aspectRatio: `${dimensions.width} / ${dimensions.height}` }}>
            <iframe
                ref={iframeRef}
                srcDoc={previewCode}
                title="Animation Preview"
                className={`transition-opacity duration-300 bg-white ${gifUrl || isGenerating ? 'opacity-0' : 'opacity-100'}`}
                sandbox="allow-scripts allow-same-origin"
                style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px`, transform: 'scale(1)', transformOrigin: 'top left' }}
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
                            <img src={gifUrl} alt="Generated GIF" className="max-w-full max-h-[80%] object-contain rounded-lg shadow-lg" />
                            <Button onClick={onDownload}><DownloadIcon className="w-5 h-5" />Download GIF</Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

interface SettingsPanelProps {
    duration: number;
    setDuration: (duration: number) => void;
    fps: number;
    setFps: (fps: number) => void;
}
export const SettingsPanel: React.FC<SettingsPanelProps> = ({ duration, setDuration, fps, setFps }) => (
    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-400 mb-2">Duration (s)</label>
            <input type="number" id="duration" value={duration} onChange={(e) => setDuration(Math.max(0.1, parseFloat(e.target.value) || 1))} className="w-full bg-gray-900 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:outline-none" min="0.1" step="0.1" />
        </div>
        <div>
            <label htmlFor="fps" className="block text-sm font-medium text-gray-400 mb-2">FPS: <span className="font-bold text-white">{fps}</span></label>
            <input type="range" id="fps" min="10" max="60" step="1" value={fps} onChange={(e) => setFps(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500 mt-3" />
        </div>
    </div>
);

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
