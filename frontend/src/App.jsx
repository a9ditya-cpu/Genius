import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Layouts and Pages
import Layout from './components/Layout';
import Login from './pages/Login';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import InventoryManager from './pages/InventoryManager';
import MarkdownAI from './pages/MarkdownAI';

// Proxy all AWS API traffic internally through the Vite Server (Port 5173) to bypass Firewalls
const API_URL = '/api';
axios.defaults.baseURL = API_URL;

// Secure Authenticated Route Wrapper
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('auth') === 'true';
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInventory = async () => {
        try {
            const res = await axios.get('/inventory');
            if (res.data && res.data.success) {
                setInventory(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch inventory", error);
        } finally {
            setLoading(false);
        }
    };

    const triggerMarkdown = async (productId, customPrice = null) => {
        try {
            const payload = { product_id: productId };
            if (customPrice) payload.manual_price = customPrice;

            const res = await axios.post('/markdown', payload);
            if (res.data && res.data.success) {
                fetchInventory();
            }
        } catch (error) {
            console.error("Failed to trigger markdown", error);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '10rem', color: 'var(--text-muted)' }}>
                <h2>Initializing System...</h2>
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
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
