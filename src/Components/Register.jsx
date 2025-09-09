import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
    let baseURL='https://note-app-node-js.vercel.app/api/v1/'
    let navigate=useNavigate()
    const [user,setUser]=useState({"name":"","email":"","password":"","cPassword":""})
    const [error,setError]=useState("")
    const [isLoading,setIsLoading]=useState(false)
    const [validationErrors, setValidationErrors] = useState({})

    // Form validation function
    const validateForm = () => {
        const errors = {}
        
        if (!user.name.trim()) {
            errors.name = 'Name is required'
        } else if (user.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters'
        }
        
        if (!user.email.trim()) {
            errors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            errors.email = 'Please enter a valid email address'
        }
        
        if (!user.password) {
            errors.password = 'Password is required'
        } else if (user.password.length < 6) {
            errors.password = 'Password must be at least 6 characters'
        }
        
        if (!user.cPassword) {
            errors.cPassword = 'Confirm password is required'
        } else if (user.password !== user.cPassword) {
            errors.cPassword = 'Passwords do not match'
        }
        
        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    async function signUp(e){
        e.preventDefault()
        setError("")
        setValidationErrors({})
        
        if (!validateForm()) {
            return
        }
        
        setIsLoading(true)
        try {
            let {data}=await axios.post(baseURL+'auth/signup',user)
            
            if(data.message && data.message.includes("success")){
                navigate('/login')
            }else{
                setError(data.message || 'Registration failed')
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Registration endpoint not found. Please contact support.')
            } else if (err.response?.status === 500) {
                setError('Server error. Please try again later.')
            } else if (err.response?.data?.message) {
                setError(err.response.data.message)
            } else {
                setError('An error occurred. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    function getUser(e){
        const { name, value } = e.target
        setUser({...user, [name]: value})
        
        // Clear validation error for this field when user starts typing
        if (validationErrors[name]) {
            setValidationErrors({...validationErrors, [name]: ''})
        }
    }

    return (
        <div className="register-container">
            <div className="register-card">
                            <div className="register-header">
                                <h2 className="register-title">Create Account</h2>
                                <p className="register-subtitle">Join us to start taking notes</p>
                            </div>
                            
                            <form onSubmit={signUp} className="register-form" noValidate>
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">
                                        Full Name <span className="required">*</span>
                                    </label>
                                    <input 
                                        id="name"
                                        name="name" 
                                        type="text" 
                                        className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                                        value={user.name}
                                        onChange={getUser}
                                        placeholder="Enter your full name"
                                        disabled={isLoading}
                                        aria-describedby={validationErrors.name ? 'name_error' : undefined}
                                    />
                                    {validationErrors.name && (
                                        <div id="name_error" className="invalid-feedback">
                                            {validationErrors.name}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">
                                        Email Address <span className="required">*</span>
                                    </label>
                                    <input 
                                        id="email"
                                        name="email" 
                                        type="email" 
                                        className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                                        value={user.email}
                                        onChange={getUser}
                                        placeholder="Enter your email address"
                                        disabled={isLoading}
                                        aria-describedby={validationErrors.email ? 'email_error' : undefined}
                                    />
                                    {validationErrors.email && (
                                        <div id="email_error" className="invalid-feedback">
                                            {validationErrors.email}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="password" className="form-label">
                                            Password <span className="required">*</span>
                                        </label>
                                        <input 
                                            id="password"
                                            name="password" 
                                            type="password" 
                                            className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                                            value={user.password}
                                            onChange={getUser}
                                            placeholder="Create a strong password"
                                            disabled={isLoading}
                                            aria-describedby={validationErrors.password ? 'password_error' : undefined}
                                        />
                                        {validationErrors.password && (
                                            <div id="password_error" className="invalid-feedback">
                                                {validationErrors.password}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="cPassword" className="form-label">
                                            Confirm Password <span className="required">*</span>
                                        </label>
                                        <input 
                                            id="cPassword"
                                            name="cPassword" 
                                            type="password" 
                                            className={`form-control ${validationErrors.cPassword ? 'is-invalid' : ''}`}
                                            value={user.cPassword}
                                            onChange={getUser}
                                            placeholder="Confirm your password"
                                            disabled={isLoading}
                                            aria-describedby={validationErrors.cPassword ? 'cPassword_error' : undefined}
                                        />
                                        {validationErrors.cPassword && (
                                            <div id="cPassword_error" className="invalid-feedback">
                                                {validationErrors.cPassword}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        {error}
                                    </div>
                                )}
                                
                                <button 
                                    type="submit" 
                                    className={`btn btn-primary register-btn ${isLoading ? 'loading' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin me-2" aria-hidden="true"></i>
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-user-plus me-2"></i>
                                            Create Account
                                        </>
                                    )}
                                </button>
                                
                                <div className="register-footer">
                                    <p className="text-center">
                                        Already have an account? 
                                        <Link to="/login" className="login-link"> Sign in here</Link>
                                    </p>
                                </div>
                            </form>
            </div>
        </div>
    )
}
