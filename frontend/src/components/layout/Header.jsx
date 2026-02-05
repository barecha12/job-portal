import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";
import ThemeToggle from "../common/ThemeToggle";

export default function Header({ sidebarCollapsed, setSidebarCollapsed, onLogout }) {
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            background: 'var(--navbar-bg)',
            boxShadow: 'var(--shadow-sm)',
            borderBottom: '1px solid var(--border-color)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button className="toggle-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                    ☰
                </button>
                <div style={{ fontWeight: '700', color: 'var(--primary-color)', letterSpacing: '0.05em' }}>
                    HOJIO - PORTAL
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <ThemeToggle />
                <LanguageSwitcher />
                <Link to="/profile" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }}>{user.name}</Link>
                <a href="#" onClick={onLogout} className="btn-logout" style={{ fontSize: '0.9rem' }}>{t('nav.logout')}</a>
            </div>
        </header>
    )
}
