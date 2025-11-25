import { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { format, subMonths, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CreditCard, Wallet, TrendingUp, Edit2 } from 'lucide-react';

import AlertsCenter from '../components/AlertsCenter';
import EditTransactionModal from '../components/EditTransactionModal';
import SummaryCards from '../components/SummaryCards';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import FinancialBarChart from '../components/charts/FinancialBarChart';

const Dashboard = () => {
    const { getBalance, transactions, accounts, persona, getProjections } = useFinance();
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

    const filteredSavings = filteredIncome - filteredExpense;

    // Prepare data for Pie Chart (Expenses by Category)
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

    // Prepare data for Bar Chart (Last 6 Months)
    const getLast6MonthsData = () => {
        const data = [];
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            const monthName = format(date, 'MMM', { locale: ptBR });

            // Filter transactions for this specific month (ignoring the global date filter for this chart)
            const monthTransactions = transactions.filter(t =>
                isSameMonth(new Date(t.createdAt), date) &&
                (persona === 'all' || t.persona === persona)
            );

            const receita = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((acc, t) => acc + Number(t.value), 0);

            const despesa = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((acc, t) => acc + Number(t.value), 0);

            data.push({
                name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                receita,
                despesa
            });
        }
        return data;
    };

    const barData = getLast6MonthsData();

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

            {/* New Summary Cards */}
            <SummaryCards
                balance={getBalance()}
                income={filteredIncome}
                expense={filteredExpense}
                savings={filteredSavings}
            />

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Despesas por Categoria</h2>
                    </div>
                    <CategoryPieChart data={pieData} />
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Histórico (6 Meses)</h2>
                    </div>
                    <FinancialBarChart data={barData} />
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
