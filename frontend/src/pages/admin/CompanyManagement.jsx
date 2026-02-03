import { useEffect, useState } from "react";
import axiosClient from "../../services/axios-client";
import { useTranslation } from "react-i18next";

export default function CompanyManagement() {
    const { t } = useTranslation();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCompanies = () => {
        setLoading(true);
        axiosClient.get('/admin/companies')
            .then(({ data }) => {
                setCompanies(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const deleteCompany = (id) => {
        if (!window.confirm(t('admin.warn_delete_company'))) return;

        axiosClient.delete(`/admin/companies/${id}`)
            .then(() => {
                setCompanies(companies.filter(c => c.id !== id));
            })
            .catch(err => {
                alert(t('admin.operation_aborted'));
            });
    };

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animated fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>{t('admin.corporate_registry')}</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder={t('admin.search_entities')}
                        style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', width: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-add" onClick={fetchCompanies}>{t('admin.refresh_link')}</button>
                </div>
            </div>

            <div className="card" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                {loading ? (
                    <div style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>{t('admin.accessing_nodes')}</div>
                ) : (
                    <table style={{ margin: 0 }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.entity_info')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.primary_admin')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.activity_jobs')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('jobs.status')} / {t('admin.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCompanies.map(company => (
                                <tr key={company.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '20px 25px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            {company.logo ? (
                                                <img src={company.logo} alt="" style={{ width: '45px', height: '45px', borderRadius: '12px', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '45px', height: '45px', background: '#6366f110', color: '#6366f1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏢</div>
                                            )}
                                            <div>
                                                <div style={{ fontWeight: '800', color: '#1e293b' }}>{company.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: {company.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 25px' }}>
                                        <div style={{ fontWeight: '600', color: '#475569' }}>{company.user?.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{company.user?.email}</div>
                                    </td>
                                    <td style={{ padding: '20px 25px' }}>
                                        <span style={{ fontWeight: '800', color: '#10b981', background: '#10b98115', padding: '4px 12px', borderRadius: '10px', fontSize: '0.9rem' }}>
                                            {t('admin.stats_active_count', { count: company.jobs_count })}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 25px', textAlign: 'right' }}>
                                        <button
                                            className="btn-delete"
                                            onClick={() => deleteCompany(company.id)}
                                            style={{ padding: '6px 15px', borderRadius: '10px' }}
                                        >
                                            {t('admin.dissolve')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
