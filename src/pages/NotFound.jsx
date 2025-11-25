import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--text-primary)'
        }}>
            <AlertTriangle size={64} className="text-warning" style={{ marginBottom: '1.5rem' }} />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>404</h1>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Página não encontrada</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
                A página que você está procurando não existe ou foi movida.
            </p>
            <Link to="/" className="btn btn-primary">
                <Home size={18} />
                Voltar para o Dashboard
            </Link>
        </div>
    );
};

export default NotFound;
