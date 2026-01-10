
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50 text-center">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-slate-100 max-w-lg">
            <h2 className="text-2xl font-black text-slate-900 mb-4">Something went wrong</h2>
            <p className="text-slate-500 font-medium mb-8">The component failed to load securely. Please try refreshing the page or contact system administration.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
