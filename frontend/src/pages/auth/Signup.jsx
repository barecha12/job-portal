import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../services/axios-client";
import { useAuth } from "../../contexts/AuthContext";

export default function Signup() {
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
            setErrors({ message: ['All fields are required'] });
            return;
        }

        if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
            setErrors({ password: ['Passwords do not match'] });
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
                    setErrors({ message: ['An unexpected error occurred. Please try again.'] });
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
                        <h1 className="title" style={{ color: 'white', marginBottom: '0.5rem' }}>Get Started</h1>
                        <p style={{ color: '#94a3b8' }}>Join our community of professionals</p>
                    </div>

                    {errors && <div className="alert" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' }}>
                        {Object.keys(errors).map(key => (
                            <p key={key} style={{ color: '#fca5a5', margin: 0 }}>{Array.isArray(errors[key]) ? errors[key][0] : errors[key]}</p>
                        ))}
                    </div>}

                    <div className="mb-4">
                        <label style={{ color: '#94a3b8' }}>Full Name</label>
                        <input
                            ref={nameRef}
                            placeholder="John Doe"
                            type="text"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    <div className="mb-4">
                        <label style={{ color: '#94a3b8' }}>Email Address</label>
                        <input
                            ref={emailRef}
                            type="email"
                            placeholder="name@company.com"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="mb-4">
                            <label style={{ color: '#94a3b8' }}>Password</label>
                            <input
                                ref={passwordRef}
                                type="password"
                                placeholder="••••••••"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>

                        <div className="mb-4">
                            <label style={{ color: '#94a3b8' }}>Confirm</label>
                            <input
                                ref={passwordConfirmationRef}
                                type="password"
                                placeholder="••••••••"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label style={{ color: '#94a3b8' }}>I want to...</label>
                        <select
                            ref={roleRef}
                            defaultValue="seeker"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        >
                            <option value="seeker" style={{ color: 'black' }}>Find a job (Job Seeker)</option>
                            <option value="employer" style={{ color: 'black' }}>Hire talent (Employer)</option>
                        </select>
                    </div>

                    <button className="btn btn-block" style={{ marginTop: '1rem' }}>Create Account</button>

                    <p className="message" style={{ color: '#94a3b8', marginTop: '2rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
