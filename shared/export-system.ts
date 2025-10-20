/**
 * Universal Export System for Tinkerium Tools
 * Provides consistent export functionality across all tools
 */

export interface ExportOptions {
  canvas: HTMLCanvasElement;
  filename?: string;
  format: 'png' | 'gif' | 'mp4';
  quality?: number;
  duration?: number; // for GIF/MP4
  fps?: number;
}

/**
 * Generate timestamp-based filename
 */
export function generateFilename(prefix: string, extension: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${prefix}-${timestamp}.${extension}`;
}

/**
 * Export canvas as PNG
 */
export async function exportPNG(canvas: HTMLCanvasElement, filename?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create PNG blob'));
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || generateFilename('tinkerium', 'png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png', 1.0);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Export canvas as animated GIF
 */
export async function exportGIF(
  canvas: HTMLCanvasElement,
  duration: number = 3000,
  fps: number = 30,
  filename?: string
): Promise<void> {
  // Note: This requires gif.js library to be loaded
  // @ts-ignore
  if (typeof GIF === 'undefined') {
    console.warn('GIF.js not loaded, exporting single frame as PNG instead');
    return exportPNG(canvas, filename);
  }

  return new Promise((resolve, reject) => {
    try {
      // @ts-ignore
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
        workerScript: '/js/gif.worker.js',
      });

      const frameDelay = 1000 / fps;
      const totalFrames = Math.floor(duration / frameDelay);

      // Capture frames
      for (let i = 0; i < totalFrames; i++) {
        gif.addFrame(canvas, { copy: true, delay: frameDelay });
      }

      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || generateFilename('tinkerium', 'gif');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resolve();
      });

      gif.on('error', reject);
      gif.render();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Video Recorder class for MP4 export
 */
export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private startTime: number = 0;
  private onProgress?: (elapsed: number) => void;
  private progressInterval?: number;

  constructor(private canvas: HTMLCanvasElement, private fps: number = 60) {}

  /**
   * Start recording
   */
  start(onProgress?: (elapsed: number) => void): void {
    this.onProgress = onProgress;
    this.chunks = [];
    
    // Create stream from canvas
    this.stream = this.canvas.captureStream(this.fps);
    
    // Create media recorder
    const options: MediaRecorderOptions = {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000, // 5 Mbps
    };

    // Fallback to VP8 if VP9 not supported
    if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
      options.mimeType = 'video/webm;codecs=vp8';
    }

    this.mediaRecorder = new MediaRecorder(this.stream, options);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.startTime = Date.now();
    this.mediaRecorder.start();

    // Progress tracking
    if (this.onProgress) {
      this.progressInterval = window.setInterval(() => {
        const elapsed = (Date.now() - this.startTime) / 1000;
        this.onProgress?.(elapsed);
      }, 100);
    }
  }

  /**
   * Stop recording and download
   */
  async stop(filename?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || generateFilename('tinkerium', 'webm');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Cleanup
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
        }
        this.mediaRecorder = null;
        this.stream = null;

        resolve();
      };

      this.mediaRecorder.onerror = reject;
      this.mediaRecorder.stop();
    });
  }

  /**
   * Check if currently recording
   */
  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  /**
   * Get elapsed recording time in seconds
   */
  getElapsedTime(): number {
    if (!this.isRecording()) return 0;
    return (Date.now() - this.startTime) / 1000;
  }
}

/**
 * Export canvas as video (convenience wrapper)
 */
export function createVideoRecorder(canvas: HTMLCanvasElement, fps: number = 60): VideoRecorder {
  return new VideoRecorder(canvas, fps);
}

/**
 * Batch export - save in multiple formats
 */
export async function exportMultipleFormats(
  canvas: HTMLCanvasElement,
  formats: Array<'png' | 'gif' | 'mp4'>,
  options?: Partial<ExportOptions>
): Promise<void> {
  const baseFilename = options?.filename || 'tinkerium';
  
  for (const format of formats) {
    switch (format) {
      case 'png':
        await exportPNG(canvas, `${baseFilename}.png`);
        break;
      case 'gif':
        await exportGIF(
          canvas,
          options?.duration || 3000,
          options?.fps || 30,
          `${baseFilename}.gif`
        );
        break;
      case 'mp4':
        console.warn('MP4 export requires manual recording start/stop');
        break;
    }
  }
}
