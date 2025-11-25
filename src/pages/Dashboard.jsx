import { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUp, ArrowDown, DollarSign, CreditCard, Wallet, TrendingUp, Edit2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

import AlertsCenter from '../components/AlertsCenter';
import EditTransactionModal from '../components/EditTransactionModal';

const Dashboard = () => {
    const { getBalance, getIncome, getExpense, transactions, accounts, persona, getProjections } = useFinance();
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Date Filter State
    const [startDate, setStartDate] = useState(format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd'));

    const projections = getProjections();

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Filter Transactions
    const filteredTransactions = transactions.filter(t => {
        const tDate = new Date(t.createdAt).toISOString().split('T')[0];
        return tDate >= startDate && tDate <= endDate;
    });

    const recentTransactions = filteredTransactions.slice(0, 5);

    // Calculate Totals based on Filter
    const filteredIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + Number(t.value), 0);

    const filteredExpense = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + Number(t.value), 0);

    // Prepare data for charts
    const expenseCategories = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + Number(t.value);
            return acc;
        }, {});

    const pieData = Object.keys(expenseCategories).map(key => ({
        name: key,
        value: expenseCategories[key]
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    const barData = [
        { name: 'Entradas', valor: filteredIncome },
        { name: 'Saídas', valor: filteredExpense },
    ];

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsEditModalOpen(true);
    };

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Dashboard - {persona === 'personal' ? 'Pessoal' : 'Solyze Growth'}</h1>
                <div className="date-display text-secondary">
                    {format(new Date(), "d 'de' MMMM, yyyy", { locale: ptBR })}
                </div>
            </header>

            <AlertsCenter />

            {/* Date Filter Bar */}
            <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Período:</span>
                    <input
                        type="date"
                        className="input"
                        style={{ width: 'auto' }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span style={{ color: 'var(--text-secondary)' }}>até</span>
                    <input
                        type="date"
                        className="input"
                        style={{ width: 'auto' }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Mostrando {filteredTransactions.length} transações
                </div>
            </div>

            <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Saldo Total (Atual)</span>
                        <DollarSign className="text-accent-primary" />
                    </div>
                    <div className="card-value" style={{ color: getBalance() >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {formatCurrency(getBalance())}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Entradas (Período)</span>
                        <ArrowUp className="text-success" />
                    </div>
                    <div className="card-value text-success">
                        {formatCurrency(filteredIncome)}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Saídas (Período)</span>
                        <ArrowDown className="text-danger" />
                    </div>
                    <div className="card-value text-danger">
                        {formatCurrency(filteredExpense)}
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div className="card-header">
                    <h2 className="card-title">Projeção de Caixa (Estimativa)</h2>
                    <TrendingUp className="text-accent-secondary" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <div className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Em 30 dias</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: projections.days30 >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {formatCurrency(projections.days30)}
                        </div>
                    </div>
                    <div>
                        <div className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Em 60 dias</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: projections.days60 >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {formatCurrency(projections.days60)}
                        </div>
                    </div>
                    <div>
                        <div className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Em 90 dias</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: projections.days90 >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {formatCurrency(projections.days90)}
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    * Baseado na média de entradas dos últimos 30 dias e despesas recorrentes (assinaturas).
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Despesas por Categoria</h2>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Entradas vs Saídas</h2>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                <YAxis stroke="var(--text-secondary)" />
                                <Tooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="valor" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div className="card-header">
                    <h2 className="card-title">Resumo de Contas</h2>
                </div>
                <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {accounts.map(acc => (
                        <div key={acc.id} style={{ minWidth: '200px', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                {acc.type === 'credit' ? <CreditCard size={16} /> : <Wallet size={16} />}
                                <span style={{ fontWeight: 500 }}>{acc.name}</span>
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                {formatCurrency(acc.balance)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Últimas Movimentações</h2>
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
                            {recentTransactions.length > 0 ? (
                                recentTransactions.map((t) => (
                                    <tr key={t.id}>
                                        <td>
                                            {t.description}
                                            {t.installments && (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                                                    ({t.installments.current}/{t.installments.total})
                                                </span>
                                            )}
                                            {t.notes && (
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                                    {t.notes}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge badge-${t.type === 'income' ? 'success' : 'warning'}`}>{t.category}</span>
                                        </td>
                                        <td>{format(new Date(t.createdAt), 'dd/MM/yyyy')}</td>
                                        <td style={{ color: t.type === 'income' ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>
                                            {t.type === 'income' ? '+' : '-'} {formatCurrency(t.value)}
                                        </td>
                                        <td>
                                            <button
                                                className="btn-outline"
                                                style={{ padding: '0.25rem', borderRadius: '4px' }}
                                                onClick={() => handleEdit(t)}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        Nenhuma movimentação registrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <EditTransactionModal
                transaction={editingTransaction}
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingTransaction(null);
                }}
            />
        </div>
    );
};

export default Dashboard;
