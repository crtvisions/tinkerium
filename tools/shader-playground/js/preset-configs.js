// Preset configurations - 12 COMPLETELY UNIQUE PRESETS with NEW PATTERNS
export const presetConfigs = {
    // 1. RETRO: Pixelated dots - pixelate ONLY with dot pattern
    crt: {
        color1: '#00ff00', color2: '#ff00ff', bgColor: '#000000',
        pattern: 'dots', scale: 8, speed: 1.0, complexity: 3,
        pixelate: true, pixelSize: 16
    },
    // 2. KALEIDOSCOPE: Radial symmetry - kaleidoscope with radial pattern
    plasma: {
        color1: '#ff0066', color2: '#00ffff', bgColor: '#110022',
        pattern: 'radial', scale: 12, speed: 2.0, complexity: 6,
        kaleidoscope: true, kaleidoSegments: 8
    },
    // 3. CHROMATIC: RGB spiral lens - chromatic aberration + zoom blur on spiral
    matrix: {
        color1: '#ffffff', color2: '#6600ff', bgColor: '#000000',
        pattern: 'spiral', scale: 7, speed: 1.2, complexity: 5,
        chromaticAberration: true, chromaticAmount: 0.05,
        zoomBlur: true, zoomStrength: 0.04
    },
    // 4. SUPERNOVA: Bright circles burst - bloom + glow on circles
    tunnel: {
        color1: '#ffff00', color2: '#ff0088', bgColor: '#000011',
        pattern: 'circles', scale: 10, speed: 1.5, complexity: 8,
        bloom: true, bloomStrength: 1.5,
        glow: true, glowStrength: 2.5
    },
    // 5. VORTEX: Spinning voronoi - swirl + ripple on voronoi cells
    glitch: {
        color1: '#00ffaa', color2: '#aa00ff', bgColor: '#000000',
        pattern: 'voronoi', scale: 6, speed: 0.8, complexity: 7,
        swirl: true, swirlStrength: 3.0,
        ripple: true, rippleStrength: 0.15
    },
    // 6. NEGATIVE: Inverted stripes - invert + posterize on rotating stripes
    nebula: {
        color1: '#ff6600', color2: '#00ff99', bgColor: '#ffffff',
        pattern: 'stripes', scale: 15, speed: 2.5, complexity: 2,
        invert: true,
        posterize: true, posterizeLevels: 6
    },
    // 7. THERMAL: Heat spiral - thermal + edge detect on spiral
    fire: {
        color1: '#ff0000', color2: '#0000ff', bgColor: '#000000',
        pattern: 'spiral', scale: 5, speed: 0.6, complexity: 6,
        thermal: true, thermalIntensity: 1.5,
        edgeDetect: true, edgeStrength: 1.2
    },
    // 8. MIRROR: Fractals - mirror + kaleidoscope on voronoi
    kaleid: {
        color1: '#00ffff', color2: '#ff00ff', bgColor: '#001122',
        pattern: 'voronoi', scale: 10, speed: 1.0, complexity: 7,
        mirror: true, mirrorMode: 'both',
        kaleidoscope: true, kaleidoSegments: 12
    },
    // 9. SCANLINE: Vintage CRT - scanlines + distortion + vignette on waves
    waves: {
        color1: '#00ff00', color2: '#003300', bgColor: '#000000',
        pattern: 'waves', scale: 4, speed: 0.3, complexity: 3,
        scanlines: true, scanlineIntensity: 0.6,
        distortion: true, distortAmount: 0.08,
        vignette: true, vignetteRadius: 0.6
    },
    // 10. NEON: Glowing radial - glow + bloom + noise on radial rays
    neon: {
        color1: '#ff00ff', color2: '#00ffff', bgColor: '#0a0a1a',
        pattern: 'radial', scale: 12, speed: 1.8, complexity: 8,
        glow: true, glowStrength: 2.0,
        bloom: true, bloomStrength: 1.0,
        noise: true, noiseAmount: 0.15
    },
    // 11. PIXELSTORM: Chaotic pixel grid - pixelate + RGB split + noise on grid
    pixel: {
        color1: '#00ff00', color2: '#ff0000', bgColor: '#000000',
        pattern: 'grid', scale: 25, speed: 4.0, complexity: 1,
        pixelate: true, pixelSize: 12,
        rgbSplit: true, rgbOffset: 0.04,
        noise: true, noiseAmount: 0.25
    },
    // 12. UNDERWATER: Rippling dots - ripple + chromatic + vignette on dots
    water: {
        color1: '#0088ff', color2: '#00ffaa', bgColor: '#001122',
        pattern: 'dots', scale: 5, speed: 0.5, complexity: 6,
        ripple: true, rippleStrength: 0.12,
        chromaticAberration: true, chromaticAmount: 0.03,
        vignette: true, vignetteRadius: 0.9
    }
};
