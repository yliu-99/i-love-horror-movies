import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './App.css'

import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import DetailPage from './pages/DetailPage.jsx'
import SavedMoviesPage from './pages/SavedMoviesPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

console.log("testing app")

// Stores current location
function AppLayout() {
  const location = useLocation();

  // Hide navbar based on location
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";



  return (
    
    <div className="App">
      {!isAuthRoute && <Navbar/>}

      <Routes>

        {/* Home Path */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />

        {/* App */}
        <Route path="/home" element={<HomePage/>} />
        <Route path="/movie/:id" element={<DetailPage/>} />
        <Route path="/saved" element={<SavedMoviesPage/>} />

        {/* Catch */}
        <Route path="*" element={<Navigate to="/login" replace />} />


      </Routes>

    </div>

  );

}

function App() {
  return(
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;