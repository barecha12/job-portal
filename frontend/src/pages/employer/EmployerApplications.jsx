import { useEffect, useState } from "react";
import axiosClient from "../../services/axios-client";

export default function EmployerApplications() {
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

    const updateStatus = (app, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this application?`)) {
            return
        }
        axiosClient.put(`/applications/${app.id}`, { status })
            .then(() => {
                getApplications()
            })
            .catch(err => {
                console.error(err)
                alert("Failed to update status")
            })
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'hired': return { background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' };
            case 'accepted':
            case 'shortlisted': return { background: '#f0fdf4', color: '#166534', border: '1px solid #bcf0da' };
            case 'interview_scheduled': return { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' };
            case 'interviewed': return { background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe' };
            case 'rejected':
            case 'failed': return { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' };
            default: return { background: '#fff7ed', color: '#9a3412', border: '1px solid #fed7aa' };
        }
    }

    return (
        <div className="animated fadeInDown">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0 }}>Manage Applications</h1>
                <div style={{ background: 'white', padding: '8px 16px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Total: <strong>{applications.length}</strong> candidates
                </div>
            </div>

            {loading ? (
                <div className="text-center" style={{ padding: '60px' }}>
                    <div className="animate-pulse-glow" style={{ width: '40px', height: '40px', background: 'var(--primary-color)', borderRadius: '50%', margin: '0 auto' }}></div>
                    <p style={{ marginTop: '15px', color: 'var(--text-secondary)' }}>Gathering applications...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {applications.map(app => (
                        <div key={app.id} className="card" style={{ padding: '0', overflow: 'hidden', transition: 'var(--transition)' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {/* Left Section: Candidate Info */}
                                <div style={{ flex: '1', minWidth: '300px', padding: '30px', borderRight: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            background: 'var(--primary-color)',
                                            borderRadius: '15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem',
                                            color: 'white',
                                            fontWeight: '700'
                                        }}>
                                            {app.user?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.25rem' }}>{app.user?.name}</h3>
                                            <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{app.user?.email}</p>
                                            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <span className={`status-${app.status}`} style={{ ...getStatusStyle(app.status), padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                                                    {app.status}
                                                </span>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                    📅 Applied {new Date(app.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Middle Section: Job Info */}
                                <div style={{ flex: '1', minWidth: '300px', padding: '30px', background: '#f8fafc' }}>
                                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>Target Job</label>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{app.job?.title}</h4>
                                    <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>📍 {app.job?.location}</p>

                                    <div style={{ marginTop: '20px' }}>
                                        {app.resume ? (
                                            <a href={`${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '')}/storage/${app.resume}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-edit"
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', fontSize: '0.9rem' }}>
                                                <span>📄</span> View Resume
                                            </a>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem italic' }}>No resume attached</span>
                                        )}
                                    </div>
                                </div>

                                {/* Right Section: Actions */}
                                <div style={{ width: '300px', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
                                    {(app.status === 'pending' || app.status === 'applied') && (
                                        <button onClick={() => updateStatus(app, 'shortlisted')} className="btn" style={{ borderRadius: '10px', background: 'var(--secondary-color)' }}>
                                            🎯 Shortlist
                                        </button>
                                    )}
                                    {app.status === 'shortlisted' && (
                                        <button onClick={() => updateStatus(app, 'interview_scheduled')} className="btn" style={{ borderRadius: '10px' }}>
                                            📅 Schedule Interview
                                        </button>
                                    )}
                                    {app.status === 'interview_scheduled' && (
                                        <button onClick={() => updateStatus(app, 'interviewed')} className="btn" style={{ borderRadius: '10px' }}>
                                            🤝 Mark as Interviewed
                                        </button>
                                    )}
                                    {app.status === 'interviewed' && (
                                        <>
                                            <button onClick={() => updateStatus(app, 'hired')} className="btn" style={{ borderRadius: '10px', background: 'var(--success-color)', border: 'none', color: 'white' }}>
                                                ✅ Hire Candidate
                                            </button>
                                            <button onClick={() => updateStatus(app, 'failed')} className="btn-logout" style={{ borderRadius: '10px', background: 'white', border: '1px solid #fee2e2' }}>
                                                ❌ Not Passed
                                            </button>
                                        </>
                                    )}
                                    {(app.status === 'pending' || app.status === 'applied' || app.status === 'shortlisted') && (
                                        <button onClick={() => updateStatus(app, 'rejected')} className="btn-logout" style={{ borderRadius: '10px', background: 'white', border: '1px solid #fee2e2' }}>
                                            🚫 Reject
                                        </button>
                                    )}
                                    {app.status === 'hired' && (
                                        <div style={{ textAlign: 'center', color: 'var(--success-color)', fontWeight: '700' }}>
                                            🎊 Candidate Hired!
                                        </div>
                                    )}
                                    {app.status === 'rejected' && (
                                        <div style={{ textAlign: 'center', color: 'var(--error-color)', fontWeight: '700' }}>
                                            Candidate Rejected
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {applications.length === 0 && (
                        <div className="card text-center" style={{ padding: '80px' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📁</div>
                            <h2 style={{ color: 'var(--text-secondary)' }}>No applications yet</h2>
                            <p style={{ color: 'var(--text-muted)' }}>When candidates apply to your jobs, they'll appear here.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
