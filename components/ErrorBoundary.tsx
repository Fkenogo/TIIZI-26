import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to Firebase Analytics if available
    try {
      const analytics = (window as any).firebase?.analytics?.();
      if (analytics) {
        analytics.logEvent('app_error', {
          error_message: error.message,
          error_stack: error.stack,
          component_stack: errorInfo.componentStack
        });
      }
    } catch (e) {
      // Ignore analytics errors
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4">
              <span className="material-icons-round text-3xl text-red-600 dark:text-red-400">error</span>
            </div>
            
            <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
              Something went wrong
            </h1>
            
            <p className="text-slate-600 dark:text-slate-300 text-center mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <summary className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                  Error Details (Development)
                </summary>
                <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap font-mono">
                  <div className="mb-2">
                    <strong>Message:</strong> {this.state.error.message}
                  </div>
                  <div className="mb-2">
                    <strong>Stack:</strong> {this.state.error.stack}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong> {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-primary hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Try Again
              </button>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-4">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
