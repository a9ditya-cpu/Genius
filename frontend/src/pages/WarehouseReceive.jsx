import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Truck, PackagePlus, CheckCircle2 } from 'lucide-react';

export default function WarehouseReceive() {
    const { inventory, updateStock } = useOutletContext();
    const [receipts, setReceipts] = useState({});
    const [status, setStatus] = useState('');

    const handleQuantityChange = (productId, value) => {
        const qty = parseInt(value) || 0;
        setReceipts(prev => ({
            ...prev,
            [productId]: qty
        }));
    };

    const handleReceive = (productId) => {
        const qty = receipts[productId];
        if (!qty || qty <= 0) return;

        updateStock(productId, qty);

        // Clear the input and show success
        setReceipts(prev => ({ ...prev, [productId]: '' }));
        setStatus(`Successfully received ${qty} units of ${productId}`);
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--text-main)', color: 'var(--bg-dark)' }}>
                <Truck size={32} />
                <div>
                    <h2 style={{ margin: 0, color: 'var(--bg-dark)' }}>Inbound Logistics & Receiving</h2>
                    <p style={{ margin: 0, fontWeight: 500 }}>Warehouse Manager Terminal</p>
                </div>
            </div>

            {status && (
                <div className="badge green" style={{ padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} /> {status}
                </div>
            )}

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Product Name</th>
                            <th>Current Stock</th>
                            <th>Receive Quantity</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => (
                            <tr key={item.product_id}>
                                <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{item.product_id}</td>
                                <td style={{ fontWeight: '600' }}>{item.name}</td>
                                <td>
                                    <span className={`badge ${item.current_quantity > 10 ? 'green' : item.current_quantity > 0 ? 'yellow' : 'red'}`}>
                                        {item.current_quantity} units
                                    </span>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={receipts[item.product_id] || ''}
                                        onChange={(e) => handleQuantityChange(item.product_id, e.target.value)}
                                        style={{
                                            width: '80px',
                                            padding: '0.5rem',
                                            background: 'var(--bg-dark)',
                                            border: '1px solid var(--border-light)',
                                            color: 'var(--text-main)',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleReceive(item.product_id)}
                                        disabled={!receipts[item.product_id] || receipts[item.product_id] <= 0}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            fontSize: '0.8rem',
                                            opacity: (!receipts[item.product_id] || receipts[item.product_id] <= 0) ? 0.3 : 1
                                        }}
                                    >
                                        <PackagePlus size={14} /> Intake
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
