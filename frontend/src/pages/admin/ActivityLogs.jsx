import { useEffect, useState } from "react";
import axiosClient from "../../services/axios-client";
import { useTranslation } from "react-i18next";

export default function ActivityLogs() {
    const { t } = useTranslation();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = () => {
        setLoading(true);
        axiosClient.get('/admin/activities')
            .then(({ data }) => {
                setLogs(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="animated fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>{t('admin.system_audit')}</h2>
                <button className="btn btn-add" onClick={fetchLogs}>{t('admin.force_sync')}</button>
            </div>

            <div className="card" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                {loading ? (
                    <div style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>{t('admin.retrieving_logs')}</div>
                ) : (
                    <table style={{ margin: 0 }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.administrator')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.action')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.target_entity')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.timestamp')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.ip_node')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px 25px' }}>
                                        <div style={{ fontWeight: '700', color: '#1e293b' }}>{log.user?.name || t('admin.system_auto')}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{log.user?.role}</div>
                                    </td>
                                    <td style={{ padding: '15px 25px' }}>
                                        <div style={{
                                            padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800',
                                            background: log.action.includes('delete') ? '#fee2e2' : '#dcfce7',
                                            color: log.action.includes('delete') ? '#991b1b' : '#166534',
                                            display: 'inline-block'
                                        }}>
                                            {log.action.replace(/_/g, ' ').toUpperCase()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px 25px' }}>
                                        <div style={{ color: '#475569', fontSize: '0.9rem', fontWeight: '600' }}>{log.target_model} #{log.target_id}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{log.details}</div>
                                    </td>
                                    <td style={{ padding: '15px 25px', color: '#64748b', fontSize: '0.85rem' }}>
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '15px 25px', textAlign: 'right', color: '#cbd5e1', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                        {log.ip_address}
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
