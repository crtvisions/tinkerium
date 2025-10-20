import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                 */function E(e){const o=parseInt(e.slice(1,3),16)/255,n=parseInt(e.slice(3,5),16)/255,i=parseInt(e.slice(5,7),16)/255;return[o,n,i]}function x(e,o,n,i,t,l){let r="";if(n==="waves"){r+=`
    // Wave pattern
`;for(let s=1;s<=l;s++)r+=`    ${e} += sin(${o}.x * ${(i*s*.3).toFixed(2)} + u_time * ${t.toFixed(2)} * ${(s*.5).toFixed(2)});
`,r+=`    ${e} += sin(${o}.y * ${(i*s*.4).toFixed(2)} + u_time * ${t.toFixed(2)} * ${(s*.3).toFixed(2)});
`}else if(n==="circles"){r+=`
    // Circular pattern
`;for(let s=1;s<=l;s++)r+=`    ${e} += sin(length(${o}) * ${(i*s).toFixed(2)} - u_time * ${t.toFixed(2)} * ${s.toFixed(1)});
`}else if(n==="grid")r+=`
    // Grid pattern
`,r+=`    vec2 ${e}_grid = fract(${o} * ${i.toFixed(2)});
`,r+=`    ${e} = step(0.5, ${e}_grid.x) + step(0.5, ${e}_grid.y);
`,r+=`    ${e} = fract(${e} + u_time * ${t.toFixed(2)});
`;else if(n==="spiral"){r+=`
    // Spiral pattern
`,r+=`    float ${e}_angle = atan(${o}.y, ${o}.x);
`,r+=`    float ${e}_radius = length(${o});
`;for(let s=1;s<=l;s++)r+=`    ${e} += sin(${e}_angle * ${(s*2).toFixed(1)} + ${e}_radius * ${(i*s).toFixed(2)} - u_time * ${t.toFixed(2)} * ${s.toFixed(1)});
`}else if(n==="dots"){r+=`
    // Dots pattern
`,r+=`    vec2 ${e}_dotGrid = fract(${o} * ${i.toFixed(2)}) - 0.5;
`,r+=`    float ${e}_dotDist = length(${e}_dotGrid);
`;for(let s=1;s<=l;s++)r+=`    ${e} += smoothstep(0.3, 0.2, ${e}_dotDist) * sin(u_time * ${t.toFixed(2)} * ${(s*.5).toFixed(2)});
`}else if(n==="stripes"){r+=`
    // Stripes pattern
`,r+=`    float ${e}_angle = ${t.toFixed(2)} * u_time * 0.2;
`,r+=`    float ${e}_s = sin(${e}_angle);
`,r+=`    float ${e}_c = cos(${e}_angle);
`,r+=`    vec2 ${e}_rotP = vec2(${e}_c * ${o}.x - ${e}_s * ${o}.y, ${e}_s * ${o}.x + ${e}_c * ${o}.y);
`;for(let s=1;s<=l;s++)r+=`    ${e} += sin(${e}_rotP.x * ${(i*s).toFixed(2)} + u_time * ${(t*.5).toFixed(2)});
`}else n==="radial"?(r+=`
    // Radial pattern
`,r+=`    float ${e}_angle = atan(${o}.y, ${o}.x);
`,r+=`    float ${e}_segments = ${(l*3).toFixed(1)};
`,r+=`    ${e} = sin(${e}_angle * ${e}_segments + u_time * ${t.toFixed(2)});
`,r+=`    ${e} += sin(length(${o}) * ${i.toFixed(2)} - u_time * ${t.toFixed(2)});
`):n==="voronoi"&&(r+=`
    // Voronoi-like pattern
`,r+=`    vec2 ${e}_i_st = floor(${o} * ${i.toFixed(2)});
`,r+=`    vec2 ${e}_f_st = fract(${o} * ${i.toFixed(2)});
`,r+=`    float ${e}_m_dist = 10.0;
`,r+=`    for (int y = -1; y <= 1; y++) {
`,r+=`        for (int x = -1; x <= 1; x++) {
`,r+=`            vec2 ${e}_neighbor = vec2(float(x), float(y));
`,r+=`            vec2 ${e}_point = random(${e}_i_st + ${e}_neighbor) * vec2(1.0, 1.0);
`,r+=`            ${e}_point = 0.5 + 0.5 * sin(u_time * ${t.toFixed(2)} + 6.2831 * ${e}_point);
`,r+=`            float ${e}_dist = length(${e}_neighbor + ${e}_point - ${e}_f_st);
`,r+=`            ${e}_m_dist = min(${e}_m_dist, ${e}_dist);
`,r+=`        }
`,r+=`    }
`,r+=`    ${e} = ${e}_m_dist * ${l.toFixed(1)};
`);return r}function $(e){const o=E(e.color1),n=E(e.color2),i=E(e.bgColor);let t=`precision mediump float;
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
    
    vec3 color = vec3(${i[0].toFixed(3)}, ${i[1].toFixed(3)}, ${i[2].toFixed(3)});
    float pattern = 0.0;
    `;if(t+=x("pattern","p",e.pattern,e.scale,e.speed,e.complexity),t+=`
    pattern = pattern / ${e.complexity.toFixed(1)};
`,t+=`    vec3 col1 = vec3(${o[0].toFixed(3)}, ${o[1].toFixed(3)}, ${o[2].toFixed(3)});
`,t+=`    vec3 col2 = vec3(${n[0].toFixed(3)}, ${n[1].toFixed(3)}, ${n[2].toFixed(3)});
`,t+=`    color = mix(col1, col2, pattern * 0.5 + 0.5);
`,e.distortion&&(t+=`
    // Distortion
`,t+=`    uv.x += sin(uv.y * 10.0 + u_time) * ${e.distortAmount.toFixed(3)};
`,t+=`    uv.y += cos(uv.x * 10.0 + u_time) * ${e.distortAmount.toFixed(3)};
`),e.glow&&(t+=`
    // Glow
`,t+=`    color += vec3(pattern) * ${e.glowStrength.toFixed(2)};
`),e.scanlines&&(t+=`
    // Scanlines
`,t+=`    float scanline = sin(uv.y * u_resolution.y * 1.5) * ${e.scanlineIntensity.toFixed(2)};
`,t+=`    color *= (1.0 - scanline);
`),e.vignette&&(t+=`
    // Vignette
`,t+=`    float vig = 1.0 - length(uv * 2.0 - 1.0) * ${e.vignetteRadius.toFixed(2)};
`,t+=`    color *= vig;
`),e.noise&&(t+=`
    // Noise
`,t+=`    color += random(uv + u_time * 0.1) * ${e.noiseAmount.toFixed(3)};
`),e.rgbSplit&&(t+=`
    // RGB Split
`,t+=`    vec2 offset = vec2(${e.rgbOffset.toFixed(3)}, 0.0);
`,t+=`    color.r = mix(col1, col2, (pattern + sin(uv.x * 50.0 + u_time) * 0.1) * 0.5 + 0.5).r;
`,t+=`    color.g = mix(col1, col2, pattern * 0.5 + 0.5).g;
`,t+=`    color.b = mix(col1, col2, (pattern - sin(uv.x * 50.0 + u_time) * 0.1) * 0.5 + 0.5).b;
`),e.pixelate&&(t+=`
    // Pixelate
`,t+=`    vec2 pixelSize = vec2(${e.pixelSize.toFixed(1)});
`,t+=`    vec2 pixelUV = floor(uv * u_resolution.xy / pixelSize) * pixelSize / u_resolution.xy;
`,t+=`    vec2 pixelP = (pixelUV * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);
`,t+=`    float pixelPattern = 0.0;
`,t+=x("pixelPattern","pixelP",e.pattern,e.scale,e.speed,e.complexity),t+=`    pixelPattern = pixelPattern / ${e.complexity.toFixed(1)};
`,t+=`    color = mix(col1, col2, pixelPattern * 0.5 + 0.5);
`),e.kaleidoscope&&(t+=`
    // Kaleidoscope
`,t+=`    vec2 kaleidoUV = uv - 0.5;
`,t+=`    float kaleidoAngle = atan(kaleidoUV.y, kaleidoUV.x);
`,t+=`    float kaleidoRadius = length(kaleidoUV);
`,t+=`    float kaleidoSegments = ${e.kaleidoSegments.toFixed(1)};
`,t+=`    kaleidoAngle = mod(kaleidoAngle, 6.28318 / kaleidoSegments);
`,t+=`    kaleidoAngle = abs(kaleidoAngle - 3.14159 / kaleidoSegments);
`,t+=`    kaleidoUV = vec2(cos(kaleidoAngle), sin(kaleidoAngle)) * kaleidoRadius + 0.5;
`,t+=`    vec2 kaleidoP = (kaleidoUV * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);
`,t+=`    float kaleidoPattern = 0.0;
`,t+=x("kaleidoPattern","kaleidoP",e.pattern,e.scale,e.speed,e.complexity),t+=`    kaleidoPattern = kaleidoPattern / ${e.complexity.toFixed(1)};
`,t+=`    color = mix(col1, col2, kaleidoPattern * 0.5 + 0.5);
`),e.chromaticAberration&&(t+=`
    // Chromatic Aberration
`,t+=`    float aberration = ${e.chromaticAmount.toFixed(3)};
`,t+=`    vec2 dir = uv - 0.5;
`,t+=`    vec2 uvR = uv - dir * aberration;
`,t+=`    vec2 uvB = uv + dir * aberration;
`,t+=`    vec2 pR = (uvR * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);
`,t+=`    vec2 pB = (uvB * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);
`,t+=`    float patternR = 0.0;
`,t+=`    float patternB = 0.0;
`,t+=x("patternR","pR",e.pattern,e.scale,e.speed,e.complexity),t+=x("patternB","pB",e.pattern,e.scale,e.speed,e.complexity),t+=`    patternR = patternR / ${e.complexity.toFixed(1)};
`,t+=`    patternB = patternB / ${e.complexity.toFixed(1)};
`,t+=`    color.r = mix(col1, col2, patternR * 0.5 + 0.5).r;
`,t+=`    color.b = mix(col1, col2, patternB * 0.5 + 0.5).b;
`),e.bloom&&(t+=`
    // Bloom
`,t+=`    float brightness = (color.r + color.g + color.b) / 3.0;
`,t+=`    if (brightness > 0.5) {
`,t+=`        color += (brightness - 0.5) * ${e.bloomStrength.toFixed(2)};
`,t+=`    }
`),e.swirl&&(t+=`
    // Swirl
`,t+=`    vec2 swirlUV = uv - 0.5;
`,t+=`    float swirlDist = length(swirlUV);
`,t+=`    float swirlAngle = atan(swirlUV.y, swirlUV.x);
`,t+=`    swirlAngle += swirlDist * ${e.swirlStrength.toFixed(2)} + u_time * 0.5;
`,t+=`    swirlUV = vec2(cos(swirlAngle), sin(swirlAngle)) * swirlDist + 0.5;
`,t+=`    vec2 swirlP = (swirlUV * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);
`,t+=`    float swirlPattern = 0.0;
`,t+=x("swirlPattern","swirlP",e.pattern,e.scale,e.speed,e.complexity),t+=`    swirlPattern = swirlPattern / ${e.complexity.toFixed(1)};
`,t+=`    color = mix(col1, col2, swirlPattern * 0.5 + 0.5);
`),e.invert&&(t+=`
    // Invert Colors
`,t+=`    color = vec3(1.0) - color;
`),e.posterize&&(t+=`
    // Posterize
`,t+=`    float levels = ${e.posterizeLevels.toFixed(1)};
`,t+=`    color = floor(color * levels) / levels;
`),e.edgeDetect&&(t+=`
    // Edge Detection
`,t+=`    float edgeStrength = ${e.edgeStrength.toFixed(2)};
`,t+=`    float edge = abs(sin(pattern * 50.0));
`,t+=`    color += vec3(edge) * edgeStrength * 0.3;
`),e.zoomBlur){t+=`
    // Zoom Blur
`,t+=`    vec2 center = uv - 0.5;
`,t+=`    float zoomAmount = ${e.zoomStrength.toFixed(3)};
`,t+=`    vec3 blurColor = vec3(0.0);
`,t+=`    for (float i = 0.0; i < 8.0; i++) {
`,t+=`        float scale = 1.0 - (i / 8.0) * zoomAmount;
`,t+=`        vec2 blurUV = center * scale + 0.5;
`,t+=`        vec2 blurP = (blurUV * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);
`,t+=`        float blurPattern = 0.0;
`;let l=x("blurPattern","blurP",e.pattern,e.scale,e.speed,e.complexity);t+=l.replace(/\n    /g,`
        `),t+=`        blurPattern = blurPattern / ${e.complexity.toFixed(1)};
`,t+=`        blurColor += mix(col1, col2, blurPattern * 0.5 + 0.5);
`,t+=`    }
`,t+=`    color = blurColor / 8.0;
`}return e.mirror&&(t+=`
    // Mirror
`,e.mirrorMode==="horizontal"?t+=`    uv.x = abs(uv.x - 0.5) + 0.5;
`:e.mirrorMode==="vertical"?t+=`    uv.y = abs(uv.y - 0.5) + 0.5;
`:e.mirrorMode==="both"&&(t+=`    uv.x = abs(uv.x - 0.5) + 0.5;
`,t+=`    uv.y = abs(uv.y - 0.5) + 0.5;
`),t+=`    vec2 mirrorP = (uv * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);
`,t+=`    float mirrorPattern = 0.0;
`,t+=x("mirrorPattern","mirrorP",e.pattern,e.scale,e.speed,e.complexity),t+=`    mirrorPattern = mirrorPattern / ${e.complexity.toFixed(1)};
`,t+=`    color = mix(col1, col2, mirrorPattern * 0.5 + 0.5);
`),e.thermal&&(t+=`
    // Thermal Vision
`,t+=`    float intensity = (color.r + color.g + color.b) / 3.0;
`,t+=`    vec3 cold = vec3(0.0, 0.0, 1.0);
`,t+=`    vec3 hot = vec3(1.0, 0.0, 0.0);
`,t+=`    color = mix(cold, hot, intensity) * ${e.thermalIntensity.toFixed(2)};
`),e.ripple&&(t+=`
    // Ripple
`,t+=`    vec2 rippleUV = uv - 0.5;
`,t+=`    float rippleDist = length(rippleUV);
`,t+=`    float ripple = sin(rippleDist * 20.0 - u_time * 3.0) * ${e.rippleStrength.toFixed(3)};
`,t+=`    rippleUV = rippleUV * (1.0 + ripple) + 0.5;
`,t+=`    vec2 rippleP = (rippleUV * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);
`,t+=`    float ripplePattern = 0.0;
`,t+=x("ripplePattern","rippleP",e.pattern,e.scale,e.speed,e.complexity),t+=`    ripplePattern = ripplePattern / ${e.complexity.toFixed(1)};
`,t+=`    color = mix(col1, col2, ripplePattern * 0.5 + 0.5);
`),t+=`
    // Animated text with distortion
`,t+=`    if (u_textEnabled) {
`,t+=`        vec2 textUV = vec2(uv.x, 1.0 - uv.y);
`,t+=`        
`,t+=`        // Animation patterns
`,t+=`        if (u_animPattern == 1) {
`,t+=`            // Spiral
`,t+=`            float angle = atan(textUV.y - 0.5, textUV.x - 0.5);
`,t+=`            float radius = length(textUV - 0.5);
`,t+=`            angle += u_time * u_animIntensity + radius * 5.0;
`,t+=`            textUV = vec2(cos(angle), sin(angle)) * radius + 0.5;
`,t+=`        } else if (u_animPattern == 2) {
`,t+=`            // Pulse
`,t+=`            vec2 center = textUV - 0.5;
`,t+=`            float pulse = sin(u_time * 3.0 * u_animIntensity) * 0.3 + 1.0;
`,t+=`            textUV = center * pulse + 0.5;
`,t+=`        } else if (u_animPattern == 3) {
`,t+=`            // Orbit
`,t+=`            float angle = u_time * u_animIntensity;
`,t+=`            mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
`,t+=`            textUV = rot * (textUV - 0.5) + 0.5;
`,t+=`        } else if (u_animPattern == 4) {
`,t+=`            // Explode
`,t+=`            vec2 center = textUV - 0.5;
`,t+=`            float dist = length(center);
`,t+=`            float explode = sin(u_time * 2.0 * u_animIntensity - dist * 10.0);
`,t+=`            textUV = center * (1.0 + explode * 0.5) + 0.5;
`,t+=`        }
`,t+=`        
`,t+=`        // Distortion effect
`,t+=`        textUV.x += sin(textUV.y * 20.0 + u_time * 2.0) * u_textDistortion * 0.02;
`,t+=`        textUV.y += cos(textUV.x * 20.0 + u_time * 2.0) * u_textDistortion * 0.02;
`,t+=`        
`,t+=`        vec4 textColor = texture2D(u_textTexture, textUV);
`,t+=`        color = mix(color, textColor.rgb, textColor.a);
`,t+=`    }
`,t+=`
    gl_FragColor = vec4(color, 1.0);
}`,t}const B=`
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`,C=Object.freeze(Object.defineProperty({__proto__:null,VERTEX_SHADER_SOURCE:B,generatePatternCode:x,generateShader:$,hexToRgb:E},Symbol.toStringTag,{value:"Module"}));class P{constructor(o){if(this.canvas=o,this.gl=o.getContext("webgl",{preserveDrawingBuffer:!0})||o.getContext("experimental-webgl",{preserveDrawingBuffer:!0}),!this.gl)throw new Error("WebGL not supported");this.program=null,this.startTime=Date.now(),this.frameCount=0,this.lastFpsUpdate=Date.now(),this.timeMultiplier=1,this.animationId=null,this.uniformLocations={},this.setupGeometry()}resizeCanvas(){const o=this.canvas.getBoundingClientRect();return this.canvas.width=Math.max(o.width,1)*window.devicePixelRatio,this.canvas.height=Math.max(o.height,1)*window.devicePixelRatio,this.gl.viewport(0,0,this.canvas.width,this.canvas.height),{width:Math.floor(this.canvas.width),height:Math.floor(this.canvas.height)}}compileShader(o,n){const i=this.gl.createShader(n);if(this.gl.shaderSource(i,o),this.gl.compileShader(i),!this.gl.getShaderParameter(i,this.gl.COMPILE_STATUS)){const t=this.gl.getShaderInfoLog(i);throw this.gl.deleteShader(i),new Error(t)}return i}createProgram(o){try{const n=this.compileShader(B,this.gl.VERTEX_SHADER),i=this.compileShader(o,this.gl.FRAGMENT_SHADER),t=this.gl.createProgram();if(this.gl.attachShader(t,n),this.gl.attachShader(t,i),this.gl.linkProgram(t),!this.gl.getProgramParameter(t,this.gl.LINK_STATUS))throw new Error(this.gl.getProgramInfoLog(t));return this.program&&this.gl.deleteProgram(this.program),this.program=t,this.uniformLocations={resolution:this.gl.getUniformLocation(t,"u_resolution"),time:this.gl.getUniformLocation(t,"u_time"),textTexture:this.gl.getUniformLocation(t,"u_textTexture"),textEnabled:this.gl.getUniformLocation(t,"u_textEnabled"),textDistortion:this.gl.getUniformLocation(t,"u_textDistortion"),animPattern:this.gl.getUniformLocation(t,"u_animPattern"),animIntensity:this.gl.getUniformLocation(t,"u_animIntensity"),position:this.gl.getAttribLocation(t,"a_position")},{success:!0}}catch(n){return{success:!1,error:n.message}}}setupGeometry(){const o=new Float32Array([-1,-1,1,-1,-1,1,1,1]),n=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,n),this.gl.bufferData(this.gl.ARRAY_BUFFER,o,this.gl.STATIC_DRAW)}render(o,n,i,t){if(!this.program)return 0;this.gl.useProgram(this.program);const l=this.uniformLocations;if(l.resolution&&this.gl.uniform2f(l.resolution,this.canvas.width,this.canvas.height),l.time){const d=(Date.now()-this.startTime)/1e3*this.timeMultiplier;this.gl.uniform1f(l.time,d)}if(l.textTexture&&o&&(this.gl.activeTexture(this.gl.TEXTURE0),this.gl.bindTexture(this.gl.TEXTURE_2D,o),this.gl.uniform1i(l.textTexture,0)),l.textEnabled&&this.gl.uniform1i(l.textEnabled,n.enabled?1:0),l.textDistortion&&this.gl.uniform1f(l.textDistortion,n.distortion),l.animPattern){const d={spiral:1,pulse:2,orbit:3,explode:4};this.gl.uniform1i(l.animPattern,d[i]||0)}l.animIntensity&&this.gl.uniform1f(l.animIntensity,t),l.position!==-1&&(this.gl.enableVertexAttribArray(l.position),this.gl.vertexAttribPointer(l.position,2,this.gl.FLOAT,!1,0,0)),this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4),this.frameCount++;const r=Date.now();let s=0;return r-this.lastFpsUpdate>=1e3&&(s=this.frameCount,this.frameCount=0,this.lastFpsUpdate=r),s}setTimeMultiplier(o){this.timeMultiplier=o}stopRender(){this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null)}}class L{constructor(o,n,i){this.gl=o,this.textCanvas=document.createElement("canvas"),this.textCanvas.width=n,this.textCanvas.height=i,this.textCtx=this.textCanvas.getContext("2d"),this.textTexture=o.createTexture(),o.bindTexture(o.TEXTURE_2D,this.textTexture),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),this.params={text:"SHADER",fontSize:80,font:"VT323",fontWeight:"bold",colorMode:"gradient",solidColor:"#00ff00",outline:!0,outlineWidth:3,outlineColor:"#000000",shadow:!1,shadowBlur:10,shadowColor:"#00ff00",distortion:.5,enabled:!0}}resize(o,n){this.textCanvas.width=o,this.textCanvas.height=n}updateTexture(o){if(!this.textCanvas||!this.textCtx)return;this.textCtx.clearRect(0,0,this.textCanvas.width,this.textCanvas.height);const n=`'${this.params.font}', sans-serif`;this.textCtx.font=`${this.params.fontWeight} ${this.params.fontSize}px ${n}`,this.textCtx.textAlign="center",this.textCtx.textBaseline="middle";const i=this.textCanvas.width/2,t=this.textCanvas.height/2;if(this.params.shadow?(this.textCtx.shadowColor=this.params.shadowColor,this.textCtx.shadowBlur=this.params.shadowBlur,this.textCtx.shadowOffsetX=0,this.textCtx.shadowOffsetY=0):(this.textCtx.shadowColor="transparent",this.textCtx.shadowBlur=0),this.params.colorMode==="gradient"){const l=this.textCtx.createLinearGradient(0,0,this.textCanvas.width,this.textCanvas.height),r=E(o.color1),s=E(o.color2);l.addColorStop(0,`rgb(${r[0]*255}, ${r[1]*255}, ${r[2]*255})`),l.addColorStop(1,`rgb(${s[0]*255}, ${s[1]*255}, ${s[2]*255})`),this.textCtx.fillStyle=l}else this.textCtx.fillStyle=this.params.solidColor;this.params.outline&&this.params.outlineWidth>0&&(this.textCtx.strokeStyle=this.params.outlineColor,this.textCtx.lineWidth=this.params.outlineWidth,this.textCtx.lineJoin="round",this.textCtx.miterLimit=2,this.textCtx.strokeText(this.params.text,i,t)),this.textCtx.fillText(this.params.text,i,t),this.gl.bindTexture(this.gl.TEXTURE_2D,this.textTexture),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,this.textCanvas)}getTexture(){return this.textTexture}getParams(){return this.params}}class R{constructor(o,n){this.canvas=o,this.statusCallback=n,this.mediaRecorder=null,this.recordedChunks=[],this.isRecording=!1,this.recordStartTime=0,this.recordInterval=null}exportPNG(){const o=document.createElement("a");o.download=`shader-${Date.now()}.png`,o.href=this.canvas.toDataURL("image/png",1),o.click(),this.statusCallback("PNG SAVED ✓")}async exportGIF(){this.statusCallback("CAPTURING FRAMES...");const o=15,i=o*2,t=Math.floor(1e3/o),r=Math.min(1,480/this.canvas.width),s=Math.floor(this.canvas.width*r),d=Math.floor(this.canvas.height*r),c=new GIF({workers:2,quality:15,width:s,height:d,workerScript:"https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js",transparent:null,dither:!1});for(let a=0;a<i;a++){await new Promise(v=>setTimeout(v,t));const u=document.createElement("canvas");u.width=s,u.height=d,u.getContext("2d").drawImage(this.canvas,0,0,s,d),c.addFrame(u,{delay:t,copy:!0}),this.statusCallback(`CAPTURING... ${a+1}/${i}`)}this.statusCallback("ENCODING GIF... (may take 10-20s)"),c.on("progress",a=>{this.statusCallback(`ENCODING GIF... ${Math.round(a*100)}%`)}),c.on("finished",a=>{const u=URL.createObjectURL(a),f=document.createElement("a");f.href=u,f.download=`shader-${Date.now()}.gif`,f.click(),URL.revokeObjectURL(u),this.statusCallback("GIF SAVED ✓")}),c.render()}startRecording(o){const n=this.canvas.captureStream(60);this.mediaRecorder=new MediaRecorder(n,{mimeType:"video/webm;codecs=vp9",videoBitsPerSecond:8e6}),this.recordedChunks=[],this.mediaRecorder.ondataavailable=i=>{i.data.size>0&&this.recordedChunks.push(i.data)},this.mediaRecorder.onstop=()=>{const i=new Blob(this.recordedChunks,{type:"video/webm"}),t=URL.createObjectURL(i),l=document.createElement("a");l.href=t,l.download=`shader-${Date.now()}.webm`,l.click(),URL.revokeObjectURL(t),this.statusCallback("VIDEO SAVED ✓")},this.mediaRecorder.start(),this.isRecording=!0,this.recordStartTime=Date.now(),this.recordInterval=setInterval(()=>{const i=Math.floor((Date.now()-this.recordStartTime)/1e3),t=Math.floor(i/60),l=i%60,r=`${t}:${l.toString().padStart(2,"0")}`;o(r)},1e3),this.statusCallback("RECORDING..."),o("0:00")}stopRecording(){return this.mediaRecorder&&this.isRecording?(this.mediaRecorder.stop(),this.isRecording=!1,this.recordInterval&&(clearInterval(this.recordInterval),this.recordInterval=null),!0):!1}isCurrentlyRecording(){return this.isRecording}}const b="modulepreload",T=function(e){return"/"+e},_={},A=function(o,n,i){let t=Promise.resolve();if(n&&n.length>0){let d=function(c){return Promise.all(c.map(a=>Promise.resolve(a).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),s=r?.nonce||r?.getAttribute("nonce");t=d(n.map(c=>{if(c=T(c),c in _)return;_[c]=!0;const a=c.endsWith(".css"),u=a?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${u}`))return;const f=document.createElement("link");if(f.rel=a?"stylesheet":b,a||(f.as="script"),f.crossOrigin="",f.href=c,s&&f.setAttribute("nonce",s),document.head.appendChild(f),a)return new Promise((v,y)=>{f.addEventListener("load",v),f.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${c}`)))})}))}function l(r){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=r,window.dispatchEvent(s),!s.defaultPrevented)throw r}return t.then(r=>{for(const s of r||[])s.status==="rejected"&&l(s.reason);return o().catch(l)})},F={crt:{color1:"#00ff00",color2:"#ff00ff",bgColor:"#000000",pattern:"dots",scale:8,speed:1,complexity:3,pixelate:!0,pixelSize:16},plasma:{color1:"#ff0066",color2:"#00ffff",bgColor:"#110022",pattern:"radial",scale:12,speed:2,complexity:6,kaleidoscope:!0,kaleidoSegments:8},matrix:{color1:"#ffffff",color2:"#6600ff",bgColor:"#000000",pattern:"spiral",scale:7,speed:1.2,complexity:5,chromaticAberration:!0,chromaticAmount:.05,zoomBlur:!0,zoomStrength:.04},tunnel:{color1:"#ffff00",color2:"#ff0088",bgColor:"#000011",pattern:"circles",scale:10,speed:1.5,complexity:8,bloom:!0,bloomStrength:1.5,glow:!0,glowStrength:2.5},glitch:{color1:"#00ffaa",color2:"#aa00ff",bgColor:"#000000",pattern:"voronoi",scale:6,speed:.8,complexity:7,swirl:!0,swirlStrength:3,ripple:!0,rippleStrength:.15},nebula:{color1:"#ff6600",color2:"#00ff99",bgColor:"#ffffff",pattern:"stripes",scale:15,speed:2.5,complexity:2,invert:!0,posterize:!0,posterizeLevels:6},fire:{color1:"#ff0000",color2:"#0000ff",bgColor:"#000000",pattern:"spiral",scale:5,speed:.6,complexity:6,thermal:!0,thermalIntensity:1.5,edgeDetect:!0,edgeStrength:1.2},kaleid:{color1:"#00ffff",color2:"#ff00ff",bgColor:"#001122",pattern:"voronoi",scale:10,speed:1,complexity:7,mirror:!0,mirrorMode:"both",kaleidoscope:!0,kaleidoSegments:12},waves:{color1:"#00ff00",color2:"#003300",bgColor:"#000000",pattern:"waves",scale:4,speed:.3,complexity:3,scanlines:!0,scanlineIntensity:.6,distortion:!0,distortAmount:.08,vignette:!0,vignetteRadius:.6},neon:{color1:"#ff00ff",color2:"#00ffff",bgColor:"#0a0a1a",pattern:"radial",scale:12,speed:1.8,complexity:8,glow:!0,glowStrength:2,bloom:!0,bloomStrength:1,noise:!0,noiseAmount:.15},pixel:{color1:"#00ff00",color2:"#ff0000",bgColor:"#000000",pattern:"grid",scale:25,speed:4,complexity:1,pixelate:!0,pixelSize:12,rgbSplit:!0,rgbOffset:.04,noise:!0,noiseAmount:.25},water:{color1:"#0088ff",color2:"#00ffaa",bgColor:"#001122",pattern:"dots",scale:5,speed:.5,complexity:6,ripple:!0,rippleStrength:.12,chromaticAberration:!0,chromaticAmount:.03,vignette:!0,vignetteRadius:.9}};function S(e,o,n,i,t){return document.getElementById("color1").addEventListener("input",l=>{e.color1=l.target.value,o.updateTexture(e),n()}),document.getElementById("color2").addEventListener("input",l=>{e.color2=l.target.value,o.updateTexture(e),n()}),document.getElementById("bgColor").addEventListener("input",l=>{e.bgColor=l.target.value,n()}),document.querySelectorAll("[data-pattern]").forEach(l=>{l.addEventListener("click",()=>{document.querySelectorAll("[data-pattern]").forEach(r=>r.classList.remove("active")),l.classList.add("active"),e.pattern=l.dataset.pattern,n()})}),document.getElementById("scale").addEventListener("input",l=>{e.scale=parseFloat(l.target.value),document.getElementById("scaleValue").textContent=e.scale.toFixed(1),n()}),document.getElementById("speed").addEventListener("input",l=>{e.speed=parseFloat(l.target.value),document.getElementById("speedValue").textContent=e.speed.toFixed(1),n()}),document.getElementById("complexity").addEventListener("input",l=>{e.complexity=parseInt(l.target.value),document.getElementById("complexityValue").textContent=e.complexity,n()}),g("effectScanlines","scanlines","scanlineParams",e,n),g("effectGlow","glow","glowParams",e,n),g("effectDistortion","distortion","distortParams",e,n),g("effectVignette","vignette","vignetteParams",e,n),g("effectNoise","noise","noiseParams",e,n),g("effectRGB","rgbSplit","rgbParams",e,n),g("effectPixelate","pixelate","pixelateParams",e,n),g("effectKaleidoscope","kaleidoscope","kaleidoParams",e,n),g("effectChromatic","chromaticAberration","chromaticParams",e,n),g("effectBloom","bloom","bloomParams",e,n),g("effectSwirl","swirl","swirlParams",e,n),document.getElementById("effectInvert").addEventListener("change",l=>{e.invert=l.target.checked,n()}),g("effectPosterize","posterize","posterizeParams",e,n),g("effectEdgeDetect","edgeDetect","edgeParams",e,n),g("effectZoomBlur","zoomBlur","zoomParams",e,n),g("effectMirror","mirror","mirrorParams",e,n),g("effectThermal","thermal","thermalParams",e,n),g("effectRipple","ripple","rippleParams",e,n),m("scanlineIntensity","scanlineValue","scanlineIntensity",e,n,2),m("glowStrength","glowValue","glowStrength",e,n,1),m("distortAmount","distortValue","distortAmount",e,n,2),m("vignetteRadius","vignetteValue","vignetteRadius",e,n,2),m("noiseAmount","noiseValue","noiseAmount",e,n,2),m("rgbOffset","rgbValue","rgbOffset",e,n,3),m("pixelSize","pixelValue","pixelSize",e,n,0),m("kaleidoSegments","kaleidoValue","kaleidoSegments",e,n,0),m("chromaticAmount","chromaticValue","chromaticAmount",e,n,3),m("bloomStrength","bloomValue","bloomStrength",e,n,1),m("swirlStrength","swirlValue","swirlStrength",e,n,1),m("posterizeLevels","posterizeValue","posterizeLevels",e,n,0),m("edgeStrength","edgeValue","edgeStrength",e,n,1),m("zoomStrength","zoomValue","zoomStrength",e,n,3),m("thermalIntensity","thermalValue","thermalIntensity",e,n,1),m("rippleStrength","rippleValue","rippleStrength",e,n,2),document.querySelectorAll("[data-mirror]").forEach(l=>{l.addEventListener("click",()=>{document.querySelectorAll("[data-mirror]").forEach(r=>r.classList.remove("active")),l.classList.add("active"),e.mirrorMode=l.dataset.mirror,e.mirror&&n()})}),U(e,o,n),k(e,o,n),document.getElementById("viewCodeBtn").addEventListener("click",async()=>{const{generateShader:l}=await A(async()=>{const{generateShader:c}=await Promise.resolve().then(()=>C);return{generateShader:c}},void 0),r=l(e),s=new Blob([r],{type:"text/plain"}),d=URL.createObjectURL(s);window.open(d,"_blank"),setTimeout(()=>URL.revokeObjectURL(d),1e3)}),document.getElementById("exportBtn").addEventListener("click",()=>{document.getElementById("exportModal").style.display="flex"}),document.getElementById("closeExportBtn").addEventListener("click",()=>{document.getElementById("exportModal").style.display="none"}),document.getElementById("exportPNG").addEventListener("click",()=>{i.exportPNG()}),document.getElementById("exportGIF").addEventListener("click",async()=>{document.getElementById("exportModal").style.display="none",await i.exportGIF()}),document.getElementById("exportVideo").addEventListener("click",()=>{document.getElementById("exportModal").style.display="none",w(i)}),document.getElementById("recordBtn").addEventListener("click",()=>{i.isCurrentlyRecording()?G(i):w(i)}),document.getElementById("timeSpeed").addEventListener("input",l=>{const r=parseFloat(l.target.value);t.setTimeMultiplier(r),document.getElementById("timeSpeedValue").textContent=r.toFixed(1)}),M(o,e),z()}function g(e,o,n,i,t){document.getElementById(e).addEventListener("change",l=>{i[o]=l.target.checked,n&&document.getElementById(n).classList.toggle("active",l.target.checked),t()})}function m(e,o,n,i,t,l){document.getElementById(e).addEventListener("input",r=>{const s=l===0?parseInt(r.target.value):parseFloat(r.target.value);i[n]=s,document.getElementById(o).textContent=l===0?s:s.toFixed(l),t()})}function U(e,o,n){document.querySelectorAll("[data-preset]").forEach(i=>{i.addEventListener("click",()=>{const t=F[i.dataset.preset];if(!t)return;const l=e.color1,r=e.color2,s=e.bgColor;Object.assign(e,{scanlines:!1,glow:!1,distortion:!1,vignette:!1,noise:!1,rgbSplit:!1,pixelate:!1,kaleidoscope:!1,chromaticAberration:!1,bloom:!1,swirl:!1,invert:!1,posterize:!1,edgeDetect:!1,zoomBlur:!1,mirror:!1,thermal:!1,ripple:!1}),Object.assign(e,t),e.color1=l,e.color2=r,e.bgColor=s,D(e),o.updateTexture(e),n()})})}function D(e){document.getElementById("scale").value=e.scale,document.getElementById("scaleValue").textContent=e.scale.toFixed(1),document.getElementById("speed").value=e.speed,document.getElementById("speedValue").textContent=e.speed.toFixed(1),document.getElementById("complexity").value=e.complexity,document.getElementById("complexityValue").textContent=e.complexity,document.querySelectorAll("[data-pattern]").forEach(o=>o.classList.remove("active")),document.querySelector(`[data-pattern="${e.pattern}"]`)?.classList.add("active"),document.getElementById("effectScanlines").checked=e.scanlines||!1,document.getElementById("effectGlow").checked=e.glow||!1,document.getElementById("effectDistortion").checked=e.distortion||!1,document.getElementById("effectVignette").checked=e.vignette||!1,document.getElementById("effectNoise").checked=e.noise||!1,document.getElementById("effectRGB").checked=e.rgbSplit||!1,document.getElementById("scanlineParams").classList.toggle("active",e.scanlines),document.getElementById("glowParams").classList.toggle("active",e.glow),document.getElementById("distortParams").classList.toggle("active",e.distortion),document.getElementById("vignetteParams").classList.toggle("active",e.vignette),document.getElementById("noiseParams").classList.toggle("active",e.noise),document.getElementById("rgbParams").classList.toggle("active",e.rgbSplit)}function k(e,o,n){document.getElementById("randomBtn").addEventListener("click",()=>{e.color1="#"+Math.floor(Math.random()*16777215).toString(16).padStart(6,"0"),e.color2="#"+Math.floor(Math.random()*16777215).toString(16).padStart(6,"0"),e.bgColor="#"+Math.floor(Math.random()*16777215).toString(16).padStart(6,"0"),e.scale=Math.random()*15+2,e.speed=Math.random()*3,e.complexity=Math.floor(Math.random()*6)+2,e.pattern=["waves","circles","grid","spiral","dots","stripes","radial","voronoi"][Math.floor(Math.random()*8)],document.getElementById("color1").value=e.color1,document.getElementById("color2").value=e.color2,document.getElementById("bgColor").value=e.bgColor,document.getElementById("scale").value=e.scale,document.getElementById("scaleValue").textContent=e.scale.toFixed(1),document.getElementById("speed").value=e.speed,document.getElementById("speedValue").textContent=e.speed.toFixed(1),document.getElementById("complexity").value=e.complexity,document.getElementById("complexityValue").textContent=e.complexity,document.querySelectorAll("[data-pattern]").forEach(i=>i.classList.remove("active")),document.querySelector(`[data-pattern="${e.pattern}"]`).classList.add("active"),n()})}function M(e,o,n){const i=e.getParams();document.getElementById("animText").addEventListener("input",t=>{i.text=t.target.value||"SHADER",e.updateTexture(o)}),document.getElementById("textFont").addEventListener("change",t=>{i.font=t.target.value,e.updateTexture(o)}),document.getElementById("fontSize").addEventListener("input",t=>{i.fontSize=parseInt(t.target.value),document.getElementById("fontSizeValue").textContent=i.fontSize,e.updateTexture(o)}),document.querySelectorAll("[data-weight]").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll("[data-weight]").forEach(l=>l.classList.remove("active")),t.classList.add("active"),i.fontWeight=t.dataset.weight,e.updateTexture(o)})}),document.querySelectorAll("[data-color]").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll("[data-color]").forEach(r=>r.classList.remove("active")),t.classList.add("active"),i.colorMode=t.dataset.color;const l=document.getElementById("textColor");l.style.display=i.colorMode==="solid"?"block":"none",e.updateTexture(o)})}),document.getElementById("textColor").addEventListener("input",t=>{i.solidColor=t.target.value,e.updateTexture(o)}),document.getElementById("textOutline").addEventListener("change",t=>{i.outline=t.target.checked,document.getElementById("outlineParams").classList.toggle("active",t.target.checked),e.updateTexture(o)}),document.getElementById("outlineWidth").addEventListener("input",t=>{i.outlineWidth=parseInt(t.target.value),document.getElementById("outlineWidthValue").textContent=i.outlineWidth,e.updateTexture(o)}),document.getElementById("outlineColor").addEventListener("input",t=>{i.outlineColor=t.target.value,e.updateTexture(o)}),document.getElementById("textShadow").addEventListener("change",t=>{i.shadow=t.target.checked,document.getElementById("shadowParams").classList.toggle("active",t.target.checked),e.updateTexture(o)}),document.getElementById("shadowBlur").addEventListener("input",t=>{i.shadowBlur=parseInt(t.target.value),document.getElementById("shadowBlurValue").textContent=i.shadowBlur,e.updateTexture(o)}),document.getElementById("shadowColor").addEventListener("input",t=>{i.shadowColor=t.target.value,e.updateTexture(o)}),document.getElementById("textDistort").addEventListener("input",t=>{i.distortion=parseFloat(t.target.value),document.getElementById("textDistortValue").textContent=i.distortion.toFixed(1)}),document.getElementById("textEnabled").addEventListener("change",t=>{i.enabled=t.target.checked})}function z(){let e=null,o=1;return document.querySelectorAll("[data-anim]").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll("[data-anim]").forEach(i=>i.classList.remove("active")),n.classList.add("active"),e=n.dataset.anim})}),document.getElementById("animIntensity").addEventListener("input",n=>{o=parseFloat(n.target.value),document.getElementById("animIntensityValue").textContent=o.toFixed(1)}),document.getElementById("clearAnimBtn").addEventListener("click",()=>{document.querySelectorAll("[data-anim]").forEach(n=>n.classList.remove("active")),e=null}),{getAnimationPattern:()=>e,getAnimationIntensity:()=>o}}function w(e){e.startRecording(o=>{document.getElementById("recordTime").textContent=o}),document.getElementById("recordingIndicator").style.display="block",document.getElementById("recordBtn").textContent="⏹️ STOP",document.getElementById("recordBtn").style.background="#f00"}function G(e){e.stopRecording(),document.getElementById("recordingIndicator").style.display="none",document.getElementById("recordBtn").textContent="🎬 RECORD",document.getElementById("recordBtn").style.background=""}function O(){document.querySelectorAll(".section-title").forEach(e=>{e.addEventListener("click",()=>{e.closest(".section").classList.toggle("collapsed")})})}function N(){const e=["ANIMATED TEXT","ANIMATIONS"];document.querySelectorAll(".section-title").forEach(n=>{const i=n.textContent.trim().replace("▼","").trim();e.includes(i)&&n.closest(".section").classList.add("collapsed")});const o=document.querySelector(".editor-panel");o&&(o.style.opacity="1"),document.querySelectorAll(".section").forEach(n=>{n.style.opacity="1"})}document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("shaderCanvas"),o=document.getElementById("fpsDisplay"),n=document.getElementById("resDisplay"),i=document.getElementById("statusText"),t=document.getElementById("errorDisplay"),l=new P(e),{width:r,height:s}=l.resizeCanvas();n.textContent=`${r}x${s}`;const d=new L(l.gl,r,s),c=new R(e,h=>{i.textContent=h,h.includes("✓")&&setTimeout(()=>i.textContent="RUNNING",2e3)}),a={color1:"#00ff00",color2:"#0000ff",bgColor:"#000000",pattern:"waves",scale:5,speed:1,complexity:3,scanlines:!1,scanlineIntensity:.5,glow:!1,glowStrength:.5,distortion:!1,distortAmount:.05,vignette:!1,vignetteRadius:.7,noise:!1,noiseAmount:.1,rgbSplit:!1,rgbOffset:.01,pixelate:!1,pixelSize:8,kaleidoscope:!1,kaleidoSegments:6,chromaticAberration:!1,chromaticAmount:.02,bloom:!1,bloomStrength:.8,swirl:!1,swirlStrength:2,invert:!1,posterize:!1,posterizeLevels:4,edgeDetect:!1,edgeStrength:1,zoomBlur:!1,zoomStrength:.02,mirror:!1,mirrorMode:"horizontal",thermal:!1,thermalIntensity:1,ripple:!1,rippleStrength:.1};let u=null;function f(){u&&clearTimeout(u),u=setTimeout(()=>{const h=$(a),p=l.createProgram(h);p.success?(t.classList.remove("show"),i.textContent="COMPILED ✓",setTimeout(()=>i.textContent="RUNNING",2e3)):(t.textContent="ERROR: "+p.error,t.classList.add("show"),i.textContent="ERROR")},50)}const v=S(a,d,f,c,l);window.addEventListener("resize",()=>{const{width:h,height:p}=l.resizeCanvas();n.textContent=`${h}x${p}`,d.resize(h,p),d.updateTexture(a)}),O(),N(),d.updateTexture(a),f();let y=null;function I(){const h=l.render(d.getTexture(),d.getParams(),v.getAnimationPattern(),v.getAnimationIntensity());h>0&&(o.textContent=h),y=requestAnimationFrame(I)}I(),window.addEventListener("beforeunload",()=>{y&&(cancelAnimationFrame(y),y=null),c.isCurrentlyRecording()&&c.stopRecording()})});
