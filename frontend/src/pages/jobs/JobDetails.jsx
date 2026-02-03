import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../../services/axios-client";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function JobDetails() {
    const { t } = useTranslation();
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(false);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState(null);
    const { user, role } = useAuth();

    useEffect(() => {
        setLoading(true);
        axiosClient.get(`/jobs/${id}`)
            .then(({ data }) => {
                setJob(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            })
    }, [id]);

    const hasApplied = () => {
        if (!job || !user || !job.applications) return false;
        return job.applications.some(app => app.user_id === user.id);
    }

    const onApply = () => {
        if (hasApplied()) return;
        setApplying(true);
        setMessage(null);
        axiosClient.post('/applications', { job_id: job.id })
            .then(({ data }) => {
                setApplying(false);
                setMessage({ type: 'success', text: t('jobs.apply_success') });
                // Update local job state to include the new application
                setJob({
                    ...job,
                    applications: [...(job.applications || []), data]
                });
            })
            .catch(err => {
                setApplying(false);
                const errorMsg = err.response?.data?.message || t('jobs.apply_failed');
                setMessage({ type: 'danger', text: errorMsg });
                console.error(err);
            })
    }

    if (loading) {
        return (
            <div className="text-center" style={{ padding: '100px' }}>
                <div className="animate-pulse-glow" style={{ width: '50px', height: '50px', background: 'var(--primary-color)', borderRadius: '50%', margin: '0 auto 20px' }}></div>
                <p style={{ color: 'var(--text-secondary)' }}>{t('jobs.loading_details')}</p>
            </div>
        );
    }

    if (!job) return (
        <div className="card text-center" style={{ padding: '100px' }}>
            <h2 style={{ color: 'var(--error-color)' }}>{t('jobs.not_found')}</h2>
            <p style={{ marginBottom: '20px' }}>{t('jobs.not_found_desc')}</p>
            <Link to="/jobs" className="btn">{t('jobs.browse_all')}</Link>
        </div>
    );

    const getTypeClass = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('full')) return 'type-full-time';
        if (t.includes('part')) return 'type-part-time';
        if (t.includes('contract')) return 'type-contract';
        return 'type-remote';
    }

    return (
        <div className="job-details-container animated fadeIn">
            {message && (
                <div className={`alert alert-${message.type}`} style={{ marginBottom: '30px' }}>
                    {message.text}
                </div>
            )}

            {/* Header Section */}
            <header className="job-details-header-section">
                <div className="job-header-info">
                    <h1>{job.title}</h1>
                    <div className="job-header-meta">
                        <div className="meta-item">
                            <span style={{ fontSize: '1.2rem' }}>🏢</span>
                            <strong>{job.company?.name}</strong>
                        </div>
                        <div className="meta-item">
                            <span style={{ fontSize: '1.2rem' }}>📍</span>
                            {job.location}
                        </div>
                        <div className="meta-item">
                            <span className={`job-type-tag ${getTypeClass(job.type)}`}>
                                {t(`jobs.${job.type.toLowerCase().replace('-', '_').replace(' ', '_')}`)}
                            </span>
                        </div>
                        {job.deadline && (
                            <div className="meta-item">
                                <span style={{ fontSize: '1.2rem' }}>⏰</span>
                                <span style={{ color: 'var(--error-color)', fontWeight: '700' }}>
                                    {t('jobs.deadline')}: {new Date(job.deadline).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="job-header-actions">
                    {role === 'seeker' && (
                        <button
                            onClick={onApply}
                            disabled={applying || hasApplied()}
                            className={`btn ${hasApplied() ? '' : 'animate-pulse-glow'}`}
                            style={{
                                minWidth: '180px',
                                background: hasApplied() ? 'var(--success-color)' : '',
                                borderColor: hasApplied() ? 'var(--success-color)' : '',
                                cursor: hasApplied() ? 'default' : 'pointer'
                            }}
                        >
                            {applying ? t('jobs.applying') : (hasApplied() ? `✓ ${t('jobs.applied')}` : t('jobs.apply_now'))}
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="job-main-content">
                {/* Job Overview */}
                <section className="job-description-section">
                    <h2 className="section-title">
                        <span>📄</span> {t('jobs.description')}
                    </h2>
                    <div style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '30px' }}>
                        {job.description}
                    </div>

                    {job.requirements && (
                        <>
                            <h2 className="section-title">
                                <span>🎯</span> {t('jobs.requirements')}
                            </h2>
                            <div style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', fontSize: '1.1rem', lineHeight: '1.8' }}>
                                {job.requirements}
                            </div>
                        </>
                    )}
                </section>

                <section className="job-description-section">
                    <h2 className="section-title">
                        <span>📋</span> {t('jobs.key_details')}
                    </h2>
                    <div className="company-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        <div className="info-badge">
                            <label>{t('jobs.salary_package')}</label>
                            <span>{job.salary || t('jobs.not_disclosed')}</span>
                        </div>
                        <div className="info-badge">
                            <label>{t('jobs.job_category')}</label>
                            <span>{job.category || t('jobs.general')}</span>
                        </div>
                        <div className="info-badge">
                            <label>{t('jobs.posted_date')}</label>
                            <span>{new Date(job.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                </section>

                {/* Company Profile Section */}
                <section className="job-description-section">
                    <h2 className="section-title">
                        <span>🏢</span> {t('jobs.about_company')}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '25px', marginBottom: '20px' }}>
                        <img
                            src={job.company?.logo || 'https://via.placeholder.com/100'}
                            alt={job.company?.name}
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '16px',
                                objectFit: 'cover',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                background: '#f8fafc',
                                padding: '8px'
                            }}
                        />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                {job.company?.name}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                                {job.company?.description}
                            </p>
                        </div>
                    </div>
                    <Link
                        to={`/companies/${job.company?.id}`}
                        className="btn"
                        style={{
                            background: 'white',
                            color: 'var(--primary-color)',
                            border: '2px solid var(--primary-color)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {t('jobs.view_company')} →
                    </Link>
                </section>
            </div>
        </div>
    )
}
