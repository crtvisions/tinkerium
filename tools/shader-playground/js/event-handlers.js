import { presetConfigs } from './preset-configs.js';

export function setupEventHandlers(params, textSystem, updateShaderCallback, exportSystem, webglManager) {
    // Color inputs
    document.getElementById('color1').addEventListener('input', (e) => {
        params.color1 = e.target.value;
        textSystem.updateTexture(params);
        updateShaderCallback();
    });
    
    document.getElementById('color2').addEventListener('input', (e) => {
        params.color2 = e.target.value;
        textSystem.updateTexture(params);
        updateShaderCallback();
    });
    
    document.getElementById('bgColor').addEventListener('input', (e) => {
        params.bgColor = e.target.value;
        updateShaderCallback();
    });
    
    // Pattern buttons
    document.querySelectorAll('[data-pattern]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-pattern]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            params.pattern = btn.dataset.pattern;
            updateShaderCallback();
        });
    });
    
    // Sliders
    document.getElementById('scale').addEventListener('input', (e) => {
        params.scale = parseFloat(e.target.value);
        document.getElementById('scaleValue').textContent = params.scale.toFixed(1);
        updateShaderCallback();
    });
    
    document.getElementById('speed').addEventListener('input', (e) => {
        params.speed = parseFloat(e.target.value);
        document.getElementById('speedValue').textContent = params.speed.toFixed(1);
        updateShaderCallback();
    });
    
    document.getElementById('complexity').addEventListener('input', (e) => {
        params.complexity = parseInt(e.target.value);
        document.getElementById('complexityValue').textContent = params.complexity;
        updateShaderCallback();
    });
    
    // Setup all effect toggles
    setupEffectToggle('effectScanlines', 'scanlines', 'scanlineParams', params, updateShaderCallback);
    setupEffectToggle('effectGlow', 'glow', 'glowParams', params, updateShaderCallback);
    setupEffectToggle('effectDistortion', 'distortion', 'distortParams', params, updateShaderCallback);
    setupEffectToggle('effectVignette', 'vignette', 'vignetteParams', params, updateShaderCallback);
    setupEffectToggle('effectNoise', 'noise', 'noiseParams', params, updateShaderCallback);
    setupEffectToggle('effectRGB', 'rgbSplit', 'rgbParams', params, updateShaderCallback);
    setupEffectToggle('effectPixelate', 'pixelate', 'pixelateParams', params, updateShaderCallback);
    setupEffectToggle('effectKaleidoscope', 'kaleidoscope', 'kaleidoParams', params, updateShaderCallback);
    setupEffectToggle('effectChromatic', 'chromaticAberration', 'chromaticParams', params, updateShaderCallback);
    setupEffectToggle('effectBloom', 'bloom', 'bloomParams', params, updateShaderCallback);
    setupEffectToggle('effectSwirl', 'swirl', 'swirlParams', params, updateShaderCallback);
    
    document.getElementById('effectInvert').addEventListener('change', (e) => {
        params.invert = e.target.checked;
        updateShaderCallback();
    });
    
    setupEffectToggle('effectPosterize', 'posterize', 'posterizeParams', params, updateShaderCallback);
    setupEffectToggle('effectEdgeDetect', 'edgeDetect', 'edgeParams', params, updateShaderCallback);
    setupEffectToggle('effectZoomBlur', 'zoomBlur', 'zoomParams', params, updateShaderCallback);
    setupEffectToggle('effectMirror', 'mirror', 'mirrorParams', params, updateShaderCallback);
    setupEffectToggle('effectThermal', 'thermal', 'thermalParams', params, updateShaderCallback);
    setupEffectToggle('effectRipple', 'ripple', 'rippleParams', params, updateShaderCallback);
    
    // Effect parameter sliders
    setupSlider('scanlineIntensity', 'scanlineValue', 'scanlineIntensity', params, updateShaderCallback, 2);
    setupSlider('glowStrength', 'glowValue', 'glowStrength', params, updateShaderCallback, 1);
    setupSlider('distortAmount', 'distortValue', 'distortAmount', params, updateShaderCallback, 2);
    setupSlider('vignetteRadius', 'vignetteValue', 'vignetteRadius', params, updateShaderCallback, 2);
    setupSlider('noiseAmount', 'noiseValue', 'noiseAmount', params, updateShaderCallback, 2);
    setupSlider('rgbOffset', 'rgbValue', 'rgbOffset', params, updateShaderCallback, 3);
    setupSlider('pixelSize', 'pixelValue', 'pixelSize', params, updateShaderCallback, 0);
    setupSlider('kaleidoSegments', 'kaleidoValue', 'kaleidoSegments', params, updateShaderCallback, 0);
    setupSlider('chromaticAmount', 'chromaticValue', 'chromaticAmount', params, updateShaderCallback, 3);
    setupSlider('bloomStrength', 'bloomValue', 'bloomStrength', params, updateShaderCallback, 1);
    setupSlider('swirlStrength', 'swirlValue', 'swirlStrength', params, updateShaderCallback, 1);
    setupSlider('posterizeLevels', 'posterizeValue', 'posterizeLevels', params, updateShaderCallback, 0);
    setupSlider('edgeStrength', 'edgeValue', 'edgeStrength', params, updateShaderCallback, 1);
    setupSlider('zoomStrength', 'zoomValue', 'zoomStrength', params, updateShaderCallback, 3);
    setupSlider('thermalIntensity', 'thermalValue', 'thermalIntensity', params, updateShaderCallback, 1);
    setupSlider('rippleStrength', 'rippleValue', 'rippleStrength', params, updateShaderCallback, 2);
    
    // Mirror mode buttons
    document.querySelectorAll('[data-mirror]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-mirror]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            params.mirrorMode = btn.dataset.mirror;
            if (params.mirror) updateShaderCallback();
        });
    });
    
    // Preset buttons
    setupPresetButtons(params, textSystem, updateShaderCallback);
    
    // Random button
    setupRandomButton(params, textSystem, updateShaderCallback);
    
    // View code button
    document.getElementById('viewCodeBtn').addEventListener('click', async () => {
        const { generateShader } = await import('./shader-generator.js');
        const code = generateShader(params);
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    
    // Export modal controls
    document.getElementById('exportBtn').addEventListener('click', () => {
        document.getElementById('exportModal').style.display = 'flex';
    });
    
    document.getElementById('closeExportBtn').addEventListener('click', () => {
        document.getElementById('exportModal').style.display = 'none';
    });
    
    // Export buttons
    document.getElementById('exportPNG').addEventListener('click', () => {
        exportSystem.exportPNG();
    });
    
    document.getElementById('exportGIF').addEventListener('click', async () => {
        document.getElementById('exportModal').style.display = 'none';
        await exportSystem.exportGIF();
    });
    
    document.getElementById('exportVideo').addEventListener('click', () => {
        document.getElementById('exportModal').style.display = 'none';
        startRecordingUI(exportSystem);
    });
    
    // Record button
    document.getElementById('recordBtn').addEventListener('click', () => {
        if (exportSystem.isCurrentlyRecording()) {
            stopRecordingUI(exportSystem);
        } else {
            startRecordingUI(exportSystem);
        }
    });
    
    // Time speed
    document.getElementById('timeSpeed').addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        webglManager.setTimeMultiplier(value);
        document.getElementById('timeSpeedValue').textContent = value.toFixed(1);
    });
    
    // Text controls
    setupTextControls(textSystem, params, updateShaderCallback);
    
    // Animation controls
    return setupAnimationControls();
}

function setupEffectToggle(checkboxId, paramKey, paramsId, params, updateShaderCallback) {
    document.getElementById(checkboxId).addEventListener('change', (e) => {
        params[paramKey] = e.target.checked;
        if (paramsId) {
            document.getElementById(paramsId).classList.toggle('active', e.target.checked);
        }
        updateShaderCallback();
    });
}

function setupSlider(sliderId, valueId, paramKey, params, updateShaderCallback, decimals) {
    document.getElementById(sliderId).addEventListener('input', (e) => {
        const value = decimals === 0 ? parseInt(e.target.value) : parseFloat(e.target.value);
        params[paramKey] = value;
        document.getElementById(valueId).textContent = decimals === 0 ? value : value.toFixed(decimals);
        updateShaderCallback();
    });
}

function setupPresetButtons(params, textSystem, updateShaderCallback) {
    document.querySelectorAll('[data-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = presetConfigs[btn.dataset.preset];
            if (!preset) return;
            
            // Store current colors before applying preset
            const currentColor1 = params.color1;
            const currentColor2 = params.color2;
            const currentBgColor = params.bgColor;
            
            // Reset ALL effects first
            Object.assign(params, {
                scanlines: false, glow: false, distortion: false,
                vignette: false, noise: false, rgbSplit: false,
                pixelate: false, kaleidoscope: false, chromaticAberration: false,
                bloom: false, swirl: false, invert: false, posterize: false,
                edgeDetect: false, zoomBlur: false, mirror: false,
                thermal: false, ripple: false
            });
            Object.assign(params, preset);
            
            // Restore user's color choices
            params.color1 = currentColor1;
            params.color2 = currentColor2;
            params.bgColor = currentBgColor;
            
            // Update UI
            updateUIFromParams(params);
            
            textSystem.updateTexture(params);
            updateShaderCallback();
        });
    });
}

function updateUIFromParams(params) {
    document.getElementById('scale').value = params.scale;
    document.getElementById('scaleValue').textContent = params.scale.toFixed(1);
    document.getElementById('speed').value = params.speed;
    document.getElementById('speedValue').textContent = params.speed.toFixed(1);
    document.getElementById('complexity').value = params.complexity;
    document.getElementById('complexityValue').textContent = params.complexity;
    
    document.querySelectorAll('[data-pattern]').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-pattern="${params.pattern}"]`)?.classList.add('active');
    
    // Update all effect checkboxes
    document.getElementById('effectScanlines').checked = params.scanlines || false;
    document.getElementById('effectGlow').checked = params.glow || false;
    document.getElementById('effectDistortion').checked = params.distortion || false;
    document.getElementById('effectVignette').checked = params.vignette || false;
    document.getElementById('effectNoise').checked = params.noise || false;
    document.getElementById('effectRGB').checked = params.rgbSplit || false;
    
    // Toggle params panels
    document.getElementById('scanlineParams').classList.toggle('active', params.scanlines);
    document.getElementById('glowParams').classList.toggle('active', params.glow);
    document.getElementById('distortParams').classList.toggle('active', params.distortion);
    document.getElementById('vignetteParams').classList.toggle('active', params.vignette);
    document.getElementById('noiseParams').classList.toggle('active', params.noise);
    document.getElementById('rgbParams').classList.toggle('active', params.rgbSplit);
}

function setupRandomButton(params, textSystem, updateShaderCallback) {
    document.getElementById('randomBtn').addEventListener('click', () => {
        params.color1 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        params.color2 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        params.bgColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        params.scale = Math.random() * 15 + 2;
        params.speed = Math.random() * 3;
        params.complexity = Math.floor(Math.random() * 6) + 2;
        params.pattern = ['waves', 'circles', 'grid', 'spiral', 'dots', 'stripes', 'radial', 'voronoi'][Math.floor(Math.random() * 8)];
        
        document.getElementById('color1').value = params.color1;
        document.getElementById('color2').value = params.color2;
        document.getElementById('bgColor').value = params.bgColor;
        document.getElementById('scale').value = params.scale;
        document.getElementById('scaleValue').textContent = params.scale.toFixed(1);
        document.getElementById('speed').value = params.speed;
        document.getElementById('speedValue').textContent = params.speed.toFixed(1);
        document.getElementById('complexity').value = params.complexity;
        document.getElementById('complexityValue').textContent = params.complexity;
        
        document.querySelectorAll('[data-pattern]').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-pattern="${params.pattern}"]`).classList.add('active');
        
        updateShaderCallback();
    });
}

function setupTextControls(textSystem, shaderParams, updateShaderCallback) {
    const textParams = textSystem.getParams();
    
    document.getElementById('animText').addEventListener('input', (e) => {
        textParams.text = e.target.value || 'SHADER';
        textSystem.updateTexture(shaderParams);
    });
    
    document.getElementById('textFont').addEventListener('change', (e) => {
        textParams.font = e.target.value;
        textSystem.updateTexture(shaderParams);
    });
    
    document.getElementById('fontSize').addEventListener('input', (e) => {
        textParams.fontSize = parseInt(e.target.value);
        document.getElementById('fontSizeValue').textContent = textParams.fontSize;
        textSystem.updateTexture(shaderParams);
    });
    
    document.querySelectorAll('[data-weight]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-weight]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            textParams.fontWeight = btn.dataset.weight;
            textSystem.updateTexture(shaderParams);
        });
    });
    
    document.querySelectorAll('[data-color]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-color]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            textParams.colorMode = btn.dataset.color;
            const colorPicker = document.getElementById('textColor');
            colorPicker.style.display = textParams.colorMode === 'solid' ? 'block' : 'none';
            textSystem.updateTexture(shaderParams);
        });
    });
    
    document.getElementById('textColor').addEventListener('input', (e) => {
        textParams.solidColor = e.target.value;
        textSystem.updateTexture(shaderParams);
    });
    
    document.getElementById('textOutline').addEventListener('change', (e) => {
        textParams.outline = e.target.checked;
        document.getElementById('outlineParams').classList.toggle('active', e.target.checked);
        textSystem.updateTexture(shaderParams);
    });
    
    document.getElementById('outlineWidth').addEventListener('input', (e) => {
        textParams.outlineWidth = parseInt(e.target.value);
        document.getElementById('outlineWidthValue').textContent = textParams.outlineWidth;
        textSystem.updateTexture(shaderParams);
    });
    
    document.getElementById('outlineColor').addEventListener('input', (e) => {
        textParams.outlineColor = e.target.value;
        textSystem.updateTexture(shaderParams);
    });
    
    document.getElementById('textShadow').addEventListener('change', (e) => {
        textParams.shadow = e.target.checked;
        document.getElementById('shadowParams').classList.toggle('active', e.target.checked);
        textSystem.updateTexture(shaderParams);
    });
    
    document.getElementById('shadowBlur').addEventListener('input', (e) => {
        textParams.shadowBlur = parseInt(e.target.value);
        document.getElementById('shadowBlurValue').textContent = textParams.shadowBlur;
        textSystem.updateTexture(shaderParams);
    });
    
    document.getElementById('shadowColor').addEventListener('input', (e) => {
        textParams.shadowColor = e.target.value;
        textSystem.updateTexture(shaderParams);
    });
    
    document.getElementById('textDistort').addEventListener('input', (e) => {
        textParams.distortion = parseFloat(e.target.value);
        document.getElementById('textDistortValue').textContent = textParams.distortion.toFixed(1);
    });
    
    document.getElementById('textEnabled').addEventListener('change', (e) => {
        textParams.enabled = e.target.checked;
    });
}

function setupAnimationControls() {
    let animationPattern = null;
    let animationIntensity = 1.0;
    
    document.querySelectorAll('[data-anim]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-anim]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            animationPattern = btn.dataset.anim;
        });
    });
    
    document.getElementById('animIntensity').addEventListener('input', (e) => {
        animationIntensity = parseFloat(e.target.value);
        document.getElementById('animIntensityValue').textContent = animationIntensity.toFixed(1);
    });
    
    document.getElementById('clearAnimBtn').addEventListener('click', () => {
        document.querySelectorAll('[data-anim]').forEach(b => b.classList.remove('active'));
        animationPattern = null;
    });
    
    return {
        getAnimationPattern: () => animationPattern,
        getAnimationIntensity: () => animationIntensity
    };
}

function startRecordingUI(exportSystem) {
    exportSystem.startRecording((timeString) => {
        document.getElementById('recordTime').textContent = timeString;
    });
    document.getElementById('recordingIndicator').style.display = 'block';
    document.getElementById('recordBtn').textContent = '⏹️ STOP';
    document.getElementById('recordBtn').style.background = '#f00';
}

function stopRecordingUI(exportSystem) {
    exportSystem.stopRecording();
    document.getElementById('recordingIndicator').style.display = 'none';
    document.getElementById('recordBtn').textContent = '🎬 RECORD';
    document.getElementById('recordBtn').style.background = '';
}
