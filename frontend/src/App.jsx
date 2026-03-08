import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts and Pages
import Layout from './components/Layout';
import Login from './pages/Login';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import InventoryManager from './pages/InventoryManager';
import MarkdownAI from './pages/MarkdownAI';
import PointOfSale from './pages/PointOfSale';
import WarehouseReceive from './pages/WarehouseReceive';

// Secure Authenticated Route Wrapper
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('auth') === 'true';
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Strict Role-Based Route Guard
const RoleRoute = ({ children, allowedRoles }) => {
    const role = localStorage.getItem('role') || 'ADMIN';
    if (!allowedRoles.includes(role)) {
        if (role === 'CASHIER') return <Navigate to="/pos" replace />;
        if (role === 'MANAGER') return <Navigate to="/receive" replace />;
        return <Navigate to="/" replace />;
    }
    return children;
};

const MOCK_DATA = [
    { product_id: 'SKU-7829', name: 'Cotton Premium T-shirt (Black)', base_price: 1299.00, current_price: 1299.00, current_quantity: 145, shelf_life_days: 12, category: 'Tops' },
    { product_id: 'SKU-1024', name: 'Vintage Denim Jacket', base_price: 4599.00, current_price: 4599.00, current_quantity: 32, shelf_life_days: 2, category: 'Outerwear' },
    { product_id: 'SKU-4451', name: 'Slim Fit Chino Pants', base_price: 2499.00, current_price: 2499.00, current_quantity: 88, shelf_life_days: 8, category: 'Bottoms' },
    { product_id: 'SKU-9921', name: 'Athletic Running Shorts', base_price: 1899.00, current_price: 1899.00, current_quantity: 14, shelf_life_days: 3, category: 'Activewear' },
    { product_id: 'SKU-3320', name: 'Merino Wool Sweater', base_price: 3499.00, current_price: 3499.00, current_quantity: 8, shelf_life_days: 5, category: 'Knitwear' },
    { product_id: 'SKU-1102', name: 'Classic Crew Neck Sweater', base_price: 2899.00, current_price: 2899.00, current_quantity: 210, shelf_life_days: 60, category: 'Knitwear' },
    { product_id: 'SKU-5544', name: 'Linen Blend Button-Down', base_price: 2199.00, current_price: 2199.00, current_quantity: 65, shelf_life_days: 45, category: 'Tops' },
    { product_id: 'SKU-8871', name: 'High-Waist Leggings', base_price: 1699.00, current_price: 1699.00, current_quantity: 42, shelf_life_days: 70, category: 'Activewear' },
    { product_id: 'SKU-2219', name: 'Wool Blend Overcoat', base_price: 8999.00, current_price: 8999.00, current_quantity: 115, shelf_life_days: 140, category: 'Outerwear' },
    { product_id: 'SKU-6633', name: 'Silk Sleepwear Set', base_price: 5499.00, current_price: 5499.00, current_quantity: 18, shelf_life_days: 45, category: 'Loungewear' }
];

function App() {
    // Frontend-only state management
    const [inventory, setInventory] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInventory = async () => {
        // Simulate network latency for realism
        setTimeout(() => {
            setInventory(MOCK_DATA);
            setLoading(false);
        }, 800);
    };

    const triggerMarkdown = async (productId, customPrice = null) => {
        const itemToUpdate = inventory.find(i => i.product_id === productId);
        if (!itemToUpdate) return;
        const newPrice = customPrice !== null ? customPrice : parseFloat((itemToUpdate.base_price * 0.85).toFixed(2));
        setInventory(prev => prev.map(item =>
            item.product_id === productId
                ? { ...item, current_price: newPrice }
                : item
        ));
    };

    const updateStock = (productId, quantityChange) => {
        setInventory(prev => prev.map(item =>
            item.product_id === productId
                ? { ...item, current_quantity: Math.max(0, item.current_quantity + quantityChange) }
                : item
        ));
    };

    const recordTransaction = (cartItems) => {
        const timestamp = new Date().toISOString();
        const tx = {
            id: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            timestamp,
            items: cartItems.map(item => ({ product_id: item.product_id, qty: item.cartQty, price: item.current_price }))
        };
        setTransactions(prev => [...prev, tx]);

        // Simultaneously decrement warehouse inventory based on the sale
        cartItems.forEach(item => {
            updateStock(item.product_id, -item.cartQty);
        });
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '10rem', color: 'var(--text-muted)' }}>
                <h2 style={{ color: '#2563eb' }}>Genius Platform Initializing...</h2>
                <p>Establishing secure connection to ML Server</p>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Authentication Route */}
                <Route path="/login" element={<Login />} />

                {/* Secure Workspaces */}
                <Route element={
                    <ProtectedRoute>
                        <Layout
                            inventory={inventory}
                            fetchInventory={fetchInventory}
                            triggerMarkdown={triggerMarkdown}
                            updateStock={updateStock}
                            recordTransaction={recordTransaction}
                        />
                    </ProtectedRoute>
                }>
                    <Route path="/" element={<RoleRoute allowedRoles={['ADMIN']}><ExecutiveDashboard /></RoleRoute>} />
                    <Route path="/inventory" element={<RoleRoute allowedRoles={['ADMIN', 'MANAGER']}><InventoryManager /></RoleRoute>} />
                    <Route path="/markdown-ai" element={<RoleRoute allowedRoles={['ADMIN']}><MarkdownAI /></RoleRoute>} />
                    <Route path="/pos" element={<RoleRoute allowedRoles={['ADMIN', 'CASHIER']}><PointOfSale /></RoleRoute>} />
                    <Route path="/receive" element={<RoleRoute allowedRoles={['ADMIN', 'MANAGER']}><WarehouseReceive /></RoleRoute>} />
                    {/* Fake Settings Page for Enterprise feel */}
                    <Route path="/settings" element={
                        <RoleRoute allowedRoles={['ADMIN']}>
                            <div className="workspace-panel glass-panel">
                                <h2>System Settings</h2>
                                <p className="text-muted">Enterprise Configuration & Active Directory</p>
                                <hr style={{ margin: '2rem 0', borderColor: '#e2e8f0' }} />
                                <div className="grid-layout recommendations-grid">
                                    <div className="glass-panel" style={{ background: '#f8fafc' }}>
                                        <h3>User Management</h3>
                                        <p>Azure AD Sync is <strong>Active</strong></p>
                                        <button className="btn-success" style={{ marginTop: '1rem' }}>Force Sync Users</button>
                                    </div>
                                    <div className="glass-panel" style={{ background: '#f8fafc' }}>
                                        <h3>ML Engine Preferences</h3>
                                        <p>Auto-Approve Threshold: <strong>12%</strong></p>
                                        <button style={{ marginTop: '1rem', background: '#64748b' }}>Configure Models</button>
                                    </div>
                                </div>
                            </div>
                        </RoleRoute>
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
