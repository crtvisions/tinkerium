# Tinkerium Integration Guide

## 🎯 How to Use Shared Utilities Across Tools

This guide shows you how to integrate the new shared systems into your existing tools to create a unified aesthetic creation suite.

---

## 📚 Available Shared Utilities

### 1. Export System (`/shared/export-system.ts`)
Universal export functionality for PNG, GIF, and MP4 formats.

### 2. Aesthetic Presets (`/shared/aesthetic-presets.ts`)
10 predefined aesthetic styles with color palettes and effects.

### 3. Effects Library (`/shared/effects-library.ts`)
Reusable visual effects: CRT, glitch, color grading, noise, distortion.

### 4. UI Components
- `PresetSelector.tsx` - Aesthetic preset picker
- `ExportModal.tsx` - Export options modal

---

## 🚀 Quick Start: Integrating into a Tool

### Example: Adding Presets & Export to ASCII Art

#### Step 1: Import Shared Utilities

```typescript
// In your tool's main file (e.g., App.tsx)
import { AESTHETIC_PRESETS, AestheticPreset, applyColorPalette } from '../../shared/aesthetic-presets';
import { PresetSelector } from '../../shared/ui-components/PresetSelector';
import { ExportModal, ExportFormat, ExportOptions } from '../../shared/ui-components/ExportModal';
import { exportPNG, exportGIF, createVideoRecorder, VideoRecorder } from '../../shared/export-system';
```

#### Step 2: Add State for Presets

```typescript
const [currentPreset, setCurrentPreset] = useState<AestheticPreset | null>(null);
const [showExportModal, setShowExportModal] = useState(false);
const [videoRecorder, setVideoRecorder] = useState<VideoRecorder | null>(null);
const [recordingTime, setRecordingTime] = useState(0);
```

#### Step 3: Handle Preset Selection

```typescript
const handlePresetSelect = (preset: AestheticPreset) => {
  setCurrentPreset(preset);
  
  // Apply color palette to CSS variables
  applyColorPalette(preset.colors);
  
  // Update your tool's state based on preset
  // Example: Set colors, effects, etc.
};
```

#### Step 4: Implement Export Logic

```typescript
const handleExport = async (format: ExportFormat, options: ExportOptions) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  try {
    switch (format) {
      case 'png':
        await exportPNG(canvas, options.filename);
        setShowExportModal(false);
        break;
        
      case 'gif':
        await exportGIF(canvas, options.duration, options.fps, options.filename);
        setShowExportModal(false);
        break;
        
      case 'mp4':
        if (!videoRecorder || !videoRecorder.isRecording()) {
          // Start recording
          const recorder = createVideoRecorder(canvas, options.fps || 60);
          recorder.start((elapsed) => setRecordingTime(elapsed));
          setVideoRecorder(recorder);
        } else {
          // Stop recording
          await videoRecorder.stop(options.filename);
          setVideoRecorder(null);
          setRecordingTime(0);
          setShowExportModal(false);
        }
        break;
    }
  } catch (error) {
    console.error('Export failed:', error);
    alert('Export failed. Please try again.');
  }
};
```

#### Step 5: Add UI Components to Your Layout

```tsx
<PresetSelector
  currentPreset={currentPreset}
  onPresetSelect={handlePresetSelect}
/>

<button onClick={() => setShowExportModal(true)}>
  Export
</button>

<ExportModal
  isOpen={showExportModal}
  onClose={() => setShowExportModal(false)}
  onExport={handleExport}
  isRecording={videoRecorder?.isRecording()}
  recordingTime={recordingTime}
  supportsGif={true}
  supportsVideo={true}
/>
```

---

## 🎨 Applying Visual Effects

### Using the Effects Library

```typescript
import { CRTEffect, GlitchEffect, ColorEffect, NoiseEffect } from '../../shared/effects-library';

// In your render/draw function
const ctx = canvas.getContext('2d');
if (!ctx) return;

// Apply effects based on current preset
if (currentPreset?.effects.scanlines) {
  CRTEffect.scanlines(ctx, canvas, 0.1);
}

if (currentPreset?.effects.glow) {
  CRTEffect.phosphorGlow(ctx, canvas, currentPreset.colors.primary);
}

if (currentPreset?.effects.chromatic) {
  GlitchEffect.chromaticAberration(ctx, canvas, 5);
}

if (currentPreset?.effects.vignette) {
  CRTEffect.vignette(ctx, canvas, 0.7);
}

if (currentPreset?.effects.noise) {
  NoiseEffect.filmGrain(ctx, canvas, 0.2);
}
```

### Using Effect Composer for Multiple Effects

```typescript
import { EffectComposer, CRTEffect, GlitchEffect } from '../../shared/effects-library';

const composer = new EffectComposer();

// Build effect chain
composer
  .add((ctx, canvas) => CRTEffect.scanlines(ctx, canvas, 0.1))
  .add((ctx, canvas) => CRTEffect.vignette(ctx, canvas, 0.7))
  .add((ctx, canvas) => GlitchEffect.chromaticAberration(ctx, canvas, 3));

// Apply all effects
composer.apply(ctx, canvas);
```

---

## 🎬 Cross-Tool Workflow Examples

### Workflow 1: Shader Background + ASCII Overlay

1. **Shader Playground**
   - Create animated shader
   - Apply Cyberpunk preset
   - Export as MP4 video

2. **ASCII Art**
   - Upload an image
   - Convert to ASCII with green characters
   - Export as transparent PNG sequence

3. **Compositor** (future tool)
   - Import shader video as background
   - Layer ASCII PNG over it
   - Export final composition

### Workflow 2: Audio-Reactive Text

1. **Wave Visualizer**
   - Import audio file
   - Apply Synthwave preset
   - Generate frequency bars

2. **Shader Playground**
   - Add text overlay
   - Link colors to audio frequencies
   - Export as video with audio

### Workflow 3: Glitch Art Series

1. **Pixel Art Studio**
   - Create base pixel art
   - Export as PNG

2. **ASCII Art**
   - Import pixel art
   - Convert to ASCII
   - Apply Glitch Art preset

3. **Shader Playground**
   - Import ASCII output as texture
   - Add glitch shader effects
   - Export multiple variations

---

## 🛠️ Tool-Specific Integration Tips

### ASCII Art
- **Render ASCII to Canvas**: Draw text to canvas for effects/export
- **Animation**: Change character set or colors over time
- **Color Modes**: Solid color, gradient, or preset-based
- **Effects**: Apply CRT scanlines, glow to ASCII text

```typescript
// Render ASCII to canvas with effects
const renderASCIIToCanvas = (
  asciiText: string,
  canvas: HTMLCanvasElement,
  preset: AestheticPreset
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = preset.colors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = '12px "Courier New", monospace';
  ctx.fillStyle = preset.colors.primary;
  
  const lines = asciiText.split('\n');
  lines.forEach((line, y) => {
    ctx.fillText(line, 10, y * 12 + 20);
  });

  // Apply effects
  if (preset.effects.glow) {
    CRTEffect.phosphorGlow(ctx, canvas, preset.colors.primary);
  }
  if (preset.effects.scanlines) {
    CRTEffect.scanlines(ctx, canvas);
  }
};
```

### Wave Visualizer
- **Audio Analysis**: Extract frequency/amplitude data
- **Preset Colors**: Use preset palette for bars/waves
- **Effects**: Add glow, chromatic aberration
- **Sync**: Match visual intensity to audio

### Code-to-MP4
- **Background Layers**: Import shader/video as background
- **Text Styling**: Apply preset fonts and colors
- **Effects**: Add CRT effects to code display
- **Audio**: Sync code scrolling with audio BPM

### Shader Playground
- **Uniform Inputs**: Pass preset colors as shader uniforms
- **Texture Layers**: Import images/videos as textures
- **Multi-pass**: Layer multiple shader effects
- **Text Overlay**: Render text canvas on top of shader

### Pixel Art Studio
- **Palette Generation**: Use preset colors as pixel palette
- **Animation**: Create sprite sheets with frame export
- **Effects**: Apply posterize, dither effects
- **Export**: Individual frames or animated GIF

---

## 📋 Implementation Checklist

### Phase 1: Basic Integration
- [ ] Import shared utilities
- [ ] Add PresetSelector component
- [ ] Implement color palette application
- [ ] Add basic PNG export

### Phase 2: Effects
- [ ] Apply preset effects to visuals
- [ ] Add effect intensity controls
- [ ] Implement real-time effect preview

### Phase 3: Advanced Export
- [ ] Add GIF export capability
- [ ] Implement video recording
- [ ] Add ExportModal component
- [ ] Test all export formats

### Phase 4: Cross-Tool Features
- [ ] Add import capabilities
- [ ] Implement layering system
- [ ] Add preset synchronization
- [ ] Test workflows across multiple tools

---

## 🎨 Creating Custom Presets

You can add custom presets by editing `/shared/aesthetic-presets.ts`:

```typescript
myCustomPreset: {
  id: 'myCustom',
  name: 'My Custom Style',
  description: 'My unique aesthetic',
  colors: {
    primary: '#ff00ff',
    secondary: '#00ffff',
    tertiary: '#ffff00',
    background: '#000000',
    accent: '#ffffff',
    text: '#ffffff',
  },
  effects: {
    scanlines: true,
    glow: true,
    chromatic: false,
    vignette: true,
    noise: false,
    saturation: 1.2,
    contrast: 1.3,
  },
  fonts: ['VT323', 'Orbitron'],
  tags: ['custom', 'unique'],
},
```

---

## 🐛 Troubleshooting

### Export Issues
- **Canvas is blank**: Ensure canvas is rendered before export
- **GIF not working**: Check if gif.js library is loaded
- **Video codec error**: Browser may not support VP9, will fallback to VP8

### Effects Not Applying
- **Check canvas context**: Ensure 2D context is available
- **Effect order matters**: Some effects overwrite others
- **Performance**: Too many effects may slow rendering

### Preset Not Updating
- **Clear previous effects**: Reset canvas before applying new preset
- **Check CSS variables**: Ensure variables are being read
- **Force re-render**: Trigger component update after preset change

---

## 📚 Additional Resources

- **WebGL Shaders**: [The Book of Shaders](https://thebookofshaders.com/)
- **Canvas API**: [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- **Video Export**: [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- **GIF Generation**: [gif.js Documentation](https://github.com/jnordberg/gif.js)

---

## 🎯 Next Steps

1. **Integrate export system** into existing tools
2. **Add preset selectors** to tool UIs
3. **Apply visual effects** based on presets
4. **Test cross-tool workflows**
5. **Create example compositions**
6. **Document tool-specific features**

---

## 💡 Pro Tips

- **Start simple**: Add PNG export first, then GIF/video
- **Test presets**: Try each preset to ensure effects work
- **Performance**: Use requestAnimationFrame for animations
- **Canvas size**: Match export dimensions to display dimensions
- **Browser compatibility**: Test in Chrome, Firefox, Safari
- **File sizes**: Balance quality vs file size in exports
- **Workflow**: Plan multi-tool workflows before implementing

---

**Ready to create amazing video aesthetics! 🎨✨**
