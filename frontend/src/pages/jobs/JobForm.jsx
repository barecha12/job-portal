import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../services/axios-client";
import { useTranslation } from "react-i18next";

export default function JobForm() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [errors, setErrors] = useState(null);
    const [job, setJob] = useState({
        id: null,
        company_id: '',
        title: '',
        description: '',
        location: '',
        salary: '',
        type: 'Full-time',
        category: '',
        requirements: '',
        deadline: ''
    });

    useEffect(() => {
        // Fetch companies owned by the user
        axiosClient.get('/companies')
            .then(({ data }) => {
                setCompanies(data.data || data); // Handle both paginated and non-paginated
            });

        if (id) {
            setLoading(true);
            axiosClient.get(`/jobs/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setJob(data);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    const onSubmit = (ev) => {
        ev.preventDefault();
        setErrors(null);

        const payload = { ...job };

        if (job.id) {
            axiosClient.put(`/jobs/${job.id}`, payload)
                .then(() => {
                    navigate('/jobs');
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient.post('/jobs', payload)
                .then(() => {
                    navigate('/jobs');
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    };

    return (
        <div className="animated fadeInDown">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0 }}>
                    {job.id ? t('job_form.update_title', { title: job.title }) : t('job_form.create_title')}
                </h1>
                <button onClick={() => navigate('/jobs')} className="btn-logout" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
                    {t('job_form.cancel')}
                </button>
            </div>

            <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                {loading && (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <div className="animate-pulse-glow" style={{ width: '40px', height: '40px', background: 'var(--primary-color)', borderRadius: '50%', margin: '0 auto' }}></div>
                        <p style={{ marginTop: '15px' }}>{t('job_form.loading')}</p>
                    </div>
                )}

                {!loading && (
                    <form onSubmit={onSubmit}>
                        {errors && (
                            <div className="alert alert-danger" style={{ marginBottom: '30px' }}>
                                {Object.keys(errors).map(key => (
                                    <p key={key} style={{ margin: '2px 0' }}>• {errors[key][0]}</p>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
                            <div>
                                <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>{t('job_form.title_label')}</label>
                                <input
                                    value={job.title}
                                    onChange={ev => setJob({ ...job, title: ev.target.value })}
                                    placeholder={t('job_form.title_placeholder')}
                                    required
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>{t('job_form.company_label')}</label>
                                <select
                                    value={job.company_id}
                                    onChange={ev => setJob({ ...job, company_id: ev.target.value })}
                                    required
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                >
                                    <option value="">{t('job_form.company_select')}</option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                            <div>
                                <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>{t('job_form.location_label')}</label>
                                <input
                                    value={job.location}
                                    onChange={ev => setJob({ ...job, location: ev.target.value })}
                                    placeholder={t('job_form.location_placeholder')}
                                    required
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>{t('job_form.type_label')}</label>
                                <select
                                    value={job.type}
                                    onChange={ev => setJob({ ...job, type: ev.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                >
                                    <option value="Full-time">{t('jobs.full_time')}</option>
                                    <option value="Part-time">{t('jobs.part_time')}</option>
                                    <option value="Contract">{t('jobs.contract')}</option>
                                    <option value="Internship">{t('jobs.internship')}</option>
                                    <option value="Remote">{t('jobs.remote')}</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>{t('job_form.category_label')}</label>
                                <input
                                    value={job.category}
                                    onChange={ev => setJob({ ...job, category: ev.target.value })}
                                    placeholder={t('job_form.category_placeholder')}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>{t('job_form.salary_label')}</label>
                            <input
                                type="number"
                                value={job.salary}
                                onChange={ev => setJob({ ...job, salary: ev.target.value })}
                                placeholder={t('job_form.salary_placeholder')}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                        </div>

                        <div className="mb-4">
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>{t('job_form.deadline_label')}</label>
                            <input
                                type="date"
                                value={job.deadline}
                                onChange={ev => setJob({ ...job, deadline: ev.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                        </div>

                        <div className="mb-4">
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>{t('job_form.description_label')}</label>
                            <textarea
                                value={job.description}
                                onChange={ev => setJob({ ...job, description: ev.target.value })}
                                placeholder={t('job_form.description_placeholder')}
                                rows="6"
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }}
                            />
                        </div>

                        <div className="mb-4">
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>{t('job_form.requirements_label')}</label>
                            <textarea
                                value={job.requirements}
                                onChange={ev => setJob({ ...job, requirements: ev.target.value })}
                                placeholder={t('job_form.requirements_placeholder')}
                                rows="6"
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }}
                            />
                        </div>

                        <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '30px', paddingTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn" style={{ minWidth: '200px', padding: '15px' }}>
                                {job.id ? t('job_form.update_btn') : t('job_form.post_btn')}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
