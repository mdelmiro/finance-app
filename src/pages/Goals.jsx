import { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { format } from 'date-fns';
import { PlusCircle, Trash2, Target } from 'lucide-react';

const Goals = () => {
    const { goals, addGoal, updateGoal, deleteGoal, persona } = useFinance();
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.targetAmount) return;

        addGoal({
            name: formData.name,
            targetAmount: Number(formData.targetAmount),
            currentAmount: Number(formData.currentAmount || 0),
            deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        });

        setFormData({
            name: '',
            targetAmount: '',
            currentAmount: '',
            deadline: '',
        });
    };

    const handleUpdateProgress = (id, currentAmount) => {
        const amount = prompt('Novo valor atual:', currentAmount);
        if (amount !== null) {
            updateGoal(id, { currentAmount: Number(amount) });
        }
    };

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Metas Financeiras - {persona === 'personal' ? 'Pessoal' : 'Solyze Growth'}</h1>
            </header>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div className="card-header">
                    <h2 className="card-title">Nova Meta</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="label">Nome da Meta</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Ex: Reserva de Emergência, Carro Novo"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Valor Alvo (R$)</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="0,00"
                                step="0.01"
                                min="0"
                                value={formData.targetAmount}
                                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Valor Atual (R$)</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="0,00"
                                step="0.01"
                                min="0"
                                value={formData.currentAmount}
                                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Prazo (Opcional)</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        <PlusCircle size={18} />
                        Criar Meta
                    </button>
                </form>
            </div>

            <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {goals.map((g) => {
                    const progress = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
                    return (
                        <div key={g.id} className="card">
                            <div className="card-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Target size={20} className="text-accent-secondary" />
                                    <span className="card-title">{g.name}</span>
                                </div>
                                <button
                                    className="btn-danger"
                                    style={{ padding: '0.25rem', borderRadius: '4px' }}
                                    onClick={() => deleteGoal(g.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                    <span className="text-secondary">Progresso</span>
                                    <span style={{ fontWeight: 600 }}>{progress.toFixed(1)}%</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                    <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--accent-secondary)', transition: 'width 0.5s ease' }}></div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Atual</div>
                                    <div
                                        style={{ fontSize: '1.25rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
                                        onClick={() => handleUpdateProgress(g.id, g.currentAmount)}
                                        title="Clique para atualizar"
                                    >
                                        R$ {Number(g.currentAmount).toFixed(2)}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Alvo</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                                        R$ {Number(g.targetAmount).toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            {g.deadline && (
                                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                    Prazo: {format(new Date(g.deadline), 'dd/MM/yyyy')}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Goals;
