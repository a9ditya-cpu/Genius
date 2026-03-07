import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bot, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function MarkdownAI() {
    const { inventory, triggerMarkdown } = useOutletContext();

    // Simulated ML Engine Recommendations (Expiring soon, but not already marked down)
    const recommendations = inventory
        .filter(item => item.shelf_life_days < 10 && item.current_price === item.base_price && item.current_quantity > 0)
        .map(item => ({
            ...item,
            suggested_price: item.base_price * 0.85, // 15% off recommendation
            reason: `Expiring in ${item.shelf_life_days} days`,
            impact: `+${(item.current_quantity * 0.6).toFixed(0)} units expected to sell if markdown applied today`
        }));

    const approveAll = () => {
        recommendations.forEach(r => triggerMarkdown(r.product_id, r.suggested_price));
    };

    return (
        <div className="workspace-panel">
            <div className="ai-header">
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                        Markdown Intelligence <Bot style={{ color: 'var(--accent-cyan)' }} />
                    </h2>
                    <p className="text-muted" style={{ marginTop: '0.5rem' }}>AI-Powered Price Optimization Engine</p>
                </div>
                {recommendations.length > 0 && (
                    <button className="btn-success" onClick={approveAll} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShieldCheck size={18} /> Approve All AI Recommendations
                    </button>
                )}
            </div>

            <div className="grid-layout recommendations-grid">
                {recommendations.length > 0 ? recommendations.map(rec => (
                    <div key={rec.product_id} className="glass-panel recommendation-card">
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3>{rec.name}</h3>
                            <span className="badge red">Critical: {rec.reason}</span>
                        </div>

                        <div className="price-comparison" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="price-block old" style={{ textAlign: 'center' }}>
                                <span className="label text-muted" style={{ display: 'block', fontSize: '0.85rem' }}>Current Price</span>
                                <span className="value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${rec.base_price.toFixed(2)}</span>
                            </div>
                            <ArrowRight className="text-muted" />
                            <div className="price-block new" style={{ textAlign: 'center' }}>
                                <span className="label text-gradient" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold' }}>AI Suggested</span>
                                <span className="value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>${rec.suggested_price.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="insight-box" style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <Zap size={18} color="var(--accent-cyan)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>{rec.impact}</p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <button
                                onClick={() => triggerMarkdown(rec.product_id, rec.suggested_price)}
                                style={{ width: '100%', padding: '0.75rem' }}
                            >
                                Approve Markdown
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
                        <Bot size={64} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <h3>No Active Recommendations</h3>
                        <p className="text-muted">The ML Engine determines all current prices are perfectly optimized for demand.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
