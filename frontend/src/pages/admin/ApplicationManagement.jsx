import { useEffect, useState } from "react";
import axiosClient from "../../services/axios-client";
import { useTranslation } from "react-i18next";

export default function ApplicationManagement() {
    const { t } = useTranslation();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchApplications = () => {
        setLoading(true);
        axiosClient.get('/admin/applications')
            .then(({ data }) => {
                setApplications(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const deleteApplication = (id) => {
        if (!window.confirm(t('admin.warn_delete_app'))) return;

        axiosClient.delete(`/admin/applications/${id}`)
            .then(() => {
                setApplications(applications.filter(a => a.id !== id));
            })
            .catch(err => {
                alert(t('admin.action_restricted'));
            });
    };

    const filteredApps = applications.filter(a =>
        a.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.job?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.job?.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animated fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>{t('admin.application_moderation')}</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder={t('admin.search_applicants')}
                        style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', width: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-add" onClick={fetchApplications}>{t('admin.refresh_feed')}</button>
                </div>
            </div>

            <div className="card" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                {loading ? (
                    <div style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>{t('admin.scanning_logs')}</div>
                ) : (
                    <table style={{ margin: 0 }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.applicant_identity')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.target_listing')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.current_phase')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.timestamp')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.moderation')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApps.map(app => (
                                <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '20px 25px' }}>
                                        <div style={{ fontWeight: '800', color: '#1e293b' }}>{app.user?.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{app.user?.email}</div>
                                    </td>
                                    <td style={{ padding: '20px 25px' }}>
                                        <div style={{ fontWeight: '700', color: '#475569', fontSize: '0.9rem' }}>{app.job?.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: '600' }}>{app.job?.company?.name}</div>
                                    </td>
                                    <td style={{ padding: '20px 25px' }}>
                                        <span style={{
                                            padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800',
                                            background: app.status === 'pending' ? '#fef3c7' : app.status === 'accepted' ? '#dcfce7' : '#fee2e2',
                                            color: app.status === 'pending' ? '#92400e' : app.status === 'accepted' ? '#166534' : '#991b1b',
                                            textTransform: 'uppercase'
                                        }}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 25px', color: '#94a3b8', fontSize: '0.9rem' }}>
                                        {new Date(app.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '20px 25px', textAlign: 'right' }}>
                                        <button
                                            className="btn-delete"
                                            onClick={() => deleteApplication(app.id)}
                                            style={{ padding: '6px 15px', borderRadius: '10px' }}
                                        >
                                            {t('admin.dismiss')}
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
