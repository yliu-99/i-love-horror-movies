import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import DetailPage from './pages/DetailPage.jsx'
import SavedMoviesPage from './pages/SavedMoviesPage.jsx'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<DetailPage />} />
          <Route path="/saved" element={<SavedMoviesPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
