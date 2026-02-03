import React from 'react';
import { useTranslation } from 'react-i18next';

const MaintenanceMode = () => {
    const { t } = useTranslation();

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            textAlign: 'center',
            fontFamily: "'Inter', sans-serif",
            padding: '20px'
        }}>
            <div style={{ fontSize: '6rem', marginBottom: '20px', animation: 'pulse 2s infinite' }}>🏗️</div>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '10px' }}>{t('maintenance.title')}</h1>
            <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', lineHeight: '1.6' }}>
                {t('maintenance.desc')}
            </p>
            <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '0.9rem', color: '#6366f1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('maintenance.target')}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '800' }}>{t('maintenance.status')}</p>
            </div>

            <button
                onClick={() => window.location.href = '/'}
                style={{
                    marginTop: '30px',
                    padding: '12px 30px',
                    borderRadius: '12px',
                    background: 'white',
                    color: '#0f172a',
                    border: 'none',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                {t('maintenance.refresh')}
            </button>

            <style>
                {`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
                `}
            </style>
        </div>
    );
};

export default MaintenanceMode;
