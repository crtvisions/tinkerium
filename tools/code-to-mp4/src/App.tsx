import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { DEFAULT_CODE, GIF_SETTINGS, initialFilters } from './constants';
import type { Dimensions, Filters, EditorMode } from './types';
import { extractAnimationDuration, extractDimensions, injectStyleIntoCode, parseCombinedCode, buildCombinedCode } from './utils';
import { Header } from './components/UILayout';
import { CodeEditor, SplitCodeEditor, PreviewPanel, TabbedSettingsPanel } from './components/Panels';
// Removed mp4-muxer import - using MediaRecorder instead

// Add type declarations for window properties
declare global {
    interface Window {
        html2canvas: any;
        seekToTime?: (timeInSeconds: number) => void;
        animationStyleElement?: HTMLStyleElement;
    }
}

const LUMA_R = 0.2126;
const LUMA_G = 0.7152;
const LUMA_B = 0.0722;

const clampColor = (value: number) => Math.max(0, Math.min(255, value));

const applyFiltersToImageData = (imageData: ImageData, filters: Filters, colorScheme: string) => {
    const data = imageData.data;
    const totalPixels = data.length;

    let brightnessFactor = Math.max(0, filters.brightness) / 100;
    let contrastFactor = Math.max(0, filters.contrast) / 100;
    let saturationFactor = Math.max(0, filters.saturate) / 100;
    let grayscaleFactor = Math.min(1, Math.max(0, filters.grayscale / 100));
    let sepiaFactor = Math.min(1, Math.max(0, filters.sepia / 100));
    const invertFactor = Math.min(1, Math.max(0, filters.invert / 100));

    if (colorScheme === 'vhs') {
        brightnessFactor *= 0.9;
        contrastFactor *= 1.2;
        saturationFactor *= 1.4;
        sepiaFactor = Math.max(sepiaFactor, 0.3);
    }

    const contrastIntercept = 128 * (1 - contrastFactor);

    for (let i = 0; i < totalPixels; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Brightness
        r *= brightnessFactor;
        g *= brightnessFactor;
        b *= brightnessFactor;

        // Contrast
        r = r * contrastFactor + contrastIntercept;
        g = g * contrastFactor + contrastIntercept;
        b = b * contrastFactor + contrastIntercept;

        // Saturation
        const lumBeforeSaturation = LUMA_R * r + LUMA_G * g + LUMA_B * b;
        r = lumBeforeSaturation + (r - lumBeforeSaturation) * saturationFactor;
        g = lumBeforeSaturation + (g - lumBeforeSaturation) * saturationFactor;
        b = lumBeforeSaturation + (b - lumBeforeSaturation) * saturationFactor;

        // Grayscale blend
        if (grayscaleFactor > 0) {
            const gray = LUMA_R * r + LUMA_G * g + LUMA_B * b;
            r = r * (1 - grayscaleFactor) + gray * grayscaleFactor;
            g = g * (1 - grayscaleFactor) + gray * grayscaleFactor;
            b = b * (1 - grayscaleFactor) + gray * grayscaleFactor;
        }

        // Sepia blend
        if (sepiaFactor > 0) {
            const sr = r * 0.393 + g * 0.769 + b * 0.189;
            const sg = r * 0.349 + g * 0.686 + b * 0.168;
            const sb = r * 0.272 + g * 0.534 + b * 0.131;
            r = r * (1 - sepiaFactor) + sr * sepiaFactor;
            g = g * (1 - sepiaFactor) + sg * sepiaFactor;
            b = b * (1 - sepiaFactor) + sb * sepiaFactor;
        }

        // Invert blend
        if (invertFactor > 0) {
            const ir = 255 - r;
            const ig = 255 - g;
            const ib = 255 - b;
            r = r * (1 - invertFactor) + ir * invertFactor;
            g = g * (1 - invertFactor) + ig * invertFactor;
            b = b * (1 - invertFactor) + ib * invertFactor;
        }

        data[i] = clampColor(r);
        data[i + 1] = clampColor(g);
        data[i + 2] = clampColor(b);
    }
};

const applyVhsOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#000000';
    for (let y = 0; y < height; y += 2) {
        ctx.fillRect(0, y, width, 1);
    }

    ctx.globalAlpha = 0.2;
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.75, 'transparent');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
};

function App() {
    // Editor mode and code states
    const [editorMode, setEditorMode] = useState<EditorMode>('combined');
    const [code, setCode] = useState(DEFAULT_CODE);
    const [htmlCode, setHtmlCode] = useState('');
    const [cssCode, setCssCode] = useState('');
    const [jsCode, setJsCode] = useState('');
    
    // Video generation states
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState('');
    const [mp4Url, setMp4Url] = useState<string | null>(null);
    const [videoFormat, setVideoFormat] = useState<string>('mp4');
    const [backgroundColor, setBackgroundColor] = useState<string>('#000000');
    
    // Settings and Effects states
    const [duration, setDuration] = useState(GIF_SETTINGS.DURATION_SECONDS);
    const [fps] = useState(GIF_SETTINGS.FPS);
    const [dimensions, setDimensions] = useState<Dimensions>({ width: GIF_SETTINGS.DEFAULT_WIDTH, height: GIF_SETTINGS.DEFAULT_HEIGHT });
    const [colorScheme, setColorScheme] = useState('none');
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [previewCode, setPreviewCode] = useState(DEFAULT_CODE);

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const abortRef = useRef<boolean>(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<number | null>(null);
    const finalizedRef = useRef<boolean>(false);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    // Capture/encoding customization
    const [cropTop, setCropTop] = useState<number>(0);
    const [cropBottom, setCropBottom] = useState<number>(0);
    const [cropLeft, setCropLeft] = useState<number>(0);
    const [cropRight, setCropRight] = useState<number>(0);
    const [bitrateMbps] = useState<number>(2);
    const [keyInterval] = useState<number>(30);
    const [fastMode] = useState<boolean>(true);
    const [loopCount, setLoopCount] = useState<number>(1);
    const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

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


    const setFilterValue = useCallback((filter: keyof Omit<Filters, 'grayscale' | 'sepia' | 'invert'>, value: number) => {
        setFilters(prev => ({ ...prev, [filter]: value }));
    }, []);

    const handleResetFilters = useCallback(() => {
        // Reset only the filter values, keep the selected color scheme
        setFilters(prev => ({
            ...initialFilters,
            // Preserve the color scheme-specific filter values
            grayscale: prev.grayscale,
            sepia: prev.sepia,
            invert: prev.invert
        }));
        // Do not reset colorScheme - keep the selected effect
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
        let baseFilter = `filter: brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) invert(${filters.invert}%);`;
        
        if (colorScheme === 'vhs') {
            // Enhanced VHS effect with user-controlled filters and strong visual characteristics
            const vhsEffects = `
                body {
                    filter: brightness(${filters.brightness * 0.9}%) contrast(${filters.contrast * 1.2}%) saturate(${filters.saturate * 1.4}%) sepia(30%) hue-rotate(320deg) grayscale(${filters.grayscale}%) invert(${filters.invert}%);
                    position: relative;
                    animation: vhs-distortion 3s infinite;
                    background-color: ${backgroundColor} !important;
                }
                
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 1px,
                            rgba(0, 0, 0, 0.15) 1px,
                            rgba(0, 0, 0, 0.15) 2px
                        ),
                        repeating-linear-gradient(
                            90deg,
                            rgba(255, 0, 150, 0.06) 0px,
                            rgba(255, 0, 150, 0.06) 1px,
                            rgba(0, 255, 255, 0.06) 1px,
                            rgba(0, 255, 255, 0.06) 2px
                        );
                    pointer-events: none;
                    z-index: 9998;
                    animation: vhs-flicker 0.05s infinite;
                }
                
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(
                            ellipse at center,
                            transparent 30%,
                            rgba(0, 0, 0, 0.3) 100%
                        ),
                        linear-gradient(
                            45deg,
                            rgba(255, 0, 100, 0.04) 0%,
                            transparent 30%,
                            transparent 70%,
                            rgba(0, 255, 200, 0.04) 100%
                        );
                    pointer-events: none;
                    z-index: 9999;
                    animation: vhs-noise 0.1s infinite;
                }
                
                @keyframes vhs-flicker {
                    0% { opacity: 0.9; }
                    50% { opacity: 1; }
                    95% { opacity: 0.95; }
                    100% { opacity: 0.88; }
                }
                
                @keyframes vhs-distortion {
                    0% { transform: translateX(0) skewX(0deg); }
                    2% { transform: translateX(-1.5px) skewX(0.05deg); }
                    4% { transform: translateX(1.5px) skewX(-0.05deg); }
                    6% { transform: translateX(0) skewX(0deg); }
                    94% { transform: translateX(0) skewX(0deg); }
                    96% { transform: translateX(-1px) skewX(0.02deg); }
                    98% { transform: translateX(1px) skewX(-0.02deg); }
                    100% { transform: translateX(0) skewX(0deg); }
                }
                
                @keyframes vhs-noise {
                    0% { opacity: 0.85; }
                    25% { opacity: 0.92; }
                    50% { opacity: 0.88; }
                    75% { opacity: 0.95; }
                    100% { opacity: 0.82; }
                }
            `;
            
            return vhsEffects;
        }
        
        return baseFilter;
    }, [filters, colorScheme]);
    
    const backgroundStyle = useMemo(() => {
        return `background-color: ${backgroundColor} !important;`;
    }, [backgroundColor]);
    
    const combinedStyle = useMemo(() => {
        return filterStyle + ' ' + backgroundStyle;
    }, [filterStyle, backgroundStyle]);
    
    const updatePreview = useCallback(() => {
        setPreviewCode(injectStyleIntoCode(activeCode, combinedStyle));
    }, [activeCode, combinedStyle]);

    useEffect(() => {
        updatePreview();
    }, [updatePreview]);


    const handleDownload = () => {
        if (!mp4Url) return;
        const a = document.createElement('a');
        a.href = mp4Url;
        a.download = `animation-${Date.now()}.${videoFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleClear = useCallback(() => {
        // Abort any ongoing capture loop
        abortRef.current = true;
        if (timerRef.current !== null) {
            try { clearTimeout(timerRef.current); } catch {}
            timerRef.current = null;
        }
        // Stop MediaRecorder if present
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            try {
                mediaRecorderRef.current.stop();
            } catch (error) {
                console.warn('Error stopping MediaRecorder:', error);
            }
        }
        mediaRecorderRef.current = null;
        
        // Stop media stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        
        chunksRef.current = [];
        finalizedRef.current = false;
        setIsGenerating(false);
        setProgress('');
        setMp4Url(null);
        setVideoFormat('mp4');
        // Reset crop and export settings
        setCropTop(0);
        setCropBottom(0);
        setCropLeft(0);
        setCropRight(0);
        setLoopCount(1);
        setPlaybackSpeed(1);
        setBackgroundColor('#000000');
        // Do not reset code or effects; keep UI state
    }, []);

    const handleGenerateMp4 = useCallback(async () => {
        if (!iframeRef.current?.contentWindow?.document.body) {
            alert('Preview window is not ready.');
            return;
        }
        
        // Check MediaRecorder availability
        if (typeof MediaRecorder === 'undefined') {
            alert('MediaRecorder API is not available in your browser. Please use a modern browser.');
            return;
        }
        
        console.log('MediaRecorder availability:', {
            MediaRecorder: typeof MediaRecorder !== 'undefined',
            supportedTypes: [
                MediaRecorder.isTypeSupported('video/webm;codecs=vp9'),
                MediaRecorder.isTypeSupported('video/webm;codecs=vp8'), 
                MediaRecorder.isTypeSupported('video/mp4')
            ],
            userAgent: navigator.userAgent
        });
        setIsGenerating(true);
        setMp4Url(null);

        // We'll detect actual dimensions from the rendered scene
        let numericWidth = dimensions.width;
        let numericHeight = dimensions.height;
        
        // Create canvas for encoding
        const canvas = document.createElement('canvas');
        canvas.width = numericWidth;
        canvas.height = numericHeight;
        const ctx = canvas.getContext('2d')!;
        if (!ctx) {
            alert('Failed to get canvas context.');
            setIsGenerating(false);
            return;
        }

        // Prepare capture code with animation control (effects remain in CSS for preview consistency)
        const captureScript = `
            <script>
                // Pause all animations immediately (do not alter layout)
                document.addEventListener('DOMContentLoaded', function() {
                    // Pause all animations
                    const style = document.createElement('style');
                    style.textContent = '* { animation-play-state: paused; }';
                    document.head.appendChild(style);
                    window.animationStyleElement = style;
                });
                
                // Robust function: rebuild the animation shorthand per element with negative delays
                window.seekToTime = function(timeInSeconds) {
                    const elements = document.querySelectorAll('*');
                    elements.forEach(el => {
                        const cs = window.getComputedStyle(el);
                        if (!cs.animationName || cs.animationName === 'none') return;
                        const names = cs.animationName.split(',');
                        if (!names.length) return;
                        const durations = cs.animationDuration.split(',');
                        const timingFns = cs.animationTimingFunction.split(',');
                        const counts = cs.animationIterationCount.split(',');
                        const directions = cs.animationDirection.split(',');
                        const fillModes = cs.animationFillMode.split(',');
                        const assembled = names.map((n, i) => {
                            const durStr = (durations[Math.min(i, durations.length - 1)] || '1s').trim();
                            const dur = parseFloat(durStr) || 1;
                            const tf = (timingFns[Math.min(i, timingFns.length - 1)] || 'linear').trim();
                            const cntStr = (counts[Math.min(i, counts.length - 1)] || '1').trim();
                            const dir = (directions[Math.min(i, directions.length - 1)] || 'normal').trim();
                            const fm = (fillModes[Math.min(i, fillModes.length - 1)] || 'none').trim();
                            const infinite = cntStr === 'infinite' || parseFloat(cntStr) > 1;
                            const nd = -(infinite ? (timeInSeconds % dur) : timeInSeconds);
                            return n.trim() + ' ' + durStr + ' ' + tf + ' ' + nd + 's ' + cntStr + ' ' + dir + ' ' + fm + ' running';
                        }).join(', ');
                        el.style.animation = assembled;
                        void el.offsetWidth; // force reflow
                        
                    });
                    // Pause on the very next frame to freeze at sampled time
                    window.requestAnimationFrame(() => {
                        const elements2 = document.querySelectorAll('*');
                        elements2.forEach(el => { try { el.style.animationPlayState = 'paused'; } catch {} });
                    });
                };
</script>
        `;
        
        // Keep combinedStyle so preview and capture share the same CSS (canvas filters will enforce effects in final video)
        const captureCode = injectStyleIntoCode(activeCode, combinedStyle) + captureScript;
        
        console.log('Capture code:', captureCode.substring(0, 500) + '...');
        
        // Load the animation in the iframe
        iframeRef.current!.srcdoc = captureCode;
        await new Promise(resolve => { if (iframeRef.current) iframeRef.current.onload = resolve as () => void; });
        
        // Wait for animation to load and render
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Force a repaint
        let cw = iframeRef.current!.contentWindow!;
        if (cw && cw.document && cw.document.body) {
            cw.document.body.style.display = 'none';
            cw.document.body.offsetHeight; // Force reflow
            cw.document.body.style.display = '';
            
            // Wait for animations to stabilize
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Get target element
        cw = iframeRef.current!.contentWindow!;
        const doc = cw.document;
        let captureTargetElement = doc.querySelector<HTMLElement>('.scene');
        if (!captureTargetElement) {
            // Try to find a canvas element (for canvas-based animations)
            const canvas = doc.querySelector<HTMLElement>('canvas');
            if (canvas) {
                console.warn(`Capture selector ".scene" not found. Using canvas element.`);
                captureTargetElement = canvas;
            } else {
                console.warn(`Capture selector ".scene" not found. Falling back to document.body.`);
                captureTargetElement = doc.body as HTMLElement;
            }
        }
        
        // Detect actual rendered dimensions from the scene element
        const elementRect = captureTargetElement.getBoundingClientRect();
        numericWidth = Math.round(elementRect.width);
        numericHeight = Math.round(elementRect.height);
        
        console.log(`Detected scene dimensions: ${numericWidth}x${numericHeight}`);
        console.log(`Will capture at ${fps} FPS for ${duration} seconds (${Math.floor(duration * fps)} frames)`);
        
        // Use the full dimensions of the scene element
        let targetW = Math.max(2, Math.floor(elementRect.width));
        let targetH = Math.max(2, Math.floor(elementRect.height));
        
        // Ensure even dimensions for H.264
        if (targetW % 2 !== 0) targetW += 1;
        if (targetH % 2 !== 0) targetH += 1;

        // Set canvas to target size
        canvas.width = targetW;
        canvas.height = targetH;
        
        // Crop values are now used directly in frame capture
        
        // Initialize MediaRecorder approach
        abortRef.current = false;
        finalizedRef.current = false;
        chunksRef.current = [];
        
        console.log(`Initializing MediaRecorder at ${targetW}x${targetH}, ${fps}FPS`);
        
        // Create a MediaStream from the canvas
        const stream = canvas.captureStream(fps);
        streamRef.current = stream;
        
        // Prioritize MP4 for better compatibility with QuickTime
        let mimeType = 'video/mp4';
        let fileExtension = 'mp4';
        
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            // Try H.264 in MP4 container
            mimeType = 'video/mp4; codecs="avc1.42E01E"';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                // Fall back to WebM formats
                mimeType = 'video/webm;codecs=vp9';
                fileExtension = 'webm';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'video/webm;codecs=vp8';
                    if (!MediaRecorder.isTypeSupported(mimeType)) {
                        mimeType = 'video/webm';
                        if (!MediaRecorder.isTypeSupported(mimeType)) {
                            alert('Your browser does not support video recording. Please try Chrome or Firefox.');
                            setIsGenerating(false);
                            return;
                        }
                    }
                }
            }
        }
        
        console.log(`Using codec: ${mimeType} (${fileExtension} format)`);
        
        
        // Create MediaRecorder with higher bitrate for VHS quality
        const adjustedBitrate = colorScheme === 'vhs' ? bitrateMbps * 1.5 : bitrateMbps;
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: mimeType,
            videoBitsPerSecond: adjustedBitrate * 1_000_000
        });
        
        mediaRecorderRef.current = mediaRecorder;
        
        // Set up data handling
        mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                console.log(`MediaRecorder chunk received: ${event.data.size} bytes`);
                chunksRef.current.push(event.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            console.log('MediaRecorder stopped, processing final video...');
            
            if (chunksRef.current.length === 0) {
                console.error('No video chunks recorded');
                alert('No video data was recorded. Please try again.');
                setIsGenerating(false);
                return;
            }
            
            // Create the final video blob
            const videoBlob = new Blob(chunksRef.current, { type: mimeType });
            console.log(`Final video blob created: ${videoBlob.size} bytes, format: ${fileExtension}`);
            
            const url = URL.createObjectURL(videoBlob);
            setMp4Url(url);
            setVideoFormat(fileExtension);
            setProgress(`Done! (${fileExtension.toUpperCase()} format)`);
            setIsGenerating(false);
            
            if (fileExtension === 'webm') {
                console.warn('Generated WebM format - QuickTime may not support this. Try VLC or Chrome for playback.');
            }
            
            console.log('Video generation completed successfully');
        };
        
        mediaRecorder.onerror = (event) => {
            console.error('MediaRecorder error:', event);
            alert('Recording error occurred. Please try again.');
            setIsGenerating(false);
        };
        
        console.log('MediaRecorder configured successfully, preparing to record...');
        
        // Initialize animation and wait for it to be ready before starting recording
        setProgress('Preparing animation...');
        
        // Ensure animation is started and running before we begin recording
        if (iframeRef.current?.contentWindow?.seekToTime) {
            iframeRef.current.contentWindow.seekToTime(0);
        }
        
        // Wait for animation to initialize and render first frame
        await new Promise(resolve => setTimeout(resolve, 300));
        
        console.log('Starting MediaRecorder...');
        mediaRecorder.start(1000); // Request data every second

        let frameCount = 0;
        const framesPerLoop = Math.max(1, Math.floor((duration * fps) / Math.max(0.001, playbackSpeed)));
        const totalFrames = framesPerLoop * Math.max(1, loopCount);

        setProgress('Capturing frames...');
        console.log(`Starting capture of ${totalFrames} frames (${framesPerLoop} frames x ${Math.max(1, loopCount)} loops) at ${fps} FPS`);
        
        const captureFrame = async () => {
            if (abortRef.current || frameCount >= totalFrames) {
                console.log(`Finalization triggered: abort=${abortRef.current}, frameCount=${frameCount}, totalFrames=${totalFrames}`);
                if (timerRef.current !== null) { try { clearTimeout(timerRef.current); } catch {} timerRef.current = null; }
                if (!finalizedRef.current) {
                    finalizedRef.current = true;
                    try {
                        console.log('Stopping MediaRecorder...');
                        
                        // Stop the MediaRecorder - this will trigger the onstop event
                        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                            mediaRecorderRef.current.stop();
                        }
                        
                        // Stop the media stream
                        if (streamRef.current) {
                            streamRef.current.getTracks().forEach(track => track.stop());
                        }
                        
                        console.log('Recording finalization initiated');
                        // The actual finalization happens in the onstop callback
                    } catch (error) {
                        console.error('Error finalizing recording:', {
                            error: error instanceof Error ? error.message : String(error),
                            stack: error instanceof Error ? error.stack : undefined,
                            recorderState: mediaRecorderRef.current?.state,
                            frameCount: frameCount,
                            timestamp: Date.now()
                        });
                        const errorMsg = error instanceof Error ? error.message : String(error);
                        alert('Error finalizing recording: ' + errorMsg);
                        setIsGenerating(false);
                    }
                }
                return;
            }

            try {
                const elapsed = (frameCount / fps) * playbackSpeed;
                const timeInLoop = duration > 0 ? (elapsed % duration) : 0;
                
                console.log(`[Frame ${frameCount + 1}/${totalFrames}] Seeking to time ${timeInLoop.toFixed(3)}s`);
                
                // Seek animations to current time in loop
                if (iframeRef.current?.contentWindow?.seekToTime) {
                    iframeRef.current.contentWindow.seekToTime(timeInLoop);
                }

                // Small delay to allow animation state to update
                await new Promise<void>((resolve) => setTimeout(resolve, 2));

                // Wait for next paint(s) in the iframe
                await new Promise<void>((resolve) => {
                    const raf = cw.requestAnimationFrame.bind(cw);
                    if (fastMode) {
                        raf(() => resolve());
                    } else {
                        raf(() => raf(() => resolve()));
                    }
                });

                console.log(`[Frame ${frameCount + 1}/${totalFrames}] Capturing...`);

                // Capture the target element fully; if it's a canvas, use it directly
                let fullCanvas: HTMLCanvasElement;
                if (captureTargetElement.tagName && captureTargetElement.tagName.toLowerCase() === 'canvas') {
                    fullCanvas = captureTargetElement as HTMLCanvasElement;
                } else {
                    // Capture the entire document body to include pseudo-elements and effects
                    const bodyElement = cw.document.body;
                    fullCanvas = await window.html2canvas(bodyElement, {
                        scale: 2, // Higher scale for better quality
                        useCORS: true,
                        allowTaint: true,
                        logging: false,
                        backgroundColor: backgroundColor, // Use selected background color
                        letterRendering: true,
                        imageTimeout: 0,
                        width: bodyElement.scrollWidth,
                        height: bodyElement.scrollHeight,
                        ignoreElements: (_element: any) => {
                            // Don't ignore any elements - we want everything including pseudo-elements
                            return false;
                        },
                        onclone: (clonedDoc: any, _element: any) => {
                            // Ensure all styles are properly applied to cloned document
                            const originalStyles = cw.getComputedStyle(cw.document.body);
                            if (clonedDoc.body) {
                                clonedDoc.body.style.filter = originalStyles.filter;
                                clonedDoc.body.style.backgroundColor = originalStyles.backgroundColor;
                                clonedDoc.body.style.animation = originalStyles.animation;
                            }
                        },
                        // Enable foreign object rendering for better effect support
                        foreignObjectRendering: true,
                        // Capture animations and transitions
                        removeContainer: false
                    });
                }
                
                // Validate captured canvas
                if (!fullCanvas || fullCanvas.width === 0 || fullCanvas.height === 0) {
                    throw new Error(`Frame ${frameCount + 1}: Invalid canvas capture`);
                }
                
                console.log(`[Frame ${frameCount + 1}/${totalFrames}] Captured canvas: ${fullCanvas.width}x${fullCanvas.height}`);
                
                // Draw to our recording canvas with proper scaling
                ctx.clearRect(0, 0, targetW, targetH);
                
                // html2canvas uses 2x scale for better quality
                
                // Calculate the visible area after crop
                const visibleWidth = fullCanvas.width - cropLeft - cropRight;
                const visibleHeight = fullCanvas.height - cropTop - cropBottom;
                
                // Calculate the scale to fit the visible area in the target dimensions
                const scaleX = targetW / visibleWidth;
                const scaleY = targetH / visibleHeight;
                const scale = Math.min(scaleX, scaleY);
                
                // Calculate the position to center the visible area
                const scaledWidth = visibleWidth * scale;
                const scaledHeight = visibleHeight * scale;
                const offsetX = (targetW - scaledWidth) / 2;
                const offsetY = (targetH - scaledHeight) / 2;
                
                // Clear the canvas with background color
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, targetW, targetH);
                
                // Save the context state
                ctx.save();
                
                // Build comprehensive filter string matching preview exactly
                let filterString = '';
                
                // Base filters
                filterString += `brightness(${filters.brightness}%) `;
                filterString += `contrast(${filters.contrast}%) `;
                filterString += `saturate(${filters.saturate}%) `;
                filterString += `grayscale(${filters.grayscale}%) `;
                filterString += `sepia(${filters.sepia}%) `;
                filterString += `invert(${filters.invert}%)`;
                
                // Apply VHS effect if selected - match the CSS implementation
                if (colorScheme === 'vhs') {
                    // Apply VHS-specific adjustments (matching the CSS logic in filterStyle)
                    const vhsBrightness = filters.brightness * 0.9;
                    const vhsContrast = filters.contrast * 1.2;
                    const vhsSaturate = filters.saturate * 1.4;
                    
                    filterString = `brightness(${vhsBrightness}%) contrast(${vhsContrast}%) saturate(${vhsSaturate}%) sepia(30%) hue-rotate(320deg) grayscale(${filters.grayscale}%) invert(${filters.invert}%)`;
                }
                
                // Draw the cropped and scaled content first
                ctx.filter = filterString;
                ctx.drawImage(
                    fullCanvas,
                    cropLeft,
                    cropTop,
                    visibleWidth,
                    visibleHeight,
                    offsetX,
                    offsetY,
                    scaledWidth,
                    scaledHeight
                );

                // Apply pixel-level filters for cases where ctx.filter is ignored by encoder
                ctx.filter = 'none';
                const frameImageData = ctx.getImageData(0, 0, targetW, targetH);
                applyFiltersToImageData(frameImageData, filters, colorScheme);
                ctx.putImageData(frameImageData, 0, 0);

                if (colorScheme === 'vhs') {
                    applyVhsOverlay(ctx, targetW, targetH);
                }

                ctx.restore();
                
                // The canvas stream automatically captures this frame for MediaRecorder
                console.log(`[Frame ${frameCount + 1}] Frame drawn to canvas - MediaRecorder will capture it automatically`);
                
                // Add a small delay to ensure the frame is properly captured
                await new Promise(resolve => setTimeout(resolve, 5));

                setProgress(`Capturing frame ${frameCount + 1} of ${totalFrames}`);
                frameCount++;
                
                if (!abortRef.current) {
                    try { if (timerRef.current !== null) clearTimeout(timerRef.current); } catch {}
                    // Delay to allow encoder to process the frame
                    timerRef.current = window.setTimeout(captureFrame, 50);
                }
            } catch (error) {
                console.error('Error capturing frame:', error);
                abortRef.current = true;
                setIsGenerating(false);
                alert('An error occurred during frame capture: ' + (error instanceof Error ? error.message : String(error)));
            }
        };

        // Start capturing
        try { if (timerRef.current !== null) clearTimeout(timerRef.current); } catch {}
        timerRef.current = window.setTimeout(captureFrame, 0);
    }, [activeCode, combinedStyle, filters, colorScheme, backgroundColor, duration, fps, dimensions, isGenerating, cropTop, cropBottom, cropLeft, cropRight, bitrateMbps, keyInterval, fastMode, loopCount, playbackSpeed]);

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
            <Header 
                title="editor.js"
                editorMode={editorMode}
                onEditorModeChange={(mode) => setEditorMode(mode as EditorMode)}
                onPreview={() => {}}
                onGenerate={handleGenerateMp4}
                onClear={handleClear}
                isGenerating={isGenerating}
            />
            <main className="flex-grow w-full px-0 py-0 flex flex-col lg:flex-row gap-0 h-[calc(100vh-52px)] overflow-hidden">
                <div className="lg:w-1/2 flex flex-col gap-0 min-h-0 border-r border-gray-700">
                    <div className="flex-grow min-h-0 flex flex-col bg-gray-900 overflow-hidden">
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
                <div className="lg:w-1/2 flex flex-col gap-0 min-h-0">
                    <div className="flex-1 min-h-0 flex flex-col bg-gray-900 overflow-hidden">
                        <PreviewPanel 
                            previewCode={previewCode} 
                            mp4Url={mp4Url} 
                            isGenerating={isGenerating} 
                            progress={progress} 
                            iframeRef={iframeRef} 
                            dimensions={dimensions} 
                            backgroundColor={backgroundColor}
                            onDownload={handleDownload}
                            cropTop={cropTop}
                            cropBottom={cropBottom}
                            cropLeft={cropLeft}
                            cropRight={cropRight}
                        />
                    </div>
                    <div className="flex-1 min-h-0 flex flex-col">
                        <TabbedSettingsPanel 
                            cropTop={cropTop}
                            setCropTop={setCropTop}
                            cropBottom={cropBottom}
                            setCropBottom={setCropBottom}
                            cropLeft={cropLeft}
                            setCropLeft={setCropLeft}
                            cropRight={cropRight}
                            setCropRight={setCropRight}
                            loopCount={loopCount}
                            setLoopCount={setLoopCount}
                            playbackSpeed={playbackSpeed}
                            setPlaybackSpeed={setPlaybackSpeed}
                            backgroundColor={backgroundColor}
                            setBackgroundColor={setBackgroundColor}
                            colorScheme={colorScheme}
                            setColorScheme={setColorScheme}
                            filters={filters}
                            setFilterValue={setFilterValue}
                            onResetEffects={handleResetFilters}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
