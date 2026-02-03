import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../services/axios-client";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function Login() {
    const { t } = useTranslation();
    const emailRef = useRef();
    const passwordRef = useRef();
    const { setUser, setToken, setRole } = useAuth();
    const [message, setMessage] = useState(null);

    const onSubmit = (ev) => {
        ev.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        if (!email || !password) {
            setMessage(t('auth.login_error'));
            return;
        }

        const payload = {
            email: email,
            password: password,
        }

        setMessage(null);
        axiosClient.post('/login', payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.access_token);
                setRole(data.user.role);
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setMessage(response.data.message);
                } else if (response && response.status === 401) {
                    setMessage(response.data.message);
                } else {
                    setMessage(t('auth.unexpected_error'));
                }
            })
    }

    return (
        <div className="login-signup-form" style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="form glass-dark">
                <form onSubmit={onSubmit}>
                    <div className="text-center mb-4">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
                        <h1 className="title" style={{ color: 'white', marginBottom: '0.5rem' }}>{t('auth.welcome_back')}</h1>
                        <p style={{ color: '#94a3b8' }}>{t('auth.sign_in_subtitle')}</p>
                    </div>

                    {message &&
                        <div className="alert" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' }}>
                            <p style={{ color: '#fca5a5' }}>{message}</p>
                        </div>
                    }

                    <div className="mb-4">
                        <label style={{ color: '#94a3b8' }}>{t('auth.email_label')}</label>
                        <input
                            ref={emailRef}
                            type="email"
                            placeholder={t('auth.placeholder_email')}
                            className="w-full"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    <div className="mb-4">
                        <label style={{ color: '#94a3b8' }}>{t('auth.password_label')}</label>
                        <input
                            ref={passwordRef}
                            type="password"
                            placeholder="••••••••"
                            className="w-full"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    <button className="btn btn-block" style={{ marginTop: '1rem' }}>{t('auth.sign_in_btn')}</button>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.75rem', textAlign: 'center' }}>{t('auth.demo_account')}</p>
                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{ width: '100%', borderColor: 'rgba(51, 224, 172, 0.5)', color: '#33e0ac' }}
                            onClick={() => {
                                emailRef.current.value = 'admin@example.com';
                                passwordRef.current.value = 'password';
                                // Trigger submit after a tiny delay to let refs update
                                setTimeout(() => onSubmit({ preventDefault: () => { } }), 100);
                            }}
                        >
                            {t('auth.admin_login')}
                        </button>
                    </div>

                    <p className="message" style={{ color: '#94a3b8', marginTop: '1.5rem' }}>
                        {t('auth.no_account')} <Link to="/signup" style={{ color: 'var(--primary-color)' }}>{t('auth.create_account')}</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
