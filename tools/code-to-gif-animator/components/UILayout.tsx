
import React from 'react';

// --- Icon Components ---
const Icon: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <svg className={className} xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        {children}
    </svg>
);

export const BackArrowIcon: React.FC<{ className?: string }> = ({ className }) => <Icon className={className}><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></Icon>;
export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => <Icon className={className}><path d="M8 5v14l11-7z" /></Icon>;
export const MovieIcon: React.FC<{ className?: string }> = ({ className }) => <Icon className={className}><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" /></Icon>;
export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => <Icon className={className}><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" /></Icon>;
export const RotateCcwIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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


// --- Header Component ---
export const Header: React.FC = () => (
    <header className="w-full p-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-center gap-3 relative">
            <a href="#" aria-label="Go back to main site" className="p-2 rounded-full hover:bg-gray-700 transition-colors absolute left-0 top-1/2 -translate-y-1/2">
                <BackArrowIcon className="w-6 h-6 text-gray-300" />
            </a>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500 rounded-lg">
                    <MovieIcon className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Code to GIF Animator</h1>
            </div>
        </div>
    </header>
);
