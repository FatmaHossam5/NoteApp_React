import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="container my-5">
          <div className="row">
            <div className="col-12">
              <div className="page-header">
                <div className="text-center py-5">
                  <i className="fas fa-exclamation-triangle text-warning mb-3" style={{fontSize: '3rem'}}></i>
                  <h3 className="text-white mb-3">Something went wrong</h3>
                  <p className="text-white-50 mb-4">
                    We're sorry, but something unexpected happened. Please try refreshing the page.
                  </p>
                  <div className="d-flex gap-3 justify-content-center">
                    <button 
                      className="btn btn-primary modern-add-btn"
                      onClick={() => window.location.reload()}
                    >
                      <i className="fas fa-refresh me-2"></i>
                      Refresh Page
                    </button>
                    <button 
                      className="btn btn-secondary modern-btn-secondary"
                      onClick={() => window.location.href = '/login'}
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Go to Login
                    </button>
                  </div>
                  
                  {/* Show error details in development */}
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details className="mt-4 text-start">
                      <summary className="text-white-50 cursor-pointer">Error Details (Development)</summary>
                      <pre className="text-white-50 mt-2 p-3 bg-dark rounded" style={{fontSize: '0.8rem'}}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
