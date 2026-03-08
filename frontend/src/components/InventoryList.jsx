import React, { useState } from 'react';

const InventoryList = ({ inventory, onMarkdown }) => {
    const [customPrices, setCustomPrices] = useState({});

    const handlePriceChange = (id, price) => {
        setCustomPrices({ ...customPrices, [id]: price });
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Base Price</th>
                        <th>Current Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item) => {
                        const isDiscounted = item.current_price < item.base_price;
                        const stockStatus = item.quantity < 50 ? 'red' : 'green';

                        return (
                            <tr key={item.product_id}>
                                <td>
                                    <span style={{ color: 'var(--accent-blue)', fontWeight: 500 }}>
                                        {item.product_id}
                                    </span>
                                </td>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>
                                    <span className={`badge ${stockStatus}`}>
                                        {item.current_quantity} units
                                    </span>
                                </td>
                                <td style={{ color: 'var(--text-muted)' }}>${item.base_price.toFixed(2)}</td>
                                <td>
                                    <span style={{
                                        color: isDiscounted ? 'var(--accent-green)' : 'var(--text-main)',
                                        fontWeight: isDiscounted ? 600 : 400
                                    }}>
                                        ${item.current_price.toFixed(2)}
                                    </span>
                                </td>
                                <td style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', minWidth: '220px' }}>
                                    <input
                                        type="number"
                                        style={{ width: '100px' }}
                                        placeholder="Overwrite"
                                        value={customPrices[item.product_id] || ''}
                                        onChange={(e) => handlePriceChange(item.product_id, e.target.value)}
                                        title="Leave empty for ML suggestion"
                                    />
                                    <button
                                        onClick={() => onMarkdown(
                                            item.product_id,
                                            customPrices[item.product_id] ? parseFloat(customPrices[item.product_id]) : null
                                        )}
                                    >
                                        Markdown
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {inventory.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No inventory found. Ensure backend is running.
                </div>
            )}
        </div>
    );
};

export default InventoryList;
