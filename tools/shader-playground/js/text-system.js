import { hexToRgb } from './shader-generator.js';

export class TextSystem {
    constructor(gl, canvasWidth, canvasHeight) {
        this.gl = gl;
        this.textCanvas = document.createElement('canvas');
        this.textCanvas.width = canvasWidth;
        this.textCanvas.height = canvasHeight;
        this.textCtx = this.textCanvas.getContext('2d');
        
        // Create text texture
        this.textTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.textTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        
        this.params = {
            text: 'SHADER',
            fontSize: 80,
            font: 'VT323',
            fontWeight: 'bold',
            colorMode: 'gradient',
            solidColor: '#00ff00',
            outline: true,
            outlineWidth: 3,
            outlineColor: '#000000',
            shadow: false,
            shadowBlur: 10,
            shadowColor: '#00ff00',
            distortion: 0.5,
            enabled: true
        };
    }
    
    resize(width, height) {
        this.textCanvas.width = width;
        this.textCanvas.height = height;
    }
    
    updateTexture(shaderParams) {
        if (!this.textCanvas || !this.textCtx) return;
        
        // Clear canvas
        this.textCtx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);
        
        // Set text style
        const fontFamily = `'${this.params.font}', sans-serif`;
        this.textCtx.font = `${this.params.fontWeight} ${this.params.fontSize}px ${fontFamily}`;
        this.textCtx.textAlign = 'center';
        this.textCtx.textBaseline = 'middle';
        
        const x = this.textCanvas.width / 2;
        const y = this.textCanvas.height / 2;
        
        // Apply shadow if enabled
        if (this.params.shadow) {
            this.textCtx.shadowColor = this.params.shadowColor;
            this.textCtx.shadowBlur = this.params.shadowBlur;
            this.textCtx.shadowOffsetX = 0;
            this.textCtx.shadowOffsetY = 0;
        } else {
            this.textCtx.shadowColor = 'transparent';
            this.textCtx.shadowBlur = 0;
        }
        
        // Set fill color (gradient or solid)
        if (this.params.colorMode === 'gradient') {
            const gradient = this.textCtx.createLinearGradient(0, 0, this.textCanvas.width, this.textCanvas.height);
            const c1 = hexToRgb(shaderParams.color1);
            const c2 = hexToRgb(shaderParams.color2);
            gradient.addColorStop(0, `rgb(${c1[0]*255}, ${c1[1]*255}, ${c1[2]*255})`);
            gradient.addColorStop(1, `rgb(${c2[0]*255}, ${c2[1]*255}, ${c2[2]*255})`);
            this.textCtx.fillStyle = gradient;
        } else {
            this.textCtx.fillStyle = this.params.solidColor;
        }
        
        // Draw outline if enabled
        if (this.params.outline && this.params.outlineWidth > 0) {
            this.textCtx.strokeStyle = this.params.outlineColor;
            this.textCtx.lineWidth = this.params.outlineWidth;
            this.textCtx.lineJoin = 'round';
            this.textCtx.miterLimit = 2;
            this.textCtx.strokeText(this.params.text, x, y);
        }
        
        // Draw filled text
        this.textCtx.fillText(this.params.text, x, y);
        
        // Upload to WebGL texture
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textTexture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textCanvas);
    }
    
    getTexture() {
        return this.textTexture;
    }
    
    getParams() {
        return this.params;
    }
}
