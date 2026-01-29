import { useNavigate } from "react-router-dom";

export default function JobCard({ job }) {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/jobs/${job.id}`)} className="card" style={{
            padding: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            cursor: 'pointer',
            marginBottom: 0,
            borderLeft: '5px solid var(--primary-color)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, minWidth: '250px' }}>
                <img src={job.company?.logo || 'https://via.placeholder.com/50'} alt={job.company?.name} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{job.title}</h3>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{job.company?.name}</span> • {job.type}
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <span style={{ marginRight: '5px' }}>📍</span> {job.location}
                </div>
                <button className="btn" style={{ padding: '10px 30px', fontSize: '0.9rem', borderRadius: '50px', boxShadow: 'none' }}>Apply</button>
            </div>
        </div>
    )
}
