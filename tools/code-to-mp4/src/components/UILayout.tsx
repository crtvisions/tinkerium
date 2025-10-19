import React from 'react';

// --- Icon Components ---
const Icon: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        {children}
    </svg>
);

export const BackArrowIcon: React.FC<{ className?: string }> = ({ className }) => <Icon className={className}><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></Icon>;
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
    const baseClasses = "px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
        primary: 'bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 text-white',
        secondary: 'bg-gray-700 hover:bg-gray-600 focus:ring-gray-500 text-gray-200'
    };
    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`} {...props}>
            {children}
        </button>
    );
};


interface HeaderProps {
    title?: string;
    editorMode?: string;
    onEditorModeChange?: (mode: string) => void;
    onPreview?: () => void;
    onGenerate?: () => void;
    onClear?: () => void;
    isGenerating?: boolean;
}

const menuStyles = `
.menu {
  font-size: 14px;
  color: #000000;
  list-style: none;
  position: relative;
  margin: 0;
  padding: 0;
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
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 13px;
}

.menu .link:hover {
  color: #f97316;
}

.menu .link svg {
  width: 12px;
  height: 12px;
  transition: transform 0.2s ease;
  fill: currentColor;
}

.menu .item:hover .link svg {
  transform: rotate(180deg);
}

.menu .submenu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 120px;
  background: #1f2937;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden;
  transform: translateY(0);
  transition: all 0.2s ease;
  z-index: 1000;
  pointer-events: none;
  border: 1px solid #374151;
  padding: 8px 0;
  margin-top: 8px;
}

/* Add a pseudo-element to create an invisible hit area above the submenu */
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
  padding: 8px 16px;
  color: #e5e7eb;
  font-size: 13px;
  transition: all 0.15s ease;
  cursor: pointer;
  text-align: left;
  width: 100%;
  background: transparent;
  border: none;
  margin: 0;
  white-space: nowrap;
}

.submenu-link:hover {
  color: #f97316;
  background-color: rgba(249, 115, 22, 0.1);
}
`;

export const Header: React.FC<HeaderProps> = ({ 
    title = 'editor.js',
    editorMode = 'combined',
    onEditorModeChange,
    onPreview,
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
    <header className="w-full px-6 py-3 bg-gray-950 sticky top-0 z-10">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => {
                        if (window.history.length > 1) {
                            window.history.back();
                        } else {
                            window.location.href = '/';
                        }
                    }}
                    className="p-1 rounded hover:bg-gray-800 transition-colors"
                >
                    <BackArrowIcon className="w-5 h-5 text-gray-400 hover:text-gray-200" />
                </button>
                <h1 className="text-sm font-medium text-gray-300">{title}</h1>
                {onEditorModeChange && (
                    <div className="ml-4 pl-4 border-l border-gray-700 h-full flex items-center">
                        <div className="menu">
                            <div className="item">
                                <button className="link">
                                    <span className="text-xs">Editor Mode: <span className="text-orange-500">{editorMode === 'combined' ? 'Combined' : 'Split'}</span></span>
                                    <svg viewBox="0 0 360 360">
                                        <path d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z" />
                                    </svg>
                                </button>
                                <div className="submenu">
                                    <button 
                                        className={`submenu-link ${editorMode === 'combined' ? 'text-orange-500' : ''}`}
                                        onClick={() => onEditorModeChange('combined')}
                                    >
                                        Combined
                                    </button>
                                    <button 
                                        className={`submenu-link ${editorMode === 'split' ? 'text-orange-500' : ''}`}
                                        onClick={() => onEditorModeChange('split')}
                                    >
                                        Split
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
                        className="text-xs text-gray-400 hover:text-gray-200 transition-colors px-3 py-1"
                    >
                        Clear
                    </button>
                )}
                {onGenerate && (
                    <button 
                        onClick={onGenerate}
                        disabled={isGenerating}
                        className="text-xs bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500 disabled:opacity-50 text-white px-4 py-1.5 rounded font-semibold transition-colors"
                    >
                        {isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                )}
            </div>
        </div>
    </header>
);
};
