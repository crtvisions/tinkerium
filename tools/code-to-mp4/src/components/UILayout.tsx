import React from 'react';

// --- Icon Components ---
const Icon: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className, style }) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        {children}
    </svg>
);

export const BackArrowIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => <Icon className={className} style={style}><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></Icon>;
export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => <Icon className={className}><path d="M8 5v14l11-7z" /></Icon>;
export const MovieIcon: React.FC<{ className?: string }> = ({ className }) => <Icon className={className}><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" /></Icon>;
export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => <Icon className={className}><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" /></Icon>;
export const RotateCcwIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v6h6" />
        <path d="M3 13a9 9 0 1 0 3-7.7L3 8" />
    </svg>
);

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
    const baseClasses = "px-4 py-2 focus:outline-none transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClass = variant === 'primary' ? 'primary-action' : '';
    return (
        <button 
            className={`${baseClasses} ${variantClass} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
};


interface HeaderProps {
    title?: string;
    editorMode?: string;
    onEditorModeChange?: (mode: string) => void;
    onGenerate?: () => void;
    onClear?: () => void;
    isGenerating?: boolean;
}

const menuStyles = `
.menu {
  font-size: 16px;
  color: #0f0;
  list-style: none;
  position: relative;
  margin: 0;
  padding: 0;
  font-family: 'VT323', monospace;
}

.menu .item {
  position: relative;
  display: inline-block;
}

.menu .link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: none;
  border: none;
  color: #0f0;
  font-size: 16px;
  font-family: 'VT323', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
}

.menu .link:hover {
  opacity: 1;
}

.menu .link svg {
  width: 10px;
  height: 10px;
  transition: transform 0.2s ease;
  fill: currentColor;
  opacity: 0.5;
}

.menu .item:hover .link svg {
  transform: rotate(180deg);
}

.menu .submenu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 140px;
  background: #000;
  opacity: 0;
  visibility: hidden;
  transform: translateY(0);
  transition: all 0.2s ease;
  z-index: 1000;
  pointer-events: none;
  border: 1px solid rgba(0, 255, 0, 0.5);
  padding: 4px 0;
  margin-top: 8px;
}

.menu .submenu::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 0;
  right: 0;
  height: 8px;
  background: transparent;
  pointer-events: auto;
}

.menu .item:hover .submenu,
.menu .submenu:hover {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.submenu-link {
  display: block;
  padding: 6px 14px;
  color: #0f0;
  font-size: 16px;
  font-family: 'VT323', monospace;
  transition: all 0.15s ease;
  cursor: pointer;
  text-align: left;
  width: 100%;
  background: transparent;
  border: none;
  margin: 0;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.7;
}

.submenu-link:hover {
  opacity: 1;
  background-color: rgba(0, 255, 0, 0.1);
}`;

export const Header: React.FC<HeaderProps> = ({ 
    title = 'editor.js',
    editorMode = 'combined',
    onEditorModeChange,
    onGenerate,
    onClear,
    isGenerating = false
}) => {
    // Add the styles to the document head
    React.useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = menuStyles;
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    return (
    <header className="w-full px-6 py-3 sticky top-0" style={{ background: '#000', borderBottom: '1px solid rgba(0, 255, 0, 0.3)', zIndex: 1, paddingLeft: '90px' }}>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <h1 style={{ fontSize: '18px', color: '#0f0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'normal', opacity: 0.9 }}>{title}</h1>
                {onEditorModeChange && (
                    <div className="ml-4 pl-4 h-full flex items-center" style={{ borderLeft: '1px solid rgba(0, 255, 0, 0.2)' }}>
                        <div className="menu">
                            <div className="item">
                                <button className="link">
                                    <span style={{ fontSize: '16px', opacity: 0.8 }}>Mode: <span style={{ opacity: 1 }}>{editorMode === 'combined' ? 'Combined' : 'Split'}</span></span>
                                    <svg viewBox="0 0 360 360">
                                        <path d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z" />
                                    </svg>
                                </button>
                                <div className="submenu">
                                    <button 
                                        className="submenu-link"
                                        onClick={() => onEditorModeChange('combined')}
                                    >
                                        {editorMode === 'combined' ? '▸ ' : '  '}Combined
                                    </button>
                                    <button 
                                        className="submenu-link"
                                        onClick={() => onEditorModeChange('split')}
                                    >
                                        {editorMode === 'split' ? '▸ ' : '  '}Split
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-3">
                {onClear && (
                    <button 
                        onClick={onClear}
                        className="px-3 py-1"
                        style={{ fontSize: '16px', opacity: 0.7 }}
                    >
                        Clear
                    </button>
                )}
                {onGenerate && (
                    <button 
                        onClick={onGenerate}
                        disabled={isGenerating}
                        className="px-4 py-1.5 font-semibold primary-action"
                        style={{ fontSize: '16px' }}
                    >
                        {isGenerating ? 'Generating...' : '▸ Generate'}
                    </button>
                )}
            </div>
        </div>
    </header>
);
};
