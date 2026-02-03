import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
    const { role } = useAuth();
    const location = useLocation();
    const { t } = useTranslation();

    return (
        <aside>
            <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1.5rem' }}>
                <img src="/images/img.png" alt="Hojio Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                <h2 className="logo-text" style={{ margin: 0, color: 'white', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Hojio</h2>
            </div>
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                <span>📊</span> <span className="nav-text">{t('nav.dashboard')}</span>
            </Link>
            {role === 'employer' && (
                <>
                    <Link to="/my-companies" className={location.pathname === '/my-companies' ? 'active' : ''}>
                        <span>🏢</span> <span className="nav-text">{t('nav.my_companies')}</span>
                    </Link>
                    <Link to="/employer/applications" className={location.pathname === '/employer/applications' ? 'active' : ''}>
                        <span>📑</span> <span className="nav-text">{t('nav.manage_applications')}</span>
                    </Link>
                    <Link to="/jobs/new" className={location.pathname === '/jobs/new' ? 'active' : ''}>
                        <span>➕</span> <span className="nav-text">{t('nav.post_job')}</span>
                    </Link>
                </>
            )}
            <Link to="/jobs" className={location.pathname === '/jobs' ? 'active' : ''}>
                <span>💼</span> <span className="nav-text">{t('nav.jobs')}</span>
            </Link>
            {role === 'seeker' && (
                <Link to="/my-applications" className={location.pathname === '/my-applications' ? 'active' : ''}>
                    <span>📝</span> <span className="nav-text">{t('nav.my_applications')}</span>
                </Link>
            )}
            <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
                <span>👤</span> <span className="nav-text">{t('nav.profile')}</span>
            </Link>
            {role === 'admin' && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ padding: '0 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('nav.administrative')}</div>
                    <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                        <span>🛰️</span> <span className="nav-text">{t('nav.command_center')}</span>
                    </Link>
                    <Link to="/admin/users" className={location.pathname === '/admin/users' ? 'active' : ''}>
                        <span>📋</span> <span className="nav-text">{t('nav.directory')}</span>
                    </Link>
                    <Link to="/admin/management/companies" className={location.pathname === '/admin/management/companies' ? 'active' : ''}>
                        <span>🏢</span> <span className="nav-text">{t('nav.entities')}</span>
                    </Link>
                    <Link to="/admin/management/jobs" className={location.pathname === '/admin/management/jobs' ? 'active' : ''}>
                        <span>🌐</span> <span className="nav-text">{t('nav.marketplace')}</span>
                    </Link>
                    <Link to="/admin/management/applications" className={location.pathname === '/admin/management/applications' ? 'active' : ''}>
                        <span>🛠️</span> <span className="nav-text">{t('nav.moderation')}</span>
                    </Link>
                    <Link to="/admin/activities" className={location.pathname === '/admin/activities' ? 'active' : ''}>
                        <span>📜</span> <span className="nav-text">{t('nav.audit_trail')}</span>
                    </Link>
                </div>
            )}
        </aside>
    )
}
