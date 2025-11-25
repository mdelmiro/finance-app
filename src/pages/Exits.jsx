import { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { format } from 'date-fns';
import { MinusCircle, Trash2 } from 'lucide-react';

const Exits = () => {
    const { transactions, addTransaction, deleteTransaction, categories, persona } = useFinance();
    const [formData, setFormData] = useState({
        description: '',
        value: '',
        category: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        tags: '',
        responsible: 'me',
        isInstallment: false,
        installmentsCount: '',
        notes: '',
    });

    const expenseCategories = categories.filter(c => c.type === 'expense');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

        const transaction = {
            description: formData.description,
            value: Number(formData.value),
            type: 'expense',
            category: formData.category,
            date: new Date(formData.date).toISOString(),
            tags: tagsArray,
            responsible: formData.responsible,
            notes: formData.notes,
            installments: formData.isInstallment ? {
                current: 1,
                total: Number(formData.installmentsCount),
                groupId: null // Will be generated in context
            } : null
        };

        const result = await addTransaction(transaction);

        if (result.success) {
            setFormData({
                description: '',
                value: '',
                category: categories.filter(c => c.type === 'expense')[0]?.name || '',
                date: new Date().toISOString().split('T')[0],
                tags: '',
                responsible: 'Eu (Padrão)',
                isInstallment: false,
                installmentsCount: 2,
                notes: ''
            });
            alert('Saída adicionada com sucesso!');
        } else {
            alert(result.message || 'Erro ao adicionar saída.');
        }
    };

    const expenseTransactions = transactions.filter(t => t.type === 'expense');

    const handleExport = () => {
        const headers = ['Descrição', 'Valor', 'Categoria', 'Data', 'Observações'];
        const csvContent = [
            headers.join(','),
            ...expenseTransactions.map(t => [
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
        link.download = `saidas_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        link.click();
    };

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Saídas - {persona === 'personal' ? 'Pessoal' : 'Solyze Growth'}</h1>
                <button className="btn btn-outline" onClick={handleExport}>Exportar CSV</button>
            </header>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div className="card-header">
                    <h2 className="card-title">Nova Saída</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="label">Descrição</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Ex: Aluguel, Servidor"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                {expenseCategories.map(c => (
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
                                placeholder="Ex: projeto-x, urgente (separar por vírgula)"
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

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={formData.isInstallment}
                                onChange={(e) => setFormData({ ...formData, isInstallment: e.target.checked })}
                            />
                            Compra Parcelada?
                        </label>
                        {formData.isInstallment && (
                            <input
                                type="number"
                                className="input"
                                placeholder="Nº de parcelas"
                                min="2"
                                max="48"
                                style={{ marginTop: '0.5rem' }}
                                value={formData.installmentsCount}
                                onChange={(e) => setFormData({ ...formData, installmentsCount: e.target.value })}
                            />
                        )}
                    </div>

                    <button type="submit" className="btn btn-danger" style={{ marginTop: '1rem' }}>
                        <MinusCircle size={18} />
                        Adicionar Saída
                    </button>
                </form>
            </div >

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Histórico de Saídas</h2>
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
                            {expenseTransactions.length > 0 ? (
                                expenseTransactions.map((t) => (
                                    <tr key={t.id}>
                                        <td>{t.description}</td>
                                        <td><span className="badge badge-danger">{t.category}</span></td>
                                        <td>{format(new Date(t.createdAt), 'dd/MM/yyyy')}</td>
                                        <td className="text-danger" style={{ fontWeight: 500 }}>
                                            - R$ {Number(t.value).toFixed(2)}
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
                                        Nenhuma saída registrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default Exits;
