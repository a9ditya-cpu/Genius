import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

export default function Login() {
    const navigate = useNavigate();
    const { instance } = useMsal();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [msalError, setMsalError] = useState('');
    const [loading, setLoading] = useState(false);

    // Option 1: Classic Admin login (for demo/backup)
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

    // Option 2: Microsoft Identity Platform Login
    const handleMicrosoftLogin = async () => {
        setLoading(true);
        setMsalError('');
        try {
            const result = await instance.loginPopup(loginRequest);
            if (result && result.account) {
                localStorage.setItem('auth', 'true');
                localStorage.setItem('authMethod', 'microsoft');
                localStorage.setItem('msUser', result.account.name);
                navigate('/');
            }
        } catch (err) {
            if (err.errorCode === 'user_cancelled') {
                setMsalError('Login was cancelled.');
            } else if (err.errorCode === 'invalid_client') {
                setMsalError('Azure ClientID not configured. Please set up the Azure Portal registration first.');
            } else {
                setMsalError('Microsoft login failed. Please check your Azure Portal setup.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper animate-fade">
            <div className="glass-panel login-card">
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2.2rem' }}>Genius</h1>
                    <p className="text-muted" style={{ fontWeight: 500 }}>Enterprise Initialization Gateway</p>
                </div>

                {/* Microsoft Login */}
                <button
                    onClick={handleMicrosoftLogin}
                    disabled={loading}
                    className="ms-login-btn"
                    style={{
                        width: '100%',
                        padding: '0.85rem',
                        marginBottom: '1.5rem',
                        background: '#ffffff',
                        color: '#0f172a',
                        border: '1px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                >
                    {/* Microsoft Logo SVG */}
                    <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                        <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                        <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                        <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                    </svg>
                    {loading ? 'Connecting to Microsoft...' : 'Sign in with Microsoft'}
                </button>

                {msalError && (
                    <div className="badge red" style={{ marginBottom: '1rem', padding: '0.75rem', textAlign: 'center', display: 'block', borderRadius: '8px' }}>
                        ⚠️ {msalError}
                    </div>
                )}

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <hr style={{ flex: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>or admin login</span>
                    <hr style={{ flex: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
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
