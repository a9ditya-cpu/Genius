import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Settings, Search, RefreshCw } from 'lucide-react';

export default function InventoryManager() {
    const { inventory, fetchInventory } = useOutletContext();
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="workspace-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Inventory Control</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="search-bar">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search by ID or Name..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ width: '250px' }}
                        />
                    </div>
                    <button onClick={fetchInventory} className="btn-icon"><RefreshCw size={16} /> Sync Database</button>
                </div>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>SKU ID</th>
                            <th>Product Name</th>
                            <th>Initial Stock</th>
                            <th>Current Stock</th>
                            <th>Base Price</th>
                            <th>Shelf Life (Days)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(item => (
                            <tr key={item.product_id}>
                                <td><code>{item.product_id}</code></td>
                                <td style={{ fontWeight: 'bold' }}>{item.name}</td>
                                <td>{item.initial_quantity}</td>
                                <td>{item.current_quantity}</td>
                                <td>${item.base_price.toFixed(2)}</td>
                                <td>{item.shelf_life_days}</td>
                                <td>
                                    <span className={`badge ${item.current_quantity === 0 ? 'red' : item.current_quantity < 20 ? 'yellow' : 'green'}`}>
                                        {item.current_quantity === 0 ? 'Out of Stock' : item.current_quantity < 20 ? 'Low Stock' : 'Healthy'}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-icon" style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.1)' }}>
                                        <Settings size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No products found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
}
