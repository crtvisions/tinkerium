/**
 * Export Modal Component
 * Reusable UI for exporting content across all tools
 */

import { useState } from 'react';

export type ExportFormat = 'png' | 'gif' | 'mp4';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: ExportFormat, options: ExportOptions) => void;
  isRecording?: boolean;
  recordingTime?: number;
  supportsGif?: boolean;
  supportsVideo?: boolean;
}

export interface ExportOptions {
  format: ExportFormat;
  quality: number;
  duration?: number; // for GIF
  fps?: number;
  width?: number;
  height?: number;
  filename?: string;
}

export function ExportModal({
  isOpen,
  onClose,
  onExport,
  isRecording = false,
  recordingTime = 0,
  supportsGif = true,
  supportsVideo = true,
}: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [quality, setQuality] = useState(1.0);
  const [duration, setDuration] = useState(3);
  const [fps, setFps] = useState(30);
  const [filename, setFilename] = useState('');

  if (!isOpen) return null;

  const handleExport = () => {
    const options: ExportOptions = {
      format: selectedFormat,
      quality,
      duration: selectedFormat === 'gif' ? duration * 1000 : undefined,
      fps: selectedFormat !== 'png' ? fps : undefined,
      filename: filename || undefined,
    };
    onExport(selectedFormat, options);
  };

  const formatRecordingTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="export-modal-header">
          <h2 className="export-modal-title">► EXPORT</h2>
          <button className="export-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="export-modal-content">
          {isRecording ? (
            <div className="recording-status">
              <div className="recording-indicator">
                <span className="recording-dot">●</span>
                RECORDING
              </div>
              <div className="recording-time">{formatRecordingTime(recordingTime)}</div>
              <button className="export-button stop-recording" onClick={() => onExport('mp4', { format: 'mp4', quality })}>
                ⏹ Stop Recording
              </button>
            </div>
          ) : (
            <>
              <div className="export-section">
                <label className="export-label">FORMAT:</label>
                <div className="format-buttons">
                  <button
                    className={`format-button ${selectedFormat === 'png' ? 'active' : ''}`}
                    onClick={() => setSelectedFormat('png')}
                  >
                    PNG
                    <span className="format-description">Single Frame</span>
                  </button>
                  {supportsGif && (
                    <button
                      className={`format-button ${selectedFormat === 'gif' ? 'active' : ''}`}
                      onClick={() => setSelectedFormat('gif')}
                    >
                      GIF
                      <span className="format-description">Animated</span>
                    </button>
                  )}
                  {supportsVideo && (
                    <button
                      className={`format-button ${selectedFormat === 'mp4' ? 'active' : ''}`}
                      onClick={() => setSelectedFormat('mp4')}
                    >
                      MP4
                      <span className="format-description">Video</span>
                    </button>
                  )}
                </div>
              </div>

              {selectedFormat === 'gif' && (
                <div className="export-section">
                  <label className="export-label">DURATION: {duration}s</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="export-slider"
                  />
                </div>
              )}

              {selectedFormat !== 'png' && (
                <div className="export-section">
                  <label className="export-label">FPS: {fps}</label>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value))}
                    className="export-slider"
                  />
                </div>
              )}

              <div className="export-section">
                <label className="export-label">QUALITY: {Math.round(quality * 100)}%</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="export-slider"
                />
              </div>

              <div className="export-section">
                <label className="export-label">FILENAME (optional):</label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="tinkerium"
                  className="export-input"
                />
              </div>

              <div className="export-actions">
                <button className="export-button cancel" onClick={onClose}>
                  Cancel
                </button>
                <button className="export-button primary" onClick={handleExport}>
                  {selectedFormat === 'mp4' ? '● Start Recording' : `Export ${selectedFormat.toUpperCase()}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .export-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.2s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .export-modal {
          background: #000;
          border: 2px solid #0f0;
          box-shadow: 0 0 30px #0f0;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s;
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .export-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 2px solid #0f0;
        }

        .export-modal-title {
          font-family: 'VT323', monospace;
          font-size: 32px;
          letter-spacing: 4px;
          color: #0f0;
          text-shadow: 0 0 10px #0f0;
          margin: 0;
        }

        .export-modal-close {
          background: transparent;
          border: 2px solid #0f0;
          color: #0f0;
          font-size: 24px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .export-modal-close:hover {
          background: #0f0;
          color: #000;
          box-shadow: 0 0 15px #0f0;
        }

        .export-modal-content {
          padding: 30px;
        }

        .export-section {
          margin-bottom: 25px;
        }

        .export-label {
          display: block;
          font-family: 'VT323', monospace;
          font-size: 20px;
          letter-spacing: 2px;
          color: #0f0;
          margin-bottom: 10px;
          text-shadow: 0 0 5px #0f0;
        }

        .format-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
        }

        .format-button {
          padding: 20px;
          background: transparent;
          border: 2px solid #0f0;
          color: #0f0;
          font-family: 'VT323', monospace;
          font-size: 24px;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .format-button:hover {
          background: rgba(0, 255, 0, 0.1);
          box-shadow: 0 0 15px #0f0;
        }

        .format-button.active {
          background: #0f0;
          color: #000;
          box-shadow: 0 0 20px #0f0;
        }

        .format-description {
          font-size: 14px;
          opacity: 0.7;
        }

        .export-slider {
          width: 100%;
          height: 8px;
          background: transparent;
          border: 2px solid #0f0;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
        }

        .export-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #0f0;
          cursor: pointer;
          box-shadow: 0 0 10px #0f0;
        }

        .export-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #0f0;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px #0f0;
        }

        .export-input {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 2px solid #0f0;
          color: #0f0;
          font-family: 'VT323', monospace;
          font-size: 20px;
          letter-spacing: 2px;
          outline: none;
        }

        .export-input:focus {
          box-shadow: 0 0 15px #0f0;
        }

        .export-actions {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .export-button {
          flex: 1;
          padding: 15px;
          background: transparent;
          border: 2px solid #0f0;
          color: #0f0;
          font-family: 'VT323', monospace;
          font-size: 22px;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.2s;
          text-shadow: 0 0 5px #0f0;
        }

        .export-button:hover {
          background: #0f0;
          color: #000;
          box-shadow: 0 0 15px #0f0;
        }

        .export-button.primary {
          background: #0f0;
          color: #000;
        }

        .export-button.primary:hover {
          box-shadow: 0 0 25px #0f0;
        }

        .recording-status {
          text-align: center;
          padding: 40px 20px;
        }

        .recording-indicator {
          font-family: 'VT323', monospace;
          font-size: 32px;
          letter-spacing: 4px;
          color: #ff0000;
          text-shadow: 0 0 10px #ff0000;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        .recording-dot {
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .recording-time {
          font-family: 'VT323', monospace;
          font-size: 48px;
          color: #0f0;
          text-shadow: 0 0 10px #0f0;
          margin-bottom: 30px;
        }

        .stop-recording {
          max-width: 300px;
          margin: 0 auto;
          background: #ff0000;
          border-color: #ff0000;
          color: #000;
        }

        .stop-recording:hover {
          box-shadow: 0 0 25px #ff0000;
        }

        @media (max-width: 640px) {
          .export-modal {
            width: 95%;
          }

          .export-modal-content {
            padding: 20px;
          }

          .format-buttons {
            grid-template-columns: 1fr;
          }

          .export-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
