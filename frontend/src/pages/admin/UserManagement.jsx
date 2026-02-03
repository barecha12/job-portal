import { useEffect, useState } from "react";
import axiosClient from "../../services/axios-client";
import { useTranslation } from "react-i18next";

export default function UserManagement() {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const fetchUsers = () => {
        setLoading(true);
        axiosClient.get('/admin/users')
            .then(({ data }) => {
                setUsers(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = (id) => {
        if (!window.confirm(t('admin.warn_delete_user'))) return;

        axiosClient.delete(`/admin/users/${id}`)
            .then(() => {
                setUsers(users.filter(u => u.id !== id));
            })
            .catch(err => {
                alert(err.response?.data?.message || "Purge failed.");
            });
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="animated fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>{t('admin.system_directory')}</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                        style={{ padding: '10px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">{t('admin.all_roles')}</option>
                        <option value="seeker">{t('auth.role_seeker')}</option>
                        <option value="employer">{t('auth.role_employer')}</option>
                        <option value="admin">{t('admin.administrator')}</option>
                    </select>
                    <input
                        type="text"
                        placeholder={t('admin.search_identity')}
                        style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', width: '250px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-add" onClick={fetchUsers}>{t('admin.sync')}</button>
                </div>
            </div>

            <div className="card" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                {loading ? (
                    <div style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>{t('admin.establishing_link')}</div>
                ) : (
                    <table style={{ margin: 0 }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.user_identity')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.security_level')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.onboarding_date')}</th>
                                <th style={{ padding: '20px 25px', textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{t('admin.protocol')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px 25px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: user.role === 'admin' ? '#ef444410' : '#6366f110', color: user.role === 'admin' ? '#ef4444' : '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', color: '#1e293b' }}>{user.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px 25px' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800',
                                            background: user.role === 'admin' ? '#ef444410' : user.role === 'employer' ? '#dbeafe' : '#dcfce7',
                                            color: user.role === 'admin' ? '#ef4444' : user.role === 'employer' ? '#1e40af' : '#166534',
                                            textTransform: 'uppercase'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px 25px', color: '#64748b', fontSize: '0.9rem' }}>
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '15px 25px', textAlign: 'right' }}>
                                        {user.role !== 'admin' && (
                                            <button
                                                className="btn-delete"
                                                onClick={() => deleteUser(user.id)}
                                                style={{ padding: '6px 15px', fontSize: '0.8rem', borderRadius: '8px' }}
                                            >
                                                {t('admin.revoke')}
                                            </button>
                                        )}
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
