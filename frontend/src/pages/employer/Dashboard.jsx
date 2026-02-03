import { useEffect, useState } from "react";
import axiosClient from "../../services/axios-client";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ stats: [], recent_activity: [] });
    const { user } = useAuth();

    useEffect(() => {
        axiosClient.get('/dashboard-stats')
            .then(({ data }) => {
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            })
    }, [])

    return (
        <div className="animated fadeInDown">
            <h1 style={{ marginBottom: '20px' }}>{t('dashboard.title')}</h1>
            <p style={{ marginBottom: '30px', color: 'var(--text-secondary)' }}>{t('dashboard.welcome', { name: user.name })}</p>

            {loading && <div className="text-center">{t('dashboard.loading_stats')}</div>}

            {!loading && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                        {data.stats.map((stat, index) => (
                            <div className="card" key={index} style={{
                                padding: '30px',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-20px',
                                    fontSize: '8rem',
                                    opacity: '0.05',
                                    pointerEvents: 'none'
                                }}>
                                    {stat.label.includes('Job') ? '💼' : stat.label.includes('Compan') ? '🏢' : '👤'}
                                </div>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: index % 2 === 0 ? 'rgba(51, 224, 172, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    marginBottom: '20px'
                                }}>
                                    {stat.label.includes('Job') ? '💼' : stat.label.includes('Compan') ? '🏢' : '👤'}
                                </div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                    {stat.label.includes('Job') ? t('dashboard.total_jobs') : stat.label.includes('Compan') ? t('dashboard.total_companies') : t('dashboard.total_applications')}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '25px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>{t('dashboard.recent_activity')}</h3>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{t('dashboard.last_entries', { count: 5 })}</span>
                        </div>
                        {data.recent_activity.length === 0 ? (
                            <div style={{ padding: '60px', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📭</div>
                                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{t('dashboard.no_activity')}</p>
                            </div>
                        ) : (
                            <table style={{ margin: 0 }}>
                                <thead>
                                    <tr>
                                        <th>{t('dashboard.job_title')}</th>
                                        {data.role === 'employer' ? <th>{t('dashboard.applicant')}</th> : <th>{t('dashboard.company')}</th>}
                                        <th>{t('dashboard.date')}</th>
                                        <th>{t('dashboard.status')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recent_activity.map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                <div style={{ fontWeight: '600' }}>{item.job.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: #{item.id}</div>
                                            </td>
                                            {data.role === 'employer' ? (
                                                <td>
                                                    <div style={{ fontWeight: '600' }}>{item.user.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.user.email}</div>
                                                </td>
                                            ) : (
                                                <td>
                                                    <div style={{ fontWeight: '600' }}>{item.job.company.name}</div>
                                                </td>
                                            )}
                                            <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <span className={`status-${item.status}`} style={{
                                                    display: 'inline-block',
                                                    padding: '6px 12px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    {t(`applications.status_${item.status}`)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {data.role === 'employer' ? (
                            <>
                            </>
                        ) : (
                            <>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
