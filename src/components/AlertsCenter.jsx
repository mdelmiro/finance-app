import { useFinance } from '../contexts/FinanceContext';
import { Bell, AlertTriangle, Info } from 'lucide-react';

const AlertsCenter = () => {
    const { getAlerts } = useFinance();
    const alerts = getAlerts();

    if (alerts.length === 0) return null;

    return (
        <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--warning)' }}>
            <div className="card-header" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Bell size={20} className="text-warning" />
                    <h2 className="card-title" style={{ fontSize: '1rem' }}>Notificações Importantes</h2>
                </div>
                <span className="badge badge-warning">{alerts.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        style={{
                            padding: '0.75rem',
                            backgroundColor: 'var(--bg-primary)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontSize: '0.875rem'
                        }}
                    >
                        {alert.type === 'danger' ? (
                            <AlertTriangle size={16} className="text-danger" />
                        ) : (
                            <Info size={16} className="text-accent-primary" />
                        )}
                        <span style={{ color: alert.type === 'danger' ? 'var(--danger)' : 'var(--text-primary)' }}>
                            {alert.message}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlertsCenter;
