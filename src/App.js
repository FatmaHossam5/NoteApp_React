import {Routes,Route,Navigate,useNavigate} from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import Home from './Components/Home'
import Register from './Components/Register';
import Login from './Components/Login';
import ErrorBoundary from './Components/ErrorBoundary';

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  
  // Check if token exists and is not expired
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // If token is expired, remove it and redirect to login
      if (decoded.exp && decoded.exp < currentTime) {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
      }
      
      return children;
    } catch (error) {
      // If token is invalid, remove it and redirect to login
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  }
  
  return <Navigate to="/login" replace />;
}

// Public Route Component (redirect to home if already logged in)
function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // If token is valid and not expired, redirect to home
      if (decoded.exp && decoded.exp > currentTime) {
        return <Navigate to="/home" replace />;
      } else {
        // If token is expired, remove it and show the public route
        localStorage.removeItem("token");
      }
    } catch (error) {
      // If token is invalid, remove it and show the public route
      localStorage.removeItem("token");
    }
  }
  
  return children;
}

// 404 Not Found Page Component
function NotFoundPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <div className="text-center py-5">
            <i className="fas fa-exclamation-triangle text-warning mb-3" style={{fontSize: '3rem'}}></i>
            <h1 className="text-white mb-3">404 - Page Not Found</h1>
            <p className="text-white-50 mb-4">The page you're looking for doesn't exist.</p>
            <div className="d-flex gap-3 justify-content-center">
              <button 
                className="btn btn-primary"
                onClick={() => navigate(token ? '/home' : '/login')}
              >
                <i className="fas fa-home me-2"></i>
                {token ? 'Go Home' : 'Go to Login'}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Navbar/>
      <Routes>
        {/* Root route redirects to home if logged in, otherwise to login */}
        <Route path='/' element={<Navigate to="/home" replace />}/>
        
        {/* Protected routes - require authentication */}
        <Route path='/home' element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }/>
        
        {/* Public routes - redirect to home if already logged in */}
        <Route path='/login' element={
          <PublicRoute>
            <Login/>
          </PublicRoute>
        }/>
        <Route path='/signup' element={
          <PublicRoute>
            <Register/>
          </PublicRoute>
        }/>
        <Route path='/register' element={
          <PublicRoute>
            <Register/>
          </PublicRoute>
        }/>
        
        {/* 404 route - catch all unmatched routes */}
        <Route path='*' element={<NotFoundPage />}/>
      </Routes>
    </ErrorBoundary>
  )
}

export default App;
