import { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { format } from 'date-fns';
import { PlusCircle, Trash2, CheckCircle, XCircle } from 'lucide-react';

const Debts = () => {
    const { debts, addDebt, updateDebt, deleteDebt, persona } = useFinance();
    const [formData, setFormData] = useState({
        name: '',
        totalValue: '',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.totalValue) return;

        addDebt({
            name: formData.name,
            totalValue: Number(formData.totalValue),
            dueDate: new Date(formData.dueDate).toISOString(),
        });

        setFormData({
            name: '',
            totalValue: '',
            dueDate: format(new Date(), 'yyyy-MM-dd'),
        });
    };

    const toggleStatus = (debt) => {
        updateDebt(debt.id, { status: debt.status === 'pending' ? 'paid' : 'pending' });
    };

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Dívidas - {persona === 'personal' ? 'Pessoal' : 'Solyze Growth'}</h1>
            </header>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div className="card-header">
                    <h2 className="card-title">Nova Dívida</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="label">Descrição</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Ex: Empréstimo, Cartão X"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Valor Total (R$)</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="0,00"
                                step="0.01"
                                value={formData.totalValue}
                                onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Vencimento</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-danger" style={{ marginTop: '1rem' }}>
                        <PlusCircle size={18} />
                        Registrar Dívida
                    </button>
                </form>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Gerenciamento de Dívidas</h2>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th>Vencimento</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {debts.length > 0 ? (
                                debts.map((d) => (
                                    <tr key={d.id} style={{ opacity: d.status === 'paid' ? 0.6 : 1 }}>
                                        <td>{d.name}</td>
                                        <td>{format(new Date(d.dueDate), 'dd/MM/yyyy')}</td>
                                        <td style={{ fontWeight: 500 }}>
                                            R$ {Number(d.totalValue).toFixed(2)}
                                        </td>
                                        <td>
                                            <span className={`badge ${d.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                                {d.status === 'paid' ? 'Pago' : 'Pendente'}
                                            </span>
                                        </td>
                                        <td style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn-outline"
                                                style={{ padding: '0.25rem', borderRadius: '4px', color: d.status === 'paid' ? 'var(--text-secondary)' : 'var(--success)', borderColor: 'currentColor' }}
                                                onClick={() => toggleStatus(d)}
                                                title={d.status === 'paid' ? 'Marcar como pendente' : 'Marcar como pago'}
                                            >
                                                {d.status === 'paid' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                                            </button>
                                            <button
                                                className="btn-danger"
                                                style={{ padding: '0.25rem', borderRadius: '4px' }}
                                                onClick={() => deleteDebt(d.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        Nenhuma dívida registrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Debts;
