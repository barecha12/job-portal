export default function JobFilter({ filters, handleFilterChange, resetFilters, onSearch }) {
    return (
        <div className="card" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr auto auto', gap: '15px', alignItems: 'end' }}>
            <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Search Jobs</label>
                <input
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Job title, keywords..."
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
            </div>
            <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Location</label>
                <input
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="City or Remote"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
            </div>
            <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Job Type</label>
                <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                </select>
            </div>
            <button className="btn" onClick={onSearch} style={{ padding: '10px 20px', height: '42px', borderRadius: '8px' }}>
                Search
            </button>
            <button className="btn-logout" onClick={resetFilters} style={{ padding: '10px 15px', height: '42px', borderRadius: '8px', background: '#f1f5f9', border: 'none' }}>
                Clear
            </button>
        </div>
    )
}
