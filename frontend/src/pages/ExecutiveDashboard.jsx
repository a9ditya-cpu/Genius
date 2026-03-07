import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

export default function ExecutiveDashboard() {
    const { inventory, triggerMarkdown } = useOutletContext();

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Executive Overview</h2>
            <Dashboard inventory={inventory} onMarkdown={triggerMarkdown} />
        </div>
    );
}
