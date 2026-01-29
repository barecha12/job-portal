import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div style={{ marginRight: '15px' }}>
            <select
                onChange={(e) => changeLanguage(e.target.value)}
                value={i18n.language}
                style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#64748b',
                    outline: 'none'
                }}
            >
                <option value="en">🇺🇸 EN</option>
                <option value="am">🇪🇹 AM</option>
                <option value="om">🇪🇹 OM</option>
            </select>
        </div>
    );
}
