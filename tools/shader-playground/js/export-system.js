export class ExportSystem {
    constructor(canvas, statusCallback) {
        this.canvas = canvas;
        this.statusCallback = statusCallback;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;
        this.recordStartTime = 0;
        this.recordInterval = null;
    }
    
    exportPNG() {
        const link = document.createElement('a');
        link.download = `shader-${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png', 1.0);
        link.click();
        this.statusCallback('PNG SAVED ✓');
    }
    
    async exportGIF() {
        this.statusCallback('CAPTURING FRAMES...');
        
        const fps = 15;
        const duration = 2; // seconds
        const totalFrames = fps * duration;
        const delay = Math.floor(1000 / fps);
        
        // Scale down for GIF (max 480p width)
        const maxWidth = 480;
        const scale = Math.min(1, maxWidth / this.canvas.width);
        const gifWidth = Math.floor(this.canvas.width * scale);
        const gifHeight = Math.floor(this.canvas.height * scale);
        
        // Create GIF encoder with optimized settings
        const gif = new GIF({
            workers: 2,
            quality: 15,
            width: gifWidth,
            height: gifHeight,
            workerScript: 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js',
            transparent: null,
            dither: false
        });
        
        // Capture frames
        for (let i = 0; i < totalFrames; i++) {
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // Create a temporary canvas to copy and scale the WebGL canvas
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = gifWidth;
            tempCanvas.height = gifHeight;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(this.canvas, 0, 0, gifWidth, gifHeight);
            
            gif.addFrame(tempCanvas, { delay: delay, copy: true });
            this.statusCallback(`CAPTURING... ${i + 1}/${totalFrames}`);
        }
        
        this.statusCallback('ENCODING GIF... (may take 10-20s)');
        
        gif.on('progress', (p) => {
            this.statusCallback(`ENCODING GIF... ${Math.round(p * 100)}%`);
        });
        
        gif.on('finished', (blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `shader-${Date.now()}.gif`;
            link.click();
            URL.revokeObjectURL(url);
            
            this.statusCallback('GIF SAVED ✓');
        });
        
        gif.render();
    }
    
    startRecording(onRecordingStart) {
        const stream = this.canvas.captureStream(60); // 60 FPS
        this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 8000000
        });
        
        this.recordedChunks = [];
        
        this.mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                this.recordedChunks.push(e.data);
            }
        };
        
        this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `shader-${Date.now()}.webm`;
            link.click();
            URL.revokeObjectURL(url);
            
            this.statusCallback('VIDEO SAVED ✓');
        };
        
        this.mediaRecorder.start();
        this.isRecording = true;
        this.recordStartTime = Date.now();
        
        // Update recording timer
        this.recordInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.recordStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            onRecordingStart(timeString);
        }, 1000);
        
        this.statusCallback('RECORDING...');
        onRecordingStart('0:00');
    }
    
    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            
            if (this.recordInterval) {
                clearInterval(this.recordInterval);
                this.recordInterval = null;
            }
            
            return true;
        }
        return false;
    }
    
    isCurrentlyRecording() {
        return this.isRecording;
    }
}
