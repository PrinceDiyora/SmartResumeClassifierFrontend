import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Homepage.css';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '../context/AuthContext';

export default function TopNav() {
  const { isAuthenticated } = useAuth();
  const linkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

  return (
    <header className="main-header">
      <div className="container">
        <div className="logo-container">
          <div className="logo-icon">
            <i className="fa-solid fa-rocket"></i>
          </div>
          <span className="logo-text">ResumeCraft AI</span>
        </div>

        <nav className="nav-menu">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/resume-builder" className={linkClass}>Builder</NavLink>
          <NavLink to="/role-predictor" className={linkClass}>Predictor</NavLink>
          <NavLink to="/analyzer" className={linkClass}>Analyzer</NavLink>
        </nav>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <ProfileDropdown />
          ) : null}
        </div>
      </div>
    </header>
  );
}


