import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MdMovie, MdHome, MdBookmark } from 'react-icons/md'

import { useAuth } from "../auth/AuthContext.jsx";

import './Navbar.css'

const Navbar = () => {
  const location = useLocation()

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout(e){
    e.preventDefault();
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <MdMovie className="logo-icon" />
          Horror Movies
        </Link>


        <ul className="nav-menu">
          {user ? (
            <div className="nav-user">
              Hello, <span className="nav-user-name">{user.username}</span>
            </div>

          ) : null }
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <MdHome className="nav-icon" />
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/saved" 
              className={`nav-link ${location.pathname === '/saved' ? 'active' : ''}`}
            >
              <MdBookmark className="nav-icon" />
              Saved Movies
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
