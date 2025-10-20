/**
 * Aesthetic Presets for Tinkerium Tools
 * Provides consistent visual styles across all tools
 */

export interface ColorPalette {
  primary: string;
  secondary: string;
  tertiary?: string;
  background: string;
  accent: string;
  text: string;
}

export interface EffectSettings {
  scanlines?: boolean;
  glow?: boolean;
  glitch?: boolean;
  chromatic?: boolean;
  vignette?: boolean;
  noise?: boolean;
  blur?: number;
  contrast?: number;
  brightness?: number;
  saturation?: number;
}

export interface AestheticPreset {
  id: string;
  name: string;
  description: string;
  colors: ColorPalette;
  effects: EffectSettings;
  fonts?: string[];
  tags?: string[];
}

/**
 * Predefined Aesthetic Presets
 */
export const AESTHETIC_PRESETS: Record<string, AestheticPreset> = {
  vaporwave: {
    id: 'vaporwave',
    name: 'Vaporwave',
    description: 'A e s t h e t i c - Pink and cyan gradients with classical art',
    colors: {
      primary: '#ff71ce',
      secondary: '#01cdfe',
      tertiary: '#05ffa1',
      background: '#b967ff',
      accent: '#fffb96',
      text: '#ffffff',
    },
    effects: {
      glow: true,
      chromatic: true,
      vignette: true,
      saturation: 1.5,
      contrast: 1.2,
    },
    fonts: ['VT323', 'Courier New'],
    tags: ['retro', '80s', 'neon', 'aesthetic'],
  },

  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'High-tech, low-life - Neon cities and digital rain',
    colors: {
      primary: '#00ff41',
      secondary: '#ff0080',
      tertiary: '#00d9ff',
      background: '#0a0e27',
      accent: '#ffed4e',
      text: '#00ff41',
    },
    effects: {
      scanlines: true,
      glow: true,
      glitch: true,
      chromatic: true,
      contrast: 1.5,
      saturation: 1.3,
    },
    fonts: ['Press Start 2P', 'Orbitron', 'Rajdhani'],
    tags: ['futuristic', 'neon', 'dystopian', 'tech'],
  },

  synthwave: {
    id: 'synthwave',
    name: 'Synthwave',
    description: 'Retro futurism - Purple skies and grid horizons',
    colors: {
      primary: '#ff006e',
      secondary: '#8338ec',
      tertiary: '#fb5607',
      background: '#3a0ca3',
      accent: '#ffbe0b',
      text: '#ffffff',
    },
    effects: {
      glow: true,
      vignette: true,
      saturation: 1.4,
      contrast: 1.3,
      brightness: 1.1,
    },
    fonts: ['Monoton', 'Righteous', 'Orbitron'],
    tags: ['retro', '80s', 'neon', 'sunset'],
  },

  glitchArt: {
    id: 'glitchArt',
    name: 'Glitch Art',
    description: 'Digital corruption - Data moshing and RGB chaos',
    colors: {
      primary: '#ff0000',
      secondary: '#00ff00',
      tertiary: '#0000ff',
      background: '#000000',
      accent: '#ffffff',
      text: '#ffffff',
    },
    effects: {
      glitch: true,
      chromatic: true,
      noise: true,
      contrast: 1.6,
      saturation: 2.0,
    },
    fonts: ['VT323', 'Courier New', 'Consolas'],
    tags: ['glitch', 'digital', 'error', 'corrupt'],
  },

  lofi: {
    id: 'lofi',
    name: 'Lo-Fi',
    description: 'Chill vibes - Warm colors and grainy textures',
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      tertiary: '#ffe66d',
      background: '#f7f7f7',
      accent: '#95e1d3',
      text: '#2d3436',
    },
    effects: {
      noise: true,
      vignette: true,
      blur: 1,
      brightness: 1.1,
      saturation: 0.9,
      contrast: 0.95,
    },
    fonts: ['VT323', 'Courier New'],
    tags: ['chill', 'warm', 'vintage', 'analog'],
  },

  y2k: {
    id: 'y2k',
    name: 'Y2K',
    description: 'Millennium aesthetic - Metallic gradients and butterflies',
    colors: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      tertiary: '#ffff00',
      background: '#ffffff',
      accent: '#c0c0c0',
      text: '#000000',
    },
    effects: {
      glow: true,
      chromatic: true,
      saturation: 1.8,
      contrast: 1.4,
      brightness: 1.2,
    },
    fonts: ['Arial', 'Comic Sans MS', 'Impact'],
    tags: ['2000s', 'metallic', 'chrome', 'futuristic'],
  },

  matrix: {
    id: 'matrix',
    name: 'Matrix',
    description: 'Follow the white rabbit - Green code rain',
    colors: {
      primary: '#00ff00',
      secondary: '#008f00',
      tertiary: '#00ff41',
      background: '#000000',
      accent: '#00ff00',
      text: '#00ff00',
    },
    effects: {
      scanlines: true,
      glow: true,
      contrast: 1.6,
      saturation: 1.2,
    },
    fonts: ['VT323', 'Courier New', 'Consolas'],
    tags: ['hacker', 'code', 'terminal', 'green'],
  },

  retroCRT: {
    id: 'retroCRT',
    name: 'Retro CRT',
    description: 'Classic terminal - Amber phosphor glow',
    colors: {
      primary: '#ffb000',
      secondary: '#ff8800',
      tertiary: '#ffd700',
      background: '#000000',
      accent: '#ffb000',
      text: '#ffb000',
    },
    effects: {
      scanlines: true,
      glow: true,
      vignette: true,
      blur: 0.5,
      contrast: 1.3,
    },
    fonts: ['VT323', 'Courier New'],
    tags: ['retro', 'terminal', 'amber', 'vintage'],
  },

  neonNoir: {
    id: 'neonNoir',
    name: 'Neon Noir',
    description: 'Dark streets, bright lights - Film noir meets neon',
    colors: {
      primary: '#ff0080',
      secondary: '#00ffff',
      tertiary: '#ff00ff',
      background: '#0a0a0a',
      accent: '#ffffff',
      text: '#ffffff',
    },
    effects: {
      glow: true,
      vignette: true,
      contrast: 1.8,
      saturation: 1.5,
      brightness: 0.9,
    },
    fonts: ['Orbitron', 'Rajdhani', 'Iceland'],
    tags: ['dark', 'neon', 'noir', 'cinematic'],
  },

  pastelDream: {
    id: 'pastelDream',
    name: 'Pastel Dream',
    description: 'Soft and dreamy - Kawaii pastel colors',
    colors: {
      primary: '#ffc8dd',
      secondary: '#bde0fe',
      tertiary: '#cdb4db',
      background: '#fff4f4',
      accent: '#ffd6a5',
      text: '#6b4e71',
    },
    effects: {
      glow: true,
      blur: 2,
      brightness: 1.2,
      saturation: 1.1,
      contrast: 0.9,
    },
    fonts: ['Arial', 'Helvetica'],
    tags: ['soft', 'kawaii', 'cute', 'dreamy'],
  },
};

/**
 * Get preset by ID
 */
export function getPreset(id: string): AestheticPreset | undefined {
  return AESTHETIC_PRESETS[id];
}

/**
 * Get all presets
 */
export function getAllPresets(): AestheticPreset[] {
  return Object.values(AESTHETIC_PRESETS);
}

/**
 * Get presets by tag
 */
export function getPresetsByTag(tag: string): AestheticPreset[] {
  return Object.values(AESTHETIC_PRESETS).filter(
    (preset) => preset.tags?.includes(tag)
  );
}

/**
 * Apply color palette to CSS variables
 */
export function applyColorPalette(colors: ColorPalette): void {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-secondary', colors.secondary);
  if (colors.tertiary) {
    root.style.setProperty('--color-tertiary', colors.tertiary);
  }
  root.style.setProperty('--color-background', colors.background);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-text', colors.text);
}

/**
 * Generate CSS filter string from effect settings
 */
export function generateFilterCSS(effects: EffectSettings): string {
  const filters: string[] = [];

  if (effects.brightness && effects.brightness !== 1) {
    filters.push(`brightness(${effects.brightness})`);
  }
  if (effects.contrast && effects.contrast !== 1) {
    filters.push(`contrast(${effects.contrast})`);
  }
  if (effects.saturation && effects.saturation !== 1) {
    filters.push(`saturate(${effects.saturation})`);
  }
  if (effects.blur && effects.blur > 0) {
    filters.push(`blur(${effects.blur}px)`);
  }

  return filters.join(' ');
}

/**
 * Apply canvas effects (for WebGL/2D context)
 */
export function applyCanvasEffects(
  ctx: CanvasRenderingContext2D,
  effects: EffectSettings,
  canvas: HTMLCanvasElement
): void {
  // Apply CSS filters to canvas
  const filterCSS = generateFilterCSS(effects);
  if (filterCSS) {
    ctx.filter = filterCSS;
  }

  // Additional canvas-specific effects
  if (effects.vignette) {
    applyVignette(ctx, canvas);
  }

  if (effects.scanlines) {
    applyScanlines(ctx, canvas);
  }

  if (effects.noise) {
    applyNoise(ctx, canvas);
  }
}

/**
 * Apply vignette effect
 */
function applyVignette(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    Math.max(canvas.width, canvas.height) / 1.5
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Apply scanlines effect
 */
function applyScanlines(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  for (let y = 0; y < canvas.height; y += 2) {
    ctx.fillRect(0, y, canvas.width, 1);
  }
}

/**
 * Apply noise effect
 */
function applyNoise(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30;
    data[i] += noise;     // Red
    data[i + 1] += noise; // Green
    data[i + 2] += noise; // Blue
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Random preset generator
 */
export function getRandomPreset(): AestheticPreset {
  const presets = getAllPresets();
  return presets[Math.floor(Math.random() * presets.length)];
}
