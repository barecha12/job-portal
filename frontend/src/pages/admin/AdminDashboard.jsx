import { useEffect, useState } from "react";
import axiosClient from "../../services/axios-client";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, BarChart, Bar
} from 'recharts';

export default function AdminDashboard() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total_users: 0,
        total_jobs: 0,
        total_applications: 0,
        total_companies: 0,
        pending_jobs: 0,
        pending_applications: 0,
        new_users_today: 0,
        recent_users: [],
        recent_jobs: [],
        maintenance_mode: 'off'
    });
    const [analytics, setAnalytics] = useState(null);
    const [performance, setPerformance] = useState({});
    const [isMaintenanceActionLoading, setIsMaintenanceActionLoading] = useState(false);

    const fetchData = async () => {
        try {
            const [statsRes, perfRes, analyticsRes] = await Promise.all([
                axiosClient.get('/admin/stats'),
                axiosClient.get('/admin/performance'),
                axiosClient.get('/admin/analytics')
            ]);
            setStats(statsRes.data);
            setPerformance(perfRes.data);
            setAnalytics(analyticsRes.data);
            setLoading(false);
        } catch (err) {
            console.error("Dashboard error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleMaintenance = async () => {
        const newStatus = stats.maintenance_mode === 'on' ? false : true;
        if (!window.confirm(t('admin.warn_maintenance'))) return;

        setIsMaintenanceActionLoading(true);
        try {
            await axiosClient.post('/admin/maintenance', { status: newStatus });
            setStats(prev => ({ ...prev, maintenance_mode: newStatus ? 'on' : 'off' }));
        } catch (err) {
            alert(t('admin.error_maintenance'));
        } finally {
            setIsMaintenanceActionLoading(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div className="pulse-loader" style={{
                width: '60px', height: '60px', background: '#6366f1', borderRadius: '50%',
                animation: 'pulse-animation 1.5s infinite ease-in-out'
            }}></div>
            <p style={{ marginTop: '20px', fontWeight: '600', color: '#64748b' }}>{t('admin.initializing_center')}</p>
            <style>{`
                @keyframes pulse-animation {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(99, 102, 241, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
                }
            `}</style>
        </div>
    );

    const growthData = analytics?.labels.map((label, index) => ({
        name: label,
        Users: analytics.user_growth[index],
        Jobs: analytics.job_growth[index],
        Companies: analytics.company_growth[index]
    })) || [];

    return (
        <div style={{ paddingBottom: '50px' }}>
            {/* --- TOP HUD BAR --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.04em', margin: 0, color: '#1e293b' }}>
                        {t('admin.system_overview')}
                    </h1>
                    <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: '1.1rem' }}>
                        {t('jobs.status')}: <span style={{ color: '#10b981', fontWeight: '700' }}>● {t('admin.all_systems_operational')}</span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="hud-badge" style={{ background: '#f1f5f9', padding: '10px 18px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.memory_usage')}</span>
                        <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#475569' }}>{performance.memory_usage}</div>
                    </div>
                    <div className="hud-badge" style={{ background: '#f1f5f9', padding: '10px 18px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.php_version')}</span>
                        <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#475569' }}>{performance.php_version}</div>
                    </div>
                </div>
            </div>

            {/* --- PRIMARY KPI GRID --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <KPICard title={t('admin.total_users')} value={stats.total_users} trend="+12.5%" color="#6366f1" icon="👥" sparkData={analytics?.user_growth} />
                <KPICard title={t('admin.active_jobs')} value={stats.total_jobs} trend="+3.2%" color="#10b981" icon="💼" sparkData={analytics?.job_growth} />
                <KPICard title={t('admin.total_companies')} value={stats.total_companies} trend="+8.1%" color="#ec4899" icon="🏢" sparkData={analytics?.company_growth} />
                <KPICard title={t('admin.new_today')} value={stats.new_users_today} trend="Critical" color="#f59e0b" icon="✨" />
            </div>

            {/* --- MAIN ANALYTICS ROW --- */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px', marginBottom: '40px' }}>
                {/* Main Trend Chart */}
                <div className="card" style={{ padding: '35px', borderRadius: '32px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>{t('admin.growth_analytics')}</h2>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b' }}>
                                <span style={{ width: '8px', height: '8px', background: '#6366f1', borderRadius: '50%' }}></span> {t('common.users')}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b' }}>
                                <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span> {t('common.jobs')}
                            </span>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13 }} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '18px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '15px' }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                                />
                                <Area type="monotone" dataKey="Users" stroke="#6366f1" strokeWidth={4} fill="url(#g1)" />
                                <Area type="monotone" dataKey="Jobs" stroke="#10b981" strokeWidth={4} fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Moderation / Attention Queue */}
                <div className="card" style={{ padding: '35px', borderRadius: '32px', border: 'none', background: '#1e293b', color: 'white', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '25px' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {t('admin.attention_required')}
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '5px 0' }}>{t('admin.support_tasks')}</p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <SupportAction
                            label={t('admin.verification_required')}
                            count={stats.pending_jobs}
                            color="#ec4899"
                            icon="🛡️"
                            link="/admin/management/jobs"
                        />
                        <SupportAction
                            label={t('admin.pending_applications')}
                            count={stats.pending_applications}
                            color="#f59e0b"
                            icon="📂"
                            link="/admin/management/applications"
                        />
                        <SupportAction
                            label={t('admin.new_today')}
                            count={stats.new_users_today}
                            color="#38bdf8"
                            icon="👤"
                            link="/admin/users"
                        />
                        <SupportAction
                            label={t('admin.system_security')}
                            count={t('common.stable')}
                            color="#10b981"
                            icon="🛡️"
                        />
                    </div>

                    <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{t('admin.maintenance_mode')}</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: stats.maintenance_mode === 'on' ? '#ef4444' : '#10b981' }}>{stats.maintenance_mode.toUpperCase()}</span>
                        </div>
                        <button
                            disabled={isMaintenanceActionLoading}
                            onClick={toggleMaintenance}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                                background: stats.maintenance_mode === 'on' ? '#10b981' : '#ef4444',
                                color: 'white', fontWeight: '700', cursor: 'pointer', transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            {stats.maintenance_mode === 'on' ? t('admin.disable_maintenance') : t('admin.enable_maintenance')}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- DETAILED FEED ROW --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
                {/* Recent Registrations Feed */}
                <div className="card" style={{ padding: '0', borderRadius: '32px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                    <div style={{ padding: '30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontWeight: '800' }}>{t('admin.platform_activity')}</h3>
                        <Link to="/admin/users" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}>{t('common.view_all')} →</Link>
                    </div>
                    <div style={{ padding: '10px 20px' }}>
                        {stats.recent_users.map(u => (
                            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 10px', borderBottom: '1px solid #f8fafc' }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#6366f110', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                                    {u.name.charAt(0)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{u.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{u.email}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: '800', padding: '4px 10px', borderRadius: '100px', background: '#f1f5f9', color: '#64748b' }}>{u.role.toUpperCase()}</span>
                                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1', marginTop: '4px' }}>{t('admin.just_now')}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Job Distribution Analytics */}
                <div className="card" style={{ padding: '35px', borderRadius: '32px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ margin: '0 0 30px', fontWeight: '800' }}>{t('admin.application_status')}</h3>
                    <div style={{ width: '100%', height: 280 }}>
                        <ResponsiveContainer>
                            <BarChart data={analytics?.app_status_distribution || []}>
                                <XAxis dataKey="status" hide />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                                />
                                <Bar
                                    dataKey="value"
                                    radius={[10, 10, 10, 10]}
                                    barSize={40}
                                    fill="#6366f1"
                                >
                                    {analytics?.app_status_distribution?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : index === 1 ? '#10b981' : '#f59e0b'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                        {analytics?.app_status_distribution?.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: i === 0 ? '#6366f1' : i === 1 ? '#10b981' : '#f59e0b' }}></span>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', textTransform: 'capitalize' }}>{item.status}: {item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ title, value, trend, color, icon, sparkData }) {
    return (
        <div className="card" style={{
            padding: '24px', borderRadius: '28px', border: 'none',
            boxShadow: '0 10px 25px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: `${color}15`, color: color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                }}>
                    {icon}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#1e293b' }}>{value}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: trend.startsWith('+') ? '#10b981' : '#f59e0b' }}>{trend}</div>
            </div>

            {sparkData && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', opacity: 0.3 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sparkData.map(v => ({ v }))}>
                            <Area type="monotone" dataKey="v" stroke={color} fill={color} strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

function SupportAction({ label, count, color, icon, link }) {
    const { t } = useTranslation();
    const content = (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '15px', padding: '18px',
            background: 'rgba(255,255,255,0.03)', borderRadius: '20px', cursor: link ? 'pointer' : 'default',
            border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s'
        }}
            onMouseEnter={e => e.currentTarget.style.transform = link ? 'translateX(5px)' : 'none'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
        >
            <div style={{ fontSize: '1.4rem' }}>{icon}</div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#cbd5e1' }}>{label}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: color }}>{t('admin.issues_count', { count: count })}</div>
            </div>
            {link && <div style={{ color: '#475569', fontWeight: '900' }}>→</div>}
        </div>
    );

    return link ? <Link to={link} style={{ textDecoration: 'none' }}>{content}</Link> : content;
}
