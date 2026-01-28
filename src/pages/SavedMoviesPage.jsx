import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MdStar, MdImage, MdDelete, MdLocalMovies, MdClearAll } from 'react-icons/md'
import { FaSkull } from 'react-icons/fa'
import { tmdbApi } from '../services/tmdbApi.js'
import './SavedMoviesPage.css'

const SavedMoviesPage = () => {
  const [savedMovies, setSavedMovies] = useState([])

  useEffect(() => {
    loadSavedMovies()
  }, [])

  const loadSavedMovies = () => {
    const saved = JSON.parse(localStorage.getItem('savedHorrorMovies') || '[]')
    saved.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
    setSavedMovies(saved)
  }

  const removeMovie = (movieId) => {
    const updatedMovies = savedMovies.filter(movie => movie.id !== movieId)
    localStorage.setItem('savedHorrorMovies', JSON.stringify(updatedMovies))
    setSavedMovies(updatedMovies)
  }

  const clearAllMovies = () => {
    if (window.confirm('Are you sure you want to remove all saved movies?')) {
      localStorage.removeItem('savedHorrorMovies')
      setSavedMovies([])
    }
  }

  return (
    <div className="saved-movies-page">
      <div className="container">
        <header className="page-header">
          <h1>
            <FaSkull className="title-icon" />
            Your Horror Collection
          </h1>
          <p>Your saved scary movies collection</p>
        </header>

        {savedMovies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <MdLocalMovies className="empty-movie-icon" />
            </div>
            <h2>No saved movies yet</h2>
            <p>Start building your horror collection by saving movies from the home page!</p>
            <Link to="/" className="browse-button">
              <MdLocalMovies className="browse-icon" />
              Browse Horror Movies
            </Link>
          </div>
        ) : (
          <>
            <div className="collection-header">
              <div className="collection-info">
                <span className="movie-count">
                  {savedMovies.length} movie{savedMovies.length !== 1 ? 's' : ''} saved
                </span>
              </div>
              <button onClick={clearAllMovies} className="clear-all-button">
                <MdClearAll className="clear-all-icon" />
                Clear All
              </button>
            </div>

            <div className="saved-movies-grid">
              {savedMovies.map((movie) => (
                <SavedMovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onRemove={removeMovie}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const SavedMovieCard = ({ movie, onRemove }) => {
  const posterUrl = tmdbApi.getImageUrl(movie.poster_path)
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'
  const savedDate = new Date(movie.savedAt).toLocaleDateString()

  return (
    <div className="saved-movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-link">
        <div className="movie-poster">
          {posterUrl ? (
            <img 
              src={posterUrl} 
              alt={movie.title}
              loading="lazy"
            />
          ) : (
            <div className="no-poster">
              <MdImage className="no-image-icon" />
              <span>No Image</span>
            </div>
          )}
          <div className="movie-rating">
            <MdStar className="star-icon" />
            {movie.vote_average.toFixed(1)}
          </div>
        </div>
      </Link>
      
      <div className="movie-info">
        <Link to={`/movie/${movie.id}`} className="movie-title-link">
          <h3 className="movie-title">{movie.title}</h3>
        </Link>
        <p className="movie-year">{releaseYear}</p>
        <p className="saved-date">Saved on {savedDate}</p>
        <p className="movie-overview">
          {movie.overview && movie.overview.length > 100 
            ? `${movie.overview.substring(0, 100)}...` 
            : movie.overview || 'No overview available.'
          }
        </p>
        <button 
          onClick={() => onRemove(movie.id)}
          className="remove-button"
          title="Remove from collection"
        >
          <MdDelete className="remove-icon" />
          Remove
        </button>
      </div>
    </div>
  )
}

export default SavedMoviesPage
