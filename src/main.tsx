import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("PayShieldX UI Uncaught Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#090d16',
          color: '#f8fafc',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '520px',
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '42px', marginBottom: '16px' }}>🛡️</div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 10px 0', color: '#fff' }}>
              PayShieldX Protected Session
            </h1>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 20px 0' }}>
              A temporary display exception occurred. Your escrow funds, contracts, and authentication states remain 100% secure.
            </p>

            {this.state.error && (
              <div style={{
                marginBottom: '20px',
                padding: '12px 14px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#f87171',
                fontSize: '11px',
                fontFamily: 'monospace',
                textAlign: 'left',
                maxHeight: '140px',
                overflowY: 'auto',
                wordBreak: 'break-all'
              }}>
                <strong>Exception details:</strong>
                <pre style={{ margin: '6px 0 0 0', whiteSpace: 'pre-wrap' }}>
                  {this.state.error.message || String(this.state.error)}
                </pre>
              </div>
            )}

            <button
              onClick={() => {
                window.location.reload();
              }}
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)'
              }}
            >
              Reload & Recover Session
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Non-blocking background keep-alive ping to wake up Render backend early
try {
  const backendHealth = import.meta.env.VITE_API_BASE_URL 
    ? `${import.meta.env.VITE_API_BASE_URL}/health` 
    : "https://tradeshield-backend-q97r.onrender.com/api/v1/health";
  fetch(backendHealth, { method: "GET" }).catch(() => {});
} catch {
  // Silent catch
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
