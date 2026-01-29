import { useEffect, useState } from "react";
import axiosClient from "../../services/axios-client";
import { Link } from "react-router-dom";
import JobFilter from "../../components/jobs/JobFilter";
import Loader from "../../components/common/Loader";

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        location: '',
        type: ''
    });

    useEffect(() => {
        getJobs();
    }, [])

    const getJobs = (url, currentFilters = filters) => {
        setLoading(true);

        let targetUrl = url || '/jobs';
        const params = new URLSearchParams();

        if (currentFilters.search) params.append('search', currentFilters.search);
        if (currentFilters.location) params.append('location', currentFilters.location);
        if (currentFilters.type) params.append('type', currentFilters.type);

        const queryString = params.toString();
        if (queryString) {
            targetUrl += (targetUrl.includes('?') ? '&' : '?') + queryString;
        }

        axiosClient.get(targetUrl)
            .then(({ data }) => {
                setLoading(false)
                setJobs(data.data)
                setMeta(data.meta || {
                    current_page: data.current_page,
                    from: data.from,
                    last_page: data.last_page,
                    links: data.links,
                    path: data.path,
                    per_page: data.per_page,
                    to: data.to,
                    total: data.total
                })
            })
            .catch(() => {
                setLoading(false)
            })
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        getJobs(null, newFilters);
    }

    const resetFilters = () => {
        const clearedFilters = { search: '', location: '', type: '' };
        setFilters(clearedFilters);
        getJobs(null, clearedFilters);
    }

    return (
        <div className="animated fadeInDown">
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ margin: '0 0 20px 0' }}>Explore Opportunities</h1>

                {/* Search & Filter Bar */}
                <JobFilter
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    resetFilters={resetFilters}
                    onSearch={() => getJobs()}
                />
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '15px 20px', color: '#64748b' }}>Position</th>
                                <th style={{ textAlign: 'left', padding: '15px 20px', color: '#64748b' }}>Company</th>
                                <th style={{ textAlign: 'left', padding: '15px 20px', color: '#64748b' }}>Location</th>
                                <th style={{ textAlign: 'left', padding: '15px 20px', color: '#64748b' }}>Type</th>
                                <th style={{ textAlign: 'left', padding: '15px 20px', color: '#64748b' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5">
                                        <Loader text="Finding jobs..." />
                                    </td>
                                </tr>
                            ) : jobs.length > 0 ? (
                                jobs.map(job => (
                                    <tr key={job.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{job.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.category || 'Uncategorized'}</div>
                                        </td>
                                        <td style={{ padding: '20px' }}>{job.company.name}</td>
                                        <td style={{ padding: '20px' }}>📍 {job.location}</td>
                                        <td style={{ padding: '20px' }}>
                                            <span className={`job-type-tag type-${job.type.toLowerCase().replace(' ', '-')}`}>
                                                {job.type}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <Link className="btn" to={'/jobs/' + job.id} style={{ padding: '6px 15px', fontSize: '0.85rem' }}>Details</Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
                                        No jobs matched your search criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && meta.links && meta.total > meta.per_page && (
                    <div className="pagination" style={{ padding: '20px', justifyContent: 'center' }}>
                        {meta.links.map((link, index) => (
                            <button
                                key={index}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                onClick={() => getJobs(link.url)}
                                disabled={!link.url || link.active}
                                className={"pagination-link " + (link.active ? "active" : "")}
                                style={{ margin: '0 3px' }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

