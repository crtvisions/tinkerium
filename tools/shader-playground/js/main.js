import { generateShader } from './shader-generator.js';
import { WebGLManager } from './webgl-setup.js';
import { TextSystem } from './text-system.js';
import { ExportSystem } from './export-system.js';
import { setupEventHandlers } from './event-handlers.js';
import { initCollapsibleSections, autoCollapseSections } from './ui-animations.js';

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('shaderCanvas');
    const fpsDisplay = document.getElementById('fpsDisplay');
    const resDisplay = document.getElementById('resDisplay');
    const statusText = document.getElementById('statusText');
    const errorDisplay = document.getElementById('errorDisplay');
    
    // Initialize managers
    const webglManager = new WebGLManager(canvas);
    
    // Resize canvas initially
    const { width, height } = webglManager.resizeCanvas();
    resDisplay.textContent = `${width}x${height}`;
    
    // Initialize text system
    const textSystem = new TextSystem(webglManager.gl, width, height);
    
    // Initialize export system
    const exportSystem = new ExportSystem(canvas, (status) => {
        statusText.textContent = status;
        if (status.includes('✓')) {
            setTimeout(() => statusText.textContent = 'RUNNING', 2000);
        }
    });
    
    // Shader parameters
    const params = {
        color1: '#00ff00',
        color2: '#0000ff',
        bgColor: '#000000',
        pattern: 'waves',
        scale: 5.0,
        speed: 1.0,
        complexity: 3,
        scanlines: false,
        scanlineIntensity: 0.5,
        glow: false,
        glowStrength: 0.5,
        distortion: false,
        distortAmount: 0.05,
        vignette: false,
        vignetteRadius: 0.7,
        noise: false,
        noiseAmount: 0.1,
        rgbSplit: false,
        rgbOffset: 0.01,
        pixelate: false,
        pixelSize: 8,
        kaleidoscope: false,
        kaleidoSegments: 6,
        chromaticAberration: false,
        chromaticAmount: 0.02,
        bloom: false,
        bloomStrength: 0.8,
        swirl: false,
        swirlStrength: 2.0,
        invert: false,
        posterize: false,
        posterizeLevels: 4,
        edgeDetect: false,
        edgeStrength: 1.0,
        zoomBlur: false,
        zoomStrength: 0.02,
        mirror: false,
        mirrorMode: 'horizontal',
        thermal: false,
        thermalIntensity: 1.0,
        ripple: false,
        rippleStrength: 0.1
    };
    
    // Update shader function with debouncing
    let updateTimeout = null;
    function updateShader() {
        // Clear any pending updates
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }
        
        // Debounce shader compilation to avoid excessive recompiles during slider drag
        updateTimeout = setTimeout(() => {
            const shader = generateShader(params);
            const result = webglManager.createProgram(shader);
            
            if (result.success) {
                errorDisplay.classList.remove('show');
                statusText.textContent = 'COMPILED ✓';
                setTimeout(() => statusText.textContent = 'RUNNING', 2000);
            } else {
                errorDisplay.textContent = 'ERROR: ' + result.error;
                errorDisplay.classList.add('show');
                statusText.textContent = 'ERROR';
            }
        }, 50); // 50ms debounce
    }
    
    // Setup event handlers
    const animationState = setupEventHandlers(params, textSystem, updateShader, exportSystem, webglManager);
    
    // Window resize handler
    window.addEventListener('resize', () => {
        const { width, height } = webglManager.resizeCanvas();
        resDisplay.textContent = `${width}x${height}`;
        textSystem.resize(width, height);
        textSystem.updateTexture(params);
    });
    
    // Initialize UI animations
    initCollapsibleSections();
    autoCollapseSections();
    
    // Initialize and start rendering
    textSystem.updateTexture(params);
    updateShader();
    
    // Start render loop with FPS tracking
    let lastFps = 0;
    let animationId = null;
    
    function renderLoop() {
        const fps = webglManager.render(
            textSystem.getTexture(),
            textSystem.getParams(),
            animationState.getAnimationPattern(),
            animationState.getAnimationIntensity()
        );
        
        if (fps > 0) {
            lastFps = fps;
            fpsDisplay.textContent = fps;
        }
        
        animationId = requestAnimationFrame(renderLoop);
    }
    
    renderLoop();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        if (exportSystem.isCurrentlyRecording()) {
            exportSystem.stopRecording();
        }
    });
});
