import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

const SummaryCards = ({ balance, income, expense, savings }) => {
    return (
        <div className="grid-cards" style={{ marginBottom: '2rem' }}>
            {/* Saldo Total */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Saldo Total</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: balance >= 0 ? 'var(--text-primary)' : 'var(--danger)' }}>
                            R$ {balance.toFixed(2)}
                        </h2>
                    </div>
                    <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)' }}>
                        <Wallet size={24} />
                    </div>
                </div>
            </div>

            {/* Receita Mensal */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Receita (Mês)</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--success)' }}>
                            R$ {income.toFixed(2)}
                        </h2>
                    </div>
                    <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                        <TrendingUp size={24} />
                    </div>
                </div>
            </div>

            {/* Despesa Mensal */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Despesa (Mês)</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--danger)' }}>
                            R$ {expense.toFixed(2)}
                        </h2>
                    </div>
                    <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                        <TrendingDown size={24} />
                    </div>
                </div>
            </div>

            {/* Economia */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Economia (Mês)</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: savings >= 0 ? 'var(--text-primary)' : 'var(--danger)' }}>
                            R$ {savings.toFixed(2)}
                        </h2>
                    </div>
                    <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
                        <PiggyBank size={24} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;
