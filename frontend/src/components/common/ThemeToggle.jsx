import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first, then system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            style={{
                background: 'var(--surface-hover)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                transition: 'all 0.3s ease',
                color: 'var(--text-primary)'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--primary-color)';
                e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--surface-hover)';
                e.currentTarget.style.color = 'var(--text-primary)';
            }}
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
            {theme === 'light' ? <FaMoon size={18} /> : <FaSun size={18} />}
        </button>
    );
}
