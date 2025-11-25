import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFinance } from '../contexts/FinanceContext';
import { Wallet, User, Mail, Lock } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useFinance();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        const result = await register(name, email, password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon">
                        <Wallet size={32} />
                    </div>
                    <h2 className="auth-title">Crie sua conta</h2>
                    <p className="auth-subtitle">Comece a controlar seu futuro financeiro</p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="label">Nome Completo</label>
                        <div className="input-wrapper">
                            <User size={20} className="input-icon" />
                            <input
                                type="text"
                                className="input with-icon"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Seu nome"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label">Email</label>
                        <div className="input-wrapper">
                            <Mail size={20} className="input-icon" />
                            <input
                                type="email"
                                className="input with-icon"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label">Senha</label>
                        <div className="input-wrapper">
                            <Lock size={20} className="input-icon" />
                            <input
                                type="password"
                                className="input with-icon"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label">Confirmar Senha</label>
                        <div className="input-wrapper">
                            <Lock size={20} className="input-icon" />
                            <input
                                type="password"
                                className="input with-icon"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full">
                        Criar Conta
                    </button>
                </form>

                <div className="auth-footer">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="link-primary">
                        Faça login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
