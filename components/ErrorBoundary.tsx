
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
  }

  private resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const isDev = import.meta.env.DEV;

      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gov-dark text-center">
          <div className="bg-gov-surface p-10 rounded-2xl shadow-premium border border-gov-border max-w-2xl w-full">
            <h2 className="text-2xl font-black text-white mb-4">Something went wrong</h2>
            <p className="text-gov-text-muted font-medium mb-4">The component failed to load. Please try again.</p>
            
            {isDev && error && (
              <div className="mb-6 text-left bg-gov-dark p-4 rounded-lg border border-red-500/30 overflow-auto max-h-64">
                <p className="text-red-400 font-mono text-sm mb-2">
                  <strong>{error.name}:</strong> {error.message}
                </p>
                {error.stack && (
                  <pre className="text-xs text-gray-400 whitespace-pre-wrap break-words">
                    {error.stack}
                  </pre>
                )}
                {errorInfo?.componentStack && (
                  <details className="mt-2">
                    <summary className="text-yellow-400 cursor-pointer text-xs">Component Stack</summary>
                    <pre className="text-xs text-gray-500 whitespace-pre-wrap mt-1">
                      {errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button 
                onClick={this.resetError}
                className="px-6 py-3 bg-gov-surface text-white rounded-xl font-bold text-xs border border-gov-border hover:bg-gov-hover transition-all"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gov-blue text-white rounded-xl font-bold text-xs shadow-lg hover:bg-gov-blue/80 transition-all"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
