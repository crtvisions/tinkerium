// Test shader generation
const params = {
    color1: '#00ff00',
    color2: '#0000ff',
    bgColor: '#000000',
    pattern: 'waves',
    scale: 5.0,
    speed: 1.0,
    complexity: 3,
    scanlines: false,
    glow: false,
    distortion: false,
    vignette: false,
    noise: false,
    rgbSplit: false,
    pixelate: false,
    invert: false,
    posterize: false,
    chromaticAberration: false,
    kaleidoscope: false,
    mosaic: false,
    bloom: false,
    thermal: false,
    acid: false,
    shockwave: false,
    crystallize: false
};

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
}

const c1 = hexToRgb(params.color1);
const c2 = hexToRgb(params.color2);
const bg = hexToRgb(params.bgColor);

console.log('Testing default shader generation...');
console.log('Colors:', { c1, c2, bg });
console.log('Pattern:', params.pattern);
console.log('Complexity:', params.complexity);

// Simulate the pattern generation
console.log('\nPattern generation code:');
if (params.pattern === 'waves') {
    for (let i = 1; i <= params.complexity; i++) {
        console.log(`    pattern += sin(p.x * ${(params.scale * i * 0.3).toFixed(2)} + u_time * ${params.speed.toFixed(2)} * ${(i * 0.5).toFixed(2)});`);
        console.log(`    pattern += sin(p.y * ${(params.scale * i * 0.4).toFixed(2)} + u_time * ${params.speed.toFixed(2)} * ${(i * 0.3).toFixed(2)});`);
    }
}
console.log(`    pattern = pattern / ${params.complexity.toFixed(1)};`);

// Check if any UV-modifying effects are active
const hasUVModifiers = params.shockwave || params.kaleidoscope || params.mosaic || params.crystallize;
console.log('\nUV-modifying effects active:', hasUVModifiers);
console.log('Color assignment should happen:', !hasUVModifiers ? 'YES' : 'via recalculated pattern');
