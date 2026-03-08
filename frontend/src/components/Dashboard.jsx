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
        <div className="grid-layout">
            <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-blue)' }}>
                            <Layers size={24} />
                        </div>
                        <div>
                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Total Units</p>
                            <h3>{totalItems}</h3>
                        </div>
                    </div>
                    <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--accent-red)' }}>
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Low Stock Alerts</p>
                            <h3>{lowStockItems}</h3>
                        </div>
                    </div>
                    <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--accent-green)' }}>
                            <TrendingDown size={24} />
                        </div>
                        <div>
                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Avg Discount</p>
                            <h3>{(avgDiscount * 100).toFixed(1)}%</h3>
                        </div>
                    </div>
                </div>

                <div className="glass-panel">
                    <h2>Inventory & Pricing</h2>
                    <InventoryList inventory={inventory} onMarkdown={onMarkdown} />
                </div>
            </div>

            <div className="side-content">
                <div className="glass-panel" style={{ position: 'sticky', top: '20px' }}>
                    <h2>Demand Visualizer</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        Projected sales vs Actual stock over the latest 5 weeks.
                    </p>
                    {inventory.length > 0 ? (
                        <AnalyticsChart data={inventory[0]} /> // visualize first item by default
                    ) : (
                        <p>No data available for visualization.</p>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
