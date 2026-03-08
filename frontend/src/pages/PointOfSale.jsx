import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, CreditCard } from 'lucide-react';

export default function PointOfSale() {
    const { inventory, recordTransaction } = useOutletContext();
    const [cart, setCart] = useState([]);
    const [status, setStatus] = useState('');

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product_id === product.product_id);
            if (existing) {
                if (existing.cartQty >= product.current_quantity) {
                    setStatus(`Cannot add more ${product.name}. Stock limit reached.`);
                    setTimeout(() => setStatus(''), 3000);
                    return prev;
                }
                return prev.map(item => item.product_id === product.product_id ? { ...item, cartQty: item.cartQty + 1 } : item);
            }
            if (product.current_quantity <= 0) {
                setStatus(`${product.name} is out of stock!`);
                setTimeout(() => setStatus(''), 3000);
                return prev;
            }
            return [...prev, { ...product, cartQty: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.product_id !== productId));
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;

        // Dispatch to global transaction ledger which automatically updates stock
        recordTransaction(cart);

        setStatus(`Transaction Complete! Sold ${cart.reduce((acc, i) => acc + i.cartQty, 0)} items for ₹${cartTotal.toFixed(2)}`);
        setCart([]);
        setTimeout(() => setStatus(''), 4000);
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.current_price * item.cartQty), 0);

    return (
        <div className="grid-layout animate-fade" style={{ gridTemplateColumns: '2fr 1fr' }}>
            {/* Left: Product Grid */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 150px)', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Point of Sale Kiosk</h2>
                    <span className="badge blue">Terminal 1 - Active</span>
                </div>

                {status && (
                    <div className="badge yellow" style={{ padding: '0.75rem', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}>
                        {status}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {inventory.map(item => (
                        <div
                            key={item.product_id}
                            style={{
                                padding: '1rem',
                                border: '1px solid var(--border-light)',
                                borderRadius: '8px',
                                cursor: item.current_quantity > 0 ? 'pointer' : 'not-allowed',
                                opacity: item.current_quantity > 0 ? 1 : 0.5,
                                background: 'var(--bg-card)'
                            }}
                            onClick={() => addToCart(item)}
                        >
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>{item.name}</h4>
                            <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>{item.product_id}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold' }}>₹{item.current_price.toFixed(2)}</span>
                                <span className={`badge ${item.current_quantity > 10 ? 'green' : item.current_quantity > 0 ? 'yellow' : 'red'}`}>
                                    {item.current_quantity} in stock
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Cart Panel */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                    <ShoppingCart size={24} />
                    <h2 style={{ margin: 0 }}>Current Cart</h2>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                            <ShoppingCart size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>Cart is empty. Scan or tap items to add.</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>
                                <div style={{ flex: 1 }}>
                                    <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>{item.name}</h5>
                                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>₹{item.current_price.toFixed(2)} x {item.cartQty}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', minWidth: '60px', textAlign: 'right' }}>₹{(item.current_price * item.cartQty).toFixed(2)}</span>
                                    <button className="btn-icon" onClick={() => removeFromCart(item.product_id)}>
                                        <Minus size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <span>Total</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: cart.length === 0 ? 'var(--border-light)' : 'var(--text-main)', color: cart.length === 0 ? 'var(--text-muted)' : 'var(--bg-dark)' }}
                    >
                        <CreditCard size={20} /> Process Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
