import { VERTEX_SHADER_SOURCE } from './shader-generator.js';

export class WebGLManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl', { preserveDrawingBuffer: true }) || 
                  canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
        
        if (!this.gl) {
            throw new Error('WebGL not supported');
        }
        
        this.program = null;
        this.startTime = Date.now();
        this.frameCount = 0;
        this.lastFpsUpdate = Date.now();
        this.timeMultiplier = 1.0;
        this.animationId = null;
        
        // Cache uniform locations
        this.uniformLocations = {};
        
        this.setupGeometry();
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = Math.max(rect.width, 1) * window.devicePixelRatio;
        this.canvas.height = Math.max(rect.height, 1) * window.devicePixelRatio;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        return {
            width: Math.floor(this.canvas.width),
            height: Math.floor(this.canvas.height)
        };
    }
    
    compileShader(source, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const error = this.gl.getShaderInfoLog(shader);
            this.gl.deleteShader(shader);
            throw new Error(error);
        }
        
        return shader;
    }
    
    createProgram(fragmentSource) {
        try {
            const vertexShader = this.compileShader(VERTEX_SHADER_SOURCE, this.gl.VERTEX_SHADER);
            const fragmentShader = this.compileShader(fragmentSource, this.gl.FRAGMENT_SHADER);
            
            const newProgram = this.gl.createProgram();
            this.gl.attachShader(newProgram, vertexShader);
            this.gl.attachShader(newProgram, fragmentShader);
            this.gl.linkProgram(newProgram);
            
            if (!this.gl.getProgramParameter(newProgram, this.gl.LINK_STATUS)) {
                throw new Error(this.gl.getProgramInfoLog(newProgram));
            }
            
            // Clean up old program
            if (this.program) {
                this.gl.deleteProgram(this.program);
            }
            
            this.program = newProgram;
            
            // Cache uniform locations for better performance
            this.uniformLocations = {
                resolution: this.gl.getUniformLocation(newProgram, 'u_resolution'),
                time: this.gl.getUniformLocation(newProgram, 'u_time'),
                textTexture: this.gl.getUniformLocation(newProgram, 'u_textTexture'),
                textEnabled: this.gl.getUniformLocation(newProgram, 'u_textEnabled'),
                textDistortion: this.gl.getUniformLocation(newProgram, 'u_textDistortion'),
                animPattern: this.gl.getUniformLocation(newProgram, 'u_animPattern'),
                animIntensity: this.gl.getUniformLocation(newProgram, 'u_animIntensity'),
                position: this.gl.getAttribLocation(newProgram, 'a_position')
            };
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    setupGeometry() {
        const positions = new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1,
        ]);
        
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    }
    
    render(textTexture, textParams, animationPattern, animationIntensity) {
        if (!this.program) {
            return 0; // Return 0 FPS when no program
        }
        
        this.gl.useProgram(this.program);
        
        const locs = this.uniformLocations;
        
        // Set uniforms using cached locations
        if (locs.resolution) {
            this.gl.uniform2f(locs.resolution, this.canvas.width, this.canvas.height);
        }
        
        if (locs.time) {
            const time = (Date.now() - this.startTime) / 1000.0 * this.timeMultiplier;
            this.gl.uniform1f(locs.time, time);
        }
        
        // Bind text texture and set animation uniforms
        if (locs.textTexture && textTexture) {
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, textTexture);
            this.gl.uniform1i(locs.textTexture, 0);
        }
        if (locs.textEnabled) {
            this.gl.uniform1i(locs.textEnabled, textParams.enabled ? 1 : 0);
        }
        if (locs.textDistortion) {
            this.gl.uniform1f(locs.textDistortion, textParams.distortion);
        }
        if (locs.animPattern) {
            const animMap = { spiral: 1, pulse: 2, orbit: 3, explode: 4 };
            this.gl.uniform1i(locs.animPattern, animMap[animationPattern] || 0);
        }
        if (locs.animIntensity) {
            this.gl.uniform1f(locs.animIntensity, animationIntensity);
        }
        
        // Set position attribute using cached location
        if (locs.position !== -1) {
            this.gl.enableVertexAttribArray(locs.position);
            this.gl.vertexAttribPointer(locs.position, 2, this.gl.FLOAT, false, 0, 0);
        }
        
        // Draw
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        
        // Update FPS
        this.frameCount++;
        const now = Date.now();
        let currentFps = 0;
        if (now - this.lastFpsUpdate >= 1000) {
            currentFps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = now;
        }
        
        return currentFps;
    }
    
    setTimeMultiplier(multiplier) {
        this.timeMultiplier = multiplier;
    }
    
    stopRender() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}
