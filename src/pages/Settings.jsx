import { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { User, Moon, Sun, Zap, Plus, Trash2, Save } from 'lucide-react';

const Settings = () => {
    const { user, theme, setTheme, categories, addCategory, deleteCategory } = useFinance();

    // Profile State
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    // Category State
    const [newCategory, setNewCategory] = useState({ name: '', type: 'expense' });

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        // In a real app, this would call an API
        alert('Perfil atualizado com sucesso! (Simulação)');
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (!newCategory.name) return;

        addCategory({
            name: newCategory.name,
            type: newCategory.type,
            isDefault: false
        });
        setNewCategory({ name: '', type: 'expense' });
    };

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Configurações</h1>
            </header>

            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>

                {/* Profile Section */}
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <User size={20} className="text-accent-primary" />
                            <h2 className="card-title">Perfil</h2>
                        </div>
                    </div>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="form-group">
                            <label className="label">Nome</label>
                            <input
                                type="text"
                                className="input"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Email</label>
                            <input
                                type="email"
                                className="input"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            <Save size={18} />
                            Salvar Alterações
                        </button>
                    </form>
                </div>

                {/* Theme Section */}
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Zap size={20} className="text-accent-secondary" />
                            <h2 className="card-title">Aparência</h2>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <button
                            className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setTheme('light')}
                            style={{ justifyContent: 'flex-start' }}
                        >
                            <Sun size={18} />
                            Modo Claro
                        </button>
                        <button
                            className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setTheme('dark')}
                            style={{ justifyContent: 'flex-start' }}
                        >
                            <Moon size={18} />
                            Modo Escuro
                        </button>
                        <button
                            className={`btn ${theme === 'solyze-neon' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setTheme('solyze-neon')}
                            style={{ justifyContent: 'flex-start', borderColor: theme === 'solyze-neon' ? 'var(--accent-primary)' : '' }}
                        >
                            <Zap size={18} />
                            Solyze Neon
                        </button>
                    </div>
                </div>

                {/* Notifications Section (Placeholder) */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Notificações</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input type="checkbox" defaultChecked />
                            Receber alertas por E-mail
                        </label>
                        <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input type="checkbox" />
                            Receber alertas por WhatsApp (Em breve)
                        </label>
                        <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input type="checkbox" defaultChecked />
                            Notificações Push
                        </label>
                    </div>
                </div>

                {/* Integrations Section (Placeholder) */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Integrações</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="label">Webhook n8n (URL)</label>
                            <input type="text" className="input" placeholder="https://..." disabled />
                            <small className="text-secondary">Disponível na versão Pro</small>
                        </div>
                        <div className="form-group">
                            <label className="label">Google Sheets ID</label>
                            <input type="text" className="input" placeholder="Spreadsheet ID" disabled />
                            <small className="text-secondary">Disponível na versão Pro</small>
                        </div>
                    </div>
                </div>

                {/* Backup Section (Placeholder) */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Backup & Dados</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button className="btn btn-outline" onClick={() => alert('Backup realizado com sucesso! (Simulação)')}>
                            Fazer Backup Manual
                        </button>
                        <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => alert('Dados resetados! (Simulação)')}>
                            Resetar Todos os Dados
                        </button>
                    </div>
                </div>

                {/* Categories Section */}
                <div className="card" style={{ gridColumn: '1 / -1' }}>
                    <div className="card-header">
                        <h2 className="card-title">Gerenciar Categorias</h2>
                    </div>

                    <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="label">Nova Categoria</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Nome da categoria"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group" style={{ width: '150px' }}>
                            <label className="label">Tipo</label>
                            <select
                                className="select"
                                value={newCategory.type}
                                onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                            >
                                <option value="income">Receita</option>
                                <option value="expense">Despesa</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginBottom: '2px' }}>
                            <Plus size={18} />
                            Adicionar
                        </button>
                    </form>

                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Tipo</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(category => (
                                    <tr key={category.id}>
                                        <td>{category.name}</td>
                                        <td>
                                            <span className={`badge ${category.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                                                {category.type === 'income' ? 'Receita' : 'Despesa'}
                                            </span>
                                        </td>
                                        <td>
                                            {!category.isDefault && (
                                                <button
                                                    className="btn-danger"
                                                    style={{ padding: '0.25rem' }}
                                                    onClick={() => deleteCategory(category.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
