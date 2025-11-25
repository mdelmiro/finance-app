import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { FinanceProvider } from './contexts/FinanceContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);

    // Auto-fix for "The string did not match the expected pattern" (corrupted localStorage)
    if (error.message && error.message.includes("The string did not match the expected pattern")) {
      console.warn("Detected corrupted localStorage. Clearing and reloading...");
      localStorage.clear();
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          color: '#ef4444',
          backgroundColor: '#18181b',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Algo deu errado.</h1>
          <p style={{ color: '#a1a1aa', marginBottom: '24px' }}>
            {this.state.error && this.state.error.toString()}
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              backgroundColor: '#fff',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Limpar Dados e Recarregar
          </button>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '32px', color: '#52525b', fontSize: '12px' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <FinanceProvider>
        <App />
      </FinanceProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
