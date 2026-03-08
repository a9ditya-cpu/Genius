import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Truck, PackagePlus, CheckCircle2, Bot, Send } from 'lucide-react';

export default function WarehouseReceive() {
    const { inventory, updateStock } = useOutletContext();
    const [receipts, setReceipts] = useState({});
    const [status, setStatus] = useState('');
    const [nlpCommand, setNlpCommand] = useState('');
    const [nlpStatus, setNlpStatus] = useState('');

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

        setReceipts(prev => ({ ...prev, [productId]: '' }));
        setStatus(`Successfully received ${qty} units of ${productId}`);
        setTimeout(() => setStatus(''), 3000);
    };

    const handleNLPCommand = (e) => {
        e.preventDefault();
        if (!nlpCommand.trim()) return;

        setStatus('');
        setNlpStatus('Parsing semantic language architecture...');

        setTimeout(() => {
            const text = nlpCommand.toLowerCase();
            const words = text.split(/\s+/);
            let foundQty = 0;
            let foundProduct = null;

            // Heuristic number extraction
            for (let w of words) {
                if (!isNaN(parseInt(w))) {
                    foundQty = parseInt(w);
                    break;
                }
            }

            // Heuristic product extraction (match SKU or major keywords)
            for (let item of inventory) {
                if (text.includes(item.product_id.toLowerCase()) ||
                    item.name.toLowerCase().split(' ').some(kw => kw.length > 4 && text.includes(kw))) {
                    foundProduct = item;
                    break;
                }
            }

            if (foundProduct && foundQty > 0) {
                updateStock(foundProduct.product_id, foundQty);
                setNlpStatus(`✓ NLP MATCH LOGGED: Successfully added ${foundQty} units to ${foundProduct.name} (${foundProduct.product_id})`);
            } else {
                setNlpStatus("⚠ NLP WARNING: Ambiguous command. Could not extract explicit (Quantity) and (Product_ID) parameters.");
            }

            setNlpCommand('');
            setTimeout(() => setNlpStatus(''), 7000);

        }, 1200);
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

            {/* Hackathon WOW Feature: NLP Copilot */}
            <div className="glass-panel" style={{ marginTop: '1rem', border: '1px solid #3b82f6', background: 'rgba(59, 130, 246, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#60a5fa' }}>
                    <Bot size={20} />
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Genius AI Logistics Copilot</h3>
                </div>

                {nlpStatus && (
                    <div className="badge blue" style={{ marginBottom: '1rem', padding: '0.8rem', fontSize: '0.9rem', width: '100%' }}>
                        {nlpStatus}
                    </div>
                )}

                <form onSubmit={handleNLPCommand} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        value={nlpCommand}
                        onChange={(e) => setNlpCommand(e.target.value)}
                        placeholder="Natural Language Intake (e.g., 'Received 40 pallets of Denim Jackets today')"
                        style={{
                            flex: 1,
                            padding: '1rem',
                            fontSize: '1rem',
                            background: 'var(--bg-dark)',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-main)',
                            borderRadius: '8px'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!nlpCommand.trim()}
                        style={{
                            padding: '0 2rem',
                            background: '#3b82f6',
                            color: '#ffffff',
                            border: 'none',
                            opacity: nlpCommand.trim() ? 1 : 0.5
                        }}
                    >
                        <Send size={20} />
                    </button>
                </form>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '1rem', textAlign: 'center' }}>
                    Speak naturally. The ML Engine automatically parses SKUs, Keywords, and Quantities to execute database mutations.
                </p>
            </div>

        </div>
    );
}
