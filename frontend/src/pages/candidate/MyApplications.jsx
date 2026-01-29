import { useEffect, useState } from "react";
import axiosClient from "../../services/axios-client";
import { Link } from "react-router-dom";

export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getApplications();
    }, [])

    const getApplications = () => {
        setLoading(true)
        axiosClient.get('/applications')
            .then(({ data }) => {
                setLoading(false)
                setApplications(data)
            })
            .catch(() => {
                setLoading(false)
            })
    }

    const onDelete = (app) => {
        if (!window.confirm("Are you sure you want to withdraw this application?")) {
            return
        }
        axiosClient.delete(`/applications/${app.id}`)
            .then(() => {
                getApplications()
            })
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'hired': return { background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' };
            case 'shortlisted': return { background: '#f0fdf4', color: '#166534', border: '1px solid #bcf0da' };
            case 'interview_scheduled': return { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' };
            case 'interviewed': return { background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe' };
            case 'rejected':
            case 'failed': return { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' };
            default: return { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
        }
    }

    const getStatusText = (status) => {
        return status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    }

    return (
        <div className="animated fadeInDown">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0 }}>My Job Applications</h1>
                <div style={{ background: 'white', padding: '8px 16px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Active Applications: <strong>{applications.length}</strong>
                </div>
            </div>

            {loading ? (
                <div className="text-center" style={{ padding: '60px' }}>
                    <div className="animate-pulse-glow" style={{ width: '40px', height: '40px', background: 'var(--primary-color)', borderRadius: '50%', margin: '0 auto' }}></div>
                    <p style={{ marginTop: '15px' }}>Loading your journey...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {applications.map(app => (
                        <div key={app.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {/* Company Logo/Initials */}
                                <div style={{ width: '100px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #f1f5f9' }}>
                                    <div style={{ width: '50px', height: '50px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                        {app.job.company.name.charAt(0)}
                                    </div>
                                </div>

                                {/* Application Info */}
                                <div style={{ flex: '1', padding: '25px', minWidth: '300px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.25rem' }}>{app.job.title}</h3>
                                            <p style={{ margin: '0', color: 'var(--text-secondary)', fontWeight: '600' }}>{app.job.company.name}</p>
                                        </div>
                                        <span style={{
                                            padding: '6px 14px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: '800',
                                            textTransform: 'uppercase',
                                            ...getStatusStyle(app.status)
                                        }}>
                                            {getStatusText(app.status)}
                                        </span>
                                    </div>

                                    <div style={{ marginTop: '20px', display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <span>📍 {app.job.location}</span>
                                        <span>📅 Applied on {new Date(app.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Link to={`/jobs/${app.job.id}`} className="btn-edit" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '8px' }}>
                                        View Job
                                    </Link>
                                    {(app.status === 'applied' || app.status === 'pending') && (
                                        <button onClick={() => onDelete(app)} className="btn-delete" style={{ padding: '10px 20px', borderRadius: '8px' }}>
                                            Withdraw
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {applications.length === 0 && (
                        <div className="card text-center" style={{ padding: '80px' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚀</div>
                            <h2 style={{ color: 'var(--text-secondary)' }}>No applications yet</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Start your journey by searching and applying to jobs!</p>
                            <Link to="/jobs" className="btn" style={{ display: 'inline-block', marginTop: '20px' }}>Browse Jobs</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
