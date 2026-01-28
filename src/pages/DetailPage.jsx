import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MdArrowBack, MdStar, MdFavorite, MdFavoriteBorder, MdPerson, MdImage } from 'react-icons/md'
import { tmdbApi } from '../services/tmdbApi.js'
import './DetailPage.css'

const DetailPage = () => {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await tmdbApi.getMovieDetails(id)
        setMovie(data)
      } catch (err) {
        setError('Failed to load movie details. Please try again.')
        console.error('Error loading movie details:', err)
      } finally {
        setLoading(false)
      }
    }

    const checkIfSaved = () => {
      const savedMovies = JSON.parse(localStorage.getItem('savedHorrorMovies') || '[]')
      setIsSaved(savedMovies.some(savedMovie => savedMovie.id === parseInt(id)))
    }

    loadMovieDetails()
    checkIfSaved()
  }, [id])

  const handleSaveMovie = () => {
    const savedMovies = JSON.parse(localStorage.getItem('savedHorrorMovies') || '[]')
    
    if (isSaved) {
      // Remove from saved
      const updatedMovies = savedMovies.filter(savedMovie => savedMovie.id !== movie.id)
      localStorage.setItem('savedHorrorMovies', JSON.stringify(updatedMovies))
      setIsSaved(false)
    } else {
      // Add to saved
      const movieToSave = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        overview: movie.overview,
        savedAt: new Date().toISOString()
      }
      savedMovies.push(movieToSave)
      localStorage.setItem('savedHorrorMovies', JSON.stringify(savedMovies))
      setIsSaved(true)
    }
  }

  if (loading) {
    return (
      <div className="detail-page">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading movie details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="detail-page">
        <div className="container">
          <div className="error-message">{error}</div>
          <Link to="/" className="back-link">
            <MdArrowBack className="back-icon" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="detail-page">
        <div className="container">
          <div className="error-message">Movie not found.</div>
          <Link to="/" className="back-link">
            <MdArrowBack className="back-icon" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const posterUrl = tmdbApi.getImageUrl(movie.poster_path)
  const backdropUrl = tmdbApi.getImageUrl(movie.backdrop_path)
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'
  const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A'
  const genres = movie.genres ? movie.genres.map(genre => genre.name).join(', ') : 'N/A'

  return (
    <div className="detail-page">
      {backdropUrl && (
        <div 
          className="backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="backdrop-overlay"></div>
        </div>
      )}
      
      <div className="container">
        <Link to="/" className="back-link">
          <MdArrowBack className="back-icon" />
          Back to Home
        </Link>
        
        <div className="movie-detail">
          <div className="movie-poster-large">
            {posterUrl ? (
              <img src={posterUrl} alt={movie.title} />
            ) : (
              <div className="no-poster-large">
                <MdImage className="no-image-icon-large" />
                <span>No Image</span>
              </div>
            )}
          </div>
          
          <div className="movie-info-detailed">
            <h1 className="movie-title-large">{movie.title}</h1>
            
            <div className="movie-meta">
              <span className="movie-year">{releaseYear}</span>
              <span className="movie-runtime">{runtime}</span>
              <span className="movie-rating">
                <MdStar className="star-icon" />
                {movie.vote_average.toFixed(1)}/10
              </span>
            </div>
            
            <div className="movie-genres">
              <strong>Genres:</strong> {genres}
            </div>
            
            <div className="movie-overview-detailed">
              <h3>Overview</h3>
              <p>{movie.overview || 'No overview available.'}</p>
            </div>
            
            <button 
              onClick={handleSaveMovie}
              className={`save-button ${isSaved ? 'saved' : ''}`}
            >
              {isSaved ? (
                <>
                  <MdFavorite className="save-icon" />
                  Saved to Collection
                </>
              ) : (
                <>
                  <MdFavoriteBorder className="save-icon" />
                  Save to Collection
                </>
              )}
            </button>
          </div>
        </div>
        
        {movie.credits && movie.credits.cast && movie.credits.cast.length > 0 && (
          <div className="cast-section">
            <h3>Cast</h3>
            <div className="cast-grid">
              {movie.credits.cast.slice(0, 8).map((actor) => (
                <div key={actor.id} className="cast-member">
                  <div className="cast-photo">
                    {actor.profile_path ? (
                      <img 
                        src={tmdbApi.getImageUrl(actor.profile_path)} 
                        alt={actor.name}
                      />
                    ) : (
                      <div className="no-photo">
                        <MdPerson className="person-icon" />
                      </div>
                    )}
                  </div>
                  <div className="cast-info">
                    <p className="actor-name">{actor.name}</p>
                    <p className="character-name">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailPage
