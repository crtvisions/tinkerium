// Shader generation utilities

// Hex to RGB conversion
export function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
}

// Generate pattern code for GLSL
export function generatePatternCode(patternVar, pVar, pattern, scale, speed, complexity) {
    let code = '';
    
    if (pattern === 'waves') {
        code += `\n    // Wave pattern\n`;
        for (let i = 1; i <= complexity; i++) {
            code += `    ${patternVar} += sin(${pVar}.x * ${(scale * i * 0.3).toFixed(2)} + u_time * ${speed.toFixed(2)} * ${(i * 0.5).toFixed(2)});\n`;
            code += `    ${patternVar} += sin(${pVar}.y * ${(scale * i * 0.4).toFixed(2)} + u_time * ${speed.toFixed(2)} * ${(i * 0.3).toFixed(2)});\n`;
        }
    } else if (pattern === 'circles') {
        code += `\n    // Circular pattern\n`;
        for (let i = 1; i <= complexity; i++) {
            code += `    ${patternVar} += sin(length(${pVar}) * ${(scale * i).toFixed(2)} - u_time * ${speed.toFixed(2)} * ${i.toFixed(1)});\n`;
        }
    } else if (pattern === 'grid') {
        code += `\n    // Grid pattern\n`;
        code += `    vec2 ${patternVar}_grid = fract(${pVar} * ${scale.toFixed(2)});\n`;
        code += `    ${patternVar} = step(0.5, ${patternVar}_grid.x) + step(0.5, ${patternVar}_grid.y);\n`;
        code += `    ${patternVar} = fract(${patternVar} + u_time * ${speed.toFixed(2)});\n`;
    } else if (pattern === 'spiral') {
        code += `\n    // Spiral pattern\n`;
        code += `    float ${patternVar}_angle = atan(${pVar}.y, ${pVar}.x);\n`;
        code += `    float ${patternVar}_radius = length(${pVar});\n`;
        for (let i = 1; i <= complexity; i++) {
            code += `    ${patternVar} += sin(${patternVar}_angle * ${(i * 2).toFixed(1)} + ${patternVar}_radius * ${(scale * i).toFixed(2)} - u_time * ${speed.toFixed(2)} * ${i.toFixed(1)});\n`;
        }
    } else if (pattern === 'dots') {
        code += `\n    // Dots pattern\n`;
        code += `    vec2 ${patternVar}_dotGrid = fract(${pVar} * ${scale.toFixed(2)}) - 0.5;\n`;
        code += `    float ${patternVar}_dotDist = length(${patternVar}_dotGrid);\n`;
        for (let i = 1; i <= complexity; i++) {
            code += `    ${patternVar} += smoothstep(0.3, 0.2, ${patternVar}_dotDist) * sin(u_time * ${speed.toFixed(2)} * ${(i * 0.5).toFixed(2)});\n`;
        }
    } else if (pattern === 'stripes') {
        code += `\n    // Stripes pattern\n`;
        code += `    float ${patternVar}_angle = ${speed.toFixed(2)} * u_time * 0.2;\n`;
        code += `    float ${patternVar}_s = sin(${patternVar}_angle);\n`;
        code += `    float ${patternVar}_c = cos(${patternVar}_angle);\n`;
        code += `    vec2 ${patternVar}_rotP = vec2(${patternVar}_c * ${pVar}.x - ${patternVar}_s * ${pVar}.y, ${patternVar}_s * ${pVar}.x + ${patternVar}_c * ${pVar}.y);\n`;
        for (let i = 1; i <= complexity; i++) {
            code += `    ${patternVar} += sin(${patternVar}_rotP.x * ${(scale * i).toFixed(2)} + u_time * ${(speed * 0.5).toFixed(2)});\n`;
        }
    } else if (pattern === 'radial') {
        code += `\n    // Radial pattern\n`;
        code += `    float ${patternVar}_angle = atan(${pVar}.y, ${pVar}.x);\n`;
        code += `    float ${patternVar}_segments = ${(complexity * 3).toFixed(1)};\n`;
        code += `    ${patternVar} = sin(${patternVar}_angle * ${patternVar}_segments + u_time * ${speed.toFixed(2)});\n`;
        code += `    ${patternVar} += sin(length(${pVar}) * ${scale.toFixed(2)} - u_time * ${speed.toFixed(2)});\n`;
    } else if (pattern === 'voronoi') {
        code += `\n    // Voronoi-like pattern\n`;
        code += `    vec2 ${patternVar}_i_st = floor(${pVar} * ${scale.toFixed(2)});\n`;
        code += `    vec2 ${patternVar}_f_st = fract(${pVar} * ${scale.toFixed(2)});\n`;
        code += `    float ${patternVar}_m_dist = 10.0;\n`;
        code += `    for (int y = -1; y <= 1; y++) {\n`;
        code += `        for (int x = -1; x <= 1; x++) {\n`;
        code += `            vec2 ${patternVar}_neighbor = vec2(float(x), float(y));\n`;
        code += `            vec2 ${patternVar}_point = random(${patternVar}_i_st + ${patternVar}_neighbor) * vec2(1.0, 1.0);\n`;
        code += `            ${patternVar}_point = 0.5 + 0.5 * sin(u_time * ${speed.toFixed(2)} + 6.2831 * ${patternVar}_point);\n`;
        code += `            float ${patternVar}_dist = length(${patternVar}_neighbor + ${patternVar}_point - ${patternVar}_f_st);\n`;
        code += `            ${patternVar}_m_dist = min(${patternVar}_m_dist, ${patternVar}_dist);\n`;
        code += `        }\n`;
        code += `    }\n`;
        code += `    ${patternVar} = ${patternVar}_m_dist * ${complexity.toFixed(1)};\n`;
    }
    
    return code;
}

// Generate complete shader code from parameters
export function generateShader(params) {
    const c1 = hexToRgb(params.color1);
    const c2 = hexToRgb(params.color2);
    const bg = hexToRgb(params.bgColor);
    
    let shader = `precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_textTexture;
uniform bool u_textEnabled;
uniform float u_textDistortion;
uniform int u_animPattern;
uniform float u_animIntensity;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = (uv * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);
    
    vec3 color = vec3(${bg[0].toFixed(3)}, ${bg[1].toFixed(3)}, ${bg[2].toFixed(3)});
    float pattern = 0.0;
    `;
    
    // Use helper function for pattern generation
    shader += generatePatternCode('pattern', 'p', params.pattern, params.scale, params.speed, params.complexity);
    
    shader += `\n    pattern = pattern / ${params.complexity.toFixed(1)};\n`;
    shader += `    vec3 col1 = vec3(${c1[0].toFixed(3)}, ${c1[1].toFixed(3)}, ${c1[2].toFixed(3)});\n`;
    shader += `    vec3 col2 = vec3(${c2[0].toFixed(3)}, ${c2[1].toFixed(3)}, ${c2[2].toFixed(3)});\n`;
    shader += `    color = mix(col1, col2, pattern * 0.5 + 0.5);\n`;
    
    // Apply effects
    if (params.distortion) {
        shader += `\n    // Distortion\n`;
        shader += `    uv.x += sin(uv.y * 10.0 + u_time) * ${params.distortAmount.toFixed(3)};\n`;
        shader += `    uv.y += cos(uv.x * 10.0 + u_time) * ${params.distortAmount.toFixed(3)};\n`;
    }
    
    if (params.glow) {
        shader += `\n    // Glow\n`;
        shader += `    color += vec3(pattern) * ${params.glowStrength.toFixed(2)};\n`;
    }
    
    if (params.scanlines) {
        shader += `\n    // Scanlines\n`;
        shader += `    float scanline = sin(uv.y * u_resolution.y * 1.5) * ${params.scanlineIntensity.toFixed(2)};\n`;
        shader += `    color *= (1.0 - scanline);\n`;
    }
    
    if (params.vignette) {
        shader += `\n    // Vignette\n`;
        shader += `    float vig = 1.0 - length(uv * 2.0 - 1.0) * ${params.vignetteRadius.toFixed(2)};\n`;
        shader += `    color *= vig;\n`;
    }
    
    if (params.noise) {
        shader += `\n    // Noise\n`;
        shader += `    color += random(uv + u_time * 0.1) * ${params.noiseAmount.toFixed(3)};\n`;
    }
    
    if (params.rgbSplit) {
        shader += `\n    // RGB Split\n`;
        shader += `    vec2 offset = vec2(${params.rgbOffset.toFixed(3)}, 0.0);\n`;
        shader += `    color.r = mix(col1, col2, (pattern + sin(uv.x * 50.0 + u_time) * 0.1) * 0.5 + 0.5).r;\n`;
        shader += `    color.g = mix(col1, col2, pattern * 0.5 + 0.5).g;\n`;
        shader += `    color.b = mix(col1, col2, (pattern - sin(uv.x * 50.0 + u_time) * 0.1) * 0.5 + 0.5).b;\n`;
    }
    
    if (params.pixelate) {
        shader += `\n    // Pixelate\n`;
        shader += `    vec2 pixelSize = vec2(${params.pixelSize.toFixed(1)});\n`;
        shader += `    vec2 pixelUV = floor(uv * u_resolution.xy / pixelSize) * pixelSize / u_resolution.xy;\n`;
        shader += `    vec2 pixelP = (pixelUV * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);\n`;
        shader += `    float pixelPattern = 0.0;\n`;
        shader += generatePatternCode('pixelPattern', 'pixelP', params.pattern, params.scale, params.speed, params.complexity);
        shader += `    pixelPattern = pixelPattern / ${params.complexity.toFixed(1)};\n`;
        shader += `    color = mix(col1, col2, pixelPattern * 0.5 + 0.5);\n`;
    }
    
    if (params.kaleidoscope) {
        shader += `\n    // Kaleidoscope\n`;
        shader += `    vec2 kaleidoUV = uv - 0.5;\n`;
        shader += `    float kaleidoAngle = atan(kaleidoUV.y, kaleidoUV.x);\n`;
        shader += `    float kaleidoRadius = length(kaleidoUV);\n`;
        shader += `    float kaleidoSegments = ${params.kaleidoSegments.toFixed(1)};\n`;
        shader += `    kaleidoAngle = mod(kaleidoAngle, 6.28318 / kaleidoSegments);\n`;
        shader += `    kaleidoAngle = abs(kaleidoAngle - 3.14159 / kaleidoSegments);\n`;
        shader += `    kaleidoUV = vec2(cos(kaleidoAngle), sin(kaleidoAngle)) * kaleidoRadius + 0.5;\n`;
        shader += `    vec2 kaleidoP = (kaleidoUV * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);\n`;
        shader += `    float kaleidoPattern = 0.0;\n`;
        shader += generatePatternCode('kaleidoPattern', 'kaleidoP', params.pattern, params.scale, params.speed, params.complexity);
        shader += `    kaleidoPattern = kaleidoPattern / ${params.complexity.toFixed(1)};\n`;
        shader += `    color = mix(col1, col2, kaleidoPattern * 0.5 + 0.5);\n`;
    }
    
    if (params.chromaticAberration) {
        shader += `\n    // Chromatic Aberration\n`;
        shader += `    float aberration = ${params.chromaticAmount.toFixed(3)};\n`;
        shader += `    vec2 dir = uv - 0.5;\n`;
        shader += `    vec2 uvR = uv - dir * aberration;\n`;
        shader += `    vec2 uvB = uv + dir * aberration;\n`;
        shader += `    vec2 pR = (uvR * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);\n`;
        shader += `    vec2 pB = (uvB * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);\n`;
        shader += `    float patternR = 0.0;\n`;
        shader += `    float patternB = 0.0;\n`;
        shader += generatePatternCode('patternR', 'pR', params.pattern, params.scale, params.speed, params.complexity);
        shader += generatePatternCode('patternB', 'pB', params.pattern, params.scale, params.speed, params.complexity);
        shader += `    patternR = patternR / ${params.complexity.toFixed(1)};\n`;
        shader += `    patternB = patternB / ${params.complexity.toFixed(1)};\n`;
        shader += `    color.r = mix(col1, col2, patternR * 0.5 + 0.5).r;\n`;
        shader += `    color.b = mix(col1, col2, patternB * 0.5 + 0.5).b;\n`;
    }
    
    if (params.bloom) {
        shader += `\n    // Bloom\n`;
        shader += `    float brightness = (color.r + color.g + color.b) / 3.0;\n`;
        shader += `    if (brightness > 0.5) {\n`;
        shader += `        color += (brightness - 0.5) * ${params.bloomStrength.toFixed(2)};\n`;
        shader += `    }\n`;
    }
    
    if (params.swirl) {
        shader += `\n    // Swirl\n`;
        shader += `    vec2 swirlUV = uv - 0.5;\n`;
        shader += `    float swirlDist = length(swirlUV);\n`;
        shader += `    float swirlAngle = atan(swirlUV.y, swirlUV.x);\n`;
        shader += `    swirlAngle += swirlDist * ${params.swirlStrength.toFixed(2)} + u_time * 0.5;\n`;
        shader += `    swirlUV = vec2(cos(swirlAngle), sin(swirlAngle)) * swirlDist + 0.5;\n`;
        shader += `    vec2 swirlP = (swirlUV * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);\n`;
        shader += `    float swirlPattern = 0.0;\n`;
        shader += generatePatternCode('swirlPattern', 'swirlP', params.pattern, params.scale, params.speed, params.complexity);
        shader += `    swirlPattern = swirlPattern / ${params.complexity.toFixed(1)};\n`;
        shader += `    color = mix(col1, col2, swirlPattern * 0.5 + 0.5);\n`;
    }
    
    if (params.invert) {
        shader += `\n    // Invert Colors\n`;
        shader += `    color = vec3(1.0) - color;\n`;
    }
    
    if (params.posterize) {
        shader += `\n    // Posterize\n`;
        shader += `    float levels = ${params.posterizeLevels.toFixed(1)};\n`;
        shader += `    color = floor(color * levels) / levels;\n`;
    }
    
    if (params.edgeDetect) {
        shader += `\n    // Edge Detection\n`;
        shader += `    float edgeStrength = ${params.edgeStrength.toFixed(2)};\n`;
        shader += `    float edge = abs(sin(pattern * 50.0));\n`;
        shader += `    color += vec3(edge) * edgeStrength * 0.3;\n`;
    }
    
    if (params.zoomBlur) {
        shader += `\n    // Zoom Blur\n`;
        shader += `    vec2 center = uv - 0.5;\n`;
        shader += `    float zoomAmount = ${params.zoomStrength.toFixed(3)};\n`;
        shader += `    vec3 blurColor = vec3(0.0);\n`;
        shader += `    for (float i = 0.0; i < 8.0; i++) {\n`;
        shader += `        float scale = 1.0 - (i / 8.0) * zoomAmount;\n`;
        shader += `        vec2 blurUV = center * scale + 0.5;\n`;
        shader += `        vec2 blurP = (blurUV * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);\n`;
        shader += `        float blurPattern = 0.0;\n`;
        let blurCode = generatePatternCode('blurPattern', 'blurP', params.pattern, params.scale, params.speed, params.complexity);
        shader += blurCode.replace(/\n    /g, '\n        ');
        shader += `        blurPattern = blurPattern / ${params.complexity.toFixed(1)};\n`;
        shader += `        blurColor += mix(col1, col2, blurPattern * 0.5 + 0.5);\n`;
        shader += `    }\n`;
        shader += `    color = blurColor / 8.0;\n`;
    }
    
    if (params.mirror) {
        shader += `\n    // Mirror\n`;
        if (params.mirrorMode === 'horizontal') {
            shader += `    uv.x = abs(uv.x - 0.5) + 0.5;\n`;
        } else if (params.mirrorMode === 'vertical') {
            shader += `    uv.y = abs(uv.y - 0.5) + 0.5;\n`;
        } else if (params.mirrorMode === 'both') {
            shader += `    uv.x = abs(uv.x - 0.5) + 0.5;\n`;
            shader += `    uv.y = abs(uv.y - 0.5) + 0.5;\n`;
        }
        shader += `    vec2 mirrorP = (uv * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);\n`;
        shader += `    float mirrorPattern = 0.0;\n`;
        shader += generatePatternCode('mirrorPattern', 'mirrorP', params.pattern, params.scale, params.speed, params.complexity);
        shader += `    mirrorPattern = mirrorPattern / ${params.complexity.toFixed(1)};\n`;
        shader += `    color = mix(col1, col2, mirrorPattern * 0.5 + 0.5);\n`;
    }
    
    if (params.thermal) {
        shader += `\n    // Thermal Vision\n`;
        shader += `    float intensity = (color.r + color.g + color.b) / 3.0;\n`;
        shader += `    vec3 cold = vec3(0.0, 0.0, 1.0);\n`;
        shader += `    vec3 hot = vec3(1.0, 0.0, 0.0);\n`;
        shader += `    color = mix(cold, hot, intensity) * ${params.thermalIntensity.toFixed(2)};\n`;
    }
    
    if (params.ripple) {
        shader += `\n    // Ripple\n`;
        shader += `    vec2 rippleUV = uv - 0.5;\n`;
        shader += `    float rippleDist = length(rippleUV);\n`;
        shader += `    float ripple = sin(rippleDist * 20.0 - u_time * 3.0) * ${params.rippleStrength.toFixed(3)};\n`;
        shader += `    rippleUV = rippleUV * (1.0 + ripple) + 0.5;\n`;
        shader += `    vec2 rippleP = (rippleUV * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);\n`;
        shader += `    float ripplePattern = 0.0;\n`;
        shader += generatePatternCode('ripplePattern', 'rippleP', params.pattern, params.scale, params.speed, params.complexity);
        shader += `    ripplePattern = ripplePattern / ${params.complexity.toFixed(1)};\n`;
        shader += `    color = mix(col1, col2, ripplePattern * 0.5 + 0.5);\n`;
    }
    
    // Apply animated text
    shader += `\n    // Animated text with distortion\n`;
    shader += `    if (u_textEnabled) {\n`;
    shader += `        vec2 textUV = vec2(uv.x, 1.0 - uv.y);\n`;
    shader += `        \n`;
    shader += `        // Animation patterns\n`;
    shader += `        if (u_animPattern == 1) {\n`;
    shader += `            // Spiral\n`;
    shader += `            float angle = atan(textUV.y - 0.5, textUV.x - 0.5);\n`;
    shader += `            float radius = length(textUV - 0.5);\n`;
    shader += `            angle += u_time * u_animIntensity + radius * 5.0;\n`;
    shader += `            textUV = vec2(cos(angle), sin(angle)) * radius + 0.5;\n`;
    shader += `        } else if (u_animPattern == 2) {\n`;
    shader += `            // Pulse\n`;
    shader += `            vec2 center = textUV - 0.5;\n`;
    shader += `            float pulse = sin(u_time * 3.0 * u_animIntensity) * 0.3 + 1.0;\n`;
    shader += `            textUV = center * pulse + 0.5;\n`;
    shader += `        } else if (u_animPattern == 3) {\n`;
    shader += `            // Orbit\n`;
    shader += `            float angle = u_time * u_animIntensity;\n`;
    shader += `            mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));\n`;
    shader += `            textUV = rot * (textUV - 0.5) + 0.5;\n`;
    shader += `        } else if (u_animPattern == 4) {\n`;
    shader += `            // Explode\n`;
    shader += `            vec2 center = textUV - 0.5;\n`;
    shader += `            float dist = length(center);\n`;
    shader += `            float explode = sin(u_time * 2.0 * u_animIntensity - dist * 10.0);\n`;
    shader += `            textUV = center * (1.0 + explode * 0.5) + 0.5;\n`;
    shader += `        }\n`;
    shader += `        \n`;
    shader += `        // Distortion effect\n`;
    shader += `        textUV.x += sin(textUV.y * 20.0 + u_time * 2.0) * u_textDistortion * 0.02;\n`;
    shader += `        textUV.y += cos(textUV.x * 20.0 + u_time * 2.0) * u_textDistortion * 0.02;\n`;
    shader += `        \n`;
    shader += `        vec4 textColor = texture2D(u_textTexture, textUV);\n`;
    shader += `        color = mix(color, textColor.rgb, textColor.a);\n`;
    shader += `    }\n`;
    
    shader += `\n    gl_FragColor = vec4(color, 1.0);\n}`;
    
    return shader;
}

export const VERTEX_SHADER_SOURCE = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;
