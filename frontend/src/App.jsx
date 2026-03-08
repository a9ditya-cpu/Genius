import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts and Pages
import Layout from './components/Layout';
import Login from './pages/Login';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import InventoryManager from './pages/InventoryManager';
import MarkdownAI from './pages/MarkdownAI';

// Secure Authenticated Route Wrapper
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('auth') === 'true';
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Rich Presentation Mock Data
const MOCK_DATA = [
    { product_id: 'SKU-7829', name: 'Organic Honeycrisp Apples (Bag)', base_price: 6.99, current_price: 6.99, current_quantity: 145, shelf_life_days: 12, category: 'Produce' },
    { product_id: 'SKU-1024', name: 'Artisan Sourdough Loaf', base_price: 5.49, current_price: 5.49, current_quantity: 32, shelf_life_days: 2, category: 'Bakery' },
    { product_id: 'SKU-4451', name: 'Premium Greek Yogurt (Vanilla)', base_price: 4.99, current_price: 4.99, current_quantity: 88, shelf_life_days: 8, category: 'Dairy' },
    { product_id: 'SKU-9921', name: 'Fresh Atlantic Salmon Fillet', base_price: 18.99, current_price: 18.99, current_quantity: 14, shelf_life_days: 3, category: 'Seafood' },
    { product_id: 'SKU-3320', name: 'Wagyu Beef Ribeye Steak', base_price: 34.99, current_price: 34.99, current_quantity: 8, shelf_life_days: 5, category: 'Meat' },
    { product_id: 'SKU-1102', name: 'Avocado (Haas) 4-pack', base_price: 4.50, current_price: 4.50, current_quantity: 210, shelf_life_days: 6, category: 'Produce' },
    { product_id: 'SKU-5544', name: 'Organic Baby Spinach', base_price: 3.99, current_price: 3.99, current_quantity: 65, shelf_life_days: 4, category: 'Produce' },
    { product_id: 'SKU-8871', name: 'Cold-Pressed Orange Juice', base_price: 5.99, current_price: 5.99, current_quantity: 42, shelf_life_days: 7, category: 'Beverage' },
    { product_id: 'SKU-2219', name: 'Free-Range Brown Eggs (Dozen)', base_price: 4.29, current_price: 4.29, current_quantity: 115, shelf_life_days: 14, category: 'Dairy' },
    { product_id: 'SKU-6633', name: 'Gourmet Chocolate Truffles', base_price: 12.99, current_price: 12.99, current_quantity: 18, shelf_life_days: 45, category: 'Snacks' }
];

function App() {
    // Frontend-only state management
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInventory = async () => {
        // Simulate network latency for realism
        setTimeout(() => {
            setInventory(MOCK_DATA);
            setLoading(false);
        }, 800);
    };

    const triggerMarkdown = async (productId, customPrice = null) => {
        // Find item to mathematically calculate markdown
        const itemToUpdate = inventory.find(i => i.product_id === productId);
        if (!itemToUpdate) return;

        // Calculate new price (either strictly defined customPrice, or 15% automatic AI cut)
        const newPrice = customPrice !== null ? customPrice : parseFloat((itemToUpdate.base_price * 0.85).toFixed(2));

        // Update React state instantly
        setInventory(prev => prev.map(item =>
            item.product_id === productId
                ? { ...item, current_price: newPrice }
                : item
        ));
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
                        />
                    </ProtectedRoute>
                }>
                    <Route path="/" element={<ExecutiveDashboard />} />
                    <Route path="/inventory" element={<InventoryManager />} />
                    <Route path="/markdown-ai" element={<MarkdownAI />} />
                    {/* Fake Settings Page for Enterprise feel */}
                    <Route path="/settings" element={
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
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
