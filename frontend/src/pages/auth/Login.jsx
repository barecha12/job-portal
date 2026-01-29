import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../services/axios-client";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { setUser, setToken, setRole } = useAuth();
    const [message, setMessage] = useState(null);

    const onSubmit = (ev) => {
        ev.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        if (!email || !password) {
            setMessage("Please enter both email and password.");
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
                    setMessage("An unexpected error occurred.");
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
                        <h1 className="title" style={{ color: 'white', marginBottom: '0.5rem' }}>Welcome Back</h1>
                        <p style={{ color: '#94a3b8' }}>Please enter your details to sign in</p>
                    </div>

                    {message &&
                        <div className="alert" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' }}>
                            <p style={{ color: '#fca5a5' }}>{message}</p>
                        </div>
                    }

                    <div className="mb-4">
                        <label style={{ color: '#94a3b8' }}>Email Address</label>
                        <input
                            ref={emailRef}
                            type="email"
                            placeholder="name@company.com"
                            className="w-full"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    <div className="mb-4">
                        <label style={{ color: '#94a3b8' }}>Password</label>
                        <input
                            ref={passwordRef}
                            type="password"
                            placeholder="••••••••"
                            className="w-full"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    <button className="btn btn-block" style={{ marginTop: '1rem' }}>Sign In</button>

                    <p className="message" style={{ color: '#94a3b8', marginTop: '2rem' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-color)' }}>Create an account</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
