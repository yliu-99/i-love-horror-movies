import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './App.css'

import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import DetailPage from './pages/DetailPage.jsx'
import SavedMoviesPage from './pages/SavedMoviesPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

import { AuthProvider, useAuth } from './auth/AuthContext.jsx'
import ProtectedRoute from "./auth/ProtectedRoute.jsx"

// Redirect logged-in users straight to home
function RedirectIfAuthed({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (user) return <Navigate to="/home" replace />;

  return children;
}

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
        <Route 
          path="/login" 
          element={
            <RedirectIfAuthed>
              <LoginPage/>
            </RedirectIfAuthed>
            } 
        />
        <Route 
          path="/register" 
          element={
            <RedirectIfAuthed>
              <RegisterPage/>
            </RedirectIfAuthed>
            } 
          />

        {/* App */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage/>
            </ProtectedRoute>
            } 
          />
        <Route 
          path="/movie/:id" 
          element={
            <ProtectedRoute>
              <DetailPage/>
            </ProtectedRoute>
            } 
          />
        <Route 
          path="/saved" 
          element={
            <ProtectedRoute>
              <SavedMoviesPage/>
            </ProtectedRoute>
          } 
        />

        {/* Catch */}
        <Route path="*" element={<Navigate to="/login" replace />} />


      </Routes>

    </div>

  );

}

function App() {
  return(
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;