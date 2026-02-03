import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../services/axios-client";
import { useTranslation } from "react-i18next";

export default function CompanyForm() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [company, setCompany] = useState({
        id: null,
        name: '',
        description: '',
        website: '',
        logo: ''
    });

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/companies/${id}`)
                .then(({ data }) => {
                    setLoading(false)
                    setCompany(data)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (company.id) {
            axiosClient.put(`/companies/${company.id}`, company)
                .then(() => {
                    navigate('/my-companies')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient.post('/companies', company)
                .then(() => {
                    navigate('/my-companies')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    }

    return (
        <div className="animated fadeInDown">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0 }}>
                    {company.id ? t('company_form.update_title', { name: company.name }) : t('company_form.create_title')}
                </h1>
                <button onClick={() => navigate('/my-companies')} className="btn-logout" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
                    {t('company_form.cancel')}
                </button>
            </div>

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {loading && (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <div className="animate-pulse-glow" style={{ width: '40px', height: '40px', background: 'var(--primary-color)', borderRadius: '50%', margin: '0 auto' }}></div>
                        <p style={{ marginTop: '15px' }}>{t('company_form.loading')}</p>
                    </div>
                )}

                {errors && (
                    <div className="alert" style={{ marginBottom: '30px' }}>
                        {Object.keys(errors).map(key => (
                            <p key={key} style={{ margin: '2px 0' }}>• {errors[key][0]}</p>
                        ))}
                    </div>
                )}

                {!loading && (
                    <form onSubmit={onSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
                            <div>
                                <label>{t('company_form.name_label')}</label>
                                <input
                                    value={company.name}
                                    onChange={ev => setCompany({ ...company, name: ev.target.value })}
                                    placeholder={t('company_form.name_placeholder')}
                                    required
                                />
                            </div>
                            <div>
                                <label>{t('company_form.website_label')}</label>
                                <input
                                    value={company.website}
                                    onChange={ev => setCompany({ ...company, website: ev.target.value })}
                                    placeholder={t('company_form.website_placeholder')}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label>{t('company_form.logo_label')}</label>
                            <input
                                value={company.logo}
                                onChange={ev => setCompany({ ...company, logo: ev.target.value })}
                                placeholder={t('company_form.logo_placeholder')}
                            />
                        </div>

                        <div className="mb-4">
                            <label>{t('company_form.description_label')}</label>
                            <textarea
                                value={company.description}
                                onChange={ev => setCompany({ ...company, description: ev.target.value })}
                                placeholder={t('company_form.description_placeholder')}
                                rows="6"
                            />
                        </div>

                        <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '30px', paddingTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn" style={{ minWidth: '200px' }}>
                                {company.id ? t('company_form.save_btn') : t('company_form.register_btn')}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
