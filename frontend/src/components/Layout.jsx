import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Bot, LogOut } from 'lucide-react';
import { useMsal } from '@azure/msal-react';

export default function Layout({ inventory, fetchInventory, triggerMarkdown }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { accounts, instance } = useMsal();

    // Show MS user name if logged in via Microsoft, else default Admin
    const msUser = localStorage.getItem('msUser');
    const displayName = msUser || (accounts[0]?.name) || 'Admin';

    const handleLogout = () => {
        // Clear all auth methods
        localStorage.removeItem('auth');
        localStorage.removeItem('msUser');
        localStorage.removeItem('authMethod');
        // Sign out from Microsoft if that was the login method
        if (accounts.length > 0) {
            instance.logoutPopup({ postLogoutRedirectUri: '/login' });
        } else {
            navigate('/login');
        }
    };

    const navItems = [
        { path: '/', label: 'Executive Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/inventory', label: 'Inventory Manager', icon: <Package size={20} /> },
        { path: '/markdown-ai', label: 'MarkDown Intelligence', icon: <Bot size={20} /> }
    ];

    return (
        <div className="app-layout">
            {/* Top Header */}
            <header className="main-header glass-panel">
                <div className="header-brand">
                    <h2 className="text-gradient" style={{ margin: 0 }}>Smart Markdown System</h2>
                </div>
                <div className="header-actions">
                    <span className="text-muted" style={{ marginRight: '1rem' }}>Welcome, {displayName}</span>
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
                    &copy; 2026 Optimized In-Store Inventory Management System for Markdown Events.
                </p>
            </footer>
        </div>
    );
}
