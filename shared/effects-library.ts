/**
 * Visual Effects Library for Tinkerium Tools
 * Reusable visual effects that work across all tools
 */

export interface EffectOptions {
  intensity?: number;
  color?: string;
  speed?: number;
  scale?: number;
}

/**
 * CRT Screen Effects
 */
export class CRTEffect {
  /**
   * Apply scanlines effect
   */
  static scanlines(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    intensity: number = 0.1
  ): void {
    ctx.save();
    ctx.globalAlpha = intensity;
    ctx.fillStyle = '#000000';
    for (let y = 0; y < canvas.height; y += 2) {
      ctx.fillRect(0, y, canvas.width, 1);
    }
    ctx.restore();
  }

  /**
   * Apply phosphor glow effect
   */
  static phosphorGlow(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    color: string = '#00ff00',
    blur: number = 10
  ): void {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  }

  /**
   * Apply vignette effect
   */
  static vignette(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    intensity: number = 0.7
  ): void {
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.max(canvas.width, canvas.height) / 1.5
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Apply screen curvature (barrel distortion)
   */
  static curvature(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    amount: number = 0.1
  ): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(imageData, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const dx = (x - centerX) / centerX;
        const dy = (y - centerY) / centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const distortion = 1 + amount * distance * distance;

        const sourceX = centerX + dx * centerX * distortion;
        const sourceY = centerY + dy * centerY * distortion;

        if (
          sourceX >= 0 &&
          sourceX < canvas.width &&
          sourceY >= 0 &&
          sourceY < canvas.height
        ) {
          const pixel = tempCtx.getImageData(sourceX, sourceY, 1, 1).data;
          ctx.fillStyle = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] / 255})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }
}

/**
 * Glitch Effects
 */
export class GlitchEffect {
  /**
   * RGB channel split / chromatic aberration
   */
  static chromaticAberration(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    offset: number = 5
  ): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(imageData, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Red channel
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'red';
    ctx.globalAlpha = 1;
    ctx.drawImage(tempCanvas, -offset, 0);

    // Green channel (original position)
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'lime';
    ctx.drawImage(tempCanvas, 0, 0);

    // Blue channel
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'blue';
    ctx.drawImage(tempCanvas, offset, 0);

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  /**
   * Digital glitch / pixel sorting
   */
  static pixelGlitch(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    intensity: number = 0.1
  ): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < intensity) {
        const offset = Math.floor(Math.random() * 100 - 50) * 4;
        const targetIndex = i + offset;

        if (targetIndex >= 0 && targetIndex < data.length) {
          data[i] = data[targetIndex];
          data[i + 1] = data[targetIndex + 1];
          data[i + 2] = data[targetIndex + 2];
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Horizontal line displacement
   */
  static lineDisplacement(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    maxOffset: number = 20
  ): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(imageData, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const blockHeight = 10;
    for (let y = 0; y < canvas.height; y += blockHeight) {
      const offset = Math.random() < 0.3 ? Math.random() * maxOffset - maxOffset / 2 : 0;
      ctx.drawImage(
        tempCanvas,
        0,
        y,
        canvas.width,
        blockHeight,
        offset,
        y,
        canvas.width,
        blockHeight
      );
    }
  }

  /**
   * Data moshing effect
   */
  static dataMosh(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    intensity: number = 0.05
  ): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Random corruption
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < intensity) {
        const corruption = Math.floor(Math.random() * 3);
        switch (corruption) {
          case 0:
            data[i] = 255; // Max red
            break;
          case 1:
            data[i + 1] = 255; // Max green
            break;
          case 2:
            data[i + 2] = 255; // Max blue
            break;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }
}

/**
 * Color Grading Effects
 */
export class ColorEffect {
  /**
   * Apply color grading
   */
  static colorGrade(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    hue: number = 0,
    saturation: number = 1,
    lightness: number = 1
  ): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Convert to HSL
      const [h, s, l] = rgbToHsl(r, g, b);

      // Apply adjustments
      const newH = (h + hue) % 360;
      const newS = Math.max(0, Math.min(1, s * saturation));
      const newL = Math.max(0, Math.min(1, l * lightness));

      // Convert back to RGB
      const [newR, newG, newB] = hslToRgb(newH, newS, newL);

      data[i] = newR;
      data[i + 1] = newG;
      data[i + 2] = newB;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Apply gradient overlay
   */
  static gradientOverlay(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    color1: string,
    color2: string,
    opacity: number = 0.5
  ): void {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  /**
   * Apply color tint
   */
  static tint(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    color: string,
    intensity: number = 0.3
  ): void {
    ctx.save();
    ctx.globalAlpha = intensity;
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  /**
   * Posterize effect
   */
  static posterize(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    levels: number = 8
  ): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const step = 255 / levels;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.floor(data[i] / step) * step;
      data[i + 1] = Math.floor(data[i + 1] / step) * step;
      data[i + 2] = Math.floor(data[i + 2] / step) * step;
    }

    ctx.putImageData(imageData, 0, 0);
  }
}

/**
 * Noise and Texture Effects
 */
export class NoiseEffect {
  /**
   * Film grain effect
   */
  static filmGrain(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    intensity: number = 0.2
  ): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * intensity * 255;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Static noise
   */
  static staticNoise(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    intensity: number = 0.3
  ): void {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
      data[i + 3] = intensity * 255;
    }

    ctx.globalCompositeOperation = 'overlay';
    ctx.putImageData(imageData, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
  }

  /**
   * VHS tracking effect
   */
  static vhsTracking(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    time: number
  ): void {
    const offset = Math.sin(time * 0.001) * 20;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(imageData, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, offset, 0);

    // Add tracking lines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 5; i++) {
      const y = (time * 0.5 + i * 50) % canvas.height;
      ctx.fillRect(0, y, canvas.width, 2);
    }
  }
}

/**
 * Distortion Effects
 */
export class DistortionEffect {
  /**
   * Wave distortion
   */
  static wave(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    amplitude: number = 10,
    frequency: number = 0.01,
    time: number = 0
  ): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(imageData, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y++) {
      const offset = Math.sin((y * frequency + time) * Math.PI * 2) * amplitude;
      ctx.drawImage(tempCanvas, 0, y, canvas.width, 1, offset, y, canvas.width, 1);
    }
  }

  /**
   * Ripple effect
   */
  static ripple(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    centerX: number,
    centerY: number,
    amplitude: number = 20,
    wavelength: number = 50,
    time: number = 0
  ): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(imageData, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const offset = Math.sin((distance / wavelength - time) * Math.PI * 2) * amplitude;

        const angle = Math.atan2(dy, dx);
        const sourceX = x - Math.cos(angle) * offset;
        const sourceY = y - Math.sin(angle) * offset;

        if (
          sourceX >= 0 &&
          sourceX < canvas.width &&
          sourceY >= 0 &&
          sourceY < canvas.height
        ) {
          const pixel = tempCtx.getImageData(sourceX, sourceY, 1, 1).data;
          ctx.fillStyle = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] / 255})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }
}

/**
 * Helper: RGB to HSL conversion
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / delta + 2) / 6;
        break;
      case b:
        h = ((r - g) / delta + 4) / 6;
        break;
    }
  }

  return [h * 360, s, l];
}

/**
 * Helper: HSL to RGB conversion
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Composite effect builder
 */
export class EffectComposer {
  private effects: Array<(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void> = [];

  add(
    effect: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void
  ): EffectComposer {
    this.effects.push(effect);
    return this;
  }

  apply(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    this.effects.forEach((effect) => effect(ctx, canvas));
  }

  clear(): void {
    this.effects = [];
  }
}
