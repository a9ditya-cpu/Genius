import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';

// Ensure the API URL is handled properly, defaulting to localhost for dev
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = API_URL;

function App() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/inventory/');
            if (res.data && res.data.success) {
                setInventory(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch inventory", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const triggerMarkdown = async (productId, customPrice = null) => {
        try {
            const payload = { product_id: productId };
            if (customPrice) payload.manual_price = customPrice;

            const res = await axios.post('/markdown/', payload);
            if (res.data && res.data.success) {
                // Refresh inventory data after successful markdown
                fetchInventory();
            }
        } catch (error) {
            console.error("Failed to trigger markdown", error);
        }
    };

    return (
        <div className="app-container animate-fade">
            <header className="header glass-panel">
                <div>
                    <h1 className="text-gradient" style={{ marginBottom: 0 }}>Smart Markdown System</h1>
                    <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>AI-Powered In-Store Inventory Management</p>
                </div>
                <button onClick={fetchInventory}>Refresh Data</button>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <h2>Loading Data...</h2>
                </div>
            ) : (
                <Dashboard inventory={inventory} onMarkdown={triggerMarkdown} />
            )}
        </div>
    );
}

export default App;
