import { Link, useLocation } from 'react-router-dom';
import { useFinance } from '../contexts/FinanceContext';
import {
    LayoutDashboard,
    ArrowUpCircle,
    ArrowDownCircle,
    Tags,
    Wallet,
    Briefcase,
    User,
    CreditCard,
    Calendar,
    AlertCircle,
    Target,
    Sun,
    Moon,
    LogOut,
    Users,
    Settings,
    FileText
} from 'lucide-react';

const MainLayout = ({ children }) => {
    const { persona, switchPersona, logout } = useFinance();
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/entries', label: 'Entradas', icon: ArrowUpCircle },
        { path: '/exits', label: 'Saídas', icon: ArrowDownCircle },
        { path: '/categories', label: 'Categorias', icon: Tags },
        { path: '/debts', label: 'Dívidas', icon: AlertCircle },
        { path: '/subscriptions', label: 'Assinaturas', icon: Calendar },
        { path: '/accounts', label: 'Contas', icon: CreditCard },
        { path: '/goals', label: 'Metas', icon: Target },
        { path: '/reports', label: 'Relatórios', icon: FileText },
        { path: '/settings', label: 'Configurações', icon: Settings },
    ];

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <Wallet size={24} className="text-accent-primary" />
                        <span>Financeiro</span>
                    </div>
                </div>

                <nav className="nav-menu">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-item ${isActive ? 'active' : ''} `}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="persona-switcher">
                    <div className="label" style={{ paddingLeft: '1rem' }}>Área Atual</div>
                    <button
                        className={`nav-item ${persona === 'personal' ? 'active' : ''} `}
                        onClick={() => switchPersona('personal')}
                        style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                        <User size={20} />
                        <span>Pessoal</span>
                    </button>
                    <button
                        className={`nav-item ${persona === 'solyze' ? 'active' : ''} `}
                        onClick={() => switchPersona('solyze')}
                        style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                        <Briefcase size={20} />
                        <span>Solyze Growth</span>
                    </button>
                    <button
                        className={`nav-item ${persona === 'all' ? 'active' : ''} `}
                        onClick={() => switchPersona('all')}
                        style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                        <Users size={20} />
                        <span>Ambas</span>
                    </button>
                </div>

                <div className="logout-section" style={{ marginTop: 'auto', padding: '1rem' }}>
                    <button
                        className="nav-item"
                        onClick={logout}
                        style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--danger)' }}
                    >
                        <LogOut size={20} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
