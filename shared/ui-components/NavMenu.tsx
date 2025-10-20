/**
 * Global Navigation Menu Component
 * Consistent navigation across all React-based tools
 */

import { useState, useEffect, useRef } from 'react';

export const NavMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const menuItems = [
        { href: '/', label: 'HOME' },
        { href: '/tools/code-to-mp4/', label: 'CODE TO MP4' },
        { href: '/tools/ascii-art/', label: 'ASCII-FY' },
        { href: '/tools/shader-playground/', label: 'SHADER PLAYGROUND' },
        { href: '/tools/wave-visualizer/', label: 'WAVE VISUALIZER' },
    ];

    return (
        <div ref={dropdownRef} style={{ position: 'fixed', top: '8px', left: '20px', zIndex: 99999 }}>
            <button
                onClick={toggleMenu}
                className="tinkerium-nav-button"
            >
                ☰
            </button>
            {isOpen && (
                <nav className="tinkerium-nav-menu">
                    {menuItems.map((link, index, arr) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="tinkerium-nav-link"
                            style={{
                                borderBottom: index < arr.length - 1 ? '1px solid rgba(0, 255, 0, 0.3)' : 'none',
                            }}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            )}
        </div>
    );
};
