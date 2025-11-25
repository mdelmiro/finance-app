import { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { format } from 'date-fns';
import { PlusCircle, Trash2, Calendar } from 'lucide-react';

const Subscriptions = () => {
    const { subscriptions, addSubscription, deleteSubscription, persona } = useFinance();
    const [formData, setFormData] = useState({
        name: '',
        value: '',
        billingCycle: 'monthly',
        nextBillingDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.value) return;

        addSubscription({
            name: formData.name,
            value: Number(formData.value),
            billingCycle: formData.billingCycle,
            nextBillingDate: new Date(formData.nextBillingDate).toISOString(),
        });

        setFormData({
            name: '',
            value: '',
            billingCycle: 'monthly',
            nextBillingDate: format(new Date(), 'yyyy-MM-dd'),
        });
    };

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Assinaturas - {persona === 'personal' ? 'Pessoal' : 'Solyze Growth'}</h1>
            </header>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div className="card-header">
                    <h2 className="card-title">Nova Assinatura</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="label">Serviço</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Ex: Netflix, Spotify, Adobe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Valor (R$)</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="0,00"
                                step="0.01"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Ciclo</label>
                            <select
                                className="select"
                                value={formData.billingCycle}
                                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                            >
                                <option value="monthly">Mensal</option>
                                <option value="yearly">Anual</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="label">Próxima Cobrança</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.nextBillingDate}
                                onChange={(e) => setFormData({ ...formData, nextBillingDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        <PlusCircle size={18} />
                        Adicionar Assinatura
                    </button>
                </form>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Assinaturas Ativas</h2>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Serviço</th>
                                <th>Ciclo</th>
                                <th>Próx. Cobrança</th>
                                <th>Valor</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.length > 0 ? (
                                subscriptions.map((s) => (
                                    <tr key={s.id}>
                                        <td>{s.name}</td>
                                        <td>
                                            <span className="badge badge-warning">
                                                {s.billingCycle === 'monthly' ? 'Mensal' : 'Anual'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Calendar size={14} className="text-secondary" />
                                                {format(new Date(s.nextBillingDate), 'dd/MM/yyyy')}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 500 }}>
                                            R$ {Number(s.value).toFixed(2)}
                                        </td>
                                        <td>
                                            <button
                                                className="btn-danger"
                                                style={{ padding: '0.25rem', borderRadius: '4px' }}
                                                onClick={() => deleteSubscription(s.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        Nenhuma assinatura registrada.
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

export default Subscriptions;
