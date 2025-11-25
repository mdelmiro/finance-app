import { useFinance } from '../contexts/FinanceContext';
import { downloadCSV } from '../utils/exportUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, TrendingUp } from 'lucide-react';

const Reports = () => {
    const { transactions, getProjections, persona } = useFinance();

    const projections = getProjections();
    const chartData = [
        { name: '30 Dias', valor: projections.days30 },
        { name: '60 Dias', valor: projections.days60 },
        { name: '90 Dias', valor: projections.days90 },
    ];

    const handleExport = () => {
        const dataToExport = transactions.map(t => ({
            Data: new Date(t.createdAt).toLocaleDateString(),
            Descrição: t.description,
            Valor: t.value,
            Tipo: t.type === 'income' ? 'Entrada' : 'Saída',
            Categoria: t.category,
            Conta: t.account,
            Status: t.status === 'paid' ? 'Pago' : 'Pendente',
            Área: t.persona === 'personal' ? 'Pessoal' : 'Solyze Growth'
        }));

        downloadCSV(dataToExport, `financeiro_${persona}_${new Date().toISOString().split('T')[0]}.csv`);
    };

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Relatórios e Inteligência</h1>
            </header>

            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>

                {/* Projections Chart */}
                <div className="card" style={{ gridColumn: '1 / -1' }}>
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <TrendingUp size={20} className="text-accent-primary" />
                            <h2 className="card-title">Projeção de Fluxo de Caixa</h2>
                        </div>
                    </div>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                <YAxis stroke="var(--text-secondary)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                                    itemStyle={{ color: 'var(--text-primary)' }}
                                />
                                <Legend />
                                <Bar dataKey="valor" name="Saldo Projetado (R$)" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        * Projeção baseada no saldo atual + média de receitas dos últimos 30 dias - despesas recorrentes (assinaturas).
                    </div>
                </div>

                {/* Export Section */}
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <FileText size={20} className="text-accent-secondary" />
                            <h2 className="card-title">Exportar Dados</h2>
                        </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Baixe um arquivo CSV contendo todas as suas transações para análise externa ou backup.
                    </p>
                    <button className="btn btn-primary" onClick={handleExport}>
                        <Download size={18} />
                        Exportar Transações (CSV)
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Reports;
