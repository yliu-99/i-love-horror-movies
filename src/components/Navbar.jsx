import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MdMovie, MdHome, MdBookmark } from 'react-icons/md'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <MdMovie className="logo-icon" />
          Horror Movies
        </Link>
        <ul className="nav-menu">
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
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
