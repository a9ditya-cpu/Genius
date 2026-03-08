import React from 'react';
import InventoryList from './InventoryList';
import AnalyticsChart from './AnalyticsChart';
import { Package, TrendingDown, Layers } from 'lucide-react';

const Dashboard = ({ inventory, onMarkdown }) => {
    // Calculate simple stats
    const totalItems = inventory.reduce((acc, item) => acc + item.current_quantity, 0);
    const lowStockItems = inventory.filter(item => item.current_quantity < 30).length;
    const avgDiscount = inventory.reduce((acc, item) => {
        if (item.base_price > item.current_price) {
            return acc + ((item.base_price - item.current_price) / item.base_price);
        }
        return acc;
    }, 0) / (inventory.length || 1);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* KPI Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-main)' }}>
                        <Layers size={24} />
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Total Units</p>
                        <h3>{totalItems}</h3>
                    </div>
                </div>
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--accent-red)', borderRadius: '12px', color: 'var(--accent-red)' }}>
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Low Stock Alerts</p>
                        <h3>{lowStockItems}</h3>
                    </div>
                </div>
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--accent-green)', borderRadius: '12px', color: 'var(--accent-green)' }}>
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Avg Discount</p>
                        <h3>{(avgDiscount * 100).toFixed(1)}%</h3>
                    </div>
                </div>
            </div>

            {/* Panoramic Chart */}
            <div className="glass-panel">
                <h2>Predictive Demand Visualizer</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Projected ML burn-rate vs historical inventory trajectory.
                </p>
                {inventory.length > 0 ? (
                    <AnalyticsChart data={inventory.find(i => i.product_id === 'SKU-1024') || inventory[0]} />
                ) : (
                    <p>No data available for visualization.</p>
                )}
            </div>

            {/* Inventory Matrix */}
            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <h2>Node Level Inventory</h2>
                <InventoryList inventory={inventory} onMarkdown={onMarkdown} />
            </div>
        </div>
    );
};

export default Dashboard;
