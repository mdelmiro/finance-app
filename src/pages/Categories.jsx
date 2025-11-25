import { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Plus, Trash2 } from 'lucide-react';

const Categories = () => {
    const { categories, addCategory, deleteCategory } = useFinance();
    const [newCategory, setNewCategory] = useState('');
    const [type, setType] = useState('expense');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newCategory) return;

        addCategory({
            name: newCategory,
            type,
        });
        setNewCategory('');
    };

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Categorias</h1>
            </header>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div className="card-header">
                    <h2 className="card-title">Nova Categoria</h2>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label className="label">Nome</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Ex: Marketing, Lazer"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group" style={{ width: '200px', marginBottom: 0 }}>
                        <label className="label">Tipo</label>
                        <select
                            className="select"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="income">Entrada</option>
                            <option value="expense">Saída</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        <Plus size={18} />
                        Adicionar
                    </button>
                </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Categorias de Entrada</h2>
                    </div>
                    <ul style={{ listStyle: 'none' }}>
                        {categories.filter(c => c.type === 'income').map(c => (
                            <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                                <span>{c.name}</span>
                                {!c.isDefault && (
                                    <button
                                        className="btn-danger"
                                        style={{ padding: '0.25rem', borderRadius: '4px' }}
                                        onClick={() => deleteCategory(c.id)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Categorias de Saída</h2>
                    </div>
                    {categories.filter(c => c.type === 'expense').length > 0 ? (
                        <ul style={{ listStyle: 'none' }}>
                            {categories.filter(c => c.type === 'expense').map(c => (
                                <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                                    <span>{c.name}</span>
                                    {!c.isDefault && (
                                        <button
                                            className="btn-danger"
                                            style={{ padding: '0.25rem', borderRadius: '4px' }}
                                            onClick={() => deleteCategory(c.id)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>Nenhuma categoria de saída cadastrada.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categories;
