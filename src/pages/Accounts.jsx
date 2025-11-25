import { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { PlusCircle, Trash2, CreditCard, Landmark, Wallet } from 'lucide-react';

const Accounts = () => {
    const { accounts, addAccount, deleteAccount } = useFinance();
    const [formData, setFormData] = useState({
        name: '',
        type: 'checking',
        balance: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) return;

        addAccount({
            name: formData.name,
            type: formData.type,
            balance: Number(formData.balance || 0),
        });

        setFormData({
            name: '',
            type: 'checking',
            balance: '',
        });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'checking': return <Landmark size={20} className="text-accent-primary" />;
            case 'credit': return <CreditCard size={20} className="text-warning" />;
            case 'cash': return <Wallet size={20} className="text-success" />;
            default: return <Landmark size={20} />;
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'checking': return 'Conta Corrente';
            case 'credit': return 'Cartão de Crédito';
            case 'cash': return 'Dinheiro';
            default: return type;
        }
    };

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Contas e Cartões</h1>
            </header>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div className="card-header">
                    <h2 className="card-title">Nova Conta / Cartão</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="label">Nome da Instituição</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Ex: Nubank, Itaú"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Tipo</label>
                            <select
                                className="select"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="checking">Conta Corrente</option>
                                <option value="credit">Cartão de Crédito</option>
                                <option value="cash">Dinheiro / Outro</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="label">Saldo Inicial / Limite (R$)</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="0,00"
                                step="0.01"
                                value={formData.balance}
                                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        <PlusCircle size={18} />
                        Adicionar
                    </button>
                </form>
            </div>

            <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {accounts.length > 0 ? (
                    accounts.map((account) => (
                        <div key={account.id} className="card">
                            <div className="card-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {getIcon(account.type)}
                                    <span className="card-title">{account.name}</span>
                                </div>
                                {!account.isDefault && (
                                    <button
                                        className="btn-danger"
                                        style={{ padding: '0.25rem', borderRadius: '4px' }}
                                        onClick={() => deleteAccount(account.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <span className="badge" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
                                    {getTypeLabel(account.type)}
                                </span>
                            </div>
                            <div className="card-value">
                                R$ {Number(account.balance).toFixed(2)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>Nenhuma conta cadastrada.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Accounts;
