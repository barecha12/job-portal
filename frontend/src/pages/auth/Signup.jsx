import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../services/axios-client";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function Signup() {
    const { t } = useTranslation();
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();
    const roleRef = useRef();

    const { setUser, setToken, setRole } = useAuth();
    const [errors, setErrors] = useState(null);

    const onSubmit = (ev) => {
        ev.preventDefault();

        // Basic Client-Side Validation
        if (!nameRef.current.value || !emailRef.current.value || !passwordRef.current.value) {
            setErrors({ message: [t('auth.fields_required')] });
            return;
        }

        if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
            setErrors({ password: [t('auth.passwords_dont_match')] });
            return;
        }

        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
            role: roleRef.current.value,
        }

        setErrors(null);
        axiosClient.post('/register', payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.access_token);
                setRole(data.user.role);
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data);
                } else {
                    setErrors({ message: [t('auth.unexpected_error')] });
                }
            })
    }

    return (
        <div className="login-signup-form" style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 0'
        }}>
            <div className="form glass-dark" style={{ maxWidth: '500px' }}>
                <form onSubmit={onSubmit}>
                    <div className="text-center mb-4">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                        <h1 className="title" style={{ color: 'white', marginBottom: '0.5rem' }}>{t('auth.create_account')}</h1>
                        <p style={{ color: '#94a3b8' }}>{t('auth.create_account_subtitle')}</p>
                    </div>

                    {errors && <div className="alert" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' }}>
                        {Object.keys(errors).map(key => (
                            <p key={key} style={{ color: '#fca5a5', margin: 0 }}>{Array.isArray(errors[key]) ? errors[key][0] : errors[key]}</p>
                        ))}
                    </div>}

                    <div className="mb-4">
                        <label style={{ color: '#94a3b8' }}>{t('auth.full_name_label')}</label>
                        <input
                            ref={nameRef}
                            placeholder={t('auth.placeholder_name')}
                            type="text"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    <div className="mb-4">
                        <label style={{ color: '#94a3b8' }}>{t('auth.email_label')}</label>
                        <input
                            ref={emailRef}
                            type="email"
                            placeholder={t('auth.placeholder_email')}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="mb-4">
                            <label style={{ color: '#94a3b8' }}>{t('auth.password_label')}</label>
                            <input
                                ref={passwordRef}
                                type="password"
                                placeholder="••••••••"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>

                        <div className="mb-4">
                            <label style={{ color: '#94a3b8' }}>{t('auth.confirm_label')}</label>
                            <input
                                ref={passwordConfirmationRef}
                                type="password"
                                placeholder="••••••••"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label style={{ color: '#94a3b8' }}>{t('auth.i_want_to')}</label>
                        <select
                            ref={roleRef}
                            defaultValue="seeker"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        >
                            <option value="seeker" style={{ color: 'black' }}>{t('auth.role_seeker')}</option>
                            <option value="employer" style={{ color: 'black' }}>{t('auth.role_employer')}</option>
                        </select>
                    </div>

                    <button className="btn btn-block" style={{ marginTop: '1rem' }}>{t('auth.sign_up_btn')}</button>

                    <p className="message" style={{ color: '#94a3b8', marginTop: '2rem' }}>
                        {t('auth.has_account')} <Link to="/login" style={{ color: 'var(--primary-color)' }}>{t('auth.sign_in_btn')}</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
