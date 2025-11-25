import { useState, useEffect } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { X, Save } from 'lucide-react';
import { format } from 'date-fns';

const EditTransactionModal = ({ transaction, isOpen, onClose }) => {
    const { updateTransaction, categories } = useFinance();
    const [formData, setFormData] = useState({
        description: '',
        value: '',
        category: '',
        date: '',
        tags: '',
        responsible: 'me',
        notes: '',
        type: 'income'
    });

    useEffect(() => {
        if (transaction) {
            setFormData({
                description: transaction.description,
                value: transaction.value,
                category: transaction.category,
                date: transaction.createdAt ? format(new Date(transaction.createdAt), 'yyyy-MM-dd') : '',
                tags: Array.isArray(transaction.tags) ? transaction.tags.join(', ') : '',
                responsible: transaction.responsible || 'me',
                notes: transaction.notes || '',
                type: transaction.type
            });
        }
    }, [transaction]);

    if (!isOpen || !transaction) return null;

    const relevantCategories = categories.filter(c => c.type === formData.type);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

        const updatedData = {
            ...transaction,
            description: formData.description,
            value: Number(formData.value),
            category: formData.category,
            date: new Date(formData.date).toISOString(),
            tags: tagsArray,
            responsible: formData.responsible,
            notes: formData.notes
        };

        const result = await updateTransaction(transaction.id, updatedData);

        if (result.success) {
            alert('Transação atualizada com sucesso!');
            onClose();
        } else {
            alert(result.message || 'Erro ao atualizar transação.');
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div className="modal-content" style={{
                backgroundColor: 'var(--bg-card)',
                padding: '2rem',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                border: '1px solid var(--border-color)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Editar Transação</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="label">Descrição</label>
                            <input
                                type="text"
                                className="input"
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
                                step="0.01"
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
                                {relevantCategories.map(c => (
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

                        <div className="form-group">
                            <label className="label">Etiquetas (Tags)</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">Observações</label>
                            <textarea
                                className="input"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows="3"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            <Save size={18} />
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTransactionModal;
