import { useEffect, useState } from "react";
import axiosClient from "../../services/axios-client";
import { useTranslation } from "react-i18next";

export default function JobManagement() {
    const { t } = useTranslation();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchJobs = () => {
        setLoading(true);
        axiosClient.get('/admin/jobs')
            .then(({ data }) => {
                setJobs(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const deleteJob = (id) => {
        if (!window.confirm(t('admin.warn_delete_job'))) return;

        axiosClient.delete(`/admin/jobs/${id}`)
            .then(() => {
                setJobs(jobs.filter(j => j.id !== id));
            })
            .catch(err => {
                alert(t('admin.operation_failed'));
            });
    };

    const updateStatus = (id, status) => {
        axiosClient.patch(`/admin/jobs/${id}/status`, { status })
            .then(() => {
                setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
            })
            .catch(() => alert("Failed to update status."));
    };

    const filteredJobs = jobs.filter(j =>
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animated fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>{t('admin.marketplace_index')}</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder={t('admin.search_listings')}
                        style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', width: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-add" onClick={fetchJobs}>{t('admin.sync_data')}</button>
                </div>
            </div>

            <div className="card" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                {loading ? (
                    <div style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>{t('admin.fetching_listings')}</div>
                ) : (
                    <table style={{ margin: 0 }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.position_company')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.review_state')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('jobs.type')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.deployment')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.control_flow')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.map(job => (
                                <tr key={job.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '20px 25px' }}>
                                        <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '1rem' }}>{job.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: '600' }}>{job.company?.name || 'Independent'}</div>
                                    </td>
                                    <td style={{ padding: '20px 25px' }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '800',
                                            background: job.status === 'active' ? '#dcfce7' : job.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                            color: job.status === 'active' ? '#166534' : job.status === 'pending' ? '#92400e' : '#991b1b',
                                            textTransform: 'uppercase'
                                        }}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 25px' }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '800',
                                            background: '#f1f5f9', color: '#475569', textTransform: 'uppercase'
                                        }}>
                                            {job.type}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 25px', color: '#94a3b8', fontSize: '0.85rem' }}>
                                        {new Date(job.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '20px 25px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            {job.status === 'pending' && (
                                                <>
                                                    <button onClick={() => updateStatus(job.id, 'active')} style={{ padding: '6px 14px', borderRadius: '8px', background: '#10b981', color: 'white', border: 'none', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}>{t('admin.verify')}</button>
                                                    <button onClick={() => updateStatus(job.id, 'rejected')} style={{ padding: '6px 14px', borderRadius: '8px', background: '#f59e0b', color: 'white', border: 'none', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}>{t('admin.deny')}</button>
                                                </>
                                            )}
                                            <button
                                                className="btn-delete"
                                                onClick={() => deleteJob(job.id)}
                                                style={{ padding: '6px 15px', borderRadius: '10px' }}
                                            >
                                                {t('admin.purge')}
                                            </button>
                                        </div>
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
