import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../../services/axios-client";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function CompanyDetails() {
    const { t } = useTranslation();
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user, role } = useAuth();

    useEffect(() => {
        setLoading(true);
        axiosClient.get(`/companies/${id}`)
            .then(({ data }) => {
                setCompany(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            })
    }, [id]);

    if (loading) {
        return (
            <div className="text-center" style={{ padding: '100px' }}>
                <div className="animate-pulse-glow" style={{ width: '50px', height: '50px', background: 'var(--primary-color)', borderRadius: '50%', margin: '0 auto 20px' }}></div>
                <p style={{ color: 'var(--text-secondary)' }}>{t('company_details.loading')}</p>
            </div>
        );
    }

    if (!company) return (
        <div className="card text-center" style={{ padding: '100px' }}>
            <h2 style={{ color: 'var(--error-color)' }}>{t('company_details.not_found')}</h2>
            <p style={{ marginBottom: '20px' }}>{t('company_details.not_found_desc')}</p>
            <Link to={role === 'employer' ? "/my-companies" : "/jobs"} className="btn">
                {role === 'employer' ? t('company_details.back_to_companies') : t('company_details.explore_jobs')}
            </Link>
        </div>
    );

    return (
        <div className="animated fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0 }}>{t('company_details.profile_title')}</h1>
                <Link to={role === 'employer' ? "/my-companies" : "/jobs"} className="btn-logout" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
                    {role === 'employer' ? t('company_details.back_to_companies') : t('company_details.back_to_jobs')}
                </Link>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden', borderBottom: '8px solid var(--primary-color)' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    padding: '60px 40px',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-20%',
                        right: '-10%',
                        fontSize: '20rem',
                        opacity: '0.05',
                        pointerEvents: 'none'
                    }}>
                        🏢
                    </div>

                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center', position: 'relative', zIndex: '1', flexWrap: 'wrap' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            background: 'white',
                            borderRadius: '24px',
                            padding: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                        }}>
                            <img
                                src={company.logo || 'https://via.placeholder.com/100'}
                                alt={company.name}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                        </div>
                        <div>
                            <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '10px', fontWeight: '800', letterSpacing: '-0.02em' }}>
                                {company.name}
                            </h1>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                {company.website && (
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: 'var(--primary-color)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        🌐 {company.website.replace(/^https?:\/\//, '')}
                                    </a>
                                )}
                                <span style={{ opacity: '0.6', fontSize: '1.1rem' }}>
                                    {t('company_details.id_label')}: #{company.id}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' }}>
                        <div>
                            <h2 className="section-title">
                                <span>📖</span> {t('company_details.about_title')}
                            </h2>
                            <div style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', fontSize: '1.1rem', lineHeight: '1.9' }}>
                                {company.description || t('company_details.no_description')}
                            </div>
                        </div>

                        {role === 'employer' && company.user_id === user.id && (
                            <div>
                                <h2 className="section-title">
                                    <span>🔍</span> {t('company_details.actions_title')}
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <Link to={`/companies/${company.id}/edit`} className="btn-edit" style={{ padding: '15px', textAlign: 'center', borderRadius: '12px' }}>
                                        {t('company_details.edit_btn')}
                                    </Link>
                                    <Link to="/jobs/new" className="btn" style={{ padding: '15px', textAlign: 'center', borderRadius: '12px' }}>
                                        {t('company_details.post_job_btn')}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h2 style={{ marginBottom: '25px', fontSize: '1.75rem', fontWeight: '700' }}>{t('company_details.jobs_at_title', { name: company.name })}</h2>
                {company.jobs && company.jobs.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
                        {company.jobs.map(job => (
                            <div key={job.id} className="card hover-scale" style={{ padding: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.25rem' }}>{job.title}</h3>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            📍 {job.location} | 💰 {job.salary || t('company_details.competitive')}
                                        </div>
                                    </div>
                                    <span className="status-accepted" style={{ fontSize: '0.7rem' }}>
                                        {t(`jobs.${job.type.toLowerCase().replace('-', '_')}`) || job.type}
                                    </span>
                                </div>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.95rem',
                                    marginBottom: '20px',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '2',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {job.description}
                                </p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Link to={`/jobs/${job.id}`} className="btn-edit" style={{ flex: 1, textAlign: 'center' }}>{t('company_details.view_details')}</Link>
                                    {role === 'employer' && company.user_id === user.id && (
                                        <Link to={`/jobs/${job.id}/edit`} className="btn-logout" style={{ background: 'white', border: '1px solid #e2e8f0' }}>{t('company_details.edit_job')}</Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card text-center" style={{ padding: '60px' }}>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{t('company_details.no_jobs')}</p>
                        <Link to="/jobs/new" style={{ marginTop: '15px', display: 'inline-block' }}>{t('company_details.post_first_job')}</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
