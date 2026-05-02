import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; message: string }> {
  state = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Erro inesperado na interface.',
    };
  }

  componentDidCatch(error: unknown) {
    console.error('[Lon Suite] Erro crítico de interface:', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f5f5f7', color: '#1d1d1f', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: 420, borderRadius: 24, background: '#fff', padding: 28, boxShadow: '0 24px 80px rgba(0,0,0,0.10)' }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#86868b' }}>Lon Suite</p>
          <h1 style={{ margin: '10px 0 8px', fontSize: 28, fontWeight: 500, letterSpacing: '-0.03em' }}>A interface precisou pausar.</h1>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#6e6e73' }}>
            Seus dados não foram apagados por esta tela. Recarregue a página para tentar novamente.
          </p>
          <p style={{ margin: '14px 0 0', fontSize: 12, lineHeight: 1.5, color: '#aeaeb2', wordBreak: 'break-word' }}>{this.state.message}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: 22, width: '100%', border: 0, borderRadius: 14, background: '#1d1d1f', color: '#fff', padding: '12px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            Recarregar
          </button>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
