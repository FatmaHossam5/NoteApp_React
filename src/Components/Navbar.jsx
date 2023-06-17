import React from 'react';
import {Link} from 'react-router-dom'

export default function Navbar() {
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
            <a className="navbar-brand" href="/">Notes</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link to="signup" className="nav-link">Register</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="login" className="nav-link">Login</Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    </> 
  )
}
