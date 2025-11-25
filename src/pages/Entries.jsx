import { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { format } from 'date-fns';
import { PlusCircle, Trash2 } from 'lucide-react';

const Entries = () => {
    const { transactions, addTransaction, deleteTransaction, categories, persona } = useFinance();
    const [formData, setFormData] = useState({
        description: '',
        value: '',
        category: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        tags: '',
        responsible: 'me',
        notes: '',
    });

    const incomeCategories = categories.filter(c => c.type === 'income');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

        const transaction = {
            description: formData.description,
            value: Number(formData.value),
            type: 'income',
            category: formData.category,
            createdAt: new Date(formData.date).toISOString(),
            tags: tagsArray,
            responsible: formData.responsible,
            notes: formData.notes
        };

        const result = await addTransaction(transaction);

        if (result.success) {
            setFormData({
                description: '',
                value: '',
                category: categories.filter(c => c.type === 'income')[0]?.name || '',
                date: new Date().toISOString().split('T')[0],
                tags: '',
                responsible: 'me',
                notes: ''
            });
            alert('Entrada adicionada com sucesso!');
        } else {
            alert(result.message || 'Erro ao adicionar entrada.');
        }
    };

    const incomeTransactions = transactions.filter(t => t.type === 'income');

    const handleExport = () => {
        const headers = ['Descrição', 'Valor', 'Categoria', 'Data', 'Observações'];
        const csvContent = [
            headers.join(','),
            ...incomeTransactions.map(t => [
                `"${t.description}"`,
                t.value,
                `"${t.category}"`,
                format(new Date(t.createdAt), 'yyyy-MM-dd'),
                `"${t.notes || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `entradas_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        link.click();
    };

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Entradas - {persona === 'personal' ? 'Pessoal' : 'Solyze Growth'}</h1>
                <button className="btn btn-outline" onClick={handleExport}>Exportar CSV</button>
            </header>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div className="card-header">
                    <h2 className="card-title">Nova Entrada</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="label">Descrição</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Ex: Salário, Projeto X"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                min="0"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Categoria</label>
                            <select
                                className="select"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="">Selecione...</option>
                                {incomeCategories.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="label">Data</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>

                        {/* New Fields */}
                        <div className="form-group">
                            <label className="label">Etiquetas (Tags)</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Ex: bônus, recorrente"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Responsável</label>
                            <select
                                className="select"
                                value={formData.responsible}
                                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                            >
                                <option value="me">Eu (Padrão)</option>
                                <option value="partner">Sócio / Outro</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="label">Observações</label>
                            <textarea
                                className="input"
                                placeholder="Detalhes adicionais, local, motivo..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows="3"
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        <PlusCircle size={18} />
                        Adicionar Entrada
                    </button>
                </form>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Histórico de Entradas</h2>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th>Categoria</th>
                                <th>Data</th>
                                <th>Valor</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomeTransactions.length > 0 ? (
                                incomeTransactions.map((t) => (
                                    <tr key={t.id}>
                                        <td>{t.description}</td>
                                        <td><span className="badge badge-success">{t.category}</span></td>
                                        <td>{format(new Date(t.createdAt), 'dd/MM/yyyy')}</td>
                                        <td className="text-success" style={{ fontWeight: 500 }}>
                                            + R$ {Number(t.value).toFixed(2)}
                                        </td>
                                        <td>
                                            <button
                                                className="btn-danger"
                                                style={{ padding: '0.25rem', borderRadius: '4px' }}
                                                onClick={() => deleteTransaction(t.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        Nenhuma entrada registrada.
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

export default Entries;
