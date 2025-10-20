/**
 * Preset Selector Component
 * Reusable UI for selecting aesthetic presets across all tools
 */

import { useState } from 'react';
import { AESTHETIC_PRESETS, AestheticPreset, getRandomPreset } from '../aesthetic-presets';

interface PresetSelectorProps {
  onPresetSelect: (preset: AestheticPreset) => void;
  currentPreset?: AestheticPreset | null;
  className?: string;
}

export function PresetSelector({ onPresetSelect, currentPreset, className = '' }: PresetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const presets = Object.values(AESTHETIC_PRESETS);

  const handleRandomize = () => {
    const randomPreset = getRandomPreset();
    onPresetSelect(randomPreset);
    setIsOpen(false);
  };

  return (
    <div className={`preset-selector ${className}`}>
      <div className="control-group">
        <label className="control-label">► AESTHETIC PRESET:</label>
        
        <div className="preset-controls">
          <button
            className="preset-button current-preset"
            onClick={() => setIsOpen(!isOpen)}
          >
            {currentPreset?.name || 'Select Preset'} ▼
          </button>
          
          <button
            className="preset-button random-button"
            onClick={handleRandomize}
            title="Random Preset"
          >
            🎲 Random
          </button>
        </div>

        {isOpen && (
          <div className="preset-dropdown">
            <div className="preset-grid">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  className={`preset-card ${currentPreset?.id === preset.id ? 'active' : ''}`}
                  onClick={() => {
                    onPresetSelect(preset);
                    setIsOpen(false);
                  }}
                  style={{
                    borderColor: preset.colors.primary,
                  }}
                >
                  <div className="preset-header">
                    <div className="preset-name">{preset.name}</div>
                    <div
                      className="preset-colors"
                      style={{
                        background: `linear-gradient(135deg, ${preset.colors.primary}, ${preset.colors.secondary})`,
                      }}
                    />
                  </div>
                  <div className="preset-description">{preset.description}</div>
                  <div className="preset-tags">
                    {preset.tags?.map((tag) => (
                      <span key={tag} className="preset-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .preset-selector {
          margin-bottom: 20px;
        }

        .preset-controls {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .preset-button {
          flex: 1;
          padding: 12px 20px;
          background: transparent;
          border: 2px solid #0f0;
          color: #0f0;
          font-family: 'VT323', monospace;
          font-size: 20px;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.2s;
          text-shadow: 0 0 5px #0f0;
        }

        .preset-button:hover {
          background: #0f0;
          color: #000;
          box-shadow: 0 0 15px #0f0;
        }

        .random-button {
          flex: 0 0 auto;
          padding: 12px 30px;
        }

        .preset-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 10px;
          background: #000;
          border: 2px solid #0f0;
          box-shadow: 0 0 20px #0f0;
          padding: 20px;
          z-index: 1000;
          max-height: 80vh;
          overflow-y: auto;
        }

        .preset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }

        .preset-card {
          padding: 15px;
          background: rgba(0, 255, 0, 0.05);
          border: 2px solid #0f0;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .preset-card:hover {
          background: rgba(0, 255, 0, 0.1);
          box-shadow: 0 0 15px #0f0;
          transform: translateY(-2px);
        }

        .preset-card.active {
          background: rgba(0, 255, 0, 0.2);
          box-shadow: 0 0 20px #0f0;
        }

        .preset-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .preset-name {
          font-family: 'VT323', monospace;
          font-size: 24px;
          letter-spacing: 2px;
          color: #0f0;
          text-shadow: 0 0 5px #0f0;
        }

        .preset-colors {
          width: 40px;
          height: 40px;
          border: 2px solid #0f0;
          box-shadow: 0 0 10px #0f0;
        }

        .preset-description {
          font-family: 'VT323', monospace;
          font-size: 16px;
          color: #0f0;
          opacity: 0.8;
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .preset-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .preset-tag {
          padding: 4px 8px;
          background: transparent;
          border: 1px solid #0f0;
          font-family: 'VT323', monospace;
          font-size: 14px;
          color: #0f0;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .preset-grid {
            grid-template-columns: 1fr;
          }

          .preset-controls {
            flex-direction: column;
          }

          .random-button {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
