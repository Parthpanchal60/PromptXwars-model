import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Fault boundary intercepts uncaught component exceptions safely without crashing the root tree
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: 540,
              padding: 32,
              textAlign: 'center',
              border: '1px solid #f43f5e',
            }}
          >
            <AlertOctagon size={48} color="#f43f5e" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>
              Runtime Mutation Anomaly Detected
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 20 }}>
              An unexpected state occurred. The Genome Mentor fault boundary prevented an application crash.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              <RefreshCcw size={16} />
              <span>Re-synthesize Genome</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
