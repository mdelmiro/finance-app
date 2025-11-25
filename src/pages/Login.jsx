import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFinance } from '../contexts/FinanceContext';
import { ArrowRight, Command, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useFinance();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Ocorreu um erro ao tentar fazer login.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black text-white font-geist flex flex-col relative overflow-hidden selection:bg-white/20">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,#3e3e3e,transparent)]"></div>

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Command className="w-4 h-4 text-black" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Finance.io</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/register" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">
                        Criar conta
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4 relative z-10">
                <div className="w-full max-w-[400px]">
                    <div className="relative group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-b from-white/20 to-transparent rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                        <div className="relative bg-zinc-950 border border-white/10 rounded-3xl p-8 overflow-hidden">
                            <div className="text-center space-y-2 mb-8">
                                <h1 className="text-2xl font-bold tracking-tight text-white">
                                    Bem-vindo de volta
                                </h1>
                                <p className="text-sm text-zinc-500">
                                    Acesse sua conta para continuar
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-zinc-400 ml-1 mb-1 block">Email</label>
                                        <input
                                            type="email"
                                            placeholder="seu@email.com"
                                            className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-zinc-400 ml-1 mb-1 block">Senha</label>
                                        <input
                                            type="password"
                                            placeholder="Sua senha"
                                            className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-10 bg-white text-black rounded-xl text-sm font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Entrar</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link to="/register" className="text-xs text-zinc-500 hover:text-white transition-colors">
                                    Não tem uma conta? Cadastre-se
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
