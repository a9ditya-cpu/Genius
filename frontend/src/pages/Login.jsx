import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('auth', 'true');
            localStorage.setItem('authMethod', 'local');
            navigate('/');
        } else {
            setError(true);
        }
    };

    return (
        <div className="login-wrapper animate-fade">
            <div className="glass-panel login-card">
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent-blue)' }}>
                        <Lock size={40} fill="currentColor" strokeWidth={1} style={{ opacity: 0.1, position: 'absolute' }} />
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hexagon">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                    </div>
                    <h1 className="text-gradient" style={{ fontSize: '2.2rem', margin: 0 }}>Genius</h1>
                    <p className="text-muted" style={{ fontWeight: 500 }}>Enterprise Initialization Gateway</p>
                </div>

                {error && (
                    <div className="badge red" style={{ marginBottom: '1rem', padding: '0.75rem', textAlign: 'center', display: 'block', borderRadius: '8px' }}>
                        Invalid Admin Credentials
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="input-group">
                        <User size={18} className="input-icon" />
                        <input
                            type="text"
                            placeholder="Username (admin)"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="auth-input"
                        />
                    </div>
                    <div className="input-group">
                        <Lock size={18} className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password (admin123)"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="auth-input"
                        />
                    </div>
                    <button type="submit" style={{ marginTop: '0.5rem', padding: '0.75rem' }}>
                        Secure Login
                    </button>
                </form>
            </div>
        </div>
    );
}
