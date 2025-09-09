import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
    const baseURL = 'https://note-app-node-js.vercel.app/api/v1/'
    const navigate = useNavigate()
    
    const [user, setUser] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})

    const validateForm = () => {
        const errors = {}
        
        if (!user.email) {
            errors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            errors.email = "Please enter a valid email address"
        }
        
        if (!user.password) {
            errors.password = "Password is required"
        } else if (user.password.length < 6) {
            errors.password = "Password must be at least 6 characters"
        }
        
        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setUser(prev => ({ ...prev, [name]: value }))
        
        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: "" }))
        }
        
        // Clear general error when user starts typing
        if (error) {
            setError("")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }
        
        setIsLoading(true)
        setError("")
        
        try {
            console.log('Attempting login with:', { email: user.email, password: '***' });
            console.log('API URL:', baseURL + 'auth/login');
            
            const { data } = await axios.post(baseURL + 'auth/login', user, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            
            console.log('Login API Response:', data); // Debug log
            
            if (data.message && data.message.includes("success")) {
                localStorage.setItem("token", data.token)
                navigate('/home') // Navigate to home page
            } else {
                setError(data.message || 'Login failed. Please check your credentials.')
            }
        } catch (err) {
            console.error('Login Error:', err); // Debug log
            console.error('Error Response:', err.response); // Debug log
            
            if (err.response?.status === 401) {
                setError('Invalid email or password. Please check your credentials.')
            } else if (err.response?.status === 404) {
                setError('Login service not found. Please try again later.')
            } else if (err.response?.status >= 500) {
                setError('Server error. Please try again later.')
            } else if (err.code === 'NETWORK_ERROR' || !err.response) {
                setError('Network error. Please check your internet connection.')
            } else {
                setError(err.response?.data?.message || 'Login failed. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form" noValidate>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email Address <span className="required">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                            className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                            placeholder="Enter your email address"
                            disabled={isLoading}
                            autoComplete="email"
                            aria-describedby={validationErrors.email ? "email-error" : undefined}
                        />
                        {validationErrors.email && (
                            <div id="email-error" className="invalid-feedback">
                                {validationErrors.email}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password <span className="required">*</span>
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleInputChange}
                            className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                            placeholder="Enter your password"
                            disabled={isLoading}
                            autoComplete="current-password"
                            aria-describedby={validationErrors.password ? "password-error" : undefined}
                        />
                        {validationErrors.password && (
                            <div id="password-error" className="invalid-feedback">
                                {validationErrors.password}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`login-btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                        aria-label={isLoading ? "Signing in..." : "Sign in"}
                    >
                        {isLoading ? (
                            <>
                                <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <i className="fa fa-sign-in" aria-hidden="true"></i>
                                <span>Sign In</span>
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="alert" role="alert" aria-live="polite">
                            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                            {error}
                        </div>
                    )}

                </form>

                <div className="login-footer">
                    <p>
                        Don't have an account? 
                        <Link to="/signup" className="register-link">
                            Create one here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
