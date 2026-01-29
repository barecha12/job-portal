
import { useEffect, useState } from "react";
import axiosClient from "../../services/axios-client";
import { useAuth } from "../../contexts/AuthContext";

export default function Profile() {
    const { user, setUser, setToken, setRole, role } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState(null);

    const [profileData, setProfileData] = useState({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        title: user.title || '',
        bio: user.bio || '',
        portfolio_url: user.portfolio_url || '',
        github_url: user.github_url || '',
        linkedin_url: user.linkedin_url || '',
        skills: user.skills || '',
        department: user.department || '',
        education: user.education || '',
        experience: user.experience || '',
        resume: null
    });

    useEffect(() => {
        setProfileData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            title: user.title || '',
            bio: user.bio || '',
            portfolio_url: user.portfolio_url || '',
            github_url: user.github_url || '',
            linkedin_url: user.linkedin_url || '',
            skills: user.skills || '',
            department: user.department || '',
            education: user.education || '',
            experience: user.experience || '',
            resume: null
        });
    }, [user]);

    const onSubmit = (ev) => {
        if (ev) ev.preventDefault();
        setLoading(true);
        setErrors(null);
        setMessage(null);

        const formData = new FormData();
        Object.keys(profileData).forEach(key => {
            if (key === 'resume') {
                if (profileData[key]) formData.append(key, profileData[key]);
            } else {
                formData.append(key, profileData[key] || '');
            }
        });

        axiosClient.post('/user', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(({ data }) => {
                setLoading(false);
                setUser(data.user);
                setMessage('Profile updated successfully!');
                window.scrollTo(0, 0);
            })
            .catch(err => {
                setLoading(false);
                if (err.response && err.response.status === 422) {
                    setErrors(err.response.data.errors);
                }
            });
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '16px',
        padding: '35px',
        marginBottom: '25px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        border: '1px solid #e2e8f0'
    };

    const sectionHeaderStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '25px',
        paddingBottom: '15px',
        borderBottom: '2px solid #f1f5f9'
    };

    const iconBadgeStyle = {
        width: '45px',
        height: '45px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.3rem'
    };

    const titleStyle = {
        margin: 0,
        fontSize: '1.4rem',
        fontWeight: '700',
        color: 'var(--text-primary)'
    };

    const labelStyle = {
        fontWeight: '600',
        fontSize: '0.85rem',
        color: '#64748b',
        marginBottom: '8px',
        display: 'block'
    };

    const inputStyle = {
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        padding: '11px 14px',
        fontSize: '0.95rem',
        marginBottom: 0,
        transition: 'border-color 0.2s'
    };

    const renderEmployerProfile = () => (
        <form onSubmit={onSubmit}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Account Settings */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={iconBadgeStyle}>📝</div>
                        <h2 style={titleStyle}>Account Settings</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input type="text" value={profileData.name} onChange={ev => setProfileData({ ...profileData, name: ev.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Position</label>
                            <input type="text" value={profileData.title} onChange={ev => setProfileData({ ...profileData, title: ev.target.value })} placeholder="e.g. HR Manager" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Email Address</label>
                            <input type="email" value={profileData.email} onChange={ev => setProfileData({ ...profileData, email: ev.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Work Phone</label>
                            <input type="text" value={profileData.phone} onChange={ev => setProfileData({ ...profileData, phone: ev.target.value })} style={inputStyle} />
                        </div>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Department</label>
                        <input type="text" value={profileData.department} onChange={ev => setProfileData({ ...profileData, department: ev.target.value })} style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Professional Bio</label>
                        <textarea value={profileData.bio} onChange={ev => setProfileData({ ...profileData, bio: ev.target.value })} rows="5" style={{ ...inputStyle, padding: '14px' }} />
                    </div>
                </div>

                {/* Connections */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={iconBadgeStyle}>🔗</div>
                        <h2 style={titleStyle}>Professional Connections</h2>
                    </div>
                    <div>
                        <label style={labelStyle}>LinkedIn Profile</label>
                        <input type="text" value={profileData.linkedin_url} onChange={ev => setProfileData({ ...profileData, linkedin_url: ev.target.value })} placeholder="https://linkedin.com/in/..." style={inputStyle} />
                    </div>
                </div>

                {/* System Info */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={iconBadgeStyle}>ℹ️</div>
                        <h2 style={titleStyle}>System Information</h2>
                    </div>
                    <div style={{ padding: '18px', background: '#f8fafc', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontSize: '2rem' }}>📅</div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Member Since</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button className="btn btn-add" disabled={loading} style={{ width: '100%', padding: '16px', fontSize: '1.05rem', fontWeight: 700, borderRadius: '12px' }}>
                    {loading ? '💾 Saving...' : '✨ Update Settings'}
                </button>

                {message && (
                    <div style={{ marginTop: '20px', padding: '16px', background: '#d1fae5', borderRadius: '12px', textAlign: 'center', color: '#065f46', fontWeight: '600', border: '1px solid #6ee7b7' }}>
                        ✅ {message}
                    </div>
                )}
            </div>
        </form>
    );

    const renderSeekerProfile = () => (
        <form onSubmit={onSubmit}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Basic Info */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={iconBadgeStyle}>👤</div>
                        <h2 style={titleStyle}>Basic Information</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input type="text" value={profileData.name} onChange={ev => setProfileData({ ...profileData, name: ev.target.value })} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Professional Title</label>
                            <input type="text" value={profileData.title} onChange={ev => setProfileData({ ...profileData, title: ev.target.value })} placeholder="e.g. Senior Developer" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Email Address</label>
                            <input type="email" value={profileData.email} disabled style={{ ...inputStyle, background: '#f1f5f9', cursor: 'not-allowed' }} />
                        </div>
                        <div>
                            <label style={labelStyle}>Phone Number</label>
                            <input type="text" value={profileData.phone} onChange={ev => setProfileData({ ...profileData, phone: ev.target.value })} style={inputStyle} />
                        </div>
                    </div>
                </div>

                {/* Professional Summary */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={iconBadgeStyle}>🎯</div>
                        <h2 style={titleStyle}>Professional Summary</h2>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>About Me</label>
                        <textarea value={profileData.bio} onChange={ev => setProfileData({ ...profileData, bio: ev.target.value })} rows="5" placeholder="Tell us about your career journey..." style={{ ...inputStyle, padding: '14px' }} />
                    </div>
                    <div>
                        <label style={labelStyle}>Core Skills</label>
                        <input type="text" value={profileData.skills} onChange={ev => setProfileData({ ...profileData, skills: ev.target.value })} placeholder="React, Node.js, Python, AWS..." style={inputStyle} />
                    </div>
                </div>

                {/* Experience & Education */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '25px' }}>
                    <div style={cardStyle}>
                        <div style={sectionHeaderStyle}>
                            <div style={iconBadgeStyle}>💼</div>
                            <h2 style={titleStyle}>Experience</h2>
                        </div>
                        <textarea value={profileData.experience} onChange={ev => setProfileData({ ...profileData, experience: ev.target.value })} rows="8" placeholder="Describe your professional journey..." style={{ ...inputStyle, padding: '14px' }} />
                    </div>
                    <div style={cardStyle}>
                        <div style={sectionHeaderStyle}>
                            <div style={iconBadgeStyle}>🎓</div>
                            <h2 style={titleStyle}>Education</h2>
                        </div>
                        <textarea value={profileData.education} onChange={ev => setProfileData({ ...profileData, education: ev.target.value })} rows="8" placeholder="Your academic background..." style={{ ...inputStyle, padding: '14px' }} />
                    </div>
                </div>

                {/* Professional Links */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={iconBadgeStyle}>🔗</div>
                        <h2 style={titleStyle}>Professional Links</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>LinkedIn Profile</label>
                            <input type="text" value={profileData.linkedin_url} onChange={ev => setProfileData({ ...profileData, linkedin_url: ev.target.value })} placeholder="https://linkedin.com/in/..." style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>GitHub Profile</label>
                            <input type="text" value={profileData.github_url} onChange={ev => setProfileData({ ...profileData, github_url: ev.target.value })} placeholder="https://github.com/..." style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Portfolio Website</label>
                            <input type="text" value={profileData.portfolio_url} onChange={ev => setProfileData({ ...profileData, portfolio_url: ev.target.value })} placeholder="https://yourportfolio.com" style={inputStyle} />
                        </div>
                    </div>
                </div>

                {/* Resume Upload */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={iconBadgeStyle}>📄</div>
                        <h2 style={titleStyle}>Resume / CV</h2>
                    </div>
                    <div>
                        <label style={labelStyle}>Upload Your Resume (PDF, DOC, DOCX)</label>
                        <input type="file" onChange={ev => setProfileData({ ...profileData, resume: ev.target.files[0] })} accept=".pdf,.doc,.docx" style={{ ...inputStyle, padding: '14px', cursor: 'pointer' }} />
                        {user.resume_path && (
                            <div style={{ marginTop: '12px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>✓</span>
                                <div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Current file:</div>
                                    <strong>{user.resume_path.split('/').pop()}</strong>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Save Button */}
                <button className="btn btn-add" disabled={loading} style={{ width: '100%', padding: '16px', fontSize: '1.05rem', fontWeight: 700, borderRadius: '12px' }}>
                    {loading ? '💾 Saving...' : '✨ Save All Changes'}
                </button>

                {message && (
                    <div style={{ marginTop: '20px', padding: '16px', background: '#d1fae5', borderRadius: '12px', textAlign: 'center', color: '#065f46', fontWeight: '600', border: '1px solid #6ee7b7' }}>
                        ✅ {message}
                    </div>
                )}
            </div>
        </form>
    );

    return (
        <div className="animated fadeIn">
            <header style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                padding: '40px 35px',
                borderRadius: '16px',
                color: 'white',
                marginBottom: '35px',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', right: '-50px', top: '-50px', fontSize: '10rem', opacity: 0.04 }}>👤</div>

                <div style={{
                    width: '85px',
                    height: '85px',
                    borderRadius: '16px',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: '#1e293b',
                    marginRight: '25px',
                    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)'
                }}>
                    {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>{user.name}</h1>
                    <p style={{ margin: '6px 0 0 0', opacity: 0.85, fontSize: '1rem' }}>
                        {profileData.title || (role === 'employer' ? 'Company Administrator' : 'Professional Candidate')} • {user.email}
                    </p>
                    <div style={{ marginTop: '12px' }}>
                        <span style={{
                            background: 'rgba(255,255,255,0.15)',
                            padding: '4px 10px',
                            borderRadius: '16px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            border: '1px solid rgba(255,255,255,0.25)'
                        }}>
                            {role.toUpperCase()} ACCOUNT
                        </span>
                    </div>
                </div>
            </header>

            {errors && (
                <div className="alert" style={{ marginBottom: '25px', borderRadius: '12px' }}>
                    {Object.keys(errors).map(key => <p key={key} style={{ margin: 0 }}>• {errors[key][0]}</p>)}
                </div>
            )}

            {role === 'employer' ? renderEmployerProfile() : renderSeekerProfile()}
        </div>
    );
}
