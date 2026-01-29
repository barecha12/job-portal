import { Link, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import LanguageSwitcher from "./common/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function GuestLayout() {
    const { token } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t } = useTranslation();

    if (token) {
        return <Navigate to="/dashboard" />
    }

    return (
        <div className="guest-layout-wrapper">
            <nav style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                padding: '1rem 2rem',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="/images/img.png" alt="Hojio Logo" style={{ width: '35px', height: '35px', borderRadius: '6px' }} />
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                            Hojio
                        </div>
                    </div>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        ☰
                    </button>

                    <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '20px', marginRight: '20px' }}>
                            <a href="/" style={{ color: 'var(--text-primary)' }}>{t('nav.home')}</a>
                            <a href="/#about" style={{ color: 'var(--text-primary)' }}>{t('nav.about')}</a>
                            <a href="/#contact" style={{ color: 'var(--text-primary)' }}>{t('nav.contact')}</a>
                        </div>
                        <LanguageSwitcher />
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <Link to="/login" className="btn-logout" style={{ background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}>{t('nav.login')}</Link>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="mobile-menu" style={{
                        paddingTop: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        borderTop: '1px solid #eee',
                        marginTop: '1rem'
                    }}>
                        <a href="/" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-primary)', display: 'block', padding: '0.5rem 0' }}>Home</a>
                        <a href="/#about" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-primary)', display: 'block', padding: '0.5rem 0' }}>About</a>
                        <a href="/#contact" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-primary)', display: 'block', padding: '0.5rem 0' }}>Contact</a>
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-logout" style={{
                            background: 'transparent',
                            border: '1px solid var(--primary-color)',
                            color: 'var(--primary-color)',
                            textAlign: 'center',
                            display: 'block'
                        }}>Login</Link>
                    </div>
                )}
            </nav>
            <div className="guest-content-full">
                <Outlet />
            </div>
        </div>
    )
}
