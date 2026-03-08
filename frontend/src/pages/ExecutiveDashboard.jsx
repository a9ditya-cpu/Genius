import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import { LayoutDashboard, TrendingUp, AlertTriangle, PackageSearch, BatteryWarning, Skull, Zap } from 'lucide-react';

export default function ExecutiveDashboard() {
    const { inventory, updateStock, triggerMarkdown } = useOutletContext();
    const [shockStatus, setShockStatus] = useState(null);

    const simulateShock = () => {
        setShockStatus('⚡ Injecting synthetic viral demand spike into live network...');

        setTimeout(() => {
            const jacket = inventory.find(i => i.product_id === 'SKU-1024');
            if (jacket) {
                const dropAmount = jacket.current_quantity - 4;
                if (dropAmount > 0) {
                    updateStock('SKU-1024', -dropAmount);
                }

                // Trigger 42% instant markup
                const newPrice = jacket.base_price * 1.42;
                triggerMarkdown('SKU-1024', newPrice);

                setShockStatus(`🚨 SCARCITY ANOMALY DETECTED: 'Vintage Denim Jacket' stock collapsed 88% due to viral social trend. AI dynamically raised price by 42% (₹${newPrice.toFixed(2)}) to maximize supply margins.`);
                setTimeout(() => setShockStatus(null), 12000);
            }
        }, 1500);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LayoutDashboard size={28} />
                    <h1 style={{ margin: 0 }}>Executive Overview</h1>
                </div>
                <button
                    onClick={simulateShock}
                    className="btn-danger"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                >
                    <Zap size={16} /> Simulate Viral Trend
                </button>
            </div>

            {shockStatus && (
                <div className="badge red animate-fade" style={{ padding: '1rem', fontSize: '1rem', width: '100%', justifyContent: 'flex-start', border: '1px solid #ef4444' }}>
                    {shockStatus}
                </div>
            )}

            {/* Top KPI Cards */}
            <Dashboard inventory={inventory} onMarkdown={triggerMarkdown} />
        </div>
    );
}
