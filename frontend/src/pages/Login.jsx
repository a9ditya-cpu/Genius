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
        // Capstone Demo: Hardcoded authentication to demonstrate security gateway
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('auth', 'true');
            navigate('/');
        } else {
            setError(true);
        }
    };

    return (
        <div className="login-wrapper animate-fade">
            <div className="glass-panel login-card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="text-gradient">System Login</h1>
                    <p className="text-muted">Smart Retail Inventory Management</p>
                </div>

                {error && (
                    <div className="badge red" style={{ marginBottom: '1rem', padding: '0.75rem', textAlign: 'center' }}>
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
                    <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem' }}>
                        Secure Login
                    </button>
                </form>
            </div>
        </div>
    );
}
