import React from 'react';
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate();
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("token");
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark modern-navbar">
        <div className="container">
          <Link className="navbar-brand modern-brand" to="/">
            <i className="fas fa-sticky-note me-2" aria-hidden="true"></i>
            <span>NoteApp</span>
          </Link>
          
          <button 
            className="navbar-toggler modern-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation menu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {isLoggedIn ? (
                // Show when user is logged in
                <>
                  <li className="nav-item">
                    <Link 
                      to="/home" 
                      className="nav-link modern-nav-link"
                      aria-label="Go to your notes"
                    >
                      <i className="fas fa-home me-2" aria-hidden="true"></i>
                      <span>My Notes</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button 
                      onClick={handleLogout}
                      className="nav-link modern-nav-link login-link"
                      aria-label="Sign out of your account"
                      style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      <i className="fas fa-sign-out-alt me-2" aria-hidden="true"></i>
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              ) : (
                // Show when user is not logged in
                <>
                  <li className="nav-item">
                    <Link 
                      to="/signup" 
                      className="nav-link modern-nav-link"
                      aria-label="Create a new account"
                    >
                      <i className="fas fa-user-plus me-2" aria-hidden="true"></i>
                      <span>Register</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      to="/login" 
                      className="nav-link modern-nav-link login-link"
                      aria-label="Sign in to your account"
                    >
                      <i className="fas fa-sign-in-alt me-2" aria-hidden="true"></i>
                      <span>Login</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </> 
  )
}
