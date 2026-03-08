import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Bot, Settings, LogOut, Hexagon } from 'lucide-react';

export default function Layout({ inventory, fetchInventory, triggerMarkdown }) {
    const location = useLocation();
    const navigate = useNavigate();

    // Show MS user name if logged in, else default Admin
    const msUser = localStorage.getItem('msUser');
    const displayName = msUser || 'Admin';

    const handleLogout = () => {
        // Clear all auth methods
        localStorage.removeItem('auth');
        localStorage.removeItem('msUser');
        localStorage.removeItem('authMethod');
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Executive Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/inventory', label: 'Inventory Manager', icon: <Package size={20} /> },
        { path: '/markdown-ai', label: 'MarkDown Intelligence', icon: <Bot size={20} /> },
        { path: '/settings', label: 'System Settings', icon: <Settings size={20} /> }
    ];

    return (
        <div className="app-layout">
            {/* Top Header */}
            <header className="main-header">
                <div className="header-brand">
                    <div style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center' }}>
                        <Hexagon size={32} fill="currentColor" strokeWidth={1.5} />
                    </div>
                    <h1 style={{ margin: 0 }}>Genius <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>Workspace</span></h1>
                </div>
                <div className="header-actions">
                    <span className="text-muted" style={{ marginRight: '1rem', fontWeight: 600 }}>Welcome, {displayName}</span>
                    <div className="profile-circle">{displayName.charAt(0)}</div>
                    <button onClick={handleLogout} className="btn-icon" title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            <div className="main-content-layout">
                {/* Sidebar Navigation */}
                <aside className="sidebar glass-panel">
                    <nav className="nav-menu">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.icon}
                                <span className="nav-label">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Dynamic Page Content */}
                <main className="page-content animate-fade">
                    <Outlet context={{ inventory, fetchInventory, triggerMarkdown }} />
                </main>
            </div>

            {/* Footer */}
            <footer className="main-footer">
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    &copy; 2024 Genius Enterprise Intelligence &bull; <a href="#" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>Privacy Policy</a> &bull; <a href="#" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>Terms of Service</a> &bull; Version 4.8.2
                </p>
            </footer>
        </div>
    );
}
